import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;
  let mockUpdate;
  let mockRemove;

  beforeEach(() => {
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 50,
      user: { username: 'Testname' }
    };
    mockUpdate = jest.fn();
    mockRemove = jest.fn();
    const username = 'Testname';

    component = render(
      <Blog
        blog={blog}
        updateBlog={mockUpdate}
        removeBlog={mockRemove}
        userName={username}
      />
    );
  });

  test("renders the blog's title and author", () => {
    expect(component.container).toHaveTextContent('React patterns');
    expect(component.container).toHaveTextContent('Michael Chan');
  });

  test('at the start the url and likes are not displayed', () => {
    const div = component.container.querySelector('.toggleableContent');

    expect(div).toHaveStyle('display: none');
  });

  test('after clicking view button, more information is displayed', () => {
    const button = component.getByText('view');
    fireEvent.click(button);

    const div = component.container.querySelector('.toggleableContent');
    expect(div).not.toHaveStyle('display: none');
  });

  test('after displaying more information, hide it again', () => {
    const button = component.getByText('view');
    fireEvent.click(button);

    const hideButton = component.getByText('hide');
    fireEvent.click(hideButton);

    const div = component.container.querySelector('.toggleableContent');
    expect(div).toHaveStyle('display: none');
  });

  test('calls the update event handler 2 times after clicking the like button 2 times', () => {
    const viewButton = component.getByText('view');
    fireEvent.click(viewButton);

    const likeButton = component.getByText('like');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockUpdate.mock.calls).toHaveLength(2);
  });
});
