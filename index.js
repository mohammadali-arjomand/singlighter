const fs=require("fs"),https=require("https"),command=process.argv[2],archive={index:`<!DOCTYPE html>
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
</html>`,style:`* {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
}`,app:`import { Singlight } from './Singlight.js';
import Router from './Router.js';
import hooks from './Hooks/Fisher.js';

const app = new Singlight();
app.router(Router);
app.hooks(hooks);
app.mount("#app");
app.start();`,router:`import { Router } from './Singlight.js';
import HomePage from './Pages/HomePage.js';

const router = new Router();
router.addRoute("/", HomePage);

export default router;`,page:`import { Page } from '../singlight.js';

export default class HomePage extends Page {
    template() {
        return "<h1>Hi there!</h1>";
    }
}`,fisher:`// import ...

export default hooks = {
    // ...
};`,apache:`<IfModule mod_negotiation.c>
  Options -MultiViews
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`,nginx:`location / {
  try_files $uri $uri/ /index.html;
}`};function errorHelper(e){console.error("\x1b[31m%s\x1b[0m",e)}function successHelper(e){console.log("\x1b[32m%s\x1b[0m",e)}function newCmd(e){fs.existsSync(e)&&fs.readdirSync(e).length>0?errorHelper(`Error:
	'${e}' directory is not empty`):(fs.existsSync(e)||fs.mkdirSync(e),fs.writeFileSync(e+"/index.html",archive.index),fs.mkdirSync(e+"/Styles"),fs.writeFileSync(e+"/Styles/main.css",archive.style),fs.mkdirSync(e+"/Scripts"),fs.mkdirSync(e+"/Scripts/Pages"),fs.mkdirSync(e+"/Scripts/Accessors"),fs.mkdirSync(e+"/Scripts/Hooks"),fs.mkdirSync(e+"/Scripts/Components"),fs.writeFileSync(e+"/Scripts/Singlight.js",""),fs.writeFileSync(e+"/singlighter",""),fs.writeFileSync(e+"/Scripts/App.js",archive.app),fs.writeFileSync(e+"/Scripts/Router.js",archive.router),fs.writeFileSync(e+"/Scripts/Pages/HomePage.js",archive.page),fs.writeFileSync(e+"/Scripts/Hooks/Fisher.js",archive.fisher),fs.writeFileSync(e+"/.htaccess",archive.apache),fs.writeFileSync(e+"/nginx.conf",archive.nginx),https.get("https://raw.githubusercontent.com/mohammadali-arjomand/singlightjs/master/scripts/singlight.min.js",t=>{t.on("data",t=>{fs.appendFileSync(e+"/Scripts/Singlight.js",t.toString())})}),https.get("https://raw.githubusercontent.com/mohammadali-arjomand/singlighter/main/inner/singlighter.inner.min.js",t=>{t.on("data",t=>{fs.appendFileSync(e+"/singlighter",t.toString())})}),successHelper("Project was created successfully"))}"new"===command?process.argv.length<4?errorHelper("Bad usage:\n	You must set a name for your project"):newCmd(process.argv[3]):errorHelper(`Bad usage:
	'${command}' is not a command`);