import AnimatedSermonWrapper from '@/app/worship/sermon/components/AnimatedSermonWrapper';

export default function Sermon3() {
  return (
    <AnimatedSermonWrapper>
      <h3>설교 3 소제목</h3>
      <p>설교 3 본문 내용입니다.</p>
      <p>여기에 자유롭게 마크업을 작성할 수 있습니다.</p>

      <h4>말씀</h4>
      <blockquote>
        <p>성경 구절 예시</p>
      </blockquote>

      <h4>내용</h4>
      <p>설교 내용을 자유롭게 작성하세요.</p>
      <ul>
        <li>포인트 1</li>
        <li>포인트 2</li>
        <li>포인트 3</li>
      </ul>
    </AnimatedSermonWrapper>
  );
}
