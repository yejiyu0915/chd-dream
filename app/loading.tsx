import Image from 'next/image'; // Image 컴포넌트 임포트

export default function LoadingSpinner() {
  return (
    <div className="loaderContainer fadeOut">
      <Image
        src="/common/logo.svg"
        alt="교회 로고"
        width={80} // 로고 크기 조정 (원하는 크기로) 100
        height={80} // 로고 크기 조정 (원하는 크기로) 100
        priority
        className="loadingLogo"
        sizes="(max-width: 768px) 30vw, 30vw"
      />
    </div>
  );
}
