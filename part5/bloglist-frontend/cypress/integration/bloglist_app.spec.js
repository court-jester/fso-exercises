describe('Bloglist app', function () {
  beforeEach(function () {
    cy.request('DELETE', 'http://localhost:3003/api/testing/reset');
    cy.visit('http://localhost:3000');
  });
  it('Login form is show', function () {
    cy.contains('log in to application');
    cy.get('form').should('be.visible');
    cy.get('button').should('have.text', 'login');
  });
});
