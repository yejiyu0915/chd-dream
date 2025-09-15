"use strict";
exports.__esModule = true;
var react_1 = require("react");
var CLogList_module_scss_1 = require("./CLogList.module.scss"); // 동일한 SCSS 모듈 사용
var Icons_1 = require("@/common/components/utils/Icons"); // Icon 컴포넌트 임포트
// 요소가 컨테이너 내의 시작 부분에 정렬되어 있는지 확인하는 헬퍼 함수 (허용 오차 포함)
var isElementAlignedToStart = function (element, container) {
    var containerRect = container.getBoundingClientRect();
    var elementRect = element.getBoundingClientRect();
    var tolerance = 1; // 픽셀 단위 허용 오차
    return Math.abs(elementRect.left - containerRect.left) <= tolerance;
};
function CLogCategoryFilter(_a) {
    var categories = _a.categories, selectedCategory = _a.selectedCategory, onSelectCategory = _a.onSelectCategory;
    var scrollRef = react_1.useRef(null);
    // const lastItemRef = useRef<HTMLLIElement>(null); // 마지막 항목을 위한 ref
    var _b = react_1.useState(false), showRightArrow = _b[0], setShowRightArrow = _b[1];
    // const [isLastItemVisible, setIsLastItemVisible] = useState(false); // 마지막 항목 가시성 상태
    var checkScrollPosition = react_1.useCallback(function () {
        if (scrollRef.current) {
            var _a = scrollRef.current, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth, scrollLeft = _a.scrollLeft;
            var isScrollable = scrollWidth > clientWidth; // 스크롤 가능 여부
            // 스크롤바가 끝까지 도달했는지 확인
            var atEnd = Math.abs(scrollLeft + clientWidth - scrollWidth) < 1; // 1px 미만의 오차 허용
            // 스크롤 가능하며 끝에 도달하지 않았을 때만 화살표를 표시
            setShowRightArrow(isScrollable && !atEnd);
        }
    }, []); // isLastItemVisible 의존성 제거
    react_1.useEffect(function () {
        checkScrollPosition();
        var currentScrollRef = scrollRef.current;
        currentScrollRef === null || currentScrollRef === void 0 ? void 0 : currentScrollRef.addEventListener('scroll', checkScrollPosition);
        window.addEventListener('resize', checkScrollPosition);
        // Intersection Observer 관련 로직 제거
        // const observer = new IntersectionObserver(
        //   (entries) => {
        //     entries.forEach((entry) => {
        //       setIsLastItemVisible(entry.isIntersecting);
        //     });
        //   },
        //   {
        //     root: scrollRef.current, // 스크롤 컨테이너를 root로 설정
        //     rootMargin: '0px',
        //     threshold: 0.1, // 10% 이상 보이면 감지
        //   }
        // );
        // const currentLastItemRef = lastItemRef.current;
        // if (currentLastItemRef) {
        //   observer.observe(currentLastItemRef);
        // }
        return function () {
            currentScrollRef === null || currentScrollRef === void 0 ? void 0 : currentScrollRef.removeEventListener('scroll', checkScrollPosition);
            window.removeEventListener('resize', checkScrollPosition);
            // if (currentLastItemRef) {
            //   observer.unobserve(currentLastItemRef);
            // }
        };
    }, [checkScrollPosition, categories]);
    // 마지막 항목 가시성 변경 시 화살표 상태 재확인 로직 제거
    // useEffect(() => {
    //   checkScrollPosition();
    // }, [isLastItemVisible, checkScrollPosition]);
    // 활성화된 카테고리를 맨 왼쪽으로 스크롤 (마지막 항목이 보이지 않을 때만, 그리고 정렬되어 있지 않을 때)
    react_1.useEffect(function () {
        if (scrollRef.current && selectedCategory) {
            // isLastItemVisible 조건 제거
            var activeCategoryElement = scrollRef.current.querySelector("button." + CLogList_module_scss_1["default"].active);
            if (activeCategoryElement &&
                !isElementAlignedToStart(activeCategoryElement, scrollRef.current)) {
                activeCategoryElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start'
                });
            }
        }
    }, [selectedCategory, categories]); // isLastItemVisible 의존성 제거
    var handleScroll = function () {
        // direction 인자 제거
        if (scrollRef.current) {
            var scrollAmount = scrollRef.current.clientWidth / 2; // 절반만 스크롤
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    return (react_1["default"].createElement("div", { className: CLogList_module_scss_1["default"].categoryFilter + " detail-inner" },
        react_1["default"].createElement("div", { className: CLogList_module_scss_1["default"].categoryFilter__wrapper },
            ' ',
            react_1["default"].createElement("ul", { ref: scrollRef, className: CLogList_module_scss_1["default"].categoryFilter__list },
                react_1["default"].createElement("li", { className: CLogList_module_scss_1["default"].categoryFilter__item },
                    react_1["default"].createElement("button", { type: "button", onClick: function () { return onSelectCategory(null); }, className: CLogList_module_scss_1["default"].categoryFilter__button + " " + (!selectedCategory ? CLogList_module_scss_1["default"].active : '') }, "ALL")),
                categories.map(function (category, _index // index를 _index로 변경
                ) { return (react_1["default"].createElement("li", { key: category, className: CLogList_module_scss_1["default"].categoryFilter__item },
                    react_1["default"].createElement("button", { type: "button", onClick: function () { return onSelectCategory(category); }, className: CLogList_module_scss_1["default"].categoryFilter__button + " " + (selectedCategory === category ? CLogList_module_scss_1["default"].active : '') }, category))); })),
            showRightArrow && (react_1["default"].createElement("button", { type: "button", className: CLogList_module_scss_1["default"].categoryFilter__arrow + " " + CLogList_module_scss_1["default"]['categoryFilter__arrow--right'], onClick: handleScroll, "aria-label": "\uB2E4\uC74C \uCE74\uD14C\uACE0\uB9AC" },
                react_1["default"].createElement(Icons_1["default"], { name: "arrow-next", size: "lg" }),
                " ")),
            showRightArrow && react_1["default"].createElement("div", { className: CLogList_module_scss_1["default"].categoryFilter__gradient }),
            " ")));
}
exports["default"] = CLogCategoryFilter;
