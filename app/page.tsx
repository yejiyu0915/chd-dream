import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <a href="#" className={styles.logo}>
            CHD Dream
          </a>
          <nav>
            <ul className={styles.nav}>
              <li>
                <a href="#about" className={styles.navLink}>
                  교회소개
                </a>
              </li>
              <li>
                <a href="#worship" className={styles.navLink}>
                  예배안내
                </a>
              </li>
              <li>
                <a href="#news" className={styles.navLink}>
                  교회소식
                </a>
              </li>
              <li>
                <a href="#contact" className={styles.navLink}>
                  연락처
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 배너 슬라이드 */}
      <section className={styles.bannerSection} style={{ display: 'none' }}>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>메인배너</h1>
          <p className={styles.bannerSubtitle}>메인배너</p>
          <a href="#worship" className={styles.bannerButton}>
            버튼
          </a>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <main className={styles.main} style={{ display: 'none' }}>
        <div className={styles.contentGrid}>
          {/* 왼쪽 컬럼 */}
          <div className={styles.leftColumn}>
            {/* 공지사항 요약 */}
            <section className={styles.noticeSection}>
              <h2 className={styles.sectionTitle}>공지사항</h2>
              <ul className={styles.noticeList}>
                <li className={styles.noticeItem}>
                  <a href="#" className={styles.noticeTitle}>
                    2024년 교회 정기총회 안내
                  </a>
                  <span className={styles.noticeDate}>2024.01.15</span>
                </li>
                <li className={styles.noticeItem}>
                  <a href="#" className={styles.noticeTitle}>
                    청년부 겨울 수련회 참가 신청
                  </a>
                  <span className={styles.noticeDate}>2024.01.12</span>
                </li>
                <li className={styles.noticeItem}>
                  <a href="#" className={styles.noticeTitle}>
                    주일학교 교사 모집 공고
                  </a>
                  <span className={styles.noticeDate}>2024.01.10</span>
                </li>
                <li className={styles.noticeItem}>
                  <a href="#" className={styles.noticeTitle}>
                    교회 건축 기금 모금 안내
                  </a>
                  <span className={styles.noticeDate}>2024.01.08</span>
                </li>
                <li className={styles.noticeItem}>
                  <a href="#" className={styles.noticeTitle}>
                    새해 새벽기도회 안내
                  </a>
                  <span className={styles.noticeDate}>2024.01.05</span>
                </li>
              </ul>
            </section>

            {/* 이번 주 일정 (요약) */}
            <section className={styles.scheduleSection}>
              <h2 className={styles.sectionTitle}>이번 주 일정</h2>
              <ul className={styles.scheduleList}>
                <li className={styles.scheduleItem}>
                  <div className={styles.scheduleDate}>일</div>
                  <div className={styles.scheduleInfo}>
                    <div className={styles.scheduleTitle}>주일 예배</div>
                    <div className={styles.scheduleTime}>오전 11:00 - 본당</div>
                  </div>
                </li>
                <li className={styles.scheduleItem}>
                  <div className={styles.scheduleDate}>수</div>
                  <div className={styles.scheduleInfo}>
                    <div className={styles.scheduleTitle}>수요 예배</div>
                    <div className={styles.scheduleTime}>오후 7:30 - 본당</div>
                  </div>
                </li>
                <li className={styles.scheduleItem}>
                  <div className={styles.scheduleDate}>금</div>
                  <div className={styles.scheduleInfo}>
                    <div className={styles.scheduleTitle}>금요 기도회</div>
                    <div className={styles.scheduleTime}>오후 8:00 - 기도실</div>
                  </div>
                </li>
                <li className={styles.scheduleItem}>
                  <div className={styles.scheduleDate}>토</div>
                  <div className={styles.scheduleInfo}>
                    <div className={styles.scheduleTitle}>청년부 모임</div>
                    <div className={styles.scheduleTime}>오후 6:00 - 청년실</div>
                  </div>
                </li>
              </ul>
            </section>

            {/* 오늘의 설교 말씀 */}
            <section className={styles.sermonSection}>
              <h2 className={styles.sectionTitle}>오늘의 설교 말씀</h2>
              <div className={styles.sermonContent}>
                <h3 className={styles.sermonTitle}>하나님의 꿈을 이루는 삶</h3>
                <p className={styles.sermonVerse}>요한복음 10:10</p>
                <p className={styles.sermonSummary}>
                  &ldquo;내가 온 것은 양으로 생명을 얻게 하고 더 풍성히 얻게 하려는 것이라&rdquo; 이
                  말씀은 우리가 하나님의 꿈을 이루며 살아갈 때, 단순히 생존하는 것이 아니라 풍성한
                  삶을 살 수 있다는 것을 보여줍니다. 오늘 우리는 하나님께서 우리에게 주신 꿈과
                  비전을 발견하고, 그 꿈을 이루어가는 여정에 대해 함께 나누고자 합니다.
                </p>
              </div>
            </section>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className={styles.rightColumn}>
            {/* Instagram API 피드 */}
            <section className={styles.instagramSection}>
              <h2 className={styles.sectionTitle}>교회 소식</h2>
              <div className={styles.instagramGrid}>
                <div className={styles.instagramItem}>
                  <span>Instagram 피드 1</span>
                </div>
                <div className={styles.instagramItem}>
                  <span>Instagram 피드 2</span>
                </div>
                <div className={styles.instagramItem}>
                  <span>Instagram 피드 3</span>
                </div>
                <div className={styles.instagramItem}>
                  <span>Instagram 피드 4</span>
                </div>
                <div className={styles.instagramItem}>
                  <span>Instagram 피드 5</span>
                </div>
                <div className={styles.instagramItem}>
                  <span>Instagram 피드 6</span>
                </div>
              </div>
            </section>

            {/* 빠른 링크 */}
            <section className={styles.noticeSection}>
              <h2 className={styles.sectionTitle}>빠른 링크</h2>
              <ul className={styles.noticeList}>
                <li className={styles.noticeItem}>
                  <a href="/worship" className={styles.noticeTitle}>
                    예배 시간표
                  </a>
                </li>
                <li className={styles.noticeItem}>
                  <a href="/about" className={styles.noticeTitle}>
                    교회 소개
                  </a>
                </li>
                <li className={styles.noticeItem}>
                  <a href="/news" className={styles.noticeTitle}>
                    교회 소식
                  </a>
                </li>
                <li className={styles.noticeItem}>
                  <a href="/contact" className={styles.noticeTitle}>
                    오시는 길
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className={styles.footer} style={{ display: 'none' }}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>연락처</h3>
            <p>주소: 인천광역시 중구 중앙로 123</p>
            <p>전화: 032-123-4567</p>
            <p>이메일: info@incheonchurch.org</p>
          </div>
          <div className={styles.footerSection}>
            <h3>교회 정보</h3>
            <p>담임목사: 김목사</p>
            <p>설립일: 1995년 3월 15일</p>
            <p>교인수: 약 500명</p>
          </div>
          <div className={styles.footerSection}>
            <h3>바로가기</h3>
            <p>
              <a href="#about">교회소개</a>
            </p>
            <p>
              <a href="#worship">예배안내</a>
            </p>
            <p>
              <a href="#news">교회소식</a>
            </p>
            <p>
              <a href="#contact">연락처</a>
            </p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 순복음인천초대교회. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
