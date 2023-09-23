const { v4: uuidv4 } = require('uuid');
export class Task{
    constructor(title, priority, due){
        this._id = uuidv4();
        this._title = title;
        this._priority = priority;
        this._due = due;
    }
}