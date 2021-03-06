var assert = require('assert');
var http = require('http');
var app = require('../../examples/providers');
var request = require('supertest')(app);

describe('Providers Example', function() {
    it('exists', function() {
        assert(app != undefined);
    });

    it('checks accept-language: en', function(done) {
        request
            .get('/languages')
            .set('Accept-Language', 'en')
            .expect('In English', done);
    });

    it('checks accept-language: es', function(done) {
        request
            .get('/languages')
            .set('Accept-Language', 'es')
            .expect('En Español', done);
    });

    it('handles unsupported languages', function(done) {
        request
            .get('/languages')
            .set('Accept-Language', 'fr')
            .expect('Requested language(s) not supported', done);
    });

    it('checks range - not provided', function(done) {
        request
            .get('/range')
            .expect('No range header specified', done);
    });

    it('checks range - single', function(done) {
        var expRes = 'Range: "bytes"\n\tStart: 0,\tEnd: 100';
        request
            .get('/range')
            .set('Range', 'bytes=0-100')
            .expect(expRes, done);
    });

    it('checks range - multiple', function(done) {
        var expRes = 'Range: "bytes"\n\tStart: 0,\tEnd: 100' +
            '\n\tStart: 100,\tEnd: 200';
        request
            .get('/range')
            .set('Range', 'bytes=0-100,100-200')
            .expect(expRes, done);
    });

    it('checks range - within limits', function(done) {
        var expRes = 'Range: "bytes"\n\tStart: 0,\tEnd: 1023';
        request
            .get('/range')
            .set('Range', 'bytes=0-2000')
            .expect(expRes, done);
    });

    it('checks content-type - valid', function(done) {
        request
            .post('/typeis')
            .send({name:'bob'})
            .expect('Thanks for the JSON :)', done);
    });

    it('checks content-type - invalid', function(done) {
        request
            .post('/typeis')
            .send('hello world')
            .expect('Only application/json is accepted', done);
    });

    it('alt: checks content-type - valid', function(done) {
        request
            .post('/typeis-alt')
            .send({name:'bob'})
            .expect('Thanks for the JSON :)', done);
    });

    it('alt: checks content-type - invalid', function(done) {
        request
            .post('/typeis-alt')
            .send('hello world')
            .expect('Only application/json is accepted', done);
    });
});
