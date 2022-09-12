export class ResponseObject {
    public message?: string;
    public status?: number;
    public success?: true;
    public data?: object | Array<object> | string | number | boolean;
}
