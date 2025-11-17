'use client';

import { motion } from 'framer-motion';
import t from '@/app/worship/timetable/Timetable.module.scss';

export default function TimetablePage() {
  // 애니메이션 variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: index * 0.15, // 각 섹션마다 0.15초 간격
      },
    }),
  };

  return (
    <>
      <div className={`${t.timetable} detail-inner`}>
        <div className={t.inner}>
          {/* 예배 시간표 테이블 - 집회 안내 */}
          <motion.h2
            className={t.title}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={itemVariants}
          >
            집회 안내
          </motion.h2>
          <motion.table
            className={t.table}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={itemVariants}
          >
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
          </motion.table>

          {/* 미래 세대 */}
          <motion.h2
            className={t.title}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={itemVariants}
          >
            미래 세대
          </motion.h2>
          <motion.table
            className={t.table}
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={itemVariants}
          >
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
          </motion.table>

          {/* 교회 활동 */}
          <motion.h2
            className={t.title}
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={itemVariants}
          >
            교회 활동
          </motion.h2>
          <motion.table
            className={t.table}
            custom={5}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={itemVariants}
          >
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
          </motion.table>
        </div>
      </div>
    </>
  );
}
