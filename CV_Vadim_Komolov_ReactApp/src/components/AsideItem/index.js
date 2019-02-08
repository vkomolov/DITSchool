///node_modules
import React from 'react';

///components
import GraphBlock from '../GraphBlock';

//styles
import styles from './AsideItem.scss';

const AsideItem = ({ item }) => {
    let heading = null;
    let content = null;

    if (item && Object.keys(item).length) {
        //console.log(item);

        heading = <h3>{item.title}</h3>;

        if (typeof item.details === "string") {
            content = <span >{item.details}</span>;
        }

        if (Array.isArray(item.details)) {
            content = item.details.map((data, index) => {

                return (
                    <div key={index}>
                        <span className={styles.subHeading} >
                            {data.title}
                        </span>
                        <GraphBlock score={data.details}/>
                    </div>
                );
            });
        }

    }

    return (
        <div className={styles.topWrapper}>
            {heading}
            {content}
        </div>
    );
};
export default AsideItem;