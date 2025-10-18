# Warframe Market - Custom Themes

Enhanced fork of [42bytes-team/wfm-themes](https://github.com/42bytes-team/wfm-themes) with modern build system, automatic browser injection, and live reload.

## Features

- 🎨 **4 Built-in Themes**: Dark Base, Light Base (Both Original WarframeMarket Themes) and Dark (Golden), Light (Golden)
- **[⚠️ Please read step 4 ⚠️](#step-4-update-the-theme-class)**
- 🔄 **Live Reload**: Automatic browser injection via Stylus
- ⚡ **Fast Build**: Concurrent Sass compilation with watch mode
- 🛠️ **Modern Sass**: Latest module system (no deprecated functions)

## Requirements

- [Node.js](https://nodejs.org/) (v14+)
- npm or yarn

## Installation

```
git clone https://github.com/EroiiKZz/wfm-themes.git
cd wfm-themes
npm install
```

## Usage

### Development Mode (Recommended)

```
npm run dev
```

Compiles all themes, watches for changes, and injects CSS into browser extension automatically.

### Build Only

```
npm run build
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile all themes once |
| `npm run watch` | Watch and recompile on change |
| `npm run stylus` | Update Stylus file from compiled CSS |
| `npm run dev` | Full dev mode (build + watch + stylus) |

## Browser Setup

### Option 1: Stylus (Live Reload)

**Best for development** - Auto-updates when you save files.

1. Install [Stylus](https://github.com/openstyles/stylus):
   - [Chrome/Edge](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)
   - [Firefox](https://addons.mozilla.org/firefox/addon/styl-us/)

2. Run development mode:
```
npm run dev
```

3. Open Stylus extension → Click "Write new style"

4. Copy the entire content of `utils/user-style.styl` and paste it into the Stylus editor

5. Save - your themes are live on warframe.market!

6. **Live Updates**: Any changes you make to `.scss` files will automatically update `user-style.styl`. Just reload warframe.market to see changes.

### Option 2: Stylebot or Other Extensions

**Best for simple usage** - Just copy-paste the compiled CSS.

1. Install your preferred CSS injection extension:
   - [Stylebot for Chrome](https://chrome.google.com/webstore/detail/stylebot/oiaejidbmkiecgbjeifoejpgmdaleoha)
   - [Custom CSS for Firefox](https://addons.mozilla.org/firefox/addon/custom-style-script/)

2. Compile the theme you want:
```
npm run build
```

3. Open the compiled CSS file from `compiled/` folder (e.g., `compiled/dark-golden.css`)

4. Copy the entire CSS content

5. Open your extension on warframe.market and paste the CSS

6. Save and enjoy!

**Note**: With this method, you need to manually recompile and update when you make changes.

## Creating Your Own Theme

### Step 1: Create Theme Folder

Create a new folder in `themes/` with your theme name:

```
mkdir themes/my-custom-theme
```

### Step 2: Copy an Existing Theme

Copy either `dark-base` or `light-base` as your starting point:

**For a dark theme:**
```
cp -r themes/dark-base themes/my-custom-theme
```

**For a light theme:**
```
cp -r themes/light-base themes/my-custom-theme
```

### Step 3: Customize the Variables

Edit `themes/my-custom-theme/_variables.scss` and modify the colors to your liking.

**Important color variables:**
- Background colors: `$color_background`, `$color_background--light`, `$color_background--darker`
- Border colors: `$color_border`, `$color_border--light`, `$color_border--darker`
- Text colors: `$color_text`, `$color_h1`, `$color_h2`, etc.
- Link colors: `$color_link`, `$color_link--hover`, `$color_link--active`
- Button colors: `$color_place_order`, `$color_create_auction`
- Alert colors: `$color_success_*`, `$color_warning_*`, `$color_danger_*`

**Tip**: Use modern Sass color functions for dynamic adjustments:
```
// Lighten/darken a color
$lighter: color.scale(#ff6b6b, $lightness: 20%);
$darker: color.scale(#ff6b6b, $lightness: -20%);

// Adjust saturation
$desaturated: color.adjust(#ff6b6b, $saturation: -30%);
```

### Step 4: Update the Theme Class

**IMPORTANT**: Warframe Market only supports two theme classes: `.theme--dark` and `.theme--light`.

Edit `themes/my-custom-theme/_main.scss`:

**For a custom dark theme** (replaces the default dark theme):
```
@import 'variables';
@import '../../common';

.theme--dark {
  @include makeTheme();
}
```

**For a custom light theme** (replaces the default light theme):
```
@import 'variables';
@import '../../common';

.theme--light {
  @include makeTheme();
}
```

**Alternative: Support both dark and light** (for maximum compatibility):
```
@import 'variables';
@import '../../common';

.theme--dark,
.theme--light {
  @include makeTheme();
}
```

> **Note**: If you want to keep your custom class name like `.theme--my-custom-theme`, you'll need to manually add it to the `body` or `html` tag using browser dev tools or a custom script, as Warframe Market doesn't natively support custom theme classes.

### Step 5: Compile Your Theme

Run the development mode:

```
npm run dev
```

Your theme will be automatically detected, compiled to `compiled/my-custom-theme.css`, and added to the Stylus file!

### Step 6: Select Your Theme on Warframe Market

1. Go to [warframe.market](https://warframe.market)
2. Navigate to the footer and choose "Dark" or "Light" theme (depending on which class you used in Step 4)
3. Your custom theme will be applied!

## Advanced: Using Custom Theme Classes

If you want to use a custom class name like `.theme--my-custom-theme` instead of overriding `.theme--dark` or `.theme--light`, you have two options:

### Option A: Force Apply to Body

Modify your `_main.scss` to target the body directly:

```
@import 'variables';
@import '../../common';

body {
  @include makeTheme();
}
```

This will apply your theme regardless of the theme setting on Warframe Market.

### Option B: JavaScript Theme Switcher (Advanced Users)

Create a browser extension or userscript that changes the theme class on the body:

```
// Example: Force custom theme
document.body.className = document.body.className.replace(/theme--\w+/, 'theme--my-custom-theme');
```

Then use your custom class name in `_main.scss`:

```
.theme--my-custom-theme {
  @include makeTheme();
}
```

## Project Structure

```
wfm-themes/
├── themes/              # Theme source files
│   ├── dark-base/       # Original dark theme
│   ├── dark-golden/
│   ├── light-base/      # Original light theme
│   ├── light-golden/
│   └── my-custom-theme/ # Your new theme here!
├── components/          # Reusable style components
├── compiled/            # Generated CSS files
├── utils/               # Build utilities
│   ├── inject-theme-stylus.js
│   └── user-style.styl  # Auto-updated with all themes
├── _common.scss         # Shared styles and mixins
├── _functions.scss      # Sass utility functions
└── build-themes.js      # Main build script
```

## Troubleshooting

**Theme not compiling?**
- Make sure `_main.scss` and `_variables.scss` exist in your theme folder
- Check for syntax errors in your SCSS files
- Run `npm run build` to see detailed error messages

**Theme not showing in browser?**
- Make sure you're using `.theme--dark` or `.theme--light` class in your `_main.scss`
- For Stylus: Make sure `npm run dev` is running and you've copied the latest `user-style.styl`
- For other extensions: Re-copy the CSS from `compiled/` folder
- Clear browser cache and reload warframe.market
- Check that you've selected the correct theme (Dark/Light) in Warframe Market settings

**Custom theme class not working?**
- Warframe Market only supports `.theme--dark` and `.theme--light` by default
- Either use one of these classes, or apply styles directly to `body` (see Advanced section)

**Colors not applying correctly?**
- Check that all required variables are defined (copy from dark-base or light-base)
- Use `color.scale()` or `color.adjust()` instead of deprecated `lighten()`/`darken()`
- Make sure `@use "sass:color";` is at the top of `_variables.scss`

## What's New

- ✅ Modern Sass (`@use` instead of deprecated functions)
- ✅ Automated build pipeline with Node.js
- ✅ Live browser injection with debouncing
- ✅ Watch mode for all themes simultaneously
- ✅ No global Sass installation needed
- ✅ Better project structure

## License

MIT

## Credits

Fork of [42bytes-team/wfm-themes](https://github.com/42bytes-team/wfm-themes)

Enhanced by [EroiiKZz](https://github.com/EroiiKZz)
```