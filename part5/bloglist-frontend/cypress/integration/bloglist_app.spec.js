describe('Bloglist app', function () {
  beforeEach(function () {
    // Clear all stored data
    cy.request('DELETE', 'http://localhost:3003/api/testing/reset');

    // A custom command could be used to create an user
    const newUser = {
      name: 'Bob Alicon',
      username: 'testname',
      password: 'rightPass'
    };
    cy.request('POST', 'http://localhost:3003/api/users', newUser);

    const secondUser = {
      name: 'the non creator',
      username: 'noCreator',
      password: 'passw'
    };
    cy.request('POST', 'http://localhost:3003/api/users', secondUser);

    cy.visit('http://localhost:3000');
  });

  it('Login form is show', function () {
    cy.contains('log in to application');
    cy.get('form').should('be.visible');
    cy.get('button').should('have.text', 'login');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input#username')
        .type('testname')
        .should('have.value', 'testname');

      cy.get('input#password')
        .type('rightPass')
        .should('have.value', 'rightPass');

      cy.get('#login-button').click();

      cy.get('html').should('contain', 'testname logged in');
    });

    it('fails with wrong credentials', function () {
      cy.get('input#username').type('wrongname');
      cy.get('input#password').type('wongpassword');
      cy.get('#login-button').click();

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)');

      cy.get('html').should('not.contain', 'testname logged in');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testname',
        password: 'rightPass'
      }).then(function (response) {
        localStorage.setItem('loggedBlogUser', JSON.stringify(response.body));
        cy.visit('http://localhost:3000');
      });
    });

    it('a new blog can be created', function () {
      cy.get('div > button').contains('new blog').click();

      cy.get('input#title').type('Testing with Cypress');
      cy.get('input#author').type('McManaman');
      cy.get('input#url').type('http://cypress.com/');
      cy.get('#blog-button').click();

      cy.get('.success')
        .should(
          'contain',
          'A new blog titled "Testing with Cypress" by McManaman has been added'
        )
        .should('have.css', 'color', 'rgb(0, 128, 0)');

      cy.contains('Testing with Cypress McManaman');
    });

    describe('and when blogs already exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'First blog',
          author: 'First author',
          url: 'https://firsturl.com'
        });
        cy.createBlog({
          title: 'Second blog',
          author: 'Second author',
          url: 'https://secondurl.com'
        });
        cy.createBlog({
          title: 'Third blog',
          author: 'Third author',
          url: 'https://thirdurl.com'
        });
      });

      it('a specific blog can be liked', function () {
        // By its title
        cy.contains('Second blog')
          .contains('view')
          .click()
          .parent()
          .find('button')
          .contains('like')
          .click();

        // From 0 to 1 like
        cy.contains('Second blog').should('contain', 1);
      });

      it('a specific blog can be deleted by the owner', function () {
        // By its title
        cy.contains('Second blog')
          .contains('view')
          .click()
          .parent()
          .find('button')
          .contains('remove')
          .click();

        cy.get('html').should('not.contain', 'Second blog');
      });

      it("a specific blog can not be deleted by a user who didn't create it", function () {
        // testname user logs out
        cy.contains('logout').click();
        cy.login({ username: 'noCreator', password: 'passw' });

        cy.contains('Second blog')
          .contains('view')
          .click()
          .parent()
          .find('button')
          .should('not.contain', 'remove');
      });

      it('blogs are descending ordered according to likes', function () {
        // Give two likes to the blog titled "Second blog"
        cy.get('#blogs')
          .contains('Second blog')
          .contains('view')
          .click()
          .parent()
          .find('button')
          .contains('like')
          .click()
          .click();

        // Give 4 likes to the blog titled "Third blog"
        cy.get('#blogs')
          .contains('Third blog')
          .contains('view')
          .click()
          .parent()
          .find('button')
          .contains('like')
          .click()
          .click()
          .click()
          .click();

        cy.contains('Second blog').should('contain', 2);
        cy.contains('Third blog').should('contain', 4);

        // It is unnecessary to hide them, but it will simulate as if they weren't modified recently
        cy.contains('Second blog').contains('hide').click();
        cy.contains('Third blog').contains('hide').click();
        // cy.get('#blogs').contains('First blog').contains('view').click();

        // Get all the blogs
        cy.get('#blogs')
          .children()
          .then($blogs => {
            // Need to copy the array, because sort changes and returns the sorted array, not a copy
            const actual = $blogs.slice();
            // Descending sort by number of likes
            const sortedBlogs = actual.sort((a, b) => {
              return (
                // Get only the number of likes from each blog
                Number(b.innerText.replace(/[^\d]/g, '')) -
                Number(a.innerText.replace(/[^\d]/g, ''))
              );
            });
            cy.wrap($blogs).should('deep.eq', sortedBlogs);
          });
      });
    });
  });
});
