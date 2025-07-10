# 🚀 Electron Pilots

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-22.3.27-blue.svg)](https://www.electronjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-orange.svg)](https://expressjs.com/)

## 📋 목차

- [요구사항](#요구사항)
- [설치](#설치)
- [실행 방법](#실행-방법)
- [프로젝트 구조](#프로젝트-구조)
- [기술 스택](#기술-스택)

## 🔧 요구사항

- **Node.js**: v16 이상
- **npm**: 패키지 매니저

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
├── client/              # Electron 클라이언트 애플리케이션
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

- **Electron** (v22.3.27) - 데스크톱 애플리케이션 프레임워크
- **Electron Builder** (v23.6.0) - 애플리케이션 패키징 도구
- **Axios** (v1.10.0) - HTTP 클라이언트

### 서버
- **Express** (v4.18.2) - 웹 애플리케이션 프레임워크
- **SQLite3** (v5.1.7) - 데이터베이스

## 💡 참고사항
- 이 프로젝트는 mono-repo 도구를 사용하지 않으므로 각 디렉토리에서 개별적으로 패키지를 설치해야 합니다.
- 서버를 먼저 실행한 후 클라이언트를 실행하시기 바랍니다.
