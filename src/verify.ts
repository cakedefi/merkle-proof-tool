import { readJsonFile } from './file';
import { Assets, assetsSumDiscrepancies, checkTreeIntegrity, findLeaf, TreeNode } from './tree';
import parseArgs from 'minimist';

const args = parseArgs(process.argv.slice(2));

readJsonFile(args.tree)
    .then((tree: TreeNode) => {
        if (!tree) {
            throw Error('ERROR: Merkle tree is empty');
        }

        const root: Assets = tree.assets;
        const timeOfSnapshot: number = tree.timeOfSnapshot || 0;
        const allHashesChecksOut: boolean = checkTreeIntegrity(tree);
        const userLeaf: Assets | null = findLeaf(tree, args.hash);
        const summationDiscrepancies: boolean = assetsSumDiscrepancies(tree);

        if (allHashesChecksOut) {
            console.log('✅ Merkle tree checksum integrity checks out.');
        } else {
            console.error('❗There was a problem with the Merkle tree checksum integrity.');
        }

        if (!!userLeaf) {
            console.log(`✅ User leaf ${args.hash} was found in the Merkle tree.`);
        } else {
            console.error(`❗User leaf ${args.hash} was not found in the merkle Tree.`);
        }

        if (!summationDiscrepancies) {
            console.log(`✅ All asset nodes in the Merkle tree are correctly summarized.`);
        } else {
            console.error('❗An asset summation error was found in one of the tree nodes.');
        }

        if (args.verbose) {
            console.log();
            console.log('---------- Merkle root ----------');
            console.log(JSON.stringify(root, null, 2));
            console.log('---------------------------------');
            console.log();
            console.log('--------- Verified leaf ---------');
            console.log(JSON.stringify(userLeaf, null, 2));
            console.log('---------------------------------');
        }

        if (allHashesChecksOut && !!userLeaf && !summationDiscrepancies) {
            console.log('✅ Verification success!');
        } else {
            throw null;
        }
    })
    .catch((error) => {
        if (!!error) {
            console.error(error);
        }
        console.error('❗Verification failed.');
        process.exit(1);
    });
