const fs  = require("fs");
// const https = require("https");

const command = process.argv[2];
const archive = {
    page: `import { Page } from '../singlight.js';

export default class {{PAGENAME}} extends Page {
    template() {
        return '';
    }
    setup() {
        // ...
    }
}`
}



switch (command) {
    case "make:page": {
        if (process.argv.length < 4)
            errorHelper("Bad usage:\n\tYou must set a name for your page")
        else
            makePageCmd(process.argv[3]);
        break;
    }
    default: {
        errorHelper(`Bad usage:\n\t'${command}' is not a command`)
    }
}

function errorHelper(text) {
    console.error('\x1b[31m%s\x1b[0m', text);
}

function successHelper(text) {
    console.log("\x1b[32m%s\x1b[0m", text);
}

function makePageCmd(pageName) {
    fs.writeFileSync(`./Scripts/Pages/${pageName}.js`, archive.page.replace("{{PAGENAME}}", pageName));
    successHelper("Page was created successfully")
}