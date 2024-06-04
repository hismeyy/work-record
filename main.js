const { app, BrowserWindow, screen } = require('electron');
const path = require('node:path');

let mainWindow; // 用于存储主窗口对象
let tray = null;
let autoStartEnabled = true; // 默认自动启动

// 创建窗口函数
const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const windowWidth = 180;
    const windowHeight = 5;

    const x = width - windowWidth - 20;
    const y = 20; // 顶部

    // 新建一个窗口
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: windowWidth,
        height: windowHeight,
        x: x,
        y: y,
        frame: false,
        resizable: false,
        skipTaskbar: true,
        minimizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.setAlwaysOnTop(true, 'floating');

    // 加载本地的 index.html 文件
    mainWindow.loadFile('index.html');

    // 切换自动启动状态并更新设置
    setAppAutoLaunch(autoStartEnabled);



    // 监听窗口的关闭事件，防止窗口被关闭
    mainWindow.on('close', (event) => {
        // 阻止窗口的关闭操作
        event.preventDefault();
        // 这里可以放置你希望在尝试关闭窗口时执行的代码
        // 例如，你可以在这里记录日志、显示提示信息等
    });


};

function setAppAutoLaunch(enabled) {
    app.setLoginItemSettings({
        openAtLogin: enabled,
        path: app.getPath('exe'),
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    // 对于非 macOS 应用，通常当所有窗口都被关闭时应用会退出
    // 由于我们阻止了窗口关闭，这里不需要执行退出操作
    if (process.platform !== 'darwin') {
        // app.quit();
    }
});
