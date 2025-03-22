import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./utils/files";
import { uploadFile } from "./utils/aws";

const app = express()
app.use(cors());
app.use(express.json());
const PORT = 3000;

//uploadFile("dist/package.json", "/home/shivaji-raut/github_projects/vercel-app/upload-service/package.json")

app.post("/deploy",async (req , res)=>{
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = generate();
    await simpleGit().clone(repoUrl ,path.join(__dirname,`output/${id}`));

    const files = getAllFiles(path.join(__dirname,`output/${id}`));

    files.forEach(async file=>{
        await uploadFile(file.slice(__dirname.length+1),file);
    })
    
    res.json({
        id,
        message: "cloned"
    });


})



app.listen(PORT , () => {console.log(`Server running on PORT ${PORT}`)})