# 🎨 Color Palette Generator

아름다운 색상 팔레트를 생성하고 관리할 수 있는 웹 애플리케이션입니다. 접근성을 고려한 디자인과 다양한 편의 기능을 제공합니다.



## ✨ 주요 기능

### 🎯 팔레트 생성
- **랜덤 팔레트**: 완전히 랜덤한 색상 조합
- **조화로운 팔레트**: 색채 이론 기반 (단색조, 인접색, 보색, 삼색조)
- **커스터마이징**: 팔레트 크기 및 기준 색상 설정

### 🎛️ 색상 형식 지원
- **HEX** (#FFFFFF)
- **RGB** (rgb(255, 255, 255))
- **HSL** (hsl(0, 0%, 100%))
- 원클릭 형식 변환

### 💾 저장 및 내보내기
- 팔레트 로컬 저장 (LocalStorage)
- **CSS 변수** 형식으로 내보내기
- **JSON** 형식으로 내보내기
- 클립보드 원클릭 복사

### ⌨️ 키보드 단축키
- `Space`: 새 팔레트 생성
- `Ctrl + S`: 팔레트 저장
- `Ctrl + E`: CSS로 내보내기
- `Ctrl + J`: JSON으로 내보내기
- `Shift + ?`: 도움말 표시

### ♿ 접근성 기능
- **WCAG 대비율 분석**: AA, AAA 등급 확인
- **색맹 친화성 체크**: 적색맹, 녹색맹, 청색맹 고려
- 접근성 개선 권장사항 제공

### 🎪 사용자 경험
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- Toast 알림 시스템
- 부드러운 애니메이션
- 직관적인 인터페이스

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

```bash
# 프로젝트 클론
git clone https://github.com/YOUR_USERNAME/color-palette-generator.git
cd color-palette-generator

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 실행
npm start
```

## 🛠️ 기술 스택

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Development**: ESLint, Prettier

## 📁 프로젝트 구조

```
color-palette-generator/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── globals.css     # 글로벌 스타일
│   │   ├── layout.tsx      # 레이아웃 컴포넌트
│   │   └── page.tsx        # 메인 페이지
│   ├── components/         # React 컴포넌트
│   │   ├── ui/            # 기본 UI 컴포넌트
│   │   ├── ColorCard.tsx   # 색상 카드
│   │   ├── PaletteGenerator.tsx  # 메인 생성기
│   │   ├── HelpModal.tsx   # 도움말 모달
│   │   └── AccessibilityChecker.tsx  # 접근성 체커
│   ├── lib/               # 유틸리티 함수
│   │   ├── colorUtils.ts   # 색상 관련 함수
│   │   ├── utils.ts        # 일반 유틸리티
│   │   ├── accessibilityUtils.ts  # 접근성 분석
│   │   └── useKeyboardShortcuts.ts  # 키보드 단축키 훅
│   └── types/             # TypeScript 타입 정의
│       └── index.ts
├── public/                # 정적 파일
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎯 사용법

### 기본 사용법
1. **팔레트 생성**: "새 팔레트 생성" 버튼 클릭 또는 `Space` 키
2. **색상 복사**: 원하는 색상 카드 클릭
3. **형식 변경**: 색상 코드 클릭으로 HEX/RGB/HSL 순환
4. **팔레트 저장**: `Ctrl + S` 또는 저장 버튼 클릭

### 고급 기능
- **조화로운 팔레트**: 드롭다운에서 색채 이론 기반 모드 선택
- **접근성 체크**: "접근성 체크" 버튼으로 WCAG 준수 확인
- **내보내기**: CSS 또는 JSON 형식으로 다운로드

## 🤝 기여하기

1. 이 저장소를 Fork 합니다
2. 새로운 기능 브랜치를 만듭니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 엽니다

## 📄 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE) 하에 배포됩니다.

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - 훌륭한 React 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - 유연한 CSS 프레임워크
- [Lucide](https://lucide.dev/) - 아름다운 아이콘 라이브러리
- [WCAG](https://www.w3.org/WAI/WCAG21/quickref/) - 웹 접근성 가이드라인

---

⭐ 이 프로젝트가 도움이 되셨다면 별표를 눌러주세요!