import React, {Component} from 'react';
import './Plate.css';
import Task from '../../components/Task/Task';

export default class Plate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toDoArr: [
                "Make dinner tonight",
                "Fold the loundry",
                "Learn to make a React Person!"
            ]
        };
    }
    render() {
        const { toDoArr } = this.state;
        const taskArr = toDoArr.map((task, index) => {
            return <Task key={index} task={task} index={index} func={this.removeTask}/>
        });

        return (
            <div className="todo-plate">
                <h2>Please enter new Task</h2>
                <div className="input-wrapper">
                    <input
                        type="text"
                        maxLength={60}
                        className="todo-input"
                        ref={(ref) => this.ref = ref}
                    />
                    <button
                        className="button button_submit"
                        onClick={this.handleSubmit}
                    >
                        Submit
                    </button>
                </div>
                <div>
                    {taskArr}
                </div>
            </div>
        );
    }
    handleSubmit = () => {
        if (this.ref.value !== "") {
            const taskArr = [...this.state.toDoArr];
            taskArr.push(this.ref.value);
            this.setState({ toDoArr: taskArr });
            this.ref.value = "";
        }
    };

    removeTask = (key) => {
        let taskArr = [...this.state.toDoArr];
        taskArr.splice(key, 1);
        this.setState({toDoArr: taskArr});
    };
}