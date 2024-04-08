import puppeteer, { Browser, Page } from "puppeteer-core";

export class UrlFaviconFinder {
  private browser!: Browser;
  private page!: Page;

  async initial() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    this.browser = browser;
    this.page = page;
  }

  public async find(url: string) {
    const urlObj = new URL(url);
    const rootUrl = `${urlObj.protocol}//${urlObj.host}`;

    let icoUrl = await this.find_by_default(rootUrl);
    if (icoUrl) {
      return icoUrl;
    }

    icoUrl = await this.find_by_selfOrigin(this.page, url);
    if (icoUrl) {
      return icoUrl;
    }
    icoUrl = await this.find_by_onlineminitools(
      this.page,
      'https://onlineminitools.com/website-favicon-downloader',
      url
    );
    if (icoUrl) {
      return icoUrl;
    }
    icoUrl = await this.find_by_freetoolsnetwork(
      this.page,
      'https://www.freetoolsnetwork.com/ToolsUI/Others/get-favicon-from-site.aspx',
      url
    );
    if (icoUrl) {
      return icoUrl;
    }
    return null;
  }

  public async close() {
    await this.browser.close();
  }

  private async find_by_default(rootUrl: string): Promise<string | null> {
    const finalUrl = `${rootUrl}/favicon.ico`;

    return finalUrl
  }

  private async find_by_selfOrigin(page: Page, rootUrl: string): Promise<string | null> {
    await page.goto(rootUrl, { timeout: 0 });
    await page.setViewport({ width: 1080, height: 1024 });

    const icoSelector = 'link[rel="shortcut icon"], link[rel="icon"]';
    const ico = await page.$(icoSelector);
    if (ico) {
      const icoUrl = await page.evaluate((el) => el.getAttribute('href'), ico);
      if (icoUrl) {
        return icoUrl;
      }
    }

    return null;
  }

  private async find_by_onlineminitools(page: Page, sourceUrl: string, url: string): Promise<string | null> {
    await page.goto(sourceUrl, { timeout: 0 });
    await page.setViewport({ width: 1080, height: 1024 });

    await page.type('input[placeholder="e.g: https://onlineminitools.com/"]', url);

    const searchResultSelector = 'button[title="Fetch"]';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    const textSelector = await page.waitForSelector('img[class="favicon-img"]');
    const imgUrl = await textSelector?.evaluate((el) => el.getAttribute('src'));

    if (imgUrl) {
      return imgUrl;
    } else {
      return null;
    }
  }

  private async find_by_freetoolsnetwork(page: Page, sourceUrl: string, url: string): Promise<string | null> {
    await page.goto(sourceUrl, { timeout: 0 });
    await page.setViewport({ width: 1080, height: 1024 });

    await page.type('#ContentPlaceHolder1_URLTextBox', url);

    const searchResultSelector = '#ContentPlaceHolder1_SubmitButton';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    const textSelector = await page.waitForSelector('#ContentPlaceHolder1_DefaultThumbnailImage');
    const imgUrl = await textSelector?.evaluate((el) => el.getAttribute('src'));

    if (imgUrl) {
      return imgUrl;
    } else {
      return null;
    }
  }
}
