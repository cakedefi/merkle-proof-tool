import deepEqual from 'deep-equal';
import bigDecimal from 'js-big-decimal';
import sha1 from 'sha1';

export interface AssetCollection {
    [key: string]: string;
}

export interface Assets {
    [key: string]: AssetCollection;
}

export interface TreeNode {
    hash: string;
    assets: Assets;
    timeOfSnapshot?: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

export const createStructuralNodeHash = (node: TreeNode): string => {
    if (!node || !node.assets || !node.left || !node.left.hash || !node.right || !node.right.hash) {
        throw '❗Hash calculation error in structural node';
    }
    return sha1(JSON.stringify([node.assets, node.left.hash, node.right.hash]));
};

export const checkTreeIntegrity = (tree: TreeNode): boolean => {
    let allHashesChecksOut = true;

    const checkNextNode = (node: TreeNode | null): void => {
        if (!node || (!node.left && !node.right)) {
            return;
        }

        const hash: string = createStructuralNodeHash(node);
        if (hash !== node.hash) {
            allHashesChecksOut = false;
        }

        checkNextNode(node.left);
        checkNextNode(node.right);
    };

    checkNextNode(tree);
    return allHashesChecksOut;
};

export const findLeaf = (tree: TreeNode, leafID: string): Assets | null => {
    let leafFound: Assets | null = null;

    const lookForLeaf = (node: TreeNode | null): void => {
        if (!node || leafFound) {
            return;
        }

        if (leafID === node.hash) {
            leafFound = node.assets;
        }
        lookForLeaf(node.left);
        lookForLeaf(node.right);
    };

    lookForLeaf(tree);
    return leafFound;
};

const mergeAssetCollection = (first: AssetCollection, second: AssetCollection): AssetCollection => {
    const firstKeys: Array<string> = Object.keys(first);
    const secondKeys: Array<string> = Object.keys(second);
    const allKeys: Array<string> = firstKeys.concat(secondKeys);
    const result: AssetCollection = {};

    allKeys.forEach((coin: string) => (result[coin] = bigDecimal.add(first[coin] || '0', second[coin] || '0').toString()));

    return result;
};

export const mergeAssets = (first: Assets, second: Assets): Assets => {
    const firstKeys: Array<string> = Object.keys(first);
    const secondKeys: Array<string> = Object.keys(second);
    const allKeys: Array<string> = firstKeys.concat(secondKeys);
    const result: Assets = {};

    allKeys.forEach((assetClass: string) => (result[assetClass] = mergeAssetCollection(first[assetClass] || {}, second[assetClass] || {})));

    return result;
};

export const assetsSumDiscrepancies = (tree: TreeNode): boolean => {
    let summationDiscrepancies: boolean = false;

    const calculateNode = (node: TreeNode | null) => {
        if (!node || !node.left || !node.left.assets || !node.right || !node.right.assets) {
            return;
        }

        const assetsFromChildren = mergeAssets(node.left.assets, node.right.assets);

        if (!deepEqual(assetsFromChildren, node.assets)) {
            summationDiscrepancies = true;
        }

        calculateNode(node.left);
        calculateNode(node.right);
    };

    calculateNode(tree);
    return summationDiscrepancies;
};
