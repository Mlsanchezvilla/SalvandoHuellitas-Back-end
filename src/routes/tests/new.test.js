const request = require('supertest')
const server = require('../../server');



it('Can send emails with valid inputs', async() =>{
    return request(server)
    .post('/api/mail')
    .send({
            to:'cinthyasm_@hotmail.com',
             subject: 'Subject',
             text: 'somo random text',
             html: '<strong>Some random html code</strong>',
             sandboxMode: true
            })
            .expect(201);
    });


    it('Returns a 400 status code with invalid credentials', async() =>{
        return request(server)
    .post('/api/mail')
    .send({
            to:'',
             subject: '',
             text: 'somo random text',
             html: '<strong>Some random html code</strong>',
             sandboxMode: true
            })
            .expect(400);
    });
    