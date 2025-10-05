const {DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "ap-south-1" });

exports.handler = async (event, context) => {

    console.log("Event: ", event);
    console.log("Context: ", context);
    
    const tableName = process.env.EMPLOYEE_TABLE;

    for(let i=1; i<=100; i++) {
        const employee = {
            id: {S: `emp-${i}`},
            name: {S: `Employee ${i}`},
        };

        const command = new PutItemCommand({
            TableName: tableName,
            Item: employee,
        });
        
        try {
            await client.send(command);
            console.log(`Inserted: ${employee.id.S}`);
        } catch (error) {
            console.error(`Error inserting ${employee.id.S}: `, error);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Employees seeded successfully" }),
        };
    }
};