const fs  = require("fs");

const command = process.argv[2];
const archive = {
    page: `import { Page } from '../Singlight.js';

export default class {{PAGENAME}} extends Page {
    template() {
        return '';
    }
    setup() {
        // ...
    }
}`,
    function: `export default function {{NAME}}() {
    // ...
}`,
    help: `Usage:
    node singlighter <command> [option]
Commands:
    version => Get singlighter version
    help => Get help
    make:page => Create new page (option is required)
    make:accessor => Create new accessor (option is required)
    make:component => Create new component (option is required)
    make:hook => Create new hook (option is required)`
}

switch (command) {
    case undefined: {
        infoHelper("Hi! I'm here ...");
        break;
    }
    case "version": {
        infoHelper("v2.3.8 - Monsterized");
        break;
    }
    case "help": {
        infoHelper(archive.help);
        break;
    }
    case "make:page": {
        if (process.argv.length < 4)
            errorHelper("Bad usage:\n\tYou must set a name for your page")
        else
            makePageCmd(process.argv[3]);
        break;
    }
    case "make:accessor": {
        if (process.argv.length < 4)
            errorHelper("Bad usage:\n\tYou must set a name for your accessor")
        else
            makeAccessorCmd(process.argv[3]);
        break;
    }
    case "make:component": {
        if (process.argv.length < 4)
            errorHelper("Bad usage:\n\tYou must set a name for your component")
        else
            makeComponentCmd(process.argv[3]);
        break;
    }
    case "make:hook": {
        if (process.argv.length < 4)
            errorHelper("Bad usage:\n\tYou must set a name for your hook")
        else
            makeHookCmd(process.argv[3]);
        break;
    }
    default: {
        errorHelper(`Bad usage:\n\t'${command}' is not a command, use 'help' command for see Methods of usage`);
        break;
    }
}

function errorHelper(text) {
    console.error('\x1b[31m%s\x1b[0m', text);
}

function successHelper(text) {
    console.log("\x1b[32m%s\x1b[0m", text);
}

function infoHelper(text) {
    console.info("\x1b[34m%s\x1b[0m", text);
}

function makePageCmd(pageName) {
    if (fs.existsSync(`public/Scripts/Pages/${pageName}.js`))
        errorHelper(`'${pageName}' already exists`)
    else {
        fs.writeFileSync(`public/Scripts/Pages/${pageName}.js`, archive.page.replace("{{PAGENAME}}", pageName));
        successHelper("Page was created successfully")
    }
}

function makeAccessorCmd(accessorName) {
    if (fs.existsSync(`public/Scripts/Accessors/${accessorName}.js`))
        errorHelper(`'${accessorName}' already exists`)
    else {
        fs.writeFileSync(`public/Scripts/Accessors/${accessorName}.js`, archive.function.replace("{{NAME}}", accessorName));
        successHelper("Accessor was created successfully")
    }
}

function makeComponentCmd(componentName) {
    if (fs.existsSync(`public/Scripts/Components/${componentName}.js`))
        errorHelper(`'${componentName}' already exists`)
    else {
        fs.writeFileSync(`public/Scripts/Components/${componentName}.js`, archive.function.replace("{{NAME}}", componentName));
        successHelper("Component was created successfully")
    }
}

function makeHookCmd(hookName) {
    if (fs.existsSync(`public/Scripts/Hooks/${hookName}.js`))
        errorHelper(`'${hookName}' already exists`)
    else {
        fs.writeFileSync(`public/Scripts/Hooks/${hookName}.js`, archive.function.replace("{{NAME}}", hookName));
        successHelper("Hook was created successfully")
    }
}