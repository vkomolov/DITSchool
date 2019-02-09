import React, { Component } from 'react';
///components
import TaskBar from '../../components/TaskBar';
///initial Data, fetched from the Back
import { taskDetails } from '../../utils/initialData';
///styles
import styles from './Header.scss';

/**@description statefull, contains the state 'toggle' to render 'TaskBar' Component,
 * contains the state {object} state.taskData, which is given to the 'TaskBar' Component;
 * it toggles rendering 'TaskBar' component by the {boolean}:state.toggle;
 * it changes the value of 'switcher' <span> from "Close Details" to "Open Details"
 * @return JSX Object which contains the button to switch the state and render 'TaskBar';
 * */

class Header extends Component {
    /**@property {boolean} toggle; Can be set by 'toggleTask' func on click event
     * @property {object} taskData; Can be rendered by the 'TaskBar' Component
     * */
    state = {
        toggle: false,
        taskData: taskDetails
    };

    /**@description sets the State.toggle to invert boolean value
     * */
    toggleTask = () => {
        this.setState(
            (prSt) => ({
                toggle: !prSt.toggle
            })
        );
    };

    render() {
        const btnTitle = ( this.state.toggle ) ? "Close Details" : "Open Details";

        return (
            <div className={styles.headerWrapper}>
                <div className={styles.headingBlock}>
                    <h2 className={styles.heading}>Module Work #3 React App</h2>
                    <span className={styles.toggleTask}
                          onClick={ this.toggleTask }
                    >
                        {btnTitle}
                    </span>
                </div>
                <hr className={styles.hr} />
                {
                    this.state.toggle && <TaskBar taskData={ this.state.taskData }/>
                }
            </div>
        );
    }
}

export default Header;