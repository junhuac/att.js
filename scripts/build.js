var fs = require('fs'),
    spec = require('./spec')(),
    renderMarkdown = require('./renderMarkdown'),
    renderHtml = require('./renderHtml');


var layoutFile = __dirname+'/../scripts/layout.jade';
if (process.argv.length > 2) {
    layoutFile = process.argv[2];
}


fs.writeFileSync(__dirname+'/../docs/plugins.md', renderMarkdown(spec));
fs.writeFileSync(__dirname+'/../staticSite/index.html', renderHtml(spec, 'index', layoutFile));
fs.writeFileSync(__dirname+'/../staticSite/plugins.html', renderHtml(spec, 'plugins', layoutFile));
fs.writeFileSync(__dirname+'/../staticSite/datatypes.html', renderHtml(spec, 'datatypes', layoutFile));
fs.writeFileSync(__dirname+'/../staticSite/events.html', renderHtml(spec, 'events', layoutFile));


fs.writeFileSync(__dirname+'/../src/att.spec.js', "" + 
  "// This file was auto generated by `npm run-script build`\n" +
  "(function (ATT) {\n" +
  "  ATT.ATTSpec = " + JSON.stringify(spec) + ";\n" + 
  "})(ATT);");
