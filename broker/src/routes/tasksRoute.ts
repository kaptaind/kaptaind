import { NextFunction, Request, Response, Router } from "express";
import { TaskManager, TaskOperation, ExportTaskOperation, PullTaskOperation } from "../taskManager"
import { Task } from "../models/task"
import { ApiResultBase, ApiResult, OperationStatus } from "../models/apiResult"

export class TasksRoute {
    private static taskManager = TaskManager.getInstance()

    public static create(router: Router) {
        router.get("/tasks", (req: Request, res: Response, next: NextFunction) => {
            let tasks = this.taskManager.getTasks()
            let result = new ApiResult<Array<Task>>(OperationStatus.OK, "", tasks)
            
            res.json(result)
        })
        
        router.get("/tasks/import", (req: Request, res: Response, next: NextFunction) => {
            let task = this.taskManager.getImportTask(req.query.clusterId)
            let result = new ApiResult<Task>(OperationStatus.OK, "", task)
            
            res.json(result)
        })
        
        router.get("/tasks/:id/state", (req: Request, res: Response, next: NextFunction) => {
            let taskState = this.taskManager.getTaskState(req.params.id)
            let result = new ApiResult<Task>(OperationStatus.OK, "", taskState)
            
            res.json(result)
        })

        router.post("/tasks", (req: Request, res: Response, next: NextFunction) => {
            let taskResult = this.taskManager.startExportTask(req.body)
            let result = new ApiResult<String>(taskResult.Success ? OperationStatus.OK : OperationStatus.Error, taskResult.Error, taskResult.TaskId)

            res.json(result)
        })
        
        router.post("/tasks/:id/status", (req: Request, res: Response, next: NextFunction) => {
            let taskResult = this.taskManager.updateTaskStatus(req.params.id, req.body)
            let result = new ApiResultBase(OperationStatus.OK, "")
            
            res.json(result)
        })

        router.delete("/tasks/:id", (req: Request, res: Response, next: NextFunction) => {
            let deleteResult = this.taskManager.removeTask(req.params.id)
            let result = new ApiResultBase(deleteResult.Success ? OperationStatus.OK : OperationStatus.Error, deleteResult.Error)

            res.json(result)
        })
    }
}