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




addTask.addEventListener('click', () => {
    addTask.style.display = 'none';
    
    const addForm = () => {
        const form = document.createElement('form');
        form.id = 'form-add';

        const div = document.createElement('div');
        div.classList.add('form-buttons');
        const btn = (text, type) =>{
           const b = document.createElement('button');
           b.innerText = text;
           b.type = type;
           return b;
        } 

        const addBtn = btn('ADD', 'submit');
        const cancelBtn = btn('CANCEL', 'button');

        div.appendChild(addBtn);
        div.appendChild(cancelBtn);
        form.appendChild(document.createElement('input'));
        form.appendChild(div);

        form.addEventListener('submit', (e)=>{
            e.preventDefault();
            const input = document.querySelector('#form-add input');

            //Backlogic TODO:

            //DOMlogic
            form.remove();
            const newTask = document.createElement('li');
            newTask.innerText = input.value;
            taskLists.insertBefore(newTask, addTask);
            addTask.style.display = 'list-item';
            
        })

        cancelBtn.addEventListener('click', ()=>{
            form.remove();
            addTask.style.display = 'list-item';
        });

        return form;
    }
    
    taskLists.insertBefore(addForm(), addTask);
});

