const tableName = process.env.SAMPLE_TABLE;
const region = process.env.REGION;
const awsEnvironment = process.env.AWS_ENV;
const devEnvironment = process.env.DEV_ENV;

console.log({ tableName, region, awsEnvironment, devEnvironment });

if (awsEnvironment === "AWS_SAM_LOCAL") {
  const AWS = require("aws-sdk");
  const endpoint =
    devEnvironment === "OSX"
      ? "http://docker.for.mac.localhost:8000/"
      : devEnvironment === "Windows"
      ? "http://docker.for.window.localhost:8000/"
      : "http://127.0.0.1:80000";

  AWS.config.update({ region, endpoint });
}

const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.getAllItemsHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getAllItems only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  // get all items from the table (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
  var params = {
    TableName: tableName,
  };
  console.log({ params });
  const data = await docClient.scan(params).promise();
  const items = data.Items;

  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
