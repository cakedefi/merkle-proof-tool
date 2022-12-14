import { describe, test, expect } from '@jest/globals';
import fs from 'fs';
import { assetsSumDiscrepancies, checkTreeIntegrity, createStructuralNodeHash, findLeaf, mergeAssets } from '../src/tree';

// Load the tree mocks
const correct = JSON.parse(fs.readFileSync('__tests__/mocks/merkleTreeTestData_correct.json', 'utf8'));
const empty = JSON.parse(fs.readFileSync('__tests__/mocks/merkleTreeTestData_empty.json', 'utf8'));
const sumeError = JSON.parse(fs.readFileSync('__tests__/mocks/merkleTreeTestData_sumError.json', 'utf8'));
const checkSumAttributeError = JSON.parse(fs.readFileSync('__tests__/mocks/merkleTreeTestData_checkSumAttributeError.json', 'utf8'));
const checkSumHashError = JSON.parse(fs.readFileSync('__tests__/mocks/merkleTreeTestData_checkSumHashError.json', 'utf8'));

const assetsMock1 = {
    lm: {
        AARK: '249.281',
        USDC: '128.879',
        USDT: '775.139',
        DOGE: '602.283',
    },
    staking: {
        DUSD: '765.982',
        USDC: '726.405',
        AARK: '735.73',
        BTC: '20.194',
        DFI: '996.877',
        USDT: '542.911',
    },
};

const assetsMock2 = {
    lending: {
        DFI: '325.459',
        ETH: '158.22',
    },
    staking: {
        AARK: '872.133',
        USDT: '182.191',
        DFI: '795.956',
        DOGE: '322.533',
        USDC: '997.842',
    },
    wallet: {
        USDC: '135.827',
        BTC: '475.783',
        AARK: '15.491',
    },
};

describe('Tree operation tests', () => {
    describe('Tree hashing and checksums', () => {
        test('Can re-create a structural node hash', () => {
            const hash = createStructuralNodeHash(correct);
            expect(hash).toBe(correct.hash);
        });

        test('Verify all the checksums in a tree', () => {
            const integrity = checkTreeIntegrity(correct);
            expect(integrity).toBe(true);
        });

        test('Verify that the checksum calculations fail if a hash is changed', () => {
            const integrity = checkTreeIntegrity(checkSumHashError);
            expect(integrity).toBe(false);
        });

        test('Verify that the checksum calculations fail if an attribute name is changed', () => {
            const integrity = checkTreeIntegrity(checkSumAttributeError);
            expect(integrity).toBe(false);
        });
    });

    describe('Finding nodes in a tree', () => {
        test('Verify that we can find a leaf that exists in the tree', () => {
            const assetLeaf = findLeaf(correct, '09e052471f2e9e7f4cda07975bbd4b41d8bdcf6c');
            expect(assetLeaf).toEqual({
                lending: {
                    USDC: '871.914',
                    USDT: '216.01',
                    BTC: '477.892',
                    DOGE: '797.397',
                },
                wallet: {
                    USDT: '96.936',
                    AARK: '605.586',
                    ETH: '648.076',
                    USDC: '75.131',
                    BTC: '921.133',
                },
            });
        });

        test('Verify that we cannot find a leaf that is not in the tree', () => {
            const assetLeaf = findLeaf(correct, 'thisIsAnErronousHash');
            expect(assetLeaf).toBe(null);
        });
    });

    describe('Summarizing asset nodes', () => {
        const expectedAssetSum = test('Verify that the sum of two assets nodes are correct', () => {
            const assetSum = mergeAssets(assetsMock1, assetsMock2);
            expect(assetSum).toEqual({
                lm: {
                    AARK: '249.281',
                    USDC: '128.879',
                    USDT: '775.139',
                    DOGE: '602.283',
                },
                staking: {
                    DUSD: '765.982',
                    USDC: '1724.247',
                    AARK: '1607.863',
                    BTC: '20.194',
                    DFI: '1792.833',
                    USDT: '725.102',
                    DOGE: '322.533',
                },
                lending: {
                    DFI: '325.459',
                    ETH: '158.22',
                },
                wallet: {
                    USDC: '135.827',
                    BTC: '475.783',
                    AARK: '15.491',
                },
            });
        });

        test('Verify that the sum of two assets nodes are correct when one node is empty', () => {
            const assetSum = mergeAssets(assetsMock1, {});
            expect(assetSum).toEqual(assetsMock1);
        });

        test('Verify that all the asset node sums in the whole tree are correct', () => {
            const discrapencies = assetsSumDiscrepancies(correct);
            expect(discrapencies).toBe(false);
        });

        test('Verify that a summation discrpaency is found if any asset value is changed', () => {
            const discrapencies = assetsSumDiscrepancies(sumeError);
            expect(discrapencies).toBe(true);
        });

        test('Verify that a summation discrpaency is found if any asset name is changed', () => {
            const discrapencies = assetsSumDiscrepancies(checkSumAttributeError);
            expect(discrapencies).toBe(true);
        });
    });

    describe('Handling an empty tree', () => {
        test('Fail to create structural node hash from an empty node', () => {
            expect(() => createStructuralNodeHash(empty)).toThrow('❗Hash calculation error in structural node');
        });

        test('Verify that we do not crash when checking the integrity of an empty', () => {
            const integrity = checkTreeIntegrity(empty);
            expect(integrity).toBe(true);
        });

        test('Verify that we do not crash when looking for a node in an empty tree', () => {
            const assetLeaf = findLeaf(empty, 'thisIsAnotherErronousHash');
            expect(assetLeaf).toBe(null);
        });

        test('Verify that we do not crash when looking for asset sum discrapencies in an empty tree', () => {
            const discrapencies = assetsSumDiscrepancies(empty);
            expect(discrapencies).toBe(false);
        });
    });
});
