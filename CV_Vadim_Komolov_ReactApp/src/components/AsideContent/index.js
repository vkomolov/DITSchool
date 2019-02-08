///node_modules
import React from 'react';

///components
import AsideItem from '../AsideItem';

//styles
import styles from './AsideContent.scss';

const AsideContent = ({ asideContent }) => {
    let contentArr = null;

    if (asideContent && Object.keys(asideContent).length) {

        contentArr = Object.keys(asideContent).map(key => {
            if (Array.isArray(asideContent[key])) {
                return asideContent[key].map((item, index) => {
                    return <AsideItem key={index}{...{ item }}/>;
                });
            } else {
                return null
            }
        });
    }

    return (
        <div className={styles.topWrapper}>
            {contentArr}
        </div>
    );
};
export default AsideContent;