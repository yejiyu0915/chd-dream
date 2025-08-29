This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

이 프로젝트는 Notion API를 CMS로 사용합니다. 다음 환경변수를 설정해야 합니다:

1. 프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
# Notion API 설정
NOTION_TOKEN=your_notion_integration_token_here
NOTION_CLOG_ID=your_notion_database_id_here
```

2. Notion Integration Token 설정:
   - [Notion Developers](https://developers.notion.com/) 페이지에서 새 integration 생성
   - Integration Token을 복사하여 `NOTION_TOKEN`에 설정
   - 데이터베이스에 integration 권한 부여

3. Notion 데이터베이스 구조:
   - Title (title): 게시글 제목
   - Category (select): 카테고리 분류
   - Date (date): 게시 날짜
   - Image (files): 썸네일 이미지
   - Content (rich_text): 게시글 내용

4. Notion 데이터베이스 ID 찾는 방법:
   - Notion에서 데이터베이스 페이지 열기
   - URL에서 데이터베이스 ID 복사 (예: https://notion.so/workspace/25e8cb6c402a8122bd0ec5a16f624b41?v=...)
   - `25e8cb6c402a8122bd0ec5a16f624b41` 부분이 데이터베이스 ID입니다.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
