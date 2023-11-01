taskList = {};

class SubTask{
    #name;
    #id;
    #done;

    constructor(name, id){
        this.#name = name;
        this.#id = id;
        this.#done = false;
    }

    get name(){return this.#name};
    set name(n){this.#name = n};
    get id(){return this.#id};
    set done(bool){
        if(typeof(bool) !== 'boolean'){
            console.log("NOT BOOL");
            return;
        }
        this.#done = bool;
    }
    get done(){return this.#done};

    stringify(){
        return JSON.stringify({
            'id': this.#id,
            'name': this.#name,
            'done': this.#done
        });
    }
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
        // ADD static id localStorage?
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

    removeSubTask(stID) {
        delete this.#subTasks[`${stID}`];
    } 

    stringify(){
        let subtaskstr = {};
        
        for (const i in this.#subTasks){
            subtaskstr[this.#subTasks[i].id] = this.#subTasks[i].stringify();
            // console.log(this.#subTasks[i].stringify());
        }
        const str = JSON.stringify(
            {
                'id': this.#id,
                'name': this.#name,
                'subTaskid': this.#subTaskId,
                'subTasks': subtaskstr
            }
            );

        return str;
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

        const div = document.createElement('div');
        div.innerText = text;
        const btn = document.createElement('button');
        btn.innerText = 'Remove';

        // li.innerText = text;
        li.appendChild(div);
        li.appendChild(btn);
        taskLists.insertBefore(li, addTask);
        return li;
    }

    return {hideAddTask, showAddTask, createForm, insertBeforeAddTask, createNewTask};
})();


function createSubTaskLi(st){
        const li = document.createElement('li');
        li.classList.add('subtask');
        // li.innerText = t.name;
        li.dataset.subtaskid = st.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        if (st.done) checkbox.checked = true;

        checkbox.addEventListener('change',()=>{
            console.log(checkbox.checked);
            if(checkbox.checked){
                st.done = true;
            }else{
                st.done = false;
            }
        });

        const div = document.createElement('div');
        div.innerText = st.name;
        const btn = document.createElement('button');
        btn.innerText = 'Remove';

        btn.addEventListener('click', ()=>{

            console.log(taskList);
            const activeTask = document.querySelector('.active');
            const task = taskList[activeTask.dataset.taskid];

            console.log(taskList);
            task.removeSubTask(st.id);
            li.remove();
        });

        li.appendChild(checkbox);
        li.appendChild(div);
        li.appendChild(btn);
        return li;
    }

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
            createNewSubTask(st);
            console.log(x.stringify());
            showAddSubTask();

        });

        li.addEventListener('click', ()=>{
            hideAddSubTask();
            insertBeforeAddSubTask(form);
        });

        return li;
    })();

    function createNewSubTask(st){
        const li = createSubTaskLi(st);
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
        
        const subTasks = task.subTasks;
        for (t in subTasks){
            ul.appendChild(createSubTaskLi(subTasks[t]));
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

        taskList[t.id] = t;        

        form.remove();
        const task = navBarManager.createNewTask(t.name, t.id);
        navBarManager.showAddTask();

        // Display Active Task
        task.firstChild.addEventListener('click',()=>{
            const active = document.querySelector('.active');
            if (active === task) return;
            if (active !== null) active.classList.toggle('active');
            taskContentManager.clearTaskWindow();
            taskContentManager.displayTask(t);
            task.classList.toggle('active');
        });

        // Delete Task
        task.lastChild.addEventListener('click', ()=>{
            const taskid = task.dataset.taskid;
            delete taskList[taskid];
            task.remove();
            taskContentManager.clearTaskWindow();
        });


    });
    navBarManager.insertBeforeAddTask(form);
});

/* TODOs?:
    - add priority functionality
    - add date functionality
    - strike through when done
    - persistent storage
        - save to storage
        - on refresh load up storage and assign it to taskList
        - assign each task its event listener
        - stringify
*/