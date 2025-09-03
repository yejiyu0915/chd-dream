import m from '@/app/main/main.module.scss';
import KV from '@/app/main/KV/KV';
import Intro from '@/app/main/intro/Intro';
import Sermon from '@/app/main/sermon/Sermon';
import CLog from '@/app/main/c-log/CLog';
import QuickLink from '@/app/main/quick-link/QuickLink';
import Instagram from '@/app/main/Instagram/Instagram';
import { getSermonData } from '@/lib/notion'; // getSermonData 임포트
// import { getNewsData } from '@/lib/notion'; // getNewsData 임포트 제거

export default async function Main() {
  // 서버 컴포넌트로 변경 및 async 추가
  const sermonData = await getSermonData(); // 설교 데이터 가져오기
  // const newsData = await getNewsData(); // 뉴스 데이터 가져오는 로직 제거

  return (
    <main className={m.main}>
      <KV /> {/* newsData prop 제거 */}
      <div className={m.main__content}>
        <Sermon sermonData={sermonData} /> {/* sermonData prop으로 전달 */}
        <Intro />
        <CLog />
        <QuickLink />
        <Instagram />
      </div>
    </main>
  );
}
