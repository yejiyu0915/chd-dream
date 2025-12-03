'use client';

import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import f from '@/common/components/layouts/Footer/Footer.module.scss';
import { contactInfo, snsLinks, menuData, prevLinks } from '@/common/data/info';
import { motion } from 'framer-motion';

export default function Footer() {
  const snsClassMap: { [key: string]: string } = {
    band: f.band,
    youtube: f.youtube,
    instagram: f.instagram,
  };

  const getSnsClassName = (name: string) => {
    return snsClassMap[name.toLowerCase()] || '';
  };

  // 애니메이션 variants - 하단에서 위로 부드럽게 등장
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12, // 각 섹션이 0.12초 간격으로 등장
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const bottomVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.3,
      },
    },
  };

  return (
    <footer className={f.footer}>
      <div className="inner">
        <motion.div
          className={f.top}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: '-50px' }}
          variants={containerVariants}
        >
          <motion.div className={f.group} variants={itemVariants}>
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
            <div className={f.prevLinks}>
              {prevLinks.map((prevInfo, index) => (
                <div key={index} className={f.prevGroup}>
                  <div className={f.prevRow}>
                    <p className={f.prevTitle}>{prevInfo.name}</p>
                    <ul className={f.prevList}>
                      {prevInfo.links.map((link, linkIndex) => (
                        <li key={linkIndex} className={getSnsClassName(link.name)}>
                          <Link
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${prevInfo.name} ${link.name} 바로가기`}
                          >
                            <span className="sr-only">{link.name}</span>
                            <Icon name={link.icon} className={f.icon} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <ul className={f.sns}>
              {snsLinks.map((snsLink, index) => (
                <li
                  key={index}
                  className={`${getSnsClassName(snsLink.name)} ${snsLink.disabled ? f.disabled : ''}`}
                >
                  <Link
                    href={snsLink.disabled ? '' : snsLink.href}
                    target={snsLink.disabled ? undefined : '_blank'}
                    rel={snsLink.disabled ? undefined : 'noopener noreferrer'}
                    aria-label={
                      snsLink.disabled ? `${snsLink.name} (준비중)` : `${snsLink.name} 바로가기`
                    }
                  >
                    {snsLink.name}{' '}
                    {snsLink.disabled ? (
                      <span className={f.disabled__mark}>준비중</span>
                    ) : (
                      <Icon name="external-link" className={f.icon} aria-hidden="true" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact 박스 */}
          <motion.div className={`${f.contact} ${f.box}`} variants={itemVariants}>
            <strong className={f.title}>Contact</strong>
            <div className={f.content}>
              <p>행복으로가는교회는 언제나 열려있습니다.</p>
              <div className={f.link}>
                <Link href={`tel:${contactInfo.phone1}`}>
                  <Icon name="phone" className={f.icon} /> {contactInfo.phone1}
                </Link>
                <Link href={`tel:${contactInfo.phone2}`}>
                  <Icon name="phone" className={f.icon} /> {contactInfo.phone2}
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Info 박스 */}
          <motion.div className={`${f.info} ${f.box}`} variants={itemVariants}>
            <strong className={f.title}>Info</strong>
            <dl className={f.content}>
              <dt>NAME</dt>
              <dd>
                {contactInfo.denomination} {contactInfo.name}
              </dd>
              <dt>FAX</dt>
              <dd>{contactInfo.fax}</dd>
              <dt>ADDRESS</dt>
              <dd>{contactInfo.address}</dd>
            </dl>
          </motion.div>
        </motion.div>

        {/* Copyright 및 하단 텍스트 */}
        <motion.p
          className={f.copyright}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: '0px' }}
          variants={bottomVariants}
        >
          Copyright 2026 행복으로가는교회. All rights reserved.
        </motion.p>
        <motion.p
          className={f.text}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: '0px' }}
          variants={bottomVariants}
        >
          The Church Toward Happiness
        </motion.p>
      </div>
    </footer>
  );
}
