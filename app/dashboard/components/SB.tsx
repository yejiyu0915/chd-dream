'use client';

import { useState } from 'react';
import styles from '../Dashboard.module.scss';

// SB 타입 정의
interface SB {
  id: string;
  text: string;
}

export default function SB() {
  // SB 데이터
  const [sbs, setSbs] = useState<SB[]>([
    {
      id: '1',
      text: 'chd-dream_SB_v0.1_250819.pptx',
    },
  ]);

  return (
    <section className={styles.section}>
      <h2>SB</h2>
      <div className={styles.sbGrid}>
        {sbs.map((sb) => (
          <div key={sb.id} className={styles.sbCard}>
            <span className={styles.sbText}>{sb.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
