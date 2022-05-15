const logdown = require("logdown");
const { ulid } = require('ulid');
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
  AWS.config.update({ region, endpoint });
}

const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
const main = async (event) => {
  var params = {
    TableName: tableName,
    Item: { 
      id: ulid(),
      nonce: Math.floor(Math.random() * 10000),
    },
  };

  logger.info({ params });
  // const result = await docClient.put(params).promise();
  // docClient.put(params)
  // .promise()
  // .then(data => console.log(data.Attributes))
  // .catch(console.error)
  docClient.put({
    TableName: tableName,
  }, function(err, data) {
    logger.info({ err, data })
  })

  // logger.info({ result });
};

main();
