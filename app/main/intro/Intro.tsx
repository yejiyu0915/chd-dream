import i from '@/app/main/intro/Intro.module.scss';

export default function Intro() {
  return (
    <section className={i.intro}>
      {/* <div className={i.inner}>
        <h2 className="sr-only">교회 표어</h2>
        <p className={i.title}>
          오직 말씀
          <br />
          절대 기도
          <br />
          온전한 사랑
        </p>
      </div> */}
      <div className={`${i.content} inner`}>
        <div className={i.text}>추가 내용</div>
      </div>
    </section>
  );
}
