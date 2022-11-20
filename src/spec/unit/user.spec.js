const Request = require('request');
describe('Server', () =>{
    var server;
    beforeAll(() => {
        server = require('../../app');
    });
    afterAll(() => {
        server.close();
    });
    describe('GET / ', () => {
        let data = {};
        beforeAll((done) => {
            Request.get('http://localhost:3000/api', (error, reponse, body) => {
                data.status = reponse.statusCode;
                data.body = body;
                done();
            });
        });
        it("Status 200", () => {
            console.log(data);
            expect(data.status).toBe(200);
        })
    });
});
