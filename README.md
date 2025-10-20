# Warframe Market - Custom Themes 🎨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D14-brightgreen)](https://nodejs.org/)

A custom theme generator for Warframe Market with automated tools and an intuitive interface. Make your trading hub look as sharp as your fashion frame.

Enhanced fork of [42bytes-team/wfm-themes](https://github.com/42bytes-team/wfm-themes)

---

## ✨ Features

- 🎨 **Theme Generator**: Create new themes in one command, no forma required
- 🔨 **Automated Build**: Modern Sass compilation that's faster than Volt
- 🎯 **Interactive Selector**: Pick your light and dark themes with a clean menu
- 🔄 **Dev Mode**: Watch mode that auto-rebuilds when you modify your SCSS
- 📦 **Built-in Themes**: dark-original, light-original, dark-golden, light-golden, dark-crimson, light-crimson

---

## 🖼️ Examples

| Dark Crimson 1 | Light Crimson 1 | Dark Crimson 2 | Light Crimson 2 |
|----------------|----------------|-----------------|-----------------|
| <img src="https://i.imgur.com/TYtz0oY.png" width="300"/> | <img src="https://i.imgur.com/UMa6PdA.png" width="300"/> | <img src="https://i.imgur.com/NFzcA04.png" width="300"/> | <img src="https://i.imgur.com/v7r4ffD.png" width="300"/> |

| Dark Golden 1 | Light Golden 1 | Dark Golden 2 | Light Golden 2 |
|----------------|----------------|-----------------|-----------------|
| <img src="https://i.imgur.com/uCSiRYD.png" width="300"/> | <img src="https://i.imgur.com/W6UZM1R.png" width="300"/> | <img src="https://i.imgur.com/UsDqBZo.png" width="300"/> | <img src="https://i.imgur.com/YFI0uGq.png" width="300"/> |

---

## 📋 Requirements

- [Node.js](https://nodejs.org/) v14 or newer
- npm (comes with Node.js)

---

## 🚀 Installation

```
git clone https://github.com/EroiiKZz/fashion-wfmarker.git
cd wfm-themes
npm install
```

---

## 🎮 Quick Start (3 Steps)

### 1. Choose Your Themes

```
npm run select
```

A menu appears where you pick:
- A **light** theme (for when you're trading in bright mode)
- A **dark** theme (for when you're trading in the void)

### 2. Copy the Generated File

The file `utils/user-style.styl` is automatically created with your two selected themes.

### 3. Install in Stylus

1. Install the [Stylus](https://github.com/openstyles/stylus) extension:
   - [Chrome/Edge](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)
   - [Firefox](https://addons.mozilla.org/firefox/addon/styl-us/)

2. Click the Stylus icon, **MAKE SURE TO TICK USER CSS** and "Write new style"

<img src="https://github.com/user-attachments/assets/c229c465-3871-4393-a194-4c1ad89b1f0e" height="60px" target="_blank">

3. Copy the entire content of `utils/user-style.styl` and paste it

4. Save → Your themes are now live on warframe.market!

---

## 🛠️ Create Your Own Theme

### Quick Method (Recommended)

```
npm run new
```

The script asks for a name (example: "Ocean", "Sunset", "Neon") and automatically creates:
- `themes/light-your-name/`
- `themes/dark-your-name/`

### Customize the Colors

Open the created files and modify the color variables in `_variables.scss`:

**Example:**
```
$color_background: #1a1a1a;        // Main background
$color_text: #ffffff;              // Text color
$color_link: #66b3ff;              // Link color
$color_place_order: #4caf50;       // Buy/Sell button
```

**Tip:** Use modern Sass functions for dynamic colors:
```
$lighter: color.scale(#ff6b6b, $lightness: 20%);
$darker: color.scale(#ff6b6b, $lightness: -20%);
```

### Compile and Test

```
npm run build    # Compiles all themes
npm run select   # Choose your new themes
```

---

## 📜 Available Commands

| Command | Description |
|---------|-------------|
| `npm run new` | 🆕 Create a new theme (light + dark) |
| `npm run build` | 🔨 Compile all themes once |
| `npm run select` | 🎯 Pick 2 themes and generate the Stylus file |
| `npm run watch` | 👀 Watch mode: auto-recompile when SCSS changes |
| `npm run dev` | 🚀 Full dev mode (build + watch + stylus) |
| `npm run reset` | ♻️ Reset selection and choose new themes |

---

## 📁 Project Structure

```
wfm-themes/
├── themes/                    # Your SCSS themes
│   ├── light-original/       # Official Warframe Market light theme
│   ├── dark-original/        # Official Warframe Market dark theme
│   └── your-theme/           # Created with 'npm run new'
├── compiled/                  # Compiled CSS (auto-generated)
├── utils/                     # Utility scripts
│   ├── build-themes.js       # Sass compiler
│   ├── create-theme.js       # Theme generator
│   ├── inject-theme-stylus.js # Theme selector
│   └── user-style.styl       # File to copy into Stylus (generated)
├── components/                # Reusable SCSS components
├── _common.scss              # Shared styles
└── package.json
```

---

## ❓ FAQ

### Can I use a dark theme for light mode?

Yep! The script lets you pick any theme for either mode. Mix and match however you want.

### My changes aren't showing up?

1. Make sure you compiled: `npm run build`
2. Run the selector again: `npm run select`
3. Copy the new `utils/user-style.styl` content into Stylus
4. **IMPORTANT:** Make sure "User Style" is checked in Stylus
5. Reload warframe.market (Ctrl+F5)

### How do I change themes later?

```
npm run reset
```

Or delete `utils/.theme-selection.json` and run `npm run select` again.

---

## 🔍 Troubleshooting

**Error: "No compiled themes found"**
- Run `npm run build` first to compile all themes

**Stylus doesn't inject the style**
- Make sure you ticked "User Style" when creating the style in Stylus
- Verify the style is enabled (toggle switch should be green)

**Themes look broken or don't apply**
- Clear your browser cache (Ctrl+Shift+Delete)
- Make sure you're on warframe.market domain
- Check browser console (F12) for errors

---

## 🔧 Advanced Dev Mode

If you're actively working on themes, use dev mode:

```
npm run dev
```

This runs:
- The **builder** that auto-recompiles your SCSS when you save
- The **stylus updater** that regenerates `user-style.styl` on changes

Just reload warframe.market to see your updates!

---

## 🎯 How Theme Selection Works

Warframe Market only uses two CSS classes:
- `.theme--light` for light mode
- `.theme--dark` for dark mode

When you select your themes, the script:
1. Takes the CSS from your two chosen themes
2. Automatically renames their classes to `.theme--light` and `.theme--dark`
3. Combines them into a single `user-style.styl` file

Result: Your custom themes activate automatically when you switch modes on Warframe Market!

---

## 📄 License

MIT

---

## 🙏 Credits

- Original fork: [42bytes-team/wfm-themes](https://github.com/42bytes-team/wfm-themes)
- Enhanced by: [EroiiKZz](https://github.com/EroiiKZz)
- Warframe Market: [warframe.market](https://warframe.market)

---

**Happy theming and happy farming, Tenno!** 🎮✨