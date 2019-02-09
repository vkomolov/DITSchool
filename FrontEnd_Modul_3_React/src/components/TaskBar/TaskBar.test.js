import React from 'react';
import ReactDOM from 'react-dom';

import TaskBar from './';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TaskBar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
