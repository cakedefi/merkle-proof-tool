import { readJsonFile } from '../src/file';
import { describe, test, expect } from '@jest/globals';
import fs from 'fs';

const correctData = JSON.parse(fs.readFileSync('__tests__/mocks/merkleTreeTestData_correct.json', 'utf8'));

describe('FileReading tests', () => {
    test('Can read and parse a file containing correctly formatted JSON', (done) => {
        readJsonFile('__tests__/mocks/merkleTreeTestData_correct.json').then((result) => {
            expect(result).toEqual(correctData);
            done();
        });
    });

    test('Can not open a non existing file', (done) => {
        readJsonFile('blablabla.json').catch((error) => {
            expect(error.toString()).toEqual("Error: ENOENT: no such file or directory, open 'blablabla.json'");
            done();
        });
    });

    test('Can not parse a file with garbage content', (done) => {
        readJsonFile('__tests__/mocks/garbageContent.test').catch((error) => {
            expect(error).toBe('Failed to parse JSON content');
            done();
        });
    });

    test('Can not parse an empty file', (done) => {
        readJsonFile('__tests__/mocks/empty.test').catch((error) => {
            expect(error).toBe('Failed to parse JSON content');
            done();
        });
    });
});
