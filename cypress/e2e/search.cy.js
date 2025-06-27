/// <reference types="cypress"/>

describe('Базовые проверки видимости и доступности', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Поле Поиск отображается на странице', () => {
    cy.get('#searchInput')
      .should('be.visible')
  });

  it('Кнопка Поиск отображается на странице', () => {
    cy.get('button.pure-button-primary-progressive')
      .should('be.visible')
      .and('contain', 'Search');
  });

  it('Поле Поиск содержит языковой селектор', () => {
    cy.get('.styled-select')
      .should('be.visible');
  });

  it('Поле Поиск доступно к вводу запроса', () => {
    cy.get('#searchInput')
      .should('be.enabled')
      .and('have.value', '');
  });

})