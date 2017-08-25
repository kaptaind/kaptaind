import { Task, TaskStatus, TaskStatusUpdate, TaskLog } from "./models/task"

export class TaskOperation {
    constructor(public Success: Boolean = true, public Error: String = "") {}
}

export class ExportTaskOperation extends TaskOperation {
    constructor(public Success: Boolean = true, public Error: String = "", public TaskId: String = "") {
        super(Success, Error)
    }
}

export class PullTaskOperation extends TaskOperation {
    constructor(public Success: Boolean = true, public Error: String = "", public task?: Task) {
        super(Success, Error)
    }
}

export class TaskManager {
    private static instance: TaskManager
    private tasks: Array<Task> = new Array<Task>()
    
    static getInstance(): TaskManager {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager()
        }

        return this.instance
    }
    
    public getTasks(): Array<Task> {
        return this.tasks
    }

    public startExportTask(task: Task): ExportTaskOperation {
        console.log("starting export task")

        let existingTask = this.tasks.find(t => (t.sourceClusterId == task.sourceClusterId && t.targetClusterId == task.targetClusterId) || t.targetClusterId == task.targetClusterId)
        if (existingTask && (existingTask.status == TaskStatus.Queued || existingTask.status == TaskStatus.InProgress)) {
            console.log("task already in progress")
            return new ExportTaskOperation(false, "Existing task is already in progress")
        }

        task.status = TaskStatus.Queued
        task.logs = []
        task.createdAt = new Date()
        task.id = this.newGuid()

        this.tasks.push(task)
        return new ExportTaskOperation(true, "", task.id)
    }

    public getTaskState(taskId: string): Task {
        let task = this.tasks.find(t => t.id == taskId) as Task
        return task
    }
    
    public getImportTask(clusterId: string): Task {
        console.log("cluster " + clusterId + "wants an import task")

        let task = this.tasks.find(t => (t.targetClusterId == clusterId) && (t.status == TaskStatus.Queued)) as Task
        if (task) {
            console.log("task found")
        }
        return task
    }
    
    public updateTaskStatus(taskId: String, update: TaskStatusUpdate): void {
        let task = this.tasks.find(t => t.id == taskId)
        if (task) {
            this.tasks[this.tasks.indexOf(task)].status = update.status
            
            if (update.log) {
                let log = new TaskLog()
                log.description = update.log
                log.createdAt = new Date()

                this.tasks[this.tasks.indexOf(task)].logs.push(log)
            }

            console.log("task " + taskId + " reported status: " + update.status.toString())
        }
    }

    public removeTask(taskId: string): TaskOperation {
        let index = this.tasks.findIndex(c => c.id == taskId)
        if (index == -1) {
            return new TaskOperation(false, "Task with id " + taskId + " not found")
        }

        this.tasks.splice(index, 1)
        console.log("task " + taskId + " removed")

        return new TaskOperation()
    }

    private newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}