const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;
const serverPort = 3000;
let expressServer = null; // Express 서버 인스턴스를 저장할 변수

// --- SQLite 데이터베이스 설정 ---
const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
let db = null; // DB 연결을 null로 초기화

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        // 데이터베이스 디렉토리가 없으면 생성
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Database connection error:', err.message);
                reject(err);
            } else {
                console.log('Connected to the SQLite database.');
                db.run('CREATE TABLE IF NOT EXISTS somethings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, value TEXT)', (err) => {
                    if (err) {
                        console.error('Table creation error:', err.message);
                        reject(err);
                    } else {
                        console.log('Somethings table checked/created.');
                        resolve();
                    }
                });
            }
        });
    });
}

function closeDatabase() {
    return new Promise((resolve, reject) => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                    reject(err);
                } else {
                    console.log('Database connection closed.');
                    db = null; // DB 연결 해제 후 null로 설정
                    resolve();
                }
            });
        } else {
            resolve(); // 이미 닫혀있으면 그냥 resolve
        }
    });
}

// --- Express 서버 설정 ---
const serverApp = express();
serverApp.use(express.json());

serverApp.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // 배포 시 Client App 오리진으로 변경
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

serverApp.get('/api/somethings', (req, res) => {
    if (!db) {
        return res.status(500).json({ error: 'Database not initialized.' });
    }
    db.all('SELECT * FROM somethings', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ somethings: rows });
    });
});

serverApp.post('/api/somethings', (req, res) => {
    if (!db) {
        return res.status(500).json({ error: 'Database not initialized.' });
    }
    const { name, value } = req.body;
    if (!name || !value) {
        return res.status(400).json({ error: 'Name and value are required.' });
    }
    db.run('INSERT INTO somethings (name, value) VALUES (?, ?)', [name, value], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name, value });
    });
});

// --- 서버 시작/중지 함수 ---
async function startServer() {
    if (expressServer) {
        console.log('Server is already running.');
        return { status: 'running', message: 'Server is already running.' };
    }

    if (!app.isReady()) {
        await app.whenReady();
    }


    try {
        await initializeDatabase();
        expressServer = serverApp.listen(serverPort, () => {
            console.log(`Pilot server listening on http://localhost:${serverPort}`);
            if (mainWindow) {
                mainWindow.webContents.send('server-status-changed', { status: 'running', port: serverPort });
            }
        });
        return { status: 'running', port: serverPort };
    } catch (error) {
        console.error('Failed to start server:', error);
        if (mainWindow) {
            mainWindow.webContents.send('server-status-changed', { status: 'error', message: error.message });
        }
        return { status: 'error', message: error.message };
    }
}

async function stopServer() {
    if (!expressServer) {
        console.log('Server is not running.');
        return { status: 'stopped', message: 'Server is not running.' };
    }
    return new Promise((resolve, reject) => {
        expressServer.close(async (err) => {
            if (err) {
                console.error('Error stopping server:', err.message);
                reject({ status: 'error', message: err.message });
            } else {
                console.log('Pilot server stopped.');
                expressServer = null;
                await closeDatabase(); // DB 연결도 함께 해제
                if (mainWindow) {
                    mainWindow.webContents.send('server-status-changed', { status: 'stopped' });
                }
                resolve({ status: 'stopped', message: 'Server stopped.' });
            }
        });
    });
}

// --- Electron 앱 초기화 및 창 생성 ---
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        },
        show: true
    });

    mainWindow.loadFile('index.html'); // index.html 로드
    // mainWindow.webContents.openDevTools(); // 개발자 도구 (필요시 활성화)

    mainWindow.on('ready-to-show', async () => {
        mainWindow.show();
        // 앱 시작 시 자동으로 서버를 시작하려면 이곳에서 호출
        // await startServer();
        // UI에 초기 상태 전송
        const status = expressServer ? 'running' : 'stopped';
        const port = expressServer ? serverPort : null;
        mainWindow.webContents.send('server-status-changed', { status, port });
    });

    mainWindow.on('closed', async () => {
        mainWindow = null;
        // 앱 종료 시 서버와 DB 연결 정리
        if (expressServer) {
            await stopServer();
        }
        await closeDatabase();
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// --- IPC 통신 (렌더러 프로세스와 통신) ---
ipcMain.handle('get-server-initial-status', () => {
    return {
        status: expressServer ? 'running' : 'stopped',
        port: expressServer ? serverPort : null
    };
});

ipcMain.handle('start-server', async () => {
    return await startServer();
});

ipcMain.handle('stop-server', async () => {
    return await stopServer();
});
