// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const registerController = require('./controllers/register').controller;
const communicateController = require('./controllers/communicate').controller;


const { TABLE_NAME } = process.env;

exports.handler = async (event, context) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });

  const { data } = JSON.parse(event.body);

  console.log(data)
  try {
    switch (data.action) {
      case 'register':
        await registerController(data, event, ddb, apigwManagementApi);
        break;
      case 'communicate':
        await communicateController(data, event, ddb, apigwManagementApi);
        break;
      
      default:
        break;
    }
  } catch (e) {
    console.log('Controller error: ', e);
    return { statusCode: 500, body: e.stack };
  }


  // const postData = JSON.stringify({
  //     controllerResult,
  //     from: event.requestContext.connectionId
  // });
  
  // const postCalls = connectionData.Items.map(async ({ connectionId }) => {
  //   try {
  //     await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(postData) }).promise();
  //   } catch (e) {
  //     if (e.statusCode === 410) {
  //       console.log(`Found stale connection, deleting ${connectionId}`);
  //       await ddb.delete({ TableName: TABLE_NAME, Key: { connectionId } }).promise();
  //     } else {
  //       throw e;
  //     }
  //   }
  // });
  
  // try {
  //   await Promise.all(postCalls);
  // } catch (e) {
  //   return { statusCode: 500, body: e.stack };
  // }

  return { statusCode: 200, body: 'Data sent.' };
};
