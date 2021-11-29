var AWS = require('aws-sdk');

AWS.config.loadFromPath('./credentials-ehl.json');

var s3 = new AWS.S3();
var params = {  Bucket: 'jiffertestbucket', Key: '*.*' };

s3.deleteObject(params, function(err, data) {
  if (err) console.log(err, err.stack);  // error
  else     console.log();                 // deleted
});