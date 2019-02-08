///node_modules
import React from 'react';

///components
import ContentItem from '../../components/ContentItem';

///styles
import styles from './ContentBar.scss';

const ContentBar = ({ attr }) => {
    const { filter, data } = attr;

    //console.log(attr.data);
    /**if data and data is the Object with the keys
     * */
    if (data && Object.keys(data).length){
        const contentData = data[filter].content;
        const heading = contentData.title;
        const contentBlock = contentData.details;
        const contentArr = contentBlock.map((item, index) => {
            return <ContentItem key={index} {...{item}}/>
        });

        //console.log(contentData);
        //console.log(contentBlock);

        return (
            <div className={styles.totalWrapper}>
                <h2>{ heading }</h2>
                {contentArr}
            </div>
        );
    }
    else return null;
};
export default ContentBar;