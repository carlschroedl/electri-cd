const lambda = require('../../../src/handlers/index.js');

describe('Test Handler', function () {
    it('Verifies successful response', async () => {
        const result = await lambda.handler({url: 'https://github.com/carlschroedl/deployment-example/releases/download/latest/example.zip'});
        const expectedResult = {"body": "\"HELLO DEPLOYMENT\\n\"", "statusCode": 200};
        // Compare the result with the expected result
        expect(result).toEqual(expectedResult);
    });
});
