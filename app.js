const puppeteer = require('puppeteer-extra');
const stealth = require('puppeteer-extra-plugin-stealth');
const BeautifulSoup = require('jssoup').default;
const fs = require('fs');
const { count } = require('console');


let massLinks = new Set();
let urlLess = new Set();
let TempLinks = new Set();
let thirdParty = new Set();
let subDomain = new Set();
let mailtoTemp = new Set();

const saveFile = (filename,data) => fs.appendFileSync(filename,data);

const browser = async() => {
    puppeteer.use(stealth());
    const browser = await puppeteer.launch({
        headless: true,
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
const formTage = (soup) => soup.findAll('form').join("\n");
const inputTag = (soup) => soup.findAll('input').join("\n");

const TempUrl = (url,kingDomain) => {
    const smallMan = (url) => (massLinks.has(url))?"": massLinks.add(url);TempLinks.add(url);
    try{
    if (url.startsWith('/') || url.startsWith('#')){
        if (url.startsWith('/')){
            TempLinks.add("https://" + kingDomain + url);
            smallMan("https://" + kingDomain + url);

        }
        else if (url.startsWith('#')){
            TempLinks.add("https://" + kingDomain + "/" + url);
            smallMan("https://" + kingDomain + "/" + url);
        }
            
    }else if(url.startsWith('mailto')){
        mailtoTemp.add(url);
        TempLinks.delete(url);
        massLinks.delete(url);
    }else if(new URL(url).hostname.includes(kingDomain)){
        smallMan(url);
    }
    else{
        thirdParty.add(url);
        TempLinks.delete(url);
        massLinks.delete(url);
    }
    }catch(e){
        console.log(e);
    }
}

const kingUrl = async (kingDomain) => {
    TempLinks.forEach((url) => {
        if (url.includes(kingDomain)) {
                massLinks.add(url);
        } 
        else {
            thirdParty.add(url);
            massLinks.delete(url);
            TempLinks.delete(url);   
        }
    });
}

const masterMind = async (url,page,kingDomain) => {
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
            TempUrl(aTag.attrs.href,kingDomain)
    });
    kingUrl(kingDomain);
    return Soup;
}

const soBegin = (page,browse,kingDomain,executeUrl) => {
    
    TempLinks.forEach((url) => {
        if (executeUrl.has(url)){
            TempLinks.delete(url);
        }
    });
    console.log(TempLinks)
    return monsterLoop(page,browse,kingDomain,TempLinks);
}

const print = (...value) => console.log(value.join(''));

const monsterLoop = async (page,browse,kingDomain) => {
    let executedUrl = new Set();
    let Temp = new Set(TempLinks);
    let count = 0;
    console.log(count)
    for (let url of Temp) {
        let Soup = await masterMind(url,page,kingDomain);
        executedUrl.add(url);
        console.log("Mass :",massLinks);
        console.log("Temp :",TempLinks);
        saveFile("forms.txt",formTage(Soup)+"\n");
        saveFile("inputs.txt",inputTag(Soup)+"\n");
        console.log("size of temp: ",TempLinks.size);
        console.log("size of mass: ",massLinks.size);
        console.log("size of temp mass: ",Temp.size);
    }
    console.log("executer: ",executedUrl);
    console.log("thirdParty: ",thirdParty);
    console.log("mailto: ",mailtoTemp);
    saveFile("links.json",massLinks);
    count += 1;
    console.log(count)
    if ( count <= 2){
        return soBegin(page,browse,kingDomain,executedUrl);
    }else{
        console.log("Done");
        return browse.close();
    }
}
        // return monsterLoop(links,page,browse);


 

(async (url) =>{
    let kingDomain = new URL(url).hostname;
    const [page,browse] =await browser();
    const Soup = await masterMind(url,page,kingDomain);
    await monsterLoop(page,browse,kingDomain);
    console.log("Save Complete");
    // browse.close();
})("https://hackerone.com");

