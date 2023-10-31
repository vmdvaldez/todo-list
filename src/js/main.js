taskList = {};

class SubTask{
    #name;
    #id;

    constructor(name, id){
        this.#name = name;
        this.#id = id;
    }

    get name(){return this.#name};
    set name(n){this.#name = n};
}

class Task{
    #name; 
    #date; 
    #priority; 
    #id;
    #description;
    #subTasks={};
    #subTaskId = 0;
    static id = 0;

    constructor(name){
        this.#name = name;
        this.#priority = -1;
        this.#id = Task.id;
        this.#description = '';
        Task.id ++;
    }

    // Task setters and getters
    get name(){return this.#name};
    set name(n){this.#name = n};
    get date(){return this.#date};
    set date(d){this.#date = d};
    get desc(){return this.#description;}
    set desc(desc){this.#description = desc;};
    set priority(p){
        let prio = parseInt(p);
        if(prio === NaN){
            console.log("Error: Not valid priority value");
            return;
        }
        this.#priority = prio;
    };
    get priority(){return this.#priority};
    get id(){return this.#id};
    set id(id){this.#id = id};

    // subTask setters and getter
    addSubTask(taskName) {
        this.#subTasks[`${this.#subTaskId}`] = new SubTask(taskName, this.#subTaskId);
    }

    removeSubTask(taskID) {
        delete this.#subTasks[`${taskID}`];
    }

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
        const taskName = document.querySelector('#form-add input').value;

        //Backlogic TODO:
        const t = new Task(taskName);
        taskList[t.id] = t;
        taskList[t.id].addSubTask('task0');
        taskList[t.id].addSubTask('task1');
        console.log(taskList);

        taskList[t.id].removeSubTask(0);
        console.log("AFTER");
        console.log(taskList);

        //DOMlogic
        form.remove();
        navBarManager.createNewTask(taskName);
        navBarManager.showAddTask();
    });
    navBarManager.insertBeforeAddTask(form);
});

