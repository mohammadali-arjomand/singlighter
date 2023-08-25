const fs  = require("fs");
const http = require("http");

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
}`,
    function: `export default function {{NAME}}() {
    // ...
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
    case "serve": {
        serveCmd();
        break;
    }
    default: {
        errorHelper(`Bad usage:\n\t'${command}' is not a command`);
        break;
    }
}

function errorHelper(text) {
    console.error('\x1b[31m%s\x1b[0m', text);
}

function successHelper(text) {
    console.log("\x1b[32m%s\x1b[0m", text);
}

function makePageCmd(pageName) {
    if (fs.existsSync(`./Scripts/Pages/${pageName}.js`))
        errorHelper(`'${pageName}' already exists`)
    else {
        fs.writeFileSync(`./Scripts/Pages/${pageName}.js`, archive.page.replace("{{PAGENAME}}", pageName));
        successHelper("Page was created successfully")
    }
}

function makeAccessorCmd(accessorName) {
    if (fs.existsSync(`./Scripts/Accessors/${accessorName}.js`))
        errorHelper(`'${accessorName}' already exists`)
    else {
        fs.writeFileSync(`./Scripts/Accessors/${accessorName}.js`, archive.function.replace("{{NAME}}", accessorName));
        successHelper("Accessor was created successfully")
    }
}

function makeComponentCmd(componentName) {
    if (fs.existsSync(`./Scripts/Components/${componentName}.js`))
        errorHelper(`'${componentName}' already exists`)
    else {
        fs.writeFileSync(`./Scripts/Components/${componentName}.js`, archive.function.replace("{{NAME}}", componentName));
        successHelper("Component was created successfully")
    }
}

function makeHookCmd(hookName) {
    if (fs.existsSync(`./Scripts/Hooks/${hookName}.js`))
        errorHelper(`'${hookName}' already exists`)
    else {
        fs.writeFileSync(`./Scripts/Hooks/${hookName}.js`, archive.function.replace("{{NAME}}", hookName));
        successHelper("Hook was created successfully")
    }
}

function serveCmd() {
    successHelper("Server was started on [http://localhost:8000] - Press Ctrl+C for stop server")

    const serverHandler = (req, res) => {
        req.url = "." + req.url;
        if (!fs.existsSync(req.url)) req.url = "/";
        url = fs.lstatSync(req.url).isFile() ? "./" + req.url : `./${req.url}/index.html`;
        let output = fs.readFileSync(url);
        if (url.substring(url.length-2, url.length) == 'js') res.setHeader('Content-Type', 'text/javascript');
        res.write(output);
        res.end();
    };

    let server = http.createServer(serverHandler).listen(8000);

    fs.watch(".", () => {
        successHelper("Files was modified, Server was restarted");
        server.close();
        server = http.createServer(serverHandler).listen(8000);
    })
}