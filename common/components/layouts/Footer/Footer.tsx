import Link from 'next/link';
import Icon from '../../../components/utils/Icons';
import f from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={f.footer}>
      <div className="inner">
        <div className={f.footer__top}>
          <div className={f.footer__group}>
            <ul className={f.footer__sitemap}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/">교회 소개</Link>
              </li>
              <li>
                <Link href="/">예배 안내</Link>
              </li>
              <li>
                <Link href="/">교회 소식</Link>
              </li>
              <li>
                <Link href="/">오시는 길</Link>
              </li>
            </ul>
            <ul className={f.footer__sns}>
              <li className={f.footer__snsNaver}>
                <Link href="/">
                  Band <Icon.externalLink className={f.footer__snsIcon} />
                </Link>
              </li>
              <li className={f.footer__snsYoutube}>
                <Link href="/">
                  Youtube <Icon.externalLink className={f.footer__snsIcon} />
                </Link>
              </li>
              <li className={f.footer__snsInstagram}>
                <Link href="/">
                  Instagram <Icon.externalLink className={f.footer__snsIcon} />
                </Link>
              </li>
            </ul>
          </div>
          <div className={`${f.footer__contact} ${f.footer__box}`}>
            <strong className={f.footer__title}>Contact</strong>
            <div className={f.footer__content}>
              <p>순복음인천초대교회는 언제나 열려있습니다.</p>
              <div className={f.footer__contactLink}>
                <Link href="tel:032-463-9004">
                  <Icon.phone className={f.footer__contactIcon} /> CONTACT #1
                </Link>
                <Link href="tel:032-472-9004">
                  <Icon.phone className={f.footer__contactIcon} /> CONTACT #2
                </Link>
              </div>
            </div>
          </div>
          <div className={`${f.footer__info} ${f.footer__box}`}>
            <strong className={f.footer__title}>Info</strong>
            <dl className={f.footer__content}>
              <dt>ADDRESS</dt>
              <dd>
                인천광역시 남동구 호구포로 818 퍼스트하임프라자 6층
                <br />
                (구월동 1264번지)
              </dd>
              <dt>FAX</dt>
              <dd>032-465-9004</dd>
            </dl>
          </div>
        </div>
        <p className={f.footer__copyright}>
          Copyright 2025 순복음인천초대교회. All rights reserved.
        </p>
        <p className={f.footer__text}>INCHEON CHODAE CHURCH.</p>
      </div>
    </footer>
  );
}
