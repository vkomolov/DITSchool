///node_modules
import React from 'react';
import PropTypes from 'prop-types';

///components
import FilterBar from './index';

/**@description creates the array of unique tags from all SDK elements in 'innData' array,
 * sorts the tags` array and returns the 'FilterBar' Component with the tags` array
 * @reactProps {array} InnData; Array of SDK objects
 * @reactProps {string} filter; is set by the search and radio inputs.
 * @reactProps {function} setFilter; sets the state:filter of the Parent App
 * @return {element} React Element 'FilterBar' and {object}:data as attributes
 * */
const renderFilters = ({ innData, filter }, setFilter) => {
    let tags = [ "all" ]; //initial tag 'all' for the default filter

    if (innData && innData.length) {
        innData.forEach(item => {
            item.tags.forEach(tag => {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            });
        });
        tags.sort((a, b) => ( a.toLowerCase() < b.toLowerCase() ) ? -1 : 1);
    }

    /**@description it packs the attributes in one object to avoid
     * writing long attrs in JSX at the Component
     * */
    const data = {
        tags,
        filter,
        setFilter
    };

    return (
        <FilterBar {...{ data } }/>
    );
};
export default renderFilters;

renderFilters.propTypes = {
    innData: PropTypes.arrayOf(PropTypes.object),
    filter: PropTypes.string,
    setFilter: PropTypes.func
};
