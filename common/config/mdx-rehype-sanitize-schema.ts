import { defaultSchema } from 'hast-util-sanitize';
import type { Schema } from 'hast-util-sanitize';

/**
 * Notion 테이블용 HTML에 쓰는 div.table-wrapper 의 className 을 sanitize 에서 허용.
 */
export const mdxContentSanitizeSchema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div ?? []), ['className', 'table-wrapper']],
  },
};
