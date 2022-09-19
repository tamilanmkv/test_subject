const puppeteer = require('puppeteer-extra');
const stealth = require('puppeteer-extra-plugin-stealth');
const BeautifulSoup = require('jssoup').default;
const fs = require('fs');


let massLinks = new Set();
let urlLess = new Set();
let TempLinks = new Set();
let thirdParty = new Set();


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
const formTage = (soup) => soup.findAll('form');
const inputTag = (soup) => soup.findAll('input');

const masterMind = async (url,page) => {
    try{
        await page.goto(url);
    }catch(e){
        console.log("Error on page : ",url)
    }
        await page.waitForTimeout(1000);
    let htmlSource = await page.content();
    let Soup = getHtml(htmlSource);
    aTag(Soup)
        .map((aTag) => {
            TempLinks.add(aTag.attrs.href);
    });
    return Soup;
}

const TempUrl = () => {
    try{
        (massLinks.has(url))
                ?TempLinks.delete(url)
                :massLinks.add(url);
    }catch(e){
        console.log(e);
    }
}

const kingUrl = (kingDomain) => {
    for(let url of TempLinks) {
            if (url.includes(kingDomain)) {
                massLinks.add(url);
        } 
        else if (url.startsWith('/')) {
            massLinks.add("https://" + kingDomain + url);
        }
        else {
            massLinks.delete(url);
            thirdParty.add(url);
        }
        if (thirdParty.has(url)){
                thirdParty.delete("https://" + kingDomain + url)
        }
    }

    return massLinks;
}

const print = (...value) => console.log(value.join(''));

const monsterLoop = async (page,browse,kingDomain) => {
    let Temp = new Set();
    await TempUrl();
    await kingUrl(kingDomain);
    console.log("TempUrs :",TempLinks);
    console.log("Master Links: ",massLinks);
    console.log("Third party: ",thirdParty);
    for (let url of TempLinks) {
        let Soup = await masterMind(url,page);
        saveFile("forms.txt",formTage(Soup)+"\n");
        saveFile("inputs.txt",inputTag(Soup)+"\n");
        
    }
    
    console.log(tempStore)
    //return await monsterLoop(FilterUrl,page,browse);
}

 

(async (url) =>{
    const [page,browse] =await browser();
    const Soup = await masterMind(url,page);
    
    const kingDomain = new URL(url).hostname;
    kingUrl(kingDomain);
    console.log(massLinks);
    await monsterLoop(page,browse,kingDomain);
    saveFile("links.json",JSON.stringify(massLinks));
    console.log("Save Complete");
    // browse.close();
})("https://www.hackerone.com");

