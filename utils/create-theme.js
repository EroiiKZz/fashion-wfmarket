const path = require("path");
const fs = require("fs");
const readline = require("readline");

const themesDir = path.resolve(__dirname, "../themes");

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
};

function copyFolderSync(source, destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);

    files.forEach((file) => {
        const srcPath = path.join(source, file);
        const destPath = path.join(destination, file);

        if (fs.statSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

function replaceThemeNameInFile(filePath, oldThemeName, newThemeName) {
    try {
        let content = fs.readFileSync(filePath, "utf8");

        const regex = new RegExp(`\\.theme--(light|dark)--${oldThemeName}`, "g");
        content = content.replace(regex, `.theme--$1--${newThemeName}`);

        fs.writeFileSync(filePath, content, "utf8");

        return true;
    } catch (error) {
        console.error(
            `${colors.red}Error modifying ${filePath}:${colors.reset}`,
            error.message
        );
        return false;
    }
}

function toKebabCase(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function askQuestion(rl, query) {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

function themeExists(themeName) {
    return fs.existsSync(path.join(themesDir, themeName));
}

async function main() {
    console.log(
        `${colors.bright}${colors.magenta}╔════════════════════════════════════════╗${colors.reset}`
    );
    console.log(
        `${colors.bright}${colors.magenta}║     New Theme Generator 🎨            ║${colors.reset}`
    );
    console.log(
        `${colors.bright}${colors.magenta}╚════════════════════════════════════════╝${colors.reset}\n`
    );

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let themeName;

    while (true) {
        const input = await askQuestion(
            rl,
            `${colors.cyan}Enter your theme name (e.g., "Crimson", "Ocean Blue"):${colors.reset} `
        );

        if (!input.trim()) {
            console.log(`${colors.red}Theme name cannot be empty!${colors.reset}`);
            continue;
        }

        themeName = toKebabCase(input.trim());

        const lightExists = themeExists(`light-${themeName}`);
        const darkExists = themeExists(`dark-${themeName}`);

        if (lightExists || darkExists) {
            console.log(
                `${colors.red}A theme with this name already exists!${colors.reset}`
            );
            if (lightExists)
                console.log(`  - ${colors.yellow}light-${themeName}${colors.reset}`);
            if (darkExists)
                console.log(`  - ${colors.yellow}dark-${themeName}${colors.reset}`);
            console.log();
            continue;
        }

        break;
    }

    rl.close();

    console.log(
        `\n${colors.blue}Creating themes based on Warframe Market originals...${colors.reset}\n`
    );

    const lightSource = path.join(themesDir, "light-original");
    const darkSource = path.join(themesDir, "dark-original");
    const lightDest = path.join(themesDir, `light-${themeName}`);
    const darkDest = path.join(themesDir, `dark-${themeName}`);

    if (!fs.existsSync(lightSource) || !fs.existsSync(darkSource)) {
        console.log(`${colors.red}❌ Original themes not found!${colors.reset}`);
        console.log(
            `   Make sure ${colors.yellow}light-original${colors.reset} and ${colors.yellow}dark-original${colors.reset} exist in themes/ folder.`
        );
        process.exit(1);
    }

    try {
        copyFolderSync(lightSource, lightDest);
        copyFolderSync(darkSource, darkDest);

        console.log(`${colors.green}✅ Created:${colors.reset} light-${themeName}/`);
        console.log(`${colors.green}✅ Created:${colors.reset} dark-${themeName}/`);

        const lightMainPath = path.join(lightDest, "_main.scss");
        const darkMainPath = path.join(darkDest, "_main.scss");

        console.log(
            `\n${colors.blue}Updating theme class names...${colors.reset}`
        );

        if (fs.existsSync(lightMainPath)) {
            if (replaceThemeNameInFile(lightMainPath, "original", themeName)) {
                console.log(
                    `${colors.green}✅ Updated:${colors.reset} .theme--light--${themeName}`
                );
            }
        }

        if (fs.existsSync(darkMainPath)) {
            if (replaceThemeNameInFile(darkMainPath, "original", themeName)) {
                console.log(
                    `${colors.green}✅ Updated:${colors.reset} .theme--dark--${themeName}`
                );
            }
        }

        console.log(
            `\n${colors.bright}${colors.green}🎉 Success!${colors.reset} Your new themes are ready.\n`
        );
        console.log(`${colors.cyan}Theme structure created:${colors.reset}`);
        console.log(
            `  ${colors.yellow}themes/light-${themeName}/_main.scss${colors.reset}`
        );
        console.log(
            `    └─ ${colors.magenta}.theme--light--${themeName} { ... }${colors.reset}`
        );
        console.log(
            `  ${colors.yellow}themes/dark-${themeName}/_main.scss${colors.reset}`
        );
        console.log(
            `    └─ ${colors.magenta}.theme--dark--${themeName} { ... }${colors.reset}\n`
        );

        console.log(`${colors.cyan}Next steps:${colors.reset}`);
        console.log(
            `  1. Edit ${colors.yellow}themes/light-${themeName}/_variables.scss${colors.reset}`
        );
        console.log(
            `  2. Edit ${colors.yellow}themes/dark-${themeName}/_variables.scss${colors.reset}`
        );
        console.log(
            `  3. Run ${colors.magenta}npm run build${colors.reset} to compile`
        );
        console.log(
            `  4. Run ${colors.magenta}npm run select${colors.reset} to use your themes\n`
        );
    } catch (error) {
        console.log(
            `${colors.red}❌ Error creating themes:${colors.reset} ${error.message}`
        );
        process.exit(1);
    }
}

main();
