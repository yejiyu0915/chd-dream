import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import f from '@/common/components/layouts/Footer/Footer.module.scss';
import { contactInfo, snsLinks, menuData } from '@/common/data/info';

export default function Footer() {
  const snsClassMap: { [key: string]: string } = {
    band: f.band,
    youtube: f.youtube,
    instagram: f.instagram,
  };

  const getSnsClassName = (name: string) => {
    return snsClassMap[name.toLowerCase()] || '';
  };

  return (
    <footer className={f.footer}>
      <div className="inner">
        <div className={f.top}>
          <div className={f.group}>
            <ul className={f.sitemap}>
              <li>
                <Link href="/">Home</Link>
              </li>
              {menuData.map((menuItem, index) => (
                <li key={index}>
                  <Link href={menuItem.href || '#'}>{menuItem.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/location">오시는 길</Link>
              </li>
            </ul>
            <ul className={f.sns}>
              {snsLinks.map((snsLink, index) => (
                <li key={index} className={getSnsClassName(snsLink.name)}>
                  <Link href={snsLink.href} target="_blank">
                    {snsLink.name} <Icon name="external-link" className={f.icon} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${f.contact} ${f.box}`}>
            <strong className={f.title}>Contact</strong>
            <div className={f.content}>
              <p>순복음인천초대교회는 언제나 열려있습니다.</p>
              <div className={f.link}>
                <Link href={`tel:${contactInfo.phone1}`}>
                  <Icon name="phone" className={f.icon} /> CONTACT #1
                </Link>
                <Link href={`tel:${contactInfo.phone2}`}>
                  <Icon name="phone" className={f.icon} /> CONTACT #2
                </Link>
              </div>
            </div>
          </div>
          <div className={`${f.info} ${f.box}`}>
            <strong className={f.title}>Info</strong>
            <dl className={f.content}>
              <dt>ADDRESS</dt>
              <dd>{contactInfo.address}</dd>
              <dt>FAX</dt>
              <dd>{contactInfo.fax}</dd>
            </dl>
          </div>
        </div>
        <p className={f.copyright}>Copyright 2025 순복음인천초대교회. All rights reserved.</p>
        <p className={f.text}>INCHEON CHODAE CHURCH.</p>
      </div>
    </footer>
  );
}
