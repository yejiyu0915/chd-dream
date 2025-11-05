'use client';

import PageTitleSetter from '@/app/worship/components/PageTitleSetter';
import t from '@/app/worship/timetable/Timetable.module.scss';

export default function TimetablePage() {
  return (
    <>
      {/* 페이지 타이틀 설정 */}
      <PageTitleSetter title="예배 안내" />

      <div className={`${t.timetable} detail-inner`}>
        <div className={t.inner}>
          {/* 예배 시간표 테이블 */}
          <h2 className={t.title}>집회 안내</h2>
          <table className={t.table}>
            <thead>
              <tr>
                <th colSpan={2}>구분</th>
                <th>시간</th>
                <th>장소</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowSpan={2}>주일</th>
                <th className={t.assemblyTitle}>주일 오전 예배</th>
                <td className={t.assemblyTime}>오전 11:00</td>
                <td>본당</td>
              </tr>
              <tr className={t.borderBottom}>
                <th className={t.assemblyTitle}>주일 저녁 예배</th>
                <td className={t.assemblyTime}>오후 7:00</td>
                <td>본당</td>
              </tr>
              <tr>
                <th rowSpan={3}>평일</th>
                <th className={t.assemblyTitle}>수요 기도회</th>
                <td className={t.assemblyTime}>오후 8:00</td>
                <td>본당</td>
              </tr>
              <tr>
                <th className={t.assemblyTitle}>금요 기도회</th>
                <td className={t.assemblyTime}>오후 8:00</td>
                <td>본당</td>
              </tr>
              <tr>
                <th className={t.assemblyTitle}>매일 기도회(월~금)</th>
                <td className={t.assemblyTime}>오후 8:00</td>
                <td>본당</td>
              </tr>
            </tbody>
          </table>
          <h2 className={t.title}>미래 세대</h2>
          <table className={t.table}>
            <thead>
              <tr>
                <th colSpan={2}>구분</th>
                <th>시간</th>
                <th>장소</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>유아부</th>
                <th rowSpan={4} className={t.assemblyTitle}>
                  예랑학교
                </th>
                <td className={t.assemblyTime}>주일 오전 11:00</td>
                <td rowSpan={2}>4, 5층</td>
              </tr>
              <tr>
                <th>유치부</th>
                <td className={t.assemblyTime}>주일 오후 7:00</td>
              </tr>
              <tr>
                <th>초등부</th>
                <td rowSpan={2} className={t.assemblyTime}>
                  주일 오후 2:00
                </td>
                <td rowSpan={2}>4층</td>
              </tr>
              <tr className={t.borderBottom}>
                <th>중·고등부</th>
              </tr>
              <tr>
                <th colSpan={2} rowSpan={2} className={t.assemblyTitle}>
                  청년부
                </th>
                <td className={t.assemblyTime}>주일 오전 11:00</td>
                <td rowSpan={2}>4층</td>
              </tr>
              <tr>
                <td className={t.assemblyTime}>주일 오후 7:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
