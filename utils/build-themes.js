const fs = require("fs");
const path = require("path");
const sass = require("sass");

const themesDir = path.resolve(__dirname, "../themes");
const compiledDir = path.resolve(__dirname, "../compiled");

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

if (!fs.existsSync(compiledDir)) {
  fs.mkdirSync(compiledDir, { recursive: true });
}

function getThemeFolders() {
  return fs
    .readdirSync(themesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function compileTheme(themeName) {
  const inputFile = path.join(themesDir, themeName, "_main.scss");
  const outputFile = path.join(compiledDir, `${themeName}.css`);

  if (!fs.existsSync(inputFile)) {
    console.log(
      `${colors.yellow}⚠️  Skipping${colors.reset} ${colors.dim}${themeName}${colors.reset} ${colors.dim}(no _main.scss)${colors.reset}`
    );
    return { success: false, name: themeName };
  }

  try {
    const result = sass.compile(inputFile, {
      sourceMap: false,
      style: "expanded",
      silenceDeprecations: ["import", "global-builtin"],
    });

    fs.writeFileSync(outputFile, result.css);

    return { success: true, name: themeName };
  } catch (error) {
    console.log(
      `${colors.red}❌ Error:${colors.reset} ${themeName} - ${colors.dim}${error.message}${colors.reset}`
    );
    return { success: false, name: themeName, error: error.message };
  }
}

function compileAllThemes() {
  const themes = getThemeFolders();

  console.log(
    `\n${colors.bright}${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.cyan}║     Theme Builder 🔨                  ║${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`
  );

  console.log(
    `${colors.blue}📦 Found ${themes.length} theme(s)${colors.reset}\n`
  );

  const lightThemes = themes.filter((t) => t.startsWith("light-"));
  const darkThemes = themes.filter((t) => t.startsWith("dark-"));

  if (lightThemes.length > 0) {
    console.log(`${colors.yellow}☀️  Light themes:${colors.reset}`);
    lightThemes.forEach((theme) => {
      console.log(`   ${colors.dim}•${colors.reset} ${theme}`);
    });
    console.log();
  }

  if (darkThemes.length > 0) {
    console.log(`${colors.magenta}🌙 Dark themes:${colors.reset}`);
    darkThemes.forEach((theme) => {
      console.log(`   ${colors.dim}•${colors.reset} ${theme}`);
    });
    console.log();
  }

  console.log(
    `${colors.cyan}⚡ Compiling themes...${colors.reset}\n`
  );

  const results = themes.map((theme) => compileTheme(theme));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(
    `\n${colors.bright}${colors.green}✨ Build complete!${colors.reset}`
  );
  console.log(
    `   ${colors.green}${successful} compiled${colors.reset}${failed > 0 ? ` ${colors.dim}• ${colors.red}${failed} failed${colors.reset}` : ""
    }`
  );
  console.log(
    `   ${colors.dim}Output: ${compiledDir}${colors.reset}\n`
  );
}

function watchThemes() {
  console.log(
    `${colors.blue}👀 Watching for changes...${colors.reset}`
  );
  console.log(
    `${colors.dim}   Press Ctrl+C to stop${colors.reset}\n`
  );

  const themes = getThemeFolders();

  themes.forEach((themeName) => {
    const themeDir = path.join(themesDir, themeName);

    fs.watch(themeDir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith(".scss")) {
        console.log(
          `\n${colors.green}📝 Change detected:${colors.reset} ${colors.cyan}${themeName}${colors.reset}/${colors.dim}${filename}${colors.reset}`
        );
        const result = compileTheme(themeName);
        if (result.success) {
          console.log(
            `${colors.green}✅ Recompiled successfully${colors.reset}\n`
          );
        }
      }
    });
  });

  const componentsDir = path.resolve(__dirname, "../components");
  if (fs.existsSync(componentsDir)) {
    fs.watch(componentsDir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith(".scss")) {
        console.log(
          `\n${colors.yellow}📝 Component changed:${colors.reset} ${colors.dim}${filename}${colors.reset}`
        );
        console.log(`${colors.cyan}♻️  Recompiling all themes...${colors.reset}\n`);
        compileAllThemes();
      }
    });
  }
}

const args = process.argv.slice(2);
const isWatchMode = args.includes("--watch") || args.includes("-w");

compileAllThemes();

if (isWatchMode) {
  watchThemes();
} else {
  process.exit(0);
}
