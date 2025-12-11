'use client';

import type { GroupDataType, SubGroupType } from '@/app/about/group/data/groupData';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/common/components/utils/Icons';
import g from '@/app/about/group/Group.module.scss';

interface GroupContentProps {
  data: GroupDataType;
  prevGroup: GroupDataType | null; // 이전 교구
  nextGroup: GroupDataType | null; // 다음 교구
  onSelect?: (id: string) => void; // 교구 선택 핸들러 (선택사항)
}

// 공통: 회장단 렌더링
function LeadersSection({ leaders }: { leaders: Array<{ role: string; name: string }> }) {
  return (
    <div className={g.content__leaders}>
      <span className={g.content__label}>회장단</span>
      <div className={g.content__leadersList}>
        {leaders.map((leader, index) => (
          <div key={index} className={g.content__leader}>
            <span className={g.content__leaderRole}>{leader.role}</span>
            <span className={g.content__leaderName}>{leader.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 공통: 모임안내 렌더링
function MeetingSection({
  meetingPlace,
  meetingTime,
}: {
  meetingPlace?: string;
  meetingTime?: string;
}) {
  if (!meetingPlace && !meetingTime) return null;

  return (
    <div className={g.content__meeting}>
      <span className={g.content__label}>교구모임안내</span>
      {meetingPlace && (
        <div className={g.content__meetingItem}>
          <span className={g.content__meetingLabel}>모임 장소</span>
          <span className={g.content__meetingValue}>{meetingPlace}</span>
        </div>
      )}
      {meetingTime && (
        <div className={g.content__meetingItem}>
          <span className={g.content__meetingLabel}>모임 시간</span>
          <span className={g.content__meetingValue}>{meetingTime}</span>
        </div>
      )}
    </div>
  );
}

// 공통: 활동안내 렌더링
function ActivitiesSection({ activities }: { activities: string[] }) {
  if (!activities || activities.length === 0) return null;

  return (
    <div className={g.content__activities}>
      <span className={g.content__label}>교구활동안내</span>
      <ul className={g.content__activitiesList}>
        {activities.map((activity, index) => (
          <li key={index} className={g.content__activity}>
            {activity}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 하위 교구 섹션 컴포넌트
function SubGroupSection({ subGroup }: { subGroup: SubGroupType }) {
  return (
    <div className={g.subGroup}>
      <h2 className={g.content__title}>{subGroup.title}</h2>
      {subGroup.description && (
        <div
          className={g.content__description}
          dangerouslySetInnerHTML={{ __html: subGroup.description }}
        />
      )}

      {/* 담당 교역자 ~ 회장단까지 boxing 처리 */}
      <div className={g.subGroup__box}>
        {subGroup.pastor && (
          <div className={g.content__pastor}>
            <span className={g.content__label}>담당 교역자</span>
            <span className={g.content__value}>{subGroup.pastor}</span>
          </div>
        )}
        {subGroup.leaders && subGroup.leaders.length > 0 && (
          <LeadersSection leaders={subGroup.leaders} />
        )}
      </div>
      <MeetingSection meetingPlace={subGroup.meetingPlace} meetingTime={subGroup.meetingTime} />
      {subGroup.activities && <ActivitiesSection activities={subGroup.activities} />}
    </div>
  );
}

export default function GroupContent({ data, prevGroup, nextGroup, onSelect }: GroupContentProps) {
  // 모바일 네비게이션 클릭 핸들러
  const handleNavClick = (group: GroupDataType) => {
    if (onSelect) {
      onSelect(group.id);
    }
  };

  // 애니메이션 variants
  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const bodyVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.15,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.1,
      },
    },
  };

  // 하위 교구가 있는지 확인
  const hasSubGroups = data.subGroups && data.subGroups.length > 0;

  return (
    <>
      <div className={g.content}>
        {/* 대표사진 */}
        {data.image && (
          <motion.div
            className={g.content__image}
            key={`${data.id}-image`}
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          >
            <Image
              src={data.image}
              alt={data.title}
              width={1200}
              height={600}
              className={g.content__imageImg}
            />
          </motion.div>
        )}

        {/* 헤더 - 제목 (하위 교구가 있는 경우에만 표시) */}
        {!hasSubGroups && (
          <motion.h2
            className={g.content__header}
            key={data.id}
            initial="hidden"
            animate="visible"
            variants={headerVariants}
          >
            {data.title}
          </motion.h2>
        )}

        {/* 본문 내용 */}
        <motion.div
          className={g.content__body}
          key={`${data.id}-body`}
          initial="hidden"
          animate="visible"
          variants={bodyVariants}
        >
          {/* 교구소개 */}
          {data.description && (
            <div
              className={g.content__description}
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          )}

          {/* 담당 교역자 + 회장단 boxing 처리 */}
          {((!hasSubGroups && (data.pastor || (data.leaders && data.leaders.length > 0))) ||
            (hasSubGroups && data.leaders && data.leaders.length > 0)) && (
            <div className={g.content__box}>
              {/* 담당 교역자 (서브그룹이 없는 경우만) */}
              {!hasSubGroups && data.pastor && (
                <div className={g.content__pastor}>
                  <span className={g.content__label}>담당 교역자</span>
                  <span className={g.content__value}>{data.pastor}</span>
                </div>
              )}
              {/* 회장단 */}
              {data.leaders && data.leaders.length > 0 && <LeadersSection leaders={data.leaders} />}
            </div>
          )}

          {/* 교구모임안내 (서브그룹이 없거나, 서브그룹이 있어도 상위 교구에 모임안내가 있는 경우) */}
          {(data.meetingPlace || data.meetingTime) && (
            <MeetingSection meetingPlace={data.meetingPlace} meetingTime={data.meetingTime} />
          )}

          {/* 교구활동안내 (서브그룹이 없거나, 서브그룹이 있어도 상위 교구에 활동안내가 있는 경우) */}
          {data.activities && data.activities.length > 0 && (
            <ActivitiesSection activities={data.activities} />
          )}

          {/* 하위 교구들 (여선교 1,2,3,4 / 예꿈 학생부/예꿈부 등) */}
          {hasSubGroups && (
            <div className={g.content__subGroups}>
              {data.subGroups!.map((subGroup) => (
                <SubGroupSection key={subGroup.id} subGroup={subGroup} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* 모바일 하단 네비게이션 */}
      <div className={g.mobileNav}>
        {prevGroup ? (
          <Link
            href={prevGroup.path}
            className={g.mobileNav__button}
            onClick={() => handleNavClick(prevGroup)}
          >
            <Icon name="arrow-up" />
            이전: <span className={g.mobileNav__title}>{prevGroup.title}</span>
          </Link>
        ) : (
          <div className={g.mobileNav__empty}></div>
        )}
        {nextGroup ? (
          <Link
            href={nextGroup.path}
            className={g.mobileNav__button}
            onClick={() => handleNavClick(nextGroup)}
          >
            <Icon name="arrow-down" />
            다음: <span className={g.mobileNav__title}>{nextGroup.title}</span>
          </Link>
        ) : (
          <div className={g.mobileNav__empty}></div>
        )}
      </div>
    </>
  );
}
