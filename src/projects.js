const { v4: uuidv4 } = require('uuid');
export class Project{
    constructor(id, title){
        this._id = id;
        this._title = title;
    }

}

class ProjectList{
    constructor(){
        this.projects = [
            {
                id: 1,
                _title: "Gym",
            }
        ]
       
    }

    addProject(title){
        const id = uuidv4()
        const project = new Project(id, title)
        this.projects.push(project)
    }

    deleteProject(id){
        const index = this.projects.findIndex(project => project._id === id)
        if(index !== -1){
            this.projects.splice(index, 1)
        }
    }


 
}

export default ProjectList