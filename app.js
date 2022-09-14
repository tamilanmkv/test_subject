const puppeteer = require('puppeteer-extra');
const stealth = require('puppeteer-extra-plugin-stealth');
const BeautifulSoup = require('jssoup').default;
const fs = require('fs');

const saveFile = (filename,data) => fs.appendFileSync(filename,data);

const browser = async() => {
    puppeteer.use(stealth());
    const browser = await puppeteer.launch({
        headless: false,
        executablePath:"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        args: [
           '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
           // '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
            ]
            });

    const page = await browser.newPage();
    return [page,browser];
}

const getHtml = (htmlSource) => new BeautifulSoup(htmlSource); 

const aTag =  (Soup) => Soup.findAll('a',{href:true});

const monsterLoop = async (urls,page,browse) => {
        urls.map(async (url) => {
            await page.goto(url);
            await page.waitForTimeout(1000);
            const htmlSource = await page.content();
            const Soup = getHtml(htmlSource);
            const aTags = aTag(Soup);
            aTags.map((aTag) => {
                const href = aTag.attrs.href;
                console.log(href);
            });
            await page.close();
    });
    browse.close();
}
let massLinks = new Set();
let urlLess = new Set();
(async (url) =>{
    
    //get the page and browser from browser function
    const [page,browse] =await browser();
    const response = await page.goto(url);
    const htmlSource = await page.content();
    const Soup = getHtml(htmlSource);
    let links = aTag(Soup);
    links
        .map((link) => 
            (link.attrs.href.startsWith("http")) 
                ?massLinks.add(link.attrs.href)
                :urlLess.add(url+link.attrs.href)
            );
    
    let ma = ['https://www.hackerone.com/terms','https://www.hackerone.com/privacy','https://www.hackerone.com/security']
    monsterLoop(ma,page,browse);
   
})("https://www.hackerone.com");

