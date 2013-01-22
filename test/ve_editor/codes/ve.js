(function (window, document, undefined) {
	var ve = {
		_init: function () {
			var t = this, d = document, w = window, na = navigator, ua = na.userAgent;
			t.isOpera = w.opera && opera.buildNumber;
			t.isWebKit = /WebKit/.test(ua);
			t.isIE = !t.isWebKit && !t.isOpera && (/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName);
			t.isIE6 = t.isIE && /MSIE [56]/.test(ua);
			t.isIE9 = t.isIE && /MSIE [9]/.test(ua);
			t.isGecko = !t.isWebKit && /Gecko/.test(ua);
			t.isMac = ua.indexOf('Mac') != -1;
			t.isChrome = /Chrome.(\d+\.\d+)/i.exec(ua) || window.chrome;
			t.isAir = /adobeair/i.test(ua);
			t.ie = t.isIE && t.isIE6 && 6;
			t.baseURL = (function () {
				var sc = document.getElementsByTagName('script');
				for (var i=0; i<sc.length; i++) {
					var v = sc[i].src;
					if (v && /ve\.js/.test(v)) {
						return v;
					}
				}
				return null;
			}) ();
			t.documentBaseURL = (function () {
				var lo = window.location;
				return lo.href.replace(/[\?#].*$/, '').split('/').slice(0, -1).join('/');
			}) ();
		},

		each : function(o, cb, s) {
			var n, l;

			if (!o)
				return 0;

			s = s || o;

			if (typeof(o.length) != 'undefined') {
				// Indexed arrays, needed for Safari
				for (n=0, l = o.length; n<l; n++) {
					if (cb.call(s, o[n], n, o) === false)
						return 0;
				}
			} else {
				// Hashtables
				for (n in o) {
					if (o.hasOwnProperty(n)) {
						if (cb.call(s, o[n], n, o) === false)
							return 0;
					}
				}
			}

			return 1;
		},

		isArray: function(value){
			return Object.prototype.toString.apply(value) === '[object Array]'
		},

		grep : function(a, f) {
			var o = [], t = this;

			t.each(a, function(v) {
				if (!f || f(v))
					o.push(v);
			});

			return o;
		},

		extend : function(o, e) {
			var i, a = arguments, t = this;

			for (i=1; i<a.length; i++) {
				e = a[i];

				t.each(e, function(v, n) {
					if (typeof(v) !== 'undefined')
						o[n] = v;
				});
			}

			return o;
		},
			
		bind : function(obj, fn) {
			var slice = Array.prototype.slice,
				args = slice.call(arguments, 2);

			return function(){
				obj = obj || this;
				fn = typeof fn == 'string' ? obj[fn] : fn;
				fn = typeof fn == 'function' ? fn : function(){};
				return fn.apply(obj, args.concat(slice.call(arguments, 0)));
			};
		},

		Class : function(s, p) {
			var t = this, sp, ns, cn, scn, c, de = 0;

			// Parse : <prefix> <class>:<super class>
			s = /^((static) )?([\w.]+)(:([\w.]+))?/.exec(s);
			cn = s[3].match(/(^|\.)(\w+)$/i)[2]; // Class name

			// Create namespace for new class
			ns = t.createNS(s[3].replace(/\.\w+$/, ''));

			// Class already exists
			if (ns[cn])
				return;

			// Make pure static class
			if (s[2] == 'static') {
				ns[cn] = p;

				if (this.onCreate)
					this.onCreate(s[2], s[3], ns[cn]);

				return;
			}

			// Create default constructor
			if (!p[cn]) {
				p[cn] = function() {};
				de = 1;
			}

			// Add constructor and methods
			ns[cn] = p[cn];
			t.extend(ns[cn].prototype, p);

			// Extend
			if (s[5]) {
				sp = t.resolve(s[5]).prototype;
				scn = s[5].match(/\.(\w+)$/i)[1]; // Class name

				// Extend constructor
				c = ns[cn];
				if (de) {
					// Add passthrough constructor
					ns[cn] = function() {
						return sp[scn].apply(this, arguments);
					};
				} else {
					// Add inherit constructor
					ns[cn] = function() {
						this.base = sp[scn];
						return c.apply(this, arguments);
					};
				}
				ns[cn].prototype[cn] = ns[cn];

				// Add super methods
				t.each(sp, function(f, n) {
					ns[cn].prototype[n] = sp[n];
				});

				// Add overridden methods
				t.each(p, function(f, n) {
					// Extend methods if needed
					if (sp[n]) {
						ns[cn].prototype[n] = function() {
							this.base = sp[n];
							return f.apply(this, arguments);
						};
					} else {
						if (n != cn)
							ns[cn].prototype[n] = f;
					}
				});
			}

			// Add static methods
			t.each(p['static'], function(f, n) {
				ns[cn][n] = f;
			});

			if (this.onCreate)
				this.onCreate(s[2], s[3], ns[cn].prototype);
		},

		createNS : function(n, o) {
			var i, v;

			o = o || window;

			n = n.split('.');
			for (i=0; i<n.length; i++) {
				v = n[i];

				if (!o[v])
					o[v] = {};

				o = o[v];
			}

			return o;
		},

		resolve : function(n, o) {
			var i, l;

			o = o || window;

			n = n.split('.');
			for (i=0, l = n.length; i<l; i++) {
				o = o[n[i]];

				if (!o)
					break;
			}

			return o;
		}
	};
	ve._init();
	window.ve = ve;
}) (window, document, undefined);

/**
 * 扩展原型对象
 */
(function (v) {
	var enre = /(&|"|'|<|>)/g, 
	dere = /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
	enmap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	},
	demap = {
		'&amp;': '&', 
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#39;': "'",
		'&apos;': "'"
	};
	v.extend(String.prototype, {
		htmlencode: function () {
			return this.replace(enre, function(_0, _1) {
				return enmap[_1] || _0;
			});
		},

		htmldecode: function () {
			return this.replace(dere, function(_0, _1) {
				return demap[_1] || _0;
			});
		}
	});
}) (ve);

(function (window, document, undefined, v) {
	var is = ve.is, each = ve.each, ie = ve.isIE;
	// create script loader
	v.Class('ve.net.ScriptLoader', {
		ScriptLoader: function(config) {
			this.queue = [];
			this.allDones = [];
			this.lookup = {};
		},
		
		queue: [],

		allDones: [],

		lookup: {},

		load: function (u, conf) {
			var t = this, sc;
			var def = {
				cache: 1,
				charset: 'utf-8',
				callback: typeof conf == 'function' ? conf : (conf && conf['callback'] || function() {})
			};
			conf = ve.extend(def, conf);
			function done() {
				conf['callback'].call(document, u);
				if (sc.removeNode) sc.removeNode(true);
				else head.removeChild(sc);
			};
			sc = document.createElement('script');
			sc.setAttribute('charset', conf['charset']);
			sc.src = u;
			sc.onreadystatechange = sc.onload = function() {
				if (!sc.readyState || sc.readyState == "loaded" || sc.readyState == "complete") {
					done();
				}
			};
			var head = document.getElementsByTagName('head')[0] || document.body
			head.appendChild(sc);
		},

		loadQueue: function (fn) {
			var t = this;
			if (this.queue.length > 0) {
				var u = t.queue.shift();
				t.load(u, function () {
					t.allDones.push(u)
					t.loadQueue(fn);
				});
				return;
			}
			if (typeof fn == 'function') fn.call(t, t.allDones);
		},

		add: function (url, cb) {
			if (this.lookup[url]) return;
			this.lookup[url] = url;
			this.queue.push(url);
		}
	});

	v.Class('ve.net.CSSLoader', {
		CSSLoader: function() {},

		load: function(u, win) {
			if (!u) return;
			function _a() {
				win = win || window;
				var css = win.document.createElement('link');
				css.rel = 'stylesheet';
				css.type = 'text/css';
				css.href = u;
				head = win.document.getElementsByTagName('head')[0] || win.document.body
				head.appendChild(css);
			}
			setTimeout(_a, 0);
		}
	});
	v.ScriptLoader = new ve.net.ScriptLoader();
	v.CSSLoader = new ve.net.CSSLoader();
}) (window, document, undefined, ve);

(function (window, v) {
	var _path = (function () {
		var pl = location.href.replace(/\/[^\/]*$/, ''), base = ve.baseURL, r, baseURL;
		if (base.indexOf('/') == 0) {
			baseURL = location.protocol + '//' +  location.hostname + (location.port ? ':'+location.port : '') + base;
		}
		else if (base.indexOf('../') == 0) {
			while (base.indexOf('../') == 0) {
				r = pl = pl.replace(/\/\w+$/, '');
				base = base.replace('../', '');
			}
			base = r + '/' + base;
			baseURL = base
		}
		else if (base.indexOf(location.protocol) == 0) 
			baseURL = base;
		else 
			baseURL = pl + '/' + base;
		return baseURL;
	}) ();
	v.Class('ve.util.Path', {
		Path: function () {
			if (this.baseURL) return this;
			this.baseURL = _path;
		},

		toAbs: function (u) {
			var pl = location.href.replace(/[\?#][\s\S]+$/, ''), base = this.baseURL, r = pl;
			if (u.indexOf('../') == 0) {
				while (u.indexOf('../') == 0) {
					r = r.replace(/[\/][^\/]+$/, '');
					u = u.replace('../', '');
				}
				r = r + '/' + u;
			}
			else if (u.indexOf('://') > 0) r = u;
			else r = base.replace(/\/[\w\.]+$/, '') + '/' + u;
			return r;
		}
	});
	ve.path = new ve.util.Path();
}) (window, ve);

(function (window, document, undefined, v) {
	var each = ve.each;
	v.Class('ve.dom.Abstructor', {
		pixelStyles : /^(top|left|bottom|right|width|height|borderWidth)$/,
		
		props : {
			"for" : "htmlFor",
			"class" : "className",
			className : "className",
			checked : "checked",
			disabled : "disabled",
			maxlength : "maxLength",
			readonly : "readOnly",
			selected : "selected",
			value : "value",
			id : "id",
			name : "name",
			type : "type"
		},

		counter: 0,

		event: {}, // implements by sub class

		doc: document,

		get: function (id, context) {
			return id.nodeType && id || (context || document).getElementById(String(id));
		},

		insertHTML : function (element, where, html) {
			if (element.insertAdjacentHTML) {
				element.insertAdjacentHTML(where, html);
			} 
			else if (typeof HTMLElement != "undefined" && !window.opera) {
				var range = element.ownerDocument.createRange();
				range.setStartBefore(element);
				var fragment = range.createContextualFragment(html);
				switch(where.toLowerCase()){
					case "beforebegin" :
						element.parentNode.insertBefore(fragment, element);
						break;
					case "afterbegin" :
						element.insertBefore(fragment, element.firstChild);
						break;
					case "beforeend" :
						element.appendChild(fragment);
						break;
					case "afterend" :
						if (!element.nextSibling) {
							element.parentNode.appendChild(fragment);
						} else {
							element.parentNode.insertBefore(fragment, element.nextSibling);
						}
						break;
				}
			}
			return {
				beforebegin: element.previousSibling,
				afterbegin: element.firstChild,
				beforeend: element.lastChild,
				afterend: element.nextSibling
			}[where];
		},
		
		getStyle : function(n, na, c) {
			var isIE = ve.isIE;
			n = this.get(n);

			if (!n)
				return false;

			// Gecko
			if (this.doc.defaultView && c) {
				// Remove camelcase
				na = na.replace(/[A-Z]/g, function(a){
					return '-' + a;
				});

				try {
					return this.doc.defaultView.getComputedStyle(n, null).getPropertyValue(na);
				} catch (ex) {
					// Old safari might fail
					return null;
				}
			}

			// Camelcase it, if needed
			na = na.replace(/-(\D)/g, function(a, b){
				return b.toUpperCase();
			});

			if (na == 'float')
				na = isIE ? 'styleFloat' : 'cssFloat';

			// IE & Opera
			if (n.currentStyle && c)
				return n.currentStyle[na];

			return n.style[na];
		},

		setStyle : function(n, na, v) {
			var t = this, e = n, isIE = ve.isIE;
			s = e.style;

			// Camelcase it, if needed
			na = na.replace(/-(\D)/g, function(a, b){
				return b.toUpperCase();
			});
			// Default px suffix on these
			if (t.pixelStyles.test(na) && (typeof v == 'number' || /^[\-0-9\.]+$/.test(v)))
				v += 'px';

			switch (na) {
				case 'opacity':
					// IE specific opacity
					if (isIE) {
						s.filter = v === '' ? '' : "alpha(opacity=" + (v * 100) + ")";

						if (!n.currentStyle || !n.currentStyle.hasLayout)
							s.display = 'inline-block';
					}

					// Fix for older browsers
					s[na] = s['-moz-opacity'] = s['-khtml-opacity'] = v || '';
					break;

				case 'float':
					isIE ? s.styleFloat = v : s.cssFloat = v;
					break;
				
				default:
					try {
						s[na] = v || '';	
					} catch(e){
						console.log('setstyle',e, s, na);
					}
			}
		},

		setStyles: function(el, styles) {
			var t = this, dom = ve.DOM, each = ve.each;
			each(styles, function(n, i) {
				dom.setStyle(el, i, n);
			});
		},

		create: function (n, a, h, p) {
			var t = this, e = n, k;
			e = typeof n == 'string' ? t.doc.createElement(n) : n;
			t.setAttrs(e, a);
			if (h) {
				if (h.nodeType)
					e.appendChild(h);
				else
					t.setHTML(e, h);
			}

			return p && p.nodeType ? p.appendChild(e) : e;
		},

		getParents: function (e, f) {
			var na;
			if (typeof f == 'string') {
				na = f;
				if (f === '*') {
					f = function (n) {
						return n.nodeType == 1;
					}
				}
				else {
					f = function (n) {
						return n.nodeType == 1 && n.nodeName.toLowerCase() == na.toLowerCase();
					}
				}
			}
			if (typeof f != 'function') return e;
			while (e){
				if (e.nodeName == 'BODY') break;
				if (f(e)) break;
				e = e.parentNode;
			}
			return (typeof na == 'string' && na != '*') ? (e.nodeName.toLowerCase() == na.toLowerCase() && e) : e;
		},

		setAttr: function(e, n, v) {
			var t = this;	
			switch (n) {
				case "style":
					if (typeof v != 'string') {
						each(v, function(v, n) {
							t.setStyle(e, n, v);
						});

						return;
					}
					e.style.cssText = v;
					break;

				case "class":
					e.className = v || ''; // Fix IE null bug
					break;
				default:
					e.setAttribute(n, v);
					break;
			}
		},

		setAttrs : function(e, o) {
			var t = this;
			each(o, function(v, n) {
				t.setAttr(e, n, v);
			});
		},

		uniqueId: function () {
			return 'veEditorControl_' + this.counter++;
		},

		setHTML: function (e, h) {
			if (!e) return;
			e.innerHTML = h;
		},

		isHidden: function (e) {
			return !e || e.style.display == 'none' || this.getStyle(e, 'display') == 'none';
		},
		
		isBlock : function(n) {
			if (n.nodeType && n.nodeType !== 1)
				return false;

			n = n.nodeName || n;

			return /^(H[1-6]|HR|P|DIV|ADDRESS|PRE|FORM|TABLE|LI|OL|UL|TR|TD|CAPTION|BLOCKQUOTE|CENTER|DL|DT|DD|DIR|FIELDSET|NOSCRIPT|NOFRAMES|MENU|ISINDEX|SAMP)$/.test(n);
		},

		hasClass: function (n, c) {
			return n && c && new RegExp('\\b' + c + '\\b').test(n.className);
		},
		
		addClass: function (n, c) {
			if (this.hasClass(n, c)) return;
			n.className += (n.className.length > 0 ? ' ' : '') + c
		},

		removeClass: function (n, c) {
			n.className = n.className.replace(new RegExp('\\s*' + c + '\\s*', 'g'), ' ').replace(/^\s+|\s+$/g, '');
		},

		processHTML: function (html) {
			return '';
		}
	});

	v.Class('ve.dom.EventManager', {
		EventManager: function () {
			this.list = [];
		},

		addFirst: function (fn) {
			this.list.unshift(fn);
		},

		add: function (fn) {
			this.list.push(fn);
		},

		fire: function () {
			var a = arguments, r;
			ve.each(this.list, function (fn) {
				r = fn.apply(a[0] || this, Array.prototype.slice.call(a, 1));
			});
			return r;
		},
		
		fireRecursive: function(){
			var scope = arguments[0] || this,
				arg = Array.prototype.slice.call(arguments, 1),
				ret = null;
			ve.each(this.list, function (fn, idx) {
				ret = fn.apply(scope, arg);
				if(ret === undefined){
					ret = arg;
					//throw('函数onSetContent为空 debugger;var test = fn(); ');
				} else if(v.isArray(ret)){
					arg = ret;
				} else {
					arg = [ret];
				}
			});
			return ret;
		},

		remove: function(fn) {
			var t = this;
			ve.each(this.list, function (f, i) {
				if (fn == f) {
					t.list.splice(i, 1);
					return false;
				}
			});
		}
	});

}) (window, document, undefined, ve);

(function (window, document, undefined, v) {
	// editor manager, like style,css,color 
	v.Class('ve.editor.PluginManager', {
		lookup: {},
		urls: {},
		PluginManager: function () {},
		scriptLoader: new ve.net.ScriptLoader(),
		
		add: function (n, u, cb) {
			var pu = n;
			if (this.urls[u || n]) 
				return;
			if (typeof u == 'function') cb = u;
			if (!/^https?\:\/\//.test(n)) { // external plugin
				pu = 'plugins/' + (u || n) + '/plugin.js';
			}
			var url = new ve.util.Path().toAbs(pu);
			this.urls[u || n] = url;
			this.scriptLoader.add(url, cb || function() {});
		},

		loadAll: function (fn) {
			this.scriptLoader.loadQueue(fn);
		},

		register: function (n, t) {
			t = typeof t == 'string' ? v.resolve(t): t;
			this.lookup[n] = t;
		}
	});
	ve.plugin = new ve.editor.PluginManager();
}) (window, document, undefined, ve);

(function (window, document, undefined, v) {
	// editor manager, like style,css,color 
	var each = ve.each, extend = ve.extend;
	/**
	 * 编辑器静态工厂，对参数进行一次预处理后传入编辑器具体类
	 * @author adv
	 */
	v.Class('static ve.editor.EditorManager', {
		/**
		 * 编辑器列表，get方法的数据源，存放已经初始化成功的编辑器对象
		 */
		list: [],

		/**
		 * 检索映射表
		 */
		lookup: {},

		/**
		 * popupdialog的全局引用
		 */
		popupEditor: null, // popup dialog for editor

		/**
		 * 初始化入口方法，这是一个递归调用的方法。这里进行了参数的重新组织
		 * @author adv
		 * @param {Object} conf 编辑器初始化配置参数
		 *			conf.elements 必选参数，被初始化的元素列表，这里可以是textarea和任意的html元素
		 *			conf.toolbarContainers 可选参数，如果指定了该参数，则和elements的顺序想对应，可以是一个函数定义的迭代器
		 *			conf.inputContainers 可选参数，如果指定了该参数，则和elements的顺序想对应，可以是一个函数定义的迭代器
		 *			conf.statusContainers 可选参数，如果指定了该参数，则和elements的顺序想对应，可以是一个函数定义的迭代器
		 *			conf.with 编辑器的width值
		 *			conf.height 编辑器的height值这里指的是编辑区的height值
		 *			conf.newling_tag 换行元素
		 *			conf.autoAdjust 是否自动调整高度
		 *			conf.is_shortcut 是否启用用户热键
		 *			conf.undo_redo 是否启用undo/redo操作
		 *			conf.adapter 适配器，可以是一个远程的适配器
		 *			conf.viewer 表现控制器，引入用户自定义的一些css和进行自定义布局
		 ×			conf.plugins 编辑器引入的插件，有固有的语法结构
		 *				#1 单个插件形式 'test1,test2,test3'
		 *				#2 插件包形式 'test(t1+t2+t3)' 引入test插件包（目录）下的t1,t2等插件
		 ×				#3 混合型是 #1，#2的混合引入
		 *				#4 远程插件 http://host/<dir>/test.js 引入远程插件并按文件名来命名插件
		 *				#5 远程插件 http://host/<dir>/plugin.js(test+test2) 引入远程插件包中的插件
		 *				#6 以上情形的任意组合
		 *			conf.language 需要导入的外部语言包（尚未实现）
		 *			conf.defaultValue 编辑器的初始值
		 */
		init: function(conf) {
			var t = this, r, iterator;
			iterator = function(i, s, d) {
				if (typeof conf[s] == 'undefined') return;
				if (typeof conf[s] == 'string')
					conf[d] = conf[s];
				else if (conf[s].constructor == Array) {
					conf[d] = conf[s][i];
				}
				else if (typeof conf[s] == 'function') {
					conf[d] = conf[s](i);
				}
			};
			if (r = conf.renderTo) {
				if (document.getElementById(r)) r = conf.renderTo;
			}
			else if (conf.elements) {
				for (var i=0; i<conf.elements.length; i++) {
					var el = conf.elements[i];
					if (typeof el == 'string')
						el = document.getElementById(conf.elements[i]);
					if (!el.nodeType) continue;
					iterator(i, 'toolbarContainers', 'toolbarContainer');
					iterator(i, 'inputContainers', 'iframeContainer');
					iterator(i, 'statusbarContainers', 'statusbarContainer');
					
					if (el.nodeName == 'TEXTAREA') {
						el.style.display = 'none';
						el.setAttribute('veeditor', 1);
						var div = document.createElement('div');
						div.className = 'textarea_con textarea' + el.id + '_con';
						el.parentNode.insertBefore(div, el);
						veEditor.init(ve.extend({
							renderTo: div, 
							defaultValue: el.value,
							veID: el.id
						}, conf));
					}
					else {
						veEditor.init(ve.extend({
							renderTo: el,
							veID: el.id
						}, conf));
					}
				}
			}
			if (!r) return;
			conf = v.extend({
				id: conf['veID'] || 've' + [parseInt(Math.random() * 1000000), new Date().getTime()].join(''),
				height: '400'
			}, conf);
			
			function _init(t) {
				var editor = new ve.Editor(conf);
				editor.init();
				t.add(editor);
			}
			if (t.list.length == 0) {
				_init(t);
			}
			else {
				t.list[t.list.length - 1].onInitComplete.add(function () {
					(function(t) {
						setTimeout(function() {_init(t);}, 0);
					}) (t);
				})
			}
		},

		add: function (editor) {
			this.list.push(editor);
			this.lookup[editor.conf.veID || editor.id] = editor;
		},

		get: function (id) {
			return this.lookup[id];
		}
	});
	window.veEditor = ve.editor.EditorManager;
}) (window, document, undefined, ve);

(function (window, document, undefined, v) {
	v.Class('ve.editor.ViewManager', {
		lookup: {},
		
		urls: {},

		register: function (n, t) {
			t = typeof t == 'string' ? v.resolve(t): t;
			this.lookup[n] = t;
		}
	});
	v.viewManager = new ve.editor.ViewManager();

	v.Class('ve.editor.ViewControler', {
		ViewControler: function () {},

		renderUI: function () {
		}
	});

	v.Class('ve.editor.ToolbarManager', {
		lookuptoolbars: {},
		ToolbarManager: function(ed, conf) {
			this.editor = ed;
			this.conf = conf;
			this.toolbarContainer = ed.toolbarContainer;
		},

		init: function(grep) {
			if (typeof grep != 'function')
				grep = function() {return true;};
			var t = this;
			ve.each(t.lookuptoolbars, function (n) {
				n.renderTo(t.toolbarContainer || t.editor.toolbarContainer);
				ve.each(n.controls, function (m) {
					var b = grep (m);
					if (b === false)
						return;
					m.renderTo(n.dom);
				});
			});
		},

		getContainer: function(name) {
			return 
		},

		createContainer: function() {
//			this.conf = ve.extend({
//				width: '100%'
//			}, this.conf || {});

			return dom.create('div', {'class': this.conf['class'], 'style': {'overflow':'hidden',width: this.conf.width}}); // toolbar container

		},
		
		addToolbar: function (tb) {
			var t = this.editor, id = tb.id;
//			t.toolbars.push(tb);
			this.lookuptoolbars[id] = tb;
		},

		getToolbar: function(id) {
			var t = this.editor;
			return this.lookuptoolbars[t.conf.id + '_' + id];
		},

		addButton: function (n, s) {
			var t = this.editor, cm = t.controlManager, b;
			s = s || {};
			s.onclick = function () {
				t.commands[s.cmd].call(this, b.dom, b);
			}
			b = cm.createButton(n, s);
			this.addControl(b, s);
		},
	
		getButton: function (c) {
			return this.getControl(c);
		},

		addControl: function(c, s) {
			var t = this.editor, to = s.to, cons, toolbardom, cm = t.controlManager, oldlength, where = 'afterbegin';
			s = s || {};
			if (!this.lookuptoolbars[t.id + '_' + to]) {
				var tb = cm.createToolbar(to, {'class': 've' + to + '_toolbar'});
				tb.renderTo(this.editor.toolbarContainer);
				this.lookuptoolbars[t.id + '_' + to] = tb;
			}
			
			cons = this.lookuptoolbars[t.id + '_' + to].controls;
			if (typeof s.at == 'undefined' )
				s.at = cons.length;
			toolbardom = this.lookuptoolbars[t.id + '_' + to].dom;
			c.renderTo(toolbardom, 'before', cons[s.at] && cons[s.at].dom);
			cons.splice(s.at, 0, c);
		},

		getControl: function(c) {
			var t = this.editor;
			for (var i in this.lookuptoolbars) {
				for (var j = 0; j < this.lookuptoolbars[i].controls.length; j++) {
					if (c == this.lookuptoolbars[i].controls[j].conf.cmd)
						return this.lookuptoolbars[i].controls[j];
				}
			}
		}
	});
}) (window, document, undefined, ve);

(function (window, document, undefined, v) {
	// editor manager, like style,css,color 
	var pluginsyntax = /^([\s\S]+?(?:(\w+)\.js|\(|,|$))\(?([^\)]*)\)?$/;
	v.Class('ve.Editor', {
		Editor: function (conf) {
			var t = this;
			t.id = t.editorId = conf.id;
			t.toolbarlist = {};
			t.buttons = {};
			t.lookuptoolbars = {};
			t.commands = {};
			t.initComplete = 0;
			t.shortcuts = {};
			t.conf = ve.extend({
				plugins: '',
				toolbarContainer: '',
				iframeContainer: '',
				statusbarContainer: '',
				language: 'cn',
				adapter: 'def',
				viewer: 'def',
				editorCss: '',
				tab4space: 4,
				newline_tag: 'p',
				undo_redo: 1,
				is_shortcut: 1,
				popupdialog_provider: 'def',
				mode: 'elements',
				styleWithCSS: 0,
				defaultValue: ''
			}, conf);
			ve.each(['onInit', 'onKeyPress', 'onKeyDown', 'onKeyUp', 'onMouseOver', 'onMouseDown', 'onClick', 'onBeforeExecCommand', 'onExecCommand', 'onInitComplete', 'onActive', 'onUnActive', 'onSelectContent', 'onUIRendered', 'onBlur', 'onFocus', 'onBeforeOpenListBox', 'onGetContent', 'onSetContent', 'onSaveContent', 'onPaste', 'onResize', 'onPluginsInited', 'onIframeLoaded'], function(n) {
				t[n] = new ve.dom.EventManager(t);
			});
		},
		
		preInited: false, 

		preInit: function () {
			var t = this, pls = t.conf['plugins'], adapter, viewsr, scloader = new ve.net.ScriptLoader();
			function allDone(s) {
				if (!pls) {
					t.init();
					return;
				}
				var re = pluginsyntax, di, na, fname;
				
				v.each(pls.split(','), function (n) {
					var ma = n.match(re);
					ma = ma || [];
					di= ma[1].replace(/\(/, '');
					fname = ma[2] || di;
					na = ma[3];
					if (na.indexOf('+') >= 0) {
						var sp = na.split('+');
						// 插件包形式
						if (sp.length) { 
							if (ve.plugin.lookup[sp[0]]) // plugin package has been loaded
								return; 
							else {
								ve.plugin.add(di, fname);
							}
						}
						else { // 单个插件形式
							ve.plugin.add(na, fname);
						}
					}
					else {
						ve.plugin.add(di, di);
					}
					
				});
				if (ve.plugin.urls[di] && !ve.plugin.scriptLoader.queue.length) {
					setTimeout(function() {t.init();}, 1000);
					return;
				}
				ve.plugin.loadAll(function () {
					t.init();
				});
			}
			adapter = /^https?\:\/\//.test(t.conf.adapter) && t.conf.adapter || ('adapters/' + t.conf.adapter + '.adapter.js');
			var a = new ve.util.Path().toAbs(adapter);
			scloader.add(a);
			viewsr = /^https?\:\/\//.test(t.conf.viewer) && t.conf.viewer || ('view/' + t.conf.viewer + '/view.js');
			if (!ve.viewManager.lookup[t.conf.viewer]) {
				a = new ve.util.Path().toAbs(viewsr);
				t.conf.viewer = t.conf.viewer.split('/').pop().replace(/\.js/, '');
				scloader.add(a);
			}
			t.preInited = true;
			if (scloader.queue.length > 0) 
				scloader.loadQueue(allDone);
			else {
				allDone('local');
			}
		},

		init: function() {
			var t = this, pls = t.conf['plugins'], plm = ve.plugin, dom = ve.DOM, editorContainer, w, d, canInit, u, isIE = ve.isIE;
			if (!t.preInited) {
				t.preInit();
				return;
			}
			t.toolbarManager = new ve.editor.ToolbarManager(t, {name: 'default'});
			t.toolbarlist['default'] = t.toolbarManager;
			t.controlManager = new ve.editor.ControlManager(t);
			var view = ve.viewManager.lookup[t.conf.viewer];
			if (!view) 
				return;
			t.viewControl = new view();
			t.viewControl.init(t, t.conf.viewer);
			var render = t.viewControl.renderUI(t);
			t.toolbarManager.toolbarContainer = t.toolbarContainer;
			t.iframeHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
			if (veEditor.domain) {
				if (isIE) u = 'javascript:(function(){document.open();document.domain = "' + document.domain + '";var ed = window.parent.veEditor.get("' + t.conf.veID + '");document.write(ed.iframeHTML);document.close();ed.initIframe();})()';
				t.iframeHTML += '<script type="text/javascript">document.domain = "' + veEditor.domain + '";</script>';
			}
			if (ve.isIE && !veEditor.domain) {
				u = 'javascript:(function(){document.open();var ed = window.parent.veEditor.get("' + t.conf.veID + '");document.write(ed.iframeHTML);document.close();})()';
				t.iframeHTML += '</head><body onload="(function() {var ed = parent.veEditor.get(\'' + t.conf.veID + '\'); ed.initIframe();}) ();"></body></html>';
			} 
			else {
				t.iframeHTML += '</head><body></body></html>';
			}
			if (t.conf.renderTo) {
				editorContainer = dom.get(t.conf.renderTo); 
				if (editorContainer) {
					canInit = 1;
					dom.setStyle(t.editorContainer, 'width', this.conf.width);
					editorContainer.appendChild(t.editorContainer);
				}
			}
			
			if (!canInit) return;
			
			t.toolbarManager.init();

			var ifr = t.iframeElement = dom.create('iframe', {
				id: t.conf.id + '_Iframe',
				src: u || 'javascript:;',
				frameBorder: '0',
				allowtransparency: 'true',
				allowTransparency: 'true',
				style: {
					width : '100%',
					height : '100%'
				}
			});
			t.iframeContainer.appendChild(ifr);
			t.onUIRendered.fire();
			t.undoManager = new ve.editor.UndoManager(t);
			
			t.popupDialog = new ve.ui.PopupDialogManager(t, ve.extend(ve.popupConfig || {}, {
				provider: t.conf.popupdialog_provider,
				resizable: t.conf.popupdialog_resizable,
				titlebar: t.conf.titlebar,
				draggable: t.conf.popupdialog_draggable
			}));
			dom.event.add(ifr, 'load', function() {
//				if (this.readyState == 'complete')
				t.onIframeLoaded.fire(ifr);
			});
			if (!isIE || !veEditor.domain)
				t.initIframe();
			

			// 获取插件包url或插件名
			// #1 http://xxx/a.js(a+b+c);
			// #2 t(a+b+c)
			// #3 a,b,c
			// #4 #1,2,3的组合
			var re = pluginsyntax, c, o, url = {}, ppc = [], matches; 
			if (pls) {
				v.each(pls.split(','), function (n) {
					matches = n.match(re);
					if (/^https?/.test(matches[1]) && matches[2] != 'plugin') matches[3] = matches[2];
					if (matches[3]) {
						ppc = ppc.concat(matches[3].split('+'));
						url[matches[1].replace(/\(/g, '') || matches[3]] = matches[3] || matches[1];
					}
					else {
						ppc.push(n);
						url[n] = n;
					}
				});
			}
			v.each(url, function (n, i) {
				ve.each(n.split('+'), function (m) {
					url[m] = i;
				});
			});
			
			v.each(ppc, function (n, i) {
				var c = plm.lookup[n], o;
				if (c) {
					
					o = new c();
					if (o.init) {
						o.init(t, /^https?/.test(url[n]) ? url[n] : ('plugins/' + url[n]));
					}
				}
			});

			t.onInitComplete.fire(t);
			// 所有插件init调用完毕后触发onPluginsInited事件
			t.onPluginsInited.fire(t);

			return t;
		},

		initIframe: function () {
			var t = this, s = t.conf, w = t.getWin(), d = t.getDoc(), dom = ve.DOM, isIE = ve.isIE, isOpera = ve.isOpera, isGecko  = ve.isGecko;
			if (!d.body) {
				window.setTimeout(function(){t.initIframe();}, 0);
				return;
			}
			if (!isIE) {
				d.open();
				d.write(t.iframeHTML);
				setTimeout(function() {d.close();}, 0);
				d.body.innerHTML = 'initing...';
				d.designMode = 'Off';
				d.designMode = 'On';
			}

			if (isIE) {
				d.body.contentEditable = true;
			}
			t.selection = new ve.editor.Selection(w, d);
			t.editorcommands = new ve.editor.EditorCommands(t);
			
			d.body.innerHTML = t.conf.defaultValue;
			t.onInit.fire();
			
			if (!t.styleWithCSS) {
				try {
					d.execCommand("styleWithCSS", 0, false);
				} catch (e) {
					try {
						d.execCommand("useCSS", 0, true);
					} catch (e) {
					}
				}
			}
			// 注册默认热键
			if (t.conf.is_shortcut) {
				t.addShortcut('ctrl+b', 'Bold');
				t.addShortcut('ctrl+i', 'Italic');
				t.addShortcut('ctrl+u', 'Underline');
				t.addShortcut('ctrl+alt+l', 'justifyleft');
				t.addShortcut('ctrl+alt+c', 'justifycenter');
				t.addShortcut('ctrl+alt+r', 'justifyright');
				t.addShortcut('ctrl+z', 'undo');
				t.addShortcut('ctrl+y', 'redo');
				t.addShortcut('ctrl+s', 'saveContent');
			}

			// 启用undo/redo操作
			if (t.conf.undo_redo) { // 用户可以进行撤销/恢复操作
				t.undoManager.add(); // 记录初始状态
				t.onKeyUp.add(function(e) { // 正常输入计入undo列表
					if (e.ctrlKey && e.keyCode == 90) // ctrl+z 
						return;
					t.undoManager.typing = 1;
					t.undoManager.add();
				});
			}
			
			if (!isIE) {
				t.onSetContent.add(function() {
					setTimeout(function() {
						t.resize();
					}, 1000);
				});
			}
			
			t._addEvents();
//			if (s.newline_tag == 'br') {
//				if (isIE) {
//					t.onKeyPress.add(function(e) {
//						var n, s = t.selection;
//
//						if (e.keyCode == 13 && s.getNode().nodeName != 'LI') {
////							debugger;
//							s.setContent('<br id="__" />');
//							n = dom.get('__', d);
//							n.removeAttribute('id');
//							s.select(n);
//							s.collapse(1);
//							return dom.event.cancel(e);
//						}
//					});
//				}
//			}
//			else if (s.newline_tag == 'p' || s.newline_tag == 'div') {
//				if (!isIE) {
//					d.body.innerHTML = '<' + s.newline_tag + '>' + t.conf.defaultValue + '</' + s.newline_tag + '>';
//					t.onKeyPress.add(function(e) {
//						if (e.keyCode == 13 && !e.shiftKey) {
//							if (!t.insertPara(e))
//								dom.event.cancel(e);
//						}
//					});
//
//					if (isGecko) {
//						t.onKeyDown.add(function(e) {
//							if ((e.keyCode == 8 || e.keyCode == 46) && !e.shiftKey) {
//								t.backspaceDelete(e, e.keyCode == 8);
//							}
//						});
//					}
//				}
//			}
//			w.blur();
			setTimeout(function() {t.focus();}, 0);
		},

		createLayout: function () {
			var t = this, dom = ve.DOM, ec, ic, tc, sc;
			t.editorContainer = ec = dom.create('div', {'class': 'veEditorContainer', id: t.conf.id + 'Container'}); 
			t.toolbarContainer = dom.create('div', {'class':'veToolbarContainer', 'style': {'overflow':'hidden',width: t.conf.width}}); // toolbar container
			t.iframeContainer = dom.create('div', {'class': 'veIframeContainer', 'style': {width: t.conf.width, height: t.conf.height}});
			t.statusbarContainer = dom.create('div', {'class': 'veStatusbarContainer', 'style': {'overflow':'hidden',width: t.conf.width}});
			ve.each(['toolbarContainer', 'iframeContainer', 'statusbarContainer'], function(n) {
				var el = dom.get(t.conf[n]);
				 (el || ec)['appendChild'](t[n])
			});
			// 保存toolbarcontainer
//			if (tc = dom.get(t.conf['toolbarContainer']))
//				t.toolbarContainer = tc;
			return {
				editorContainer: ec,
				toolbarContainer: tc || t.toolbarContainer,
				iframeContainer: ic || t.iframeContainer,
				statusbarContainer: sc || t.statusbarContainer
			};
		},

		// 使用新的toolbar替换现有的toolbar
		switchToolbar: function(nt, grep) {
			// 已经存在则放回
			if (typeof nt == 'string')
				nt = this.toolbarlist[nt];
			if (!this.toolbarlist[nt.conf.name]) {
				dom.setStyle(this.toolbarContainer, 'display', 'none');
				var tc = nt.createContainer();
				nt.toolbarContainer = tc;
				this.toolbarContainer.parentNode.insertBefore(tc, this.toolbarContainer);
				this.toolbarContainer = tc;
				this.toolbarlist[nt.conf.name] = nt;
				nt.init(grep);
				
			}
			else {
				dom.setStyle(this.toolbarContainer, 'display', 'none');
				dom.setStyle(this.toolbarlist[nt.conf.name].toolbarContainer, 'display', 'block');
				this.toolbarContainer = this.toolbarlist[nt.conf.name].toolbarContainer;
				dom.setHTML(this.toolbarlist[nt.conf.name].toolbarContainer, '');
				nt.init(grep);
			}			
		},

		setStatus: function(html) {
			this.statusbarContainer.innerHTML = html;
		},

		showStatusbar: function(html, f, animateconf) {
			this.setStatus(html);
			dom.setStyle(this.statusbarContainer, 'display', 'block');
			if (ve.ui.Animate && f) {
				ve.ui.Animate.run(animateconf || {
					obj: this.statusbarContainer,
					time: 300,
					step: 5,
					expr: 'opacity[0-1];marginTop[-' + this.statusbarContainer.offsetHeight + '-0]'
				})
			}
		},

		hideStatusbar: function(f, animateconf) {
			var t = this;
			if (ve.ui.Animate && f) {
				ve.ui.Animate.run(animateconf || {
					obj: t.statusbarContainer,
					time: 300,
					step: 5,
					complete: function() {
						dom.setStyle(t.statusbarContainer, 'display', 'none');
					},
					expr: 'opacity[1-0];marginTop[0--' + this.statusbarContainer.offsetHeight + ']'
				})
			}
			else 
				dom.setStyle(t.statusbarContainer, 'display', 'none');
		},

		focus: function () {
			var oed, t = this, isIE = ve.isIE, isIE9 = ve.isIE9, s = t.selection, r, w = t.getWin(), d = t.getDoc(), b = t.getBody();
			// 存在bookmark直接定位
			if (t.bookmark) {
				w.focus();
				s.moveToBookmark(t.bookmark);
			}
			else {
				r = s.getRng();
				// 将光标置于结尾处
				if (isIE) {
					var begin, end;
					r =  b.createTextRange();
					begin = end = r.text.length;
					r.moveStart('character', begin);
					r.moveEnd('character',  end);
					r.select();
				}
				else {
					w.focus();
					// firefox等浏览器下创建一个临时节点来辅助定位光标
					b.innerHTML += '<span id="__caret">_</span><br/>';
//					r = s.getRng();
					r.setStartBefore(dom.get('__caret', d));
					r.setEndAfter(dom.get('__caret', d));
					s.getSel().addRange(r);
					dom.remove(d.getElementById('__caret'));
				}
			}
			t.onFocus.fire(t);
		},

		getWin: function () {
			return window.frames[this.conf.id + '_Iframe'] || document.getElementById(this.conf.id + '_Iframe').contentWindow;
		},

		getDoc: function () {
			var w = this.getWin();
			return w.contentDocument || w.document;
		},

		getBody: function () {
			return this.getDoc().body;
		},

		addToolbar: function (tb) {
//			var t = this, id = tb.id;
//			t.toolbars.push(tb);
			this.toolbarManager.addToolbar(tb);//[id] = tb;
		},

		getToolbar: function(id) {
//			var t = this;
			
			return this.toolbarManager.getToolbar(id);//[t.conf.id + '_' + id];
		},

		addButton: function (n, s) {
//			var t = this, cm = t.controlManager, b;
//			s = s || {};
//			s.onclick = function () {
//				t.commands[s.cmd].call(this, b.dom, b);
//			}
//			b = cm.createButton(n, s);
//			this.toolbarManager.addControl(b, s);
			this.toolbarManager.addButton(n, s);
		},

		getButton: function (c, tb) {
			return this.toolbarlist[tb || 'default'].getControl(c);
		},

		addControl: function(c, s) {
//			var t = this, to = s.to, cons, toolbardom, cm = t.controlManager, oldlength, where = 'afterbegin';
//			s = s || {};
//			if (!t.lookuptoolbars[t.id + '_' + to]) {
//				var tb = cm.createToolbar(to, {'class': 've' + to + '_toolbar'});
//				tb.renderTo(t.toolbarContainer);
//				t.lookuptoolbars[t.id + '_' + to] = tb;
//			//	return;
//			}
//			cons = t.lookuptoolbars[t.id + '_' + to].controls;
//			toolbardom = t.lookuptoolbars[t.id + '_' + to].dom;
//			c.renderTo(toolbardom, 'beforeend');
//			cons.splice(s.at || cons.length, 0, c);
			this.toolbarManager.addControl(c, s);
		},

		getControl: function(c) {
			return this.toolbarManager.getControl(c);
//			var t = this;
//			for (var i in t.lookuptoolbars) {
//				for (var j = 0; j < t.lookuptoolbars[i].controls.length; j++) {
//					if (c == t.lookuptoolbars[i].controls[j].conf.cmd)
//						return t.lookuptoolbars[i].controls[j];
//				}
//			}
		},

		addCommand : function(n, f, s) {
			var t = this;
			t.commands[n] = function () {
				var arg = [t].concat(Array.prototype.slice.call(arguments, 0));
//				t.bookmark = t.selection.getBookmark();
				f.apply(s || t, arg);
			};
		},

		setToolbarState: function (f) {
			f = f || false;
			var t = this, dom = ve.DOM, s = dom.getSize(t.toolbarContainer), d;

			if (dom.get('ve' + t.conf.id + 'ToolbarMask')) {
				d = dom.get('ve' + t.conf.id + 'ToolbarMask');//dom.removeClass(d, 'hidden');
			}
			else {
				d = dom.create('div', {
					id: 've' + t.conf.id + 'ToolbarMask',
					'style': {
						'position':'absolute',
						'top':0,
						'left':0,
						'width': s[0],
						'height': s[1],
						'backgroundColor':'#cccccc',
						'overflow':'hidden',
						'opacity':0.3
					}
				});
				t.toolbarContainer.appendChild(d);
			}
			t.toolbarState = f;
			dom[f && 'addClass' || 'removeClass'](d, 'hidden');
		},

		addShortcut: function (p, cmd_fun) {
			var t = this, fn;
			if (typeof cmd_fun == 'function') {
				fn = cmd_fun;
			}
			else if (typeof t.editorcommands[cmd_fun] == 'function') {
				fn = function() {
					t.editorcommands[cmd_fun].call(t.editorcommands);
					return false;
				}
			}
			else if (t.editorcommands.browserCommands.indexOf(cmd_fun) > -1) {
				fn = function() {
					t.editorcommands.execCommand(cmd_fun, false, null);
					return false;
				}
			}

			if (typeof fn == 'function') {
				var k = p.split('+'), o;
				o = {
					fn: fn,
					alt: 0,
					ctrl: 0,
					shift: 0
				};
				ve.each(k, function (v) {
					switch (v) {
						case 'alt':
						case 'ctrl':
						case 'shift':
							o[v] = true;
							break;

						default:
							o.charCode = v.charCodeAt(0);
							o.keyCode = v.toUpperCase().charCodeAt(0);
							break;
					}
				});
				t.shortcuts[p] = o;
			}
		},

		setContent: function (param) {
			var t = this, s = t.selection, con;
			t.focus();
			if(typeof(param) == 'string'){
				con = param;
			} 
			else if(param.useParser) {
				con = t.onSetContent.fireRecursive(t, param.content);
			}
			con = con === undefined ? param.content : con;
			s.setContent(con);
		},

		getContent: function (s) {
			var t = this, r, rr; 
			s = s || {format: 'html'};
			r = t.getBody().innerHTML;
			if (s.format != 'html') 
				r = r.replace(/<\w[\s\S]*?>|<\/\w+>/g, '');
			rr = t.onGetContent.fire(t, r);
			if (typeof rr == 'undefined')
				return r;
			return rr;
		},

		clearContent: function() {
			this.getBody().innerHTML = '';
			this.undoManager.add();
			this.focus();
		},
		
		getSelection: function () {
			var t = this, s = t.selection;
			return s.getContent();
		},

		resize: function() {
			var t = this, w = t.getWin(), d = t.getDoc(), b = t.getBody();
			var h = Math.max(t.conf.height, d.documentElement.offsetHeight) + 'px',
				w = Math.max(t.conf.width, d.documentElement.offsetWidth) + 'px';
			function _s(w, h) {
				t.getBody().style.height = h;
				t.iframeContainer.style.height = h;
				t.iframeElement.style.height = h;
				if (parseInt(h) > t.conf.height){
					t.getBody().style.height = '100%';
				}
			}
			w = Math.max(t.conf.width, d.documentElement.offsetWidth);
			h = Math.max(t.conf.height, d.documentElement.offsetHeight);
			_s(w + 'px', h + 'px');
		},

		_addEvents: function () {
			var t = this, w = t.getWin(), d = t.getDoc(), b = t.getBody(), rb, isIE = ve.isIE, r = t.selection.getRng(), s = t.selection.getSel(), bookmark;
			var dom = ve.DOM;
			function _eventHandler() {
				var cmds = t.editorcommands, justify, 
					stat = [cmds.queryCommandState('Bold'), 
					cmds.queryCommandState('Italic'), 
					cmds.queryCommandState('Underline'),
					justify = cmds.queryCommandState('justifycenter'),
					justify = !justify && cmds.queryCommandState('justifyleft'),
					justify = !justify && cmds.queryCommandState('justifyright'),
					justify = !justify && cmds.queryCommandState('justifyfull')];
				ve.each(['Bold', 'Italic', 'Underline', 'justifycenter', 'justifyleft', 'justifyright', 'justifyfull'], function (n, i) {
					var b = t.getButton(n);
					if (!b) return;
					b[stat[i] && 'setActive' || 'setUnActive']();
				});
			}

			t.onClick.add(_eventHandler);
			t.onKeyUp.add(function(e) {
				t.bookmark = t.selection.getBookmark();
				if (e.keyCode >= 37 && e.keyCode <= 40)
					_eventHandler(e);
			});
			t.onSelectContent.add(_eventHandler);
			t.onBlur.add(function() {
				t.bookmark = t.selection.getBookmark();
			});
			
			dom.event.add(d, 'click', function(e) {
				t.bookmark = t.selection.getBookmark();
				t.onClick.fire(t, e);
			});
			dom.event.add(d, 'keypress', function (e) {
				t.onKeyPress.fire(t, e);
			});
			var iskeydown;
			dom.event.add(d, 'keydown', function (e) {
				if (iskeydown === true) 
					return;
				t.onKeyDown.fire(t, e);
				iskeydown = true;
			});
			dom.event.add(d, 'keyup', function (e) {
				t.bookmark = t.selection.getBookmark();
				t.onKeyUp.fire(t, e);
				iskeydown = false;
			});
			dom.event.add(d, 'mousedown', function (e) {
				t.onMouseDown.fire(t, e);
			});
			dom.event.add(d, 'mouseup', function (e) {
				if (t.selection.getContent().length > 0) 
					t.onSelectContent.fire(t, e);
			});
			dom.event.add(w, 'blur', function (e) {
				t.onBlur.fire(t, e);
				iskeydown = undefined;
			});
			dom.event.add(w, 'focus', function (e) {
				t.onFocus.fire(t, e);
			});
			dom.event.add(b, 'paste', function (e) {
				t.onPaste.fire(t, e);
			});
			if (t.conf.autoAdjust == 1) {
				var timer, resizetimer;
				function _resize() {
					var h = Math.max(t.conf.height, d.documentElement.offsetHeight) + 'px',
						w = Math.max(t.conf.width, d.documentElement.offsetWidth) + 'px';
					function _s(w, h) {
						t.getBody().style.height = h;
						t.iframeContainer.style.height = h;
						t.iframeElement.style.height = h;
						if (parseInt(h) > t.conf.height)
							t.getBody().style.height = '100%';
						t.onResize.fire(t, w, h);
					}
					clearTimeout(resizetimer);
					resizetimer = setTimeout(function() {
						_s(t.conf.height, t.getDoc().documentElement.scrollHeight);
						w = Math.max(t.conf.width, t.getDoc().documentElement.offsetHeight);
						h = Math.max(t.conf.height, t.getDoc().documentElement.offsetHeight);
						_s(w + 'px', h + 'px');
					}, 100);
				}
				if (isIE) 
					dom.event.add(w, 'resize', _resize);
				else 
					dom.event.add(b, 'DOMSubtreeModified', _resize);
				if (!isIE) 
					b.className = '';
			}
			// 快捷键支持
			function find(e) {
				var v = null;
				if (!e || !e.altKey && !e.ctrlKey && !e.metaKey)
					return v;

				ve.each(t.shortcuts, function(o) {
					if (ve.isMac && o.ctrl != e.metaKey)
						return;
					else if (!ve.isMac && o.ctrl != e.ctrlKey)
						return;

					if (o.alt != e.altKey)
						return;

					if (o.shift != e.shiftKey)
						return;

					if (e.keyCode == o.keyCode || (e.charCode && e.charCode == o.charCode)) {
						v = o;
						return false;
					}
				});
				return v;
			};

			t.onKeyUp.add(function(e) {
				var o = find(e);
				if (o)
					dom.event.cancel(e);
			});

			t.onKeyPress.add(function(e) {
				var o = find(e);
				if (o)
					dom.event.cancel(e);
			});

			t.onKeyDown.add(function(e) {
				var o = find(e);
				if (o) {
					var b = o.fn.call(t, e);
					
					if (b === false) {
						dom.event.cancel(e);
					}
				}
			});

			// 加入tab键制表符逻辑
			if (typeof t.conf.tab4space == 'number') {
				t.onKeyDown.add(function(e) {
					if (e.keyCode == 9) {
						t.setContent(new Array(t.conf.tab4space + 1).join('&nbsp'));
						if (t.bookmark)
							t.bookmark.start += t.conf.tab4space;
						t.selection.moveToBookmark(t.bookmark)
						dom.event.cancel(e);
					}
				});
			}
		}
	}, {});
}) (window, document, undefined, ve);

(function(window, document, undefined, v) {
	v.Class('ve.editor.Selection', {
		Selection: function (win, doc) {
			var t = this;
			t.win = win;
			t.doc = doc;
			ve.each(['onSetContent', 'onGetContent'], function (n) {
				t[n] = new ve.dom.EventManager(t);
			});
//			if (!t.win.getSelection)
//				t.tridentSel = new ve.editor.TridentSelection(t);

		},

		getContent: function (s) {
			var t = this, r = t.getRng(), dom = ve.DOM, e = dom.create("body"), se = t.getSel(), wb, wa, n;

			s = s || {};
			wb = wa = '';
			s.get = true;
			s.format = s.format || 'html';

			if (s.format == 'text')
				return t.isCollapsed() ? '' : (r.text || (se.toString ? se.toString() : ''));

			if (r.cloneContents) {
				n = r.cloneContents();

				if (n)
					e.appendChild(n);
			} 
			else if (r.item || typeof r.htmlText != 'undefined')
				e.innerHTML = r.item ? r.item(0).outerHTML : r.htmlText;
			else
				e.innerHTML = r.toString();

			// Keep whitespace before and after
			if (/^\s/.test(e.innerHTML))
				wb = ' ';

			if (/\s+$/.test(e.innerHTML))
				wa = ' ';

			s.content = t.isCollapsed() ? '' : wb + e.innerHTML + wa;
			return s.content;
		},

		setContent : function(h, s) {
			var t = this, r = t.getRng(), c, d = t.doc;

			s = s || {format : 'html', content: ''};
			s.set = true;
			h += s.content;
			if (r.insertNode) {
				h += '<span id="__caret">_</span>';

				r.deleteContents();
				r.insertNode(t.getRng().createContextualFragment(h));

				c = dom.get('__caret', d);

				r = d.createRange();
				r.setStartBefore(c);
				r.setEndAfter(c);
				t.setRng(r);
				dom.remove(c);
			}
			else {
				if (r.item) {
					d.execCommand('Delete');
					r = t.getRng();
				}
				r.pasteHTML(h);
			}
			
			t.onSetContent.fire(t, h);
		},
	
		getSelectionSize: function() {
			var t = this, r = t.getRng(), c, d = t.doc, isIE = ve.isIE, bw = 0, bh = 0;
			if (isIE) {
				bw = r.boundingWidth;
				bh = r.boundingHeight;
			}
			else {
//				r = t.getRng();
//				r.setStartBefore(d.body.firstChild);
//				r.setEndAfter(d.body.lastChild);
//				t.getSel().addRange(r);

				bw = d.documentElement.clientWidth;
				bh = d.documentElement.scrollHeight;
			}
			return {
				width: bw || 0,
				height: bh || 0
			};
		},

		getBookmark : function(si) {
			var t = this, r = t.getRng(), tr, sx, sy, vp = dom.getViewPort(t.win), e, sp, bp, le, c = -0xFFFFFF, s, ro = t.doc.body, wb = 0, wa = 0, nv, each = ve.each, isIE = ve.isIE, isIE9 = ve.isIE9;
			sx = vp.x;
			sy = vp.y;
			// Simple bookmark fast but not as persistent
			if (si == 'simple')
				return {rng : r, scrollX : sx, scrollY : sy};

			// Handle IE
			if (isIE) {
				// Control selection
				if (r.item) {
					e = r.item(0);

					each(t.doc.getElementsByTagName(e.nodeName), function(n, i) {
						if (e == n) {
							sp = i;
							return false;
						}
					});

					return {
						tag : e.nodeName,
						index : sp,
						scrollX : sx,
						scrollY : sy
					};
				}

				// Text selection
				tr = t.doc.body.createTextRange();
				tr.moveToElementText(ro);
				tr.collapse(true);
				bp = Math.abs(tr.move('character', c));

				tr = r.duplicate();
				tr.collapse(true);
				sp = Math.abs(tr.move('character', c));

				tr = r.duplicate();
				tr.collapse(false);
				le = Math.abs(tr.move('character', c)) - sp;

				return {
					start : sp - bp,
					length : le,
					scrollX : sx,
					scrollY : sy
				};
			}

			// Handle W3C
			e = t.getNode();
			s = t.getSel();

			if (!s)
				return null;

			// Image selection
			if (e && e.nodeName == 'IMG') {
				return {
					scrollX : sx,
					scrollY : sy
				};
			}

			// Text selection

			function getPos(r, sn, en) {
				var w = t.doc.createTreeWalker(r, NodeFilter.SHOW_TEXT, null, false), n, p = 0, d = {};

				while ((n = w.nextNode()) != null) {
					if (n == sn)
						d.start = p;

					if (n == en) {
						d.end = p;
						return d;
					}

					p += (n.nodeValue.replace(/[\r\n]/g, '') || '').length;
				}

				return null;
			};

			// Caret or selection
			if (s.anchorNode == s.focusNode && s.anchorOffset == s.focusOffset) {
				e = getPos(ro, s.anchorNode, s.focusNode);

				if (!e)
					return {scrollX : sx, scrollY : sy};

				// Count whitespace before
				(s.anchorNode.nodeValue.replace(/[\r\n]/g, '') || '').replace(/^\s+/, function(a) {wb = a.length;});

				return {
					start : Math.max(e.start + s.anchorOffset - wb, 0),
					end : Math.max(e.end + s.focusOffset - wb, 0),
					scrollX : sx,
					scrollY : sy,
					beg : s.anchorOffset - wb == 0
				};
			} else {
				e = getPos(ro, r.startContainer, r.endContainer);

				if (!e)
					return {scrollX : sx, scrollY : sy};

				return {
					start : Math.max(e.start + r.startOffset - wb, 0),
					end : Math.max(e.end + r.endOffset - wa, 0),
					scrollX : sx,
					scrollY : sy,
					beg : r.startOffset - wb == 0
				};
			}
			if (isIE) {
				return r.getBookmark();
			}
		},

		moveToBookmark : function(b) {
			var t = this, r = t.getRng(), s = t.getSel(), ro = t.doc.body, sd, nvl, nv, each = ve.each, isIE = ve.isIE;
			function getPos(r, sp, ep) {
				var w = t.doc.createTreeWalker(r, NodeFilter.SHOW_TEXT, null, false), n, p = 0, d = {}, o, v, wa, wb;

				while ((n = w.nextNode()) != null) {
					wa = wb = 0;

					nv = n.nodeValue || '';
					//nv.replace(/^\s+[^\s]/, function(a) {wb = a.length - 1;});
					//nv.replace(/[^\s]\s+$/, function(a) {wa = a.length - 1;});

					nvl = nv.replace(/[\r\n]/g, '').length;
					p += nvl;

					if (p >= sp && !d.startNode) {
						o = sp - (p - nvl);

						// Fix for odd quirk in FF
						if (b.beg && o >= nvl)
							continue;

						d.startNode = n;
						d.startOffset = o + wb;
					}

					if (p >= ep) {
						d.endNode = n;
						d.endOffset = ep - (p - nvl) + wb;
						return d;
					}
				}

				return null;
			};

			if (!b)
				return false;

			t.win.scrollTo(b.scrollX, b.scrollY);

			// Handle explorer
			if (isIE) {
				// Handle simple
				if (r = b.rng) {
					try {
						r.select();
					} catch (ex) {
						// Ignore
					}

					return true;
				}

				t.win.focus();

				// Handle control bookmark
				if (b.tag) {
					r = ro.createControlRange();

					each(dom.find(b.tag), function(n, i) {
						if (i == b.index)
							r.addElement(n);
					});
				} else {
					// Try/catch needed since this operation breaks when TinyMCE is placed in hidden divs/tabs
					try {
						// Incorrect bookmark
						if (b.start < 0)
							return true;

						r = s.createRange();
						r.moveToElementText(ro);
						r.collapse(true);
						r.moveStart('character', b.start);
						r.moveEnd('character', b.length);
					} catch (ex2) {
						return true;
					}
				}

				try {
					r.select();
				} catch (ex) {
					// Needed for some odd IE bug #1843306
				}

				return true;
			}

			// Handle W3C
			if (!s)
				return false;

			// Handle simple
			if (b.rng) {
				s.removeAllRanges();
				s.addRange(b.rng);
			} else {
				if (b.start && b.end) {
					try {
						sd = getPos(ro, b.start, b.end);

						if (sd) {
							r = t.doc.createRange();
							r.setStart(sd.startNode, sd.startOffset);
							r.setEnd(sd.endNode, sd.endOffset);
							s.removeAllRanges();
							s.addRange(r);
						}
					} catch (ex) {
						// Ignore
					}
				}
			}
			if (isIE && b)
				r.moveToBookmark(b)
		},

		getStart: function () {
			var t = this, r = t.getRng(), e, isIE = ve.isIE;

			if (isIE) {
				if (r.item)
					return r.item(0);

				r = r.duplicate();
				r.collapse(1);
				e = r.parentElement();

				if (e && e.nodeName == 'BODY')
					return e.firstChild;

				return e;
			} else {
				e = r.startContainer;

				if (e.nodeName == 'BODY')
					return e.firstChild;

				return dom.getParents(e, '*');
			}
		},

		getEnd: function () {
			var t = this, r = t.getRng(), e, isIE = ve.isIE;

			if (isIE) {
				if (r.item)
					return r.item(0);

				r = r.duplicate();
				r.collapse(0);
				e = r.parentElement();

				if (e && e.nodeName == 'BODY')
					return e.lastChild;

				return e;
			} else {
				e = r.endContainer;

				if (e.nodeName == 'BODY')
					return e.lastChild;

				return dom.getParents(e, '*');
			}
		},

		select: function (n, c) {
			var t = this, r = t.getRng(), s = t.getSel(), b, fn, ln, d = t.win.document, isIE = ve.isIE;

			function find(n, start) {
				var walker, o;

				if (n) {
					walker = d.createTreeWalker(n, NodeFilter.SHOW_TEXT, null, false);

					// Find first/last non empty text node
					while (n = walker.nextNode()) {
						o = n;

						if (n.nodeValue.replace(/^\s*|\s*$/).length != 0) {
							if (start)
								return n;
							else
								o = n;
						}
					}
				}

				return o;
			};

			if (isIE) {
				try {
					b = d.body;

					if (/^(IMG|TABLE)$/.test(n.nodeName)) {
						r = b.createControlRange();
						r.addElement(n);
					} else {
						r = b.createTextRange();
						r.moveToElementText(n);
					}

					r.select();
				} catch (ex) {
					// Throws illigal agrument in IE some times
				}
			} else {
				if (c) {
					fn = find(n, 1) || dom.select('br:first', n)[0];
					ln = find(n, 0) || dom.select('br:last', n)[0];

					if (fn && ln) {
						r = d.createRange();

						if (fn.nodeName == 'BR')
							r.setStartBefore(fn);
						else
							r.setStart(fn, 0);

						if (ln.nodeName == 'BR')
							r.setEndBefore(ln);
						else
							r.setEnd(ln, ln.nodeValue.length);
					} else
						r.selectNode(n);
				} else
					r.selectNode(n);

				t.setRng(r);
			}

			return n;
		},

		getSel: function () {
			var t = this, w = t.win, d = t.doc;
			return w.getSelection ? w.getSelection() : d.selection;
		},

		setRng : function(r) {
			var s, t = this;
			if (!t.tridentSel) {
				s = t.getSel();

				if (s) {
					s.removeAllRanges();
					s.addRange(r);
				}
			} else {
				// Is W3C Range
				if (r.cloneRange) {
					t.tridentSel.addRange(r);
					return;
				}

				// Is IE specific range
				try {
					r.select();
				} catch (ex) {
					// Needed for some odd IE bug #1843306
				}
			}
		},

		getRng: function () {
			var t = this, s, r, isIE = ve.isIE, w = t.win, d = t.doc;			
			try {
				if (s = t.getSel())
					r = s.rangeCount > 0 ? s.getRangeAt(0) : (s.createRange ? s.createRange() : d.createRange());
			} catch (ex) {
			}

			if (!r)
				r = isIE ? d.body.createTextRange() :d.createRange();

			return r;
		},

		getNode: function () {
			var t = this, r = t.getRng(), s = t.getSel(), e, isIE = ve.isIE;

			if (!isIE) {
				// Range maybe lost after the editor is made visible again
				if (!r)
					return document.body;

				e = r.commonAncestorContainer;

				// Handle selection a image or other control like element such as anchors
				if (!r.collapsed) {
					// If the anchor node is a element instead of a text node then return this element
					if (ve.isWebKit && s.anchorNode && s.anchorNode.nodeType == 1) 
						return s.anchorNode.childNodes[s.anchorOffset]; 

					if (r.startContainer == r.endContainer) {
						if (r.startOffset - r.endOffset < 2) {
							if (r.startContainer.hasChildNodes())
								e = r.startContainer.childNodes[r.startOffset];
						}
					}
				}
				
				return e.parentNode;
			}

			return r.item ? r.item(0) : r.parentElement();
		},

		isCollapsed : function() {
			var t = this, r = t.getRng(), s = t.getSel();

			if (!r || r.item)
				return false;

			return !s || r.boundingWidth == 0 || r.collapsed;
		},

		collapse : function(b) {
			var t = this, r = t.getRng(), n;

			// Control range on IE
			if (r.item) {
				n = r.item(0);
				r = this.win.document.body.createTextRange();
				r.moveToElementText(n);
			}

			r.collapse(!!b);
			t.select();
		}
	});
}) (window, document, undefined, ve);

(function(window, document, undefined, v) {
	v.Class('ve.editor.EditorCommands', {
		EditorCommands: function (editor) {
			this.editor = editor;
			this.browserCommands = 'Bold,Italic,Underline,justifycenter,justifyleft,justifyright,justifyfull,FontSize,FontName';
		},
		
		execCommand: function (cmd, ui, value) {
			var t = this, ed = t.editor, f, args = Array.prototype.slice.call(arguments, 1), d = ed.getDoc(), b = ed.getBody(), isIE = ve.isIE;
			ed.onBeforeExecCommand.fire(ed, cmd, ui, value);
			
			if (new RegExp(',?' + cmd + ',?', 'i').test(t.browserCommands)) {
				// ie下没有选中态执行命令;
				// 比较恶性，插入一个临时节点并将焦点移到此节点上;
				// 用户进行输入后移除该临时节点，这里使用removNode()来移除;
				// 用户没有输入行为失去焦点则完全移除临时节点removNode(true);
				if (isIE && ed.bookmark && !ed.bookmark.length) { 
					ed.getWin().focus();
					if (!/justifycenter|justifyleft|justifyright|justifyfull/i.test(cmd)) {
						ed.setContent('<span id="__caret">&nbsp;</span>');
						var r = d.body.createTextRange();
						var sp = d.getElementById('__caret');
						r.moveToElementText(sp);
						r.select();
						d.execCommand(cmd, ui || false, value);
						var _rm = function(b) {
							sp = d.getElementById('__caret');
							if (sp)
								sp.removeNode(b);
						}
						ed.onKeyUp.add(function() {_rm();});
						ed.onClick.add(function() {_rm(true);});
						ed.onBlur.add(function() {_rm(true);});
					}
					else 
						d.execCommand(cmd, ui || false, value);
				}
				else 
					d.execCommand(cmd, ui || false, value);
			}
			else if (typeof this[cmd] == 'function') {
				ed.focus();
				t[cmd].apply(t, args);
			}
			else if (typeof cmd == 'function') {
				ed.focus();
				cmd.apply(t, args);
			}
			else if (typeof ed.commands[cmd] == 'function') {
				ed.focus();
				ed.commands[cmd].apply(t, args);
			}
			ed.onExecCommand.fire();
			return false;
		},

		queryCommandState: function (c) {
			switch (c) {
				case 'justifycenter':
				case 'justifyleft':
				case 'justifyright':
				case 'justifyfull':
					return this.queryStateJustify(c, c.slice(7));
				default:
					return this.editor.getDoc().queryCommandState(c) || (this['_queryState' + c] && this['_queryState' + c]());
			
			}
			return false;
		},

		queryCommandValue: function (c) {
			var t = this, ed = t.editor, d = ed.getDoc(), f = this['_queryValue' + c];
			if (d.queryCommandValue(c)) return d.queryCommandValue(c);
			if (f) 
				return f.call(this, c)
			return false;
		},

		_queryValueFontSize: function (c) {
			var t = this, ed = t.editor, e, isIE = ve.isIE;
			e = ed.selection.getNode();
			return e.size || e.style.fontSize || ed.getDoc().queryCommandValue('FontSize');
		},

		_queryValueFontName: function () {
			var t = this, ed = t.editor, e, isIE = ve.isIE;
			e = ed.selection.getNode();
			return e.face || e.style.fontFamily.replace(/, /g, ',').replace(/[\'\"]/g, '').toLowerCase() || ed.getDoc().queryCommandValue('FontName');
		},

		queryStateJustify: function (c, v) {
			var ed = this.editor, n = ed.selection.getNode(), dom = ve.DOM;

			if (n && n.nodeName == 'IMG') {
				if (dom.getStyle(n, 'float') == v)
					return 1;
				return n.parentNode.style.textAlign == v;
			}
			n = dom.getParents(n, function (d) {
				return d.nodeType == 1 && (v == d.align || v == d.style.textAlign);
			});
//			alert (n);
			if (v == 'full')
				v = 'justify';;

			return n && n.nodeType == 1 && (v == n.align || v == n.style.textAlign);
		},

		setForeColor: function (ui, col) {
			var t = this, d = t.editor.getDoc();
			d.execCommand('ForeColor', false, col);
		},

		setBackColor: function (ui, col) {
			var t = this, d = t.editor.getDoc(), isIE = ve.isIE;
			d.execCommand(isIE && 'backcolor' || 'hilitecolor', false, col);
		},

		insertLink : function(u, v) {
			var t = this, ed = t.editor, d = ed.getDoc(), s = ed.selection, dom = ve.DOM, e, r = s.getRng();
			if (typeof v == 'string')
				v = {href : v};

			function set(e) {
				ve.each(v, function(v, k) {
					if (typeof v == 'string') {
						dom.setAttr(e, k, v);						
					}
				});
			};
			v = ve.extend({
				click: function() {},
				mousedown: function() {},
				mouseover: function() {},
				mouseout: function() {}
			}, v);
			ed.focus();
			d.execCommand('CreateLink', false, 'javascript:vetmp(0);');
			ve.each(dom.selector('a[href="javascript:vetmp(0);"]', d), function(a) {
				set(a);
				ve.each(v, function(f, i) {
					if (typeof f == 'function') {
						dom.event.add(a, i, f);
					}
				});
			});
		},

		unlink : function() {
			var ed = this.editor, s = ed.selection;

			if (s.isCollapsed())
				s.select(s.getNode());

			ed.getDoc().execCommand('unlink', false, null);
			s.collapse(0);
		},
		
		/**
		 * 保存内容
		 * 当前方法仅供在onSaveContent事件启动时使用
		 * @param {Object} u
		 * @param {Object} v
		 */
		saveContent: function(u, v){
			var t = this, ed = t.editor;
			ed.onSaveContent.fire(u, ed.getContent());
		},

		/**
		 * 插入图片u为url，conf为参数表
		 */
		insertImage: function(u, v) {
			var t = this, ed = t.editor, d = ed.getDoc(), s = ed.selection, dom = ve.DOM, e, r = s.getRng();

			if (typeof v == 'string')
				v = {src : v};

			function set(e) {
				ve.each(v, function(v, k) {
					if (typeof v == 'string') {
						dom.setAttr(e, k, v);						
					}
				});
			};
			v = ve.extend({
				click: function() {},
				mousedown: function() {},
				mouseover: function() {},
				mouseout: function() {}
			}, v);
			ed.setContent('<img src="' + v.src + '" veimgtmp="1" />');
			ve.each(dom.selector('img[veimgtmp=1]', d), function(a) {
				set(a);
				ve.each(v, function(f, i) {
					if (typeof f == 'function') {
						dom.event.add(a, i, f);
					}
				});
			});
		},

		undo: function() {
			var t = this, ed = t.editor;
//			ed.getDoc().execCommand('Undo');
			ed.undoManager.undo();
		},

		redo: function() {
			var t = this, ed = t.editor;
			ed.undoManager.redo();
		},

		removeformat: function(ui, value) {
			var t = this, ed = t.editor;
			ed.getDoc().execCommand('removeformat', ui || false, null);
		}
	});
}) (window, document, undefined, ve);

(function(v) {
	v.Class('ve.editor.UndoManager', {
		index: 0,
		data: null,
		typing: 0,
		UndoManager: function(ed) {
			var t = this;
			t.editor = ed;
			t.data = [];
			t.onAdd = new ve.dom.EventManager(t);
			t.onUndo = new ve.dom.EventManager(t);
			t.onRedo = new ve.dom.EventManager(t);
		},

		add: function(l) {
			var t = this, i, ed = t.editor, b, s = ed.conf, la;

			l = l || {};
			l.content = l.content || ed.getContent();

			l.content = l.content.replace(/^\s*|\s*$/g, '');
			la = t.data[t.index > 0 && (t.index == 0 || t.index == t.data.length) ? t.index - 1 : t.index];
			if ( la && l.content == la.content)
				return null;
			l.bookmark = b = l.bookmark || ed.selection.getBookmark();
			if (t.index < t.data.length)
				t.index++;

			if (t.data.length === 0)
				t.data.push(l);

			
			t.data.length = t.index + 1;
			t.data[t.index++] = l;

			if (l.initial)
				t.index = 0;
			

			if (t.data.length == 2 && t.data[0].initial)
				t.data[0].bookmark = b;

			t.onAdd.fire(t, l);
			ed.isNotDirty = 0;


			return l;
		},

		undo: function() {
			var t = this, ed = t.editor, l = l, i;
			if (t.typing) {
				t.add();
				t.typing = 0;
			}

			if (t.index > 0) {
				// If undo on last index then take snapshot
				if (t.index == t.data.length && t.index > 1) {
					i = t.index;
					t.typing = 0;

					if (!t.add())
						t.index = i;

					--t.index;
				}

				l = t.data[--t.index];
				ed.getBody().innerHTML = l.content;
//				ed.setContent(l.content, {format : 'html'});
				ed.selection.moveToBookmark(l.bookmark);

				t.onUndo.fire(t, l);
			}

			return l;
		},

		redo : function() {
			var t = this, ed = t.editor, l = null;

			if (t.index < t.data.length - 1) {
				l = t.data[++t.index];
				ed.getBody().innerHTML = l.content;
				ed.selection.moveToBookmark(l.bookmark);
				t.onRedo.fire(t, l);
			}

			return l;
		},

		hasUndo : function() {
			return this.index != 0 || this.typing;
		},

		hasRedo : function() {
			return this.index < this.data.length - 1;
		}
	});
}) (ve);

/**
 * Control 控件基类
 */
(function(v) {
	v.Class('ve.ui.Control', {
		Control : function(id, s) {
			var t = this;
			t.id = id;
			t.conf = s || {};
			t.rendered = false;
			t.classPrefix = '';
			t.disabled = 0;
			t.active = 0;
			t.dom = null;
			ve.each('onClick,onMouseDown,onKeyDown,onKeyUp,onKeyPress,onMouseOver,onMouseOut,onQueryCommandValue,onQueryCommandState'.split(','), function (n) {
				t[n] = new ve.dom.EventManager();
			})
		},

		hide: function () {
			var dom = ve.DOM
			if (this.dom) {
				dom.addClass(this.dom, 'hidden');
				dom.setStyle(this.dom, 'display', 'none');
			}
		},
		
		show: function () {
			var dom = ve.DOM
			if (this.dom) {
				dom.removeClassClass(this.dom, 'hidden');
				dom.setStyle(this.dom, 'display', 'block');
			}
		},
		
		setDisable: function(){
			if(this.dom){
				VE.dom.addClass(this.dom, 'disabled');
			}
		},
		
		setEnabled: function(){
			if(this.dom){
				VE.dom.removeClass(this.dom, 'disabled');
			}
		},

		renderHTML : function() {
		},

		renderDOM: function () {
		},

		renderTo: function(n, where, rela) {
			var DOM = dom = ve.DOM;
			if (!n || !n.nodeType ) return;
			var html = this.renderHTML(), node;
			if (!html) {
				node = this.renderDOM();
				this.dom = node;
				if (!node) return;
				if (node.nodeType == 1) {
					if (rela && rela.nodeType == 1) {
						switch(where) {
							case 'before':
							case 0:
								n.insertBefore(node, rela);
								break;
							case 'after':
							case 1:
								if (rela.nextSibling) {
									n.insertBefore(node, rela.nextSibling);
								}
								else {
									n.appendChild(node);
								}
								break;
							default:
								break;
						}
					}
					else 
						n.appendChild(node);
				}
			}
			else {
				var bdy = document.createElement('body'), f;
				bdy.innerHTML = html;
				for (var i = 0; i < bdy.childNodes.length; i++) {
					if (bdy.childNodes[i].nodeType == 3) {
						tn = document.createTextNode(bdy.childNodes[i]);
					}
					else {
						tn = bdy.childNodes[i];
					}
					if (rela && rela.nodeType == 1) {
						switch(where) {
							case 'before':
							case 0:
								n.insertBefore(tn, rela);
								break;
							case 'after':
							case 1:
								if (rela.nextSibling) {
									n.insertBefore(tn, rela.nextSibling);
								}
								else {
									n.appendChild(tn);
								}
								break;
							default:
								break;
						}
					}
					else {
						n.appendChild(tn);
					}
					this.dom = tn;
				}
				
			}
			this.bindHandler();
		},

		bindHandler: function (node) {
		},

		remove : function() {
			DOM.remove(this.id);
			this.destroy();
		},

		destroy : function() {
		},

		getSelfDOM: function () {
			return this.dom;
		},

		getSelfHTML: function () {
			return this.renderHTML();
		},

		toggleActive: function () {
			var t = this, a = this.dom, dom = ve.DOM, s = t.conf, cls = s['class'] + '_active';
			if (dom.hasClass(a, cls)) {
				dom.removeClass(a, cls);
			}
			else {
				dom.addClass(a, cls);
			}
		},

		setActive: function () {
			var t = this, a = this.dom, dom = ve.DOM, s = t.conf, cls = s['class'] + '_active';
			dom.addClass(a, cls);
		},

		setUnActive: function () {
			var t = this, a = this.dom, dom = ve.DOM, s = t.conf, cls = s['class'] + '_active';
			dom.removeClass(a, cls);
		}
	});
})(ve);

(function(v) {
	v.Class('ve.ui.Container:ve.ui.Control', {
		Container : function(id, s) {
			this.base(id, s);
			this.controls = [];
			this.lookup = {};
		},

		add : function(c) {
			this.lookup[c.id] = c;
			this.controls.push(c);

			return c;
		},

		get : function(n) {
			return this.lookup[n];
		},

		renderHTML: function () {
			return '<div id="' + this.id + '" class="veCommContainer ' + (this.conf['class'] || '') + '"></div>'
		}

	});
}) (ve);

(function(v) {
	v.Class('ve.ui.Toolbar:ve.ui.Container', {
		Toolbar: function (id, s) {
			this.base(id, s);
		},

		renderHTML: function () {
			var s = this.conf;
			var h = '<div id="' + this.id + '" class="veToolbar '+ (s['class']||'') + '">'
			return h + '</div>';
		}
	});
}) (ve);

(function(v) {
	v.Class('ve.ui.Button:ve.ui.Control', {
		Button: function (id, conf) {
			var t = this;
			id = 'veCommandBtn_' + id;
			conf = ve.extend({toggle: 1}, conf);
			this.base(id, conf)
			this.classPrefix = 'veButton';
		},

		renderHTML: function () {
			var cp = this.classPrefix, s = this.conf;
			h = '<a href="javascript:;" class="' + cp + ' ' + cp + (s.disabled ? '_disabled ' : '_enabled ') + s['class'] + (s.disabled ? '_disabled ' : '_enabled ') + s['class'] + '" onmousedown="return false;" onclick="return false;" title="' + (s.title) + '">';
			h += '<span class="veIcon ' + s['class'] + '">'+(s.text||'')+'</span></a>';
			return h;
		},

		bindHandler: function () {
			var t = this, s = t.conf, cp = t.classPrefix;
			if (s.onclick) {
				dom.event.add(this.dom, 'click', function (e) {
					if (s.disabled) return;
					s.onclick.call(t.dom, e);
					if (s.toggle) {
						t.toggleActive();
					}
					t.onClick.fire(t);
				});
			}
			
			if(s.disabled){
				return;
			}

			dom.event.add(this.dom, 'mouseover', function (e) {
				dom.addClass(this, (s['class'] || cp) + '_' + (s['overSuffix'] || 'over'));
				t.onMouseOver.fire();
			});

			dom.event.add(this.dom, 'mouseout', function (e) {
				dom.removeClass(this, (s['class'] || cp) + '_' + (s['overSuffix'] || 'over'));
				t.onMouseOut.fire();
			});
		}
	});
}) (ve);

(function(v) {
	/**
	 * 一个listbox类
	 * items格式为一个二维数组[[1,'1', 'style', cmdfn]]
	 * 表示索引，显示text，显示样式，执行的自定义命令
	 */
	v.Class('ve.ui.ListBox:ve.ui.Control', {
		ListBox: function (id, conf) {
			id = 'veCommandList_' + id;
			this.listboxid = 'veListBox_' + conf.cmd + '_' + parseInt(Math.random() * 100000);
			this.base(id, conf);
			this.classPrefix = 'veList';
			this.last = this.last || null;
			this.onChange = new ve.dom.EventManager();
			this.onBeforeOpen = new ve.dom.EventManager();
			this.onFirstOpen = new ve.dom.EventManager();
			this._lastClickItem = undefined;
			this._lastOverItem = undefined;
		},

		
		
		_getItemHTML: function(n, i) {
			return '<div class="' + this.classPrefix + '_item_con"><a href="javascript:;" seq="' + i + '" value="' + n[0] + '" class="' + this.classPrefix + 'Item"><span class="sel_icon sel_icon_hidden"><b>√</b></span><span class="item_cont"' + (n[2] || '') + '>' + (n[1] || n[0]) + '</span><span class="icon_suffix"></span></a></div>';
		},

		renderHTML: function () {
			var t = this, s = t.conf, html, cp = this.classPrefix;
			html = '<div class="' + cp + ' ' + cp + s['class'] + '" mid="' + this.listboxid + '"><div class="' + cp + '_current"><a href="javascript:;">' + s['title'] + '</a></div><div class="' + cp + '_downicon"><a href="#"></a></div>';
			html += '</div>';
			return html;
		},

		addItems: function(s) {
			var t = this, s = s || {pos: 'last'};
			s.pos = 'last'; // 只兼容从最后添加
			if (!s.items) return;
			if (s.pos == 'last') s.pos = t.conf.items.length;
			if (s.pos == 'first') s.pos = 0;
			if (s.pos >= 0 ) {
				var pos = Math.min(s.pos, t.conf.items.length);
				var list = dom.selector('#' + t.listboxid)[0];
				if (list){
					itm = dom.selector('>div', list), html = t._getItemHTML(s.items, pos);
					if (!itm[pos]) {
						dom.insertHTML(itm[pos - 1], 'afterend', html);
					}
					else {
						dom.insertHTML(itm[pos], 'beforebegin', html);
					}
					t.conf.items.push(s.items);
				}
			}
		},

		_commonBind: function(n, p) {
			var t = this, s = t.conf, cp = t.classPrefix, ed = s.editor, isIE = ve.isIE;
			dom.event.add(n, 'click', function (e) {
				if (s.onchange) {
					if (s.disabled) return;
					var seq = this.getAttribute('seq');
					s.value = this.getAttribute('value');
					s.items.current = this;
					ed.focus();
					s.onchange.call(t, s);
					if (typeof s.items[+seq][3] == 'function') {
						s.items[+seq][3].call(t, s, this);
					}
					dom.setStyle(p, 'display', 'none');
					dom.addClass(this, 'current');
					dom.setHTML(dom.selector('.' + cp + '_current', t.dom)[0], '<a value="' + s.value + '" href="javascript:;">' + this.innerHTML.replace(/<(\w+)[^>]+>([\s\S]*?)<\/\1>/g, '$2').replace(/√/g, '') + '</a>');
//					if (!isIE)
//						ed.focus();
					if (t._lastClickItem) {
						dom.addClass(dom.selector('span.sel_icon', t._lastClickItem)[0], 'sel_icon_hidden');
					}
					dom.removeClass(dom.selector('span.sel_icon', this)[0], 'sel_icon_hidden');
					dom.removeClass(t.dom,  cp + '_active');
					t._lastClickItem = this;
					dom.event.cancel(e);
					return false;
				}
			});
			dom.event.add(n, 'mouseover', function () {
				if (t._lastOverItem) dom.removeClass(t._lastOverItem, 'over');
				dom.addClass(this, 'over');
				t._lastOverItem = this;
			});
			dom.event.add(n, 'mouseout', function () {
				dom.removeClass(this, 'over');
			});
			
		},

		bindHandler: function () {
			var t = this, s = t.conf, cp = t.classPrefix, ed = s.editor, uid = this.listboxid, isFirstOpen = false;
			dom.event.add(t.dom, 'mouseover', function (e) {
				dom.addClass(this, cp + '_' + (s['overSuffix'] || 'over'));
				t.onMouseOver.fire();
			});

			dom.event.add(t.dom, 'mouseout', function (e) {
				dom.removeClass(this, cp + '_' + (s['overSuffix'] || 'over'), '');
				t.onMouseOut.fire();
			});
			var icon = dom.selector('.' + cp + '_downicon', t.dom), curr = dom.selector('.' + cp + '_current', t.dom), d = dom.get(uid), list = dom.selector('.' + cp + '_list', t.dom);
			if (!(icon = icon[0])) return;

			function _setItemClick(t, s) {
				var al = dom.selector('a.veListItem', dom.get(uid));
				ve.each(al, function (n) {
					t._commonBind(n, dom.get(uid));
				});
			};
			function _set(e, ishide) {
				t.onBeforeOpen.fire();
				var d = dom.get(uid);
				if (!d) {
					var html = '', p = dom.getXY(curr[0]), si = dom.getSize(curr[0]), x = p[0] - 1, y =  p[1], w = si[0], h = si[1];
					
					html += '<div style="' + (ishide && 'display:none' || '') + ';position:absolute; left:' + x + 'px; top:' + (y + h) + 'px;" class="' + cp + ' ' + cp + '_list ' + cp + '_' + s['class'] + '_list" id="' + uid + '">';
					ve.each(s.items, function (n, i) {
						html += t._getItemHTML(n, i);
					});
					html += '</div></div>';
					d = dom.insertHTML(document.body, 'beforeend', html);
					if (!isFirstOpen)
						t.onFirstOpen.fire(t, s);
					this.isFirstOpen = true;
					_setItemClick(t, s);
				}
				if (s.items.current) {
					if (d.firstChild.getAttribute('value') != '-1') {
						html = '<div value="-1" class="veList_item_con"><a href="javascript:;" value="-1" class="' + cp + 'Title">' + s.title + '</a></div>';
						dom.insertHTML(d.firstChild, 'beforebegin', html);
					}
				}
				var p = dom.getXY(curr[0]), si = dom.getSize(curr[0]), x = p[0], y = p[1], h = si[1];
				if (ve.ui.ListBox.__last) {
					if (d == ve.ui.ListBox.__last) {
						dom.setStyles(d, {
							display: dom.isHidden(d) ? 'block': 'none',
							left: x - 1,
							top: (y + h)
						});
					}
					else {
						dom.setStyle(ve.ui.ListBox.__last, 'display', 'none');
						dom.setStyles(d, {
							'display': ishide && 'none'|| 'block',
							left: x - 1,
							top: (y + h)
						});
					}
					dom.removeClass(this.parentNode,  cp + '_active');
				}
				else {
					dom.setStyles(d, {
						'display': ishide && 'none'|| 'block',
						left: x - 1,
						top: (y + h)
					});
				}
				ve.ui.ListBox.__last = d;
				dom[dom.isHidden(d) ? 'removeClass':'addClass'](this.parentNode,  cp + '_active');
				dom[dom.isHidden(d) ? 'removeClass':'addClass'](this,  cp + '_downicon_showed');
				dom.event.cancel(e);
			}
			dom.event.add(icon, 'click', _set);
			dom.event.add(curr[0], 'click', _set);
			dom.event.add(document.body, 'click', function (e) {
				if (ve.ui.ListBox.__last) {
					dom.setStyle(ve.ui.ListBox.__last, 'display', 'none');
				}
			});
			function _queryCommandV(curr) {
				if (typeof s.querycmd == 'function') {
					return s.querycmd.call(t, s);
				}
				var v = ed.editorcommands.queryCommandValue(s.cmd), isset;
				var icon = dom.selector('#' + uid + ' .veList_item_con span.sel_icon');
				_set.call(curr, {}, true);
				if (ve.ui.ListBox.__last) {
					dom.setStyle(ve.ui.ListBox.__last, 'display', 'none');
				}
				ve.each(s.items, function (n, i) {
					var b;
					(function(i) {
						if (n[0] == v && icon[i]) {
							v = n[0];
							isset = true;
							curr.innerHTML = '<a href="javascript:;">' + (n[1] || s.title) + '</a>';
							ve.each(icon, function(u) {
								dom.addClass(u, 'sel_icon_hidden');
							});
							dom.removeClass(icon[i], 'sel_icon_hidden');
							b = true;
							return false;
						}
					}) (i);
					if (b) 
						return false;
				});
				if (!v || !isset) {
					ve.each(icon, function(u) {
						dom.addClass(u, 'sel_icon_hidden');
					});
					curr.innerHTML = '<a href="javascript:;">' + s.title + '</a>';
				}
			}
			ed.onClick.add(function () {
				if (ve.ui.ListBox.__last) {
					dom.setStyle(ve.ui.ListBox.__last, 'display', 'none');
				}
				_queryCommandV(curr[0]);
			});
			ed.onKeyDown.add(function () {
				_queryCommandV(curr[0]);
			});
			t.onChange.add(function () {
				ed.focus();
			});
			t.onBeforeOpen.add(function() {
				v.each(dom.selector('div.' + cp, ed.toolbarContainer), function(n) {
					dom.removeClass(n, cp + '_active');
				});
				ed.onBeforeOpenListBox.fire();
			});
		}
	});
}) (ve);

(function (v) {
	var _last, undefined = undefined;
	v.Class('ve.editor.ControlManager', {
		ControlManager: function (editor) {
			var t = this;
			t.controls = {};
			t.editor = editor
		},

		get: function(id) {
			return this.controls[id];
		},
		
		add: function (c) {
			this.controls[c.id] = c;
			return c;
		},
		
		createToolbar: function (id, s) {
			var cc = new ve.ui.Toolbar(this.editor.id + '_' + id, s);
			return this.add(cc);
		},

		createButton: function(n, s) {
			var t = this, ed = t.editor, o, c, cls;
			s = s || {};
			if (t.get(this.editor.id + '_' + n))
				return null;
			

			if (!s.onclick) {
				s.onclick = function(e) {
					ed.getWin().focus();
					ed.editorcommands.execCommand(s.cmd, s.ui || false, s.value, b);
					ed.undoManager.add();
				};
			}
			var b = new ve.ui.Button(this.editor.id + '_' + n, s);
			return this.add(b)
		},

		createListBox: function(n, s) {
			var t = this, ed = t.editor, o, c, cls, dom = ve.DOM, ls;
			s = s || {};
			if (t.get(this.editor.id + '_' + n))
				return null;
			if (!s.onchange) {
				s.onchange = function(s) {
					ed.editorcommands.execCommand(s.cmd, s.ui || false, s.value);
				};
			}
			s.editor = ed;
			ls = new ve.ui.ListBox(this.editor.id + '_' + n, s);
			return this.add(ls)
		}
	});
}) (ve);

/**
 * 弹出窗体管理器，与主类聚合
 * 通过弹窗提供程序来注册使用
 * 初始化编辑器时指定对应的popupdialog_provider来，通过注册生效
 * 弹窗的实现可以有提供程序实现。
 */
(function (v) {
	var undefined = undefined, instance, ready, lookup = {};
	v.Class('ve.ui.PopupDialogManager', {
		PopupDialogManager: function (ed, s) {
			var t = this;
			t.editor = ed;
			t.conf = s || {};
			t.currentPopup = null;
			var sc = new ve.net.ScriptLoader(), url;
			// 如果提供程序是一个url
			if (/^http/.test(t.conf.provider)) {
				url = t.conf.provider;
				// 已远端js的文件名为提供程序名
				s.conf.provider = t.conf.provider.split('/').pop().replace(/\.js/);
			}
			else {
				url = ve.path.toAbs('ui/popup/' + t.conf.provider + '.js');
			}
			sc.load(url);
			
			ve.each(['onBeforeOpen', 'onOpen', 'onClose', 'onDrag'], function (n) {
				t[n] = new ve.dom.EventManager(t);
			});
		},
		lookup: {},
		
		createInstance: function () {
			var t = this, p = t.conf.provider, cls, w;
			cls = lookup[p];
			if (cls) {
				w = new cls(this, t.editor, t.conf);
			}
			return w || t;
		},

		open: function (s) {
			var t = this, w = t.createInstance(), c;
			instance = w;
			s = s || {};
			c = w && w.open(s) || window.open(s.src, s.name, s.conf);
			t.currentPopup = c;
			veEditor.popupEditor = this.editor;
			t.onOpen.fire(t);
		},

		close: function () {
			var c = this.currentPopup;
			if (c) {
				if (c.nodeType) {
					dom.remove(c);
				}
				else {
					c.close();
				}
			}
			this.onClose.fire(instance)
		},

		'static': {
			register: function (name, c) {
				var cls = lookup[name];
				if (cls) return;
				cls = typeof c == 'string' ? ve.resolve(c): c;
				lookup[name] = cls;
			}
		}
	});
}) (ve);
//--> end core code