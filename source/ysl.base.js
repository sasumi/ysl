/**
 * YSL core module
 */
(function(){
	if(window.YSL){
		throw("YSL NAMESPACE ALREADY DEFINED");
	}
	var Y = {
		meta: {
			ver:'3.0.0',		//version
			cp:'sasumi',		//copyright
			build:'20121004'	//last build
		},

		D:document,			//document alias
		L:location,			//location alias
		W:window,			//window alias
		com: {},			//component initialize
		widget:{},			//widget initialize
		TOP_FIRST: true
	};

	/**
	 * YSL empty function
	 */
	Y.emptyFn = function(){};

	//console adapter
	if(!Y.W.console){
		Y.W.console = {log:Y.emptyFn, warn:Y.emptyFn, exception:Y.emptyFn, error:Y.emptyFn, info:Y.emptyFn, dir:Y.emptyFn};
	}

	/**
	 * guid
	 * @return string
	 */
	Y.guid = (function(){
		var _ID = 0;
		return function(){
			return '_ysl_guid_'+(++_ID);
		};
	})();

	/**
	 * YSL ready state triggle
	 * @param {Function} fn
	 * @return {Object} Y.ready
	 */
	Y.ready = function(fn){
		var cb = function(){
			fn(Y);
		};
        if (Y.D.readyState === "complete") {
            return setTimeout(cb, 1);
        }
        if (Y.D.addEventListener) {
            Y.D.addEventListener("DOMContentLoaded", cb, false);
            Y.W.addEventListener("load", cb, false);
        } else if (Y.D.attachEvent) {
            Y.D.attachEvent("onreadystatechange", cb);
            Y.W.attachEvent("onload", cb);
        }
        return;
	}


	/**
	 * set YSL environment parameter
	 */
	Y.ENV = (function(){
		var ENV_DATA = {};
		var _ABS_URL;

		return {
			/**
			 * 获取当前YSL脚本所在的web路径
			 * @deprecate 依赖ysl合并后的文件名为 ysl.*.js 或者 y.*.js
			 * @return {String}
			**/
			getAbsUrl: function(){
				if(_ABS_URL){
					return _ABS_URL;
				}
				var scripts = Y.D.getElementsByTagName('SCRIPT');
				for(var i=0; i<scripts.length; i++){
					if(scripts[i].src){
						var match = /(.*\/)(.*?\.js$)/ig.exec(scripts[i].src);
						if(match[1] && /^ysl\..*js/i.test(match[2])){
							_ABS_URL = match[1];
							return _ABS_URL;
						}
					}
				}
			},

			setData: function(key, val){
				ENV_DATA[key] = val;
			},

			get: function(key){
				return ENV_DATA[key]
			},

			remove: function(key){
				delete ENV_DATA[key];
			}
		};
	})();

	/**
	 * 子模块加载
	 * 依赖net组件
	 * @param {String} module 模块名称，支持Y.string 或 YSL.string 或 Y.widget.popup形式
	 * @param {Function} modList
	 * @param {Function} callback 回调，第一个参数为YSL，其他的根据module按次序排列
	 **/
	Y.use = (function(){
		var CallbackList = [];

		/**
		 * 转换模块key为模块实体
		 * @param string modStr
		 * @return object||boolean
		 **/
		var transKeyToObj = function(modStr){
			var na = modStr.replace(/^Y\.|^YSL\./i, '');
			return Y.object.route(Y, na);
		};

		/**
		 * 转换模块名称为路径
		 * @param string modStr
		 * @return string
		 **/
		var transKeyToPath = (function(){
			var ABS_PATH = Y.ENV.getAbsUrl();
			return function(modStr){
				na = modStr.replace(/^Y\.|^YSL\./i, '');
				return ABS_PATH+na.replace(/\./g,'/').toLowerCase()+'.js'
			}
		})();

		/**
		 * 循环检测
		 **/
		var loopCheck = function(){
			var needUpdate = false;
			var tmp = [];
			Y.lang.each(CallbackList, function(item){
				var allLoaded = true;
				Y.lang.each(item.modList, function(modStr){
					if(!transKeyToObj(modStr)){
						allLoaded = false;
						return false;
					}
				});
				if(allLoaded){
					var param = [Y];
					Y.lang.each(item.modList, function(modStr){
						param.push(transKeyToObj(modStr));
					});
					item.fn.apply(null, param);
					needUpdate = true;
				} else {
					tmp.push(item);
				}
			});
			CallbackList = tmp;
			if(needUpdate){
				loopCheck();
			}
		};

		return function(modStr, callback){
			var modList = [];
			var fileList = [];
			Y.lang.each(modStr.split(','), function(str){
				var str = Y.string.trim(str);
				if(str){
					modList.push(str);
					if(!transKeyToObj(str)){
						fileList.push(transKeyToPath(str));
					}
				}
			});
			if(fileList.length){
				CallbackList.push({fn:callback, modList: modList});
				Y.net.loadScript(fileList, function(){
					loopCheck();
				});
			} else {
				var param = [Y];
				Y.lang.each(modList, function(modStr){
					param.push(transKeyToObj(modStr));
				});
				callback.apply(null, param);
			}
		};
	})();

	window.YSL = Y;
})();

/**
 * YSL lang module
 * @param {Object} YSL
 */
(function(Y){
	var _LANG = {};

	/**
	 * trans collection to array
	 * @param {Object} coll, dom collection
	 */
	_LANG.toArray = function(col){
		if(col.item){
            var l = col.length, arr = new Array(l);
            while (l--) arr[l] = col[l];
            return arr;
        } else {
			var arr = [];
			for(var i=0; i<col.length; i++){
				arr[i] = col[i];
			}
			return arr;
		}
	};

	/**
	 * check item is in array
	 * @param  {mix} item
	 * @param  {array} arr
	 * @return {boolean}
	 */
	_LANG.inArray = function(item, arr){
		for(var i=arr.length-1; i>=0; i--){
			if(arr[i] == item){
				return true;
			}
		}
		return false;
	};

	/**
	 * check an object is an empty
	 * @param  {mix}  obj
	 * @return {Boolean}
	 */
	_LANG.isEmptyObject = function(obj){
		if(typeof(obj) == 'object'){
			for(var i in obj){
				if(i !== undefined){
					return false;
				}
			}
		}
		return true;
	};

	/**
	 * check object is plain object
	 * @param  {mix}  obj
	 * @return {Boolean}
	 */
	_LANG.isPlainObject = function(obj){
		return obj && toString.call(obj) === "[object Object]" && !obj["nodeType"] && !obj["setInterval"];
	};

	_LANG.isScalar = function(value){
		var type = _LANG.getType(value);
		return type == 'number' || type == 'boolean' || type == 'string' || type == 'null' || type == 'undefined';
	};

	/**
	 * 判断一个对象是否为一个DOM 或者 BOM
	 * @param {Mix} value
	 * @return {Boolean}
	 **/
	_LANG.isBomOrDom = function(value){
		if(this.isScalar(value)){
			return false;
		}
		if(Y.ua.ie){
			//Node, Event, Window
			return value['nodeType'] || value['srcElement'] || (value['top'] && value['top'] == Y.W.top);
		} else {
			return this.getType(value) != 'object' && this.getType(value) != 'function';
		}
	};

	/**
	 * check object is boolean
	 * @param  {mix}  obj
	 * @return {Boolean}
	 */
	_LANG.isBoolean = function(obj){
		return this.getType(obj) == 'boolean';
	};

	/**
	 * check object is a string
	 * @param  {mix}  obj
	 * @return {Boolean}
	 */
	_LANG.isString = function(obj){
		return this.getType(obj) == 'string';
	};

	/**
	 * check object is an array
	 * @param  {mix}  obj
	 * @return {Boolean}
	 */
	_LANG.isArray = function(obj){
		return this.getType(obj) == 'array';
	};

	/**
	 * check object is a function
	 * @param  {mix}  obj
	 * @return {Boolean}
	 */
	_LANG.isFunction = function(obj){
		 return this.getType(obj) == 'function';
	};

	/**
	 * get type
	 * @param  {mix} obj
	 * @return {string}
	 */
	_LANG.getType = function(obj){
		return obj === null ? 'null' : (obj === undefined ? 'undefined' : Object.prototype.toString.call(obj).slice(8, -1).toLowerCase());
	};

	/**
	 * Array each loop call
	 * @param  {[type]}   obj
	 * @param  {Function} callback
	 */
	_LANG.each = function(obj, callback){
		var value, i = 0,
			length = obj.length,
			isObj = (length === undefined) || (typeof (obj) == "function");
		if (isObj) {
			for (var name in obj) {
				if (callback.call(obj[name], obj[name], name, obj) === false) {
					break;
				}
			}
		} else {
			for (value = obj[0]; i < length && false !== callback.call(value, value, i, obj); value = obj[++i]) {}
		}
		return obj;
	};


	/**
	 * Class构造器
	 * @param {String} s 构造规则
	 * @param {Object} p 对象实体
	 **/
	_LANG.createClass = function(s, p) {
		var t = this, sp, ns, cn, scn, c, de = 0;

		//解析规则: <prefix> <class>:<super class>
		s = /^((static) )?([\w.]+)(\s*:\s*([\w.]+))?/.exec(s);
		cn = s[3].match(/(^|\.)(\w+)$/i)[2]; // Class name

		//创建命名空间
		ns = t.createNS(s[3].replace(/\.\w+$/, ''));

		//类存在
		if (ns[cn]){
			return;
		}

		//生成静态类
		if (s[2] == 'static') {
			ns[cn] = p;
			if (this.onCreate){
				this.onCreate(s[2], s[3], ns[cn]);
			}
			return;
		}

		//创建缺省构造原型类
		if (!p[cn]) {
			p[cn] = function(){};
			de = 1;
		}

		// Add constructor and methods
		ns[cn] = p[cn];
		t.extend(ns[cn].prototype, p);

		//扩展
		if (s[5]) {
			if(!t.resolve(s[5])){
				throw('ve.Class namespace parser error');
			}
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
					if (n != cn){
						ns[cn].prototype[n] = f;
					}
				}
			});
		}

		// Add static methods
		t.each(p['static'], function(f, n) {
			ns[cn][n] = f;
		});
		if (this.onCreate){
			this.onCreate(s[2], s[3], ns[cn].prototype);
		}
	};

	/**
	 * 创建namespace
	 * @param {String} n name
	 * @param {Object} o scope
	 * @return {Object}
	 **/
	_LANG.createNS = function(n, o) {
		var i, v;
		o = o || Y.W;
		n = n.split('.');
		for (i=0; i<n.length; i++) {
			v = n[i];
			if (!o[v]){
				o[v] = {};
			}
			o = o[v];
		}
		return o;
	};

	/**
	 * 解析字符串对应到对象属性
	 * @param {String} n
	 * @param {Object} o
	 * @return {Mix}
	 **/
	_LANG.resolve = function(n, o) {
		var i, l;
		o = o || Y.W;
		n = n.split('.');

		for (i=0, l = n.length; i<l; i++) {
			o = o[n[i]];
			if (!o){
				break;
			}
		}
		return o;
	}

	Y.lang = _LANG;
})(YSL);
(function(Y){
	/**
	 * 特殊对象直接命中
	 * @param  {string} selector
	 * @return {[type]}          [description]
	 */
	var _fix = function(selector){
		selector = selector.toLowerCase();
		if(/^(body|head|html)$/.test(selector)){
			return Y.D.getElementsByTagName(selector)[0];
		} else if(selector == 'window'){
			return Y.W;
		} else if(selector == 'document'){
			return Y.D;
		}
		return '';
	}

	//使用浏览器原生selector
	if(Y.D.querySelector && Y.D.querySelectorAll){
		Y.querySelector = function(selector, context){
			var sp = _fix(selector);
			if(sp){
				return sp;
			}
			if(context){
				context = Y.dom.one(context).getDomNode();
			}
			var dom = context || Y.D;
			return dom.querySelector(selector);
		};
		Y.querySelectorAll = function(selector, context){
			var sp = _fix(selector);
			if(sp){
				return sp;
			}
			if(context){
				context = Y.dom.one(context).getDomNode();
			}
			var dom = context || Y.D;
			return dom.querySelectorAll(selector);
		};
		return;
	}

	/**
	 * DOM选择器
	 * @description 当前版本仅支持一下几种查询格式
	 * <code>
		tag = [--  rule $1    --][-- rule $2 --][-- relation simbol --][-- rule $1 --]...
		tag = object + property ||   limitor           >             		non-ID
		rule $1:		#div || span.class || .class <==> *.class || *
		rule $2:		[attribute_name = value] || :first || :last
		rule$2.1: 	:input || :text || :password || :radio || :checkbox || :submit || :reset
		</code>
	 * @param {Object} select	选择器
	 * @param {Object} context	上下文环境
	 * @param {Strong} cond	层级关系 > 或者所有
	 */
	var getElement = function(selector, context, cond){
		var result_lst = [],
			matches = [],
			context = context || Y.D,
			cond = cond || ' ';

		if(typeof(selector) !== 'string'){
			return selector;
		}

		//特殊对象直接命中
		if(selector == 'body' || selector == 'head' || selector == 'html'){
			return Y.D.getElementsByTagName(selector);
		} else if(selector == 'window'){
			return [Y.W];
		}

		//选择器清理
		selector = selector.replace(/(^\s*)|(\s*$)/g, '').replace(/\s+/ig, ' ').replace(/\s*\>\s*/ig, '>');

		//子模式数组分解
		matches = selector.match(/([^\s|^\>]+)|([\s|\>]+)/ig);

		//ID命中
		if(matches.length == 1 && matches[0].charAt(0) == '#'){
			return [Y.D.getElementById(matches[0].substring(1))];
		}

		//单模式命中
		else if(matches.length == 1){
			var context_lst = context.nodeType ? [context] : context;
			var tmp = [],
				tmp2 = [],
				att = null,
				pseudo = null,
				node_tags = matches[0].match(/^\w+/ig),
				node_tag = node_tags ? node_tags[0] : null;


			for (var i = 0; i < context_lst.length; i++) {
				var sub_result_lst = [];

				//父子关系
				if(cond == '>'){
					Y.lang.each(context_lst[i].childNodes, function(node){
						node_tag? (node.nodeName.toLowerCase() == node_tag && sub_result_lst.push(node)): sub_result_lst.push(node);
					});
				}

				//所有等级关系
				else {
					//selector specified || get all children
					sub_result_lst = node_tag ? Y.lang.toArray(context_lst[i].getElementsByTagName(node_tag))
						:sub_result_lst = sub_result_lst.concat(Y.lang.toArray(context_lst[i].getElementsByTagName('*')));
				}


				//类名过滤
				if (tmp = matches[0].match(/\.([A-Za-z0-9_-]+)/i)) {
					tmp2 = [];
					Y.lang.each(sub_result_lst, function(itm, idx){
						('  '+itm.className+' ').indexOf(' '+tmp[1]+' ') > 0 && tmp2.push(itm);
					});
					sub_result_lst = tmp2;
				}

				//属性过滤 [attribute_name=attribute_value]
				if (att = matches[0].match(/\[(.*?)\=(.*?)\]/i)) {
					tmp2 = [];
					Y.lang.each(sub_result_lst, function(itm){(itm.getAttribute(att[1])==(att[2].replace(/\'/ig,''))) && tmp2.push(itm);});
					sub_result_lst = tmp2;
				}

				//选择器过滤text,textarea,radio,checkbox,password,submit,reset
				//匹配  E[type = *]
				if(pseudo = matches[0].match(/\:(text|textarea|radio|checkbox|password|submit|reset)/i)){
					tmp2 = [];
					Y.lang.each(sub_result_lst, function(itm){(itm.type == pseudo[1]) && tmp2.push(itm);});
					sub_result_lst = tmp2;
					sub_result_lst = tmp2;
				}
				result_lst = result_lst.concat(sub_result_lst);
			}

			//伪类匹配 :first, :last, :even, :odd
			if(pseudo = matches[0].match(/\:(first|last|even|odd)/i)){
				switch(pseudo[1]){
					case 'first':
						result_lst = [result_lst[0]];
						break;
					case 'last':
						result_lst = [result_lst.pop()];
						break;
					case 'even':
						tmp2 = [];
						Y.lang.each(result_lst, function(itm, idx){idx%2 && tmp2.push(itm);});
						result_lst = tmp2;
						break;
					case 'odd':
						tmp2 = [];
						Y.lang.each(result_lst, function(itm, idx){idx%2 || tmp2.push(itm);});
						result_lst = tmp2;
						break;
				}
			}
		}

		//多模式命中（递归）
		else {
			for(var i=0; i<matches.length; i++){
				if(matches[i] != ' ' && matches[i] != '>'){
					if(i == 0){
						var _m = matches;
						result_lst = getElement(matches[i]);
						matches = _m;
					} else {
						if(!result_lst){return null;}
						var _m = matches;
						result_lst = getElement(matches[i], result_lst, matches[i-1]);
						matches = _m;
					}
				}
			}
		}
		return result_lst;
	};

	Y.querySelector = function(selector){
		var sp = _fix(selector);
		if(sp){
			return sp;
		}
		var arr = getElement.apply(null, arguments)[0];
		return arr;
	};

	Y.querySelectorAll = function(selector){
		var sp = _fix(selector);
		if(sp){
			return [sp];
		}
		return getElement.apply(null, arguments);
	}
})(YSL);
(function(Y){
	var _eventListDictionary = {};
	var _objSeqUID = 0;
	var _fnSeqUID = 0;

	var _Event = {
		/**
		 * 按键代码映射
		 *
		 * @namespace _Event.KEYS 里面包含了对按键的映射
		 * @type Object
		 */
		KEYS: {
			F1: 112,
			F2: 113,
			F3: 114,
			F4: 115,
			F5: 116,
			F6: 117,
			F7: 118,
			F8: 119,
			F9: 120,
			F10: 121,
			F11: 122,
			F12: 123,

			SHIFT: 16,
			CTRL: 17,
			ALT: 18,
			BACKSPACE: 8,
			TAB: 9,
			RETURN: 13,
			ESC: 27,
			SPACE: 32,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40,
			DELETE: 46
		},

		/**
		 * 事件绑定
		 *
		 * @param {DOM} obj 需要添加事件的页面对象
		 * @param {String} eventType 需要添加的事件
		 * @param {Function} fn 事件需要绑定到的处理函数
		 * @param {Array} argArray 参数数组
		 * @type Boolean
		 * @version 1.1 memory leak optimise by scorr
		 * @author zishunchen
		 * @return 是否绑定成功(true为成功，false为失败)
		 */
		add: function(obj, eventType, fn, argArray){
			var cfn,
				res = false, l,
				obj = Y.dom.one(obj).getDomNode();

			if (!obj){
				return res;
			}
			if (!obj.eventsListUID){
				obj.eventsListUID = "e" + (++_objSeqUID);
			}

			if (!(l = _eventListDictionary[obj.eventsListUID])){
				l = _eventListDictionary[obj.eventsListUID] = {};
			}

			if (!fn.__elUID){
				fn.__elUID = "e" + (++_fnSeqUID) + obj.eventsListUID;
			}

			if (!l[eventType]){
				l[eventType] = {};
			}

			if(typeof(l[eventType][fn.__elUID])=='function'){
				return false;
			}

			cfn = function(evt){
					var a = fn.apply(Y.dom.one(obj), !argArray ? [_Event.get(evt)]: ([_Event.get(evt)]).concat(argArray));
					return a;
				};

			if (obj.addEventListener){
				obj.addEventListener(eventType, cfn, false);
				res = true;
			} else if (obj.attachEvent){
				res = obj.attachEvent("on" + eventType, cfn);
			} else {
				res = false;
			}
			if (res){
				l[eventType][fn.__elUID] = cfn;
			}
			return res;
		},

		/**
		 * add shortcut
		 * @param {Dom} obj
		 * @param {String} keys
		 * @param {Function} fn
		 **/
		addShortcut: function(obj, keys, fn, eventTypes){
			var ko = {};
			Y.lang.each(keys.toLowerCase().split('+'), function(k){
				if(k.toCharCode())
				ko[k] = true;
			});

			var eventTypes = eventTypes || ['keypress'];
			Y.lang.each(eventTypes, function(et){
				_Event.add(obj, et, function(ev){
					//todo
					if(ko){
						v.toUpperCase().charCodeAt(0);
					}
				});
			});
		},

		/**
		 * 方法取消绑定
		 *
		 * @param {DocumentElement} obj 需要取消事件绑定的页面对象
		 * @param {String} eventType 需要取消绑定的事件
		 * @param {Function} fn 需要取消绑定的函数
		 * @return 是否成功取消(true为成功，false为失败)
		 * @type Boolean
		 * @example _Event.remove(Y.dom.one('#demo'),'click',hello);
		 */
		remove: function(obj, eventType, fn){
			var cfn = fn,
				res = false,
				l = _eventListDictionary,
				r,
				obj = Y.dom.one(obj).getDomNode();

			if (!fn){
				return this.purge(obj, eventType);
			}

			if (obj.eventsListUID && l[obj.eventsListUID]){
				l = l[obj.eventsListUID][eventType];
				if(l && l[fn.__elUID]){
					cfn = l[fn.__elUID];
					r = l;
				}
			}

			if (obj.removeEventListener){
				obj.removeEventListener(eventType, cfn, false);
				res = true;
			} else if (obj.detachEvent){
				obj.detachEvent("on" + eventType, cfn);
				res = true;
			} else {
				return false;
			}
			if (res && r && r[fn.__elUID]){
				delete r[fn.__elUID];
			}
			return res;
		},

		/**
		 * 取消全部某类型的方法绑定
		 *
		 * @param {DocumentElement} obj 需要取消事件绑定的页面对象
		 * @param {String} eventType 需要取消绑定的事件
		 * @example _Event.purge(Y.dom.get('demo'),'click');
		 * @return {Boolean} 是否成功取消(true为成功，false为失败)
		 */
		purge: function(obj, type){
			var l, obj = Y.dom.one(obj).getDomNode();
			if (obj.eventsListUID && (l = _eventListDictionary[obj.eventsListUID]) && l[type]){
				for (var k in l[type]){
					if (obj.removeEventListener){
						obj.removeEventListener(type, l[type][k], false);
					} else if (obj.detachEvent){
						obj.detachEvent('on' + type, l[type][k]);
					}
				}
			}
			if (obj['on' + type]){
				obj['on' + type] = null;
			}
			if (l){
				l[type] = null;
				delete l[type];
			}
			return true;
		},

		/**
		 * 根据不同浏览器获取对应的Event对象
		 *
		 * @param {Event} evt
		 * @return 修正过的Event对象, 同时返回一个修正button的自定义属性;
		 * @type Event
		 * @example _Event.get();
		 * @return Event
		 */
		get: function(evt){
			var evt = Y.W.event || evt,
				c,
				cnt;
			if(!evt && Y.W.Event){
				c = arguments.callee;
				cnt = 0;
				while(c){
					if((evt = c.arguments[0]) && typeof(evt.srcElement) != "undefined"){
						break;
					}else if(cnt > 9){
						break;
					}
					c = c.caller;
					++cnt;
				}
			}
			return evt;
		},

		/**
		 * 获得鼠标按键
		 *
		 * @param {Object} evt
		 * @example _Event.getButton(evt);
		 * @return {number} 鼠标按键 -1=无法获取event 0=左键 1= 中键 2= 右键
		 */
		getButton: function(evt){
			var e = this.get(evt);
			if (!e){
				return -1
			}

			/**
			if(!e.which && e.button){
				if(e.button & 1){
					e.which = 1;
				} else if(e.button & 2){
					e.which = 2;
				} else if(e.button & 4){
					e.which = 3;
				}
			}
			**/

			if (Y.ua.ie){
				return e.button - Math.ceil(e.button / 2);
			} else {
				return e.button;
			}
		},

		/**
		 * 返回事件触发的对象
		 *
		 * @param {Object} evt
		 * @example _Event.getTarget(evt);
		 * @return {object}
		 */
		getTarget: function(evt){
			var e = this.get(evt);
			if (e){
				return Y.dom.one(e.srcElement || e.target);
			} else {
				return null;
			}
		},

		/**
		 * 返回获得焦点的对象
		 *
		 * @param {Object} evt
		 * @example this.getCurrentTarget();
		 * @return {object}
		 */
		getCurrentTarget: function(evt){
			var e = this.get(evt);
			if (e){
			/**
			 * @default document.activeElement
			 */
				return  e.currentTarget || Y.D.activeElement;
			} else {
				return null;
			}
		},

		/**
		 * 禁止事件冒泡传播
		 *
		 * @param {Event} evt 事件，非必要参数
		 * @example _Event.cancelBubble();
		 */
		cancelBubble: function(evt){
			evt = this.get(evt);
			if (!evt){
				return false
			}
			if (evt.stopPropagation){
				evt.stopPropagation();
			} else {
				if (!evt.cancelBubble){
					evt.cancelBubble = true;
				}
			}
		},

		/**
		 * 取消浏览器的默认事件
		 *
		 * @param {Event} evt 事件，非必要参数
		 * @example _Event.preventDefault();
		 */
		preventDefault: function(evt){
			evt = _Event.get(evt);
			if (!evt){
				return false
			}
			if (evt.preventDefault){
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}
		},

		/**
		 * 获取事件触发时的鼠标位置x
		 *
		 * @param {Object} evt 事件对象引用
		 * @example _Event.mouseX();
		 */
		mousePos: function(evt){
			evt = this.get(evt);
			var x = evt.pageX || (evt.clientX + (Y.D.documentElement.scrollLeft || Y.D.body.scrollLeft));
			var y = evt.pageY || (evt.clientY + (Y.D.documentElement.scrollTop || Y.D.body.scrollTop));
			return {'x':x, 'y':y};
		},

		/**
		 * 获取事件RelatedTarget
		 * @param {Object} evt 事件对象引用
		 * @example _Event.getRelatedTarget();
		 */
		getRelatedTarget: function(ev){
			ev = this.get(ev);
			var t = ev.relatedTarget;
			if (!t){
				if (ev.type == "mouseout"){
					t = ev.toElement;
				} else if (ev.type == "mouseover"){
					t = ev.fromElement;
				}
			}
			return Y.dom.one(t);
		},

		/**
		 * 事件冒泡绑定
		 * @param  {string} selector
		 * @param  {String} eventType
		 * @param  {Function} handler
		 * @param  {DOM} pDom
		 */
		delegate: (function(){
			var check = function(n, selector){
				var found;
				Y.dom.all(selector).each(function(item){
					if(item && (item.contains(n) || item.equal(n))){
						found = item;
						return false;
					}
				});
				return found;
			};

			return function(pDom, selector, eventType, handler){
				var _this = this;
				var pDom = pDom || Y.dom.one('body');

				this.add(pDom, eventType, function(evt){
					var n = _this.getTarget(evt);
					while(n && n.getDomNode().nodeType == 1){
						if(found = check(n, selector)){
							handler.call(found, evt);
							return;
						}
						n = n.parent();
					}
				})
			}
		})()
	}

	Y.event = _Event;
})(YSL);

/**
 * YSL dom module
 * @include lang.js
 * @include core.js
 * @param {Object} YSL
 */
(function(Y){
	Y.dom = {};

	var PROP_KEYS = /^(scrollTop|scrollLeft)$/i;

	/**
	 * get scroll top
	 * @return {Object}
	 */
	Y.dom.getScroll= function(){
		var DE = Y.D.documentElement, BD = Y.D.body;
		return {
			top: Math.max(DE.scrollTop, BD.scrollTop),
			left: Math.max(DE.scrollLeft, BD.scrollLeft),
			height: Math.max(DE.scrollHeight, BD.scrollHeight),
			width: Math.max(DE.scrollWidth, BD.scrollWidth)
		};
	}

	/**
	 * insert stylesheet
	 * @param {string} rules
	 * @param {string} styleSheetID
	 * @return {DOM Element}
	 * @deprecate Y.dom.insertStyleSheet('* {margin:0;}');
	 */
	Y.dom.insertStyleSheet = function (rules, styleSheetID) {
		styleSheetID = styleSheetID || Y.guid();
		var node = Y.dom.one('#'+styleSheetID);
		if(!node){
			node = Y.dom.one('head').create('style').setAttr({id:styleSheetID, type:'text/css'});
		}

		node = node.getDomNode();
		if(node.styleSheet){
			node.styleSheet.cssText = rules;
		} else {
			 node.appendChild(Y.D.createTextNode(rules));
		}
		return node;
	};

	/**
	 * get window region info
	 * @return {Object}
	 */
	Y.dom.getWindowRegion = function(){
		var info = {};
		info.screenLeft = Y.W.screenLeft ? Y.W.screenLeft : Y.W.screenX;
		info.screenTop = Y.W.screenTop ? Y.W.screenTop : Y.W.screenY;

		//no ie
		if(Y.W.innerWidth){
			info.visibleWidth = Y.W.innerWidth;
			info.visibleHeight = Y.W.innerHeight;
			info.horizenScroll = Y.W.pageXOffset;
			info.verticalScroll = Y.W.pageYOffset;
		} else {
			//IE + DOCTYPE defined || IE4, IE5, IE6+no DOCTYPE
			var tag = (Y.D.documentElement && Y.D.documentElement.clientWidth) ?
				Y.D.documentElement : Y.D.body;
			info.visibleWidth = tag.clientWidth;
			info.visibleHeight = tag.clientHeight;
			info.horizenScroll = tag.scrollLeft;
			info.verticalScroll = tag.scrollTop;
		}

		var tag = (Y.D.documentElement && Y.D.documentElement.scrollWidth) ?
				Y.D.documentElement : Y.D.body;
		info.documentWidth = Math.max(tag.scrollWidth, info.visibleWidth);
		info.documentHeight = Math.max(tag.scrollHeight, info.visibleHeight);
		return info;
	}

	/**
	 * base dom class
	 */
	function _DOM(node){
		this._node = node;
	}

	/**
	 * get current dom node
	 * @return {Object}
	 */
	_DOM.prototype.getDomNode = function(){
		return this._node;
	}

	/**
	 * set current dom node
	 * @param {Object} node
	 */
	_DOM.prototype.setDomNode = function(node){
		this._node = node;
	}

	/**
	 * 检测两个节点是否相同
	 **/
	_DOM.prototype.equal = function(tag){
		return tag && this.getDomNode() == tag.getDomNode();
	};

	/**
	 * add css class
	 * @param {String} cls
	 * @return {Object}
	 */
	_DOM.prototype.addClass = function(cs){
		var tmp = [], _this = this;
		Y.lang.each(cs.split(' '), function(c){
			if(Y.string.trim(c) && !_this.existClass(c)){
				tmp.push(c);
			}
		});
		if(tmp.length){
			this.getDomNode().className += ' ' + tmp.join(' ');
		}
		return this;
	}

	/**
	 * check exist css classes
	 * @param {String} cs
	 * @return {Boolean}
	 */
	_DOM.prototype.existClass = function(cs){
		var exist = true;
		var cc = this.getDomNode().className;
		Y.lang.each(cs.split(' '), function(c){
			c = Y.string.trim(c);
			if(c && !(new RegExp('(\\s|^)' + c + '(\\s|$)')).test(cc)){
				exist = false;
				return false;
			}
		});
		return exist;
	}

	/**
	 * remove css classes
	 * @param {String} cls
	 * @return {Object}
	 */
	_DOM.prototype.removeClass = function(cs){
		var n = this.getDomNode(),
			cc = n.className,
			_this = this;
		Y.lang.each(cs.split(' '), function(c){
			c = Y.string.trim(c);
			if(_this.existClass(c)){
				var reg = new RegExp('(\\s|^)' + c + '(\\s|$)');
				cc = cc.replace(c, '');
			}
		});
		n.className = cc;
		return this;
	}

	/**
	 * toggle two css class
	 * @param {String} cls1
	 * @param {String} cls2
	 * @return {Boolean} toggle result
	 */
	_DOM.prototype.toggleClass = function(cls1, cls2){
		cls2 = cls2 || '';
		if(this.existClass(cls1)){
			this.removeClass(cls1).addClass(cls2);
			return true;
		} else {
			this.addClass(cls1).removeClass(cls2);
			return false;
		}
	}

	/**
	 * get html
	 * @return {String}
	 */
	_DOM.prototype.getHtml = function(){
		return this.getDomNode().innerHTML;
	}

	/**
	 * set html
	 * @param {String} s
	 * @return {Object}
	 */
	_DOM.prototype.setHtml = function(s){
		this.getDomNode().innerHTML = s;
		return this;
	}


	/**
	 * get value
	 * @return {String}
	 */
	_DOM.prototype.getValue = function(){
		return this.getDomNode().value || null;
	}

	/**
	 * set value
	 * @return {Object}
	 */
	_DOM.prototype.setValue = function(val){
		this.getDomNode().value = val;
		return this;
	}

	/**
	 * get attribute
	 * @return {String}
	 */
	_DOM.prototype.getAttr = function(a){
		var n = this.getDomNode();
		if(PROP_KEYS.test(a)){
			return n[a];
		}
		return n.getAttribute(a);
	}

	/**
	 * set or get attribute
	 * @param {String} a
	 * @param {Object} v
	 * @return {Object}
	 */
	_DOM.prototype.setAttr = function(a, v){
		var n = this.getDomNode();
		if(typeof(a) == 'string'){
			if(PROP_KEYS.test(a)){
				n[a] = v;
			} else {
				n.setAttribute(a, v);
			}
		} else {
			for(var i in a){
				try {
					if(PROP_KEYS.test(i)){
						n[i] = a[i];
					} else {
						n.setAttribute(i, a[i]);
					}
				} catch(ex){}
			}
		}
		return this;
	}

	/**
	 * get style by name
	 * @param {String} name
	 * @return {String}
	 */
	_DOM.prototype.getStyle = function(name){
		if(!this.isDomNode(this.getDomNode())){
			return null;
		}

		var convertName = {'float': Y.W.getComputedStyle ? 'cssFloat' : 'styleFloat'},
			node = this.getDomNode(),
			name = convertName[name] || name;
		if(Y.W.getComputedStyle){
			var cs = Y.W.getComputedStyle(node, null),
				value = node.style[name] || cs[name];
			if (value === undefined && (name == 'backgroundPositionX' || name == 'backgroundPositionY')) {
				value = node.style['backgroundPosition'] || cs['backgroundPosition'];
				value = value.split(' ')[+(name.slice(-1) == 'Y')];
			}
			return value;
		} else {
			var rOpacity = /opacity=([^)]*)/,
				value = node.style[name] || node.currentStyle[name],
				m;
			if(value === undefined && name == 'opacity') {
				value = (m = rOpacity.exec(node.currentStyle.filter)) ? parseFloat(m[1]) / 100 : 1;
			}
			return value;
		}
	}

	/**
	 * set style
	 * @param {String} name
	 * @param {String} value
	 * @return {Object}
	 */
	_DOM.prototype.setStyle = function(props, value){
		var tmp,
			node = this.getDomNode(),
			bRtn = true,
			w3cMode = (tmp = Y.D.defaultView) && tmp.getComputedStyle,
			rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;

		if (typeof(props) == 'string') {
			tmp = props;
			props = {};
			props[tmp] = value;
		}

		for (var prop in props) {
			value = props[prop];
			if (prop == 'float') {
				prop = w3cMode ? "cssFloat" : "styleFloat";
			} else if (prop == 'opacity') {
				value = value >= 1 ? (value / 100) : value;
				if (!w3cMode) { // for ie only
					prop = 'filter';
					value = 'alpha(opacity=' + Math.round(value * 100) + ')';
				}
			} else if (prop == 'backgroundPositionX' || prop == 'backgroundPositionY') {
				tmp = prop.slice(-1) == 'X' ? 'Y' : 'X';
				if (w3cMode) {
					var v = this.getStyle('backgroundPosition' + tmp);
					prop = 'backgroundPosition';
					typeof(value) == 'number' && (value = value + 'px');
					value = tmp == 'Y' ? (value + " " + (v || "top")) : ((v || 'left') + " " + value);
				}
			}
			if (typeof node.style[prop] != "undefined") {
				try {
					node.style[prop] = value + (typeof value === "number" && !rexclude.test(prop) ? 'px' : '');
					bRtn = bRtn && true;
				} catch(ex){
					//console.log('SET STYLE', ex);
				}
			} else {
				bRtn = bRtn && false;
			}
		}
		return bRtn;
	}

	/**
	 * remove style from cssText
	 * @param  {String} key
	 * @return {DOM}
	 */
	_DOM.prototype.removeStyle = function(key){
		var cssText = this.getDomNode().style.cssText;
		if(cssText && new RegExp('(\\s|^)' + key + '(\\s|:)', 'i').test(cssText)){
			var reg = new RegExp('(\\s|^)' + key + '[\\s]*:(.*?)(;|$)', 'ig');
			this.getDomNode().style.cssText = cssText.replace(reg, ' ');
		}
		return this;
	};

	/**
	 * check current item is visibile
	 * @return {boolean}
	 */
	_DOM.prototype.checkIsVisibile = function(){

	}

	/**
	 * show dom object(display block)
	 * @return {Object}
	 */
	_DOM.prototype.show = function(){
		this.getDomNode().style.display = 'block';
		return this;
	}

	/**
	 * hide dom object(display none)
	 * @return {Object}
	 */
	_DOM.prototype.hide = function(){
		this.getDomNode().style.display = 'none';
		return this;
	}

	/**
	 * toggle dom object(display none or block)
	 * @return {Object}
	 */
	_DOM.prototype.toggle = function(){
		this.getDomNode().style.display = this.getDomNode().style.display == 'none' ? '' : 'none';
		return this;
	}

	/**
	 * swap two dom tag
	 * @param {Object} tag
	 */
	_DOM.prototype.swap = function(tag){
		var tag = Y.dom.one(tag).getDomNode();
		if (this.getDomNode().swapNode) {
			this.getDomNode().swapNode(tag);
		} else {
			var prt = tag.parentNode,
				next = tag.nextSibling;
			if (next == this.getDomNode()) {
				prt.insertBefore(this.getDomNode(), tag);
			} else if (tag == this.nextSibling) {
				prt.insertBefore(tag, this.getDomNode());
			} else {
				this.parentNode.replaceChild(tag, this.getDomNode());
				prt.insertBefore(this.getDomNode(), next);
			}
		}
	}

	/**
	 * remove current dom node
	 * @param {Boolean} keepChild
	 */
	_DOM.prototype.remove = function(keepChild){
		var n = this.getDomNode(),
			p = n.parentNode;
		if(keepChild && n.hasChildNodes()){
			while(c = n.firstChild){
				p.insertBefore(c, n)
			}
		}
		p.removeChild(n);
		this.setDomNode();
	}

	/**
	 * remove all children
	 **/
	_DOM.prototype.removeAllChildren = function(){
		var n = this.getDomNode();
		while(n.hasChildNodes()){
			n.removeChild(n.lastChild);
		}
	};

	/**
	 * relocation to parent node
	 * @param mix mix tagName || function
	 * @return mix
	 */
	_DOM.prototype.parent = function(mix){
		var node = this.getDomNode();
		if(!node){
			return null;
		}

		var fn;
		if(typeof(mix) == 'string'){
			fn = function(n){
				return n.tagName.toLowerCase() == mix.toLowerCase();
			};
		} else if(mix){
			fn = mix;
		} else {
			return node.parentNode ? new _DOM(node.parentNode) : null;
		}
		var result;
		var p = node.parentNode;
		if(fn){
			while(p && p.parentNode && p.parentNode.nodeType != 9){
				if(fn(p)){
					return new _DOM(p);
				}
				p = p.parentNode;
			}
		} else {
			return p ? new _DOM(p) : null;
		}
	};

	/**
	 * get document from node
	 * @return {Document}
	 */
	_DOM.prototype.getDoc = function() {
		var n = this.getDomNode();
		if(!n){
			return Y.D;
		}
		return Y.ua.ie ? n['document'] : n['ownerDocument'];
	};

	/**
	 * get window
	 * @param  {Document} doc
	 * @return {Window}
	 */
	_DOM.prototype.getWin = function(doc) {
		if(!doc){
			doc = this.getDoc();
		}
		return doc.parentWindow || doc.defaultView;
	};

	/**
	 * get dom position information
	 * @return {Object}
	 */
	_DOM.prototype.getPosition = function(){
		var top = 0,
			left = 0,
			node = this.getDomNode();

		if(Y.D.documentElement.getBoundingClientRect && node.getBoundingClientRect) {
			var box = node.getBoundingClientRect(),
				oDoc = node.ownerDocument,
				_fix = Y.ua.ie ? 2 : 0; //ie & ff 2px bug
			top = box.top - _fix + Y.dom.getScroll().top;
			left = box.left - _fix + Y.dom.getScroll().left;
		}

		//only safari
		else {
			while (node.offsetParent) {
				top += node.offsetTop;
				left += node.offsetLeft;
				node = node.offsetParent;
			}
		}
		return {'left':left, 'top':top};
	}

	/**
	 * get size
	 * return {Object}
	 */
	_DOM.prototype.getSize = function(){
		var _fix = [0, 0], _this = this;
		Y.lang.each(['Left', 'Right', 'Top', 'Bottom'], function(v){
			_fix[v == 'Left' || v == 'Right' ? 0 : 1] += (parseInt(_this.getStyle('border'+v+'Width'),10)||0) +
				(parseInt(_this.getStyle('padding'+v),10)||0);
		});

		var _w = this.getDomNode().offsetWidth - _fix[0],
			_h = this.getDomNode().offsetHeight - _fix[1];
		return {width:_w, height:_h};
	}

	/**
	 * get region info
	 * @param string key
	 * @return {mix}
	 */
	_DOM.prototype.getRegion = function(key){
		var pos = this.getPosition(),
			size = this.getSize();
		var reg = {
			left: pos.left,
			top: pos.top,
			width: size.width,
			height: size.height
		};
		return key ? reg[key] : reg;
	}

	/**
	 * set relate position to target
	 * @param {Object} el
	 * @param {String} pos
	 * @return {Boolean}
	 */
	_DOM.prototype.setRelatePosition = function(el, pos){
		var curR = this.getRegion(),
			tagR = el.getRegion();

		var posArr = {
			'center': {top:(tagR.top + tagR.height/2 - curR.height/2), left:(tagR.left + tagR.width/2 - curR.width/2)},
			'inner-left-top': {top:tagR.top, left:tagR.left},
			'inner-left-middle': {top:(tagR.top + tagR.height/2 - curR.height/2), left:tagR.left},
			'inner-left-bottom': {top:(tagR.top + tagR.height - curR.height), left:tagR.left},
			'inner-right-bottom': {top:(tagR.top + tagR.height - curR.height), left:(tagR.left+tagR.width-curR.width)},
			'inner-right-middle': {top:(tagR.top + tagR.height/2 - curR.height/2), left:(tagR.left+tagR.width-curR.width)},
			'inner-right-top': {top:tagR.top, left:(tagR.left+tagR.width-curR.width)},
			'inner-top-middle': {top:tagR.top, left:(tagR.left + tagR.width/2 - curR.width/2)},
			'inner-bottom-middle': {top:(tagR.top + tagR.height - curR.height), left:(tagR.left + tagR.width/2 - curR.width/2)},

			'outer-left-top': {top:tagR.top, left:(tagR.left-curR.width)},
			'outer-left-middle': {top:(tagR.top+tagR.height/2-curR.height/2), left:(tagR.left-curR.width)},
			'outer-left-bottom': {top:(tagR.top + tagR.height - curR.height), left:(tagR.left-curR.width)},
			'outer-right-bottom': {top:(tagR.top + tagR.height - curR.height), left:(tagR.left+tagR.width)},
			'outer-right-middle': {top:(tagR.top + tagR.height/2 - curR.height/2), left:(tagR.left+tagR.width)},
			'outer-right-top': {top:tagR.top, left:(tagR.left+tagR.width)},
			'outer-top-left': {top:(tagR.top-curR.height), left:tagR.left},
			'outer-top-middle': {top:(tagR.top-curR.height), left:(tagR.left + tagR.width/2 - curR.width/2)},
			'outer-top-right': {top:(tagR.top-curR.height), left:(tagR.left + tagR.width - curR.width)},
			'outer-bottom-left': {top:(tagR.top+tagR.height), left:tagR.left},
			'outer-bottom-middle': {top:(tagR.top+tagR.height), left:(tagR.left + tagR.width/2 - curR.width/2)},
			'outer-bottom-right': {top:(tagR.top+tagR.height), left:(tagR.left + tagR.width - curR.width)},

			'outer-coner-left-top': {top:(tagR.top-curR.height), left:(tagR.left-curR.width)},
			'outer-coner-right-top': {top:(tagR.top-curR.height), left:(tagR.left+tagR.width)},
			'outer-coner-left-bottom': {top:(tagR.top+tagR.height), left:(tagR.left-curR.width)},
			'outer-coner-right-bottom': {top:(tagR.top+tagR.height), left:(tagR.left+tagR.width)}
		};
		return this.setStyle({position:'absolute',display:'block', top:posArr[pos].top, left:posArr[pos].left});
	};

	/**
	 * create child node
	 * @param {String} tp node type
	 * @param {Integer} pos position(0,...-1)
	 * @return {Object} node
	 */
	_DOM.prototype.create = function(tp, pos, pp){
		var p = (this.getDomNode() || Y.D.body);
		p = p.nodeType == 9 ? p = p.body : p;

		pos = (pos === undefined) ? -1 : parseInt(pos,10) || 0;
		var n = typeof(tp) == 'string' ? Y.D.createElement(tp) : tp;
		if(pos == -1){
			p.appendChild(n);
		} else {
			p.insertBefore(n, p.childNodes[pos]);
		}
		var d = new _DOM(n);
		if(pp){
			d.setAttr(pp);
		}
		return d;
	}

	/**
	 * batch append children
	 * @param DOM n
	 */
	_DOM.prototype.append = function(children){
		var result;
		var p = this.getDomNode();
		this.all(children).each(function(child){
			p.appendChild(child.getDomNode());
		});
		return result;
	};

	/**
	 * get children nodes
	 * @param {Integer} idx
	 * @return {Array}
	 */
	_DOM.prototype.getChildren = function(idx){
		var nodes = [], cns=this.getDomNode().childNodes;
	    for (var i = cns.length-1; i>=0; i--) {
	        if (cns[i].nodeName != '#text' && cns[i].nodeName != '#comment') {
	            nodes.unshift(new _DOM(cns[i]));
	        }
	    }
		return idx !== undefined ? nodes[idx] : nodes;
	}

	/**
	 * search dom chain by specified rule handler
	 * @param  {string} prop
	 * @param  {function} func
	 * @return {DOM}
	 */
	_DOM.prototype.searchChain = function(prop, func){
		prop = prop || 'parentNode';
		var ele = this.getDomNode();
		while (ele) {
			if (func.call(this, this)) {
				return this;
			}
			ele = ele[prop];
		}
		return null;
	}

	/**
	 * check node is dom node
	 * @param {Mix} node
	 * @return {Boolean}
	 */
	_DOM.prototype.isDomNode = function(node){
		return !!node.nodeType;
	}

	/**
	 * check node b is contain by current node
	 * @param {Mix} node
	 * @return {Boolean}
	 */
	_DOM.prototype.contains = function(b){
		var a = this.getDomNode(),
			b = b.getDomNode ? b.getDomNode() : b;
		if(b.nodeType == 9){
			return false;
		}
		return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
	}

	/**
	 * query on selector result
	 * @param  {String|Mix} selector
	 * @param  {DOM} context
	 * @param  {String} cond
	 * @return {Object|Null}
	 */
	_DOM.prototype.one = function(selector, context, cond){
		if(!selector){
			return null;
		}
		var context = context || this.getDomNode();
		if(typeof(selector) !== 'string'){
			return selector.getOneDomNode ? selector.getOneDomNode() : (selector.getDomNode ? selector : new _DOM(selector));
		}
		var selector = Y.querySelector(selector, context, cond);
		return selector ? new _DOM(selector) : null;
	};

	/**
	 * query all selector result
	 * @param  {String|Mix} selector
	 * @param  {DOM} context
	 * @param  {String} cond
	 * @return {Object}
	 */
	_DOM.prototype.all = function(selector, context, cond) {
		if(!selector){
			return new _DOMCollection([]);
		}
		if(typeof(selector) !== 'string'){
			return selector.getOneDomNode ? selector : (selector.getDomNode ? new _DOMCollection([selector.getDomNode()]) : new _DOM(selector));
		}
		var context = context || this.getDomNode();
		var result = Y.querySelectorAll(selector, context, cond);
		return new _DOMCollection(result);
	};


	/**
	 * extend event method
	 */
	var eventMapHash = {
		'removeEvent': 'remove',
		'on': 'add',
		'delegate': 'delegate'
	};
	for(var i in eventMapHash){
		(function(){
			var evMethod = eventMapHash[i];
			_DOM.prototype[i] = function(){
				var _tmpNode = this.getDomNode();
				var args = Y.lang.toArray(arguments);
				args.splice(0, 0, _tmpNode);
				return Y.event[evMethod].apply(Y.event, args);
			}
		})();
	};

	/**
	 * DOM Collection
	 */
	function _DOMCollection(domArray){
		this._nodes = domArray;
	}

	/**
	 * each extend
	 * @param  {Function} fn
	 */
	_DOMCollection.prototype.each = function(fn) {
		Y.lang.each(this._nodes, function(item, idx, col){
			return fn.call(null, new _DOM(item), idx, col);
		});
	};

	/**
	 * change current collection to array
	 * @return {Array}
	 */
	_DOMCollection.prototype.toArray = function() {
		var ret = [];
		Y.lang.each(this._nodes, function(item){
			ret.push(new _DOM(item));
		})
		return ret;
	};


	/**
	 * get one dom
	 * @return {_DOM}
	 */
	_DOMCollection.prototype.getOneDomNode = function(idx) {
		return new _DOM(this._nodes[idx||0]);
	};

	/**
	 * change current collection to dom array
	 * @return {Array}
	 */
	_DOMCollection.prototype.getAllDomNodes = function() {
		var ret = [];
		Y.lang.each(this._nodes, function(item){
			ret.push(item);
		})
		return ret;
	};

	/**
	 * extend _DOM method to _DOMCollection method
	 */
	Y.lang.each(_DOM.prototype, function(fn, method){
		_DOMCollection.prototype[method] = function(){
			var args = Y.lang.toArray(arguments);
			var ret = [];
			Y.lang.each(this._nodes, function(item){
				var _tmpNode = new _DOM(item);
				var r = _tmpNode[method].apply(_tmpNode, args);
				ret.push(r);
			});
			return ret;
		};
	});

	/**
	 * extend some from _DOM to Y.dom
	 * document || node method
	 */
	var _tmpDom = new _DOM(Y.D);
	var mapHash = ['one', 'all', 'create', 'getWin', 'delegate'];
	for(var i=0; i<mapHash.length; i++){
		(function(){
			var method = mapHash[i];
			Y.dom[method] = function(){
				var args = Y.lang.toArray(arguments);
				return _tmpDom[method].apply(_tmpDom, args);
			}
		})();
	};
})(YSL);
/**
 * YSL net module
 */
(function(Y){
	Y.net = {};
	var CACHE_DATA = {};

	/**
	 * 设置cache
	 * @param {String} key
	 * @param {Mix} data
	 * @param {Number} expired 过期时间（秒）
	 **/
	var setCache = function(key, data, expired){
		var expiredTime = (new Date()).getTime() + expired*1000;
		CACHE_DATA[key] = {data:data, expiredTime:expiredTime};
	};

	/**
	 * 获取cache
	 * @param {String} key
	 * @return {Mix}
	 **/
	var getCache = function(key){
		var time = new Date().getTime();
		if(CACHE_DATA[key] && CACHE_DATA[key].expired > time){
			return CACHE_DATA[key].data;
		} else {
			delete CACHE_DATA[key];
			return null;
		}
	};

	/**
	 * ajax请求组件
	 * @todo  组件暂时不处理跨域问题
	 **/
	Y.net.Ajax = (function(){
		/**
		 * 新建ajax组件对象
		 * @param {Object} config
		 **/
		var ajax = function(config){
			this.config = Y.object.extend(true, {
				url: null,			//请求url
				syn: false,			//是否为同步方法
				method: 'get',		//请求方法
				data: null,			//发送数据
				format: 'json',		//返回格式
				charset: 'utf-8',	//编码字符集
				cache: false		//是否cache
			}, config);

			if(!this.config.url){
				throw('NO REQUEST URL FOUND');
			}

			this.config.data = Y.net.buildParam(this.config.data);
			this.config.method = this.config.method.toLowerCase();
			this.config.format = this.config.format.toLowerCase();

			if (Y.W.XMLHttpRequest) {
				this.xmlObj = new XMLHttpRequest();
				if(this.xmlObj.overrideMimeType){
					this.xmlObj.overrideMimeType('text/xml');
				}
			} else if(Y.W.ActiveXObject){
				this.xmlObj = new ActiveXObject('Msxml2.XMLHTTP') || new ActiveXObject('Microsoft.XMLHTTP');
			} else {
				throw('browser no support ajax');
			}
		};

		/**
		 * 响应处理函数
		 * @param {Object} response
		 **/
		ajax.prototype.onResponse = function(response){
			if(!response || response.length == 0){
				this.onError();
				return;
			}

			var data = null;
			try {
				switch(this.config.format){
					case 'json' || 'javascript':
						eval('data = ' + response.responseText + ';');
						break;
					case 'xml':
						data = response.responseXML;
						break;
					case 'bool' || 'boolean':
						data = /yes|true|y/ig.test(ret.responseText)? true : false;
						break;
					default:
						data = response.responseText;
				}
			} catch(ex){}
			this.onResult(data);
		};

		/**
		 * 发送动作
		 **/
		ajax.prototype.send = function(){
			var _this = this;
			var cache_data = getCache(this.config.url);
			if(cache_data){
				this.onResponse(cache_data);
				return;
			}

			this.xmlObj.onreadystatechange = function(){
				if(_this.xmlObj.readyState == 4) {
					if(_this.xmlObj.status == 200){
						_this.onResponse(_this.xmlObj);
						setCache(_this.config.url, _this.xmlObj);
					} else {
						_this.onError(_this.xmlObj.status);
					}
				} else {
					if(_this.xmlObj.readyState == 0){
						_this.onReady();
					} else {
						_this.onLoading();
					}
				}
			};

			this.xmlObj.open(this.config.method, this.config.url, !this.config.syn);
			if(this.config.format == 'xml'){
				this.xmlObj.setRequestHeader('Content-Type','text/xml');
			} else {
				this.xmlObj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset='+this.config.charset);
			}

			if(this.config.method == 'GET'){
				param = null;
			}

			this.xmlObj.send(this.config.data);

			if(this.config.syn && this.xmlObj && this.xmlObj.status == 200){
				return this.callback(this.xmlObj);
			}
		};

		//附属额外处理事件
		ajax.prototype.onLoading = function(){};
		ajax.prototype.onResult = function(){};
		ajax.prototype.onError = function(){};
		ajax.prototype.onReady = function(){};
		ajax.prototype.onTimeout = function(){};
		return ajax;
	})();

	/**
	 * get 数据
	 * @param string url
	 * @param object data
	 * @param Function callback
	 * @param object option
	**/
	Y.net.get = function(url, data, callback, option){
		callback = callback || Y.emptyFn;
		option = Y.object.extend(true, {url:url}, option || {});
		option.method = 'get';
		var ajax = new Y.net.Ajax(option);
		ajax.onResponse = callback;
		ajax.send();
	};

	/**
	 * post 数据
	 * @param string url
	 * @param object data
	 * @param Function callback
	 * @param object option
	 **/
	Y.net.post = function(url, data, callback, option){
		callback = callback || Y.emptyFn;
		option = Y.object.extend(true, {url:url}, option || {});
		option.method = 'post';
		var ajax = new Y.net.Ajax(option);
		ajax.onResponse = callback;
		ajax.send();
	};

	/**
	 * 加载css样式表
	 * @param {string} url
	 * @param {function} callback 这里可能不准确
	 * @param {dom} doc
	 */
	Y.net.loadCss = function(url, callback, doc){
		setTimeout(function(){
			doc = doc || Y.D;
			callback = callback || YSL.emptyFn;
			var css = doc.createElement('link');
			css.rel = 'stylesheet';
			css.type = 'text/css';
			css.href = url;
			doc.getElementsByTagName('head')[0].appendChild(css);
			css.onreadystatechange = css.onload = callback();
		}, 0);
	};

	/**
	 * 加载脚本
	 **/
	(function(net){
		var LOADING = false;
		var FILES_QUEUE = [];
		var FILES_LOAD_MAP = {};

		/**
		 * 检测批量文件是否全部加载完成
		 * @param  {Array} fileInfoList
		 * @return {Boolean}
		 */
		var checkLoaded = function(fileInfoList){
			var loaded = true;
			Y.lang.each(fileInfoList, function(fileInfo){
				if(!FILES_LOAD_MAP[fileInfo.src] ||  FILES_LOAD_MAP[fileInfo.src].status != 3){
					loaded = false;
					return false;
				}
			});
			return loaded;
		};

		/**
		 * 批量加载脚本
		 * @param  {Array} fileInfoList 文件列表信息
		 * @param  {Function} allDoneCb  全部文件加载完成回调
		 */
		var batchLoadScript = function(fileInfoList, allDoneCb){
			if(checkLoaded(fileInfoList)){
				allDoneCb();
				return;
			}

			updateListToQueue(fileInfoList, function(){
				if(checkLoaded(fileInfoList)){
					allDoneCb();
				}
			});

			if(!LOADING){
				loadQueue();
			}
		};

		/**
		 * 更新当前要加载的文件到加载队列中
		 * @param  {Array} fileInfoList
		 * @param {Function} 断续回调
		 */
		var updateListToQueue = function(fileInfoList, tickerCb){
			Y.lang.each(fileInfoList, function(fileInfo){
				if(FILES_LOAD_MAP[fileInfo.src]){
					if(FILES_LOAD_MAP[fileInfo.src].status == 1 || FILES_LOAD_MAP[fileInfo.src].status == 2){
						FILES_LOAD_MAP[fileInfo.src].callbacks.push(tickerCb);
					} else if(FILES_LOAD_MAP[fileInfo.src].status == 3){
						tickerCb();
					} else if(FILES_LOAD_MAP[fileInfo.src].status == 4){
						tickerCb(-1);
					}
				} else {
					FILES_QUEUE.push(fileInfo);
					FILES_LOAD_MAP[fileInfo.src] = {
						status: 1,
						callbacks: [tickerCb]
					};
				}
			});
		};

		/**
		 * 加载队列中的脚本
		 */
		var loadQueue = function(){
			if(FILES_QUEUE.length){
				LOADING = true;
				var fileInfo = FILES_QUEUE.shift();
				FILES_LOAD_MAP[fileInfo.src].status = 2;
				forceLoadScript(fileInfo, function(){
					FILES_LOAD_MAP[fileInfo.src].status = 3;
					Y.lang.each(FILES_LOAD_MAP[fileInfo.src].callbacks, function(cb){
						cb();
					});

					//[fix] 防止ie下面的readyState多执行一次导致这里的callback多次执行
					FILES_LOAD_MAP[fileInfo.src].callbacks = [];
					loadQueue();
				});
			} else {
				LOADING = false;
			}
		};

		/**
		 * 强制加载脚本
		 * @param  {Object|String} fileInfo 文件信息，详细配置参考函数内实现
		 * @param  {Function} sucCb
		 * @return {Boolean}
		 */
		var forceLoadScript = function(fileInfo, sucCb){
			var option = Y.object.extend(true, {
				src: null,			//文件src
				charset: 'utf-8',	//文件编码
				'window': window
			}, fileInfo);

			if(!option.src){
				return false;
			}

			var doc = option.window.document;
			var docMode = doc.documentMode;
			var s = doc.createElement('script');
			s.setAttribute('charset', option.charset);

			Y.event.add(s, Y.ua.ie && Y.ua.ie < 10 ? 'readystatechange': 'load', function(){
				if(Y.ua.ie && s.readyState != 'loaded' && s.readyState != 'complete'){
					return;
				}
				setTimeout(function(){
					sucCb();
				}, 0);

				/**
				if(!s || Y.ua.ie && Y.ua.ie < 10 && ((typeof docMode == 'undefined' || docMode < 10) ? (s.readyState != 'loaded') : (s.readyState != 'complete'))){
					return;
				}
				sucCb();
				**/
			});
			s.src = option.src;
			(doc.getElementsByTagName('head')[0] || doc.body).appendChild(s);
		};

		/**
		 * 加载脚本
		 * @param  {Mix}   arg1     文件信息，支持格式：str || {src:str} || [str1,str2] || [{src: str1}, {src: str2}]
		 * @param  {Function} callback
		 */
		var loadScript = function(arg1, callback){
			var list = [];
			if(typeof(arg1) == 'string'){
				list.push({src:arg1});
			} else if(arg1.length){
				Y.lang.each(arg1, function(item){
					if(typeof(item) == 'string'){
						list.push({src: item});
					} else {
						list.push(item);
					}
				});
			} else {
				list.push(arg1);
			}
			batchLoadScript(list, callback);
		};
		Y.net.loadScript = loadScript;
	})(Y.net);


	/**
	 * 合并后台cgi请求url
	 * @deprecated 该方法不支持前台文件hash链接生成，如果要
	 * @param {string} url
	 * @param {mix} get1
	 * @param {mix} get2...
	 * @return {String}
	 */
	Y.net.buildParam = function(/**params1, params2...*/){
		var fixType = function(val){
			return typeof(val) == 'string' || typeof(val) == 'number';
		};
		var args = Y.lang.toArray(arguments), data = [];

		Y.lang.each(args, function(params){
			if(Y.lang.isArray(params)){
				data.push(params.join('&'));
			} else if(typeof(params) == 'object'){
				for(var i in params){
					if(fixType(params[i])){
						data.push(i+'='+encodeURIComponent(params[i]));
					}
				}
			} else if(typeof(params) == 'string') {
				data.push(params);
			}
		});
		return data.join('&').replace(/^[?|#|&]{0,1}(.*?)[?|#|&]{0,1}$/g, '$1');	//移除头尾的#&?
	};

	/**
	 * 合并参数
	 * @param {String} url
	 * @param {Mix..} params
	 * @return {String}
	 **/
	Y.net.mergeCgiUri = function(/**url, get1, get2...**/){
		var args = Y.lang.toArray(arguments);
		var url = args[0];
		url = url.replace(/(.*?)[?|#|&]{0,1}$/g, '$1');	//移除尾部的#&?
		args = args.slice(1);
		Y.lang.each(args, function(get){
			var str = Y.net.buildParam(get);
			if(str){
				url += (url.indexOf('?') >= 0 ? '&' : '?') + str;
			}
		});
		return url;
	};

	/**
	 * 合并cgi请求url
	 * @deprecated 该方法所生成的前台链接默认使用#hash传参，但如果提供的url里面包含？的话，则会使用queryString传参
	 * 所以如果需要使用?方式的话，可以在url最后补上?, 如：a.html?
	 * @param {string} url
	 * @param {mix} get1
	 * @param {mix} get2...
	 * @return {String}
	 */
	Y.net.mergeStaticUri = function(/**url, get1, get2...**/){
		var args = Y.lang.toArray(arguments);
		var url = args[0];
		args = args.slice(1);
		Y.lang.each(args, function(get){
			var str = Y.net.buildParam(get);
			if(str){
				url += /(\?|#|&)$/.test(url) ? '' : (/\?|#|&/.test(url) ? '&' : '#');
				url += str;
			}
		});
		return url;
	};

	/**
	 * get param
	 * @param  {string} param
	 * @return {string}
	 */
	Y.net.getParameter = function(param, url){
		var r = new RegExp("(\\?|#|&)"+param+"=([^&#]*)(&|#|$)");
	    var m = (url || location.href).match(r);
	    return (!m?"":m[2]);
	}
})(YSL);

(function(Y){
	/**
	 * ua info
	 * ua.ie || ua.opera || ua.safari || ua.firefox || ua.chrome
	 * ua.ver
	 * @return {mix}
	 */
	var uas = Y.W.navigator.userAgent.toLowerCase();	//useragent full string
	var b = {
		ie: !!Y.W.ActiveXObject,
		opera: !!Y.W.opera && Y.W.opera.version,
		webkit: uas.indexOf(' applewebkit/')> -1,
		air: uas.indexOf(' adobeair/')>-1,
		quirks: Y.D.compatMode == 'BackCompat',
		safari: /webkit/.test(uas) && !/chrome/.test(uas),
		firefox: /firefox/.test(uas),
		chrome: /chrome/.test(uas),
		userAgent: uas
	};

	var k = '';
	for (var i in b) {
		if(b[i]){ k = 'safari' == i ? 'version' : i; break; }
	}
	b.ver = k && RegExp("(?:" + k + ")[\\/: ]([\\d.]+)").test(uas) ? RegExp.$1 : "0";
	b.ver = b.ie ? parseInt(b.ver,10) : b.ver;

	//IE兼容模式检测
	if(b.ie){
		b.ie8Compat = Y.D.documentMode == 8;
		b.ie7Compat = (b.ie == 7 && !Y.D.documentMode) || Y.D.documentMode == 7;
		b.ie6Compat = b.ie < 7 && b.quirks;
	}

	if(b.ie && b.ver == 9){
		b.ver = Y.D.addEventListener ? 9 : 8;
	}
	if(b.ie){
		b['ie'+b.ver] = true;
	}
	b.isIE = function(v){
		return b.ie == v;
	};

	Y.ua = b;
})(YSL);
(function(Y){
	var PROTOTYPE_FIELDS = [
		'constructor',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'toLocaleString',
		'toString',
		'prototype',
		'valueOf'];

	var _Object = {
		/**
		 * bind function to obj
		 * @param {Object} obj
		 * @param {Function} fn
		 * @return {Function}
		 */
		bind: function(obj, fn){
			var slice = Array.prototype.slice;
			var args = slice.call(arguments, 2);
			return function(){
				var _obj = obj || this, _args = args.concat(slice.call(arguments, 0));
				if (typeof(fn) == 'string') {
					if (_obj[fn]) {
						return _obj[fn].apply(_obj, _args);
					}
				} else {
					return fn.apply(_obj, _args);
				}
			};
		},

		/**
		 * object router
		 * @param  {object} obj
		 * @param  {string} path path description, seperated by / or .
		 * @return {object}
		 */
		route: function(obj, path){
			obj = obj || {};
			path = String(path);
			var r = /([\d\w_]+)/g,
				m;
			r.lastIndex = 0;
			while ((m = r.exec(path)) !== null) {
				obj = obj[m[0]];
				if (obj === undefined || obj === null) {
					break;
				}
			}
			return obj;
		},

		/**
		 * 扩展object
		 * 不支持BOM || DOM || EY.t等浏览器对象，遇到此情况返回前一个
		 * 如果第一个参数为boolean，true用于表示为deepCopy，剩下参数做剩余的extend
		 * undefined,null 不可覆盖其他类型，类型覆盖以后面的数据类型为高优先级
		 * 标量直接覆盖，不做extend
		 * @return {Mix}
		 **/
		extend: function(/*true || obj, obj1[,obj2[,obj3]]**/){
			if(arguments.length < 2){
				throw('params error');
			}

			var args = Y.lang.toArray(arguments),
				result,
				deepCopy = false;

			if(Y.lang.getType(args[0]) == 'boolean'){
				deepCopy = args[0];
				args = args.slice(1);
			}

			result = args.pop();
			for(var i=args.length-1; i>=0; i--){
				var current = args[i];
				var _tagType = Y.lang.getType(result);

				//修正 object, null 情况
				if(_tagType == 'null' || _tagType == 'undefined'){
					result = current;
					continue;
				}

				//标量 || DOM || BOM 不做复制
				if(Y.lang.isScalar(result) || Y.lang.isBomOrDom(result)){
					continue;
				}

				//正常object、array, function复制
				for(var key in result){
					var item = result[key];
					if(deepCopy && typeof(item) == 'object'){
						current[key] = this.extend(false, item);	//这里仅处理当前仅支持两层处理
					} else {
						current[key] = item;
					}
				}

				//原型链复制
				for(var j=0; j<PROTOTYPE_FIELDS.length; j++){
					key = PROTOTYPE_FIELDS[j];
					if(Object.prototype.hasOwnProperty.call(result, key)){
						current[key] = result[key];
					}
				}
				result = current;
			}
			return result;
		}
	};

	Y.object = _Object;
})(YSL);

(function(Y){
	var _String = {}

	/**
	 * convert string to ascii code
	 * @param {string} str
	 * @return {string}
	 */
	_String.str2asc = function(str){
		return str.charCodeAt(0).toString(16);
	};

	/**
	 * repeat string
	 * @param {string} str
	 * @param {integer} n
	 * @return {string}
	 */
	_String.repeat = function(str, n){
		if(n>1){
			return new Array(n+1).join(str);
		}
		return str;
	};

	/**
	 * string trim
	 * @param {integer} iSide, 0:both, 1:left, 2:right
	 * @return {string}
	 */
	_String.trim = function(str, charlist){
		var whitespace, l = 0,
			i = 0;
		str += '';

		if (!charlist) {
			whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
		} else {
			charlist += '';
			whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
		}

		l = str.length;
		for (i = 0; i < l; i++) {
			if (whitespace.indexOf(str.charAt(i)) === -1) {
				str = str.substring(i);
				break;
			}
		}

		l = str.length;
		for (i = l - 1; i >= 0; i--) {
			if (whitespace.indexOf(str.charAt(i)) === -1) {
				str = str.substring(0, i + 1);
				break;
			}
		}
		return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
	};


	/**
	 * 解析str到obj
	 * @param {String} str
	 * @return {Object}
	**/
	_String.parseRequestStringToObjParam = function(str){
		if(typeof(str) != 'string' || !str){
			return str;
		}
		var data = {}, tmp, list = str.split('&');
		for(var i=0, len=list.length; i<len; ++i){
			tmp = list[i].split('=');
			data[tmp[0]] = tmp[1];
		}
		return data;
	};


	/**
	 * remove ubb code
	 * @param  {string} s source string
	 * @return {string}
	 */
	_String.removeUbb = function (s) {
        s = s.replace(/\[em\]e(\d{1,3})\[\/em\]/g, "");
        s = s.replace(/\[(img)\].*\[\/img\]/ig, "");
        s = s.replace(/\[(flash)\].*\[\/flash\]/ig, "");
        s = s.replace(/\[(video)\].*\[\/video\]/ig, "");
        s = s.replace(/\[(audio)\].*\[\/audio\]/ig, "");
        s = s.replace(/&nbsp;/g, "");
        s = s.replace(/\[\/?(b|url|img|flash|video|audio|ftc|ffg|fts|ft|email|center|u|i|marque|m|r|quote)[^\]]*\]/ig, "");
        return s;
    };

	/**
	 * convert ascii code to str
	 * @param {string} str
	 * @param {string}
	 */
	_String.asc2str = function(str){
		return String.fromCharCode(str);
	};

	/**
	 * encode str to ascii code
	 * @param {string} str
	 * @return {string}
	 */
	_String.ansiEncode = function(str){
		var ret = '',
			strSpecial = "!\"#$%&’()*+,/:;<=>?[]^`{|}~%",
			tt = "";
	    for(var i = 0; i < str.length; i++) {
	        var chr = str.charAt(i);
	        var c = _String.str2asc(chr);
	        tt += chr + ":" + c + "n";
	        if (parseInt("0x" + c) > 0x7f) {
	            ret += "%"+c.slice(0,2)+"%"+c.slice(-2);
	        } else {
	            if (chr == " ") {
					ret += "+";
				} else {
					ret += (strSpecial.indexOf(chr) != -1) ? ("%" + c.toString(16)) : chr;
				}
	        }
	    }
	    return ret;
	}

	/**
	 * decode ascii string
	 * @param {string} str
	 * @return {string}
	 */
	_String.ansiDecode = function(str){
		var ret = "";
	    for(var i=0; i<str.length; i++) {
	        var chr = str.charAt(i);
	        if(chr == "+") {
				ret += " ";
	        } else if(chr == "%") {
				var asc = str.substring(i + 1, i + 3);
				if (parseInt("0x" + asc) > 0x7f) {
					ret += _String.asc2str(parseInt("0x" + asc + str.substring(i + 4, i + 6)));
					i += 5;
				} else {
					ret += _String.asc2str(parseInt("0x" + asc));
					i += 2;
	            }
			} else {
				ret += chr;
			}
		}
	    return ret;
	}
	Y.string = _String;
})(YSL);

