'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.useMDXComponents = void 0;
// 이 파일은 App Router에서 MDX를 사용할 때 필수적입니다.
// MDX 콘텐츠 내의 HTML 태그들을 커스텀 React 컴포넌트로 매핑하는 역할을 합니다.
function useMDXComponents(components) {
    return __assign({ 
        // 기본 HTML 태그들을 커스텀 컴포넌트로 매핑
        h1: function (_a) {
            var children = _a.children;
            return React.createElement("h1", { className: "text-5xl font-bold my-4" }, children);
        }, h2: function (_a) {
            var children = _a.children;
            return React.createElement("h2", { className: "text-4xl font-bold my-3" }, children);
        }, h3: function (_a) {
            var children = _a.children;
            return React.createElement("h3", { className: "text-3xl font-bold my-2" }, children);
        }, h4: function (_a) {
            var children = _a.children;
            return React.createElement("h4", { className: "text-2xl font-bold my-2" }, children);
        }, h5: function (_a) {
            var children = _a.children;
            return React.createElement("h5", { className: "text-xl font-bold my-1" }, children);
        }, h6: function (_a) {
            var children = _a.children;
            return React.createElement("h6", { className: "text-lg font-bold my-1" }, children);
        }, p: function (_a) {
            var children = _a.children;
            return React.createElement("p", { className: "my-2 text-base leading-relaxed" }, children);
        }, ul: function (_a) {
            var children = _a.children;
            return React.createElement("ul", { className: "list-disc list-inside ml-4 my-2" }, children);
        }, ol: function (_a) {
            var children = _a.children;
            return React.createElement("ol", { className: "list-decimal list-inside ml-4 my-2" }, children);
        }, li: function (_a) {
            var children = _a.children;
            return React.createElement("li", { className: "my-1" }, children);
        }, a: function (_a) {
            var children = _a.children, href = _a.href;
            return (React.createElement("a", { href: href, className: "text-blue-600 hover:underline" }, children));
        }, blockquote: function (_a) {
            var children = _a.children;
            return (React.createElement("blockquote", { className: "border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-700" }, children));
        }, code: function (_a) {
            var children = _a.children;
            return (React.createElement("code", { className: "bg-gray-100 text-red-600 px-1 rounded" },
                "`",
                children,
                "`"));
        }, pre: function (_a) {
            var children = _a.children;
            return (React.createElement("pre", { className: "bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-4" },
                React.createElement("code", null, children)));
        }, img: function (_a) {
            var src = _a.src, alt = _a.alt;
            return (React.createElement("img", { src: src, alt: alt, className: "max-w-full h-auto mx-auto my-4 rounded-md shadow-lg" }));
        } }, components);
}
exports.useMDXComponents = useMDXComponents;
