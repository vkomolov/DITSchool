///node_modules
import React from 'react';

//styles
import styles from './ContentItem.scss';

const ContentItem = ({ item }) => {
    if (item && Object.keys(item).length) {

        const heading = item.subheading
            ? <h3>{item.subheading}</h3>
            : null;

        const remark = item.remark
            ? <div className={styles.remarkCol}>
                <span className={styles.remark}>
                {item.remark}
              </span>
            </div>
            : null;

        let content = null;
        if (Array.isArray(item.p)) {
            content = item.p.map((item, index) => {
                return <p key={index}>{item}</p>
            });
        }
        if (Array.isArray(item.li)) {
            const liArr = item.li.map((item, index) => {
                return <li key={index}>{item}</li>
            });

            //console.log(liArr);
            content = (
                <ul>
                    {liArr}
                </ul>
            );
        }

        return (
            <div className={styles.topWrapper}>
                {remark}
                <div className={styles.contentWrapper}>
                    {heading}
                    {content}
                </div>
            </div>
        );

    } else {
        return null;
    }
};
export default ContentItem;