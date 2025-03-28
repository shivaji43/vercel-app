import { createClient, commandOptions } from "redis";
import { downloadS3Folder } from "./aws";

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
    while(1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
          );
          console.log(res)
        // @ts-ignore;
        const id = res.element
        
        await downloadS3Folder(`output/${id}`)
        console.log("downloaded");
    }
}
main();