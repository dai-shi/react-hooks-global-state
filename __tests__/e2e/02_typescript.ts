import puppeteer from 'puppeteer';

jest.setTimeout(15 * 1000);

describe('02_typescript', () => {
  const port = process.env.PORT || '8080';

  it('should work with events', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}/`);

    await page.click('div:nth-of-type(1) > button:nth-of-type(1)');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.click('div:nth-of-type(1) > button:nth-of-type(2)');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.click('div:nth-of-type(2) > button:nth-of-type(1)');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.click('div:nth-of-type(2) > button:nth-of-type(2)');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.type('div:nth-of-type(3) > div:nth-of-type(1) > input', '1');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.type('div:nth-of-type(3) > div:nth-of-type(2) > input', '2');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.type('div:nth-of-type(3) > div:nth-of-type(3) > input', '3');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.type('div:nth-of-type(4) > div:nth-of-type(1) > input', '4');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.type('div:nth-of-type(4) > div:nth-of-type(2) > input', '5');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await page.type('div:nth-of-type(4) > div:nth-of-type(3) > input', '6');
    expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

    await browser.close();
  });
});
