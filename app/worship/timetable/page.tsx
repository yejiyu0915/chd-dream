'use client';

import t from '@/app/worship/timetable/Timetable.module.scss';

export default function TimetablePage() {
  return (
    <>
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
                <th rowSpan={2}>주일 예배</th>
                <th className={t.assemblyTitle}>본 예배</th>
                <td className={t.assemblyTime}>오전 11:00</td>
                <td>본당</td>
              </tr>
              <tr className={t.borderBottom}>
                <th className={t.assemblyTitle}>오후 예배</th>
                <td className={t.assemblyTime}>오후 7:00</td>
                <td>본당</td>
              </tr>
              <tr>
                <th colSpan={2} className={t.assemblyTitle}>
                  수요 기도회
                </th>
                <td className={t.assemblyTime}>저녁 8:00</td>
                <td>본당</td>
              </tr>
              <tr>
                <th colSpan={2} className={t.assemblyTitle}>
                  금요 기도회
                </th>
                <td className={t.assemblyTime}>저녁 8:00</td>
                <td>본당</td>
              </tr>
              <tr>
                <th colSpan={2} className={t.assemblyTitle}>
                  매일 기도회
                  <br className="only-mo" />
                  (월~금)
                </th>
                <td className={t.assemblyTime}>저녁 8:00</td>
                <td>본당</td>
              </tr>
            </tbody>
          </table>
          <h2 className={t.title}>미래 세대</h2>
          <table className={t.table}>
            <thead>
              <tr>
                <th>구분</th>
                <th>시간</th>
                <th>장소</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={t.assemblyTitle}>유아부 예배</th>
                <td className={t.assemblyTime}>주일 오전 11:00</td>
                <td>4, 5층</td>
              </tr>
              <tr className={t.borderBottom}>
                <th className={t.assemblyTitle}>유치부 예배</th>
                <td className={t.assemblyTime}>주일 오전 11:00</td>
                <td>4, 5층</td>
              </tr>
              <tr className={t.borderBottom}>
                <th className={t.assemblyTitle}>
                  예꿈 예배 <br className="only-mo" />
                  (초·중·고)
                </th>
                <td className={t.assemblyTime}>주일 오후 2:00</td>
                <td>4층 본당</td>
              </tr>
              <tr>
                <th className={t.assemblyTitle}>청년부</th>
                <td className={t.assemblyTime}>주일 오전 11:00</td>
                <td>4층 본당</td>
              </tr>
            </tbody>
          </table>
          <h2 className={t.title}>교회 활동</h2>
          <table className={t.table}>
            <thead>
              <tr>
                <th>구분</th>
                <th>시간</th>
                <th>장소</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={t.assemblyTitle}>중보기도</th>
                <td rowSpan={2} className={t.assemblyTime}>
                  월~금 오전 10:00
                </td>
                <td rowSpan={2}>4층 본당</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
