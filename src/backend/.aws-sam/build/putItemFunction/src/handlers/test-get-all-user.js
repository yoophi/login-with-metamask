const logdown = require("logdown");
const logger = logdown("handshake-user");
logger.state.isEnabled = true;

const tableName = "UserTable";
const region = "ap-northeast-2";
const awsEnvironment = "AWS_SAM_LOCAL";
const devEnvironment = "OSX";

logger.log({ tableName, region, awsEnvironment, devEnvironment });

if (awsEnvironment === "AWS_SAM_LOCAL") {
  const AWS = require("aws-sdk");
  const endpoint = "http://127.0.0.1:8000";
  // devEnvironment === "OSX"
  //   ? "http://docker.for.mac.localhost:8000/"
  //   : devEnvironment === "Windows"
  //   ? "http://docker.for.window.localhost:8000/"
  //   : "http://127.0.0.1:8000";

  AWS.config.update({ region, endpoint });
}

const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
const main = async (event) => {
  //   // All log statements are written to CloudWatch
  //   logger.info("received:", JSON.stringify(event));
  //   const publicAddress = event.queryStringParameters?.publicAddress;
  //   logger.info(`publicAddress: ${publicAddress}`);

  // get all items from the table (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
  var params = {
    TableName: tableName,
    // Item: { id: "hello-world", name: "John" },
    // Key: { id: publicAddress },
  };

  logger.info({ params });
  const data = await docClient.scan(params).promise();

  logger.info({ Items: data.Items });

  // logger.log({ params });
  // const data = await docClient.get(params).promise();
  // logger.log(`data: ${data}`);
  // const items = data.Items;
  // logger.log(`data: ${data.Items}`);

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify(items),
  // };

  // // All log statements are written to CloudWatch
  // console.info(
  //   `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  // );
  // return response;
};

main();
