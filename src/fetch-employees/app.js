const {DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "ap-south-1" });

exports.handler = async (event, context) => {
    const tableName = process.env.TABLE_NAME;
    console.log("Event: ", event);
    console.log("Context: ", context);
   
    const limit = event.limit || 10;
    const lastKey = event.lastKey || null;

    const params = {
        TableName: tableName,
        Limit: limit,
        ExclusiveStartKey: lastKey ? JSON.parse(lastKey) : undefined,
    };

    console.log("Scan params: ", params);
    console.log("Table Name: ", tableName);
    console.log("Limit: ", limit);
    console.log("Last Key: ", lastKey);

    try {
        const result = await client.send(new ScanCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({
                items: result.Items,
                lastKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : null,
            }),
        };
    } catch (error) {
        console.error("Error fetching employees: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error fetching employees" }),
        };
    }
};
