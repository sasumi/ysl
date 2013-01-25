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
		widget:{}			//widget initialize
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
	 * @param {Function} moduleListStr
	 * @param {Object} option
	 **/
	Y.use = (function(){
		var DEF_SL;
		return function(moduleListStr, callback, option){
			callback = callback || Y.emptyFn;
			if(!Y.net){
				throw('NET MODULE REQUIRED');
			}

			if(!DEF_SL){
				DEF_SL = new Y.net.ScriptLoader();
			}

			var moduleList = [],
				tmpList = moduleListStr.split(',');
			for(var i=0; i<tmpList.length; i++){
				if(Y.string.trim(tmpList[i])){
					moduleList.push(Y.string.trim(tmpList[i]).replace(/^Y\.|^YSL\./i, ''));
				}
			}

			var doneCount = 0;
			var doneCheck = function(){
				if(doneCount == moduleList.length){
					callback(Y);
				}
			};

			Y.lang.each(moduleList, function(module){
				if(Y.object.route(Y, module)){
					doneCount++;
					doneCheck(Y);
				} else {
					var fileName = module.replace(/\./g, '/').toLowerCase() + '.js';
					var path = Y.ENV.getAbsUrl()+fileName;
					DEF_SL.add(path, option);
					DEF_SL.loadQueue(function(){
						doneCount++;
						doneCheck(Y);
					});
				}
			});
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
	//使用浏览器原生selector
	if(Y.D.querySelector && Y.D.querySelectorAll){
		Y.querySelector = function(selector, context){
			var dom = context || Y.D;
			return dom.querySelector(selector);
		};
		Y.querySelectorAll = function(selector, context){
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

	Y.querySelector = function(){
		var arr = getElement.apply(null, arguments)[0];
		return arr;
	};

	Y.querySelectorAll = function(){
		return getElement.apply(null, arguments);
	}
})(YSL);
/**
 * YSL dom module
 * @include lang.js
 * @include core.js
 * @param {Object} YSL
 */
(function(Y){
	Y.dom = {};

	/**
	 * get scroll top
	 * @return {Object}
	 */
	Y.dom.getScroll= function(){
		return {
			top: Math.max(Y.D.documentElement.scrollTop, Y.D.body.scrollTop),
			left: Math.max(Y.D.documentElement.scrollLeft, Y.D.body.scrollLeft),
			height: Math.max(Y.D.documentElement.scrollHeight, Y.D.body.scrollHeight),
			width: Math.max(Y.D.documentElement.scrollWidth, Y.D.body.scrollWidth)
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
		styleSheetID = styleSheetID || 'css_'+Math.random();
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
	 * add css class
	 * @param {String} cls
	 * @return {Object}
	 */
	_DOM.prototype.addClass = function(cls){
		this.getDomNode().className += !this.existClass(cls) ? (' ' + cls) : '';
		return this;
	}

	/**
	 * check exist css class
	 * @param {String} cls
	 * @return {Boolean}
	 */
	_DOM.prototype.existClass = function(cls){
		var e = new RegExp('(\\s|^)' + cls + '(\\s|$)').test(this.getDomNode().className);
		return e;
	}

	/**
	 * remove css class
	 * @param {String} cls
	 * @return {Object}
	 */
	_DOM.prototype.removeClass = function(cls){
		if(this.existClass(cls)){
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            this.getDomNode().className = this.getDomNode().className.replace(reg, ' ');
		}
		return this;
	}

	/**
	 * toggle two css class
	 * @param {String} cls1
	 * @param {String} cls2
	 * @return {Boolean} toggle result
	 */
	_DOM.prototype.toggleClass = function(cls1, cls2){
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
		return this.getDomNode().getAttribute(a);
	}

	/**
	 * set or get attribute
	 * @param {String} a
	 * @param {Object} v
	 * @return {Object}
	 */
	_DOM.prototype.setAttr = function(a, v){
		if(typeof(a) == 'string'){
			this.getDomNode().setAttribute(a, v);
		} else {
			for(var i in a){
				this.getDomNode().setAttribute(i, a[i]);
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
	 * @param {Function} fn
	 */
	_DOM.prototype.parent = function(fn){
		var result;
		var p = this.getDomNode().parentNode;
		if(fn){
			while(p && p.parentNode){
				if(fn(new _DOM(p))){
					return new _DOM(p);
				}
				p = p.parentNode;
			}
		} else {
			return new _DOM(p);
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
	 * @return {Object}
	 */
	_DOM.prototype.getRegion = function(){
		var pos = this.getPosition(),
			size = this.getSize();
		return {
			left: pos.left,
			top: pos.top,
			width: size.width,
			height: size.height
		}
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
	_DOM.prototype.create = function(tp, pos){
		var _this = (this.getDomNode() || Y.D.body);
		pos = (pos === undefined) ? -1 : parseInt(pos,10);
		var n = typeof(tp) == 'string' ? Y.D.createElement(tp) : tp;
		pos == -1 ? _this.appendChild(n) : _this.insertBefore(n, _this.childNodes[pos]);
		return new _DOM(n);
	}

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
		if(typeof(selector) !== 'string'){
			return selector.getOneDomNode ? selector : (selector.getDomNode ? new _DOMCollection([selector.getDomNode()]) : new _DOM(selector));
		}
		var context = context || this.getDomNode();
		var result = Y.querySelectorAll(selector, context, cond);
		return new _DOMCollection(result);
	};

	/**
	 * extends to add event
	 * @param {string} ev event
	 * @param {function} handler handler
	 * @param {mix} args extend arguments
	 */
	_DOM.prototype.addEvent = function(ev, handler, args){
		return Y.event.add(this.getDomNode(), ev, Y.object.bind(this, handler), args);
	};

	/**
	 * alias for addEvent
	 * @param  {String} ev
	 * @param  {Function} handler
	 * @param  {Mix} args
	 */
	_DOM.prototype.on = function(ev, handler, args){
		return Y.event.add(this.getDomNode(), ev, Y.object.bind(this, handler), args);
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
	 * extend _DOM method
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
	 * extend some document || node method
	 */
	var _tmpDom = new _DOM();
	var mapHash = ['one', 'all', 'create', 'getWin'];
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
		 * @param {DocumentElement} obj 需要添加事件的页面对象
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
				obj = obj.getNode ? obj.getDomNode(): obj;

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
					var a = fn.apply(obj, !argArray ? [_Event.get(evt)]: ([_Event.get(evt)]).concat(argArray));
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
			var eventTypes = eventTypes || ['keypress'];
			Y.lang.each(eventTypes, function(et){
				_Event.add(obj, et, function(ev){

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
				obj = obj.getNode ? obj.getDomNode(): obj;

			if (!obj){
				return res;
			}
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
			var l;
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
				return e.srcElement || e.target;
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
				} else {

				}
			}
			return t;
		},

		/**
		 * bind keyshortcut
		 * @param {dom} el
		 * @param {string} keyMap
		 * @param {function} fn
		 */
		addKeyEvent: function(el, keyMap, fn, evType){
			evType = evType || 'keydown';
			var ks = keyMap.split('+');
			var _this = this;
			var kmo = {ctrl:false, alt:false, shift:false};
			Y.lang.each(ks, function(k){
				k = k.toLowerCase();
				if(k == 'ctrl' || k == 'alt' || k == 'shift'){
					kmo[k] = true;
				} else if(k == 'enter'){
					kmo.keyCode == 13;
				} else if(parseInt(k,10)>10){
					kmo.keyCode = parseInt(k, 10);
				} else {
					kmo.keyCode == k.toUpperCase().charCodeAt(0);
				}
			});

			this.on(el, evType, function(ev){
				var evTag = _this.getTarget();
				if((kmo.ctrl != ev.ctrlKey) || (kmo.shift != ev.shiftKey) || (kmo.alt != ev.altKey) || evTag.tagName == 'INPUT' || evTag.tagName == 'BUTTON'){
					return;
				}
				if(kmo.keyCode == ev.keyCode){
					var result = fn(ev);
					if(result === false){
						_this.preventDefault();
						return false;
					}
				}
			});
		}
	}

	Y.event = _Event;
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
	 * flash请求组件
	 * @deprecated 需要在服务器部署crossdomain.xml
	 **/
	Y.net.flashSender = (function(){
		var GUID = 0;
		var FLASHSENDER_ID = '';
		var FLASHSENDER_OBJ = '';
		var FLASHSENDER_SRC = '';
		var FLASHSENDER_READY;
		var FLASHSENDER_INIT_CALLBACK_METHOD = 'FLASHSENDER_INIT_CALLBACK';
		var FLASHSENDER_CALLBACK_METHOD = 'FLASHSENDER_CALLBACK';
		var FLASHSENDER_CALLBACK_LIST = {};

		/**
		 * flash初始化状态回调标记
		 **/
		Y.W[FLASHSENDER_INIT_CALLBACK_METHOD] = function(){
			FLASHSENDER_READY = true;
			delete(Y.W[FLASHSENDER_INIT_CALLBACK_METHOD]);
		};

		/**
		 * flash响应回调
		 * @param {Object} params
		 **/
		Y.W[FLASHSENDER_CALLBACK_METHOD] = function(params){
			if(!params || !params.guid || !params.data){
				console.log('FLAHSSENDER ERROR', params);
				return;
			}

			if(FLASHSENDER_CALLBACK_LIST[params.guid]){
				FLASHSENDER_CALLBACK_LIST[params.guid](params.data);
				delete(FLASHSENDER_CALLBACK_LIST[params.guid]);
			}
		};

		var sender = function(config){
			this.config = Y.object.extend(true, {
				url: '',
				method: 'get',
				data: {},
				cache: false,
				format: 'json',
				guid: ++GUID
			}, config);
		};
		sender.initialize = function(){
			if(FLASHSENDER_READY){
				return;
			} else {
				Y.use('media', function(){
					//Y.media.insertFlash();

				});
			}
		};

		sender.prototype.onResponse = function(data){

		};

		sender.prototype.send = function(){

		};

		return sender;
	})();

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
		var ScriptLoader = function(){
			this.queue = [];
			this.lookup = {};
			this.callbackList = [];
			this.leftCount = 0;
		};

		ScriptLoader.prototype = {
			/**
			 * 加载javascript脚本
			 * @param {string} url
			 * @param {function} callback
			 * @param {object} config
			 */
			load: function (url, callback, conf) {
				var sc;
				conf = Y.object.extend({
					cache: 1,
					charset: 'utf-8',
					window: Y.W
				}, conf || {});

				function done() {
					callback && callback(url);
					if(sc.removeNode){
						sc.removeNode(true)
					} else {
						head.removeChild(sc);
					}
				};
				sc = conf.window.document.createElement('script');
				sc.setAttribute('charset', conf['charset']);
				sc.src = url;
				sc.onreadystatechange = sc.onload = function() {
					if (!sc.readyState || sc.readyState == "loaded" || sc.readyState == "complete") {
						done();
					}
				};
				var head = conf.window.document.getElementsByTagName('head')[0] || conf.window.document.body
				head.appendChild(sc);
			},

			/**
			 * 加载队列
			 * @param {Function} onAllDone
			 **/
			loadQueue: function (onAllDone) {
				var t = this;
				if(onAllDone){
					this.callbackList.push(onAllDone);
				}
				if (t.queue.length > 0) {
					var q = t.queue.shift();
					t.load(q.url, function () {
						t.leftCount--;

						//setTimeout去除模块多层嵌套问题
						setTimeout(function(){
							if(t.leftCount >0){
								t.loadQueue();
							} else {
								var cb;
								while(cb = t.callbackList.pop()){
									cb();
								}
							}
						}, 0);
					}, q.option);
					return;
				}
			},

			/**
			 * 单个添加
			 * @param {String} url
			 **/
			add: function (url, option) {
				if (this.lookup[url]){
					return;
				}
				this.lookup[url] = url;
				this.queue.push({'url':url, 'option':option});
				this.leftCount ++;
			},

			/**
			 * 批量添加
			 * @param {Array} urlList
			 **/
			addQueue: function(urlList){
				var _this = this;
				Y.lang.each(urlList, function(url){
					_this.add(url);
				});
			}
		};

		Y.net.ScriptLoader = ScriptLoader;
		var _scl = new ScriptLoader();
		Y.net.loadScript = _scl.load;
	})(Y.net);

	/**
	 * data getter
	 **/
	(function(net){
		var GUID = 0;
		var DataGetter = function(config){
			var _this = this;
			this.config = Y.object.extend(true, {
				url: null,
				callbacker: 'DataGetterCallback'+(GUID++)
			}, config);

			Y.W[this.config.callbacker] = function(data){
				if(!data){
					_this.onError();
				} else {
					_this.onResponse(data);
				}
				Y.W[_this.config.callbacker] = null;
				if(_this.tmpScriptNode){
					_this.tmpScriptNode.parentNode.removeChild(_this.tmpScriptNode);
				}
			};

			if(!this.config.url){
				throw('DATA GETTER PARAM ERROR');
			}
			this.config.url += (this.config.url.indexOf('?')>0 ? '&' : '?') + 'callback='+this.config.callbacker;
		};
		DataGetter.prototype.send = function(){
			this.tmpScriptNode = Y.net.loadScript(this.config.url, function(){
			}, this.config);
		};
		DataGetter.prototype.onError = function(){};
		DataGetter.prototype.onResponse = function(){};

		net.DataGetter = DataGetter;

		net.loadData = function(url, callback){
			var config = {url:url};
			var gd = new DataGetter(config);
				gd.onResponse = callback || Y.emptyFn;
				gd.send();
		};
	})(Y.net);

	/**
	 * 构造请求字符串
	 * @deprecated 当前params仅支持一层结构
	 * @param {Mix} objParam
	 * @return {String}
	**/
	Y.net.buildParam = function(){
		var fixType = function(val){
			return typeof(val) == 'string' || typeof(val) == 'number';
		};
		var data = [];
		Y.lang.each(arguments, function(params){
			if(Y.lang.isArray(params)){
				Y.lang.each(params, function(item){
					if(fixType(item)){
						data.push(item);
					}
				});
			} else if(typeof(params) == 'object'){
				for(var i in params){
					if(fixType(params[i])){
						data.push(i+'='+params[i]);
					}
				}
			} else {
				return params;
			}
		});
		return data.join('&');
	};

	/**
	 * 合并参数
	 * @param {String} url
	 * @param {Mix..} params
	 * @return {String}
	 **/
	Y.net.mergeRequest = function(url /** , params1, params2 **/){
		var params = Y.lang.toArray(arguments);
		if(params.length < 2){
			throw('params count illegle');
		}
		var str = Y.net.buildParam(params.slice(1));
		var url = params[0];
		return url + (url.indexOf('?') >= 0 ? '&' : '?') + str;
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


YSL.use('widget.Tween', function(Y){
	var SUPPORT_PROS_REG = /^(left|top|right|bottom|width|height|margin|padding|spacing|backgroundx|backgroundy)$/i;
	var STEP_FREQ = {
		'veryslow': 8,
		'slow': 2,
		'normal': 1,
		'fast': 0.5,
		'veryfast': 0.25
	};

	/**
	 * 简单动画库
	 * @param {Mix} tag
	 * @param {Object} config
	**/
	var Animate = function(tag, config){
		var _this = this;
		this.target = Y.dom.one(tag);
		this.config = Y.object.extend(true, {
			interval: 15,
			tween: 'Elastic.easeOut',
			from: {},
			to: {},
			speed: 'veryslow',
			step: null
		}, config);

		this.status = 0;	//0,1,2,3 normal, runing, pausing, finish
		this._t = 0;
		this._timer;

		this.onStart = this.onRuning = this.onPause = this.onResume = this.onFinish = Y.emptyFn;
		this.config.speed = this.config.speed.toLowerCase();

		if(Y.lang.isString(this.config.tween)){
			this.config.tween = Y.object.route(Y.widget.Tween, this.config.tween);
		}

		if(typeof(this.config.tween) != 'function' || !this.target){
			throw('PARAM ERROR IN ANIMATE');
		}

		Y.lang.each(this.config.to, function(val, key){
			if(SUPPORT_PROS_REG.test(key)){
				_this.config.from[key] = parseInt(_this.target.getStyle(key), 10);
				if(!_this.config.step){
					var f = Math.abs(Math.ceil((_this.config.to[key] - _this.config.from[key])/_this.config.interval));
					_this.config.step = Math.ceil(f*STEP_FREQ[_this.config.speed]);
				}
			}
		});
	};

	/**
	 * 运行
	**/
	Animate.prototype._run = function(){
		var _this = this;
		var b, c, d=this.config.step;
		var _run = function(){
			if(_this.status == 1){
				var newStyle = {};
				Y.lang.each(_this.config.to, function(item, key){
					c = item - _this.config.from[key];
					newStyle[key] = _this.config.tween(_this._t, _this.config.from[key], c, d);
				});
				_this.target.setStyle(newStyle);
				if(_this._t++ < d){
					_this.onRuning(_this._t);
					_this._timer = setTimeout(_run, _this.config.interval);
				} else {
					_this.onFinish();
					_this.status = 3;
				}
			}
		};
		_run();
	};

	/**
	 * 从初始状态开始
	**/
	Animate.prototype.start = function(){
		this.onStart();
		this.reset();
		this.status = 1;
		this._run();
	};

	/**
	 * 重设到初始态
	**/
	Animate.prototype.reset = function(){
		this.status = 0;
		this._t = 0;
		clearTimeout(this._timer);
		this.target.setStyle(this.config.from);
	};

	/**
	 * 停止动画
	 * @deprecate 与重设同样处理
	**/
	Animate.prototype.stop = function(){
		this.reset();
	};

	/**
	 * 暂停动画
	 * @deprecate 只有在动画运行中有效
	**/
	Animate.prototype.pause = function(){
		if(this.status == 1){
			this.status = 2;
			this.onPause();
		}
	};

	/**
	 * 恢复动画
	 * @deprecate 只有在动画暂停中有效
	**/
	Animate.prototype.resume = function(){
		if(this.status == 2){
			this.status = 1;
			this._run();
			this.onResume();
		}
	};

	Y.widget.Animate = Animate;
});

(function(Y){
	/**
	 * Tween 算法
	 * @param {Integer} t current time
	 * @param {Integer} b begin value
	 * @param {Integer} c change in value
	 * @param {Integer} d duration
	 */
	var Tween = {
	    Linear: function(t,b,c,d){ return c*t/d + b; },
	    Quad: {
	        easeIn: function(t,b,c,d){
	            return c*(t/=d)*t + b;
	        },
	        easeOut: function(t,b,c,d){
	            return -c *(t/=d)*(t-2) + b;
	        },
	        easeInOut: function(t,b,c,d){
	            if ((t/=d/2) < 1) return c/2*t*t + b;
	            return -c/2 * ((--t)*(t-2) - 1) + b;
	        }
	    },
	    Cubic: {
	        easeIn: function(t,b,c,d){
	            return c*(t/=d)*t*t + b;
	        },
	        easeOut: function(t,b,c,d){
	            return c*((t=t/d-1)*t*t + 1) + b;
	        },
	        easeInOut: function(t,b,c,d){
	            if ((t/=d/2) < 1) return c/2*t*t*t + b;
	            return c/2*((t-=2)*t*t + 2) + b;
	        }
	    },
	    Quart: {
	        easeIn: function(t,b,c,d){
	            return c*(t/=d)*t*t*t + b;
	        },
	        easeOut: function(t,b,c,d){
	            return -c * ((t=t/d-1)*t*t*t - 1) + b;
	        },
	        easeInOut: function(t,b,c,d){
	            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
	            return -c/2 * ((t-=2)*t*t*t - 2) + b;
	        }
	    },
	    Quint: {
	        easeIn: function(t,b,c,d){
	            return c*(t/=d)*t*t*t*t + b;
	        },
	        easeOut: function(t,b,c,d){
	            return c*((t=t/d-1)*t*t*t*t + 1) + b;
	        },
	        easeInOut: function(t,b,c,d){
	            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	            return c/2*((t-=2)*t*t*t*t + 2) + b;
	        }
	    },
	    Sine: {
	        easeIn: function(t,b,c,d){
	            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	        },
	        easeOut: function(t,b,c,d){
	            return c * Math.sin(t/d * (Math.PI/2)) + b;
	        },
	        easeInOut: function(t,b,c,d){
	            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	        }
	    },
	    Expo: {
	        easeIn: function(t,b,c,d){
	            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	        },
	        easeOut: function(t,b,c,d){
	            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	        },
	        easeInOut: function(t,b,c,d){
	            if (t==0) return b;
	            if (t==d) return b+c;
	            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
	            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	        }
	    },
	    Circ: {
	        easeIn: function(t,b,c,d){
	            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	        },
	        easeOut: function(t,b,c,d){
	            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	        },
	        easeInOut: function(t,b,c,d){
	            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	        }
	    },
	    Elastic: {
	        easeIn: function(t,b,c,d,a,p){
	            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
	            else var s = p/(2*Math.PI) * Math.asin (c/a);
	            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	        },
	        easeOut: function(t,b,c,d,a,p){
	            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
	            else var s = p/(2*Math.PI) * Math.asin (c/a);
	            return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
	        },
	        easeInOut: function(t,b,c,d,a,p){
	            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
	            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
	            else var s = p/(2*Math.PI) * Math.asin (c/a);
	            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	        }
	    },
	    Back: {
	        easeIn: function(t,b,c,d,s){
	            if (s == undefined) s = 1.70158;
	            return c*(t/=d)*t*((s+1)*t - s) + b;
	        },
	        easeOut: function(t,b,c,d,s){
	            if (s == undefined) s = 1.70158;
	            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	        },
	        easeInOut: function(t,b,c,d,s){
	            if (s == undefined) s = 1.70158;
	            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	        }
	    },
	    Bounce: {
	        easeIn: function(t,b,c,d){
	            return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
	        },
	        easeOut: function(t,b,c,d){
	            if ((t/=d) < (1/2.75)) {
	                return c*(7.5625*t*t) + b;
	            } else if (t < (2/2.75)) {
	                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	            } else if (t < (2.5/2.75)) {
	                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	            } else {
	                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	            }
	        },
	        easeInOut: function(t,b,c,d){
	            if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
	            else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
	        }
	    }
	};

	Y.widget.Tween = Tween;
})(YSL);
YSL.use('widget.masklayer', function(Y){
	Y.dom.insertStyleSheet([
		'.PopupDialog {position:absolute; top:20px; left:20px; width:350px; border:1px solid #999; background-color:white; box-shadow:0 0 10px #535658}',
		'.PopupDialog-hd {height:28px; background-color:#f3f3f3; border-bottom:1px solid #E5E5E5; cursor:move; position:relative;}',
		'.PopupDialog-hd h3 {font-size:12px; font-weight:bolder; color:gray; padding-left:10px; line-height:28px;}',
		'.PopupDialog-close {display:block; overflow:hidden; width:28px; height:28px; position:absolute; right:0; top:0; text-align:center; cursor:pointer; font-size:17px; font-family:Verdana; text-decoration:none; color:gray;}',
		'.PopupDialog-close:hover {color:blue}',
		'.PopupDialog-ft {background-color:#f3f3f3; white-space:nowrap; border-top:1px solid #e0e0e0; padding:5px 5px 5px 0; text-align:right;}',
		'.PopupDialog-bd {padding:20px;}',
		'.PopupDialog-bd-frm {border:none; width:100%}',
		'.PopupDialog-btn {display:inline-block; box-shadow:1px 1px #fff; text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.7); background:-moz-linear-gradient(19% 75% 90deg, #E0E0E0, #FAFAFA); background:-webkit-gradient(linear, left top, left bottom, from(#FAFAFA), to(#E0E0E0)); color:#4A4A4A; background-color:white; text-decoration:none; padding:0 15px; height:20px; line-height:20px; text-align:center; border:1px solid #ccd4dc; white-space:nowrap; border-radius:2px}',
		'.PopupDialog-btn:hover {background-color:#eee}',
		'.PopupDialog-btnDefault {}'].join(''), 'YSL_WIDGET_POPUP');

	var POPUP_COLLECTION = [];
	var ESC_BINDED = false;

	/**
	 * Popup class
	 * @constructor Popup
	 * @description popup dialog class
	 * @example new YSL.widget.Popup(config);
	 * @param {Object} config
	 */
	var Popup = function(cfg){
		this.container = null;
		this.status = 0;
		this.moving = false;
		this._constructReady = Y.emptyFn;
		this._constructed = false;
		this.onShow = Y.emptyFn;
		this.onClose = Y.emptyFn;

		this.config = Y.object.extend(true, {
			ID_PRE: 'popup-dialog-id-pre',
			title: '对话框',				//标题
			content: '测试',				//content.src content.id
			zIndex: 1000,					//高度
			width: 400,						//宽度
			moveEnable: true,				//框体可移动
			isModal: false,					//模态对话框
			topCloseBtn: true,				//是否显示顶部关闭按钮,如果显示顶部关闭按钮，则支持ESC关闭窗口行为
			showMask: true,
			keepWhileHide: false,			//是否在隐藏的时候保留对象
			cssClass: {
				dialog: 'PopupDialog',
				head: 'PopupDialog-hd',
				body: 'PopupDialog-bd',
				iframe: 'PopupDialog-bd-frm',
				container: 'PopupDialog-dom-ctn',
				foot: 'PopupDialog-ft'
			},
			buttons: [/*
				{name:'确定', handler:null},
				{name:'关闭', handler:null, setDefault:true}*/
			],
			sender: Y.emptyFn,	//data sender interface
			reciver: Y.emptyFn	//data reciver interface
		}, cfg);

		this.constructStruct();

		//ADD TO MONITER COLLECTION
		POPUP_COLLECTION.push(this);
	};

	/**
	 * contruct popup structure
	 */
	Popup.prototype.constructStruct = function(){
		var _this = this;

		//DOM Clone Mode
		if(!this.container){
			this.container = Y.dom.create('div').addClass(this.config.cssClass.dialog);
			this.container.setStyle('left', '-9999px');
		}
		this.container.id = this.config.ID_PRE + Math.random();

		//构建内容容器
		var content = '';
		if(typeof(this.config.content) == 'string'){
			content = '<div class="'+this.config.cssClass.body+'">'+this.config.content+'</div>';
		} else if(this.config.content.src){
			content = '<iframe allowtransparency="true" src="'+this.config.content.src+'" class="'+this.config.cssClass.iframe+'" frameborder=0></iframe>';
		} else {
			content = '<div class="' + this.config.cssClass.container + '"></div>';
		}

		//构建按钮
		var btn_html = '';
		if(this.config.buttons.length > 0){
			var btn_html = '<div class="'+this.config.cssClass.foot+'">';
			for(var i=0; i<this.config.buttons.length; i++){
				btn_html += '&nbsp;<a href="javascript:;" class="PopupDialog-btn'+(this.config.buttons[i].setDefault?' PopupDialog-btnDefault':'')+'">'+this.config.buttons[i].name+'</a>';
			}
			btn_html += '</div>';
		}

		//构建对话框框架
		var html = ([
				'<div class="PopupDialog-wrap">',
					'<div class="PopupDialog-Modal-Mask" style="position:absolute; height:0px; overflow:hidden; z-index:2; background-color:#ccc; width:100%"></div>',
					'<div class="',this.config.cssClass.head+'">',
						'<h3>',this.config.title,'</h3>',
						(this.config.topCloseBtn ? '<a class="PopupDialog-close" href="javascript:;">x</a>' : ''),
					'</div>',content,btn_html,
				'</div>'
			]).join('');
		this.container.setHtml(html);

		if(this.config.content.src){
			this.container.one('iframe').on('load', function(){
				//debugger;
				//Iframe+无指定固定宽高时 需要重新刷新size
				if(!_this.config.height){
					try {
						var ifr = this.getDomNode();
						var w = ifr.contentWindow;
						var d = w.document;
						var b = w.document.body;

						b.style.overflow = 'hidden';

						var info = {};
						if(w.innerWidth){
							//info.visibleWidth = w.innerWidth;
							info.visibleHeight = w.innerHeight;
						} else {
							var tag = (d.documentElement && d.documentElement.clientWidth) ?
								d.documentElement : d.body;
							//info.visibleWidth = tag.clientWidth;
							info.visibleHeight = tag.clientHeight;
						}
						var tag = (d.documentElement && d.documentElement.scrollWidth) ?
								d.documentElement : d.body;
						//info.documentWidth = Math.max(tag.scrollWidth, info.visibleWidth);
						info.documentHeight = Math.max(tag.scrollHeight, info.visibleHeight);

						//this.parentNode.parentNode.style.width = info.documentWidth + 'px';
						//w.frameElement.style.width = info.documentWidth + 'px';
						ifr.style.height = info.documentHeight + 'px';
						_this.container.setStyle('height', 'auto');
					} catch(ex){
						console.log(ex);
					}
				} else {
					var headRegion = Y.dom.one('.'+_this.config.cssClass.head).getRegion();
					this.setStyle('height', (_this.config.height - headRegion.height)+'px');
				}
				_this._constructed = true;
				_this._constructReady();
			});
		} else {
			//移动ID绑定模式的DOM对象【注意：这里移动之后，原来的元素就被删除了，为了做唯一性，这里只能这么干】
			if(this.config.content.id){
				Y.dom.one('#'+this.config.content.id).show();
				this.container.one('div.'+this.config.cssClass.container).getDomNode().appendChild(Y.dom.one('#'+this.config.content.id).getDomNode());
			}
			_this._constructed = true;
			this._constructReady();
		}
	};

	/**
	 * show popup
	 */
	Popup.prototype.show = function(){
		var _this = this;
		if(!this._constructed){
			this._constructReady = function(){
				_this.show();
			};
			return;
		}

		//CREATE MASK
		if(this.config.showMask){
			Y.widget.masklayer.show();
		}

		this.container.show();

		//CACULATE REGION INFO
		var region = Y.object.extend(true, this.container.getRegion(), this.config);
			region.minHeight = region.minHeight || 78;

		var scroll = YSL.dom.getScroll(),
			winRegion = YSL.dom.getWindowRegion(),
			top = left = 0;

		if(winRegion.visibleHeight > region.height){
			top = scroll.top + (winRegion.visibleHeight - region.height)/4;
		} else if(winRegion.documentHeight > region.height){
			top = scroll.top;
		}

		if(winRegion.visibleWidth > region.width){
			left = winRegion.visibleWidth/2 - region.width/2 - scroll.left;
		} else if(winRegion.documentWidth > region.width){
			left = scroll.left;
		}
		var calStyle = Y.object.extend(true, region,{left:left,top:top,zIndex:this.config.zIndex});
		this.container.setStyle(calStyle);

		//固定高度iframe设置高度
		if(this.config.content.src && this.config.height){
			var iframe = this.container.one('iframe');
			var headRegion = Y.dom.one('.'+this.config.cssClass.head).getRegion();
			iframe.setStyle('height', (this.config.height - headRegion.height)+'px');
		}

		this.onShow();
		this.status = 1;
		this.bindEvent();
		this.bindMoveEvent();
		this.bindEscCloseEvent();

		var hasOtherModalPanel = false;
		var _this = this;

		Y.lang.each(POPUP_COLLECTION, function(dialog){
			//有其他的模态对话框
			//调低当前对话框的z-index
			if(dialog != _this && dialog.status && dialog.config.isModal){
				_this.config.zIndex = dialog.config.zIndex - 1;
				hasOtherModalPanel = true;
				return false;
			} else if(_this != dialog && dialog.status && !dialog.config.isModal){
				if(dialog.config.zIndex > _this.config.zIndex){
					_this.config.zIndex = dialog.config.zIndex + 1;
				} else if(dialog.config.zIndex == _this.config.zIndex){
					_this.config.zIndex += 1;
				}
			}
		});

		this.container.setStyle('zIndex', this.config.zIndex);
		if(hasOtherModalPanel){
			this.setDisable();
		} else if(_this.config.isModal){
			//设置除了当前模态对话框的其他对话框所有都为disable
			Y.lang.each(POPUP_COLLECTION, function(dialog){
				if(dialog != _this && dialog.status){
					dialog.setDisable();
				}
			});
		}
	};

	/**
	 * set dialog operate enable
	 **/
	Popup.prototype.setEnable = function() {
		var mask = this.container.one('.PopupDialog-Modal-Mask');
		if(mask){
			mask.hide();
		}
	};

	/**
	 * set dialog operate disable
	 **/
	Popup.prototype.setDisable = function() {
		var size = this.container.getSize();
		var mask = this.container.one('.PopupDialog-Modal-Mask');
		mask.setStyle({height:size.height, opacity:0.4});
	};

	/**
	 * bind popup event
	 */
	Popup.prototype.bindEvent = function(){
		var _this = this;
		var topCloseBtn = this.container.one('a.PopupDialog-close');
		if(topCloseBtn){
			topCloseBtn.getDomNode().onclick = Y.object.bind(this, function(){
				this.close();
			});
		}

		this.container.all('a.PopupDialog-btn').each(function(btn, i){
			btn.on('click', function(){
				if(_this.config.buttons[i].handler){
					_this.config.buttons[i].handler.apply(this, arguments);
				} else {
					_this.close();
				}
			});
		});

		var defBtn = this.container.one('a.PopupDialog-btnDefault');
		if(defBtn){
			defBtn.getDomNode().focus();
		}

		var _this = this;
		this.container.on('mousedown', function(){_this.updateZindex();});
	}

	/**
	 * update dialog panel z-index property
	 **/
	Popup.prototype.updateZindex = function() {
		var _this = this;
		var hasModalPanel = false;
		Y.lang.each(POPUP_COLLECTION, function(dialog){
			if(dialog != _this && dialog.status && dialog.config.isModal){
				hasModalPanel = true;
				return false;
			} else if(dialog != _this && dialog.status){
				if(dialog.config.zIndex >= _this.config.zIndex){
					_this.config.zIndex = dialog.config.zIndex + 1;
				}
			}
		});
		if(hasModalPanel){
			return;
		}
		this.container.setStyle('zIndex', this.config.zIndex);
	}

	/**
	 * bind ESC close event
	 */
	Popup.prototype.bindEscCloseEvent = function(){
		if(ESC_BINDED){
			return;
		}
		ESC_BINDED = true;

		var _this = this;
		Y.event.add(Y.D, 'keyup', function(e){
			if(e.keyCode == Y.event.KEYS.ESC){
				var lastDialog = null;
				Y.lang.each(POPUP_COLLECTION, function(dialog){
					if(dialog.config.isModal && dialog.status && dialog.config.topCloseBtn){
						lastDialog = dialog;
						return false;
					} else if(dialog.status && dialog.config.topCloseBtn){
						if(!lastDialog || lastDialog.config.zIndex <= dialog.config.zIndex){
							lastDialog = dialog;
						}
					}
				});
				if(lastDialog){
					lastDialog.close();
				}
			}
		});
	}

	/**
	 * bind popup moving event
	 */
	Popup.prototype.bindMoveEvent = function(){
		if(!this.config.moveEnable){
			return;
		}
		var _this = this;
		var head = this.container.one('.'+this.config.cssClass.head);

		Y.event.add(Y.D, 'mousedown', function(e){
			var tag = Y.dom.one(Y.event.getTarget());
			if(!(tag == head || head.contains(tag))){
				return;
			}

			_this.moving = false;

			if((Y.ua.ie && (e.button == 1 || e.button == 0)) || e.button == 0){
				_this.moving = true;
			}

			if(_this.moving && (e.button == 1 || e.button == 0)){
				var conRegion = _this.container.getRegion();
				px = parseInt(e.clientX - conRegion.left);
				py = parseInt(e.clientY - conRegion.top);

				Y.event.add(Y.D, 'mousemove', function(e2){
					if(!_this.moving || Y.event.getButton(e2) !== 0){
						return false;
					}
					e2 = e2 || Y.W.event;
					var newLeft = e2.clientX - px,
						newTop = e2.clientY - py;
					newTop = newTop >= 0 ? newTop : 0;	//限制对话框不能被拖出窗口
					_this.container.setStyle({top:newTop,left:newLeft});
				});
			}
			Y.event.preventDefault();
			return false;
		});
		Y.event.add(Y.D, 'mouseup', function(){
			_this.moving = false;
		});
	}

	/**
	 * close current popup
	 */
	Popup.prototype.close = function(){
		if(this.onClose() === false){
			return;
		}
		this.container.hide();
		this.status = 0;

		var _this = this,
			hasDialogLeft = false,
			hasModalPanelLeft = false;

		Y.lang.each(POPUP_COLLECTION, function(dialog){
			if(dialog.status){
				hasDialogLeft = true;
			}
			if(dialog.status && dialog.config.isModal){
				hasModalPanelLeft = true;
				dialog.setEnable();
				return false;
			}
		});

		//没有显示的对话框
		if(!hasDialogLeft){
			Y.widget.masklayer.hide();
		}

		//剩下的都是普通对话框
		if(!hasModalPanelLeft){
			Y.lang.each(POPUP_COLLECTION, function(dialog){
				dialog.setEnable();
			});
		}

		if(!this.config.keepWhileHide){
			var tmp = [];
			Y.lang.each(POPUP_COLLECTION, function(dialog){
				if(dialog != _this){
					tmp.push(dialog);
				}
			});

			POPUP_COLLECTION = tmp;
			_this.container.remove();
			_this.container = null;
			_this = null;
		}
	}


	/**
	 * 关闭其他窗口
	 **/
	Popup.prototype.closeOther = function(){
		try {
			var _this = this;
			Y.lang.each(POPUP_COLLECTION, function(pop){
				if(pop != _this){
					pop.close();
				}
			});
		}catch(e){}
	};

	/**
	 * close all popup
	 * @see Popup#close
	 */
	Popup.closeAll = function(){
		try {
			Y.lang.each(POPUP_COLLECTION, function(pop){
				pop.close();
			});
		}catch(e){}
	}

	/**
	 * iframe innner resize method
	 */
	Popup.resizeIframe = function(){
		if(!Y.W.frameElement){
			return;
		}
		Y.dom.one(Y.W).on('load', function(){
			var wr = Y.dom.getWindowRegion();
			Y.D.body.style.overflow = 'hidden';
			Y.W.frameElement.style.height = wr.documentHeight +'px';
		});
	}

	Y.widget.Popup = Popup;
});

(function(Y){
	var TIP_CONTAINER = null;

	/**
	 * Show Tips
	 * @param {Mix} arg1
	 * @param {Integer} wtype
	 * @param {Integer} time
	 * @param {Function} closeCallback
	 */
	var Tip = function(arg1, wtype, time, closeCalllback){
		this.container = TIP_CONTAINER;
		var cfg = arg1;
		if(typeof(arg1) == 'string'){
			cfg = {
				'msg': arg1,
				'type': parseInt(wtype,10) || 0,
				'time': (time > 0 ? time*1000 : 2000)
			};
		}
		//extend default message config
		this.config = Y.object.extend({
			'msg': '',
			'type': 0,
			'time': 2000,
			'auto': true,
			'callback': closeCalllback
		}, cfg);

		//auto
		if(this.config.auto){
			this.show();
			if(this.config.time){
				setTimeout(Y.object.bind(this,function(){
					this.hide();
				}), this.config.time);
			}
		}
	};

	/**
	 * show tip
	 */
	Tip.prototype.show = function(){
		if(!this.container){
			this.container = TIP_CONTAINER = Y.dom.create('div').addClass('ysl-tip-container-wrap');
		}
		var html = ([
			'<span class="ysl-tip-container">',
				'<span class="ysl-tip-icon-',this.config.type,'"></span>',
				'<span class="ysl-tip-content">',this.config.msg,'</span>',
			'</div>'
		]).join('');

		//ie6 位置修正
		if(Y.ua.ie6){
			var viewP = Y.dom.getWindowRegion();
			this.container.setStyle('top',viewP.visibleHeight /2 + viewP.verticalScroll);
		}
		this.container.setHtml(html).show();
	};

	/**
	 * hide tip
	 */
	Tip.prototype.hide = function(){
		if(this.container){
			this.container.hide();
			this.config.callback && this.config.callback(this);
		}
	};

	/**
	 * hide all tip
	 */
	Tip.closeAll = function(){
		if(TIP_CONTAINER){
			TIP_CONTAINER.hide();
		}
	}

	/**
	 * destory tip container
	 */
	Tip.prototype.destory = function(){
		this.container.remove();
	};

	Y.widget.Tip = Tip;
})(YSL);
(function(Y){
	//使用到的正则表达式
	var REGEXP_COLLECTION = {
		REQUIRE: /^.+$/,									//必填
		CHINESE_ID: /^\d{14}(\d{1}|\d{4}|(\d{3}[xX]))$/,	//身份证
		PHONE: /^[0-9]{7,13}$/,								//手机+固话
		EMAIL: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,		//emali
		POSTCODE: /^[0-9]{6}$/,								//邮编
		AREACODE: /^0[1-2][0-9]$|^0[1-9][0-9]{2}$/,			//区号
		CT_PASSPORT: /^[0-9a-zA-Z]{5,40}$/,					//电信账号
		CT_MOBILE: /^(13|15|18)[0-9]{9}$/,					//中国电信号码
		QQ: /^\d{5,13}$/,
		TRIM: /^\s+|\s+$/g
	};

	var Validator = function(config){
		this.config = Y.object.extend(true, {
			form: '#frm',
			rules: {
				/**
				'name': {
					require: '请输入用户名称',
					max20: '最大长度为20个字符',
					min4: '最小长度为4个字符'
				},
				'password': {
					require: '请输入用户密码',
					min6: '最小长度为6个字符',
					max32: '最大长度为32个字符'
				},
				'date': {
					date: '请输入正确的日期格式'
				}
				**/
			},
			checkAllRules: false,
			breakOnError: false,
			onAllCheckPass: function(){return true;},
			onCheckPass: function(item){
				var pn = Y.dom.one(item.parentNode);
				var span = pn.one('span.msg') || pn.create('span').addClass('msg');
				span.addClass('pass').removeClass('error').setHtml('ok');
			},
			onError: function(item, errs){
				var err = errs[0];
				var pn = Y.dom.one(item.parentNode);
				var span = pn.one('span.msg') || pn.create('span').addClass('msg');
				span.addClass('error').removeClass('pass').setHtml(err);
			},
			resetError: function(form){
				Y.dom.one(form).all('span.msg').each(function(span){
					span.removeClass('pass').removeClass('error');
					span.setHtml('')
				});
			}
		}, config);

		this.elements = [];
		this.errors = {};

		if(!this.config.form || !this.config.rules){
			throw('validate need form & rules');
		}
		this.init();
	};

	/**
	 * 初始化
	 */
	Validator.prototype.init = function(){
		this.elements = Y.dom.one(this.config.form).getDomNode().elements;
		Y.dom.one(this.config.form).on('submit', Y.object.bind(this, function(){
			this.errors = {};
			this.config.resetError(this.config.form);
			var errorList = this.checkAll();

			if(!errorList || Y.lang.isEmptyObject(errorList)){
				return this.config.onAllCheckPass();		//check pass
			} else {
				Y.event.preventDefault();					//no pass
				return false;
			}
		}));
	};

	/**
	 * check all elements
	 */
	Validator.prototype.checkAll = function(){
		for(var i=0; i<this.elements.length; i++){
			var element = this.elements[i],
				name = this.elements[i].name;

			if(this.checkElementCompitable(element)){
				//跳过已经检查的radio
				if(element.type == 'radio' && this.errors[element.name]){
					continue;
				}

				var errs = this.checkItem(element, this.config.rules[name], this.config.checkAllRules);
				if(errs){
					this.errors[name] = errs;
					this.config.onError(element, errs);
					if(this.config.breakOnError){
						return;
					}
				} else {
					this.config.onCheckPass(element);
				}
			}
		}
		return this.errors;
	};

	/**
	 * check element is compitable for validate
	 * @param {Object} element
	 * @return {Boolean}
	 */
	Validator.prototype.checkElementCompitable = function(element){
		return element.tagName != 'FIELDSET' &&
			element.type != 'hidden' &&
			element.type != 'submit' &&
			element.type != 'button' &&
			element.type != 'reset' &&
			element.type != 'image';
	}

	/**
	 * check single item
	 * @param {Object} element
	 * @param {Object} rules
	 * @param {Boolean} checkAllRules
	 * @return {Array|Null} error
	 */
	Validator.prototype.checkItem = function(element, rules, checkAllRules){
		if(!rules){
			return null;
		}

		var errors = [],
			name = element.name;
		if(element.tagName == 'SELECT' || (element.tagName == 'INPUT' && (element.type == 'text' || element.type == 'password'))){
			var val = element.value.replace(REGEXP_COLLECTION.TRIM, '');
			for(var key in rules){
				var uKey = key.toUpperCase();
				//正则表命中
				if(REGEXP_COLLECTION[uKey]){
					if(!REGEXP_COLLECTION[uKey].test(val)){
						if(!checkAllRules){
							return [rules[key]];
						} else {
							errors.push(rules[key]);
						}
					}
				}

				//最大长度
				else if(uKey.indexOf('MAX') === 0){
					var len = parseInt(uKey.substr(3), 10);
					if(len > 0 && len < val.length){
						if(!checkAllRules){
							return [rules[key]];
						} else {
							errors.push(rules[key]);
						}
					}
				}

				//最小长度
				else if(uKey.indexOf('MIN') === 0){
					var len = parseInt(uKey.substr(3), 10);
					if(len > 0 && len > val.length){
						if(!checkAllRules){
							return [rules[key]];
						} else {
							errors.push(rules[key]);
						}
					}
				}

				//自定义正则表达式
				else if(uKey.indexOf('/') === 0){
					var reg = new RegExp(key);
					if(!reg.test(val)){
						if(!checkAllRules){
							return [rules[key]];
						} else {
							errors.push(rules[key]);
						}
					}
				}

				//函数模式
				else if(typeof(rules[key]) == 'function'){
					var ret = rules[key](val);
					if(ret){
						if(!checkAllRules){
							return [ret];
						} else {
							errors.push(ret);
						}
					}
				}
			}
		}

		//checkbox 模式仅有require模式
		else if(element.type == 'checkbox'){
			for(var key in rules){
				var uKey = key.toUpperCase();
				if(uKey == 'REQUIRE'){
					if(!element.checked){
						return [rules[key]];
					} else {
						return null;
					}
				}
			}
		}

		//radio 模式仅有require模式
		else if(element.type == 'radio'){
			for(var key in rules){
				var uKey = key.toUpperCase();
				if(uKey == 'REQUIRE'){
					if(!this.checkRadioChecked(element.name)){
						return [rules[key]];
					} else {
						return null;
					}
				}
			}
		}
		return errors.length ? errors : null;
	};

	/**
	 * 检查radio是否已经checked
	 * @param {String} name
	 * @return {Boolean}
	 */
	Validator.prototype.checkRadioChecked = function(name){
		for(var i=0; i<this.elements.length; i++){
			if(this.elements[i].name == name && !!this.elements[i].checked){
				return true;
			}
		}
		return false;
	}
	Y.widget.Validator = Validator;
})(YSL);