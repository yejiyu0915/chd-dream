'use client';

import React from 'react';

interface BulletinLayoutProps {
  children: React.ReactNode;
}

export default function BulletinLayout({ children }: BulletinLayoutProps) {
  return <>{children}</>;
}
