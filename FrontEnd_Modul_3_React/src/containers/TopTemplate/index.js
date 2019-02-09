import React from 'react';
import PropTypes from 'prop-types';

//containers
import Header from '../../containers/Header';
import Footer from '../../containers/Footer';

//styles
import styles from './TopTemplate.scss';

/**@description comprises the Header and the Footer components
 * with the child element
 * @return JSX element
 * */
const TopTemplate = ({ children }) => {
    return (
        <div className={styles.totalWrapper}>
            <Header />
            {children}
            <Footer />
        </div>
    );
};

TopTemplate.propTypes = {
    children: PropTypes.element
};
export default TopTemplate;