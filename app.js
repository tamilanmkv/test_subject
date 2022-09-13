const puppeteer = require('puppeteer-extra');
const stealth = require('puppeteer-extra-plugin-stealth');
const BeautifulSoup = require('jssoup').default;


const browser = async() => {
    puppeteer.use(stealth());
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--executable-path=C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
            ]
            });
    const page = await browser.newPage();
    return [page,browser];
}

const getHtml = (htmlSource) => {
    Soup = new BeautifulSoup(htmlSource);
    return Soup;
}

const aTag = (Soup) => {
    const Aattr = Soup.findAll('a');
    return Aattr;
}

(async (url) =>{
    //get the page and browser from browser function
    const [page,browse] =await browser();
    await page.goto(url);
    await page.waitForTimeout(5000);
    const htmlSource = await page.content();
    const Soup = getHtml(htmlSource);
    const Aattr = aTag(Soup);
    console.log(Aattr);
    await browse.close();
})("https://www.google.com");

