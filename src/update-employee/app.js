const {DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "ap-south-1" });

exports.handler = async (event, context) => {

    console.log("Event: ", event);
    console.log("Context: ", context);
    
    const tableName = process.env.TABLE_NAME;
    const {empId, name} = event;

    if(!empId || !name) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "empId and name are required" }),
        };
    }

    const params = {
        TableName: tableName,
        Key: {
            empId: { S: empId }
        },
        UpdateExpression: "SET #n = :name",
        ExpressionAttributeNames: {
            "#n": "name"
        },
        ExpressionAttributeValues: {
            ":name": { S: name }
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        const result = await client.send(new UpdateItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Employee updated successfully" }),
            updatedAttributes: result.Attributes
        };
    } catch (error) {
        console.error("Error updating employee: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error updating employee" }),
        };
    }
};
