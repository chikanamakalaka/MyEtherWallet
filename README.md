## Getting started

1. Open terminal
2. Clone the repo: `git clone git@github.com:MyEtherWallet/MyEtherWallet.git`
3. run `npm ci` to install node packages.
4. run `npm run build`. You can also use the offline version by opening the index file from the dist folder with your preferred browser
5. start `npm start`
6. If `npm start` fails and above the error message it states 'new update found' then the package.json version of the indicated packages needs to be updated to match the versions shown in the notice.
7. App should be running in `https://localhost:8080`

## Developers

1. Open terminal
2. Clone the repo: `git clone git@github.com:MyEtherWallet/MyEtherWallet.git`
3. run `git checkout develop`
4. run `npm ci` to install node packages.
5. run `npm run build`. You can also use the offline version by opening the index file from the dist folder with your preferred browser
6. start `npm run dev`
7. App should be running in `https://localhost:8080`

EACCESS issue can be resolved by running: `sudo chown -R $(whoami) ~/.npm`
For other issues, try the steps shown here: <https://github.com/MyEtherWallet/MyEtherWallet/issues/1182#issuecomment-506342875> by @tomwalton78
