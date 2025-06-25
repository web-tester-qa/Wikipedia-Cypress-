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

  it('Топ языков содержит 10 элементов', () => {
    cy.get('.link-box')
      .should('have.length', 10);
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

});


describe('SEO тесты', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Страница содержит h1, Title и Description', () => {
    cy.get('h1')
     .contains('span', 'Wikipedia')
     .should('be.visible');
    cy.title()
     .should('eq', 'Wikipedia');
   cy.get('head meta[name="description"]')
     .should('have.attr', 'content')
     .and('contain', 'Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.');
  });

});


describe('Проверка производительности (Performance Test)', () => {

  it('Время загрузки страницы не превышает оптимального значения', () => {
    const t = Date.now();
    cy.visit('/')
      .then(() => {
        const loadTime = Date.now() - t;
        expect(loadTime).to.be.lessThan(3000, `Время загрузки страницы составило: ${loadTime} мс (максимально допустимое время: 3000 мс)`);
      })
  })
})