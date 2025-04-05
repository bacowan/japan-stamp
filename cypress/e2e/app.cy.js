import { registerCommand } from 'cypress-wait-for-stable-dom'
import stamps from "../fixtures/stamps.json";
registerCommand()

describe('initial page view', () => {

  /*let mongod;
  before(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();
    const db = client.db();
    await db.collection('Stamps').insertMany(stamps);
  });

  after(async () => {
    await mongod.stop();
  });*/

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