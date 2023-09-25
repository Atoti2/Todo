const { v4: uuidv4 } = require('uuid');
export class Task{
    constructor(id, title, priority, due, completed = false){
        this._id = id;
        this._title = title;
        this._priority = priority;
        this._due = due;
        this._completed = completed
    }

    toggleComplete(){
        this.completed = !this.completed
    }

}

class TodoList{
    constructor(){
        this.tasks = []
    }

    addTask(title, priority, due){
        const id = uuidv4();
        const task = new Task(id, title, priority, due)
        this.tasks.push(task)
    }

    editTask(id, newTitle, newPriority, newDue){
        const task = this.tasks.find(task => task._id === id)
        if(task){
            task._title = newTitle;
            task._priority = newPriority;
            task._due = newDue
        }
    }

    deleteTask(id){
        const index = this.tasks.findIndex(task => task._id === id)
        if(index !== -1){
            this.tasks.splice(index, 1)
        }
    }

    toggleTaskCompletion(id){
        const task = this.tasks.find(task => task._id === id)
        if(task){
            task.toggleComplete()
        }
    }
}

export default TodoList