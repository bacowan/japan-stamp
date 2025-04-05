import { registerCommand } from 'cypress-wait-for-stable-dom'
//import { MongoMemoryServer } from 'mongodb-memory-server';
registerCommand()

const setLocationToTokyo = (win) => {
  // tokyo lat lon
  const longitude = 139.6500;
  const latitude = 35.6764;
  cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
    return cb({ coords: { latitude, longitude } });
  });
}

const setPrivacyPreferences = (win) => {
  win.localStorage.setItem('privacy-preferences', JSON.stringify({ use_location_data: true }));
}

describe('home page', () => {
  before(() => {
    return cy.task('initialize');
  });

  after(() => {
    return cy.task('clean');
  });

  describe('initial page view', () => {
    it('should show the privacy preferences dialog when no local storage is set', () => {
      cy.task('log', "test start");
      cy.visit('http://localhost:3000/');
      cy.get('[data-cy="consent-modal"]');
    });
    
    it('should not show the privacy preferences dialog when the privacy-preferences local storage is set', () => {
      cy.visit('http://localhost:3000/', {
        onBeforeLoad(win) {
          setPrivacyPreferences(win);
        }
      });
  
      cy.waitForStableDOM({ pollInterval: 200, timeout: 2000 });
  
      cy.get('[data-cy="consent-modal"]').should('not.exist');
    });
  });
  
  describe('stamp sorting', () => {
    it('should sort by most recent by default', () => {
      cy.visit('http://localhost:3000/', {
        onBeforeLoad(win) {
          setPrivacyPreferences(win);
          setLocationToTokyo(win);
        }
      });
      cy.get('[data-cy="sort-select"] [value="date"]')
        .should('have.attr', 'selected', 'selected');
      cy.get('[data-cy="stamp-list"]')
        .children()
        .eq(0)
        .should('contain', 'Aizuwakamatsu');
      cy.get('[data-cy="stamp-list"]')
        .children()
        .eq(1)
        .should('contain', 'Tokyo');
    })

    it('should sort by nearby when selected', () => {
      cy.visit('http://localhost:3000/', {
        onBeforeLoad(win) {
          setPrivacyPreferences(win);
          setLocationToTokyo(win);
        }
      });
      cy.get('[data-cy="sort-select"]')
        .select('nearby');
      //cy.url().should('include', '?sort=nearby');
      cy.get('[data-cy="stamp-list"]')
        .children()
        .eq(0)
        .should('contain', 'Tokyo');
      cy.get('[data-cy="stamp-list"]')
        .children()
        .eq(1)
        .should('contain', 'Aizuwakamatsu');
    })
  });
});