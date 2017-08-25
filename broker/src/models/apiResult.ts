export enum OperationStatus {
    OK,
    Error
}

export class ApiResultBase {
    public status: OperationStatus
    public errorMessage: String

    public constructor(status: OperationStatus = OperationStatus.OK, errorMessage: String = "") {
        this.status = status
        this.errorMessage = errorMessage
    }
}

export class ApiResult<T> extends ApiResultBase {
    public data: T | undefined
    
    public constructor(public status: OperationStatus = OperationStatus.OK, public errorMessage: String = "", data: T | undefined) {
        super(status, errorMessage)
        this.data = data
    }
}