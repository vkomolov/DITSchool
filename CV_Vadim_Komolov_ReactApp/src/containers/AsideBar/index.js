///node_modules
import React from 'react';

///components
import AsideContent from '../../components/AsideContent';

///styles
import styles from './AsideBar.scss';

const AsideBar = ({ attr }) => {
    const { filter, setFilter } = attr;
    let fullName = null;
    let imageContainer = null;
    let sectionList = null;
    let asideContent = null;

    /**if data and data is the Object with the keys
     * */
    if (attr.data && Object.keys(attr.data).length) {

        let sections = Object.keys(attr.data).map(key => {
            if (key === "fullName") {
                fullName = (
                    <h1>{attr.data[key]}</h1>
                );
                return null;

            } else if (key === "creationDate")  {
                return null;

            } else if (key === "photo"){
                imageContainer = (
                    <div className={styles.imageContainer}>
                        <img src={attr.data[key]} alt="person" />
                    </div>
                );
                return null;

            } else {
                let specClass = (key === filter)
                    ? `${styles.sectionName} ${styles.specClass}`
                    : `${styles.sectionName} ${styles.toBeHovered}`;
                return (
                    <li key={key} className={specClass}
                        data-value={key} onClick={setFilter}
                    >
                        {key}
                    </li>
                );
            }
        });

        sectionList = (
            <ul className={styles.sectionList}>
                {sections}
            </ul>
        );

        asideContent = attr.data[filter].aside;
    }

    return (
        <div className={styles.asideBar}>
            {fullName}
            {imageContainer}
            {sectionList}
            <AsideContent {...{ asideContent }}/>
        </div>
    );
};
export default AsideBar;