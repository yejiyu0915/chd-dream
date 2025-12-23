'use client';

import Image from 'next/image';
import AnimatedSermonWrapper from '@/app/worship/sermon/components/AnimatedSermonWrapper';
import s from '@/app/about/blessing/Blessing.module.scss';

export default function BlessingContent() {
  return (
    <div className={`${s.blessing} detail-inner`}>
      <div className={s.inner}>
        <div className={s.content}>
          {/* 헤더 - 제목과 담임목사 */}
          {/* <div className={s.content__header}>
            <h2 className={s.content__title}>교회를 통한 축복</h2>
            <p className={s.content__speaker}>담임목사: 김영구</p>
          </div> */}

          {/* 이미지 */}
          <div className={s.content__image}>
            <Image
              src="/images/common/blessing.jpg"
              alt="교회를 통한 축복"
              width={1200}
              height={400}
              className={s.content__imageImg}
              priority
            />
            <div className={s.content__imageText}>
              <h2 className={s.content__imageTitle}>행복으로가는교회</h2>
              <p className={s.content__imageSubtitle}>The Church Toward Happiness</p>
            </div>
          </div>

          {/* 본문 내용 */}
          <div className={s.content__body}>
            <AnimatedSermonWrapper>
              {/* <blockquote>
                <p>
                  <em>[시 121:1-2]</em>
                  <br />
                  (성전으로 올라가는 노래) 내가 산을 향하여 눈을 들리라 나의 도움이 어디서 올꼬 나의
                  도움 이 천지를 지으신 여호와에게서로다
                </p>
              </blockquote> */}
              <p>교회에는 하나님께서 교회를 통해 우리에게 약속해 놓으신 여러 가지 복이 있습니다.</p>
              <h2>
                <span>1.</span>
                <span>교회에는 하나님의 도우심을 얻게 되는 복이 있습니다.</span>
              </h2>
              <blockquote>
                <p>
                  <em>[시 121:1-2]</em>
                  <span className={s.content__verse}>
                    <span>1</span>
                    <span>
                      (성전으로 올라가는 노래) 내가 산을 향하여 눈을 들리라 나의 도움이 어디서 올꼬
                    </span>
                  </span>
                  <span className={s.content__verse}>
                    <span>2</span>
                    <span>나의 도움이 천지를 지으신 여호와에게서로다</span>
                  </span>
                </p>
              </blockquote>
              <blockquote>
                <p>
                  <em>[시 124:8]</em>
                  <span className={s.content__verse}>
                    <span>8</span>
                    <span>우리의 도움은 천지를 지으신 여호와의 이름에 있도다</span>
                  </span>
                </p>
              </blockquote>
              <p>
                시편 기자는 우리의 도움이 천지를 지으신 여호와, 곧 그의 이름에 있다고
                고백하였습니다. 여호와 하나님께서는 그 이름을 성전에 영원히 두시겠다고
                약속하셨습니다. 이러한 약속에 따라 우리는 성전에서 하나님의 도우심을 얻게 됩니다.
              </p>
              <p>
                어려움을 만나셨습니까? 누군가의 도움이 필요하십니까? 도울 힘이 없는 인생들을
                의지하지 마시고, 여호와의 이름이 있는 성전에 오르셔서 전지전능하신 하나님의 도우심을
                얻는 복된 분들이 되시기를 소망합니다.
              </p>
              <h2>
                <span>2.</span>
                <span>교회에는 음부의 권세를 이기는 복이 있습니다.</span>
              </h2>
              <blockquote>
                <p>
                  <em>[마 16:18]</em>
                  <span className={s.content__verse}>
                    <span>18</span>
                    <span>
                      또 내가 네게 이르노니 너는 베드로라 내가 이 반석 위에 내 교회를 세우리니
                      음부의 권세가 이기지 못하리라
                    </span>
                  </span>
                </p>
              </blockquote>
              <p>
                교회에는 음부의 권세가 이기지 못한다고 기록하고 있습니다. 이는 교회 안에서는 음부의
                권세를 이기지만, 세상에서는 그렇지 못하다는 뜻입니다.
              </p>
              <blockquote>
                <p>
                  <em>[출 8:25-26]</em>
                  <span className={s.content__verse}>
                    <span>25</span>
                    <span>
                      바로가 모세와 아론을 불러 이르되 너희는 가서 이 땅에서 너희 하나님께 희생을
                      드리라
                    </span>
                  </span>
                  <span className={s.content__verse}>
                    <span>26</span>
                    <span>
                      모세가 가로되 그리함은 불가하니이다 우리가 우리 하나님 여호와께 희생을 드리는
                      것은 애굽 사람의 미워하는 바이온즉 우리가 만일 애굽 사람의 목전에서 희생을
                      드리면 그들이 그것을 미워하여 우리를 돌로 치지 아니하리이까
                    </span>
                  </span>
                </p>
              </blockquote>
              <p>
                이 말씀에서 ‘이 땅’은 세상을, ‘애굽 사람’은 마귀의 세력을 의미하는 것으로 이해할 수
                있습니다. 다시 말해, 세상에서 하나님께 예배드릴 때에는 이를 미워하는 마귀의 훼방으로
                인해 믿음이 떨어질 수 있다는 것입니다. 그러나 교회에서는 음부의 권세를 이길 수
                있습니다.
              </p>
              <p>
                그러므로 세상에서 하나님께 예배하지 말고, 반드시 하나님께서 그 이름을 두시려고
                택하신 성전, 곧 교회에서 예배드림으로 음부의 권세를 넉넉히 이기시기를 바랍니다.
              </p>
              <h2>
                <span>3.</span>
                <span>교회에는 기도 응답의 복이 있습니다.</span>
              </h2>
              <blockquote>
                <p>
                  <em>[사 56:7]</em>
                  <span className={s.content__verse}>
                    <span>7</span>
                    <span>
                      내가 그를 나의 성산으로 인도하여 기도하는 내 집에서 그들을 기쁘게 할 것이며
                      그들의 번제와 희생은 나의 단에서 기꺼이 받게 되리니 이는 내 집은 만민의
                      기도하는 집이라 일컬음이 될 것임이라
                    </span>
                  </span>
                </p>
              </blockquote>
              <p>
                하나님께서는 성전, 곧 교회를 가리켜 “내 집은 만민이 기도하는 집이라 일컬음이 될
                것이라”고 말씀하셨습니다. 뿐만 아니라 역대하 7장 15절과 16절 말씀을 통해 성전에서
                드리는 기도에 응답하시겠다고 약속하셨습니다.
              </p>
              <blockquote>
                <p>
                  <em>[대하 7:15-16]</em>
                  <span className={s.content__verse}>
                    <span>15</span>
                    <span>이곳에서 하는 기도에 내가 눈을 들고 귀를 기울이리니</span>
                  </span>
                  <span className={s.content__verse}>
                    <span>16</span>
                    <span>
                      이는 내가 이미 이 전을 택하고 거룩하게하여 내 이름으로 여기 영영히 있게
                      하였음이라 내 눈과 내 마음이 항상 여기 있으리라
                    </span>
                  </span>
                </p>
              </blockquote>
              <p>
                ‘이곳’은 예루살렘 성전을 의미합니다. 하나님께서는 성전, 곧 오늘날의 교회를 택하셔서
                거룩히 구별하시고, 그곳에 하나님의 이름을 영원히 두시며 눈과 마음을 항상 두셨습니다.
                따라서 성전에서 드리는 기도에 하나님께서는 눈을 들고 귀를 기울여 응답하십니다. 다시
                말해, 교회에서 드리는 기도를 하나님께서 들으신다는 의미입니다.
              </p>
              <h2>
                <span>4.</span>
                <span>교회에는 영원히 목마르지 않는 생수를 공급받는 복이 있습니다.</span>
              </h2>
              <p>
                요한복음 4장에는 수가성 여인과 예수님의 대화가 기록되어 있습니다. 우물가에서
                이루어진 그 대화 속에서 예수님께서는 자신을 가리켜 “영원히 목마르지 않는 생수를 주는
                이”라고 말씀하셨습니다.
              </p>
              <blockquote>
                <p>
                  <em>[요 4:13-14]</em>
                  <span className={s.content__verse}>
                    <span>13</span>
                    <span>예수께서 대답하여 가라사대 이 물을 먹는 자마다 다시 목마르려니와</span>
                  </span>
                  <span className={s.content__verse}>
                    <span>14</span>
                    <span>
                      내가 주는 물을 먹는 자는 영원히 목마르지 아니하리니 나의 주는 물은 그 속에서
                      영생하도록 솟아나는 샘물이 되리라
                    </span>
                  </span>
                </p>
              </blockquote>
              <p>
                예수님께서는 세상에 속한 물을 마시는 자마다 다시 목마르지만, 자신이 주는 물을 마시는
                자는 영원히 목마르지 아니할 것이라고 말씀하셨습니다. 그렇다면 예수님께서 주시는,
                영원히 목마르지 아니하는 생수는 어디에서 공급받을 수 있을까요?
              </p>
              <p>
                성경은 교회를 가리켜 “그리스도의 몸”(엡 1:23, 골 1:24)이라고 기록하고 있습니다. 이를
                통해 우리는 교회를 통하여 영원히 목마르지 아니하는 생수를 공급받을 수 있음을 알 수
                있습니다.
              </p>
              <blockquote>
                <p>
                  <em>[겔 47:1]</em>
                  <span className={s.content__verse}>
                    <span>1</span>
                    <span>
                      그가 나를 데리고 전 문에 이르시니 전의 전면이 동을 향하였는데 그 문지방 밑에서
                      물이 나와서 동으로 흐르다가 전 우편 제단 남편으로 흘러 내리더라
                    </span>
                  </span>
                </p>
              </blockquote>
              <p>
                성경은 성전 문지방으로부터 물이 흘러 나온다고 말합니다. 이는 그리스도의 몸 된
                교회에서 생수를 공급받을 수 있다는 뜻입니다. 이어지는 말씀에서는 그 생수가 흐르는
                곳마다 모든 것이 소성하고 번성하며 살아나고 치료되는 역사가 일어남을 보여 줍니다.
              </p>
              <blockquote>
                <p>
                  <em>[겔 47:12]</em>
                  <span className={s.content__verse}>
                    <span>12</span>
                    <span>
                      강 좌우 가에는 각종 먹을 실과나무가 자라서 그 잎이 시들지 아니하며 실과가
                      끊치지 아니하고 달마다 새 실과를 맺으리니 그 물이 성소로 말미암아 나옴이라 그
                      실과는 먹을 만하고 그 잎사귀는 약 재료가 되리라
                    </span>
                  </span>
                </p>
              </blockquote>
              <p>
                성소로 말미암아 나온 물로 인해 강 좌우 가에는 각종 실과나무가 자라나고, 그 잎이
                시들지 않으며 달마다 새 실과를 맺어 그 열매가 끊이지 않고, 잎사귀는 약재료가 된다고
                말씀합니다.
              </p>
              <p>
                이처럼 그리스도의 몸 된 성전에서 흘러나오는 물, 곧 예수님께서 주시는 생수를 공급받을
                때 가는 곳마다 소성하고 번성하며 치유되는 역사가 일어납니다.
              </p>
              <p>이와 같이 하나님께서는 교회를 통해 많은 복을 약속해 놓으셨습니다.</p>
              <p>
                하나님께서 우리를 구원하신 목적은 하나님을 섬기게 하시기 위함입니다. 그러므로
                하나님을 섬기며 교회 중심의 삶을 살아가셔서, 그를 통해 약속하신 모든 복을 누리시는
                성도님들이 되시기를 축복합니다.
              </p>
            </AnimatedSermonWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
