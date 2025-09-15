'use client';
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var infoLayout_module_scss_1 = require("./infoLayout.module.scss");
function InfoLayout(_a) {
    var children = _a.children;
    var pathname = navigation_1.usePathname();
    var pathSegments = pathname.split('/').filter(Boolean);
    // 각 경로 세그먼트에 대한 표시 이름 정의 (옵션)
    var breadcrumbNames = {
        info: '교회 소식',
        'c-log': 'C-Log'
    };
    var breadcrumbs = __spreadArrays([
        { name: 'Home', href: '/' }
    ], pathSegments.map(function (segment, index) {
        var href = '/' + pathSegments.slice(0, index + 1).join('/');
        var name = breadcrumbNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        return { name: name, href: href };
    }));
    // 페이지 타이틀을 동적으로 결정하는 로직 (예: 마지막 브레드크럼 아이템)
    var currentPageTitle = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 1].name : 'Home';
    // C-log 상세 페이지 여부 확인
    var isCLogDetailPage = /\/info\/c-log\/[^/]+$/.test(pathname);
    return (React.createElement("main", { className: infoLayout_module_scss_1["default"].infoLayout },
        !isCLogDetailPage && (React.createElement("div", { className: infoLayout_module_scss_1["default"].titleSection },
            React.createElement("nav", { className: "breadcrumb", "aria-label": "breadcrumb" },
                React.createElement("ol", { className: "breadcrumb__list" }, breadcrumbs.map(function (crumb, index) { return (React.createElement("li", { key: crumb.href, className: "breadcrumb__item" }, index === breadcrumbs.length - 1 ? (React.createElement("span", { className: "breadcrumb__active" }, crumb.name)) : (React.createElement(link_1["default"], { href: crumb.href, className: "breadcrumb__link" }, crumb.name)))); }))),
            React.createElement("div", { className: infoLayout_module_scss_1["default"].inner + " inner" },
                React.createElement("div", { className: infoLayout_module_scss_1["default"].title },
                    React.createElement("h1", { className: infoLayout_module_scss_1["default"].pageTitle }, currentPageTitle),
                    React.createElement("p", { className: infoLayout_module_scss_1["default"].pageDesc }, "\uAD50\uD68C\uC758 \uB2E4\uC591\uD55C \uC774\uC57C\uAE30\uB97C \uC18C\uAC1C\uD569\uB2C8\uB2E4."))))),
        children));
}
exports["default"] = InfoLayout;
