# NumberBlocks Episodes

4살 아이가 안전하게 NumberBlocks 에피소드를 시청할 수 있는 웹사이트입니다.

## 🚀 빠른 시작

1. `docs/index.html` 파일을 웹 브라우저에서 열기
2. 또는 GitHub Pages로 배포하여 사용

## 📝 버전 업데이트 방법

코드를 수정한 후 버전을 업데이트하려면:

### 방법 1: 쉘 스크립트 사용 (Mac/Linux)
```bash
./scripts/update-version.sh 1.0.7
```

### 방법 2: 수동 업데이트
`docs/index.html` 파일에서 다음 5곳을 모두 수정:
1. CSS 파일: `style.css?v=1.0.1` → `style.css?v=1.0.2`
2. JavaScript 상수: `CURRENT_VERSION = '1.0.1'` → `CURRENT_VERSION = '1.0.2'`
3. episode-data.js: `episode-data.js?v=1.0.1` → `episode-data.js?v=1.0.2`
4. common.js: `common.js?v=1.0.1` → `common.js?v=1.0.2`
5. iframe-mode.js: `iframe-mode.js?v=1.0.1` → `iframe-mode.js?v=1.0.2`

## 🔧 캐시 관리

- 자동 버전 체크 및 캐시 무효화
- iOS Safari 특별 처리
- 뒤로가기 시 캐시된 페이지 감지

## 📁 프로젝트 구조

```
docs/
├── index.html          # 메인 HTML 파일
├── assets/
│   ├── css/
│   │   └── style.css   # 스타일시트
│   └── js/
│       ├── episode-data.js    # 에피소드 데이터
│       ├── common.js          # 공통 기능
│       └── iframe-mode.js     # iframe 재생 모드
└── *.png, *.jpg        # 이미지 파일들
``` 