/******/ var __webpack_modules__ = ({

/***/ 99:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 122:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(989);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(424)/* ["default"] */ .A)
var update = add("5ec85c92", content, false, {"ssrId":true});
// Hot Module Replacement
if(false) // removed by dead control flow
{}

/***/ }),

/***/ 226:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 341:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
// runtime helper for setting properties on components
// in a tree-shakable way
exports.A = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
        target[key] = val;
    }
    return target;
};


/***/ }),

/***/ 424:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ addStylesClient)
});

;// ./node_modules/.pnpm/vue-style-loader@4.1.3/node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

;// ./node_modules/.pnpm/vue-style-loader@4.1.3/node_modules/vue-style-loader/lib/addStylesClient.js
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 989:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_101_3_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(226);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_101_3_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_101_3_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_101_3_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99);
/* harmony import */ var _node_modules_pnpm_css_loader_7_1_2_webpack_5_101_3_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_101_3_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_7_1_2_webpack_5_101_3_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_7_1_2_webpack_5_101_3_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.th-phone-fab[data-v-1d4892c0]{position:fixed;right:18px;bottom:18px;z-index:99999;width:44px;height:44px;border-radius:22px;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,0.25);cursor:pointer;-webkit-user-select:none;user-select:none;transition:transform 0.2s ease,box-shadow 0.2s ease;font-size:20px}.th-phone-fab[data-v-1d4892c0]:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,0.28)}.th-phone-wrapper[data-v-1d4892c0]{position:fixed;right:24px;bottom:78px;z-index:99998;width:360px;height:760px;pointer-events:none}.th-phone[data-v-1d4892c0]{position:absolute;inset:0;margin:auto;width:100%;height:100%;border-radius:42px;background:#0a0a0a;box-shadow:0 24px 60px rgba(0,0,0,0.45),inset 0 0 0 10px #1a1a1a;overflow:hidden;transform:translateY(20px) scale(0.98);opacity:0;transition:transform 0.28s cubic-bezier(0.2,0.7,0.2,1),opacity 0.28s;pointer-events:auto}.th-phone--open[data-v-1d4892c0]{transform:translateY(0) scale(1);opacity:1}.th-notch[data-v-1d4892c0]{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:180px;height:34px;background:#000;border-radius:18px;box-shadow:0 0 0 2px #121212}.th-screen[data-v-1d4892c0]{position:absolute;inset:8px;border-radius:34px;background:linear-gradient(180deg,#111,#0b0b0b);overflow:hidden}.th-statusbar[data-v-1d4892c0]{height:24px;display:flex;align-items:center;justify-content:space-between;padding:6px 14px;color:#cfcfcf;font-size:12px}.th-apps[data-v-1d4892c0]{position:absolute;top:24px;left:0;right:0;bottom:0;padding:48px 18px 18px;display:flex;flex-direction:column;gap:12px}.th-dock[data-v-1d4892c0]{position:absolute;bottom:16px;left:16px;right:16px;height:70px;background:rgba(255,255,255,0.06);border-radius:18px;display:flex;align-items:center;justify-content:center;gap:16px;backdrop-filter:blur(10px)}.th-app-icon[data-v-1d4892c0]{width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.05),0 10px 20px rgba(0,0,0,0.35)}.th-app-icon--wechat[data-v-1d4892c0]{background:#07c160}.th-app-label[data-v-1d4892c0]{text-align:center;color:#d0d0d0;font-size:12px;margin-top:6px}.th-grid[data-v-1d4892c0]{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.th-center[data-v-1d4892c0]{display:flex;flex-direction:column;align-items:center}.th-wechat[data-v-1d4892c0]{position:absolute;inset:0;display:flex;flex-direction:column;background:#fff;color:#111}.th-wechat-topbar[data-v-1d4892c0]{height:52px;display:flex;align-items:center;padding:0 12px;gap:8px;background:#f5f5f5;border-bottom:1px solid #eee}.th-wechat-back[data-v-1d4892c0]{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer}.th-wechat-title[data-v-1d4892c0]{font-weight:600}.th-wechat-list[data-v-1d4892c0]{flex:1;overflow:auto;background:#fff}.th-wechat-item[data-v-1d4892c0]{display:flex;gap:10px;padding:12px;border-bottom:1px solid #f2f2f2;cursor:pointer}.th-wechat-avatar[data-v-1d4892c0]{width:42px;height:42px;border-radius:8px;background:#07c160;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700}.th-wechat-meta[data-v-1d4892c0]{flex:1;display:flex;flex-direction:column}.th-wechat-name[data-v-1d4892c0]{font-weight:600}.th-wechat-preview[data-v-1d4892c0]{color:#666;font-size:12px;margin-top:4px}.th-wechat-chat[data-v-1d4892c0]{flex:1;display:flex;flex-direction:column;background:#eaeaea}.th-wechat-msgs[data-v-1d4892c0]{flex:1;padding:12px;overflow:auto;display:flex;flex-direction:column;gap:8px}.th-msg[data-v-1d4892c0]{max-width:70%;padding:8px 10px;border-radius:8px;background:#fff;align-self:flex-start}.th-msg.me[data-v-1d4892c0]{background:#a7e2b3;align-self:flex-end}.th-wechat-input[data-v-1d4892c0]{height:54px;background:#f6f6f6;border-top:1px solid #e6e6e6;display:flex;align-items:center;gap:8px;padding:6px 8px}.th-wechat-input input[data-v-1d4892c0]{flex:1;height:36px;border-radius:18px;border:1px solid #ddd;padding:0 12px;outline:none}.th-wechat-send[data-v-1d4892c0]{height:36px;padding:0 12px;border-radius:18px;background:#07c160;color:#fff;font-weight:600;display:flex;align-items:center;cursor:pointer}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// external "Vue"
const external_Vue_namespaceObject = Vue;
;// external "_"
const external_namespaceObject = _;
var external_default = /*#__PURE__*/__webpack_require__.n(external_namespaceObject);
;// external "z"
const external_z_namespaceObject = z;
;// ./node_modules/.pnpm/ts-loader@9.5.4_typescript@6.0.0-dev.20250807_webpack@5.101.3/node_modules/ts-loader/index.js??clonedRuleSet-46!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.21_typescript@6.0.0-dev.20250807__webpack@5.101.3/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[4].use[0]!./src/手机脚本/app.vue?vue&type=script&setup=true&lang=ts


const _hoisted_1 = { class: "th-screen" };
const _hoisted_2 = { class: "th-apps" };
const _hoisted_3 = {
    key: 0,
    class: "th-grid"
};
const _hoisted_4 = { class: "th-center" };
const _hoisted_5 = { class: "th-wechat" };
const _hoisted_6 = { class: "th-wechat-topbar" };
const _hoisted_7 = { class: "th-wechat-list" };
const _hoisted_8 = ["onClick"];
const _hoisted_9 = { class: "th-wechat-avatar" };
const _hoisted_10 = { class: "th-wechat-meta" };
const _hoisted_11 = { class: "th-wechat-name" };
const _hoisted_12 = { class: "th-wechat-preview" };
const _hoisted_13 = { class: "th-wechat-chat" };
const _hoisted_14 = { class: "th-wechat-topbar" };
const _hoisted_15 = { class: "th-wechat-title" };
const _hoisted_16 = { class: "th-wechat-input" };



/* harmony default export */ const appvue_type_script_setup_true_lang_ts = (/*@__PURE__*/(0,external_Vue_namespaceObject.defineComponent)({
    __name: 'app',
    setup(__props) {
        const SettingsSchema = external_z_namespaceObject.z.object({
            phoneOpen: external_z_namespaceObject.z.boolean().default(false),
            phoneRight: external_z_namespaceObject.z.number().min(0).default(24),
            phoneBottom: external_z_namespaceObject.z.number().min(0).default(78),
        });
        const scriptId = getScriptId();
        function loadSettings() {
            const raw = getVariables({ type: 'script', script_id: scriptId });
            return SettingsSchema.parse(raw ?? {});
        }
        function saveSettings(next) {
            const current = loadSettings();
            replaceVariables(external_default().cloneDeep({ ...current, ...next }), { type: 'script', script_id: scriptId });
        }
        const settings = (0,external_Vue_namespaceObject.reactive)(loadSettings());
        const currentPage = (0,external_Vue_namespaceObject.ref)('home');
        const phoneRef = (0,external_Vue_namespaceObject.ref)(null);
        const msgsRef = (0,external_Vue_namespaceObject.ref)(null);
        const wrapperStyle = (0,external_Vue_namespaceObject.computed)(() => ({
            display: settings.phoneOpen ? 'block' : 'none',
            right: settings.phoneRight + 'px',
            bottom: settings.phoneBottom + 'px',
        }));
        function togglePhone() {
            settings.phoneOpen = !settings.phoneOpen;
        }
        function openApp(app) {
            if (app === 'wechat') {
                currentPage.value = 'wechat';
                wechat.view = 'list';
            }
        }
        const wechat = (0,external_Vue_namespaceObject.reactive)({
            view: 'list',
            chats: [
                { id: 'a', name: '小明', preview: '在吗？', messages: [{ text: '在吗？' }] },
                { id: 'b', name: '群聊', preview: '今晚 8 点开黑', messages: [{ text: '今晚 8 点开黑' }] },
            ],
            current: null,
            input: '',
        });
        function openChat(id) {
            const c = wechat.chats.find(x => x.id === id) || null;
            wechat.current = c;
            wechat.view = 'chat';
            (0,external_Vue_namespaceObject.nextTick)(() => scrollToBottom());
        }
        function sendMsg() {
            const text = wechat.input.trim();
            if (!text || !wechat.current)
                return;
            wechat.current.messages.push({ text, me: true });
            wechat.current.preview = text;
            wechat.input = '';
            (0,external_Vue_namespaceObject.nextTick)(() => scrollToBottom());
        }
        function scrollToBottom() {
            if (!msgsRef.value)
                return;
            msgsRef.value.scrollTop = msgsRef.value.scrollHeight;
        }
        // 拖拽
        let dragStartX = 0, dragStartY = 0;
        let wrapStartRight = 24, wrapStartBottom = 78;
        let dragging = false;
        (0,external_Vue_namespaceObject.onMounted)(() => {
            const $wrap = $(phoneRef.value).closest('.th-phone-wrapper');
            $(phoneRef.value).on('mousedown touchstart', e => {
                if ($(e.target).closest('.th-screen').length)
                    return;
                const isTouch = e.originalEvent?.touches?.length > 0;
                dragStartX = isTouch ? e.originalEvent.touches[0].clientX : e.clientX;
                dragStartY = isTouch ? e.originalEvent.touches[0].clientY : e.clientY;
                const currentRight = parseFloat(($wrap.css('right') || '24').toString());
                const currentBottom = parseFloat(($wrap.css('bottom') || '78').toString());
                wrapStartRight = isNaN(currentRight) ? 24 : currentRight;
                wrapStartBottom = isNaN(currentBottom) ? 78 : currentBottom;
                dragging = true;
                $(document).on('mousemove.th-phone touchmove.th-phone', onMove);
                $(document).on('mouseup.th-phone touchend.th-phone', endDrag);
            });
            function onMove(e) {
                if (!dragging)
                    return;
                const isTouch = e.touches && e.touches.length > 0;
                const clientX = isTouch ? e.touches[0].clientX : e.clientX;
                const clientY = isTouch ? e.touches[0].clientY : e.clientY;
                const dx = clientX - dragStartX;
                const dy = clientY - dragStartY;
                const right = Math.max(0, wrapStartRight - dx);
                const bottom = Math.max(0, wrapStartBottom - dy);
                $wrap.css({ right: right + 'px', bottom: bottom + 'px' });
                settings.phoneRight = right;
                settings.phoneBottom = bottom;
            }
            function endDrag() {
                dragging = false;
                $(document).off('mousemove.th-phone touchmove.th-phone', onMove);
                $(document).off('mouseup.th-phone touchend.th-phone', endDrag);
            }
        });
        // 同步设置到酒馆变量
        (0,external_Vue_namespaceObject.watch)(settings, now => {
            saveSettings(now);
        }, { deep: true });
        return (_ctx, _cache) => {
            return ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createElementBlock)("div", null, [
                (0,external_Vue_namespaceObject.createElementVNode)("div", {
                    class: "th-phone-fab",
                    onClick: togglePhone,
                    title: "打开手机"
                }, "📱"),
                (0,external_Vue_namespaceObject.createElementVNode)("div", {
                    class: "th-phone-wrapper",
                    style: (0,external_Vue_namespaceObject.normalizeStyle)(wrapperStyle.value)
                }, [
                    (0,external_Vue_namespaceObject.createElementVNode)("div", {
                        class: (0,external_Vue_namespaceObject.normalizeClass)(["th-phone", { 'th-phone--open': settings.phoneOpen }]),
                        ref_key: "phoneRef",
                        ref: phoneRef
                    }, [
                        _cache[8] || (_cache[8] = (0,external_Vue_namespaceObject.createElementVNode)("div", { class: "th-notch" }, null, -1 /* CACHED */)),
                        (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_1, [
                            _cache[6] || (_cache[6] = (0,external_Vue_namespaceObject.createElementVNode)("div", { class: "th-statusbar" }, [
                                (0,external_Vue_namespaceObject.createElementVNode)("span", null, "9:41"),
                                (0,external_Vue_namespaceObject.createElementVNode)("span", null, "4G ▰▰▰ 🔋")
                            ], -1 /* CACHED */)),
                            (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_2, [
                                (currentPage.value === 'home')
                                    ? ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createElementBlock)("div", _hoisted_3, [
                                        (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_4, [
                                            (0,external_Vue_namespaceObject.createElementVNode)("div", {
                                                class: "th-app-icon th-app-icon--wechat",
                                                onClick: _cache[0] || (_cache[0] = ($event) => (openApp('wechat')))
                                            }, "微"),
                                            _cache[4] || (_cache[4] = (0,external_Vue_namespaceObject.createElementVNode)("div", { class: "th-app-label" }, "微信", -1 /* CACHED */))
                                        ])
                                    ]))
                                    : (0,external_Vue_namespaceObject.createCommentVNode)("v-if", true),
                                (0,external_Vue_namespaceObject.createCommentVNode)(" 微信页面 "),
                                (0,external_Vue_namespaceObject.withDirectives)((0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_5, [
                                    (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_6, [
                                        (0,external_Vue_namespaceObject.createElementVNode)("div", {
                                            class: "th-wechat-back",
                                            onClick: _cache[1] || (_cache[1] = ($event) => (currentPage.value = 'home'))
                                        }, "←"),
                                        _cache[5] || (_cache[5] = (0,external_Vue_namespaceObject.createElementVNode)("div", { class: "th-wechat-title" }, "微信", -1 /* CACHED */))
                                    ]),
                                    (0,external_Vue_namespaceObject.withDirectives)((0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_7, [
                                        ((0,external_Vue_namespaceObject.openBlock)(true), (0,external_Vue_namespaceObject.createElementBlock)(external_Vue_namespaceObject.Fragment, null, (0,external_Vue_namespaceObject.renderList)(wechat.chats, (c) => {
                                            return ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createElementBlock)("div", {
                                                class: "th-wechat-item",
                                                key: c.id,
                                                onClick: ($event) => (openChat(c.id))
                                            }, [
                                                (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_9, (0,external_Vue_namespaceObject.toDisplayString)(c.name.slice(0, 1)), 1 /* TEXT */),
                                                (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_10, [
                                                    (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_11, (0,external_Vue_namespaceObject.toDisplayString)(c.name), 1 /* TEXT */),
                                                    (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_12, (0,external_Vue_namespaceObject.toDisplayString)(c.preview), 1 /* TEXT */)
                                                ])
                                            ], 8 /* PROPS */, _hoisted_8));
                                        }), 128 /* KEYED_FRAGMENT */))
                                    ], 512 /* NEED_PATCH */), [
                                        [external_Vue_namespaceObject.vShow, wechat.view === 'list']
                                    ]),
                                    (0,external_Vue_namespaceObject.withDirectives)((0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_13, [
                                        (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_14, [
                                            (0,external_Vue_namespaceObject.createElementVNode)("div", {
                                                class: "th-wechat-back",
                                                onClick: _cache[2] || (_cache[2] = ($event) => (wechat.view = 'list'))
                                            }, "←"),
                                            (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_15, (0,external_Vue_namespaceObject.toDisplayString)(wechat.current?.name), 1 /* TEXT */)
                                        ]),
                                        (0,external_Vue_namespaceObject.createElementVNode)("div", {
                                            class: "th-wechat-msgs",
                                            ref_key: "msgsRef",
                                            ref: msgsRef
                                        }, [
                                            ((0,external_Vue_namespaceObject.openBlock)(true), (0,external_Vue_namespaceObject.createElementBlock)(external_Vue_namespaceObject.Fragment, null, (0,external_Vue_namespaceObject.renderList)(wechat.current?.messages, (m, i) => {
                                                return ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createElementBlock)("div", {
                                                    key: i,
                                                    class: (0,external_Vue_namespaceObject.normalizeClass)(["th-msg", { me: m.me }])
                                                }, (0,external_Vue_namespaceObject.toDisplayString)(m.text), 3 /* TEXT, CLASS */));
                                            }), 128 /* KEYED_FRAGMENT */))
                                        ], 512 /* NEED_PATCH */),
                                        (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_16, [
                                            (0,external_Vue_namespaceObject.withDirectives)((0,external_Vue_namespaceObject.createElementVNode)("input", {
                                                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => ((wechat.input) = $event)),
                                                type: "text",
                                                placeholder: "发消息",
                                                onKeyup: (0,external_Vue_namespaceObject.withKeys)(sendMsg, ["enter"])
                                            }, null, 544 /* NEED_HYDRATION, NEED_PATCH */), [
                                                [external_Vue_namespaceObject.vModelText, wechat.input]
                                            ]),
                                            (0,external_Vue_namespaceObject.createElementVNode)("div", {
                                                class: "th-wechat-send",
                                                onClick: sendMsg
                                            }, "发送")
                                        ])
                                    ], 512 /* NEED_PATCH */), [
                                        [external_Vue_namespaceObject.vShow, wechat.view === 'chat']
                                    ])
                                ], 512 /* NEED_PATCH */), [
                                    [external_Vue_namespaceObject.vShow, currentPage.value === 'wechat']
                                ])
                            ]),
                            _cache[7] || (_cache[7] = (0,external_Vue_namespaceObject.createElementVNode)("div", { class: "th-dock" }, null, -1 /* CACHED */))
                        ])
                    ], 2 /* CLASS */)
                ], 4 /* STYLE */)
            ]));
        };
    }
}));

;// ./src/手机脚本/app.vue?vue&type=script&setup=true&lang=ts
 
// EXTERNAL MODULE: ./node_modules/.pnpm/vue-style-loader@4.1.3/node_modules/vue-style-loader/index.js??clonedRuleSet-49.use[0]!./node_modules/.pnpm/css-loader@7.1.2_webpack@5.101.3/node_modules/css-loader/dist/cjs.js??clonedRuleSet-49.use[1]!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.21_typescript@6.0.0-dev.20250807__webpack@5.101.3/node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/.pnpm/postcss-loader@8.2.0_postcss@8.5.6_typescript@6.0.0-dev.20250807_webpack@5.101.3/node_modules/postcss-loader/dist/cjs.js!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.21_typescript@6.0.0-dev.20250807__webpack@5.101.3/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[4].use[0]!./src/手机脚本/app.vue?vue&type=style&index=0&id=1d4892c0&scoped=true&lang=css
var appvue_type_style_index_0_id_1d4892c0_scoped_true_lang_css = __webpack_require__(122);
;// ./src/手机脚本/app.vue?vue&type=style&index=0&id=1d4892c0&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.21_typescript@6.0.0-dev.20250807__webpack@5.101.3/node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(341);
;// ./src/手机脚本/app.vue



;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.A)(appvue_type_script_setup_true_lang_ts, [['__scopeId',"data-v-1d4892c0"]])

/* harmony default export */ const app = (__exports__);
;// ./src/手机脚本/index.ts


const SCRIPT_ID = getScriptId();
function mountPoint() {
    if ($(`div[script_id="${SCRIPT_ID}"]`).length === 0) {
        $('<div>').attr('script_id', SCRIPT_ID).appendTo('body');
    }
    return $(`div[script_id="${SCRIPT_ID}"]`);
}
function teleport_style() {
    $('<div>').attr('script_id', SCRIPT_ID).append($('head > style', document).clone()).appendTo('head');
}
function deteleport_style() {
    $(`head > div[script_id="${SCRIPT_ID}"]`).remove();
}
let vueApp = null;
$(() => {
    const $root = mountPoint();
    vueApp = (0,external_Vue_namespaceObject.createApp)(app);
    vueApp.mount($root[0]);
    teleport_style();
});
$(window).on('pagehide', () => {
    try {
        vueApp?.unmount?.();
    }
    catch (e) {
        console.warn(e);
    }
    deteleport_style();
    $(`div[script_id="${SCRIPT_ID}"]`).remove();
});
eventOn(getButtonEvent('卸载手机脚本'), () => {
    try {
        vueApp?.unmount?.();
    }
    catch (e) {
        console.warn(e);
    }
    deteleport_style();
    $(`div[script_id="${SCRIPT_ID}"]`).remove();
});

