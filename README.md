# AppStartup
此node模块是用来，创建一个Cordova模板工程中。主要功能有：检查当前系统的环境是否满足要求、创建Cordova工程、添加Android和iOS工程、添加基础插件、自动生成一个默认的Android的keystore签名.SDK需要下载Android Support Repository

**注：第一次运行需要下载较多库文件，请保持网络畅通与耐心！**

## 需要的环境
node >=6.0.0

## 使用方法
安装node后，在命令行中使用 npm install -g appstartup

完成安装后，在命令行中执行 appstart。 在等待执行完毕后，就会生成一个工程。

## 图标和启动页
    请将res/android和res/ios下的图片以相同尺寸名称替换掉即可

## 加入H5代码
将自己编写的H5代码，拷贝到生成的工程目录下的www文件（将原有的文件删除掉），然后在根目录下的config.xml中修改‘index.html’为你的H5代码的入口文件即可。

## 运行工程
在工程目录下，使用命令行cordova run android或者cordova run ios 即可运行工程。

## 导出安装包
### android 
1. 在工程目录下执行cordova build android --debug(或者--release) 
1. 工程目录下的outputs目录中生成apk安装包。

### iOS
1. 使用前请在目录下的build.json文件中的ios结点下有说明的地方做相应的配置。
1. 使用命令cordova build ios --device
1. 安装包生成在outputs目录中，（企业级证书）

## 注意事项
1. 如果执行过程中出错，只要在再次执行appstart即可从上次出错的地方继续执行。

## 添加的插件如下
[cordova-plugin-device](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html):获取设备相关信息如系统版本、uuid、手机品牌等

[cordova-plugin-file](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html):用来访问手机上的本地文件

[cordova-plugin-app-version]( https://github.com/whiteoctober/cordova-plugin-app-version): 获取手机本App的应用版本等信息

[cordova-plugin-file-transfer](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file-transfer/index.html):用于下载和上传文件

[cordova-plugin-geolocation](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/index.html):定位插件，一般是iOS使用，如果要在android上定位建议自己添加这个插件https://github.com/huangliop/BaiduLocation4Cordova

[cordova-plugin-themeablebrowser](https://github.com/huangliop/cordova-plugin-themeablebrowser.git):内置浏览器，用于打开网页或者打开本地文件（如打开下载好的更新apk包），支持自定义头，能够显示加载进度。

[cordova-plugin-network-information](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-network-information/index.html):获得当前设备的网络状态

[cordova-plugin-splashscreen](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/index.html):控制启动页开启和关闭等

[cordova-plugin-statusbar](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-statusbar/index.html):设置状态栏，做iOS状态栏透明时需要使用

[cordova-plugin-zip](https://github.com/MobileChromeApps/cordova-plugin-zip):压缩、解压zip文件

[cordova-plugin-crosswalk-webview](https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview):crosswalk高速浏览器内核

[https://git.oschina.net/huangliop/chameleon-cordova-plugin.git](https://git.oschina.net/huangliop/chameleon-cordova-plugin.git):将H5文件拷贝到系统上运行，而不是在应用中运行;将最终打包好的应用文件拷贝到outputs目录；
    