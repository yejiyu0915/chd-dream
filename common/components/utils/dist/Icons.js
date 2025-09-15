'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
function Icon(_a) {
    var name = _a.name, className = _a.className, onClick = _a.onClick;
    return react_1["default"].createElement("i", { className: "icon icon--" + name + " " + className, onClick: onClick });
}
exports["default"] = Icon;
