import React from 'react';
import { shallow } from 'enzyme';

///components
import Footer from './';

it("renders without crashing", () => {
    shallow(<Footer/>);
});