///node_modules
import React from 'react';
import PropTypes from 'prop-types';

///components
import ContentList from './index';

/**@description filters 'innData': Array of Objects to contain the Filter value
 * in the item.tags: Array
 * if Filter value === 'all', then all items are passed.
 * @reactProps {array} innData; Array of the SDK Objects
 * @reactProps {string} filter; Searching value for filtering innData
 * @return {element} ContentList Component and {object}:data as attributes
 * */
const filterData = ({ innData=[], filter }) => {

    const sdkArr = innData.filter(item => {
        return (filter === "all")
            ? item
            : item.tags.some(tag => {
                return tag.toLowerCase().search(filter.toLowerCase()) !== -1;
            });
    });

    /**@description it packs the attributes in one object to avoid
     * writing long attrs in JSX at the Component
     * */
    const data = {
        sdkArr,
        filter
    };

    return <ContentList { ...{ data } } />;
};
export default filterData;

filterData.propTypes = {
    innData: PropTypes.arrayOf(PropTypes.object),
    filter: PropTypes.string
};