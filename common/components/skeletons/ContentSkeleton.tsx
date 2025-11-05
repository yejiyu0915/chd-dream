import mdx from 'common/styles/mdx/MdxContent.module.scss';

// 콘텐츠 로딩 중 스켈레톤 (모든 상세 페이지에서 공통 사용 - CLS 개선)
export default function ContentSkeleton() {
  const skeletonStyle = {
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    opacity: 0.7,
  };

  return (
    <section className={`${mdx.mdxContent} detail-inner`}>
      <div>
        {/* 제목 */}
        <div
          style={{
            ...skeletonStyle,
            height: '32px',
            marginBottom: '24px',
            width: '80%',
          }}
        />

        {/* 단락들 */}
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ marginBottom: '24px' }}>
            <div style={{ ...skeletonStyle, height: '20px', marginBottom: '12px', width: '100%' }} />
            <div style={{ ...skeletonStyle, height: '20px', marginBottom: '12px', width: '95%' }} />
            <div style={{ ...skeletonStyle, height: '20px', width: '90%' }} />
          </div>
        ))}

        {/* 이미지 placeholder */}
        <div
          style={{
            ...skeletonStyle,
            height: '400px',
            borderRadius: '8px',
            marginBottom: '24px',
            width: '100%',
          }}
        />

        {/* 추가 단락들 */}
        {[...Array(2)].map((_, i) => (
          <div key={`extra-${i}`} style={{ marginBottom: '24px' }}>
            <div style={{ ...skeletonStyle, height: '20px', marginBottom: '12px', width: '100%' }} />
            <div style={{ ...skeletonStyle, height: '20px', marginBottom: '12px', width: '98%' }} />
            <div style={{ ...skeletonStyle, height: '20px', width: '85%' }} />
          </div>
        ))}
      </div>
    </section>
  );
}

