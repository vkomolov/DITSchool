///node_modules
import React from 'react';
import PropTypes from 'prop-types';

//styles
import styles from './RadioBlock.scss';

/**@description stateless; it creates the input type:radio;
 * it creates id name from the tag value by replacing space in the String of tag value.
 * id name is necessary for the label attached;
 * it sets the Parent state.filter on 'change' event;
 * it marks the radio with additional styles if 'activeTag' is true;
 * @reactProps {object}:data with {string}:tag, {boolean}:activeTag, {func}:setFilter;
 * @return {object} JSX object with the input type:radio inside and the label for id
 * */
const RadioBlock = ({ data={} }) => {
    const { tag, activeTag, setFilter } = data;
    const tagId = tag.replace(/\s/g, '');

    return (
        <div className={styles.radioWrapper} >
            <input type="radio" name="filter"
                   id={ tagId } className={ styles.radio }
                   value={ tag }
                   onChange={ setFilter }
                   checked={ activeTag }
            />
            <div className={ styles.psRadio } />
            <label htmlFor={ tagId } className={ styles.label }>{ tag }</label>
        </div>
    );
};
export default RadioBlock;

RadioBlock.propTypes = {
    data: PropTypes.shape({
        tag: PropTypes.string,
        activeTag: PropTypes.bool,
        setFilter: PropTypes.func
    })
};
