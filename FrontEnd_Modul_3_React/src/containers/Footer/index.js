import React from 'react';

///styles
import styles from './Footer.scss';

/**@description it contains the JSX block of the personal info;
 * it contains the link with target="_blank" reference;
 * rel="noopener noreferrer" is used to prevent new Tab window.openner from direct
 * reference to parent window object
 * (security issues: https://mathiasbynens.github.io/rel-noopener/)
 * */
const Footer = () => {
    return (
        <div className={styles.footerWrapper}>
            <div className={styles.personBlock}>

                <div className={styles.prsImage} />
                <div className={styles.info}>
                    <span className={styles.person}>Vadim Komolov</span>
                    <a href="https://deutscheitschule.de/"
                       rel="noopener noreferrer" target="_blank"
                    >
                        DITS Deutsche IT-Schule
                    </a>
                    <span>group: DITS#5</span>
                    <span className={styles.email}>email: vkomolov1974@gmail.com</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;