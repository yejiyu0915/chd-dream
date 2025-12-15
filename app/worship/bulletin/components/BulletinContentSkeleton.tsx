import b from '@/app/worship/bulletin/Bulletin.module.scss';

// 주보 콘텐츠 스켈레톤 (실제 콘텐츠 높이와 유사하게 설정 - CLS 개선)
export default function BulletinContentSkeleton() {
  const skeletonStyle = {
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    opacity: 0.7,
  };

  return (
    <div className={b.latest__content}>
      <div className={b.latest__contentBody}>
        {/* 제목 */}
        <div
          style={{
            ...skeletonStyle,
            height: '32px',
            marginBottom: '24px',
            width: '80%',
          }}
        />

        {/* 단락 1 */}
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '12px',
            width: '100%',
          }}
        />
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '12px',
            width: '95%',
          }}
        />
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '24px',
            width: '90%',
          }}
        />

        {/* 단락 2 */}
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '12px',
            width: '100%',
          }}
        />
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '12px',
            width: '98%',
          }}
        />
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '24px',
            width: '85%',
          }}
        />

        {/* 이미지 placeholder */}
        <div
          style={{
            ...skeletonStyle,
            height: '300px',
            borderRadius: '8px',
            marginBottom: '24px',
            width: '100%',
          }}
        />

        {/* 단락 3 */}
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '12px',
            width: '100%',
          }}
        />
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '12px',
            width: '92%',
          }}
        />
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '24px',
            width: '88%',
          }}
        />

        {/* 단락 4 */}
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '12px',
            width: '100%',
          }}
        />
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '12px',
            width: '96%',
          }}
        />

        {/* 단락 5 */}
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '12px',
            width: '100%',
          }}
        />
        <div
          style={{
            ...skeletonStyle,
            height: '20px',
            marginBottom: '12px',
            width: '94%',
          }}
        />
      </div>
    </div>
  );
}
