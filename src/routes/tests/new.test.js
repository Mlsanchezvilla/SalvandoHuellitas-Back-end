const request = require('supertest')
const server = require('../src/server')


it('Can send emails with valid inputs', async() =>{
    return request(server)
    .post('/api/mail')
    .send({
            to:'cinthyasm_@hotmail.com',
             subject: 'Subject',
             text: 'somo random text',
             html: '<strong>Some random html code</strong>',
            })
            .expect(201);
    })