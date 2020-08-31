/* globals describe it cy */

describe('Basic Example', () => {
  it('successfully loads', () => {
    cy.visit('/basic');
    cy.get('form > button').click();
    cy.contains('{}');

    cy.get('[name="username"]').type('foo');
    cy.get('form > button').click();
    cy.contains(JSON.stringify({ username: 'foo' }, null, 4));

    cy.get('[name="password"]').type('bar');
    cy.get('form > button').click();
    cy.contains(JSON.stringify({ username: 'foo', password: 'bar' }, null, 4));
  });
});
