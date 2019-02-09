///node_modules
import React from 'react';
import { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';

///containers
import TopTemplate from './containers/TopTemplate';
import App from './containers/App';
import { sdkArr } from './utils/initialData';

///styles
import './utils/global_styles/index.css';
import './utils/global_styles/reset.css';

/**@return React Element, which comprises the Header and the Footer components
 * inside of TopTemplate and the child App
 * */
render(
    <TopTemplate>
        <App {...{ sdkArr }}/>
    </TopTemplate>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
