"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _utils = _interopRequireWildcard(require("../utils"));

var _fieldTypes = _interopRequireDefault(require("../EnhanceTable/table/fieldTypes"));

require("./index.less");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 作用: 详情信息表单的渲染
 * @params: fields 渲染表单的属性对象
 * @params: detail  渲染表单的值对象
 * @return：返回值是一个Dom树组
 */
var countEnums = ["one-item", "two-item", "three-item", "four-item"];

function renderBaseFields(fields) {
  var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  console.log(_utils["default"].isIE());
  return fields.map(function (_ref, index) {
    var name = _ref.name,
        key = _ref.key,
        type = _ref.type,
        enums = _ref.enums,
        render = _ref.render,
        isShow = _ref.isShow,
        _ref$unit = _ref.unit,
        unit = _ref$unit === void 0 ? "" : _ref$unit,
        _ref$itemCount = _ref.itemCount,
        itemCount = _ref$itemCount === void 0 ? 2 : _ref$itemCount;
    var value = detail[key]; // 处理格式化数据

    if (type && value && _fieldTypes["default"][type]) {
      value = _fieldTypes["default"][type](value, detail);
    } // 处理枚举


    if (enums) {
      value = (0, _utils.getEnumObject)(enums, detail[key]).label;
    } // 处理render 函数


    if (render && typeof render === "function") {
      value = render(detail);
    } // 如果存在是否显示的定义，并且判断为不显示，直接返回null


    if (isShow && !isShow(detail)) {
      return null;
    }

    var lineClass = countEnums[itemCount - 1]; // 处理没有值时，统一显示为--,

    var _final = value === undefined || value === "" ? "--" : value;

    return _react["default"].createElement("div", {
      className: "showInfo-item ".concat(lineClass),
      key: key
    }, _react["default"].createElement("span", {
      className: "showInfo-label"
    }, name), _react["default"].createElement("span", {
      className: "showInfo-value"
    }, _final, _final === value ? unit : ""));
  });
}

function RenderDetail(props) {
  var fields = props.fields,
      _props$detail = props.detail,
      detail = _props$detail === void 0 ? {} : _props$detail,
      fieldsName = props.fieldsName,
      children = props.children;
  return _react["default"].createElement("div", {
    className: "doddle-render-detail"
  }, fieldsName && _react["default"].createElement("h3", {
    className: "title"
  }, fieldsName), _react["default"].createElement("div", {
    className: "showInfo-content"
  }, children ? children(renderBaseFields) : renderBaseFields(fields, detail)));
}

var _default = _react["default"].memo(RenderDetail);

exports["default"] = _default;