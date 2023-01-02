export default class ErrorCustom {
    constructor(public message: string, public code: number){
        this.message = message
        this.code = code
    }
}