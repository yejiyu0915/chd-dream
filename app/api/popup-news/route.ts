import { getNewsData } from '@/lib/notion';
import { handleApiGetRequest } from '@/common/utils/apiHandler';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🚀 팝업 뉴스 API 시작 - 새로운 버전');

  try {
    const data = await getPopupNewsData();
    console.log('📤 API에서 반환할 데이터:', data);

    // 항상 데이터를 반환하되, null이면 빈 객체로
    const responseData = data || {};
    console.log('📤 최종 응답 데이터:', responseData);

    return Response.json(responseData);
  } catch (error) {
    console.error('💥 팝업 뉴스 API 오류:', error);
    return Response.json(
      { error: '팝업 뉴스 데이터를 가져오는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 팝업 뉴스 데이터를 가져오는 함수
async function getPopupNewsData() {
  try {
    console.log('🔍 팝업 뉴스 데이터 가져오기 시작');

    // 모든 뉴스 데이터 가져오기
    const allNewsData = await getNewsData();
    console.log('📰 전체 뉴스 데이터 개수:', allNewsData.length);

    // 현재 시간
    const now = new Date();
    console.log('⏰ 현재 시간:', now.toISOString());

    // 팝업 조건에 맞는 뉴스 필터링
    const popupNews = allNewsData.filter((news) => {
      console.log(`📋 뉴스 체크: "${news.title}"`);
      console.log(`  - popup: ${news.popup}`);
      console.log(`  - popupStartDate: ${news.popupStartDate}`);
      console.log(`  - popupEndDate: ${news.popupEndDate}`);

      // 1. popup이 true인 뉴스만
      if (!news.popup) {
        console.log(`  ❌ popup이 false이므로 제외`);
        return false;
      }

      // 2. popupStartDate가 설정되어 있으면 현재 시간이 시작 시간 이후여야 함
      if (news.popupStartDate) {
        const startDate = new Date(news.popupStartDate);
        console.log(`  📅 시작 날짜: ${startDate.toISOString()}`);
        if (now < startDate) {
          console.log(`  ❌ 아직 시작 시간이 되지 않음`);
          return false;
        }
      }

      // 3. popupEndDate가 설정되어 있으면 현재 시간이 종료 시간 이전이어야 함
      if (news.popupEndDate) {
        const endDate = new Date(news.popupEndDate);
        console.log(`  📅 종료 날짜: ${endDate.toISOString()}`);
        if (now > endDate) {
          console.log(`  ❌ 이미 종료 시간이 지남`);
          return false;
        }
      }

      console.log(`  ✅ 팝업 조건 만족`);
      return true;
    });

    console.log('🎯 팝업 조건을 만족하는 뉴스 개수:', popupNews.length);

    // 팝업 뉴스가 없으면 null 반환
    if (popupNews.length === 0) {
      console.log('❌ 팝업 조건을 만족하는 뉴스가 없음');
      return null;
    }

    // 팝업 뉴스가 여러 개인 경우 우선순위에 따라 정렬
    console.log('🔄 팝업 뉴스 정렬 시작');
    popupNews.sort((a, b) => {
      // 1. popupEndDate가 가장 늦은 것 우선
      if (a.popupEndDate && b.popupEndDate) {
        const aEndDate = new Date(a.popupEndDate);
        const bEndDate = new Date(b.popupEndDate);
        if (aEndDate.getTime() !== bEndDate.getTime()) {
          return bEndDate.getTime() - aEndDate.getTime(); // 내림차순 (늦은 것이 먼저)
        }
      } else if (a.popupEndDate && !b.popupEndDate) {
        return -1; // a가 종료일이 있으면 우선
      } else if (!a.popupEndDate && b.popupEndDate) {
        return 1; // b가 종료일이 있으면 우선
      }

      // 2. popupEndDate가 같거나 둘 다 없으면 Date가 가장 최신인 것 우선
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return bDate.getTime() - aDate.getTime(); // 내림차순 (최신이 먼저)
    });

    // 가장 우선순위가 높은 뉴스 하나만 반환
    const selectedNews = popupNews[0];
    console.log('🏆 선택된 팝업 뉴스:', selectedNews.title);
    console.log('📊 최종 반환 데이터:', selectedNews);
    return selectedNews;
  } catch (error) {
    console.error('💥 팝업 뉴스 데이터 가져오기 중 오류:', error);
    return null;
  }
}
