// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped, ModuleConfig) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(ModuleConfig);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({18:[function(require,module,exports) {
var inserted = exports.cache = {}

function noop () {}

exports.insert = function (css) {
  if (inserted[css]) return noop
  inserted[css] = true

  var elem = document.createElement('style')
  elem.setAttribute('type', 'text/css')

  if ('textContent' in elem) {
    elem.textContent = css
  } else {
    elem.styleSheet.cssText = css
  }

  document.getElementsByTagName('head')[0].appendChild(elem)
  return function () {
    document.getElementsByTagName('head')[0].removeChild(elem)
    inserted[css] = false
  }
}

},{}],9:[function(require,module,exports) {
var Vue // late bind
var version
var map = (window.__VUE_HOT_MAP__ = Object.create(null))
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cahced together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }
      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)
      instance.$forceUpdate()
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})

},{}],12:[function(require,module,exports) {
"use strict";

var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("h1[data-v-5644a606],\nh2[data-v-5644a606] {\n  font-weight: normal;\n}\n\nul[data-v-5644a606] {\n  list-style-type: none;\n  padding: 0;\n}\n\nli[data-v-5644a606] {\n  display: inline-block;\n  margin: 0 10px;\n}\n\na[data-v-5644a606] {\n  color: #42b983;\n}\n\n.index[data-v-5644a606] {\n  text-align: center;\n}");(function () {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "index",
    mounted: function mounted() {},
    data: function data() {
      return {
        showTip: false
      };
    },

    methods: {
      showClick: function showClick() {
        this.showTip = true;
      }
    }
  };
})();
if (module.exports.__esModule) module.exports = module.exports.default;
var __vue__options__ = typeof module.exports === "function" ? module.exports.options : module.exports;
if (__vue__options__.functional) {
  console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.");
}
__vue__options__.render = function render() {
  var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "index" }, [_c('Icon', { attrs: { "type": "ios-bolt-outline", "size": "150" } }), _vm._v(" "), _c('h1', [_vm._v("Parcel-VUE")]), _vm._v(" "), _c('br'), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('br'), _vm._v(" "), _c('h3', [_vm._v("parcel-vue是全新的组件化构建开发模板，追求最零化的配置，支持vux/iview等组件框架，提供秒级开发与部署")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('Row', { attrs: { "type": "flex", "justify": "space-around" } }, [_c('Col', { attrs: { "span": "5" } }, [_c('Card', [_c('div', { staticStyle: { "text-align": "center" } }, [_c('Icon', { attrs: { "type": "ios-trash-outline", "size": "100" } }), _vm._v(" "), _c('h2', [_vm._v("零配置")]), _vm._v(" "), _c('h3', [_vm._v("完全没有单独的构建配置文件")])], 1)])], 1), _vm._v(" "), _c('Col', { attrs: { "span": "5" } }, [_c('Card', [_c('div', { staticStyle: { "text-align": "center" } }, [_c('Icon', { attrs: { "type": "hammer", "size": "100" } }), _vm._v(" "), _c('h2', [_vm._v("秒级构建")]), _vm._v(" "), _c('h3', [_vm._v("iView工程初次构建时间5s左右")])], 1)])], 1), _vm._v(" "), _c('Col', { attrs: { "span": "5" } }, [_c('Card', [_c('div', { staticStyle: { "text-align": "center" } }, [_c('Icon', { attrs: { "type": "social-nodejs", "size": "100" } }), _vm._v(" "), _c('h2', [_vm._v("毫秒级热部署")]), _vm._v(" "), _c('h3', [_vm._v("修改源码，响应时间通常1-10ms")])], 1)])], 1), _vm._v(" "), _c('Col', { attrs: { "span": "5" } }, [_c('Card', [_c('div', { staticStyle: { "text-align": "center" }, on: { "click": _vm.showClick } }, [_c('Icon', { attrs: { "type": "play", "size": "100" } }), _vm._v(" "), _c('h2', [_vm._v("快速开始")]), _vm._v(" "), _c('h3', [_vm._v("开始您的parcel-vue之旅")])], 1)])], 1)], 1), _vm._v(" "), _c('br'), _vm._v(" "), _c('Row', { directives: [{ name: "show", rawName: "v-show", value: _vm.showTip, expression: "showTip" }], attrs: { "type": "flex", "justify": "space-around" } }, [_c('Col', { attrs: { "span": "20" } }, [_c('Card', [_c('div', { staticStyle: { "text-align": "center" } }, [_c('pre', [_c('b', [_c('font', [_vm._v("npm install xserver-cli -g")])], 1), _vm._v(" "), _c('i', [_c('font', { attrs: { "color": "grey" } }, [_vm._v("安装CLI工具")])], 1)]), _vm._v(" "), _c('pre', [_c('b', [_c('font', { attrs: { "color": "#CC3333" } }, [_vm._v("x-cli parcel-vue myproject")])], 1), _vm._v(" "), _c('i', [_c('font', { attrs: { "color": "grey" } }, [_vm._v("初始化项目")])], 1)]), _vm._v(" "), _c('pre', [_c('b', [_c('font', { attrs: { "color": "green" } }, [_vm._v("cd myproject && npm run dev")])], 1), _vm._v(" "), _c('i', [_c('font', { attrs: { "color": "grey" } }, [_vm._v("启动运行")])], 1)])])])], 1)], 1), _vm._v(" "), _c('br'), _vm._v(" "), _c('br'), _vm._v(" "), _vm._m(1)], 1);
};
__vue__options__.staticRenderFns = [function render() {
  var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('h2', [_vm._v("前言：伴随着webpack越发复杂臃肿，前端"), _c('b', [_vm._v("零配置")]), _vm._v("的需求越来越高，parcel为前端构建带来了革命性的变化")]);
}, function render() {
  var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ul', [_c('li', [_c('a', { attrs: { "href": "https://github.com/cheneyweb", "target": "_blank" } }, [_vm._v("Thanks")])]), _vm._v(" "), _c('li', [_c('a', { attrs: { "href": "https://github.com/cheneyweb/parcel-vue", "target": "_blank" } }, [_vm._v("Github")])]), _vm._v(" "), _c('li', [_c('a', { attrs: { "href": "https://github.com/cheneyweb/parcel-vue", "target": "_blank" } }, [_vm._v("Support")])]), _vm._v(" "), _c('li', [_c('a', { attrs: { "href": "mailto:457299596@qq.com", "target": "_blank" } }, [_vm._v("Email")])]), _vm._v(" "), _c('br'), _vm._v(" "), _c('br'), _vm._v(" "), _c('li', [_c('a', { attrs: { "href": "http://www.xserver.top", "target": "_blank" } }, [_vm._v("Powered by XServer")])]), _vm._v(" "), _c('br'), _vm._v(" "), _c('br'), _vm._v(" "), _c('li', [_c('a', { attrs: { "href": "https://github.com/cheneyweb", "target": "_blank" } }, [_vm._v("Donate")])])]);
}];
__vue__options__._scopeId = "data-v-5644a606";
if (module.hot) {
  (function () {
    var hotAPI = require("vue-hot-reload-api");
    hotAPI.install(require("vue"), true);
    if (!hotAPI.compatible) return;
    module.hot.accept();
    module.hot.dispose(__vueify_style_dispose__);
    if (!module.hot.data) {
      hotAPI.createRecord("data-v-5644a606", __vue__options__);
    } else {
      hotAPI.reload("data-v-5644a606", __vue__options__);
    }
  })();
}
},{"vueify/lib/insert-css":18,"vue-hot-reload-api":9,"vue":5}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(config) {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    },
    data: config && config.hot
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://localhost:49523/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id, undefined, {
    hot: true
  });

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,12])