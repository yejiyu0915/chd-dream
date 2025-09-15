"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getPrevNextCLogPosts = exports.getNotionPageAndContentBySlug = exports.getCLogMainData = exports.getKVSliderData = exports.getNewsData = exports.getSermonData = exports.getCLogData = exports.getNotionDatabaseLastEditedTime = exports.getPublishedNotionData = exports.getNotionData = exports.notion = void 0;
var client_1 = require("@notionhq/client");
exports.notion = new client_1.Client({
    auth: process.env.NOTION_TOKEN
});
// Notion 데이터 가져오기를 위한 제네릭 함수
function getNotionData(databaseIdEnvVar, // Notion 데이터베이스 ID 환경 변수 이름 (예: 'NOTION_CLOG_ID')
mapper, // Notion 페이지 객체를 원하는 타입 T로 변환하는 매퍼 함수
options) {
    return __awaiter(this, void 0, Promise, function () {
        var notionDatabaseId, response, items, _error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notionDatabaseId = process.env[databaseIdEnvVar];
                    if (!process.env.NOTION_TOKEN || !notionDatabaseId) {
                        // console.error(`Notion 토큰 또는 데이터베이스 ID (${databaseIdEnvVar})가 누락되었습니다.`);
                        return [2 /*return*/, []];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exports.notion.databases.query({
                            database_id: notionDatabaseId,
                            filter: options === null || options === void 0 ? void 0 : options.filter,
                            sorts: options === null || options === void 0 ? void 0 : options.sorts,
                            page_size: options === null || options === void 0 ? void 0 : options.pageSize
                        })];
                case 2:
                    response = _a.sent();
                    items = response.results
                        .map(function (page) {
                        if (!('properties' in page) ||
                            page.object !== 'page'
                        // !(page as PageObjectResponse).properties
                        ) {
                            return null; // properties가 없거나 페이지 객체가 아니거나 properties가 없는 경우 스킵
                        }
                        return mapper(page); // PageObjectResponse로 타입 단언
                    })
                        .filter(Boolean);
                    return [2 /*return*/, items];
                case 3:
                    _error_1 = _a.sent();
                    void _error_1; // _error가 사용되지 않는다는 린트 경고를 피하기 위해 추가
                    // console.error(`Notion 데이터 가져오기 중 오류 발생 (${databaseIdEnvVar}):`, _error);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getNotionData = getNotionData;
// 발행된 Notion 데이터를 가져오는 헬퍼 함수
function getPublishedNotionData(databaseIdEnvVar, // Notion 데이터베이스 ID 환경 변수 이름
mapper, // Notion 페이지 객체를 원하는 타입 T로 변환하는 매퍼 함수
pageSize // 가져올 데이터의 최대 개수
) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getNotionData(databaseIdEnvVar, mapper, {
                    filter: {
                        property: 'Status',
                        select: {
                            equals: 'Published'
                        }
                    },
                    sorts: [
                        {
                            property: 'Date',
                            direction: 'descending'
                        },
                    ],
                    pageSize: pageSize,
                    revalidateSeconds: 60
                })];
        });
    });
}
exports.getPublishedNotionData = getPublishedNotionData;
/**
 * Notion 데이터베이스의 마지막 수정 시간을 가져옵니다.
 * 이 함수는 데이터베이스 자체의 메타데이터를 조회하여,
 * 데이터베이스 내용의 변경 여부를 빠르게 확인하는 데 사용됩니다.
 * @param databaseIdEnvVar Notion 데이터베이스 ID 환경 변수 이름
 * @returns 마지막 수정 시간 (ISO 8601 형식 문자열) 또는 null
 */
function getNotionDatabaseLastEditedTime(databaseIdEnvVar) {
    return __awaiter(this, void 0, Promise, function () {
        var notionDatabaseId, database, _error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notionDatabaseId = process.env[databaseIdEnvVar];
                    if (!process.env.NOTION_TOKEN || !notionDatabaseId) {
                        // console.error(`Notion 토큰 또는 데이터베이스 ID (${databaseIdEnvVar})가 누락되었습니다.`);
                        return [2 /*return*/, null];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exports.notion.databases.retrieve({
                            database_id: notionDatabaseId
                        })];
                case 2:
                    database = _a.sent();
                    if ('last_edited_time' in database) {
                        return [2 /*return*/, database.last_edited_time];
                    }
                    return [2 /*return*/, null];
                case 3:
                    _error_2 = _a.sent();
                    void _error_2; // _error가 사용되지 않는다는 린트 경고를 피하기 위해 추가
                    // console.error(
                    //   `Notion 데이터베이스 마지막 수정 시간 가져오기 중 오류 발생 (${databaseIdEnvVar}):`,
                    //   _error
                    // );
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getNotionDatabaseLastEditedTime = getNotionDatabaseLastEditedTime;
// Notion 속성에서 일반 텍스트를 추출하는 헬퍼 함수
function getPlainText(property) {
    var _a, _b;
    if (!property)
        return null;
    if (property.type === 'title' && 'title' in property && ((_a = property.title[0]) === null || _a === void 0 ? void 0 : _a.plain_text)) {
        return property.title[0].plain_text;
    }
    else if (property.type === 'rich_text' &&
        'rich_text' in property && ((_b = property.rich_text[0]) === null || _b === void 0 ? void 0 : _b.plain_text)) {
        return property.rich_text[0].plain_text;
    }
    else if (property.type === 'url' && 'url' in property && property.url) {
        return property.url;
    }
    return null;
}
// Notion 날짜 속성에서 포맷된 날짜 문자열을 추출하는 헬퍼 함수
function getFormattedDate(property) {
    var _a;
    if (!property || property.type !== 'date' || !('date' in property) || !((_a = property.date) === null || _a === void 0 ? void 0 : _a.start)) {
        return '날짜 없음';
    }
    return new Date(property.date.start)
        .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
        .replace(/\. /g, '.')
        .replace(/\.$/, '');
}
// CLogItem 매핑 함수
var mapPageToCLogItem = function (page) {
    var _a;
    var properties = page.properties;
    // 속성 이름을 정확히 명시하고 타입 가드를 활용합니다.
    var titleProperty = properties.Title;
    var categoryProperty = properties.Category;
    var dateProperty = properties.Date;
    var tagsProperty = properties.Tags;
    var slugProperty = properties.Slug; // Slug 속성 추가
    var descriptionProperty = properties.Description; // Description 속성 추가
    var imageUrlToUse = '/no-image.svg';
    if (page.cover) {
        if (page.cover.type === 'external') {
            imageUrlToUse = page.cover.external.url || '/no-image.svg';
        }
        else if (page.cover.type === 'file') {
            imageUrlToUse = "/api/notion-image?pageId=" + page.id + "&type=cover";
        }
    }
    var slug = getPlainText(slugProperty) || ''; // slug 추출
    return {
        id: page.id,
        title: getPlainText(titleProperty) || '제목 없음',
        category: (categoryProperty && 'select' in categoryProperty && ((_a = categoryProperty.select) === null || _a === void 0 ? void 0 : _a.name)) || '기타',
        date: getFormattedDate(dateProperty),
        imageUrl: imageUrlToUse,
        imageAlt: getPlainText(titleProperty) || 'C-log 이미지',
        tags: (tagsProperty &&
            'multi_select' in tagsProperty &&
            Array.isArray(tagsProperty.multi_select)
            ? tagsProperty.multi_select
            : []).map(function (tag) { return tag.name; }),
        slug: slug,
        link: "/info/c-log/" + slug,
        description: getPlainText(descriptionProperty) || undefined
    };
};
// 설교 데이터 매핑 함수
var mapPageToSermonItem = function (page) {
    var properties = page.properties;
    var titleProperty = properties.Title;
    var dateProperty = properties.Date;
    var summaryProperty = properties.Summary;
    var verseProperty = properties.Verse;
    var linkProperty = properties.Link;
    return {
        id: page.id,
        date: getFormattedDate(dateProperty),
        title: getPlainText(titleProperty) || '제목 없음',
        summary: getPlainText(summaryProperty) || '요약 없음',
        verse: getPlainText(verseProperty) || '본문 없음',
        link: linkProperty && 'url' in linkProperty && typeof linkProperty.url === 'string'
            ? linkProperty.url
            : '/'
    };
};
// 뉴스 데이터 매핑 함수
var mapPageToNewsItem = function (page) {
    var properties = page.properties;
    var titleProperty = properties.Title;
    var dateProperty = properties.Date;
    return {
        id: page.id,
        title: getPlainText(titleProperty) || '제목 없음',
        date: getFormattedDate(dateProperty)
    };
};
// KV Slider 데이터 매핑 함수
var mapPageToKVSliderItem = function (page) {
    var _a;
    var properties = page.properties;
    var titleProperty = properties.Title;
    var descriptionProperty = properties.Summary;
    var linkProperty = properties.Link;
    var imageProperty = properties.Image;
    var imageUrlToUse = '/main/kv.jpg';
    var imageAltToUse = getPlainText(titleProperty) || '이미지';
    if (page.cover) {
        if (page.cover.type === 'external') {
            imageUrlToUse = page.cover.external.url || '/main/kv.jpg';
        }
        else if (page.cover.type === 'file') {
            imageUrlToUse = "/api/notion-image?pageId=" + page.id + "&type=cover";
        }
    }
    else if (imageProperty && 'files' in imageProperty && ((_a = imageProperty.files) === null || _a === void 0 ? void 0 : _a[0])) {
        var file = imageProperty.files[0];
        if (file.type === 'external') {
            imageUrlToUse = file.external.url;
        }
        else if (file.type === 'file') {
            imageUrlToUse = "/api/notion-image?pageId=" + page.id + "&propertyId=" + imageProperty.id; // propertyId는 string이므로 as any 제거
        }
        imageAltToUse = file.name || '이미지';
    }
    return {
        id: page.id,
        title: getPlainText(titleProperty) || '제목 없음',
        description: getPlainText(descriptionProperty) || '설명 없음',
        image: imageUrlToUse,
        imageAlt: imageAltToUse,
        link: linkProperty && 'url' in linkProperty && typeof linkProperty.url === 'string'
            ? linkProperty.url
            : '/'
    };
};
// Notion 데이터베이스에서 C-log 데이터 가져오기
function getCLogData() {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getPublishedNotionData('NOTION_CLOG_ID', mapPageToCLogItem)];
        });
    });
}
exports.getCLogData = getCLogData;
// Notion 데이터베이스에서 최신 설교 데이터 가져오기
function getSermonData() {
    return __awaiter(this, void 0, Promise, function () {
        var sermons;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPublishedNotionData('NOTION_SERMON_ID', mapPageToSermonItem, 1)];
                case 1:
                    sermons = _a.sent();
                    return [2 /*return*/, sermons.length > 0 ? sermons[0] : null];
            }
        });
    });
}
exports.getSermonData = getSermonData;
// Notion 데이터베이스에서 최신 뉴스 데이터 가져오기
function getNewsData() {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getPublishedNotionData('NOTION_NEWS_ID', mapPageToNewsItem, 2)];
        });
    });
}
exports.getNewsData = getNewsData;
// Notion 데이터베이스에서 최신 KV Slider 데이터 가져오기
function getKVSliderData() {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getPublishedNotionData('NOTION_KV_ID', mapPageToKVSliderItem)];
        });
    });
}
exports.getKVSliderData = getKVSliderData;
// Notion 데이터베이스에서 메인 페이지용 C-log 데이터 (6개) 가져오기
function getCLogMainData() {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getPublishedNotionData('NOTION_CLOG_ID', mapPageToCLogItem, 6)];
        });
    });
}
exports.getCLogMainData = getCLogMainData;
function getNotionPageAndContentBySlug(databaseIdEnvVar, slug) {
    return __awaiter(this, void 0, Promise, function () {
        var notionDatabaseId, response, page, blocks, cursor, blockResponse, _error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notionDatabaseId = process.env[databaseIdEnvVar];
                    if (!process.env.NOTION_TOKEN || !notionDatabaseId) {
                        return [2 /*return*/, null];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, exports.notion.databases.query({
                            database_id: notionDatabaseId,
                            filter: {
                                property: 'Slug',
                                rich_text: {
                                    equals: slug
                                }
                            },
                            page_size: 1
                        })];
                case 2:
                    response = _a.sent();
                    if (response.results.length === 0) {
                        return [2 /*return*/, null]; // 해당 슬러그를 가진 페이지가 없습니다.
                    }
                    page = response.results[0];
                    if (!('properties' in page) || page.object !== 'page') {
                        return [2 /*return*/, null]; // 유효한 페이지 객체가 아닙니다.
                    }
                    blocks = [];
                    cursor = null;
                    _a.label = 3;
                case 3: return [4 /*yield*/, exports.notion.blocks.children.list({
                        block_id: page.id,
                        start_cursor: cursor || undefined
                    })];
                case 4:
                    blockResponse = _a.sent();
                    blocks.push.apply(blocks, blockResponse.results);
                    cursor = blockResponse.next_cursor;
                    _a.label = 5;
                case 5:
                    if (cursor) return [3 /*break*/, 3];
                    _a.label = 6;
                case 6: return [2 /*return*/, { page: page, blocks: blocks }];
                case 7:
                    _error_3 = _a.sent();
                    void _error_3;
                    // console.error(`Notion 페이지 및 콘텐츠 가져오기 중 오류 발생:`, _error);
                    return [2 /*return*/, null];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.getNotionPageAndContentBySlug = getNotionPageAndContentBySlug;
function getPrevNextCLogPosts(currentSlug) {
    var _a, _b, _c;
    return __awaiter(this, void 0, Promise, function () {
        var clogItems, prevPost, nextPost, i, item, itemSlug, prevItem, nextItem;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, getCLogData()];
                case 1:
                    clogItems = _d.sent();
                    prevPost = null;
                    nextPost = null;
                    for (i = 0; i < clogItems.length; i++) {
                        item = clogItems[i];
                        itemSlug = (_a = item.link) === null || _a === void 0 ? void 0 : _a.split('/').pop();
                        if (itemSlug === currentSlug) {
                            // 현재 게시글을 찾았을 때 이전/다음 게시글 설정
                            if (i > 0) {
                                prevItem = clogItems[i - 1];
                                prevPost = {
                                    title: prevItem.title,
                                    slug: ((_b = prevItem.link) === null || _b === void 0 ? void 0 : _b.split('/').pop()) || ''
                                };
                            }
                            if (i < clogItems.length - 1) {
                                nextItem = clogItems[i + 1];
                                nextPost = {
                                    title: nextItem.title,
                                    slug: ((_c = nextItem.link) === null || _c === void 0 ? void 0 : _c.split('/').pop()) || ''
                                };
                            }
                            break; // 현재 게시글을 찾았으므로 루프 종료
                        }
                    }
                    return [2 /*return*/, { prev: prevPost, next: nextPost }];
            }
        });
    });
}
exports.getPrevNextCLogPosts = getPrevNextCLogPosts;
