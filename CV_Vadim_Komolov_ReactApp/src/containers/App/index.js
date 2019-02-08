///node_modules
import React, { Component } from 'react';

///components
import AsideBar from '../../containers/AsideBar';
import ContentBar from '../../containers/ContentBar';

///utils
import { getFetch } from '../../utils/services';

///styles
import styles from './App.scss';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            filter: "personal",
            data: {}
        };
        this.storageName = "cv";
    }

    initFetch = ( storageName ) => {
        getFetch(storageName)
            .then(
                data => {
                    data.creationDate = new Date();

                    localStorage.setItem(storageName, JSON.stringify(data));
                    this.setState(
                        {
                            error: null,
                            data,
                        }
                    );
                },
                error => {
                    this.setState(
                        {
                            error,
                            data: null
                        }
                    );
                }
            );
    };

    /**@description checks out the localStorage and fetches the data if
     * the localStorage with the name 'storageName' does not exist;
     * */
    componentDidMount() {
        const storage = localStorage.getItem(this.storageName);

        if ( storage ) {
            const data = JSON.parse(storage);
            const creationDate = new Date(data.creationDate);
            const currentDate = new Date();

            /**the creationDate expires in 1 day
             * */
            if (((currentDate - creationDate)/1000/60/60/24) < 1) {
                this.setState(
                    {
                        error: null,
                        data
                    }
                );
            } else {
                setTimeout(() => { ///fetching time imitation
                    this.initFetch(this.storageName);
                }, 1000);
            }
        }
        else {
            setTimeout(() => { ///fetching time imitation
                this.initFetch(this.storageName);
            }, 1000);
        }
    }

    setFilter = ({ target }) => {
        this.setState({
            filter: target.dataset.value
        });
    };

    render() {
        const attr = {
            ...this.state,
            setFilter: this.setFilter
        };

        return (
            <div className={styles.totalWrapper}>
                <AsideBar {...{ attr }} />
                <ContentBar {...{ attr }} />
            </div>
        );
    }
}
export default App;