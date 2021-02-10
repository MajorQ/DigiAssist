export { ServerError }

const HTTP_UNKNOWN = 0;

class ServerError {

    constructor(private _status: number, private _message: string) {}

    static unknown() { 
        return new ServerError(
            HTTP_UNKNOWN,
            'Unknown Server Error'
        );
    }

    toString() {
        return `with Error Code ${this._status} (${this._message})`;
    }
}
