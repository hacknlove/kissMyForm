/* globals describe it cy */

describe('Mutation Example', () => {
  it('formats phones', () => {
    cy.visit('/mutation');
    cy.get('[name=phone]')
      .type('123holapepe456moco789')
      .should('have.value', '(123)-456-789');
  });
  it('formats email', () => {
    cy.visit('/mutation');
    cy.get('[name=email]')
      .type('FOO@bar.com')
      .should('have.value', 'foo@bar.com');
  });
  it('formats email', () => {
    cy.visit('/mutation');

    cy.get('[name=phone]')
      .type('123holapepe456moco789')
      .should('have.value', '(123)-456-789');

    cy.get('[name=email]')
      .type('FOO@bar.com')
      .should('have.value', 'foo@bar.com');

    cy.get('form > button').click();

    cy.contains(JSON.stringify({ email: 'foo@bar.com', phone: '(123)-456-789' }, null, 4));
  });
});
