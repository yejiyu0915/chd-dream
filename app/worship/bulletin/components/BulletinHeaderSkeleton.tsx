import b from '@/app/worship/bulletin/Bulletin.module.scss';

// Latest 영역 헤더 스켈레톤 (초기 로딩 시 CLS 방지)
export default function BulletinHeaderSkeleton() {
  const skeletonStyle = {
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    opacity: 0.7,
  };

  return (
    <div className={b.latest}>
      {/* 날짜 영역 스켈레톤 */}
      <div className={b.latest__title}>
        <div
          style={{
            ...skeletonStyle,
            width: '120px',
            height: '24px',
            display: 'inline-block',
            marginRight: '8px',
          }}
        />
        <div
          style={{
            ...skeletonStyle,
            width: '100px',
            height: '20px',
            display: 'inline-block',
          }}
        />
      </div>

      {/* 제목 스켈레톤 */}
      <div style={{ ...skeletonStyle, height: '32px', marginBottom: '12px', width: '200px' }} />

      {/* 주보 제목 스켈레톤 */}
      <div style={{ ...skeletonStyle, height: '28px', marginBottom: '24px', width: '60%' }} />

      {/* Sections 스켈레톤 */}
      <div className={b.latest__sections}>
        <div className={b.latest__section}>
          <div style={{ ...skeletonStyle, height: '18px', marginBottom: '8px', width: '100px' }} />
          <div style={{ ...skeletonStyle, height: '20px', width: '80%' }} />
        </div>

        <div className={b.latest__section}>
          <div style={{ ...skeletonStyle, height: '18px', marginBottom: '8px', width: '120px' }} />
          <div style={{ ...skeletonStyle, height: '20px', width: '70%' }} />
        </div>
      </div>
    </div>
  );
}

