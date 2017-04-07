import { Kevinphelps.MePage } from './app.po';

describe('kevinphelps.me App', () => {
  let page: Kevinphelps.MePage;

  beforeEach(() => {
    page = new Kevinphelps.MePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
