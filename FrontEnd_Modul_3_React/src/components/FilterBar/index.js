///node_modules
import React from 'react';
import PropTypes from 'prop-types';

///components
import SearchInput from '../SearchInput';
import RadioBlock from '../RadioBlock';

///styles
import styles from './FilterBar.scss';

/**@description stateless; it maps the array of unique tags
 * to {array}:'tagsArr' with 'RadioBlock' components;
 * it creates {boolean}: activeTag to equal the 'tag' value with the 'filter' value and
 * sends it to 'RadioBlock' in attributes (data.activeTag).
 * @reactProps {array}: data.tags; array of unique tags
 * @reactProps {string}: filter; value of the filter
 * @reactProps {func}: setFilter; method to change the Parent state.filter
 * @return JSX object with Components: 'SearchInput', array of 'RadioBlock's
 * */
const FilterBar = ({ data:{ tags=[], filter, setFilter } }) => {

    const tagsArr = [...tags].map((tag, index) => {
        const activeTag = (tag.toLowerCase() === filter.toLowerCase());

        /**@description it packs the attributes in one object to avoid
         * writing long attrs in JSX at the Component
         * */
        const data = {
            tag,
            activeTag,
            setFilter
        };

        return <RadioBlock key={ index } {...{ data }}/>
    });

    return (
        <div className={styles.topWrapper}>
            <SearchInput {...{ setFilter }}/>
            { tagsArr }
        </div>
    );
};
export default FilterBar;

FilterBar.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.object),
    filter: PropTypes.string,
    setFilter: PropTypes.func
};