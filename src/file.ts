import fs from 'fs';

export const readJsonFile = (fileName: string): Promise<any> =>
    new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (fileError, data) => {
            if (fileError) {
                reject(fileError);
            }

            let result = null;
            try {
                result = JSON.parse(data);
            } catch (error) {
                reject('Failed to parse JSON content');
            }

            if (result) {
                resolve(result);
            }

            reject('Unknown Error');
        });
    });
