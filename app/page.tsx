import m from './main/main.module.scss';
import KV from './main/KV/KV';
import Intro from './main/intro/Intro';
import Sermon from './main/sermon/Sermon';
import CLog from './main/c-log/CLog';
import QuickLink from './main/quick-link/QuickLink';
import Instagram from './main/Instagram/Instagram';

export default function Main() {
  return (
    <main className={m.main}>
      <KV />
      <div className={m.main__content}>
        <Sermon />
        <Intro />
        <CLog />
        <QuickLink />
        <Instagram />
      </div>
    </main>
  );
}
