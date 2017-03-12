var Mongoose    = require('mongoose').Mongoose;
var mongoose    = new Mongoose();

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

before(function(done) {
    this.timeout(5000);
    setTimeout(function() {
      done();
    }, 5000);

   mockgoose.prepareStorage().then(function() {
        done();
    });
});