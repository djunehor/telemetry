import { handler } from '../src/index';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Mock the DynamoDB client
jest.mock("@aws-sdk/client-dynamodb");

describe('Telemetry Processor', () => {
    test('should store telemetry data in DynamoDB', async () => {
        // Mock event object with telemetry data
        const event = {
            body: JSON.stringify({
                version: '1.0',
                creationTime: Date.now(),
                creationTimeISO: new Date().toISOString(),
                deviceId: 'ufmqtdp',
                temperature: {
                    celsius: 25,
                    fahrenheit: 77,
                },
            }),
            pathParameters: { siteId: 'abcdeg' },
        }

        // Mock the implementation of DynamoDBClient's send method
        const mockSend = jest.fn().mockResolvedValue({}); // Mock resolve value

        // Assign the mock implementation to the docClient.send property
        DynamoDBClient.prototype.send = mockSend;

        // Call the processTelemetry function
        const result = await handler(event);

        // Assertions
        expect(mockSend).toHaveBeenCalled(); // Verify that DynamoDBClient's send method was called
        expect(result.statusCode).toBe(200); // Verify the status code
        expect(JSON.parse(result.body).message).toBe('Telemetry data stored successfully'); // Verify the response message
    });

    test('should handle error when processing telemetry data', async () => {
        // Mock event object with telemetry data
        const event = {
            body: JSON.stringify({
                version: '1.0',
                creationTime: Date.now(),
                creationTimeISO: new Date().toISOString(),
                deviceId: 'iayoacp',
                temperature: {
                    celsius: 25,
                    fahrenheit: 77,
                },
            }),
            pathParameters: { 'siteId' : 'zytwvu'},
        }

        // Mock the implementation of DynamoDBClient's send method
        const mockSend = jest.fn().mockRejectedValue({}); // Mock resolve value

        // Assign the mock implementation to the docClient.send property
        DynamoDBClient.prototype.send = mockSend;

        // Call the processTelemetry function
        const result = await handler(event);
        // Assertions
        expect(mockSend).toHaveBeenCalled(); // Verify that DynamoDBClient's send method was called
        expect(result.statusCode).toBe(500); // Verify the status code
        expect(JSON.parse(result.body).message).toBe('Error processing telemetry'); // Verify the response message
    });

    test('should handle incorrect/invalid telemetry data', async () => {
        // Mock event object with invalid telemetry data
        const event = {
            body: JSON.stringify({
                version: '1.0',
                temperature: {
                    celsius: 25,
                    fahrenheit: 77,
                },
            }),
            pathParameters: {},
        };

         // Mock the implementation of DynamoDBClient's send method
         const mockSend = jest.fn().mockRejectedValue({}); // Mock resolve value

         // Assign the mock implementation to the docClient.send property
         DynamoDBClient.prototype.send = mockSend;
    
        // Call the processTelemetry function
        const result = await handler(event);

    
        // Assertions
        expect(result.statusCode).toBe(400); // Verify the status code
        expect(JSON.parse(result.body).message).toBe('Incomplete telemetry data'); // Verify the response message
    });
    
});