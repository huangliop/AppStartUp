/* 检查系统基础环境
 */
        
const exec = require('child_process').execSync;
class SysChecker {
    static _checkWin32() {
        let adb, zip, jar, cor;
        try {
            jar = exec('java -version', {
                stdio: [0]
            });
        } catch (e) {}
        try {
            adb = exec('adb version', {
                stdio: [0]
            });
        } catch (e) {}
        try {
            zip = exec('7z', {
                stdio: [0]
            });
        } catch (e) {}
        try {
            cor = exec('cordova', {
                stdio: [0]
            });
        } catch (e) {}
        if (jar && adb && zip && cor) {
            console.log('\x1b[32m', '所需软件环境正常', '\x1b[0m');
            return true;
        } else {
            console.log('\x1b[31m');
            if (!jar) console.error('缺少java环境,请安装JDK并将其配置到环境变量中');
            if (!adb) console.error('缺少android SDK环境,请下载SDK并将其配置到环境变量中');
            if (!cor) console.error('缺少Cordova环境,请使用npm install -g cordova安装');
            if (!zip) console.error('缺少7z压缩软件,请下载7z后将其配置到环境变量中');
            console.log('\x1b[0m');
            return false;
        }
    }
    static _checkMac() {
        
        let adb, xcode, jar, cor;
        try {
            jar = exec('java -version', {
                stdio: [0]
            });
        } catch (e) {}
        try {
            adb = exec('adb version', {
                stdio: [0]
            });
        } catch (e) {}
        try {
            cor = exec('cordova', {
                stdio: [0]
            });
        } catch (e) {}
        try{
            xcode=exec('xcode-select -p',{stdio:[0]});
        }catch(e){}
        if (jar && adb  && cor&&xcode) {
            console.log('\x1b[32m', '必需的环境正常', '\x1b[0m');
            return true;
        } else {
            console.log('\x1b[31m');
            if (!jar) console.error('缺少java环境,请安装JDK并将其配置到环境变量中');
            if (!adb) console.error('缺少android SDK环境,请下载SDK并将其配置到环境变量中');
            if (!cor) console.error('缺少Cordova环境,请使用npm install -g cordova安装');
            if (!xcode) console.error('缺少Xcode,请在AppStroe中安装');
            console.log('\x1b[0m');
            return false;
        }
    }
    static check() {
        if (process.platform == 'win32') {
            return this._checkWin32();
        } else {
            return this._checkMac();
        }
    }
}
module.exports = SysChecker;