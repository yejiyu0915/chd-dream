import q from './QuickLink.module.scss';

export default function QuickLink() {
  return (
    <section className={q.quickLink}>
      <div className="inner">
        <div className={q.quickLink__empty}>Quick Link 영역</div>
      </div>
    </section>
  );
}
