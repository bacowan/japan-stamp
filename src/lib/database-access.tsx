// Load the AWS SDK for Node.js
/*var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "ap-northeast-1" });

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
console.log(process.env.AWS_REGION)

export const main = async () => {
  var params = {
    TableName: "Stamps",
  };
  
  ddb.query(params, function (err: any, data: { Items: any[]; }) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Items);
      data.Items.forEach(function (element, index, array) {
        console.log(element.Title.S + " (" + element.Subtitle.S + ")");
      });
    }
  });
};*/