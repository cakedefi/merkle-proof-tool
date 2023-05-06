
# Merkle tree and leaf verifier #

## Summary ##
This is a terminal/bash tool written in TypeScript that verifies that a merkle tree is intact and that it contains a specified leaf.

### Prerequsites ###
You must have nodeJS and npm installed on your computer for this tool to work.

https://nodejs.org/en/download/

https://docs.npmjs.com/downloading-and-installing-node-js-and-npm


### How to install ###
```bash
git clone https://github.com/cakedefi/merkle-proof-tool.git
cd merkle-proof-tool
npm install
npm run build
```
### How to run ###
#### Using npm ####
```bash
npm run verify -- --tree=<path/treeFileName.json> --hash=<yourHash> --verbose
```
Example:
```bash
npm run verify -- --tree=merkleTree.json --hash=09e052471f2e9e7f4cda07975bbd4b41d8bdcf6c --verbose
```
#### Using the nodeJS runtime directly ###
```bash
node build/verify.js --tree=<path/treeFileName.json> --hash=<yourHashID03844b51f158cb5eabd7328f6c66c8e2c7d6ea4b > --verbose
```
(please note that you must add the ```--``` parameter only if using npm but not when using nodeJS)

#### parameters ####
```--tree=<path/treeFileName.json>``` (mandatory) - is used for specifying the path and filename to the merkle tree JSON file.

```--hash=<yourHashID>``` (mandatory) - This is the hash ID for the assets/leaf that you want to verify in the tree.

```--verbose``` (optional) - This parameter will make the verifier output the merkle tree root and the leaf as JSON objects in the console.


### How to develop ###
Feel free to put up a PR to contribute and make improvements to this tool.

```npm run build``` Will transpile all the .ts files into .js and put the result in the ```./build``` folder.

```npm test``` Will run all the tests and output a code coverage report in the console and in the ```./coverage``` folder.