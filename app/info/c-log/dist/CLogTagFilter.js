'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react"); // useRef, useState, useEffect 임포트
var CLogList_module_scss_1 = require("./CLogList.module.scss");
var Icons_1 = require("@/common/components/utils/Icons"); // Icon 컴포넌트 임포트
// 모바일에서 태그 목록의 한 줄 높이를 추정 (폰트 크기, 패딩 등을 고려하여 조정 필요)
function CLogTagFilter(_a) {
    var tags = _a.tags, selectedTag = _a.selectedTag, onSelectTag = _a.onSelectTag, tagCounts = _a.tagCounts;
    var listRef = react_1.useRef(null);
    var _b = react_1.useState(false), isExpanded = _b[0], setIsExpanded = _b[1];
    var _c = react_1.useState(false), showToggleButton = _c[0], setShowToggleButton = _c[1];
    var handleToggleExpand = function () {
        setIsExpanded(function (prev) { return !prev; });
    };
    react_1.useEffect(function () {
        if (listRef.current) {
            // 모바일 환경에서만 작동하도록 체크
            var isMobile = window.innerWidth <= 768; // 768px을 모바일 기준으로 가정
            if (isMobile) {
                var currentHeight = listRef.current.scrollHeight;
                // 대략적인 한 줄 높이 (폰트 크기, 라인 높이, 패딩 등을 고려)
                // 여기서는 임시로 MOBILE_TAG_LINE_HEIGHT를 사용합니다.
                if (currentHeight > 40 * 1.5) {
                    // SCSS에서 vw(40) 사용하므로 직접 값 지정
                    // 1.5배 이상이면 버튼 표시
                    setShowToggleButton(true);
                    // 초기 로드 시 `is-collapsed` 클래스를 적용하여 한 줄만 보이도록
                }
                else {
                    setShowToggleButton(false);
                    setIsExpanded(false); // 버튼이 없으면 항상 축소 상태 해제
                }
            }
            else {
                setShowToggleButton(false);
                setIsExpanded(false); // PC에서는 확장/축소 기능 비활성화
            }
        }
    }, [tags, isExpanded]); // tags가 변경되거나 isExpanded가 변경될 때 재측정
    return (react_1["default"].createElement("div", { className: CLogList_module_scss_1["default"].tagFilter + " detail-inner" },
        react_1["default"].createElement("div", { className: CLogList_module_scss_1["default"].tagFilter__expandableContainer },
            ' ',
            react_1["default"].createElement("ul", { ref: listRef, className: CLogList_module_scss_1["default"].tagFilter__list + " " + (showToggleButton && !isExpanded ? CLogList_module_scss_1["default"]['is-collapsed'] : '') + " " + (showToggleButton && isExpanded ? CLogList_module_scss_1["default"]['is-expanded'] : '') },
                react_1["default"].createElement("li", { className: CLogList_module_scss_1["default"].tagFilter__item },
                    react_1["default"].createElement("button", { type: "button", onClick: function () { return onSelectTag(null); }, className: CLogList_module_scss_1["default"].tagFilter__button + " " + (!selectedTag ? CLogList_module_scss_1["default"].active : '') },
                        "ALL TAG ",
                        react_1["default"].createElement("span", { className: CLogList_module_scss_1["default"].tagFilter__count },
                            "(",
                            tagCounts['전체보기'] || 0,
                            ")"))),
                tags.map(function (tag) { return (react_1["default"].createElement("li", { key: tag, className: CLogList_module_scss_1["default"].tagFilter__item },
                    react_1["default"].createElement("button", { type: "button", onClick: function () { return onSelectTag(tag); }, className: CLogList_module_scss_1["default"].tagFilter__button + " " + (selectedTag === tag ? CLogList_module_scss_1["default"].active : '') },
                        "# ",
                        tag,
                        " ",
                        react_1["default"].createElement("span", { className: CLogList_module_scss_1["default"].tagFilter__count },
                            "(",
                            tagCounts[tag] || 0,
                            ")")))); })),
            showToggleButton && (react_1["default"].createElement("button", { type: "button", onClick: handleToggleExpand, className: CLogList_module_scss_1["default"].tagFilter__toggleButton, "aria-expanded": isExpanded },
                react_1["default"].createElement(Icons_1["default"], { name: isExpanded ? 'arrow-up' : 'arrow-down', size: "md" }))))));
}
exports["default"] = CLogTagFilter;
