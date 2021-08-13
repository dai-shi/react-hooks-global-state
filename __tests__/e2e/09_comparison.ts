import puppeteer from 'puppeteer';

jest.setTimeout(15 * 1000);

let base = '';
let page: puppeteer.Page;

const run = async () => {
  await page.click(`${base}div:nth-of-type(1) > button:nth-of-type(1)`);
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.click(`${base}div:nth-of-type(1) > button:nth-of-type(2)`);
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.click(`${base}div:nth-of-type(2) > button:nth-of-type(1)`);
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.click(`${base}div:nth-of-type(2) > button:nth-of-type(2)`);
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(3) > div:nth-of-type(1) > input`, '1');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(3) > div:nth-of-type(2) > input`, '2');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(3) > div:nth-of-type(3) > input`, '3');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(4) > div:nth-of-type(1) > input`, '4');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(4) > div:nth-of-type(2) > input`, '5');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();

  await page.type(`${base}div:nth-of-type(4) > div:nth-of-type(3) > input`, '6');
  expect(await page.evaluate(() => document.body.innerHTML)).toMatchSnapshot();
};

describe('09_comparison', () => {
  const port = process.env.PORT || '8080';

  it('should work with events', async () => {
    const browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`http://localhost:${port}/`);

    base = 'body > div > div > div:nth-of-type(1) > ';
    await run();

    base = 'body > div > div > div:nth-of-type(2) > ';
    await run();

    await browser.close();
  });
});
