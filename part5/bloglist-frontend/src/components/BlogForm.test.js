import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  test('calls on submit', () => {
    const formArg = {
      title: 'The amazing title',
      author: 'Robert Testing',
      url: 'https://www.react.com/test'
    };
    const createBlog = jest.fn();
    const component = render(<BlogForm createBlog={createBlog} />);

    let input = component.getByLabelText('title');
    fireEvent.change(input, { target: { value: 'The amazing title' } });

    input = component.getByLabelText('author');
    fireEvent.change(input, { target: { value: 'Robert Testing' } });

    input = component.getByLabelText('url');
    fireEvent.change(input, {
      target: { value: 'https://www.react.com/test' }
    });

    const form = component.container.querySelector('form');
    fireEvent.submit(form);

    expect(createBlog.mock.calls.length).toBe(1);
    expect(createBlog.mock.calls).toEqual([[formArg]]);
    // Another way to put it
    // expect(createBlog.mock.calls[0][0]).toEqual(formArg);
  });
});
