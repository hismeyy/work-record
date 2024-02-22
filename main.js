const { app, BrowserWindow, screen,Tray, Menu  } = require('electron')
const path = require('node:path')

let mainWindow;
let tray = null;
let autoStartEnabled = true; // 默认自动启动

// 创建窗口函数
const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const windowWidth = 360;
    const windowHeight = 50;

    const x = width - windowWidth - 20;
    const y = 20; // 顶部

    // 新建一个窗口
    const win = new BrowserWindow({
        // 隐藏菜单
        autoHideMenuBar: true,
        width: windowWidth,
        height: windowHeight,
        x: x,
        y: y,
        frame: false,
        resizable: false,
        skipTaskbar: true,
		// 预加载脚本
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.setAlwaysOnTop(true, 'floating');

    // 加载本地的 index.html 文件
    win.loadFile('index.html')

    // 切换自动启动状态并更新设置
    setAppAutoLaunch(autoStartEnabled);
}

function setAppAutoLaunch(enabled) {
    app.setLoginItemSettings({
        openAtLogin: enabled,
        path: app.getPath('exe'),
    });
}

// 当应用准备就绪时执行
app.whenReady().then(() => {
    // 创建窗口
    createWindow()

    // 监听激活事件，如果窗口数量为零，则创建窗口
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

// 当所有窗口都关闭时
app.on('window-all-closed', () => {
    // 如果不是 macOS 系统，则退出应用
    if (process.platform !== 'darwin') app.quit()
})