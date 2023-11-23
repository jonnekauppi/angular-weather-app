describe('Application Running Test', () => {

  const appUrl = Cypress.env('devUrl');

  it('should be running on port 4200', () => {
    cy.visit(appUrl, { failOnStatusCode: false })
  });
});