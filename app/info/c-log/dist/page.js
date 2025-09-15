'use client';
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var CLogTagFilter_1 = require("./CLogTagFilter");
var CLogListDisplay_1 = require("./CLogListDisplay");
var CLogCategoryFilter_1 = require("./CLogCategoryFilter"); // CLogCategoryFilter 컴포넌트 임포트
var CLogSortFilter_1 = require("./CLogSortFilter"); // CLogSortFilter 컴포넌트 임포트
var CLogViewModeFilter_1 = require("./CLogViewModeFilter"); // CLogViewModeFilter 컴포넌트 임포트
var CLogList_module_scss_1 = require("@/app/info/c-log/CLogList.module.scss");
var navigation_1 = require("next/navigation"); // useRouter와 useSearchParams 임포트
function CLogListPage() {
    var _this = this;
    var router = navigation_1.useRouter();
    var searchParams = navigation_1.useSearchParams();
    // URL 파라미터에서 초기 상태 설정
    var initialCategory = searchParams.get('category')
        ? decodeURIComponent(searchParams.get('category'))
        : null;
    var initialTag = searchParams.get('tag')
        ? decodeURIComponent(searchParams.get('tag'))
        : null;
    var initialSortOrder = searchParams.get('sort') || 'desc';
    var initialViewMode = searchParams.get('view') || 'grid';
    var _a = react_1.useState(initialTag), selectedTag = _a[0], setSelectedTag = _a[1];
    var _b = react_1.useState(initialCategory), selectedCategory = _b[0], setSelectedCategory = _b[1];
    var _c = react_1.useState(initialSortOrder), sortOrder = _c[0], setSortOrder = _c[1];
    var _d = react_1.useState(initialViewMode), viewMode = _d[0], setViewMode = _d[1];
    // URL 파라미터 변경 시 상태 업데이트
    react_1.useEffect(function () {
        var currentCategory = searchParams.get('category')
            ? decodeURIComponent(searchParams.get('category'))
            : null;
        var currentTag = searchParams.get('tag')
            ? decodeURIComponent(searchParams.get('tag'))
            : null;
        var currentSortOrder = searchParams.get('sort') || 'desc';
        var currentViewMode = searchParams.get('view') || 'grid';
        setSelectedCategory(function (prev) { return (prev !== currentCategory ? currentCategory : prev); });
        setSelectedTag(function (prev) { return (prev !== currentTag ? currentTag : prev); });
        setSortOrder(function (prev) { return (prev !== currentSortOrder ? currentSortOrder : prev); });
        setViewMode(function (prev) { return (prev !== currentViewMode ? currentViewMode : prev); });
    }, [searchParams]);
    var fetchCLogItems = function () { return __awaiter(_this, void 0, Promise, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/api/c-log')];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: " + response.status);
                    }
                    return [2 /*return*/, response.json()];
            }
        });
    }); };
    var _e = react_query_1.useQuery({
        queryKey: ['cLogListItems'],
        queryFn: fetchCLogItems,
        staleTime: 0
    }), allCLogData = _e.data, isLoading = _e.isLoading, isError = _e.isError, error = _e.error;
    // 카테고리 개수 계산
    var categoryCounts = react_1.useMemo(function () {
        var counts = {};
        if (allCLogData) {
            counts['전체보기'] = allCLogData.length; // '전체보기' 항목에 대한 총 개수
            allCLogData.forEach(function (item) {
                counts[item.category] = (counts[item.category] || 0) + 1;
            });
        }
        return counts;
    }, [allCLogData]);
    // 사용 가능한 카테고리 목록 (개수 내림차순 정렬)
    var availableCategories = react_1.useMemo(function () {
        if (!allCLogData)
            return [];
        var categories = new Set();
        allCLogData.forEach(function (item) { return categories.add(item.category); });
        return Array.from(categories).sort(function (a, b) {
            var countA = categoryCounts[a] || 0;
            var countB = categoryCounts[b] || 0;
            return countB - countA;
        });
    }, [allCLogData, categoryCounts]);
    var filteredCLogData = react_1.useMemo(function () {
        if (!allCLogData)
            return [];
        var filteredByTag = allCLogData;
        if (selectedTag) {
            filteredByTag = allCLogData.filter(function (item) { return item.tags.includes(selectedTag); });
        }
        var filteredByCategory = filteredByTag;
        if (selectedCategory) {
            filteredByCategory = filteredByTag.filter(function (item) { return item.category === selectedCategory; });
        }
        var finalFilteredData = filteredByCategory;
        // 정렬 로직 적용
        finalFilteredData = __spreadArrays(finalFilteredData).sort(function (a, b) {
            var dateA = new Date(a.date).getTime();
            var dateB = new Date(b.date).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        return finalFilteredData;
    }, [allCLogData, selectedTag, selectedCategory, sortOrder]); // sortOrder 의존성 추가
    // 카테고리에 따라 동적으로 태그 목록과 개수 재계산
    var dataForTags = react_1.useMemo(function () {
        if (!allCLogData)
            return [];
        // 선택된 카테고리가 있다면 해당 카테고리로 필터링된 데이터를 사용하고,
        // 없으면 전체 데이터를 사용합니다.
        return selectedCategory
            ? allCLogData.filter(function (item) { return item.category === selectedCategory; })
            : allCLogData;
    }, [allCLogData, selectedCategory]);
    var tagCounts = react_1.useMemo(function () {
        var counts = {};
        if (dataForTags) {
            counts['전체보기'] = dataForTags.length; // '전체보기' 항목에 대한 총 개수
            dataForTags.forEach(function (item) {
                item.tags.forEach(function (tag) {
                    counts[tag] = (counts[tag] || 0) + 1;
                });
            });
        }
        return counts;
    }, [dataForTags]); // dataForTags를 의존성 배열에 추가
    var availableTags = react_1.useMemo(function () {
        if (!dataForTags)
            return [];
        var tags = new Set();
        dataForTags.forEach(function (item) {
            item.tags.forEach(function (tag) { return tags.add(tag); });
        });
        return Array.from(tags).sort(function (a, b) {
            // 태그 개수를 기준으로 내림차순 정렬
            var countA = tagCounts[a] || 0;
            var countB = tagCounts[b] || 0;
            return countB - countA;
        });
    }, [dataForTags, tagCounts]); // dataForTags와 tagCounts를 의존성 배열에 추가
    var updateURLParams = function (params) {
        var newSearchParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (value) {
                newSearchParams.set(key, encodeURIComponent(value));
            }
            else {
                newSearchParams["delete"](key);
            }
        });
        router.push("?" + newSearchParams.toString());
    };
    var handleTagSelect = function (tag) {
        updateURLParams({ tag: tag });
    };
    var handleCategorySelect = function (category) {
        updateURLParams({ category: category, tag: null }); // 카테고리 변경 시 태그 초기화
    };
    var handleSortChange = function (order) {
        updateURLParams({ sort: order });
    };
    var handleViewModeChange = function (mode) {
        updateURLParams({ view: mode });
    };
    return (react_1["default"].createElement("section", { className: CLogList_module_scss_1["default"].cLogListMain },
        react_1["default"].createElement("div", { className: CLogList_module_scss_1["default"].cLogListInner },
            react_1["default"].createElement(CLogCategoryFilter_1["default"], { categories: availableCategories, selectedCategory: selectedCategory, onSelectCategory: handleCategorySelect }),
            react_1["default"].createElement(CLogTagFilter_1["default"], { tags: availableTags, selectedTag: selectedTag, onSelectTag: handleTagSelect, tagCounts: tagCounts }),
            react_1["default"].createElement("div", { className: CLogList_module_scss_1["default"].filterGroup + " detail-inner" },
                ' ',
                react_1["default"].createElement(CLogSortFilter_1["default"], { sortOrder: sortOrder, onSortChange: handleSortChange }),
                react_1["default"].createElement(CLogViewModeFilter_1["default"], { viewMode: viewMode, onViewModeChange: handleViewModeChange })),
            react_1["default"].createElement(CLogListDisplay_1["default"], { cLogData: filteredCLogData, isLoading: isLoading, isError: isError, error: error, viewMode: viewMode }))));
}
exports["default"] = CLogListPage;
