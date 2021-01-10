const lambda = require('../../../src/handlers/index.js');

describe('Test Handler', function () {
    it('Verifies successful response', async () => {
        const result = await lambda.handler();
        const expectedResult = 'OK';
        // Compare the result with the expected result
        expect(result).toEqual(expectedResult);
    });
});
