var mocha = require('mocha');
var assert = require('assert');
//Describe test
describe('some demo test', function(){
    //Create tests
    it('adds two numbers together', function(){
        assert(2 + 3 === 5);
    });
});