///node_modules
import React from 'react';
import PropTypes from 'prop-types';

///components
import ContentItem from "../ContentItem";

//styles
import styles from './ContentList.scss';

/**@description it gets already filtered array of the SDK Objects and maps it
 * to the array with the components 'ContentItem';
 * it sorts the 'sdkArr' array by array[n].title (a.title < b.title) before it is mapped
 * @reactProps {array} sdkArr; filtered array of the SDK Objects
 * @reactProps {string} filter; Searching value for filtering innData
 * @return {object} JSX object with mapped array of 'ContentItem' components;
 * SDK Object and the filter value are sent by attributes to 'ContentItem';
 * */
const ContentList = ({ data:{ sdkArr, filter } }) => {
    let renderSdk = [];
    if ( sdkArr && sdkArr.length ) {
        const sorted = [...sdkArr].sort((a, b) =>
            ( a.title < b.title ) ? -1 : 1);

        renderSdk = sorted.map(
            (sdk, index) => {
                return <ContentItem key={index} {...{ sdk } } {...{ filter }}/>
            }
        );
    }

    return (
        <div className={styles.topWrapper}>
            { renderSdk }
        </div>
    );
};
export default ContentList;
ContentList.propTypes = {
    sdkArr: PropTypes.arrayOf(PropTypes.object),
    filter: PropTypes.string
};