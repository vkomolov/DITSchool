import React from 'react';
import PropTypes from 'prop-types';
import { readyTask } from "./readyTask";

///styles
import styles from './TaskBar.scss';

/**@description stateless, it creates JSX object, with the data given;
 * {object}: props.taskData is passed to 'readyTask' function
 * @reactProps {object} taskData; it will be rendered by 'readyTask';
 * @return {object} JSX object with the return of the function 'readyTask'.
 * */
const TaskBar = ({ taskData={} }) => {
    return (
        <div className={styles.taskBar}>
            <div className={styles.innerBlock}>
                { readyTask( taskData ) }
            </div>
        </div>
    );
};
export default TaskBar;

TaskBar.propTypes = {
    taskData: PropTypes.object
};