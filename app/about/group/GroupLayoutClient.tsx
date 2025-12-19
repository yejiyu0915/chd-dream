'use client';

import GroupNav from '@/app/about/group/components/GroupNav';
import { groupData } from '@/app/about/group/data/groupData';
import g from '@/app/about/group/Group.module.scss';

export default function GroupLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${g.inner} detail-inner`}>
      <GroupNav data={groupData} />
      {children}
    </div>
  );
}


