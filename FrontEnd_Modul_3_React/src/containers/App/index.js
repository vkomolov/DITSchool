///node_modules
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//components
import renderFilters from '../../components/FilterBar/renderFilters';
import filterData from '../../components/ContentList/filterData';

///styles
import styles from './App.scss';

/**@description statefull, it contains the state which is sent to the child Components:
 * - FilterBar, which is rendered through renderFilters {func};
 * - ContentList, which is rendered through filterData {func};
 * @reactProps {array} sdkArr; Array of SDK objects
 * @return {object} JSX object with the functions which render Components:
 * - renderFilters(): FilterBar (column of all filters which are generated
 * from the initial data)
 *
 * - filterData(): ContentList (column which contains the rendered SDK items, filtered)
 * */
class App extends Component {
    /**@property {array} innData; is taken from the props
     * @property {string} filter; is set by the search and radio inputs.
     * */
    state = {
        innData: this.props.sdkArr,
        filter: "all"
    };

    static defaultProps = {
        sdkArr: []
    };

    /**@description Function sets the state: filter by e.target values on inputs
     * @param {Event} target; Reference to the input value, on 'change' event
     * */
    setFilter = ({ target }) => {
        const filter = target.value.trim();

        if ( filter.length ) {
            this.setState({
                filter
            });
        } else {
            this.setState({
                filter: "all"
            });
        }
    };

    render() {
        const data = {
            innData: this.state.innData,
            filter: this.state.filter
        };
        return (
            <div className={styles.totalWrapper}>
                <div className={styles.filterBar}>
                    { renderFilters( data, this.setFilter ) }
                </div>
                <div className={styles.contentBlock}>
                    { filterData( data ) }
                </div>
            </div>
        );
    }
}
export default App;

App.propTypes = {
    sdkArr: PropTypes.arrayOf(PropTypes.object).isRequired
};