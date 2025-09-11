import s from '@/app/main/sermon/Sermon.module.scss';

export default function SermonSkeleton() {
  return (
    <section className={s.sermon}>
      <div className={s.inner}>
        <div className={s.content}>
          <div className={s.text}>
            <div className={s.eyebrowPlaceholder}></div>
            <div className={s.titlePlaceholder}></div>
            <div className={s.versePlaceholder}></div>
            <div className={s.descPlaceholder}></div>
          </div>
          <div className={s.link}>
            <ul className={s.link__list}>
              <li className={s.link__item}>
                <div className={s.linkPlaceholder}></div>
              </li>
              <li className={s.link__item}>
                <div className={s.linkPlaceholder}></div>
              </li>
              <li className={s.link__item}>
                <div className={s.linkPlaceholder}></div>
              </li>
            </ul>
          </div>
          <div className={s.pastor}>
            <div className={s.pastorImagePlaceholder}></div>
            <div className={s.pastorNamePlaceholder}></div>
          </div>
        </div>
        <div className={s.footnotePlaceholder}></div>
      </div>
    </section>
  );
}
