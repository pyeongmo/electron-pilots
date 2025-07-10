const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // 메인 프로세스에서 초기 상태 요청 (비동기)
    getServerInitialStatus: () => ipcRenderer.invoke('get-server-initial-status'),
    // 메인 프로세스에 서버 시작 요청 (비동기)
    startServer: () => ipcRenderer.invoke('start-server'),
    // 메인 프로세스에 서버 중지 요청 (비동기)
    stopServer: () => ipcRenderer.invoke('stop-server'),
    // 메인 프로세스로부터 서버 상태 변경 알림 수신 (이벤트)
    onServerStatusChanged: (callback) => ipcRenderer.on('server-status-changed', callback)
});
