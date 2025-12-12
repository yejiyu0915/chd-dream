import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

/**
 * remark 플러그인: 이미지를 block-level 요소로 변환하여 <p> 태그로 감싸지지 않도록 함
 * 마크다운 파싱 단계에서 처리하므로 더 확실함
 */
export default function remarkImageToBlock() {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: any, index, parent) => {
      if (!parent || typeof index !== 'number') return;

      // paragraph 안에 이미지가 단독으로 있는지 확인
      const hasOnlyImage =
        node.children && node.children.length === 1 && node.children[0].type === 'image';

      if (hasOnlyImage) {
        // paragraph를 image로 교체
        const imageNode = node.children[0];
        const parentChildren = (parent as any).children as any[];
        if (parentChildren && Array.isArray(parentChildren)) {
          parentChildren[index] = imageNode;
        }
      }
    });
  };
}
