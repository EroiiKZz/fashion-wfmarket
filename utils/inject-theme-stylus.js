const path = require("path");
const fs = require("fs");

const compiledDir = path.resolve(__dirname, "../compiled");
const stylusFilePath = path.resolve(__dirname, "user-style.styl");

// Automatically load all CSS files from compiled folder
const themes = {};
fs.readdirSync(compiledDir)
  .filter((file) => file.endsWith(".css") && !file.endsWith(".map"))
  .forEach((file) => {
    const themeName = path.basename(file, ".css");
    themes[themeName] = path.join(compiledDir, file);
  });

// Read CSS content from a file
function readCss(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

// Build Stylus content with all themes concatenated
function buildStylusContent(themeContents) {
  let content = `/* ==UserStyle==
@name           Warframe Market live theme updater
@namespace      github.com/openstyles/stylus
@version        1.0.0
@description    Live update user CSS themes from Sass watch.
@author         EroiiKZz
==/UserStyle== */

`;

  // Add each CSS theme concatenated
  for (const themeName in themeContents) {
    content += `/* Theme: ${themeName} */\n\n${themeContents[themeName]}\n\n`;
  }

  content += `@-moz-document domain("warframe.market") {
  /* Custom rules */
}
`;

  return content;
}

// Write Stylus content to file and log active themes
function writeStylus(content, themeNames) {
  fs.writeFileSync(stylusFilePath, content, "utf8");
  console.log(`Updated stylus with [${themeNames.join("] - [")}] !`);
}

// Read all themes and return an object {themeName: cssContent}
function readAllThemes() {
  const themeContents = {};
  for (const [name, filePath] of Object.entries(themes)) {
    themeContents[name] = readCss(filePath);
  }
  return themeContents;
}

// Complete build and save function
function buildAndWrite() {
  const themeContents = readAllThemes();
  const stylusContent = buildStylusContent(themeContents);
  writeStylus(stylusContent, Object.keys(themes));
}

// Debounce mechanism to avoid multiple rapid rebuilds
let debounceTimer = null;
function debouncedBuildAndWrite() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    buildAndWrite();
    debounceTimer = null;
  }, 200); // Wait 200ms after last change
}

// Watch all CSS files to rebuild on each modification
for (const filePath of Object.values(themes)) {
  fs.watchFile(filePath, { interval: 500 }, () => {
    debouncedBuildAndWrite();
  });
}

// Initial build
buildAndWrite();
