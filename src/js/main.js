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

const navBarManager = (() =>{
    const taskLists = document.getElementById('task-lists');
    const addTask = document.getElementById('add-task');
    
    function hideAddTask() {addTask.style.display = 'none'};
    function showAddTask() {addTask.style.display = 'list-item'};
    function createForm(){
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

        cancelBtn.addEventListener('click', ()=>{
            form.remove();
            addTask.style.display = 'list-item';
        });

        return form;
    }
    function insertBeforeAddTask(elem){taskLists.insertBefore(elem, addTask);}
    function createNewTask(text){
        const li = document.createElement('li');
        li.innerText = text;
        taskLists.insertBefore(li, addTask);
    }

    return {hideAddTask, showAddTask, createForm, insertBeforeAddTask, createNewTask};
})();

const addTask = document.getElementById('add-task');
addTask.addEventListener('click', () => {
    navBarManager.hideAddTask();
    const form = navBarManager.createForm();

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const input = document.querySelector('#form-add input');

        //Backlogic TODO:

        //DOMlogic
        form.remove();
        navBarManager.createNewTask(input.value);
        navBarManager.showAddTask();
    });
    navBarManager.insertBeforeAddTask(form);
});

