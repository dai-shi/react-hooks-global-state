import puppeteer from 'puppeteer';

jest.setTimeout(15 * 1000);

describe('04_fetch', () => {
  const port = process.env.PORT || '8080';

  it('should work with events', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}/`);

    await page.waitForSelector('button');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.click('button');
    await page.waitForSelector('button');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.click('button');
    await page.waitForSelector('button');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await browser.close();
  });
});
