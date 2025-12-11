import FamilySection from '@/common/components/FamilySection';

export default function Intro() {
  // 메인 페이지: 빠른 시작 + 짧은 높이 + 자녀 유지 시간 줄임
  return (
    <FamilySection
      scrollDelay={-0.5}
      sectionHeight={650}
      mobileHeight={800}
      partBreakpoints={[0.3, 0.63, 0.96]} // 자녀 유지 10%만
    />
  );
}
