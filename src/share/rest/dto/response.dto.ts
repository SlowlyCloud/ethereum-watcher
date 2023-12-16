export class Response<T> {
    code: number;
    message: string;
    data: T;

    public static new<T>(code: number, message: string, data: T) {
        const res = new Response<T>();
        res.code = code;
        res.message = message;
        res.data = data;
        return res;
    }

    public static success<T>(data: T) {
        return Response.new<T>(200, 'successful', data);
    }
}
