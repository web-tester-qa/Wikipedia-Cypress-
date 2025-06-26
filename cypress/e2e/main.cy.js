/// <reference types="cypress"/>

describe('Базовые функциональные проверки', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.fixture('main').as('mainData')
  })

  it('Страница успешно открывается и возвращает статус 200', () => {
    cy.request('/')
      .its('status')
      .should('eq', 200);
  });

  it('На странице присутствует корректный заголовок и слоган', function() {
    cy.get('.svg-Wikipedia_wordmark')
      .should('be.visible')
      .and('contain', this.mainData.projectName);
    cy.get('.localized-slogan')
      .should('be.visible')
      .and('contain', 'Свободная энциклопедия')
  });

  it('На странице присутствует корректный логотип', () => {
    cy.get('.central-featured-logo')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('match', /Wikipedia-logo-v2\.png/)
  });

  it('На странице отображается Топ языков', () => {
    cy.get('nav[aria-label="Top languages"]')
      .should('be.visible')
  });

  it('Топ языков содержит соответствующее количество элементов', function() {
    const expectedCount = this.mainData.topLanguages.length;
    
    cy.get('nav[aria-label="Top languages"]')
      .find('.link-box')
      .should('have.length', expectedCount);
  });

  it('Элементы Топ языков содержат корректные ссылки', function() {
    this.mainData.topLanguages.forEach((language) => {
      cy.contains('a', language.name)
        .should('have.attr', 'href', language.link);
    });
  });

  it('Проверка корректности перехода по ссылкам из Топ языков', function() {
    this.mainData.topLanguages.forEach(lang => {
      const fullUrl = `https:${lang.link}`; // Преобразуем относительный путь из файла фикстуры в 'https://'
      const domain = new URL(fullUrl).hostname;

      cy.get(`a[href="${lang.link}"].link-box`)
        .click();
      cy.origin(domain, { args: { domain } }, ({ domain }) => { // Передаем domain через args
        cy.url()
          .should('include', domain);
      });
      cy.visit('/'); // Более стабильный вариант возврата назад при кросс-доменных переходах
    });
  });

  it('На странице отображается форма Поиска с кнопкой', () => {
    cy.get('#search-form')
      .should('be.visible')
  })

});


describe('SEO тесты', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.fixture('main').as('seoData');
  });

  it('Страница содержит корректные SEO-теги', function() {
    const { seo } = this.seoData;

    cy.get('h1')
      .contains('span', seo.h1)
      .should('be.visible');
    cy.title()
      .should('eq', seo.title);
    cy.get('head meta[name="description"]')
      .should('have.attr', 'content')
      .and('contain', seo.description);
  });
  
});


describe('Проверка производительности (Performance Test)', () => {

  it('Время загрузки страницы не превышает оптимального значения', () => {
    const t = Date.now();
    cy.visit('/')
      .then(() => {
        const loadTime = Date.now() - t;
        const maxTime = 3000
        expect(loadTime).to.be.lessThan(maxTime, `Время загрузки страницы составило: ${loadTime} мс (максимально допустимое время: ${maxTime} мс)`);
      })
  })
})