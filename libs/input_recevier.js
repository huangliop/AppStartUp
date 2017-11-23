const readline = require('readline');
class InputRecevier {
    /**
     * 创建工程时的输入提问
     * @author HuangLi
     * @param   {[[Type]]} cb [[Description]]
     * @returns {Array}    [[Description]]
     */
    static questionCreateProject(cb) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        function input(msg) {
            rl.resume();
            rl.question(msg, (answer) => {
                rl.pause();
                if (answer && answer != 0) {
                    let r = it.next(answer);
                    if (r.done) {
                        rl.close();
                        cb(r.value);
                    }
                } else {//如果输入为空，需要重新输入
                    input(msg);
                }

            });
        }

        function* g() {
            let answer1 = yield input('输入要创建的项目文件夹名称(如：myProject):\n');
            let answer2 = yield input('输入App的包名(如：com.my.app):\n');
            let answer3 = yield input('输入App的名称(如：我的应用):\n');

            return [answer1, answer2, answer3];
        };
        let it = g();
        it.next();
    }
}
module.exports = InputRecevier;