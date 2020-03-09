class Task{
    interval: number;
    run;

    constructor(interval: number, run) {
        this.interval = interval;
        this.run = run;
    }
}

class TimerTask{
    tasks:Array<Task>;
    state:Map<string, any>;
    constructor() {
        this.tasks = new Array<Task>()
        this.state = new Map<string, any>();
    }

    run(){
        let i = 0;
        setInterval(()=>{
            i += 1;

            for (const task of this.tasks) {
                if(i % task.interval == 0) {
                    task.run()
                }
            }
        }, 20)
    }

    addTask(task:Task){
        this.tasks.push(task);
    }
}

const timerTask = new TimerTask();

timerTask.run();

export {timerTask, Task}
