const fs  = require("fs");
const https = require("https");

const command = process.argv[2];
const archive = {
    index: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./Styles/main.css">
    <title>SinglightJs</title>
</head>
<body>
    
    <div id="app"></div>
    <script type="module" src="./Scripts/App.js"></script>

</body>
</html>`,
    style: `* {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
}`,
    app: `import { Singlight } from './Singlight.js';
import Router from './Router.js';

const app = new Singlight();
app.router(Router);
app.mount("#app");
app.start();`,
    router: `import { Router } from './Singlight.js';
import HomePage from './Pages/HomePage.js';

const router = new Router();
router.addRoute("/", HomePage);

export default router;`,
    page: `import { Page } from '../singlight.js';

export default class HomePage extends Page {
    template() {
        return "<h1>Hi there!</h1>";
    }
}`
}



switch (command) {
    case "new": {
        if (process.argv.length < 4)
            errorHelper("Bad usage:\n\tYou must set a name for your project")
        else
            newCmd(process.argv[3]);
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

function newCmd(projectName) {
    if (fs.existsSync(projectName) && fs.readdirSync(projectName).length > 0)
        errorHelper(`Error:\n\t'${projectName}' directory is not empty`)
    else {
        // make project directory if is not exists
        if (!fs.existsSync(projectName)) fs.mkdirSync(projectName)

        // make html file
        fs.writeFileSync(projectName + "/index.html", archive.index);

        // make css file
        fs.mkdirSync(projectName + "/Styles");
        fs.writeFileSync(projectName + "/Styles/main.css", archive.style);
        
        // make javascript files
        fs.mkdirSync(projectName + "/Scripts");
        fs.mkdirSync(projectName + "/Scripts/Pages");
        fs.writeFileSync(projectName + "/Scripts/Singlight.js", '// Network Error:\n//\tSinglighter cannot load SinglightJs from Github');
        fs.writeFileSync(projectName + "/Scripts/App.js", archive.app);
        fs.writeFileSync(projectName + "/Scripts/Router.js", archive.router);
        fs.writeFileSync(projectName + "/Scripts/Pages/HomePage.js", archive.page);

        // get minified singlight v4 from github
        https.get("https://raw.githubusercontent.com/mohammadali-arjomand/singlightjs/master/scripts/singlight.min.js", res => {
            res.on("data", chunk => {
                fs.appendFileSync(projectName + "/Scripts/Singlight.js", chunk.toString());
            })
        });
        successHelper("Project was created successfully");
    }
}