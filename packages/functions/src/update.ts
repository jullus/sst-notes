import handler from "@notes/core/handler";
import {Table} from "sst/node/table";
import dynamodb from "@notes/core/dynamodb";

export const main = handler(async (event) => {
    const data = JSON.parse(event.body || "{}");

    const params = {
        TableName: Table.Notes.tableName,
        Key: {
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
            noteId: event?.pathParameters?.id,
        },
        UpdateExpression: "SET content = :content, attachment = :attachment",
        ExpressionAttributeValues: {
            ":content": data.content,
            ":attachment": data.attachment,
        },
        ReturnValues: "ALL_NEW",
    };

    await dynamodb.update(params);

    return JSON.stringify({status: true});
});
