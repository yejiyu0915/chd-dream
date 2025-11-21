'use client';

import { Map, CustomOverlayMap, ZoomControl } from 'react-kakao-maps-sdk';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

interface KakaoMapProps {
  // 교회 위치 좌표 (인천 남동구 문화로 227)
  latitude?: number;
  longitude?: number;
  address?: string;
}

export default function KakaoMap({
  latitude = 37.459679, // 기본값: 행복으로가는교회 위도
  longitude = 126.70066, // 기본값: 행복으로가는교회 경도
  address = '인천 남동구 문화로 227',
}: KakaoMapProps) {
  // 카카오맵 로더 초기화
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY!,
  });

  // 마커 클릭 시 카카오맵 앱/웹 열기
  const handleMarkerClick = () => {
    const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(address)},${latitude},${longitude}`;
    window.open(kakaoMapUrl, '_blank');
  };

  // 로딩 상태
  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <p style={{ color: '#666' }}>지도를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <p style={{ color: '#e53e3e', marginBottom: '10px' }}>⚠️ 카카오맵을 불러올 수 없습니다.</p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          카카오 개발자 사이트에서 도메인 등록 및 앱 사용 설정을 확인해주세요.
        </p>
      </div>
    );
  }

  return (
    <>
      <Map
        center={{ lat: latitude, lng: longitude }}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
        level={3}
      >
        {/* 줌 컨트롤러 */}
        <ZoomControl position="RIGHT" />

        {/* 커스텀 마커 (십자가 모양 핀) */}
        <CustomOverlayMap position={{ lat: latitude, lng: longitude }} yAnchor={1}>
          <button
            onClick={handleMarkerClick}
            aria-label="카카오맵에서 행복으로가는교회 위치 보기"
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.2s ease',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {/* 지도 핀 상단 (십자가) */}
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--accent-brand)',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                border: '3px solid white',
              }}
            >
              {/* 십자가 아이콘 (CSS로 그리기) */}
              <div
                style={{
                  transform: 'rotate(45deg)',
                  position: 'relative',
                  width: '20px',
                  height: '24px',
                }}
              >
                {/* 세로 막대 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '24px',
                    backgroundColor: 'white',
                    borderRadius: '2px',
                  }}
                />
                {/* 가로 막대 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '16px',
                    height: '4px',
                    backgroundColor: 'white',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </div>
            {/* 지도 핀 하단 뾰족한 부분 */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '12px solid var(--accent-brand)',
                marginTop: '-6px',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }}
            />
          </button>
        </CustomOverlayMap>

        {/* 커스텀 오버레이 (교회 이름) */}
        <CustomOverlayMap position={{ lat: latitude, lng: longitude }} yAnchor={-0.4}>
          <div
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-inverse)',
              backgroundColor: 'var(--accent-brand)',
              border: '3px solid white',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            행복으로가는교회
          </div>
        </CustomOverlayMap>
      </Map>
    </>
  );
}
