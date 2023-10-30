function Task(name, date){
    this.name = name;
    this.date = date;
    this.priority = -1;

    const getName = () => {this.name};
    const changeName = (n) => {this.name = n};
    const getDate = () => {this.date};
    const changeDate = (d) => {this.date = d};
    const getDescription = () => { this.description;}
    const setDescription = (desc) =>{this.description = desc;};
    const setPriority = (p) => {
        let priority = parseInt(p);
        if(priority === NaN){
            console.log("Error: Not valid priority value");
            return;
        }
        
        this.priority = priority;
    };

    return {getName, changeName, getDate, 
        changeDate, getDescription, setDescription,
        setPriority};
}

const taskLists = document.getElementById('task-lists');
const addTask = document.getElementById('add-task');




// addBtn.addEventListener('click', () => {
        //TODO: display none
//     console.log(taskLists.insertBefore(p, addBtn.parentElement));
// });