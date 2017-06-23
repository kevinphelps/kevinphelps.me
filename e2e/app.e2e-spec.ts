import { HomePage } from './app.po';

describe('home page', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();

    page.getParagraphText()
      .then(text => { expect(text).toEqual('app works!'); });
  });
});
