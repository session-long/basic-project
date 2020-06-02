import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Config from './RouterConfigHandler'
import { Provider } from 'mobx-react';
import Store from '../Store';

export default (props) => (
    <Provider {...Store}>
        <BrowserRouter>
            <Config />
        </BrowserRouter>
    </Provider>
);

/**
 * 异步加载组件
 */
export const asyncImportComponent = (component) => {

    class AsyncComponent extends React.Component {

        state = {
            instance: null
        }

        constructor(props) {
            super(props);
        }

        async componentDidMount() {
            const { default: instance } = await component;

            this.setState({ instance });
        }

        render() {
            const C = this.state.instance;
            return C ? <C {...this.props} /> : null;
        }

    }

    return AsyncComponent;

}
