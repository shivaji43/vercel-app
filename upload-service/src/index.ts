import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils/id";
import path from "path";
import { getAllFiles } from "./utils/files";
import { uploadFile } from "./utils/aws";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const app = express()
app.use(cors());
app.use(express.json());
const PORT = 3000;



app.post("/deploy",async (req , res)=>{
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = generate();
    await simpleGit().clone(repoUrl ,path.join(__dirname,`output/${id}`));

    const files = getAllFiles(path.join(__dirname,`output/${id}`));

    files.forEach(async file=>{
        await uploadFile(file.slice(__dirname.length+1),file);
    })

    publisher.lPush("build-queue",id);
    
    res.json({
        id,
        message: "cloned"
    });


})



app.listen(PORT , () => {console.log(`Server running on PORT ${PORT}`)})