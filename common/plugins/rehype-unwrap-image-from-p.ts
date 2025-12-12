import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/**
 * rehype 플러그인: <p> 태그 안에 있는 이미지 wrapper를 <p> 태그 밖으로 빼냄
 * hydration 오류 방지 (div는 p의 자식이 될 수 없음)
 */
export default function rehypeUnwrapImageFromP() {
  return (tree: Root) => {
    // 여러 번 순회하여 모든 <p> 태그 처리
    let hasChanges = true;
    let iterations = 0;
    const maxIterations = 10; // 무한 루프 방지

    while (hasChanges && iterations < maxIterations) {
      hasChanges = false;
      iterations++;

      visit(tree, 'element', (node, index, parent) => {
        // <p> 태그인 경우
        if (node.tagName === 'p' && parent && typeof index === 'number') {
          const imageWrappers: Element[] = [];
          const otherChildren: any[] = [];

          // <p> 태그의 자식들을 분류
          node.children.forEach((child) => {
            if (
              child.type === 'element' &&
              child.tagName === 'div' &&
              child.properties &&
              (child.properties as any)['data-mdx-image-wrapper'] === 'true'
            ) {
              imageWrappers.push(child);
            } else {
              otherChildren.push(child);
            }
          });

          // 이미지 wrapper가 있으면 처리
          if (imageWrappers.length > 0) {
            hasChanges = true;

            // <p> 태그의 children을 이미지가 아닌 것들로만 교체
            node.children = otherChildren;

            // 이미지 wrapper들을 <p> 태그 다음에 삽입
            if (parent.type === 'root' || parent.type === 'element') {
              const parentChildren = parent.children as any[];
              const insertIndex = index + 1;

              // 역순으로 삽입하여 순서 유지
              imageWrappers.reverse().forEach((wrapper) => {
                parentChildren.splice(insertIndex, 0, wrapper);
              });
            }

            // 빈 <p> 태그 제거 (텍스트가 없고 공백만 있는 경우)
            if (
              otherChildren.length === 0 ||
              (otherChildren.length === 1 &&
                otherChildren[0].type === 'text' &&
                !otherChildren[0].value.trim())
            ) {
              if (parent.type === 'root' || parent.type === 'element') {
                const parentChildren = parent.children as any[];
                const pIndex = parentChildren.indexOf(node);
                if (pIndex !== -1) {
                  parentChildren.splice(pIndex, 1);
                }
              }
            }
          }
        }
      });
    }
  };
}
