import { registerCommand } from 'cypress-wait-for-stable-dom'
registerCommand()

describe('initial page view', () => {
    it('should show the privacy preferences dialog when no local storage is set', () => {
      cy.visit('http://localhost:3000/');
      cy.get('[data-cy="consent-modal"]');
    });
    
    it('should not show the privacy preferences dialog when the privacy-preferences local storage is set', () => {
      cy.visit('http://localhost:3000/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('privacy-preferences', JSON.stringify({ locationData: true }));
        }
      });

      cy.waitForStableDOM({ pollInterval: 200, timeout: 2000 });

      cy.get('[data-cy="consent-modal"]').should('not.exist');
    });
  });