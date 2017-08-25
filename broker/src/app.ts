import * as express from "express"
import * as bodyParser from "body-parser"
import * as path from "path"
import * as http from "http"
import { Listener } from "./listener"
import { StatusRoute } from "./routes/statusRoute"
import { IndexRoute } from "./routes/indexRoute"
import { ClustersRoute } from "./routes/clustersRoute"
import { TasksRoute } from "./routes/tasksRoute"

class App {
  public express
  private listener
  public server
  
  constructor() {
    this.express = express()
    this.server = http.createServer(this.express)
    this.listener = new Listener(this.server)
    this.listener.start()
    
    this.config()
    this.mountRoutes()
  }

  public startListener(): void {
    this.listener.start()
  }

  private config(): void {
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({
      extended: true
    }))
  }
  
  private mountRoutes(): void {
    const router = express.Router()
    StatusRoute.create(router)
    ClustersRoute.create(router)
    TasksRoute.create(router)
    IndexRoute.create(router)
    
    this.express.use(express.static(path.join(__dirname, 'dist')))
    this.express.use('/', router)
  }
}

export default new App().server