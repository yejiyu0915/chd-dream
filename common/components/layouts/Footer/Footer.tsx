import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import f from '@/common/components/layouts/Footer/Footer.module.scss';

export default function Footer() {
  return (
    <footer className={f.footer}>
      <div className="inner">
        <div className={f.top}>
          <div className={f.group}>
            <ul className={f.sitemap}>
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
            <ul className={f.sns}>
              <li className={f.naver}>
                <Link href="/">
                  Band <Icon.externalLink className={f.icon} />
                </Link>
              </li>
              <li className={f.youtube}>
                <Link href="/">
                  Youtube <Icon.externalLink className={f.icon} />
                </Link>
              </li>
              <li className={f.instagram}>
                <Link href="/">
                  Instagram <Icon.externalLink className={f.icon} />
                </Link>
              </li>
            </ul>
          </div>
          <div className={`${f.contact} ${f.box}`}>
            <strong className={f.title}>Contact</strong>
            <div className={f.content}>
              <p>순복음인천초대교회는 언제나 열려있습니다.</p>
              <div className={f.link}>
                <Link href="tel:032-463-9004">
                  <Icon.phone className={f.icon} /> CONTACT #1
                </Link>
                <Link href="tel:032-472-9004">
                  <Icon.phone className={f.icon} /> CONTACT #2
                </Link>
              </div>
            </div>
          </div>
          <div className={`${f.info} ${f.box}`}>
            <strong className={f.title}>Info</strong>
            <dl className={f.content}>
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
        <p className={f.copyright}>Copyright 2025 순복음인천초대교회. All rights reserved.</p>
        <p className={f.text}>INCHEON CHODAE CHURCH.</p>
      </div>
    </footer>
  );
}
