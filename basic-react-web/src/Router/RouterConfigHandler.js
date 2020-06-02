import React from "react";
import { Route, Switch } from "react-router-dom";
import config from './config';
import WrappedComponent from './without';

class RouterConfigHandler extends React.Component {

    state = {

    }

    constructor(props) {
        super(props);
    }

    //组件被销毁之前重写setState方法 不对状态做任何改变
    componentWillUnmount() {
        this.setState = () => { return };
    }

    render() {
        const { config } = this.props;
        return (
            <div>
                <WrappedComponent wrappedComponentRef={c => this.component = c} />
                {
                    <Switch>
                        {
                            config.map((item, index) => {
                                return <Route key={index} path={item.path} exact={item.exact} render={props => {
                                    return <item.component {...props} {...item} />
                                }} />
                            })
                        }
                    </Switch>
                }
            </div>
        );
    }

}

RouterConfigHandler.defaultProps = {
    config: config
};

export default RouterConfigHandler