exports.controller = async function (data, event, ddbClient, apigwManagementApi) {
  const {payload} = data;
  const {connectionId} = event.requestContext;

  var putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId: connectionId,
      nickname: payload
    }
  };

  console.log(putParams);

  try {
    await ddbClient.put(putParams).promise();
  } catch(e) {
    console.log('DDB error: ', e);
  }
  
  const postData = {
    action: 'registerSuccess',
    payload: payload
  };

  console.log(postData)

  await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(postData) }).promise();
}