export interface Success<T> {
    type: "success"
    value: T
}

export interface Failure {
    type: "failure",
    message: string
}

export type Result<T> = Success<T> | Failure;