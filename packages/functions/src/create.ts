import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";
// noteID: e056d3b0-87ae-11ee-b449-27493801fef5
// 4cfa73e0-87b0-11ee-88d5-1de485fc54bb
export const main = handler(async (event) => {
    let data = {
        content: "",
        attachment: "",
    };

    if (event.body != null) {
        data = JSON.parse(event.body);
    }
    const params = {
        TableName: Table.Notes.tableName,
        Item: {
// The attributes of the item to be created
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId, // The id of the author
            noteId: uuid.v1(), // A unique uuid
            content: data.content, // Parsed from request body
            attachment: data.attachment, // Parsed from request body
            createdAt: Date.now(), // Current Unix timestamp
        },
    };
    await dynamoDb.put(params);
    return JSON.stringify(params.Item);
});
