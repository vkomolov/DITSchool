import React from 'react';
import PropTypes from 'prop-types';

///styles
import styles from './TaskBar.scss';

/**@description function; it maps the attributes of 'data' by:
 * - {string}: returns:
 *   <h3> if string === 'heading',
 *   <p> if string !== 'heading';
 * - {array}: returns <ul> list with mapped <li> elements;
 *   it gives spec styles to data.key === 'reqList'
 * @reactProps {object} data; it will be rendered by mapping the object`s attributes;
 * @return {array} Array of JSX objects with mapped attributes from 'data';
 * */
export const readyTask = ( data={} ) => {
    let obj2Arr = [];
    if (data && Object.keys(data).length) {
        obj2Arr = Object.keys(data).map((key, index) => {

            if ( typeof(data[key]) === "string") {
                if (key === "heading") {
                    return (
                        <h3 className={styles.heading} key={index}>
                            { data[key] }
                        </h3>
                    );
                }
                return (
                    <p className={styles.textBlock} key={index}>
                        { data[key] }
                    </p>
                );
            }
            else if (Array.isArray(data[key])) {
                const list = data[key].map((i, index) =>
                    <li key={index} className={styles.listItem}>{i}</li>
                );
                const spec = (key === "reqList")
                    ? `${styles.list} ${styles.spec}`
                    : styles.list;

                return (
                    <ul className={ spec } key={index}>
                        { list }
                    </ul>
                );
            }
        });
        return obj2Arr;
    }
};

readyTask.propTypes = {
    data: PropTypes.object
};