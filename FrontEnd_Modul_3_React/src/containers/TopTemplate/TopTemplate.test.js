import React from 'react';
import { shallow } from 'enzyme';
///components
import TopTemplate from './';
import Header from '../Header';
import Footer from '../Footer';
import App from '../App';

let wrapped;

beforeEach(() => {
    wrapped = shallow(<TopTemplate><App /></TopTemplate>);
});

it("shows Header Component", () => {
    expect(wrapped.find(Header).length).toEqual(1);
});

it("shows Footer Component", ()=> {
    expect(wrapped.find(Footer).length).toEqual(1);
});

it('renders children when passed in', () => {
    expect(wrapped.contains(<App />)).toEqual(true);
});

