# NumberBlocks Episodes

5살 아이가 안전하게 NumberBlocks, Peppa Pig 에피소드를 시청할 수 있는 웹사이트입니다.

## 빠른 시작

1. `docs/index.html` 파일을 웹 브라우저에서 열기
2. 또는 GitHub Pages로 배포하여 사용

### 로컬 개발
```bash
cd docs
python3 -m http.server 8000
# http://localhost:8000 에서 확인
```

## 프로젝트 구조

```
docs/
├── index.html              # 메인 HTML (캐시 버전 관리 스크립트 포함)
├── numberblocks-logo.png
├── peppa-pig-logo.jpg
└── assets/
    ├── css/
    │   └── style.css       # 스타일시트
    └── js/
        ├── episode-data.js # 시리즈/에피소드 데이터 (seriesData)
        ├── common.js       # 동적 UI 렌더링, 탭/시리즈 전환
        └── iframe-mode.js  # iframe 전체화면 재생 모드
scripts/
└── update-version.sh       # 수동 버전 업데이트 (fallback)
```

## 시리즈/에피소드 추가

모든 시리즈와 에피소드 데이터는 `docs/assets/js/episode-data.js`의 `window.seriesData` 배열에서 관리됩니다.

### 에피소드 추가
해당 시리즈의 `tabs[].episodes` 배열에 항목을 추가합니다:
```js
{title: "에피소드 제목", videoId: "YouTube_ID"}
```

특정 구간만 재생하려면 `startTime`, `endTime`(초 단위)을 추가합니다:
```js
{title: "제목", videoId: "ID", startTime: 30, endTime: 300}
```

### 새 시리즈 추가
`episode-data.js`의 `seriesData` 배열에 시리즈 객체를 추가하면 됩니다. 다른 파일 수정이 필요 없습니다:
```js
{
    id: 'new-series',
    name: 'New Series',
    logo: 'new-series-logo.png',
    footer: { text: 'Based on', links: [{label: '...', url: '...'}] },
    tabs: [
        { id: 'Season1', label: 'Season 1', episodes: [...] }
    ]
}
```

## 캐시 관리

- **자동**: `docs/assets/` 파일이 포함된 커밋 시 pre-commit hook이 content hash 기반으로 캐시 버전을 자동 업데이트
- **수동** (fallback): `./scripts/update-version.sh 1.0.14`
- iOS Safari 특별 처리 및 뒤로가기 캐시 감지 포함

## 배포

- `main` 브랜치 `docs/` 폴더가 GitHub Pages로 서빙됨
- 커밋 & push 시 자동 반영 (별도 CI 없음)
