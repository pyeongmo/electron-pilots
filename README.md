# 🚀 Electron Pilots

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-22.3.27-blue.svg)](https://www.electronjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-orange.svg)](https://expressjs.com/)

## 🔧 요구사항

이 프로젝트는 **Windows 7** 및 **Windows Server 2016** 환경에서 동작하는 Electron 앱을 빌드하기 위해 다음 환경을 필요로 합니다.

- **Node.js**: v16 고정 (Electron v22 실행 및 빌드를 위한 최고 버전)
- **npm**: npm 외 패키지 매니저 및 각종 mono-repo 도구 미사용
- **Electron**: v22 고정 (Windows 7 호환성이 확보된 최고 버전)
- Electron Builder가 의존하는 `node-gyp`의 [요구사항](https://github.com/nodejs/node-gyp#on-windows)
  - **Python v3.10**
  - **VS Desktop development with C++** (from Visual Studio Build Tools 2019)

## 📦 설치

각 디렉토리에서 의존성 패키지를 설치해주세요.

```bash
# 서버 의존성 설치
cd server npm install

# 클라이언트 의존성 설치
cd ../client npm install
```

## 🚀 실행 방법

### 1. 서버 실행
```bash
cd server
npm run start
```

### 2. 클라이언트 실행
서버가 정상적으로 실행된 후:
1. 'Start Server' 버튼을 클릭
2. 새 터미널에서 클라이언트 실행:
```bash
cd client
npm run start
```

## 📁 프로젝트 구조

```
electron-pilots/
├── client/             # Electron 클라이언트 애플리케이션
│   ├── main.js         # Electron 메인 프로세스
│   ├── index.html      # 클라이언트 UI
│   ├── preload.js      # 프리로드 스크립트
│   └── package.json    # 클라이언트 의존성
├── server/             # Express 서버 애플리케이션
│   ├── main.js         # Express 서버 메인 파일
│   ├── index.html      # 서버 UI
│   ├── preload.js      # 프리로드 스크립트
│   ├── database.sqlite # SQLite 데이터베이스
│   └── package.json    # 서버 의존성
└── README.md
```

## 🛠 기술 스택

- **Electron** (v22.3.27) - 데스크톱 애플리케이션 프레임워크 **(호환성을 위해 버전 변경 금지!)**
- **Electron Builder** (v23.6.0) - 애플리케이션 패키징 도구 **(호환성을 위해 버전 변경 금지!)**

### 서버
- **Express** (v4.18.2) - 웹 애플리케이션 프레임워크
- **SQLite3** (v5.1.7) - 데이터베이스

### 클라이언트
- **Axios** (v1.10.0) - HTTP 클라이언트

## 💡 참고사항
- 이 프로젝트는 mono-repo 도구를 사용하지 않으므로 각 디렉토리에서 개별적으로 패키지를 설치해야 합니다.
- 서버를 먼저 실행한 후 클라이언트를 실행하시기 바랍니다.
- `Electron v22`는 내부적으로 `Chromium 108`을 사용합니다. [#참고](https://www.electronjs.org/blog/electron-22-0)
