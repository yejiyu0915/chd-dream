
import { groupData } from '@/app/about/group/data/groupData';
import GroupNav from '@/app/about/group/components/GroupNav';
import g from '@/app/about/group/Group.module.scss';

interface GroupLayoutProps {
  children: React.ReactNode;
}

export default function GroupLayout({ children }: GroupLayoutProps) {
  return (
    <div className={`${g.group} detail-inner`}>
      <div className={g.inner}>
        {/* 왼쪽 내비게이션 */}
        <GroupNav data={groupData} />

        {/* 오른쪽 본문 - GroupContent가 이미 content 구조를 포함하고 있음 */}
        {children}
      </div>
    </div>
  );
}

