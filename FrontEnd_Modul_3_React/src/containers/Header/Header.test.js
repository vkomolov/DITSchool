import React from 'react';
import { shallow } from 'enzyme';

///components
import Header from './';
import TaskBar from '../../components/TaskBar';

let wrapped;

beforeEach(() => {
    wrapped = shallow(<Header />);
});

it("shows heading tag h2", () => {
    expect(wrapped.find("h2").length).toEqual(1);
});

it("shows heading tag 'span'", () => {
    expect(wrapped.find("span").length).toEqual(1);
});