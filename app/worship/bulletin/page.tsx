'use client';

import React, { useState, useEffect } from 'react';
import PageTitleSetter from '@/app/worship/components/PageTitleSetter';
import BulletinList from './components/BulletinList';
import BulletinContent from './components/BulletinContent';
import { formatDate } from './utils/bulletinUtils';
import { convertBlocksToMdxHtml, processHtmlTags } from './utils/htmlConverter';
import b from '@/app/worship/bulletin/Bulletin.module.scss';

interface BulletinItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  praise: string;
  slug: string;
  content?: string; // 노션 본문 내용
  thumbnail?: string;
}

export default function BulletinPage() {
  const [bulletinList, setBulletinList] = useState<BulletinItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [latestBulletin, setLatestBulletin] = useState<BulletinItem | null>(null);
  const [selectedBulletin, setSelectedBulletin] = useState<BulletinItem | null>(null);
  const [bulletinContent, setBulletinContent] = useState<string>('');
  const [contentLoading, setContentLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const itemsPerPage = 6; // 2x3 그리드

  // 주보 데이터 가져오기
  useEffect(() => {
    const fetchBulletins = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bulletin');
        const data = await response.json();

        // API 응답이 배열인 경우와 객체인 경우 모두 처리
        const items = Array.isArray(data) ? data : data.items || [];
        setBulletinList(items);
        setTotalPages(Math.ceil(items.length / itemsPerPage));

        // 최신 주보 설정 (첫 번째 아이템)
        if (items.length > 0) {
          setLatestBulletin(items[0]);
          // 최신 주보 내용 자동 로드
          handleBulletinClick(items[0]);
        }
      } catch {
        // console.error('주보 데이터를 가져오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBulletins();
  }, []);

  // 현재 페이지의 아이템들
  const currentItems = bulletinList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 주보 아이템 클릭 핸들러
  const handleBulletinClick = async (item: BulletinItem) => {
    setSelectedBulletin(item);
    setContentLoading(true);
    setLoadingStep('주보 데이터를 가져오는 중...');

    try {
      setLoadingStep('내용을 불러오는 중...');
      const response = await fetch(`/api/bulletin/${item.slug}`);
      const data = await response.json();

      if (data && data.blocks) {
        // 디버깅: 블록 구조 확인 (테이블과 중첩 리스트 확인용)
        const tableBlocks = data.blocks.filter((block: any) => block.type === 'table');
        const listBlocks = data.blocks.filter(
          (block: any) => block.type === 'bulleted_list_item' || block.type === 'numbered_list_item'
        );
        console.log('Table blocks found:', tableBlocks.length);
        console.log('List blocks found:', listBlocks.length);
        if (tableBlocks.length > 0) {
          console.log('Table structure:', JSON.stringify(tableBlocks[0], null, 2));
        }

        setLoadingStep('내용을 변환하는 중...');
        const mdxHtml = convertBlocksToMdxHtml(data.blocks);
        const processedHtml = processHtmlTags(mdxHtml);

        setLoadingStep('완료!');
        setBulletinContent(processedHtml);
      }
    } catch {
      // console.error('주보 내용을 가져오는데 실패했습니다:', error);
      setBulletinContent('내용을 불러올 수 없습니다.');
    } finally {
      setContentLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <>
      <PageTitleSetter title="온라인 주보" />
      <div className="detail-inner">
        <div className={b.inner}>
          <BulletinContent
            selectedBulletin={selectedBulletin}
            latestBulletin={latestBulletin}
            bulletinContent={bulletinContent}
            contentLoading={contentLoading}
            loadingStep={loadingStep}
            formatDate={formatDate}
          />

          <BulletinList
            loading={loading}
            currentItems={currentItems}
            selectedBulletin={selectedBulletin}
            totalPages={totalPages}
            currentPage={currentPage}
            onBulletinClick={handleBulletinClick}
            onPageChange={handlePageChange}
            formatDate={formatDate}
          />
        </div>
      </div>
    </>
  );
}
