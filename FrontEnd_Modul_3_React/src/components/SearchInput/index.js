///node_modules
import React from 'react';
import PropTypes from 'prop-types';

//styles
import styles from './SearchInput.scss';

/**@description stateless; it creates input type:text,
 * which sets the Parent state: filter with the props method 'setFilter';
 * it sets the input value to "" on 'blur' event, still the state:filter stays changed *
 * @reactProps {func}: setFilter; Parent method to set the Parent state.filter
 * @return {object} JSX object with the input element inside
 * */
const SearchInput = ({ setFilter }) => {
    const blur = ({ target }) => {
        target.value = "";
    };
    return (
        <div className={styles.inputWrapper}>
            <input type="text" maxLength={ 15 }
                   placeholder="Search..."
                   onInput={ setFilter }
                   onBlur={ blur }
            />
        </div>
    );
};

export default SearchInput;
SearchInput.propTypes = {
    setFilter: PropTypes.func
};