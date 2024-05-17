AWS architecture


                      - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
                      |                                                                                      |
                      |  Authorizer Lambda                                                                   |     
                      |      ^                                                                               |
                      |      |                                                                               |
                      |      |                                                                               |
[3rd party  vendor ] -|-> API gateway --> Telemetry-Queue --> Telemetry-Processor --> Telemetry-Store        |
                      |                          |                                                           |
                      |                          |                                                           |
                      |                          --> Telemetry-DLQ                                           |
                      |                                                                                      |
                      |                                                                                      |
                      - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

• Considering the high-level diagram of the microservice shown above, write code in typescript to
implement the Telemetry Processor.
• The telemetry processor should receive the data from request and store it as it is to a DynamoDB
table. Please refer to telemetry schema at the end of this section.
• Implement AWS SAM (Serverless Application Model) template to define all the AWS resources
shown in above diagram.
• AWS SAM template should also include necessary permissions and roles required for all the services
to work properly.
• The API Gateway should have a write endpoint to write the telemetries to the Telemetry-Store
DynamoDB table. The write endpoint should use “siteId” as path variable to persist the data.
• The code should have at least 80% code coverage using jest or vitest.

______________________


Optional Tasks:
You are not obligated to do optional tasks mentioned below, however, you receive additional points and
edge over other candidates if you do one or more of them. Both carry equal weightage.
• Optional task 1:
 Create another lambda function called “Telemetry Retriever” (not shown in above diagram) that can
be used to read telemetries from the DynamoDB table and return them in response.
 The API Gateway should have read endpoints to read all the telemetries from Telemetry-Store based
on “siteId” or “deviceId”.
 The API Gateway should have a read endpoint to read telemetries between a given time range.
• Optional task 2:
 Create Authorizer Lambda and integrate it with Api Gateway
 You can implement any kind of authorization mechanism in the Authorizer Lambda to authenticate
requests coming from 3rd party vendor, however the authorizer lambda code should be functional.
Schema for the telemetry data model is as described below:
```
{
  "version": string,
  "creationTime": number,
  "creationTimeISO": string,
  "deviceId": string,
    "temperature": {
      "celsius": number,
      "fahrenheit": number
    }
}
```

______________________
- Configure AWS CLI: `aws configure`
- Delete cloudformation stack: `aws cloudformation delete-stack --stack-name eon-telemetry`
- Package: `sam package --output-template-file packaged.yaml --s3-bucket eon-telemetry --region us-east-1`
- Deploy: `sam deploy --template-file packaged.yaml --s3-bucket eon-telemetry --stack-name eon-telemetry --capabilities CAPABILITY_IAM --on-failure ROLLBACK --region us-east-1`
- Run locally: `sam local invoke AuthorizerFunction --event authorizer/events/valid.json`
- Deploy Update: `sam validate --lint && sam package --output-template-file packaged.yaml --s3-bucket eon-telemetry --region us-east-1 && sam deploy --template-file packaged.yaml --s3-bucket eon-telemetry --stack-name eon-telemetry --capabilities CAPABILITY_IAM --on-failure ROLLBACK --region us-east-1`
- Update deployment: `sam package --output-template-file packaged.yaml --s3-bucket eon-telemetry --region us-east-1 && sam deploy --template-file packaged.yaml --s3-bucket eon-telemetry --stack-name eon-telemetry --capabilities CAPABILITY_IAM --on-failure ROLLBACK --region us-east-1`
- Generate JWT token: http://jwtbuilder.jamiekurtz.com/