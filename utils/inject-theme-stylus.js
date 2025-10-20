const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");

const compiledDir = path.resolve(__dirname, "../compiled");
const stylusFilePath = path.resolve(__dirname, "user-style.styl");
const selectionFile = path.resolve(__dirname, ".theme-selection.json");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  dim: "\x1b[2m",
};

function loadThemes() {
  const themes = {};

  if (!fs.existsSync(compiledDir)) {
    console.warn("⚠️ Compiled folder doesn't exist yet.");
    return themes;
  }

  fs.readdirSync(compiledDir)
    .filter((file) => file.endsWith(".css") && !file.endsWith(".map"))
    .forEach((file) => {
      const themeName = path.basename(file, ".css");
      themes[themeName] = path.join(compiledDir, file);
    });

  return themes;
}

function readCss(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function replaceThemeClass(cssContent, newClassName) {
  const regex = /\.theme--[\w-]+(?=\s*[{,])/g;
  return cssContent.replace(regex, `.${newClassName}`);
}

function buildStylusContent(lightTheme, darkTheme) {
  return `/* ==UserStyle==
@name Warframe Market - Custom Themes
@namespace github.com/openstyles/stylus
@version 1.0.0
@description Custom theme selector for Warframe Market
@author EroiiKZz
==/UserStyle== */

@-moz-document domain("warframe.market") {

/* ========================================
   LIGHT THEME: ${lightTheme.name}
   ======================================== */

${lightTheme.css}

/* ========================================
   DARK THEME: ${darkTheme.name}
   ======================================== */

${darkTheme.css}

}
`;
}

function writeStylus(content, lightName, darkName) {
  fs.writeFileSync(stylusFilePath, content, "utf8");
  
  console.log(
    `\n${colors.bright}${colors.green}✨ Stylus generated successfully!${colors.reset}\n`
  );
  console.log(`${colors.cyan}Selected themes:${colors.reset}`);
  console.log(`   ${colors.yellow}☀️  Light mode:${colors.reset} ${lightName}`);
  console.log(`   ${colors.magenta}🌙 Dark mode:${colors.reset} ${darkName}\n`);
  console.log(
    `${colors.blue}📄 File created:${colors.reset} ${colors.dim}${stylusFilePath}${colors.reset}`
  );
  console.log(
    `${colors.green}→ Copy the content and paste it into Stylus extension!${colors.reset}\n`
  );
}

async function selectThemes() {
  const themes = loadThemes();
  const themeNames = Object.keys(themes).sort();

  if (themeNames.length === 0) {
    console.log(`${colors.red}❌ No compiled themes found.${colors.reset}`);
    process.exit(1);
  }

  console.log(
    `\n${colors.bright}${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.cyan}║     Theme Selector 🎨                 ║${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`
  );

  // Créer les choices avec des noms formatés
  const choices = themeNames.map((name) => {
    const isLight = name.startsWith("light-");
    const icon = isLight ? "☀️ " : "🌙";
    return {
      name: `${icon} ${name}`,
      value: name,
    };
  });

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "light",
      message: `${colors.yellow}Choose theme for LIGHT MODE:${colors.reset}`,
      choices: choices,
      pageSize: 15,
    },
    {
      type: "list",
      name: "dark",
      message: `${colors.magenta}Choose theme for DARK MODE:${colors.reset}`,
      choices: choices,
      pageSize: 15,
    },
  ]);

  console.log(
    `\n${colors.green}✓ Light mode:${colors.reset} ${answers.light}`
  );
  console.log(
    `${colors.green}✓ Dark mode:${colors.reset} ${answers.dark}`
  );

  return {
    light: { name: answers.light, path: themes[answers.light] },
    dark: { name: answers.dark, path: themes[answers.dark] },
  };
}

async function buildAndWrite(selectedThemes) {
  const lightCss = readCss(selectedThemes.light.path);
  const darkCss = readCss(selectedThemes.dark.path);

  const lightTheme = {
    name: selectedThemes.light.name,
    css: replaceThemeClass(lightCss, "theme--light"),
  };

  const darkTheme = {
    name: selectedThemes.dark.name,
    css: replaceThemeClass(darkCss, "theme--dark"),
  };

  const stylusContent = buildStylusContent(lightTheme, darkTheme);
  writeStylus(stylusContent, lightTheme.name, darkTheme.name);
}

async function watchMode() {
  if (!fs.existsSync(selectionFile)) {
    console.log(
      `${colors.red}❌ No theme selection found. Run 'npm run select' first.${colors.reset}`
    );
    process.exit(1);
  }

  const selectedThemes = JSON.parse(fs.readFileSync(selectionFile, "utf8"));

  console.log(`${colors.blue}📋 Loaded theme selection:${colors.reset}`);
  console.log(`   Light mode: ${selectedThemes.light.name}`);
  console.log(`   Dark mode: ${selectedThemes.dark.name}\n`);

  await buildAndWrite(selectedThemes);

  console.log(
    `${colors.blue}👀 Watching for changes...${colors.reset}`
  );
  console.log(
    `${colors.dim}   Press Ctrl+C to stop${colors.reset}\n`
  );

  let debounceTimer = null;
  fs.watch(compiledDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith(".css") && !filename.endsWith(".map")) {
      const changedTheme = path.basename(filename, ".css");
      if (
        changedTheme === selectedThemes.light.name ||
        changedTheme === selectedThemes.dark.name
      ) {
        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
          console.log(
            `\n${colors.green}📝 Change detected:${colors.reset} ${filename}`
          );
          console.log(`${colors.cyan}🔄 Rebuilding Stylus...${colors.reset}`);
          buildAndWrite(selectedThemes);
        }, 300);
      }
    }
  });
}

(async () => {
  const args = process.argv.slice(2);

  if (args.includes("--watch-only")) {
    await watchMode();
  } else {
    let selectedThemes;

    if (fs.existsSync(selectionFile)) {
      selectedThemes = JSON.parse(fs.readFileSync(selectionFile, "utf8"));

      console.log(`\n${colors.blue}📋 Previous selection found:${colors.reset}`);
      console.log(`   ${colors.yellow}☀️  Light mode:${colors.reset} ${selectedThemes.light.name}`);
      console.log(`   ${colors.magenta}🌙 Dark mode:${colors.reset} ${selectedThemes.dark.name}`);

      const { useExisting } = await inquirer.prompt([
        {
          type: "confirm",
          name: "useExisting",
          message: "Use these themes?",
          default: true,
        },
      ]);

      if (!useExisting) {
        selectedThemes = await selectThemes();
      } else {
        console.log(`${colors.green}✓ Using previous selection${colors.reset}`);
      }
    } else {
      selectedThemes = await selectThemes();
    }

    fs.writeFileSync(selectionFile, JSON.stringify(selectedThemes, null, 2));
    await buildAndWrite(selectedThemes);
  }
})();
