import React, {Component} from 'react';
import './Task.css';

export default class Task extends Component {
    constructor(props) {
        super(props);
        this.func = this.props.func;
        this.index = this.props.index;
    }
    render() {
        const{task} = this.props;

        return(
            <div className="task-wrapper">
                <button onClick={this.handleClick} className="button button_task">Remove</button>
                <span>{task}</span>
            </div>
        );
    }
    handleClick = () => {
        this.func(this.index);
    };
}