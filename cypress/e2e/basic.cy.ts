describe('empty spec', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('displays the resources text', () => {
    cy.get('h1')
    .contains('Logga in');
  })
})
