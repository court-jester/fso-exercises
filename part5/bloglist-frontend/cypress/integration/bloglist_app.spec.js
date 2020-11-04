describe('Bloglist app', function () {
  beforeEach(function () {
    cy.request('DELETE', 'http://localhost:3003/api/testing/reset');

    const newUser = {
      name: 'Bob Alicon',
      username: 'testname',
      password: 'rightPass'
    };
    cy.request('POST', 'http://localhost:3003/api/users', newUser);
    // cy.request('POST', 'http://localhost:3003/api/users', {
    //   username: 'cyUser',
    //   password: 'rightPass'
    // }).then(function (response) {
    //   console.log(response);
    //   localStorage.setItem('loggedBlogUser', JSON.stringify(response.body));
    //   cy.visit('http://localhost:3000');
    // });
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
});
