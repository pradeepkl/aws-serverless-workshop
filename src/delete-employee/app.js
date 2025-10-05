const {DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "ap-south-1" });

exports.handler = async (event, context) => {

    console.log("Event: ", event);
    console.log("Context: ", context);
    
    const tableName = process.env.TABLE_NAME;
    const {empId} = event;

    if(!empId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "empId is required" }),
        };
    }

    const params = {
        TableName: tableName,
        Key: {
            empId: { S: empId }
        }
    };

    try {
        await client.send(new DeleteItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Employee deleted successfully" })
        };
    } catch (error) {
        console.error("Error deleting employee: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error deleting employee" }),
        };
    }
};
