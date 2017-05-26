# Instalation
*Prerequisites*
Installed nodejs, npm and browserify

1. Install packages `npm install`

## Chrome Extension
1. Run build command `npm run build` - it will create bundles in `dist/chrome_ext`
2. Open Chrome browser and enter: `chrome://extensions/`
3. Click on the checkbox `Developer Mode`
4. Click on the `Load unpacked extension` button and select path to `./dist/chrome_ext`

# Usage
## Node Script
Set the boardgamesgeek user/nr of players in app.js file
Run `node app.js`

## Chrome extension
Click on the extension and input boardgamesgeek.com username and number of players. Games will be displayed below after a short time (depending on internet connection).
