import Style from './index.module.scss';
import React from 'react';
import { Route, Switch } from "react-router-dom";

class DefaultLayer extends React.Component {

    state = {

    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={Style.Component}>

                <div className={Style.Head} style={{ width: '100%', height: "200px", backgroundColor: 'gray' }}>
                    头部信息
                </div>
                <div>
                    {
                        <Switch>
                            {
                                this.props.children && this.props.children.map((item, index) => {
                                    return <Route key={index} path={item.path} exact={item.exact} render={props => {
                                        return <item.component {...props} {...item} />
                                    }} />
                                })
                            }
                        </Switch>
                    }
                </div>

            </div>
        )
    }

}

export default DefaultLayer;