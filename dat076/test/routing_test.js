var request     = require('supertest');
var app         = require('../app');

describe('Routing tests', function(){
    it('Testing get function of homepage', function(done){
        request(app).get('/')
        .expect(200)
        .expect(/MedicalClinic/, done);
    });

    it('Testing get function of registration', function(done) {
        request(app).get('/register')
        .expect(200)
        .expect(/Register/, done);
    });

    it('Login page should be found', function(done) {
        request(app).post('/login')
        .expect(302, done);
    });

    it('Patient page should be found', function(done) {
        request(app).get('/patient')
        .expect(302, done);
    });

    it('Admin page should be found', function(done) {
        request(app).get('/admin')
        .expect(302, done);
    });

    it('Should not work', function(done) {
        request(app).get('/regist')
        .expect(404, done);
    });
});