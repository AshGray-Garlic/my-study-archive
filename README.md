# My Study Archive (DevArchive)

알고리즘, 자격증, CS 지식, 어학 학습 내용을 기록하고 복습할 수 있는 반응형 웹 애플리케이션입니다.

## 🚀 GitHub Pages 배포 가이드 (내 주소 만들기)

### 1단계: 패키지 설치
터미널에서 압축을 푼 폴더로 이동한 뒤 실행합니다:
```bash
npm install
```

### 2단계: GitHub에 원격 저장소 연결
1. [GitHub](https://github.com)에서 `my-study-archive` 이름으로 새 저장소(Public)를 생성합니다.
2. 아래 명령어로 코드를 GitHub에 올립니다:
```bash
git init
git add .
git commit -m "feat: first commit"
git branch -M main
git remote add origin https://github.com/[본인GitHub아이디]/my-study-archive.git
git push -u origin main
```

### 3단계: GitHub Pages로 자동 배포
터미널에 다음 명령어를 입력합니다:
```bash
npm run deploy
```
* 빌드가 완료되면 자동으로 `gh-pages` 브랜치가 생성되어 사이트가 배포됩니다.

### 4단계: 내 주소 확인
1. GitHub 저장소 페이지의 **Settings** -> **Pages**로 이동합니다.
2. Branch가 `gh-pages` / `/(root)`로 설정되어 있는지 확인합니다.
3. 잠시 후 상단에 생성된 주소(`https://[본인GitHub아이디].github.io/my-study-archive/`)를 확인하고 접속합니다!
