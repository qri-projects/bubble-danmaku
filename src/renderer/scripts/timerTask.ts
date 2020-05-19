class Task{
    interval: number;
    run;
    name;

    constructor(interval: number, run, name:String) {
        this.interval = interval;
        this.run = run;
        this.name = name;
    }
}

class TimerTask{
    tasks:Map<String,Task>;
    state:Map<string, any>;
    constructor() {
        this.tasks = new Map<String, Task>()
        this.state = new Map<string, any>();
    }

    run(){
        let i = 0;
        setInterval(()=>{
            i += 1;

            for (const task of this.tasks.values()) {
                if(i % task.interval == 0) {
                    task.run()
                }
            }
        }, 20)
    }

    addTask(task:Task){
        this.tasks.set(task.name, task);
    }

    removeTask(task:Task){
        if (this.tasks.has(task.name)) {
            this.tasks.delete(task.name);
        }
    }
}

const timerTask = new TimerTask();

timerTask.run();

export {timerTask, Task}
