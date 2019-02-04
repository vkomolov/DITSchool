import React, { Component } from 'react';
import './App.css';
import Plate from '../Plate/Plate';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plateOpen: false
        }
    }

    render() {
        const { plateOpen } = this.state;

        return (
            <div className="app-wrapper">
                <h1>React Todos</h1>
                <button
                    className="button button_toDo"
                    onClick={() => this.setState({plateOpen: !this.state.plateOpen})}
                >
                    {!plateOpen ? "Open List" : "Close List"}
                </button>
                {
                  plateOpen && <Plate/>
                }
            </div>
        );
    }
}

export default App;
