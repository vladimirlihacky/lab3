import express from "express"
import { Model } from "./models";
import { JSONRepo } from "./repo";
import { apiRouter } from "./api";
import config from "../common/config";

Model.setRepo(new JSONRepo(config.server.dbPath))

const app = express(); 

app.use('/api', apiRouter)

app.listen(config.server.port)