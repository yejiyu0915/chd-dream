import s from '@/app/info/schedule/Schedule.module.scss';

// 일정 페이지 스켈레톤 (Suspense fallback용)
export default function ScheduleSkeleton() {
  return (
    <div className={`detail-inner`}>
      {/* 필터 그룹 스켈레톤 */}
      <div className={s.filterGroup} style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            height: '40px',
            opacity: 0.5,
          }}
        >
          <div
            style={{
              width: '100px',
              height: '40px',
              backgroundColor: 'var(--color-gray-200)',
              borderRadius: '8px',
            }}
          />
          <div
            style={{
              width: '100px',
              height: '40px',
              backgroundColor: 'var(--color-gray-200)',
              borderRadius: '8px',
            }}
          />
        </div>
      </div>

      {/* 캘린더 헤더 스켈레톤 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)',
          padding: '16px',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '32px',
            backgroundColor: 'var(--color-gray-200)',
            borderRadius: '8px',
            opacity: 0.5,
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-gray-200)',
              borderRadius: '8px',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              width: '80px',
              height: '40px',
              backgroundColor: 'var(--color-gray-200)',
              borderRadius: '8px',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-gray-200)',
              borderRadius: '8px',
              opacity: 0.5,
            }}
          />
        </div>
      </div>

      {/* 캘린더 그리드 스켈레톤 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: '1',
              backgroundColor: 'var(--color-gray-100)',
              borderRadius: '8px',
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* 로딩 표시 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 0',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--color-gray-200)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    </div>
  );
}

