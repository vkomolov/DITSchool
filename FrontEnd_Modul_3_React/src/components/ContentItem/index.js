///node_modules
import React from 'react';
import PropTypes from 'prop-types';

//styles
import styles from './ContentItem.scss';

/**@description it creates JSX object, with the data given;
 * it creates the mapped array of <span> elements from 'sdk.tags' array;
 * it marks <span> with additional styles if the filter value equals sdk.tags[n];
 * @reactProps {object} sdk; Contains: {string}:sdk.title, {array}:sdk.tags;
 * @reactProps {string} filter; Searching value for filtering innData
 * @return {object} JSX object with mapped array of 'ContentItem' components;
 * SDK Object and the filter value are sent by attributes to 'ContentItem';
 * */
const ContentItem = ({ sdk={}, filter }) => {

    return (
        <div className={styles.topWrapper}>
            <h4 className={styles.heading}>{ sdk.title }</h4>
            <div className={styles.tagsBlock}>
                {
                    sdk.tags.map((tag, index) => {
                        const spec = (tag.toLowerCase() === filter.toLowerCase())
                            ? `${styles.tag} ${styles.active}`
                            : styles.tag;
                        return (
                            <span key={index} className={spec}>{ tag }</span>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default ContentItem;
ContentItem.propTypes = {
    sdk: PropTypes.object.isRequired,
    filter: PropTypes.string
};