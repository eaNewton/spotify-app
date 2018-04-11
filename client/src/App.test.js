import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { millisToMinutesAndSeconds } from './javascripts/functions'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it ('converts milliseconds to minutes and seconds', () => {
  expect(millisToMinutesAndSeconds(317024)).toBe('5:17');
  expect(millisToMinutesAndSeconds(276400)).toBe('4:36');
  expect(millisToMinutesAndSeconds(1000)).toBe('0:01');
})
