var fs    = require("fs"),

    cache = {},

    snips = {};



function addTemplateToCache(name, template, fromFile) {
  
  var templateHtml = template;

  if (fromFile) {
  
    templateHtml = readFromFile(template);
  
  }
  
  cache[name] = templateHtml;

}

function addSnip (name, snip, fromFile) {

  var snipText = snip;

  if (fromFile) {
  
    snip = readFromFile(snip);
  
  }

  snips[name] = snipText;

}

function loadTemplate(template, options) {

  var templateHtml = "";

  if (!cache[template]) {
  
    templateHtml = readFromFile(template);
  
  } else {
  
    templateHtml = cache[template];
  
  }

  if (options) {
  
    for (key in options) {
  
      if (options.hasOwnProperty(key)) {

        templateHtml = templateHtml.replace(formatOption(key), options[key]);
  
      }
  
    }
  
  }

  return templateHtml;

}

function readFromFile(file) {

  return fs.readFileSync(file, "utf8");

}

function formatOption(key) {

  return ("${{" + key + "}}");

}

exports.cache              = cache;
exports.snips              = snips;
exports.addTemplateToCache = addTemplateToCache;
exports.addSnip            = addSnip;
exports.loadTemplate       = loadTemplate;
