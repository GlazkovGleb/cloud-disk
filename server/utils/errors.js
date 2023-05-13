class CustomError extends Error {
    constructor(message, status = 500, detail = null) {
        super(message)
        this.status = status
        this.detail = detail
    }
}   

export default CustomError
