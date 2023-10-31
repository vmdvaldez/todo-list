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
    get id(){return this.#id};
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

    // subTask setters and getter and helpers
    get subTasks(){return this.#subTasks};
    get lastSubTask(){
        const st = Object.keys(this.#subTasks);
        return this.#subTasks[st[st.length-1]];
    };

    addSubTask(taskName) {
        this.#subTasks[`${this.#subTaskId}`] = new SubTask(taskName, this.#subTaskId);
        this.#subTaskId++;
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

        const input = document.createElement('input');
        input.minLength = 1;
        input.maxLength = 15;
        input.placeholder = "Task Name";
        input.required = true;

        div.appendChild(addBtn);
        div.appendChild(cancelBtn);
        form.appendChild(input);
        form.appendChild(div);

        cancelBtn.addEventListener('click', ()=>{
            form.remove();
            addTask.style.display = 'list-item';
        });

        return form;
    }
    function insertBeforeAddTask(elem){taskLists.insertBefore(elem, addTask);}
    function createNewTask(text, id){
        const li = document.createElement('li');
        li.classList.add('task');
        li.dataset.taskid = id;
        li.innerText = text;
        taskLists.insertBefore(li, addTask);
        return li;
    }

    return {hideAddTask, showAddTask, createForm, insertBeforeAddTask, createNewTask};
})();

const taskContentManager = (() =>{
    const divTask = document.getElementById('task');
    const addSubTask = (() => {
        const li = document.createElement('li');
        li.innerText = 'Add SubTask +';
        li.id = 'add-subtask';

        const form = createForm();

        form.addEventListener('submit', (e)=>{
            e.preventDefault();
            const task = document.querySelector('.active').dataset.taskid;
            const subTaskName = document.querySelector('#form-addsubtask input').value;
            const x = taskList[task];
            x.addSubTask(subTaskName);

            const st = x.lastSubTask;
    
            form.reset();
            form.remove();
            createNewSubTask(st.name, st.id);
            showAddSubTask();

        });

        li.addEventListener('click', ()=>{
            hideAddSubTask();
            insertBeforeAddSubTask(form);
        });

        return li;
    })();

    function createNewSubTask(text, id){
        const li = document.createElement('li');
        li.classList.add('subtask');
        li.dataset.subtaskid = id;
        li.innerText = text;
        insertBeforeAddSubTask(li);
        return li;
    };

    function clearTaskWindow(){divTask.innerText=''};
    function displayTask(task){
        const title = document.createElement('div');
        title.classList.add('task-title');
        title.innerText = task.name;


        const ul = document.createElement('ul');
        ul.id = 'subtask-list';

        const li = (t)=>{
            const li = document.createElement('li');
            console.log(t);
            li.classList.add('subtask');
            li.innerText = t.name;
            li.dataset.subtaskid = t.id;
            return li;
        };
        
        const subTasks = task.subTasks;
        for (t in subTasks){
            ul.appendChild(li(subTasks[t]));
        }

        ul.appendChild(addSubTask);

        divTask.appendChild(title);
        divTask.appendChild(ul);
    };

    function createForm(){
        const form = document.createElement('form');
        form.id = 'form-addsubtask';

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

        const input = document.createElement('input');
        input.minLength = 1;
        input.maxLength = 15;
        input.placeholder = "Subtask Name";
        input.required = true;

        div.appendChild(addBtn);
        div.appendChild(cancelBtn);
        form.appendChild(input);
        form.appendChild(div);

        cancelBtn.addEventListener('click', ()=>{
            form.remove();
            addSubTask.style.display = 'list-item';
        });

        return form;
    }  

    function hideAddSubTask(){addSubTask.style.display = 'none'};
    function showAddSubTask(){addSubTask.style.display = 'list-item'};
    function insertBeforeAddSubTask(elem){
        const subTaskList = document.getElementById('subtask-list');
        subTaskList.insertBefore(elem, addSubTask);
    }

    return {displayTask, clearTaskWindow, hideAddSubTask, showAddSubTask, 
        insertBeforeAddSubTask};
})();

const addTask = document.getElementById('add-task');
addTask.addEventListener('click', () => {
    navBarManager.hideAddTask();
    const form = navBarManager.createForm();

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const taskName = document.querySelector('#form-add input').value;
        const t = new Task(taskName);
        t.addSubTask('aasdasd');
        t.addSubTask('aasdasd1');
        t.addSubTask('aasdasd512');
        t.addSubTask('aasdasd12312');

        taskList[t.id] = t;

        form.remove();
        const task = navBarManager.createNewTask(t.name, t.id);
        navBarManager.showAddTask();


        task.addEventListener('click',()=>{
            const active = document.querySelector('.active');
            if (active === task) return;
            if (active !== null) active.classList.toggle('active');
            taskContentManager.clearTaskWindow();
            taskContentManager.displayTask(t);
            task.classList.toggle('active');
        });


    });
    navBarManager.insertBeforeAddTask(form);
});

