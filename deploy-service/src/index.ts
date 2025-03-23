import { commandOptions, createClient } from "redis";
import { redisPOP } from "./utils/types";
import { downloadS3Folder } from "./utils/aws";

const subscriber = createClient();
subscriber.connect();

async function main (){
    while(1){
        const response : redisPOP = await subscriber.brPop(
            commandOptions({isolated : true}),
            'build-queue',
            0
        );
        console.log(response)
        const id = response.element;
        await downloadS3Folder(`output/${id}`)
    }
}
main();