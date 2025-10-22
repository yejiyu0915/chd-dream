import Spinner from '@/common/components/utils/Spinner';

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        width: '100%',
      }}
    >
      <Spinner size="lg" />
    </div>
  );
}
