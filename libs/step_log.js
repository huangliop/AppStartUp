const fs = require('fs'); 
const exec = require('child_process').execSync;

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

class StepLog {
    constructor(projectPathName) {
        if (__instance()) return __instance(); 
        let cwd=process.cwd();
        this.logsPath=process.platform=='win32'?`${cwd}\\steplogs.json`:`${cwd}/steplogs.json`;
        let steps;
        if(fs.existsSync(this.logsPath)){
           steps= require(this.logsPath); 
        }else{
            let execCMD=process.platform=='win32'?`xcopy ${__dirname}\\steplogs.json ${cwd}\\`:`cp ${__dirname}/steplogs.json ${cwd}`
            exec(execCMD);
            steps= require(this.logsPath); 
        }
        this.steps = steps;
        __instance(this);
    }
    /**
     * 设置创建的工程的目录名称
     * @author HuangLi
     * @param {[[Type]]} dirName [[Description]]
     */
    setDirName(dirName){
        this.steps[1].dirName = dirName;
    }
    getDirName(){
        return this.steps[1].dirName;
    }
    /**
     * 设置某个步骤完成
     * @author HuangLi
     * @param {[[Type]]} index [[Description]]
     */
    stepDone(index) {
        //如果是完成的最后一个步骤，则自动将所有记录重置
        if(index===this.steps.length-1){
            this.resetLogs();
            this.completed();
        }else{
            this.steps[index].done = true;
            this._wirteToJson(); 
        }

    }
    _wirteToJson(){
        fs.writeFileSync(`${process.cwd()}//steplogs.json`, JSON.stringify(this.steps));
    }
    /**
     * 获取当前最后一个没有完成的步骤
     * @author HuangLi
     * @returns {[[Type]]} [[Description]]
     */
    currentStep() {
        let index=0;
        for (let i of this.steps) {
            if (!i.done) return index;
            index++;
        }
    }
    resetLogs(){
        for(let i of this.steps){
            i.done=false;
        }
        this._wirteToJson();
    }
    /**
     * 创建完成
     * @author HuangLi
     */
    completed(){
        let cmd=process.platform=='win32'?`del ${this.logsPath}`:`rm ${this.logsPath}`
        exec(cmd);
        console.log('\x1b[32m', `工程建立完毕，工程目录:${process.cwd()}下的${this.steps[1].dirName}`, '\x1b[0m');
    }
}
module.exports = StepLog;