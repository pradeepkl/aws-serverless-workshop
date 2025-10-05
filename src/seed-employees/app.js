const {DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "ap-south-1" });

exports.handler = async (event, context) => {

    console.log("Event: ", event);
    console.log("Context: ", context);
    
    const tableName = process.env.TABLE_NAME;

    for(let i=1; i<=100; i++) {
        const employee = {
            empId: {S: `emp-${i}`},
            name: {S: `Employee ${i}`},
        };

        const command = new PutItemCommand({
            TableName: tableName,
            Item: employee,
        });
        
        try {
            await client.send(command);
            console.log(`Inserted: ${employee.empId.S}`);
        } catch (error) {
            console.error(`Error inserting ${employee.empId.S}: `, error);
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Employees seeded successfully" }),
    };
};