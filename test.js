// const puppeteer = require('puppeteer-extra');
// const stealth = require('puppeteer-extra-plugin-stealth');
// const BeautifulSoup = require('jssoup').default;
// const fs = require('fs');
// const { count, time } = require('console');


// const saveFile = (filename,data) => fs.appendFileSync(filename,data);

// const browser = async() => {
//     puppeteer.use(stealth());
//     const browser = await puppeteer.launch({
//         headless: false,
//         executablePath:"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
//         args: [
//            '--no-sandbox',
//             '--disable-setuid-sandbox',
//             '--disable-dev-shm-usage',
//             '--disable-accelerated-2d-canvas',
//             '--no-first-run',
//             '--no-zygote',
//            // '--single-process', // <- this one doesn't works in Windows
//             '--disable-gpu'
//             ]
//             });

//     const page = await browser.newPage();
//     return [page,browser];
// }
// (async () => {
//     const [driver,browse]= await browser();
//     let mkv = await driver.goto('https://nowsecure.nl');
//     let performanceTiming = JSON.parse(
//         await driver.evaluate(() => JSON.stringify(window.performance.getEntries()))
//     );

//     console.log(performanceTiming.map((entry) => entry.name));
//     await driver.waitForTimeout(1000);
//     let mkva = "https://nowsecure.nl".replaceAll('/','_').replaceAll(':','_').replaceAll('.','_');
//     console.log(mkva)
//     await driver.waitForTimeout(1000);
//     saveFile(`${mkva}headfull`,JSON.stringify(await mkv.request().headers()+await mkv.headers()));

//     await browse.close();
// }
// )();



'use strict';

const puppeteer = require('puppeteer');
const formTage = (soup) => soup.findAll('form');
let { requestCalls } = require('./templete/inspectRequestsCalls');
const BeautifulSoup = require('jssoup').default;
let xpath ;
let classname;
let button = [];
(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
//   await requestCalls(page);
  await page.goto('https://google.com/');
  let soup = await new BeautifulSoup(await page.content());
    await formTage(soup).map((inputs) => 
        inputs.findAll('input').map(
                (input) => {
                    if (input.attrs.type == 'username'){
                        console.log(input.attrs.name)
                    }
                    else if (input.attrs.type == 'text'){
                        console.log(input.attrs.class)
                        console.log(`//title[@class=${input.attrs.class}]`)                                   // //title[@class='title']
                        xpath = `//input[@class='${input.attrs.class}']`
                        classname = "."+input.attrs.class
                    }
                    else if (input.attrs.type == 'submit'){
                        console.log(input.attrs.class)
                        button.push('//input[@name='+input.attrs.class+']')
                    }
                }
        ));

// {
//     class: 'gLFyf gsfi',
//     jsaction: 'paste:puy29d;',
//     maxlength: '2048',
//     name: 'q',
//     type: 'text',
//     'aria-autocomplete': 'both',
//     'aria-haspopup': 'false',
//     autocapitalize: 'off',
//     autocomplete: 'off',
//     autocorrect: 'off',
//     autofocus: '',
//     role: 'combobox',
//     spellcheck: 'false',
//     title: 'Search',
//     value: '',
//     'aria-label': 'Search',
//     'data-ved': '0ahUKEwj1oNj5qq36AhUt-DgGHaJJBM4Q39UDCAQ'
//   }
//   {
//     class: 'gNO89b',
//     value: 'Google Search',
//     'aria-label': 'Google Search',
//     name: 'btnK',
//     role: 'button',
//     tabindex: '0',
//     type: 'submit',
//     'data-ved': '0ahUKEwj1oNj5qq36AhUt-DgGHaJJBM4Q4dUDCAc'
//   }
//   {
//     class: 'RNmpXc',
//     value: "I'm Feeling Lucky",
//     'aria-label': "I'm Feeling Lucky",
//     name: 'btnI',
//     type: 'submit',
//     jsaction: 'trigger.kWlxhc',
//     'data-ved': '0ahUKEwj1oNj5qq36AhUt-DgGHaJJBM4Q19QECAg'
//   }
//   {
//     class: 'gNO89b',
//     value: 'Google Search',
//     'aria-label': 'Google Search',
//     name: 'btnK',
//     role: 'button',
//     tabindex: '0',
//     type: 'submit',
//     'data-ved': '0ahUKEwj1oNj5qq36AhUt-DgGHaJJBM4Q4dUDCAs'
//   }
//   {
//     class: 'RNmpXc',
//     value: "I'm Feeling Lucky",
//     'aria-label': "I'm Feeling Lucky",
//     name: 'btnI',
//     type: 'submit',
//     jsaction: 'trigger.kWlxhc',
//     'data-ved': '0ahUKEwj1oNj5qq36AhUt-DgGHaJJBM4Q19QECAw'
//   }
//   { name: 'source', type: 'hidden', value: 'hp' }
//   { value: 'YusuY_XnN63w4-EPopOR8Aw', name: 'ei', type: 'hidden' }
//   {
//     value: 'AJiK0e8AAAAAYy75clFgpl1_PcfKy46t9gGNTgyh0m3p',
//     name: 'iflsig',
//     type: 'hidden'
//   }








    // soup.findAll('input').map((input) => console.log(input.attrs));
        // soup.findAll('from').map((input) => console.log(input.findAll('input')));
        const xp = (await page.$x(xpath))[0];
        xp.type("hello world").then(
        page.keyboard.press('enter'));
        // await page.keyboard.press('Enter');
        // console.log(button)
        // button.map(async (butts) => 
        // for (let butt of button){
            // console.log(butt);
        // await page.
        // await page.waitForSelector('.gNO89b');
        // await page.click('');
        //     let xp1 = (await page.$x(button[0]))[0];
        //     let xp2 = (await page.$x(button[1]))[0];
        //     let xp3 = (await page.$x(button[2]))[0];
        //     let xp4 = (await page.$x(button[3]))[0];
        //     try{ 
        //         xp1.click();
        //     }catch(err){
        //         console.log(err)
        //     }
        //     try{ 
        //         xp2.click();
        //     }catch(err){
        //         console.log(err)
        //     }
        //     try{ 
        //         xp3.click();
        //     }catch(err){
        //         console.log(err)
        //     }
        //     try{ 
        //         xp4.click();
        //     }catch(err){
        //         console.log(err)
        //     }
        // }
    //     }
    //         let xp1 = await page.$x(butts);
    //         console.log(butts)
    //     try{
    //         xp1.click()
    //     }catch(e){
    //         console.log(e)
    //     }
    // });
            // await page.press('Return')
        // const xp = (await page.$("//input[@class=gLFyf gsfi]"));
        // xp.type("hello world")
        //await page.press('Enter');
        await page.waitForTimeout(5000);
  await page.screenshot({path : 'google.png'});
  await browser.close();
})();