const exec = require('child_process').execSync;
const fs=require('fs');

const StepLog = require('./step_log');


let stepLog = new StepLog();

class ProjectCreator {
    constructor() {
            this.pluginList = require('./cordova_plugins.json');
            this.dirName=stepLog.getDirName();
        //随机生成android密钥的keystore密码
            this.keypass='ac'+Math.floor(Math.random()*1000000)+'!@#';
            this.storepass='bd'+Math.floor(Math.random()*1000000)+'%@d';
        }
        /**
         * 创建Cordova工程
         * @author HuangLi
         * @param   {Array}   arg [[Description]]
         * @returns {boolean} 
         */
    create(arg) {
            try {
                exec(`cordova create ${arg[0]} ${arg[1]} ${arg[2]}`,{stdio: [0, 1, 2]});
                this.dirName = arg[0];
                //设置创建的目录到steplog中，用于如果过程中有错误，下次能够正常执行后面的命令
                stepLog.setDirName(arg[0])
                stepLog.stepDone(1);
                return true;
            } catch (e) {
                console.error(e);
                console.error('\x1b[31m', '创建工程失败,请确保网络通畅后，再试', '\x1b[0m');
                return false;
            }
        }
        /**
         * 添加android和ios平台
         * @author HuangLi
         * @returns {boolean} [[Description]]
         */
    addPlatfrom() {
            try { 
                //添加6.1.0版本是为了解决图标和启动页不能配置的问题
                exec('cordova platform rm android', {
                    cwd: this.dirName
                });
                exec('cordova platform rm ios', {
                    cwd: this.dirName
                });
                console.info('生成Android平台...');
                exec('cordova platform add android@6.1.0', {
                    cwd: this.dirName,
                    stdio: [0,1]
                });
                console.info('生成iOS平台...');
                exec('cordova platform add ios', {
                    cwd: this.dirName,
                    stdio: [0,1]
                });
                stepLog.stepDone(3);
                console.log('\x1b[32m', '平台添加完成', '\x1b[0m');
                return true;
            } catch (e) {
                console.error(e);
                console.error('\x1b[31m', '失败,请确保网络通畅后，再试。或查看上面的详细错误信息', '\x1b[0m');
                return false;
            }
        }
        /**
         * 添加插件
         * @author HuangLi
         * @returns {boolean} [[Description]]
         */
    addPlugins() {
        try {
            for (let pl of this.pluginList) {
                console.log(`安装Cordova插件：${pl.name}\n用途：${pl.des}\n`)
                exec(`cordova plugins add ${pl.url}`, {
                    cwd: this.dirName,
                    stdio: [0]
                });
            }
            stepLog.stepDone(4);
            console.log('\x1b[32m', '添加插件完成', '\x1b[0m');
            return true;
        } catch (e) {
            console.error(e);
            console.error('\x1b[31m', '失败,请确保网络通畅后，再试，或查看上面的详细错误信息.如果是Mac请用sudo 执行命令。', '\x1b[0m');
            //添加插件出错后，删除除出错的插件，以为下一次能够正常运行
            try{ exec(e.cmd.replace('add','rm'),{
                    cwd: this.dirName,
                    stdio: [0]
                });}catch(e){};
            return false;
        }
    }
    /**
     * 创建一个默认的keystore文件
     * @author HuangLi
     */
    createKeystore(){
        try{
            console.log('生成签名，请输入相应信息（也可不输入直接回车），最后确认输入Y。')
            
            exec(`keytool -genkey -v -keystore automatic-gen.jks -storepass ${this.storepass}  -alias ${this.dirName} -keypass ${this.keypass} -keyalg RSA -keysize 2048 -validity 10000`,{
                        cwd: this.dirName,
                        stdio: [0, 1, 2]
                    });
            this._createBuildJson(this.storepass,this.keypass,this.dirName);
            stepLog.stepDone(2);
            return true;
        }catch(e){
            console.error(e);
            exec('del automatic-gen.jks',{cwd:this.dirName});
            console.error('\x1b[31m', '创建keystore失败', '\x1b[0m');
           return false; 
        }
        
    }
    /**
     * 生成Build.json，用于生成正式包
     * @private
     * @author HuangLi
     * @param {[[Type]]} storepass [[Description]]
     * @param {[[Type]]} keypass   [[Description]]
     */
    _createBuildJson(storepass,keypass,alias){
        let jsonString=`{
                "android": {
                    "debug": {
                        "keystore": "automatic-gen.jks",
                        "storePassword": "${storepass}",
                        "alias": "${alias}",
                        "password" : "${keypass}",
                        "keystoreType": "jks"
                    },
                    "release": {
                        "keystore": "automatic-gen.jks",
                        "storePassword": "${storepass}",
                        "alias": "${alias}",
                        "password" : "${keypass}",
                        "keystoreType": "jks"
                    }
                },
                "ios": {
                    "debug": {
                        "codeSignIdentity": "iPhone Development",
                        "provisioningProfile": "去目录下查看对应的文件的文件名 ~/Library/MobileDevice/Provisioning Profiles",
                        "developmentTeam": "去苹果官网看查TeamID",
                        "packageType": "development"
                    },
                    "release": {
                        "codeSignIdentity": "iPhone Distribution",
                        "provisioningProfile": "去目录下查看对应的文件的文件名 ~/Library/MobileDevice/Provisioning Profiles",
                        "developmentTeam": "去苹果官网看查TeamID",
                        "packageType": "enterprise"
                    }
                }
            }`;
            let build=process.platform=='win32'?`${alias}\\build.json`:`${alias}/build.json`;
        return fs.writeFileSync(build, jsonString);
    }
    /**
     * 安装混淆H5代码模块
     * @author HuangLi
     */
    installGrunt(){ 
//        console.log('安装Grunt模块');
//        try{exec('grunt --version')}catch(e){
//            exec('npm install -g grunt',{ stdio: [0, 1, 2] });
//        }
//        exec('npm install -g grunt-contrib-copy',{ stdio: [0, 1, 2] });
//        exec('npm install -g grunt-contrib-uglify',{ stdio: [0, 1, 2] });
//        exec('npm install -g grunt-contrib-htmlmin',{ stdio: [0, 1, 2] });
//        stepLog.stepDone(5);
//        return true; 
    }
    /**
     * 拷贝资源文件到新工程中
     * @author HuangLi
     */
    copyResource(){
        try{
           if(process.platform=='win32'){
               exec(`xcopy ${__dirname}\\res\\*.* ${this.dirName}\\res\\ /s`);
           }else{
                exec(`cp -R ${__dirname}/res ${this.dirName}`);
           }
        }catch(e){ 
            console.error(e);
            return false;
        }
        stepLog.stepDone(5);
        this._insertConfig();
        return true;
    }
    /**
     * 像config.xml中插入配置
     * @private
     * @author HuangLi
     */
    _insertConfig(){
        let preferences=`
    <!--是否关闭iOS的webview的橡皮筋效果-->
    <preference name="DisallowOverscroll" value="ture"/>
    <!--是否只在第一次启动时显示启动图片-->
    <preference name="SplashShowOnlyFirstTime" value="false" />
    <!--起屏页面的显示时长（默认3000毫秒）-->
    <preference name="SplashScreenDelay" value="3000" />
    <!--启动图片的文件名，默认是screen-->
    <preference name="SplashScreen" value="screen" />
    <platform name="android">`;
        let androidConfig=`
    <platform name="android">            
        <icon src="res/android/mdpi.png" density="mdpi" />
        <icon src="res/android/hdpi.png" density="hdpi" />
        <icon src="res/android/xhdpi.png" density="xhdpi" />
        <icon src="res/android/xxhdpi.png" density="xxhdpi" />
        <splash src="res/android/splash-port-hdpi.png" density="port-hdpi"/> 
        <splash src="res/android/splash-port-mdpi.png" density="port-mdpi"/>
        <splash src="res/android/splash-port-xhdpi.png" density="port-xhdpi"/>`;
        let iosConfig=`
    <platform name="ios">
        <icon src="res/ios/icon-60@3x.png" width="180" height="180"/>
        <icon src="res/ios/icon-60.png" width="60" height="60"/>
        <icon src="res/ios/icon-60@2x.png" width="120" height="120" />
        <icon src="res/ios/icon-40.png" width="40" height="40" />
        <icon src="res/ios/icon-40@2x.png" width="80" height="80" />
        <icon src="res/ios/icon-small-1.png" width="29" height="29" />
        <icon src="res/ios/icon-small@2x-1.png" width="58" height="58" />
        <icon src="res/ios/icon-small@3x.png" width="87" height="87" />
        <splash  src="res/ios/Default@2x~iphone.png" width="640" height="960" />
        <splash  src="res/ios/Default-568h@2x~iphone.png" width="640" height="1136"/>
        <splash  src="res/ios/Default-667h.png" width="750" height="1334"/>
        <splash  src="res/ios/Default-736h.png" width="1242" height="2208"/>   `;
        let configPath;
        configPath=process.platform=='win32'?`${this.dirName}/config.xml`:`${this.dirName}/config.xml`
        let str=fs.readFileSync(configPath,'utf-8');
        str=str.replace('<platform name="android">',preferences);
        str=str.replace('<platform name="android">',androidConfig);
        str=str.replace('<platform name="ios">',iosConfig);
        fs.writeFileSync(configPath, str); 
    }
}
module.exports = ProjectCreator;