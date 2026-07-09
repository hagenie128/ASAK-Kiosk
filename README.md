# ASAK Frontend

React + Vite 기반 ASAK 키오스크 프론트엔드 폴더입니다.

## 처음 받았을 때 셋팅

PowerShell에서 아래 순서대로 실행합니다.

```powershell
cd .\frontend
npm.cmd install
```

`npm install`이 PowerShell 실행 정책 때문에 막히면 `npm.cmd install`을 사용합니다.

## 개발 서버 실행

```powershell
cd .\frontend
npm.cmd run dev
```

브라우저에서 아래 주소를 엽니다.

```text
http://127.0.0.1:5173/
```

Vite는 React 화면을 빠르게 띄워주는 개발 서버/빌드 도구입니다. React 코드는 `src/` 안에서 작성합니다.

## 빌드

```powershell
cd .\frontend
npm.cmd run build
```

빌드 결과는 `dist/` 폴더에 생성됩니다.

## 주요 폴더

```text
frontend/
  index.html
  package.json
  vite.config.js
  public/      # 필요할 때 직접 생성, 이미지/폰트 같은 정적 파일
  src/
    main.jsx
    App.jsx
    styles.css
  dist/        # 빌드 결과, Git에 올리지 않음
```

## 데이터 경계

- 프론트 코드만 이 폴더에 둡니다.
- 데이터 파이프라인 산출물, seed JSON, 메뉴 이미지는 이 폴더에 넣지 않습니다.
- 필요한 데이터는 루트의 아래 폴더를 참조합니다.
  - `../data-pipeline/phase1/output/`
  - `../asak-data/seed/`
  - `../asak-data/images/menu/`
