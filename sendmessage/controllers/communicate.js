exports.controller = async function (data, event, ddbClient, apigwManagementApi) {
  const { payload: { to, message } } = data;
  const { connectionId } = event.requestContext;

  const scanToParams = {
    FilterExpression : 'nickname = :n',
    ExpressionAttributeValues: {
      ':n': to,
    },
    TableName: process.env.TABLE_NAME
  };

  const getFromParams = {
    Key: { connectionId: connectionId },
    TableName: process.env.TABLE_NAME
  };

  let fromData, toData;


  try {
    fromData = await ddbClient.get(getFromParams).promise();
    fromData = fromData.Item;
    toData = await ddbClient.scan(scanToParams).promise();
    toData = toData.Items[0];
  } catch (e) {
    console.log('DDB error: ', e);
    return;
  }

  const postData = {
    action: 'communticate',
    payload: {
      from: fromData.nickname,
      to: toData.nickname,
      message: message
    }
  };

  console.log({ fromData, toData, postData });

  await apigwManagementApi.postToConnection({ ConnectionId: toData.connectionId, Data: JSON.stringify(postData) }).promise();
}