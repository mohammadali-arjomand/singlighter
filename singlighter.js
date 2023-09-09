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
}`,
    help: `Usage:
    node singlighter <command> [option]
Commands:
    version => Get singlighter version
    help => Get help
    make:page => Create new page (option is required)
    make:accessor => Create new accessor (option is required)
    make:component => Create new component (option is required)
    make:hook => Create new hook (option is required)
    serve => Serving project on localhost`
}

switch (command) {
    case undefined: {
        infoHelper("Hi! I'm here ...");
        break;
    }
    case "version": {
        infoHelper("v2.3.7");
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
    case "serve": {
        if (process.argv.length < 4)
            serveCmd();
        else
            !isNaN(process.argv[3]) ? serveCmd(Number(process.argv[3])) : errorHelper("Port must be numeric")
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

function serveCmd(port=8000) {
    const serverStarted = () => successHelper(`Server was started on [http://localhost:${port}] - Press Ctrl+C for stop server`);

    const serverHandler = (req, res) => {
        req.url = "." + req.url;
        if (!fs.existsSync(req.url)) req.url = "/";
        url = fs.lstatSync(req.url).isFile() ? "./" + req.url : `./${req.url}/index.html`;
        let output = fs.readFileSync(url);
        if (url.substring(url.length-2, url.length) == 'js') res.setHeader('Content-Type', 'text/javascript');
        res.write(output);
        res.end();
    };

    let server = http.createServer(serverHandler).listen(port);

    const handleError = () => {
        errorHelper(`Port ${port} is busy, Try port ${port+1}`)
        port++;
        server = http.createServer(serverHandler).listen(port);
        server.on("error", () => handleError());
        server.on("listening", serverStarted);
    };

    server.on("error", handleError);
    server.on("listening", serverStarted);

    fs.watch(".", () => {
        successHelper("Files was modified, Restarting server ...");
        server.close();
        server = http.createServer(serverHandler).listen(port);
    })
}