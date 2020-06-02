import axios from 'axios'
import Token from './Token';
import API_CODE from './Code';

const Axios = axios.create({
    baseURL: '/api',
    timeout: 30000
})

Axios.interceptors.request.use(
    config => {
        // loading 动画
        // token 重定向
        // 后端需求是否序列化
        return config
    },
    error => {
        console.log('request:', error)
        // loading 关闭
        // 请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
            console.log('timeout')
            // return service.request(originalRequest);//例如再重复请求一次
        }
        // 需要重定向到错误页面
        const errorInfo = error.response;
        console.log(errorInfo)
        if (errorInfo) {
            // error =errorInfo.data//页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
            const errorStatus = errorInfo.status; // 404 403 500 ... 等
            console.log(41, errorStatus)
        }
        return Promise.reject(error)
    }
)

Axios.interceptors.response.use(response => {
    let data;
    if (response.data === undefined) {
        data = response.request.responseText
    } else {
        data = response.data
    }

    // 根据返回的code值来做不同的处理（和后端约定）
    switch (data.code) {
        case API_CODE.SUCCESS:
            break;
        default:
            // 请求异常逻辑
            Notification.open({
                key: 'other',
                message: '发生错误',
                description: data.msg,
            });
            return Promise.reject()
    }
    return data
}, error => {
    // loading 关闭
    // 请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        Notification.open({
            message: '请求超时',
            description: '请检查网络或者稍后再试',
        });
        // return service.request(originalRequest);//例如再重复请求一次
    }

    if (error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '请求错误'
                break
            case 403:
                error.message = '拒绝访问'
                break

            case 404:
                error.message = `请求地址出错: ${error.response.config.url}`
                break

            case 408:
                error.message = '请求超时'
                break

            case 500:
                error.message = '服务器内部错误'
                break
            default:
        }
        Notification.open({
            key: error.response.status,
            message: '发生错误',
            description: error.message,
        });
    }

    return Promise.reject(error)
})

export default class API {

    static CONTENT_TYPE = {
        JSON: 'application/json;',
        FORM: 'application/x-www-form-urlencoded; charset=UTF-8',
        UPLOAD: 'upload',
    }

    static HTTP_METHOD = {
        GET: 'get',
        POST: 'post',
    }

    static API_CODE = [...API_CODE];
    
    static Token = {...Token};

    static config = (httpMethod, url, params) => {
        return new API(httpMethod, url, params);
    }

    static get = (url, params) => {
        return this.config(this.HTTP_METHOD.GET, url, params);
    }

    static post = (url, params) => {
        return this.config(this.HTTP_METHOD.POST, url, params);
    }

    _content_type = null;

    _http_method = null;

    _url = null;

    _params = null;

    _t = null;

    _is_need_token = false;

    constructor(httpMethod = null, url = null, params = null, t = new Date().getTime()) {
        this._content_type = CONTENT_TYPE.FORM;
        this._url = url;
        this._http_method = httpMethod;
        this._params = params;
        this._t = t;
    }

    get contentType() {
        return this._content_type;
    }

    get url() {
        return this._url;
    }

    get params() {
        return this._params;
    }

    contentType = (type) => {
        this._content_type = type;
        return this;
    }

    auth = () => {
        this._is_need_token = true;
        return this;
    }

    commit = (timeout = 10 * 1000) => {
        if (this._is_need_token && !Token.getToken()) {
            console.error('令牌不存在或已失效');
            return;
        }

        const Authorization = this._is_need_token ? { 'Authorization': Token.getToken() } : {};
        let commonData = this.commonData ? { _t: this._t, } : {};

        let axios = Axios({
            method: this._http_method,
            url: this._url,
            data: (this._content_type === CONTENT_TYPE.JSON) ? { ...commonData, ...this._params } : JSON.stringify({ ...commonData, ...this._params }),
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': this._content_type,
                cetcClientType: 'Web',
                ...Authorization
            }
        })

        setTimeout(() => {
            this = null;
        }, timeout);
        return axios;
    }

}
