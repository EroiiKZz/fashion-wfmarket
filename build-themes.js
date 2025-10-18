const fs = require("fs");
const path = require("path");
const sass = require("sass");

const themesDir = path.resolve(__dirname, "themes");
const compiledDir = path.resolve(__dirname, "compiled");

// Create compiled directory if it doesn't exist
if (!fs.existsSync(compiledDir)) {
  fs.mkdirSync(compiledDir, { recursive: true });
}

// Get all theme folders in themes/
function getThemeFolders() {
  return fs
    .readdirSync(themesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

// Compile a single theme
function compileTheme(themeName) {
  const inputFile = path.join(themesDir, themeName, "_main.scss");
  const outputFile = path.join(compiledDir, `${themeName}.css`);

  // Check if _main.scss exists
  if (!fs.existsSync(inputFile)) {
    console.warn(`⚠️  Skipping ${themeName}: _main.scss not found`);
    return;
  }

  try {
    const result = sass.compile(inputFile, {
      sourceMap: true,
      style: "expanded",
      silenceDeprecations: ["import", "global-builtin"],
    });

    fs.writeFileSync(outputFile, result.css);
    if (result.sourceMap) {
      fs.writeFileSync(`${outputFile}.map`, JSON.stringify(result.sourceMap));
    }

    console.log(`✅ Compiled: ${themeName} -> ${outputFile}`);
  } catch (error) {
    console.error(`❌ Error compiling ${themeName}:`, error.message);
  }
}

// Compile all themes
function compileAllThemes() {
  const themes = getThemeFolders();
  console.log(`\n🔨 Found ${themes.length} theme(s): ${themes.join(", ")}\n`);

  themes.forEach((theme) => compileTheme(theme));
  console.log("\n✨ Build complete!\n");
}

// Watch mode
function watchThemes() {
  console.log("👀 Watching for changes...\n");

  const themes = getThemeFolders();

  themes.forEach((themeName) => {
    const themeDir = path.join(themesDir, themeName);

    // Watch the entire theme folder for changes
    fs.watch(themeDir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith(".scss")) {
        console.log(`\n📝 Change detected in ${themeName}/${filename}`);
        compileTheme(themeName);
      }
    });
  });

  // Also watch components folder if it exists
  const componentsDir = path.resolve(__dirname, "components");
  if (fs.existsSync(componentsDir)) {
    fs.watch(componentsDir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith(".scss")) {
        console.log(`\n📝 Change detected in components/${filename}`);
        console.log("♻️  Recompiling all themes...\n");
        compileAllThemes();
      }
    });
  }
}

// Main execution
const args = process.argv.slice(2);
const isWatchMode = args.includes("--watch") || args.includes("-w");

compileAllThemes();

if (isWatchMode) {
  watchThemes();
} else {
  process.exit(0);
}
