import './App.css';
import React from 'react';
import Router from './Router';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router />
        )
    }

}

export default App;
