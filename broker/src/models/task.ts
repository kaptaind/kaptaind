export enum TaskStatus {
    Queued = "Queued",
    InProgress = "In Progress",
    Finished = "Finished",
    Error = "Error"
}

export class TaskStatusUpdate {
    status: TaskStatus
    log: string
}

export class Task {
    id: String
    sourceClusterId: String
    targetClusterId: String
    status: TaskStatus = TaskStatus.Queued
    logs: TaskLog[] = []
    createdAt: Date = new Date()
    
    constructor() {
        this.logs = []
    }
}

export class TaskLog {
    description: String
    createdAt: Date = new Date()
}