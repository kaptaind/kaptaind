export enum TaskStatus {
    Queued,
    InProgress,
    Finished,
    Error
}

export class Task {
    id: String
    sourceClusterId: String
    targetClusterId: String
    status: TaskStatus = TaskStatus.Queued
    logs: TaskLog[] = []
    createdAt: Date = new Date()
}

export class TaskLog {
    description: String
    createdAt: Date = new Date()
}