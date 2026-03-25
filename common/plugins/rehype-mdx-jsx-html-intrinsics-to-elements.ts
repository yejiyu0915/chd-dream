import type { Root } from 'hast';

/**
 * MDX가 <table>, <div> 등을 mdxJsxFlowElement / mdxJsxTextElement 로 두는데
 * rehype-sanitize 는 type==='element' 만 처리해 테이블 전체가 사라진다.
 * sanitize 전에 소문자 HTML 내장 태그만 실제 hast element 로 바꾼다.
 */
const INTRINSIC_HTML = new Set([
  'div',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
  'a',
  'strong',
  'em',
  'code',
  'del',
  'u',
  'br',
  'span',
  'sub',
  'sup',
]);

type MdxJsxAttr = {
  type?: string;
  name?: string;
  value?: string | boolean | null | undefined;
};

function mdxJsxAttributesToProperties(attrs: unknown[]): Record<string, string | boolean> {
  const props: Record<string, string | boolean> = {};
  if (!Array.isArray(attrs)) {
    return props;
  }
  for (const raw of attrs) {
    const attr = raw as MdxJsxAttr;
    if (!attr || attr.type === 'mdxJsxExpressionAttribute') {
      continue;
    }
    const name = attr.name;
    if (!name) {
      continue;
    }
    const key = name === 'class' ? 'className' : name;
    const v = attr.value;
    if (v === true || v === false) {
      props[key] = v;
    } else if (v != null && v !== '') {
      props[key] = String(v);
    }
  }
  return props;
}

function mapNode(node: unknown): unknown {
  if (!node || typeof node !== 'object') {
    return node;
  }

  const n = node as {
    type?: string;
    name?: string;
    attributes?: unknown[];
    children?: unknown[];
    value?: string;
  };

  if (n.type === 'text') {
    return node;
  }

  if (n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement') {
    if (typeof n.name === 'string' && INTRINSIC_HTML.has(n.name)) {
      const children = (n.children ?? []).map(mapNode).filter(Boolean) as Root['children'];
      return {
        type: 'element',
        tagName: n.name,
        properties: mdxJsxAttributesToProperties(n.attributes ?? []),
        children,
      };
    }
  }

  if (Array.isArray(n.children)) {
    return {
      ...n,
      children: n.children.map(mapNode),
    };
  }

  return node;
}

export default function rehypeMdxJsxHtmlIntrinsicsToElements() {
  return (tree: Root) => mapNode(tree) as Root;
}
