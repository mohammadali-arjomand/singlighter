#!/usr/bin/env node
const fs = require("fs");
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
    indexphp: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/public/Styles/main.css">
    <title>SinglightJs + API-Monster</title>
</head>
<body>
    
    <div id="app"></div>
    <script type="module" src="/public/Scripts/App.js"></script>

</body>
</html>`,
    style: `* {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
}`,
    app: `import Singlight from './Singlight.js';
import Router from './Router.js';
import hooks from './Hooks/Fisher.js';

const app = new Singlight();
app.router(Router);
app.hooks(hooks);
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
}`,
    fisher: `// import ...

export default {
    // ...
};`,
    apache: `<IfModule mod_negotiation.c>
  Options -MultiViews
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`,
    nginx: `location / {
  try_files $uri $uri/ /index.html;
}`,
    help: `Usage:
    npx singlighter@latest <command> [option]
Commands:
    version => Get singlighter version
    help => Get help
    new => Create new project (option is required)
    monsterize => Add SinglightJs to API-Monster project`,
    monsterjs: `function remonster(controller, data={}, callback=()=>{}) {
    let form = new FormData
    for (let item in data) {
        form.append(item, data[item])
    }
    let [ className, methodName ] = controller.split("@");
    fetch(\`http://\${location.host}/singlight/\${className}/\${methodName}\`, {body: form, method: "POST"})
        .then(res => res.json())
        .then(data => {
            monster = data
            callback()
        })
}
    
export { remonster }`,
    singlightphp: `<?php

namespace Monster\\App\\Models;
    
class Singlight {
    public static function route() {
        \\Monster\\App\\Route::post('/singlight/{controller}/{method}', function ($controller, $method) {
            $config = require "./config/singlight.php";
            $isAllow = false;
            foreach ($config["controllers_allowed"] as $allowed) {
                $isAllow = "$controller@$method" === $allowed;
            }
            if (!$isAllow) {
                http_response_code(403);
                echo "<h1>403 - Access denied</h1>";
                die();
            }
            $class = '\\\\Monster\\\\App\\\\Controllers\\\\' . $controller;
            $instance = new $class;
            header("Content-type: application/json");
            echo json_encode($instance->$method(...$_POST));
        });
    }
}`,
    simr: `\n\n\\Monster\\App\\Models\\Singlight::route();`,
    monsterconf: `<?php

return [
    "controllers_allowed" => []
];
`
}

switch (command) {
    case undefined: {
        infoHelper("Hi! I'm here ...");
        break;
    }
    case "version": {
        infoHelper("v2.3.6");
        break;
    }
    case "help": {
        infoHelper(archive.help);
        break;
    }
    case "new": {
        if (process.argv.length < 4)
            errorHelper("Bad usage:\n\tYou must set a name for your project")
        else
            newCmd(process.argv[3]);
        break;
    }
    case "monsterize": {
        monsterizeCmd();
        break;
    }
    default: {
        errorHelper(`Bad usage:\n\t'${command}' is not a command, use 'help' command for see Methods of usage`)
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
        fs.mkdirSync(projectName + "/Scripts/Accessors");
        fs.mkdirSync(projectName + "/Scripts/Hooks");
        fs.mkdirSync(projectName + "/Scripts/Components");
        fs.writeFileSync(projectName + "/Scripts/Singlight.js", '');
        fs.writeFileSync(projectName + "/singlighter", '');
        fs.writeFileSync(projectName + "/Scripts/App.js", archive.app);
        fs.writeFileSync(projectName + "/Scripts/Router.js", archive.router);
        fs.writeFileSync(projectName + "/Scripts/Pages/HomePage.js", archive.page);
        fs.writeFileSync(projectName + "/Scripts/Hooks/Fisher.js", archive.fisher);
        fs.writeFileSync(projectName + "/.htaccess", archive.apache);
        fs.writeFileSync(projectName + "/nginx.conf", archive.nginx);

        // get minified singlight v4 from github
        https.get("https://raw.githubusercontent.com/mohammadali-arjomand/singlightjs/master/scripts/singlight.min.js", res => {
            res.on("data", chunk => {
                fs.appendFileSync(projectName + "/Scripts/Singlight.js", chunk.toString());
            })
        });

        // get minified inner-singlighter from github
        https.get("https://raw.githubusercontent.com/mohammadali-arjomand/singlighter/main/singlighter.js", res => {
            res.on("data", chunk => {
                fs.appendFileSync(projectName + "/singlighter", chunk.toString());
            })
        });
        successHelper("Project was created successfully");
    }
}

function monsterizeCmd() {
    if (!fs.existsSync("public")) fs.mkdirSync("public")
    if (!fs.existsSync("config")) fs.mkdirSync("config")

    fs.writeFileSync("views/index.php", archive.indexphp);

    fs.mkdirSync("public/Styles");
    fs.writeFileSync("public/Styles/main.css", archive.style);

    fs.mkdirSync("public/Scripts");
    fs.mkdirSync("public/Scripts/Pages");
    fs.mkdirSync("public/Scripts/Accessors");
    fs.mkdirSync("public/Scripts/Hooks");
    fs.mkdirSync("public/Scripts/Components");
    fs.mkdirSync("public/Scripts/Lib");
    fs.writeFileSync("public/Scripts/Singlight.js", '');
    fs.writeFileSync("public/Scripts/App.js", archive.app);
    fs.writeFileSync("public/Scripts/Router.js", archive.router);
    fs.writeFileSync("public/Scripts/Pages/HomePage.js", archive.page);
    fs.writeFileSync("public/Scripts/Hooks/Fisher.js", archive.fisher);
    fs.writeFileSync("public/Scripts/Lib/Monster.js", archive.monsterjs);
    fs.writeFileSync("App/Models/Singlight.php", archive.singlightphp);
    fs.writeFileSync("config/singlight.php", archive.monsterconf);
    fs.writeFileSync("singlighter", '');
    fs.appendFileSync("routes/web.php", archive.simr);
    fs.rmSync("public/style.css");

    // get minified singlight v4 from github
    https.get("https://raw.githubusercontent.com/mohammadali-arjomand/singlightjs/master/scripts/singlight.min.js", res => {
        res.on("data", chunk => {
            fs.appendFileSync("public/Scripts/Singlight.js", chunk.toString());
        })
    });

    // get minified inner-singlighter from github
    https.get("https://raw.githubusercontent.com/mohammadali-arjomand/singlighter/main/monster.js", res => {
        res.on("data", chunk => {
            fs.appendFileSync("singlighter", chunk.toString());
        })
    });
    successHelper("SinglightJs was added to project successfully");
}