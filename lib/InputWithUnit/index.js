"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Option = _antd.Select.Option;
var DefaultEnums = [{
  value: 'M',
  label: '分钟'
}, {
  value: 'H',
  label: '小时'
}, {
  value: 'D',
  label: '天'
}];

var InputWithUnit =
/*#__PURE__*/
function (_React$Component) {
  _inherits(InputWithUnit, _React$Component);

  function InputWithUnit(props) {
    var _this;

    _classCallCheck(this, InputWithUnit);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputWithUnit).call(this, props));
    var _this$props = _this.props,
        _this$props$value = _this$props.value,
        value = _this$props$value === void 0 ? {} : _this$props$value,
        defaultUnit = _this$props.defaultUnit;
    _this.state = {
      number: value.number,
      unit: value.unit || defaultUnit
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.trigger = _this.trigger.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(InputWithUnit, [{
    key: "handleChange",
    value: function handleChange(val, key) {
      var res = this.state;
      this.setState(_defineProperty({}, key, val));
      this.trigger(Object.assign(Object.assign({}, res), _defineProperty({}, key, val)));
    }
  }, {
    key: "trigger",
    value: function trigger(res) {
      var onChange = this.props.onChange; // 虽说Res的值已经用this.setState更新过，但方法是异步的，所以不能直接用this.state

      onChange && onChange(res);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          _this$props2$enums = _this$props2.enums,
          enums = _this$props2$enums === void 0 ? DefaultEnums : _this$props2$enums,
          _this$props2$inputPro = _this$props2.inputProps,
          inputProps = _this$props2$inputPro === void 0 ? {} : _this$props2$inputPro,
          _this$props2$selectPr = _this$props2.selectProps,
          selectProps = _this$props2$selectPr === void 0 ? {} : _this$props2$selectPr;
      var time = this.state;
      return _react["default"].createElement("span", null, _react["default"].createElement(_antd.Input, Object.assign({
        value: time.number,
        onChange: function onChange(e) {
          return _this2.handleChange(e.target.value, 'number');
        },
        style: {
          width: '55%',
          marginRight: '3%'
        },
        placeholder: "\u8BF7\u8F93\u5165"
      }, inputProps)), _react["default"].createElement(_antd.Select, Object.assign({
        value: time.unit,
        style: {
          width: '32%'
        },
        allowClear: false,
        onChange: function onChange(val) {
          return _this2.handleChange(val, 'unit');
        }
      }, selectProps), enums.map(function (_ref) {
        var value = _ref.value,
            label = _ref.label;
        return _react["default"].createElement(Option, {
          key: value,
          value: value
        }, label);
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, preState) {
      // Should be a controlled component.
      var _nextProps$value = nextProps.value,
          value = _nextProps$value === void 0 ? {} : _nextProps$value;

      if ('number' in value && preState.number !== value.number) {
        return Object.assign({}, nextProps.value || {});
      }

      return null;
    }
  }]);

  return InputWithUnit;
}(_react["default"].Component);

exports["default"] = InputWithUnit;