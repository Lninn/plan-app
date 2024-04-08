import { NextRequest } from "next/server";
import puppeteer, { Browser, Page } from "puppeteer-core";
import https from 'https';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  if (!query) {
    return fail('query field is required');
  }
  if (typeof query !== 'string') {
    return fail('query field must be a string');
  }

  let imageUrl: string | null = null;
  try {
    imageUrl = await fetchByDefault(query);
    if (imageUrl) {
      return Response.json({ ok: true, query, imgUrl: imageUrl, action: 'default' });
    }
  } catch (error) {
    // continue
  }

  let browser: Browser | undefined = undefined;
  try {
    browser = await puppeteer.launch({
      headless: true,
      channel: 'chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]
    });

    imageUrl = await fetchByHostPage(browser, query);
    if (imageUrl) {
      const isValid = await isImageValid(imageUrl);
      if (isValid) {
        return Response.json({ ok: true, query, imageUrl, action: 'hostPage' });
      }
    }

    const fetchResult = await fetchImgUrl(browser, query);

    return Response.json({ ok: true, query, imageUrl: fetchResult?.imgUrl, action: fetchResult?.action });
  } catch (error) {
    // console.log(error)

    if (error instanceof Error) {
      return fail(error.message)
    }

    return fail('server internal error')
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function fail(msg: string) {
  return Response.json({ ok: false, msg })
}

async function fetchByDefault(query: string): Promise<string | null> {
  const urlObj = new URL(query);
  const rootUrl = `${urlObj.protocol}//${urlObj.host}`;
  const finalUrl = `${rootUrl}/favicon.ico`;

  const isImage = await isImageValid(finalUrl);

  return isImage ? finalUrl : null;
}

async function fetchByHostPage(browser: Browser, query: string): Promise<string | null> {
  const hostPage = await browser.newPage();
  const urlObj = new URL(query);
  const rootUrl = `${urlObj.protocol}//${urlObj.host}`;
  await hostPage.goto(rootUrl, { timeout: 0 });
  await hostPage.setViewport({ width: 1080, height: 1024 });
  const faviconSelector = 'link[rel="shortcut icon"], link[rel="icon"]';
  const ico = await hostPage.$(faviconSelector);

  if (!ico) return null

  const icoUrl = await hostPage.evaluate((el) => el.getAttribute('href'), ico);
  return icoUrl ? rootUrl + icoUrl : null;
}

async function fetchImgUrl(browser: Browser, query: string): Promise<{ imgUrl: string; action: string } | null> {
  let imgUrl: string | null = null;

  const onlineminitoolsPage = await browser.newPage();
  await onlineminitoolsPage.goto('https://onlineminitools.com/website-favicon-downloader', { timeout: 0 });
  imgUrl = await fetchByonlineminitools(onlineminitoolsPage, query);
  if (imgUrl) return { imgUrl, action: 'onlineminitools' }

  const freetoolsnetworkPage = await browser.newPage();
  imgUrl = await fetchByfreetoolsnetwork(freetoolsnetworkPage, query)

  if (imgUrl) return { imgUrl, action: 'freetoolsnetwork' }
  return null;
}

async function fetchByfreetoolsnetwork(page: Page, query: string): Promise<string | null> {
  await page.goto('https://www.freetoolsnetwork.com/ToolsUI/Others/get-favicon-from-site.aspx', { timeout: 0 });

  const selectors = {
    typeSelector: '#ContentPlaceHolder1_URLTextBox"]',
    searchButtonSelector: '#ContentPlaceHolder1_SubmitButton',
    resultSelector: '#ContentPlaceHolder1_DefaultThumbnailImage',
  } satisfies WebScrapingSelectors;

  const imgUrl = await fetchImageFromSearchResult({
    page: page,
    selectors,
    query
  })

  return imgUrl ? imgUrl : null;
}

async function fetchByonlineminitools(page: Page, query: string): Promise<string | null> {
  await page.goto('https://onlineminitools.com/website-favicon-downloader', { timeout: 0 });

  const selectors = {
    typeSelector: 'input[placeholder="e.g: https://onlineminitools.com/"]',
    searchButtonSelector: 'button[title="Fetch"]',
    resultSelector: 'img[class="favicon-img"]',
  } satisfies WebScrapingSelectors;

  const imgUrl = await fetchImageFromSearchResult({
    page: page,
    selectors,
    query
  })

  return imgUrl ? imgUrl : null;
}

interface WebScrapingSelectors {
  typeSelector: string;
  searchButtonSelector: string;
  resultSelector: string;
}

interface WebScrapingTask {
  page: Page;
  selectors: WebScrapingSelectors;
  query: string;
}
async function fetchImageFromSearchResult(taskInfo: WebScrapingTask) {
  const {
    page,
    selectors: {
      typeSelector,
      searchButtonSelector,
      resultSelector,
    },
    query,
  } = taskInfo;

  await page.type(typeSelector, query);
  await page.waitForSelector(searchButtonSelector);
  await page.click(searchButtonSelector);
  const textSelector = await page.waitForSelector(resultSelector);
  const imgUrl = await textSelector?.evaluate((el) => el.getAttribute('src'));
  return imgUrl ? imgUrl : null;
}

/**
 * 判断给定的链接是否是有效的图片。
 *
 * @param url 图片链接
 * @returns 返回一个Promise，解析为true表示是有效图片，否则为false。
 */
async function isImageValid(url: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    https.get(url, (res) => {
      const contentType = res.headers['content-type'];

      // 检查Content-Type是否表示图片
      if (contentType && contentType.startsWith('image/')) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).on('error', (error) => {
      reject(error);
    });
  });
}
