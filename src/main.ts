import express from "express"
import { Model } from "./server/models";
import { JSONRepo } from "./server/repo";
import { apiRouter } from "./server/api";
import config from "./common/config";

Model.setRepo(new JSONRepo(config.server.dbPath))

const app = express(); 

app.use('/api', apiRouter)

app.listen(config.server.port)