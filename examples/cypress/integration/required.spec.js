/* globals describe it cy */

describe('Required Example', () => {
  it('successfully loads', () => {
    cy.visit('/required');
    cy.get('form > button').click();
    cy.get('[data-cy=username-error]');
    cy.get('[data-cy=password-error]');

    cy.get('[name="username"]').type('foo');
    cy.get('[data-cy=username-error]').should('not.exist');
    cy.get('[name="password"]').type('bar');
    cy.get('[data-cy=username-password]').should('not.exist');

    cy.get('form > button').click();
    cy.contains(JSON.stringify({ username: 'foo', password: 'bar' }, null, 4));
  });
});
