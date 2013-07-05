

(window.constructQZFL = function(){




//})();
/**
 * @fileOverview QZFL 主框架逻辑，<br/>
					Qzone Front-end Library: Liberation<br />
					QZFL 是由空间平台开发组，开发的一套js框架库。<br />
					QZFL 最后的 L 有两个意思，其中一个意思是 Library 功能库，说明这是一个前台的框架库;<br />
					同时 L 也是 Liberation 解放的意思，这是希望通过 QZFL 能把大家在JS开发工作中解放出来。
					QZFL各种合并版本都必须包含本源文件
 * @version 2.0.9.6 ($Rev: 1921 $)
 * @author QzoneWebGroup - ($LastChangedBy: ryanzhao $) - ($Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $)
 */

/**
 * QZFL名字空间
 * @namespace QZFL名字空间
 * @name QZFL
 */
window.QZFL = window.QZONE = window.QZFL || window.QZONE || {};

/**
 * 版本号说明字
 * @type string
 */
QZFL.version = "2.0.9.6";

/**
 * 版本号数字
 * @public
 * @type number
 */
QZFL._qzfl = 2.096;

/**
 * 定义一个通用空函数
 * @returns {undefined}
 */
QZFL.emptyFn = function() {};

/**
 * 定义一个通用透传函数
 * @param {number|string|object|function|undefined} [v = undefined]
 * @returns {number|string|object|function|undefined} 就是传入的v直接透传出来
 */
QZFL.returnFn = function(v) {
	return v;
};

/**
 * 浏览器判断引擎，给程序提供浏览器判断的接口
 * @namespace 浏览器判断引擎
 * @name userAgent
 * @memberOf QZFL
 */
(function(){
	var ua = QZFL.userAgent = {}, agent = navigator.userAgent, nv = navigator.appVersion, r, m, optmz;

	/**
	 * 调整浏览器的默认行为，使之优化
	 * @deprecated 已经不建议显式调用了，由QZFL初始化时调用
	 * @function
	 * @static
	 * @name adjustBehaviors
	 * @memberOf QZFL.userAgent
	 */
	ua.adjustBehaviors = QZFL.emptyFn;
	
	if (window.ActiveXObject) {//ie (document.querySelectorAll)
		/**
		 * IE版本号，如果不是IE，此值为 NaN
		 * @field
		 * @type number
		 * @static
		 * @name ie
		 * @memberOf QZFL.userAgent
		 */
		ua.ie = 9 - ((agent.indexOf('Trident/5.0') > -1) ? 0 : 1) - (window.XDomainRequest ? 0 : 1) - (window.XMLHttpRequest ? 0 : 1);

		/**
		 * 当前的IE浏览器是否为beta版本
		 * @field
		 * @type boolean
		 * @static
		 * @name isBeta
		 * @memberOf QZFL.userAgent
		 */
		ua.isBeta = navigator.appMinorVersion && navigator.appMinorVersion.toLowerCase().indexOf('beta') > -1;

		//一些浏览器行为矫正
		if (ua.ie < 7) {//IE6 背景图强制cache
			try {
				document.execCommand('BackgroundImageCache', false, true);
			} catch (ign) {}
		}

		//创建一个document引用
		QZFL._doc = document;

		//扩展IE下两个setTime的传参能力
		optmz = function(st){
				return function(fns, tm){
						var aargs;
						if(typeof fns == 'string'){
							return st(fns, tm);
						}else{
							aargs = Array.prototype.slice.call(arguments, 2);
							return st(function(){
									fns.apply(null, aargs);
								}, tm);
						}
					};
			};
		QZFL._setTimeout = optmz(window.setTimeout);
		QZFL._setInterval = optmz(window.setInterval);

	} else if (document.getBoxObjectFor || typeof(window.mozInnerScreenX) != 'undefined') {
		r = /(?:Firefox|GranParadiso|Iceweasel|Minefield).(\d+\.\d+)/i;

		/**
		 * FireFox浏览器版本号，非FireFox则为 NaN
		 * @field
		 * @type number
		 * @static
		 * @name firefox
		 * @memberOf QZFL.userAgent
		 */
		ua.firefox = parseFloat((r.exec(agent) || r.exec('Firefox/3.3'))[1], 10);
	} else if (!navigator.taintEnabled) {//webkit
		m = /AppleWebKit.(\d+\.\d+)/i.exec(agent);

		/**
		 * Webkit内核版本号，非Webkit则为 NaN
		 * @field
		 * @type number
		 * @static
		 * @name webkit
		 * @memberOf QZFL.userAgent
		 */
		ua.webkit = m ? parseFloat(m[1], 10) : (document.evaluate ? (document.querySelector ? 525 : 420) : 419);
		
		if ((m = /Chrome.(\d+\.\d+)/i.exec(agent)) || window.chrome) {

			/**
			 * Chrome浏览器版本号，非Chrome浏览器则为 NaN
			 * @field
			 * @type number
			 * @static
			 * @name chrome
			 * @memberOf QZFL.userAgent
			 */
			ua.chrome = m ? parseFloat(m[1], 10) : '2.0';
		} else if ((m = /Version.(\d+\.\d+)/i.exec(agent)) || window.safariHandler) {

			/**
			 * Safari浏览器版本号，非Safari浏览器则为 NaN
			 * @field
			 * @type number
			 * @static
			 * @name safari
			 * @memberOf QZFL.userAgent
			 */
			ua.safari = m ? parseFloat(m[1], 10) : '3.3';
		}

		/**
		 * 当前页面是否为air client
		 * @field
		 * @type boolean
		 * @static
		 * @name air
		 * @memberOf QZFL.userAgent
		 */
		ua.air = agent.indexOf('AdobeAIR') > -1 ? 1 : 0;

		/**
		 * 是否为iPad客户端页面
		 * @field
		 * @type boolean
		 * @static
		 * @name isiPad
		 * @memberOf QZFL.userAgent
		 */
		ua.isiPad = agent.indexOf('iPad') > -1;

		/**
		 * 是否为iPhone客户端页面
		 * @field
		 * @type boolean
		 * @static
		 * @name isiPhone
		 * @memberOf QZFL.userAgent
		 */
		ua.isiPhone = agent.indexOf('iPhone') > -1;
	} else if (window.opera) {//opera

		/**
		 * Opera浏览器版本号，非Opera则为 NaN
		 * @field
		 * @type number
		 * @static
		 * @name opera
		 * @memberOf QZFL.userAgent
		 */
		ua.opera = parseFloat(window.opera.version(), 10);
	} else {//默认IE6吧
		ua.ie = 6;
	}	

	/**
	 * 是否为MacOS
	 * @field
	 * @type boolean
	 * @static
	 * @name macs
	 * @memberOf QZFL.userAgent
	 */
	if (!(ua.macs = agent.indexOf('Mac OS X') > -1)) {

		/**
		 * Windows操作系统版本号，不是的话为NaN
		 * @field
		 * @type number
		 * @static
		 * @name windows
		 * @memberOf QZFL.userAgent
		 */
		ua.windows = ((m = /Windows.+?(\d+\.\d+)/i.exec(agent)), m && parseFloat(m[1], 10));

		/**
		 * 是否Linux操作系统，不是的话为false
		 * @field
		 * @type boolean
		 * @static
		 * @name linux
		 * @memberOf QZFL.userAgent
		 */
		ua.linux = agent.indexOf('Linux') > -1;
	}
})();

/**
 * QZFL对Javascript Object的接口封装，提供一些原生能力
 * @namespace 对象基础处理
 */
QZFL.object = {

	/**
	 * 把命名空间的方法映射到全局
	 * @param {object} object 对象
	 * @param {object} [scope=window] 目标空间
	 * @deprecated 不推荐常使用，避免变量名冲突

	 * @example
	 * QZFL.object.map(QZFL.lang)
	 */
	map : function(object, scope) {
		return QZFL.object.extend(scope || window, object);
	},

	/**
	 * 命名空间功能扩展
	 * @param {object} namespace 需要被扩展的命名空间
	 * @param {object} extendModule 需要扩展的功能包
	 * @returns {object} 返回被扩展的命名空间，即扩展后的namespace

	 * @example
	 * QZFL.object.extend(QZFL.dialog, { fn1: function(){} } );
	 */
	extend : function() {
		var args = arguments,
			len = arguments.length,
			deep = false,
			i = 1,
			target = args[0],
			opts,
			src,
			clone,
			copy;

		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}

		if ( typeof target !== "object" && typeof target !== "function" ) {
			target = {};
		}

		if ( len === i ) {
			target = QZFL;
			--i;
		}

		for ( ; i < len; i++ ) {
			if ( (opts = arguments[ i ]) != null ) {
				for (var name in opts ) {
					src = target[ name ];
					copy = opts[ name ];

					if ( target === copy ) {
						continue;
					}

					if ( deep && copy && typeof copy === "object" && !copy.nodeType ) {

						if ( src ) {
							clone = src;
						} else if ( QZFL.lang.isArray(copy) ) {
							clone = [];
						} else if ( QZFL.object.getType(copy) === 'object' ) {
							clone = {};
						} else {
							clone = copy;
						}

						target[ name ] = QZFL.object.extend( deep, clone, copy );

					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		return target;
	},
	
	/**
	 * 对对象成员批量执行一个操作
	 *
	 * @param {object} obj 被操作对象对象
	 * @param {function} callback 所执行的操作
	 * @returns {object} 传入的obj对象

	 * @example
	 * QZFL.object.each([1,2,3], function(){ alert(this) } );
	 */
	each : function(obj, callback) {
		var value,
			i = 0,
			length = obj.length,
			isObj = (length === undefined) || (typeof(obj)=="function");
		if (isObj) {
			for (var name in obj) {
				if (callback.call(obj[name], obj[name], name, obj) === false) {
					break;
				}
			}
		} else {
			for (value = obj[0]; i < length && false !== callback.call(value, value, i, obj); value = obj[++i]) { }
		}
		return obj;
	},

	/**
	 * 获取对象类型
	 *
	 * @param {object} obj 任意一个数据
	 * @return {string} 返回对象类型字符串

	 * @example
	 * QZFL.object.getType([1,2,3]);
	 */
	getType : function(obj) {
		return obj === null ? 'null' : (obj === undefined ? 'undefined' : Object.prototype.toString.call(obj).slice(8, -1).toLowerCase());
	},
	
	/**
	 * route用到的正则对象
	 * @field
	 * @static
	 * @private
	 * @type RegExp
	 * @default /([\d\w_]+)/g
	 */
	routeRE : /([\d\w_]+)/g,
	
	/**
	 * 用对象路径取一个JSON对象中的子对象引用
	 * @static
	 * @param {object} obj 源对象
	 * @param {string} path 对象获取路径
	 * @returns {object|string|number|function}

	 * @example
	 * QZFL.object.route(
	           { "a" : 
			       { "b" :
				       { "c" : "Hello World"
					   }
			       }
			   },
			   "a.b.c"
	       ); //返回值："Hello World"
	 */
	route: function(obj, path){
		obj = obj || {};
		path = String(path);

		var r = QZFL.object.routeRE,
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
	 * 将方法绑定在对象上，能够保护this指针不会“漂移”
	 * @param {object} obj 母体对象
	 * @param {object} fn 目标方法

	 * @example var e = QZFL.event.bind(objA, funB);
	 */
	bind : function(obj, fn) {
		var slice = Array.prototype.slice,
			args = slice.call(arguments, 2);

		return function(){
			obj = obj || this;
			fn = typeof fn == 'string' ? obj[fn] : fn;
			fn = typeof fn == 'function' ? fn : QZFL.emptyFn;
			return fn.apply(obj, args.concat(slice.call(arguments, 0)));
		};
	},

	/**
	 * 把指定命名空间下的方法 以短名的方式 映射到另一个命名空间
	 * @param {object} src 源对象
	 * @param {object} tar 目标对象
	 * @param {function} [rule=function(name){ return '$' + name; }] 映射名字的处理器
	 * @returns {undefined}
	 */
	ease : function(src, tar, rule){
		if (tar) {
			if (typeof(rule) != 'function') {
				rule = QZFL.object._eachFn;
			}
			QZFL.object.each(src, function(v, k){
				if (typeof(v) == 'function') {
					tar[rule(k)] = v;
				}
			});
		}
	},
	
	/**
	 * QZFL.object.ease 的命名映射默认方案
	 * @param {string} name 源名
	 * @returns {string} 转换后的名字
	 * @private
	 */
	_easeFn : function(name){
		return '$' + name;
	}
};



/**
 * QZFL对Javascript Object的接口封装，提供一些原生能力
 * @namespace 对象基础处理
 * @deprecated 建议不要用这个了，用QZFL.object中的相关方法
 */
QZFL.namespace = QZFL.object;

/**
 * QZFL 调试引擎接口，为调试提供接入的可能
 * @namespace QZFL调试引擎接口
 */
QZFL.runTime = {

	/**
	 * 是否处于debug模式
	 * @field
	 * @static
	 * @type boolean
	 * @default false
	 */
	isDebugMode : false,

	/**
	 * 错误报告接口
	 * @function
	 * @static
	 * @type function
	 * @default QZFL.emptyFn
	 */
	error : QZFL.emptyFn,

	/**
	 * 警告信息报告接口
	 * @function
	 * @static
	 * @type function
	 * @default QZFL.emptyFn
	 */
	warn : QZFL.emptyFn
};

//---------------------------------------------

/**
 * qzfl 控制台，用于显示调试信息以及进行一些简单的脚本调试等操作
 * @namespace QZFL控制台接口，用来显示程序输出的log信息。
 */
QZFL.console = function(expr){
	if (window.console) {
		if (console.assert) {
			console.assert.apply(null, arguments);
		} else {
			expr || console.log.apply(null, slice.call(arguments, 1));
		}
	}
};

/**
 * 在console里显示信息
 * @param {string} msg 要输出log的信息
 * @returns {undefined}
 */
QZFL.console.print = function(msg){
	window.console && console.log(msg);
};

//----------------------------------------------

/**
 * 各种功能各异的组件代码
 * @namespace QZFL小组件包
 *
 */
QZFL.widget = {};

//----------------------------------------------

//把QZFL.object下的方式直接映射到QZFL命名空间下
QZFL.object.map(QZFL.object, QZFL);

/**
 * @fileoverview QZFL全局配置文件
 * @version $Rev: 1921 $
 * @author QzoneWebGroup - ($LastChangedBy: ryanzhao $) - ($Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $)
 */



/**
 *  QZFL配置，用来存储QZFL一些组件需要的参数
 * @namespace QZFL配置
 */
QZFL.config = {
	/**
	 * 调试等级
	 * @type number
	 * @default 0
	 */
	debugLevel : 0,
	/**
	 * 默认与后台交互的编码
	 *
	 * @type string
	 * @default "GB2312"
	 */
	defaultDataCharacterSet : "GB2312",

	/**
	 * dataCenter中cookie存储的默认域名
	 *
	 * @type string
	 * @default "qzone.qq.com"
	 */
	DCCookieDomain : "qzone.qq.com",

	/**
	 * 系统默认一级域名
	 *
	 * @type string
	 * @default "qq.com"
	 */
	domainPrefix : "qq.com",
	
	/**
	 * 默认主域名
	 *
	 */
	domain : 'qzs.qq.com',
	
	/**
	 * 默认cookie free主域名
	 *
	 */
	resourceDomain : 'qzonestyle.gtimg.cn'
};



/**
 * XHR proxy的gbencoder dictionary路径(需要复写)
 *
 * @type string
 * @default "http://qzs.qq.com/qzone/v5/toolpages/"
 */
QZFL.config.gbEncoderPath = "http://" + QZFL.config.domain + "/qzone/v5/toolpages/";

/**
 * FormSender的helper page(需要复写)
 *
 * @type string
 * @default "http://qzs.qq.com/qzone/v5/toolpages/fp_gbk.html"
 */
QZFL.config.FSHelperPage = "http://" + QZFL.config.domain + "/qzone/v5/toolpages/fp_gbk.html";

/**
 * 默认flash ShareObject地址
 * @type string
 * @default "http://qzs.qq.com/qzone/v5/toolpages/getset.swf"
 */
QZFL.config.defaultShareObject = "http://" + QZFL.config.resourceDomain + "/qzone/v5/toolpages/getset.swf";

/**
 * 默认静态页的server地址
 * @type string
 * @default "http://qzs.qq.com/ac/qzone/qzfl/lc/"
 */
QZFL.config.staticServer = "http://" + QZFL.config.resourceDomain + "/ac/qzone/qzfl/lc/";

/**
 * @fileoverview QZFL样式处理,提供多浏览器兼容的样式表处理
 * @version $Rev: 1921 $
 * @author QzoneWebGroup ($LastChangedBy: ryanzhao $) - $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */



/**
 * QZFL css 工具包，给浏览器提供基本的样式处理接口
 *
 * @namespace QZFL css 工具包
 */
QZFL.css = {
	/**
	 * 用以匹配样式类名的正则池
	 * @private
	 * @deprecated 没啥大用
	 * @type object
	 */
	classNameCache: {},

	/**
	 * 获取用以匹配样式类名的正则
	 *
	 * @param {string} className 样式名称
	 * @returns {RegExp} 用以匹配的正则表达式规则
	 * @private
	 * @deprecated 没啥大用
	 */
	getClassRegEx: function(className){
		var o = QZFL.css.classNameCache;
		return o[className] || (o[className] = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)'));
	},
	
	/**
	 * 把16进制的颜色转换成10进制颜色的工具
	 * @param {string} color 十六进制颜色文本
	 * @returns {number[]} 返回数组形式的10进制颜色

	 * @example QZFL.css.convertHexColor("#ff00ff") //[255, 0, 255];
	 */
	convertHexColor: function(color){
		color = String(color || '');
		color.charAt(0) == '#' && (color = color.substring(1));
		color.length == 3 && (color = color.replace(/([0-9a-f])/ig, '$1$1'));
		return color.length == 6 ? [parseInt(color.substr(0, 2), 16), parseInt(color.substr(2, 2), 16), parseInt(color.substr(4, 2), 16)] : [0, 0, 0];
	},
	
	/**
	 * 缓存当前页面的样式表对象引用的池
	 *
	 * @private
	 * @type object
	 * @deprecated 不要再用了
	 */
	styleSheets: {},
	
	/**
	 * 通过id号获取样式表
	 * @param {string|number} id 样式表的编号
	 * @returns {object} 返回样式表对象，没有匹配则为null

	 * @example QZFL.css.getStyleSheetById("div_id");
	 */
	getStyleSheetById: function(id){
		var s;
		return (s = QZFL.dom.get(id)) && s.sheet || (s = document.styleSheets) && s[id];
	},
	
	/**
	 * 获取stylesheet的样式规则
	 * @param {string|number} id 样式表的编号
	 * @example QZFL.css.getRulesBySheet("css_id");
	 * @returns {object} 返回样式表规则集合对象，若未发生匹配则为空对象
	 */
	getRulesBySheet: function(sheetId){
		var ss = typeof(sheetId) == "object" ? sheetId : QZFL.css.getStyleSheetById(sheetId),
			rs = {},
			head,
			base;

		if (ss && !(rs = ss.cssRules || ss.rules)) {
			if (head = document.getElementsByTagName('head')[0]) {
				if (base = head.getElementsByTagName('base')[0]) {
					QZFL.dom.removeElement(base);
					rs = ss.cssRules;
					head.appendChild(base);
				}
			}
		}
		return rs;
	},
	
	/**
	 * 根据选择器获得样式规则
	 * @param {string} sheetId id 样式表的编号
	 * @param {string} selector 选择器名称
	 * @returns {object} 返回匹配到的样式规则对象，未匹配则为null

	 * @example QZFL.css.getRuleBySelector("css_id","#");
	 */
	getRuleBySelector: function(sheetId, selector){
		selector = (String(selector)).toLowerCase();

		var _ss = QZFL.css.getStyleSheetById(sheetId),
			_rs = QZFL.css.getRulesBySheet(_ss);
		
	/*	!_ss.cacheSelector && (_ss.cacheSelector = {});
		var _cs = _ss.cacheSelector[selector];
		if (_cs && _rs[_cs] && selector == _rs[_cs].selectorText.toLowerCase()) {
			return _rs[_cs];
		}*/ //还嫌内存泄漏不够？
		for (var i = 0, len = _rs.length; i < len; ++i) {
			if (selector == _rs[i].selectorText.toLowerCase()) {
			//	_ss.cacheSelector[selector] = i;
				return _rs[i];
			}
		}
		return null;
	},
	
	/**
	 * 插入外链样式表
	 * @param {string} url 外部css地址
	 * @param {string|object} [opts] 若类型为string则为link Element的ID，若为object则为可选参数包
	 * @param {string} [opts.linkID=undefined] link Element的ID
	 * @param {string} [opts.doc=document] 被插入link节点的文档树根
	 * @param {string} [opts.media="screen"] 样式节点的media种类属性
	 * @returns {object} 返回样式表对象，插入失败返回的是link Element引用

	 * @example
QZFL.css.insertCSSLink("/css/style.css", "myCSS1");
QZFL.css.insertCSSLink("/css/style.css", {
	linkID : "myCSS2",
	doc : frames["innerFrame"].document});
	 */
	insertCSSLink: function(url, opts){
		var sid,
			doc,
			t,
			cssLink,
			head;

		if(typeof opts == "string"){
			sid = opts;
		}

		opts = typeof opts == "object" ? opts : {};
		sid = opts.linkID || sid;
		doc = opts.doc || document;

		head = doc.getElementsByTagName("head")[0];
		cssLink = ((t = doc.getElementById(sid)) && (t.nodeName == "LINK")) ? t : null;

		if (!cssLink) {
			cssLink = doc.createElement("link");
			sid && (cssLink.id = sid);
			cssLink.rel = cssLink.rev = "stylesheet";
			cssLink.type = "text/css";
			cssLink.media = opts.media || "screen";
			head.appendChild(cssLink);
		}
		url && (cssLink.href = url);
		return (QZFL.userAgent.ie != 9 && cssLink.sheet) || cssLink;//IE9开始支持 .sheet了，和 .styleSheet 相同
	},
		
	/**
	 * 插入页面inline样式块
	 * @param {string} sheetId 样式表style Element的ID
	 * @param {string} [rules=""] 样式表规则内容
	 * @returns {object} 返回样式表style Element对象

	 * @example QZFL.css.insertStyleSheet("cssid", "body {font-size: 75%;}");
	 */
	insertStyleSheet: function(sheetId, rules){
		var node = document.createElement("style");
		node.type = 'text/css';
		sheetId && (node.id = sheetId);
		document.getElementsByTagName("head")[0].appendChild(node);
		if (rules) {
			if (node.styleSheet) {
				node.styleSheet.cssText = rules;
			} else {
				node.appendChild(document.createTextNode(rules));
			}
		}
		return node.sheet || node;
	},
	
	/**
	 * 删除一份样式表，包含内部style和外部css
	 * @param {string|number} id 样式表的编号
	 * @deprecated 实用性不强，不适合在编程框架

	 * @example QZFL.css.removeStyleSheet("styleid");
	 */
	removeStyleSheet: function(id){
		var _ss = QZFL.css.getStyleSheetById(id);
		_ss && QZFL.dom.removeElement(_ss.owningElement || _ss.ownerNode);
	},

	/**
	 * 操作元素的className的核心方法，也可以直接调用，remove参数支持*通配符
	 * @param {object} elem 被操作的HTMLElement
	 * @param {string} removeNames 要被取消的className们
	 * @param {string} addNames 要被加入的className们
	 * @returns {string} elem被操作后的className，若elem非法则为空串
	 */
	updateClassName: function(elem, removeNames, addNames){
		if (!elem || elem.nodeType != 1) {
			return "";
		}
		var oriName = elem.className,
			ar,
			b; //受否有变化的flag
		if (removeNames && typeof(removeNames) == 'string' || addNames && typeof(addNames) == 'string') {
			if (removeNames == '*') {
				oriName = '';
			} else {
				ar = oriName.split(' ');

				var i = 0,
					l = ar.length,
					n; //临时变量

				oriName = {};
				for (; i < l; ++i) { //将原始的className群结构化为表
					ar[i] && (oriName[ar[i]] = true);
				}
				if (addNames) { //结构化addNames群，将该加入的加入到oriName群
					ar = addNames.split(' ');
					l = ar.length;
					for (i = 0; i < l; ++i) {
						(n = ar[i]) && !oriName[n] && (b = oriName[n] = true);
					}
				}
				if (removeNames) {
					ar = removeNames.split(' ');
					l = ar.length;
					for (i = 0; i < l; i++) {
						(n = ar[i]) && oriName[n] && (b = true) && delete oriName[n];
					}
				}
			}
			if (b) {
				ar.length = 0;
				for (var k in oriName) { //构造结果数组
					ar.push(k);
				}
				oriName = ar.join(' ');
				elem.className = oriName;
			}
		}
		return oriName;
	},
	
	/**
	 * 某HTMLElement是否含有指定的样式类名称
	 * @param {object} elem 指定的HTML元素
	 * @param {string} name 指定的类名称
	 * @returns {boolean} 是否操作成功

	 * @example QZFL.css.hasClassName(document.getElementById("div_id"), "cname");
	 */
	hasClassName: function(elem, name){
		return elem && (elem = elem.className) && name && ((' ' + elem + ' ').indexOf(' ' + name + ' ') + 1);
	},
	
	/**
	 * 增加一组样式类名
	 * @param {object} elem 指定的HTML元素
	 * @param {string} names 指定的类名称
	 * @returns {string} 返回当前className

	 * @example QZFL.css.addClassName(document.getElementById("ele"), "cname imname");
	 */
	addClassName: function(elem, names){
		return QZFL.css.updateClassName(elem, null, names);
	},
	
	/**
	 * 除去一组样式类名
	 * @param {object} elem 指定的HTML元素
	 * @param {string} cname 指定的类名称
	 * @returns {string} 返回当前className

	 * @example QZFL.css.removeClassName($("ele"),"cname");
	 */
	removeClassName: function(elem, names){
		return QZFL.css.updateClassName(elem, names);
	},
	
	/**
	 * 替换两种样式类名
	 * @param {object|object[]} elems 指定的HTML元素或者一个HTML元素集合
	 * @param {string} a 指定的类名称
	 * @param {string} b 指定的类名称

	 * @example QZFL.css.replaceClassName($("ele"), "sourceClass", "targetClass");
	 */
	replaceClassName: function(elems, a, b){
		QZFL.css.swapClassName(elems, a, b, true);
	},
	
	/**
	 * 交换两种样式类名
	 * @param {object|object[]} elems 指定的HTML元素或者一个HTML元素集合
	 * @param {string} a 指定的类名称
	 * @param {string} b 指定的类名称
	 * @param {boolean} _isRep 参数a,b是否反向可替换

	 * @example QZFL.css.swapClassName($("div_id"), "classone", "classtwo", true);
	 */
	swapClassName: function(elems, a, b, _isRep){
		if (elems && typeof(elems) == "object") {
			if (elems.length === undefined) {
				elems = [elems];
			}
			for (var elem, i = 0, l = elems.length; i < l; ++i) {
				if ((elem = elems[i]) && elem.nodeType == 1) {
					if (QZFL.css.hasClassName(elem, a)) {
						QZFL.css.updateClassName(elem, a, b);
					} else if (!_isRep && QZFL.css.hasClassName(elem, b)) {
						QZFL.css.updateClassName(elem, b, a);
					}
				}
			}
		}
	},
	
	/**
	 * 切换样式类名
	 * @param {object} elem 指定的HTML元素
	 * @param {string} name 指定的类名称
	 * @returns {undefined}

	 * @example QZFL.css.toggleClassName($("ele"),"cname");
	 */
	toggleClassName: function(elem, name){
		if (!elem || elem.nodeType != 1) {
			return;
		}
		if (QZFL.css.hasClassName(elem, name)) {
			QZFL.css.updateClassName(elem, name);
		} else {
			QZFL.css.updateClassName(elem, null, name);
		}
	}	
};
/**
 * @fileoverview QZFL DOM 工具集，包含对浏览器DOM的一些操作
 * @version $Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $) - $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */


/**
 * QZFL dom 接口封装对象。对浏览器常用的dom对象接口进行浏览器兼容封装
 *
 * @namespace QZFL dom 接口封装对象
 */
QZFL.dom = {
	/**
	 * 根据id获取dom对象
	 *
	 * @param {string} id 对象ID
	 * @returns {object} 指定id的DOM节点，没有找到为null
	 * @example QZFL.dom.getById("div_id");
	 */
	getById : function(id) {
		return document.getElementById(id);
	},

	/**
	 * 根据name获取dom集合，有些标签例如li、span无法通过getElementsByName拿到，加上tagName指明就可以 <br />
	 &lt;li name="n1">node1&lt;/li>&lt;span name="n1">node2&lt;/span>
	 * ie只能获取到li，非ie下两者都可以
	 *
	 * @param {string} name 所需节点的name
	 * @param {string} [tagName=""] 标签名称tagName
	 * @param {object} [rt=undefined] 查找的根对象
	 * @returns {object[]} 匹配到的节点集合

	 * @example QZFL.dom.getByName("div_name");
	 */
	getByName : function(name, tagName, rt) {
		return QZFL.selector((tagName || "") + '[name="' + name + '"]', rt);
	},

	/**
	 * 获得制定节点
	 *
	 * @param {string|object} e 包括id号，或则Html Element对象
	 * @returns {object} 匹配到的节点
	 * @example QZFL.dom.get("div_id");
	 */
	get : function(e) {
		return (typeof(e) == "string") ? document.getElementById(e) : e;
	},

	/**
	 * 获得对象
	 *
	 * @param {string|object} e 包括id号，或则HTML Node对象
	 * @returns {object}
	 * @deprecated <strong style="color:red;">这个太搞笑了，不要再用了</strong>
	 * @example QZFL.dom.getNode("div_id");
	 */
	getNode : function(e) {
		return (e && (e.nodeType || e.item)) ? e : document.getElementById(e);
	},
	/**
	 * 删除节点
	 *
	 * @param {string|object} el HTML元素的id或者HTML元素
	 * @example
QZFL.dom.removeElement("div_id");
QZFL.dom.removeElement(QZFL.dom.get("div_id2"));
	 */
	removeElement : function(elem) {
		if (elem = QZFL.dom.get(elem)) {
			if(QZFL.userAgent.ie == 9 && elem.tagName == "SCRIPT"){
				elem.src = "";
			}
			elem.removeNode ? elem.removeNode(true) : (elem.parentNode && elem.parentNode.removeChild(elem));
		}
		return elem = null;
	},

	/**
	 * 从以某元素开始,对指定元素属性的值使用传入的handler进行判断，handler返回true时查询停止，返回当前元素<br />
	 否则以当前属性值所指的对象为根，递归重新查找，最终返回null
	 * @param {object} elem HTML元素
	 * @param {string} prop 构成链的元素属性名
	 * @param {function} func 检查函数,返回true的时候当前查找终结, func = function(el){}; //传入当前的节点el
	 * @returns {object} 结果对象，无结果时返回null

	 * @example
function getFirstChild(elem){ //获取第一个为HTMLElement的子节点
	elem = QZFL.dom.get(elem);
	return QZFL.dom.searchChain(elem && elem.firstChild, 'nextSibling', function(el){
		return el.nodeType == 1;
	});
}
	 */
	searchChain : function(elem, prop, func){
		prop = prop || 'parentNode';
		while (elem) {
			if (!func || func.call(elem, elem)) {
				return elem;
			}
			elem = elem[prop];
		}
		return null;
	},

	/**
	 * 通过当前节点不断往父级向上查找，直到找到含有指定className的dom节点
	 *
	 * @param {string|object} el 对象id或则dom
	 * @param {string} className css类名
	 * @deprecated <strong>不建议使用了，请使用 {@link QZFl.element}</strong>
	 * @returns {object} 第一个结果节点
	 */
	searchElementByClassName : function(elem, className){
		elem = QZFL.dom.get(elem);
		return QZFL.dom.searchChain(elem, 'parentNode', function(el){
			return QZFL.css.hasClassName(el, className);
		});
	},
	/**
	 * 获取指定className的所有子节点
	 *
	 * @param {string} className 指定的class值
	 * @param {string} [tagName] 节点名
	 * @param {string|object} context 可能的根对象
	 * @deprecated <strong>不建议使用了，请使用 {@link QZFl.element}</strong>
	 * @returns {object[]} 结果节点集合
	 */
	getElementsByClassName : function(className, tagName, context) {
		return QZFL.selector((tagName || '') + '.' + className, QZFL.dom.get(context));
	},


	/**
	 * 判断指定的节点是否是第二个节点的祖先
	 *
	 * @param {HTMLElement} a 对象，父节点
	 * @param {HTMLElement} b 对象，子孙节点
	 * @returns {boolean} true即b是a的子节点，否则为false
	 * @example  QZFL.dom.isAncestor(QZFL.dom.get("div1"), QZFL.dom.get("div2"))
	 */
	isAncestor : function(a, b) {
		return a && b && a != b && QZFL.dom.contains(a, b);
	},



	/**
	 * 根据函数得到特定的父节点
	 *
	 * @param {object|string} node对象或其id
	 * @param {string} method 创建对象的TagName
	 * @returns {object}
	 * @example var node = QZFL.dom.getAncestorBy($("div_id"), "div");
	 */
	getAncestorBy : function(elem, method){
		elem = QZFL.dom.get(elem);
		return QZFL.dom.searchChain(elem.parentNode, 'parentNode', function(el){
			return el.nodeType == 1 && (!method || method(el));
		});
	},


	/**
	 * 得到第一个HTMLElement子节点
	 *
	 * @param {object|string} HTMLElement对象或其id
	 * @returns {object} 结果对象
	 * @example var element = QZFL.dom.getFirstChild("el_id");
	 */
	getFirstChild : function(elem){
		elem = QZFL.dom.get(elem);
		return elem.firstElementChild || QZFL.dom.searchChain(
			elem && elem.firstChild,
			'nextSibling',
			function(el){
				return el.nodeType == 1;
			}
		);
	},

	/**
	 * 得到最后一个子HTMLElement节点
	 *
	 * @param {object|string} node对象或其id
	 * @returns {object}
	 * @example var element = QZFL.dom.getFirstChild(QZFL.dom.get("el_id"));
	 */
	getLastChild : function(elem){
		elem = QZFL.dom.get(elem);
		return elem.lastElementChild || QZFL.dom.searchChain(
			elem && elem.lastChild,
			'previousSibling',
			function(el){
				return el.nodeType == 1;
			}
		);
	},


	/**
	 * 得到下一个兄HTMLElement弟节
	 *
	 * @param {string|object} node对象或其id
	 * @returns ｛object}
	 * @example QZFL.dom.getNextSibling("el_id");
	 */
	getNextSibling : function(elem){
		elem = QZFL.dom.get(elem);
		return elem.nextElementSibling || QZFL.dom.searchChain(
			elem && elem.nextSibling,
			'nextSibling',
			function(el){
				return el.nodeType == 1;
			}
		);
	},
	/**
	 * 得到上一个兄弟HTMLElement节点
	 *
	 * @param {object|string} node对象或其id
	 * @returns {object}
	 * @example QZFL.dom.getPreviousSibling(QZFL.dom.get("el_id"));
	 */
	getPreviousSibling : function(elem){
		elem = QZFL.dom.get(elem);
		return elem.previousElementSibling || QZFL.dom.searchChain(
			elem && elem.previousSibling,
			'previousSibling',
			function(el){
				return el.nodeType == 1;
			}
		);
	},

//------------------------------------------------------------------------------------


	/**
	 * 交换两个节点
	 *
	 * @param {HTMLElement} node1 node对象
	 * @param {HTMLElement} node2 node对象
	 *            @example
	 *            QZFL.dom.swapNode(QZFL.dom.get("el_one"),QZFL.dom.get("el_two"))
	 */
	swapNode : function(node1, node2) {
		// for ie
		if (node1.swapNode) {
			node1.swapNode(node2);
		} else {
			var prt = node2.parentNode,
				next = node2.nextSibling;

			if (next == node1) {
				prt.insertBefore(node1, node2);
			} else if (node2 == node1.nextSibling) {
				prt.insertBefore(node2, node1);
			} else {
				node1.parentNode.replaceChild(node2, node1);
				prt.insertBefore(node1, next);
			}
		}
	},
	/**
	 * 定点创建Dom对象
	 *
	 * @param {string} tagName 创建对象的TagName
	 * @param {string|HTMLElement} el 容器对象id或则dom
	 * @param {Boolean} insertFirst 是否插入容器的第一个位置
	 * @param {object} attributes 对象属性列表，例如 {id:"newDom1",style:"color:#000"}
	 *            @example
	 *            QZFL.dom.createElementIn("div",document.body,false,{id:"newDom1",style:"color:#000"})
	 * @returns 返回创建好的dom
	 */
	createElementIn : function(tagName, elem, insertFirst, attrs){
		var _e = (elem = QZFL.dom.get(elem) || document.body).ownerDocument.createElement(tagName || "div"), k;
		
		// 设置Element属性
		if (attrs) {
			for (k in attrs) {
				if (k == "class") {
					_e.className = attrs[k];
				} else if (k == "style") {
					_e.style.cssText = attrs[k];
				} else {
					_e[k] = attrs[k];
				}
			}
		}
		insertFirst ? elem.insertBefore(_e, elem.firstChild) : elem.appendChild(_e);
		return _e;
	},

	/**
	 * 获取对象渲染后的样式规则
	 *
	 * @param {string|HTMLElement} el 对象id或则dom
	 * @param {string} property 样式规则
	 *            @example
	 *            var width=QZFL.dom.getStyle("div_id","width");//width=163px;
	 * @returns 样式值
	 */
	getStyle : function(el, property) {
		el = QZFL.dom.get(el);

		if (!el || el.nodeType == 9) {
			return null;
		}

		var w3cMode = document.defaultView && document.defaultView.getComputedStyle,
			computed = !w3cMode ? null : document.defaultView.getComputedStyle(el, ''),
			value = "";

		switch (property) {
			case "float" :
				property = w3cMode ? "cssFloat" : "styleFloat";
				break;
			case "opacity" :
				if (!w3cMode) { // IE Mode
					var val = 100;
					try {
						val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
					} catch (e) {
						try {
							val = el.filters('alpha').opacity;
						} catch (e) {}
					}
					return val / 100;
				}else{
					return parseFloat((computed || el.style)[property]);
				}
				break;
			case "backgroundPositionX" : // 只有ie和webkit浏览器支持
				// background-position-x
				if (w3cMode) {
					property = "backgroundPosition";
					return ((computed || el.style)[property]).split(" ")[0];
				}
				break;
			case "backgroundPositionY" : // 只有ie和webkit浏览器支持
				// background-position-y
				if (w3cMode) {
					property = "backgroundPosition";
					return ((computed || el.style)[property]).split(" ")[1];
				}
				break;
		}

		if (w3cMode) {
			return (computed || el.style)[property];
		} else {
			return (el.currentStyle[property] || el.style[property]);
		}
	},

	/**
	 * 设置样式规则
	 *
	 * @param {string|HTMLElement} el 对象id或则dom
	 * @param {string} property 样式规则
	 *            @example
	 *            QZFL.dom.setStyle("div_id","width","200px");
	 * @returns 成功返回 true
	 */
	setStyle : function(el, properties, value) {
		if (!(el = QZFL.dom.get(el)) || el.nodeType != 1) {
			return false;
		}
		var tmp, bRtn = true, w3cMode = (tmp = document.defaultView) && tmp.getComputedStyle, rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;
		if (typeof(properties) == 'string') {
			tmp = properties;
			properties = {};
			properties[tmp] = value;
		}
		
		for (var prop in properties) {
			value = properties[prop];
			if (prop == 'float') {
				prop = w3cMode ? "cssFloat" : "styleFloat";
			} else if (prop == 'opacity') {
				if (!w3cMode) { // for ie only
					prop = 'filter';
					value = value >= 1 ? '' : ('alpha(opacity=' + Math.round(value * 100) + ')');
				}
			} else if (prop == 'backgroundPositionX' || prop == 'backgroundPositionY') {
				tmp = prop.slice(-1) == 'X' ? 'Y' : 'X';
				if (w3cMode) {
					var v = QZFL.dom.getStyle(el, "backgroundPosition" + tmp);
					prop = 'backgroundPosition';
					typeof(value) == 'number' && (value = value + 'px');
					value = tmp == 'Y' ? (value + " " + (v || "top")) : ((v || 'left') + " " + value);
				}
			}
			if (typeof el.style[prop] != "undefined") {
				el.style[prop] = value + (typeof value === "number" && !rexclude.test(prop) ? 'px' : '');
				bRtn = bRtn && true;
			} else {
				bRtn = bRtn && false;
			}
		}
		return bRtn;
	},
	/**
	 * 建立有name属性的element
	 * 
	 * @param {string} type node的tagName
	 * @param {string} name name属性值
	 * @param {object} doc document
	 *            @example
	 *            QZFL.dom.createNamedElement("div","div_name",QZFL.dom.get("doc"));
	 * @returns {Object} 结果element
	 */
	createNamedElement : function(type, name, doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document,
			element;

		try {
			element = _doc.createElement('<' + type + ' name="' + name + '">');
		} catch (ign) {}

		if (!element) {
			element = _doc.createElement(type);
		}

		if (!element.name) {
			element.name = name;
		}
		return element;
	},
	
	getRect : function(elem){
		if (elem = QZFL.dom.get(elem)) {
			var box = QZFL.object.extend({}, elem.getBoundingClientRect()), s;
			if (typeof box.width == 'undefined') {
				box.width = box.right - box.left;
				box.height = box.bottom - box.top;
			}
			return box;
		}
	},
	/**
	 * 获取对象坐标
	 *
	 * @param {HTMLElement} el
	 *            @example
	 *            var position=QZFL.dom.getPosition(QZFL.dom.get("div_id"));
	 * @returns {object} 返回位置对象 {"top","left","width","height"};
	 */
	getPosition : function(elem){
		var box, s, doc;
		if (box = QZFL.dom.getRect(elem)) {
			if (s = QZFL.dom.getScrollLeft(doc = elem.ownerDocument)) {
				box.left += s, box.right += s;
			}
			if (s = QZFL.dom.getScrollTop(doc)) {
				box.top += s, box.bottom += s;
			}
			return box;
		}
	},
	/**
	 * 设置对象坐标
	 *
	 * @param {HTMLElement} el
	 * @param {object} pos
	 *            @example
	 *            QZFL.dom.setPosition(QZFL.dom.get("div_id"),{"100px","100px","400px","300px"});
	 */
	setPosition : function(el, pos) {
		QZFL.dom.setXY(el, pos['left'], pos['top']);
		QZFL.dom.setSize(el, pos['width'], pos['height']);
	},
	/**
	 * 获取对象坐标
	 *
	 * @param {HTMLElement} el
	 * @param {Document} doc 所需检查的页面document引用
	 * @returns Array [top,left]
	 * @type Array
	 *       @example
	 *       var xy=QZFL.dom.getXY(QZFL.dom.get("div_id"));
	 * @returns Array
	 */
	getXY : function(elem, doc){
		var box = QZFL.dom.getPosition(elem) ||
		{
			left: 0,
			top: 0
		};
		return [box.left, box.top];
	},

	/**
	 * 获取对象尺寸
	 *
	 * @param {HTMLElement} el
	 * @returns Array [width,height]
	 * @type Array
	 *       @example
	 *       var size=QZFL.dom.getSize(QZFL.dom.get("div_id"));
	 * @returns Array
	 */
	getSize : function(elem){
		var box = QZFL.dom.getPosition(elem) ||
		{
			width: -1,
			height: -1
		};
		return [box.width, box.height];
	},

	/**
	 * 设置dom坐标
	 *
	 * @param {HTMLElement} el
	 * @param {string|number} x 横坐标
	 * @param {string|number} y 纵坐标
	 *            @example
	 *            QZFL.dom.setXY(QZFL.dom.get("div_id"),400,200);
	 */
	setXY : function(elem, x, y){
		var _ml = parseInt(QZFL.dom.getStyle(elem, "marginLeft")) || 0, _mt = parseInt(QZFL.dom.getStyle(elem, "marginTop")) || 0;
		QZFL.dom.setStyle(elem, {
			left: (parseInt(x) || 0) - _ml + "px",
			top: (parseInt(y) || 0) - _mt + "px"
		});
	},

	/**
	 * 获取对象scrollLeft的值
	 *
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getScrollLeft(document);
	 * @returns Number
	 */
	getScrollLeft : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return Math.max(_doc.documentElement.scrollLeft, _doc.body.scrollLeft);
	},

	/**
	 * 获取对象的scrollTop的值
	 *
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getScrollTop(document);
	 * @returns Number
	 */
	getScrollTop : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return Math.max(_doc.documentElement.scrollTop, _doc.body.scrollTop);
	},

	/**
	 * 获取对象scrollHeight的值
	 *
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getScrollHeight(document);
	 * @returns Number
	 */
	getScrollHeight : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return Math.max(_doc.documentElement.scrollHeight, _doc.body.scrollHeight);
	},

	/**
	 * 获取对象的scrollWidth的值
	 *
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getScrollWidht(document);
	 * @returns Number
	 */
	getScrollWidth : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return Math.max(_doc.documentElement.scrollWidth, _doc.body.scrollWidth);
	},

	/**
	 * 设置对象scrollLeft的值
	 *
	 * @param {number} value scroll left的修改值
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.setScrollLeft(200,document);
	 */
	setScrollLeft : function(value, doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		_doc[_doc.compatMode == "CSS1Compat" && !QZFL.userAgent.webkit ? "documentElement" : "body"].scrollLeft = value;
	},

	/**
	 * 设置对象的scrollTop的值
	 *
	 * @param {number} value scroll top的修改值
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.setScrollTop(200,document);
	 */
	setScrollTop : function(value, doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		_doc[_doc.compatMode == "CSS1Compat" && !QZFL.userAgent.webkit ? "documentElement" : "body"].scrollTop = value;
	},

	/**
	 * 获取对象的可视区域高度
	 *
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getClientHeight();
	 */
	getClientHeight : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientHeight : _doc.body.clientHeight;
	},

	/**
	 * 获取对象的可视区域宽度
	 *
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getClientWidth();
	 */
	getClientWidth : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientWidth : _doc.body.clientWidth;
	},
	

	/**
	 * size数值需要用的模式
	 * @private
	 *
	 */
	_SET_SIZE_RE : /^\d+(?:\.\d*)?(px|%|em|in|cm|mm|pc|pt)?$/,

	/**
	 * 设置dom尺寸
	 *
	 * @param {HTMLElement} el
	 * @param {string|number} width 宽度
	 * @param {string|number} height 高度
	 *            @example
	 *            QZFL.dom.setSize();
	 */
	setSize : function(el,w,h){
		el = QZFL.dom.get(el);
		var _r = QZFL.dom._SET_SIZE_RE,
			m;

		QZFL.dom.setStyle(el, "width", (m=_r.exec(w)) ? (m[1] ? w : (parseInt(w,10)+'px')) : 'auto');
		QZFL.dom.setStyle(el, "height",(m=_r.exec(h)) ? (m[1] ? h : (parseInt(h,10)+'px')) : 'auto');
	},


//--------------------------------------------------------------------------

	/**
	 * 获取document的window对象
	 *
	 * @param {object} [doc=document] 所需检查的页面document引用
	 * @returns {object} 返回结果window对象
	 * @example QZFL.dom.getDocumentWindow();
	 */
	getDocumentWindow : function(doc) {
		var _doc = doc || document;
		return _doc.parentWindow || _doc.defaultView;
	},

	/**
	 * 按Tagname获取指定命名空间的节点
	 *
	 * @param {object} [node=document] 所需遍历的根节点
	 * @param {string} ns 命名空间名
	 * @param {string} tgn 标签名
	 * @returns {object} 结果数组
	 * @example QZFL.dom.getElementsByTagNameNS(document, "qz", "div");
	 */
	getElementsByTagNameNS : function(node, ns, tgn) {
		node = node || document;
		var res = [];

		if (node.getElementsByTagNameNS) {
			return node.getElementsByTagName(ns + ":" + tgn);
		} else if (node.getElementsByTagName) {
			var n = document.namespaces;
			if (n.length > 0) {
				var l = node.getElementsByTagName(tgn);
				for (var i = 0, len = l.length; i < len; ++i) {
					if (l[i].scopeName == ns) {
						res.push(l[i]);
					}
				}
			}
		}

		return res;
	},


	/**
	 * 从一个给出节点向上寻找一个tagName相符的节点
	 *
	 * @param {object} elem 给出的节点
	 * @param {string} tn 需要查找的节点tag name
	 * @returns {object} 结果，没找到是null
	 * @example QZFL.dom.getElementByTagNameBubble(QZFL.dom.get("div_id"),"div");
	 */
	getElementByTagNameBubble : function(elem, tn){
		if(!tn){
			return null;
		}
		var maxLv = 15;
		tn = String(tn).toUpperCase();
		if(tn == 'BODY'){
			return document.body;
		}
		elem = QZFL.dom.searchChain(
			elem = QZFL.dom.get(elem),
			'parentNode',
			function(el){
				return el.tagName == tn || el.tagName == 'BODY' || (--maxLv) < 0;
			}
		);
		return !elem || maxLv < 0 ? null : elem;
	},

	/**
	 * 在元素相邻的位置(具体位置可选)插入 html文本  text纯文本  element节点
	 * @param {object} elem 元素引用
	 * @param {number} where 取值0 1 2 3，分别对应：beforeBegin, afterBegin, beforeEnd, afterEnd
	 * @param {object|string} html html文本 或 text普通文本 或 element节点引用
	 * @param {boolean} [isText=false] 当需要插入text时，用此参数区别于html
	 * @returns {boolean} 操作是否成功
	 * @example
QZFL.dom.insertAdjacent($("test"), 1, "world!", true); //0 1 2 3 分别代表：节点外节点前；节点内头部；节点内尾部；节点外节点后
	 */
	insertAdjacent : function(elem, where, html, isText){
		var range,
			pos = ['beforeBegin', 'afterBegin', 'beforeEnd', 'afterEnd'],
			doc;

		if (QZFL.lang.isElement(elem) && pos[where] && (QZFL.lang.isString(html) || QZFL.lang.isElement(html))) {
			if (elem.insertAdjacentHTML) {
				elem['insertAdjacent' + (typeof(html) == 'object' ? 'Element' : (isText ? 'Text' : 'HTML'))](pos[where], html);
			} else {
				range = (doc = elem.ownerDocument).createRange();
				range[where == 1 || where == 2 ? 'selectNodeContents' : 'selectNode'](elem);
				range.collapse(where < 2);
				range.insertNode(typeof(html) != 'string' ? html : isText ? doc.createTextNode(html) : range.createContextualFragment(html));
			}
			return true;
		}
		return false;
	}
};


/**
 * @fileoverview QZFL 事件驱动器，给浏览器提供基本的事件驱动接口
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 事件驱动对象，包含许多事件驱动以及绑定等方法,关键
 *
 * @namespace QZFL 事件驱动器，给浏览器提供基本的事件驱动接口
 */
QZFL.event = {
	/**
	 * 按键代码映射
	 *
	 * @namespace QZFL.event.KEYS 里面包含了对按键的映射
	 * @type Object
	 */
	KEYS : {
		/**
		 * 退格键
		 */
		BACKSPACE : 8,
		/**
		 * tab
		 */
		TAB : 9,
		RETURN : 13,
		ESC : 27,
		SPACE : 32,
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,
		DELETE : 46
	},
	//这个东东不需要了吧
	/**
	 * 扩展类型，这类事件在绑定的时候允许传参数，并且用来特殊处理一些特别的事件绑定
	 *
	 * @ignore
	 *
	extendType : /(click|mousedown|mouseover|mouseout|mouseup|mousemove|scroll|contextmenu|resize)/i,*/


	/**
	 * 全局事件树
	 * @ignore
	 */
	_eventListDictionary : {},

	/**
	 * @ignore
	 */
	_fnSeqUID : 0,

	/**
	 * @ignore
	 */
	_objSeqUID : 0,

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
	 * @example QZFL.event.addEvent(QZFL.dom.get('demo'),'click',hello);
	 */
	addEvent : function(obj, eventType, fn, argArray) {
		var cfn,
			res = false, l;

		if (!obj) {
			return res;
		}
		if (!obj.eventsListUID) {
			obj.eventsListUID = "e" + (++QZFL.event._objSeqUID);
		}

		if (!(l = QZFL.event._eventListDictionary[obj.eventsListUID])) {
			l = QZFL.event._eventListDictionary[obj.eventsListUID] = {};
		}

		if (!fn.__elUID) {
			fn.__elUID = "e" + (++QZFL.event._fnSeqUID) + obj.eventsListUID;
		}

		if (!l[eventType]) {
			l[eventType] = {};
		}

		if(typeof(l[eventType][fn.__elUID])=='function'){
			return false;
		}

		cfn = function(evt) {
			
				var a = fn.apply(obj, !argArray ? [QZFL.event.getEvent(evt)] : ([QZFL.event.getEvent(evt)]).concat(argArray));
				return a;
			};

		if (obj.addEventListener) {
			obj.addEventListener(eventType, cfn, false);
			res = true;
		} else if (obj.attachEvent) {
			res = obj.attachEvent("on" + eventType, cfn);
		} else {
			res = false;
		}
		if (res) {
			l[eventType][fn.__elUID] = cfn;
		}
		return res;
	},

	/**
	 * 方法取消绑定
	 *
	 * @param {DocumentElement} obj 需要取消事件绑定的页面对象
	 * @param {String} eventType 需要取消绑定的事件
	 * @param {Function} fn 需要取消绑定的函数
	 * @return 是否成功取消(true为成功，false为失败)
	 * @type Boolean
	 * @version 1.1 memory leak optimise by scorr
	 * @author zishunchen
	 * @example QZFL.event.removeEvent(QZFL.dom.get('demo'),'click',hello);
	 */
	removeEvent : function(obj, eventType, fn) {
		var cfn = fn,
			res = false,
			l = QZFL.event._eventListDictionary,
			r;

		if (!obj) {
			return res;
		}
		if (!fn) {
			return QZFL.event.purgeEvent(obj, eventType);
		}

		if (obj.eventsListUID && l[obj.eventsListUID]) {
			l = l[obj.eventsListUID][eventType];
			if(l && l[fn.__elUID]){
				cfn = l[fn.__elUID];
				r = l;
			}
		}

		if (obj.removeEventListener) {
			obj.removeEventListener(eventType, cfn, false);
			res = true;
		} else if (obj.detachEvent) {
			obj.detachEvent("on" + eventType, cfn);
			res = true;
		} else {
			//rt.error("Error.!.");
			return false;
		}
		if (res && r && r[fn.__elUID]) {
			delete r[fn.__elUID];
		}
		return res;
	},

	/**
	 * 取消全部某类型的方法绑定
	 *
	 * @param {DocumentElement} obj 需要取消事件绑定的页面对象
	 * @param {String} eventType 需要取消绑定的事件
	 * @example QZFL.event.purgeEvent(QZFL.dom.get('demo'),'click');
	 * @return {Boolean} 是否成功取消(true为成功，false为失败)
	 */
	purgeEvent : function(obj, type) {
		var l;
		if (obj.eventsListUID && (l = QZFL.event._eventListDictionary[obj.eventsListUID]) && l[type]) {
			for (var k in l[type]) {
				if (obj.removeEventListener) {
					obj.removeEventListener(type, l[type][k], false);
				} else if (obj.detachEvent) {
					obj.detachEvent('on' + type, l[type][k]);
				}
			}
		}
		if (obj['on' + type]) {
			obj['on' + type] = null;
		}
		if (l) {
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
	 * @example QZFL.event.getEvent();
	 * @return Event
	 */
	getEvent: function(evt) {
		var evt = window.event || evt,
			c,
			cnt;
		if(!evt && window.Event){
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
	 * @example QZFL.event.getButton(evt);
	 * @return {number} 鼠标按键 -1=无法获取event 0=左键 1= 中键 2= 右键
	 */
	getButton : function(evt) {
		var e = QZFL.event.getEvent(evt);
		if (!e) {
			return -1
		}

		if (QZFL.userAgent.ie) {
			return e.button - Math.ceil(e.button / 2);
		} else {
			return e.button;
		}
	},

	/**
	 * 返回事件触发的对象
	 *
	 * @param {Object} evt
	 * @example QZFL.event.getTarget(evt);
	 * @return {object}
	 */
	getTarget : function(evt) {
		var e = QZFL.event.getEvent(evt);
		if (e) {
			return e.srcElement || e.target;
		} else {
			return null;
		}
	},

	/**
	 * 返回获得焦点的对象
	 *
	 * @param {Object} evt
	 * @example QZFL.event.getCurrentTarget();
	 * @return {object}
	 */
	getCurrentTarget : function(evt) {
		var e = QZFL.event.getEvent(evt);
		if (e) {
		/**
		 * @default document.activeElement
		 */
			return  e.currentTarget || document.activeElement;
		} else {
			return null;
		}
	},

	/**
	 * 禁止事件冒泡传播
	 *
	 * @param {Event} evt 事件，非必要参数
	 * @example QZFL.event.cancelBubble();
	 */
	cancelBubble : function(evt) {
		evt = QZFL.event.getEvent(evt);
		if (!evt) {
			return false
		}
		if (evt.stopPropagation) {
			evt.stopPropagation();
		} else {
			if (!evt.cancelBubble) {
				evt.cancelBubble = true;
			}
		}
	},

	/**
	 * 取消浏览器的默认事件
	 *
	 * @param {Event} evt 事件，非必要参数
	 * @example QZFL.event.preventDefault();
	 */
	preventDefault : function(evt) {
		evt = QZFL.event.getEvent(evt);
		if (!evt) {
			return false
		}
		if (evt.preventDefault) {
			evt.preventDefault();
		} else {
			evt.returnValue = false;
		}
	},

	/**
	 * 获取事件触发时的鼠标位置x
	 *
	 * @param {Object} evt 事件对象引用
	 * @example QZFL.event.mouseX();
	 */
	mouseX : function(evt) {
		evt = QZFL.event.getEvent(evt);
		return evt.pageX || (evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
	},

	/**
	 * 获取事件触发时的鼠标位置y
	 *
	 * @param {Object} evt 事件对象引用
	 * @example QZFL.event.mouseX();
	 */
	mouseY : function(evt) {
		evt = QZFL.event.getEvent(evt);
		return evt.pageY || (evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
	},

	/**
	 * 获取事件RelatedTarget
	 * @param {Object} evt 事件对象引用
	 * @example QZFL.event.getRelatedTarget();
	 */
	getRelatedTarget: function(ev) {
		ev = QZFL.event.getEvent(ev);
		var t = ev.relatedTarget;
		if (!t) {
			if (ev.type == "mouseout") {
				t = ev.toElement;
			} else if (ev.type == "mouseover") {
				t = ev.fromElement;
			} else {

			}
		}
		return t;
	},

	/**
	 * 全局页面加载完成后的事件回调
	 * @param {function} fn 回调接口
	 */
	onDomReady:function(fn){
		QZFL.event.onDomReady._fn = function(){
				fn();
				QZFL.event.onDomReady._fn = null;
			};
		
		if (document.addEventListener) {
			if (QZFL.userAgent.safari<4) {
				var interval = setInterval(function() {
					if ((/loaded|complete/).test(document.readyState)) {
						QZFL.event.onDomReady._fn();
						clearInterval(interval);
					}
				}, 50);
			} else {
				document.addEventListener("DOMContentLoaded", QZFL.event.onDomReady._fn, true);
			}
		} else {
			var src = window.location.protocol == 'https:' ? '//:' : 'javascript:void(0)';
			document.write('<script onreadystatechange="if(this.readyState==\'complete\'){this.parentNode.removeChild(this);QZFL.event.onDomReady._fn();}" defer="defer" src="' + src + '"><\/script\>');
		}
	}
};

/**
 * 方法同 QZFL.event.addEvent
 *
 * @see QZFL.event.addEvent
 */
QZFL.event.on = QZFL.event.addEvent;

/**
 * 方法同 QZFL.object.bind
 *
 * @see QZFL.object.bind
 */
QZFL.event.bind = QZFL.object.bind;
/**
 * @fileoverview QZFL 函数队列系统，可以把一系列函数作为队列并且按顺序执行。在执行过程中函数出现的错误不会影响到下一个队列进程
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 函数队列引擎
 *
 * @param {string} key 队列名称
 * @param {array} queue 队列函数数组
 * @example QZFL.queue("test",[function(){alert(d)},function(){alert(2)}]);
 * QZFL.queue.run("test");
 *
 * @namespace QZFL 队列引擎，给函数提供批量的队列执行方法
 * @return {Queue} 返回队列系统构造对象
 */
QZFL.queue = (function(){
	var _o = QZFL.object;
	var _queue = {};

	var _Queue = function(key,queue){
		if (this instanceof arguments.callee) {
			this._qz_queuekey = key;
			return this;
		}

		if (_o.getType(queue = queue || []) == "array"){
			_queue[key] = queue;
		}

		return new _Queue(key);
	};

	var _extend = /**@lends QZFL.queue*/{
		/**
		 * 往一个队列里插入一个新的函数
		 *
		 * @param {string|function} key 队列名称 当作为构造函数时则只需要直接传
		 * @param {function} fn 可执行的函数
		 * @example QZFL.queue("test");
		 * QZFL.queue.push("test",function(){alert("ok")});
		 * // 或者
		 * QZFL.queue("test").push(function(){alert("ok")});
		 */
		push : function(key,fn){
			fn = this._qz_queuekey?key:fn;
			_queue[this._qz_queuekey || key].push(fn);
		},

		/**
		 * 从队列里去除第一个函数，并且执行一次
		 *
		 * @param {string} key 队列名称
		 * @example	QZFL.queue("test",[function(){alert("ok")}]);
		 * QZFL.queue.shift("test");
		 * // 或者
		 * QZFL.queue("test",[function(){alert("ok")}]).shift();
		 * @return 返回第一个队列函数执行的结果
		 */
		shift : function(key) {
			var _q = _queue[this._qz_queuekey || key];
			if (_q) {
				return QZFL.queue._exec(_q.shift());
			}
		},

		/**
		 * 返回队列长度
		 * @param {string} key 队列名称
		 *
		 * @example QZFL.queue("test",[function(){alert("ok")}]);
		 * QZFL.queue.getLen("test");
		 *      // 或者
		 * QZFL.queue("test",[function(){alert("ok")}]).getLen();
		 *
		 * @return 返回第一个队列函数执行的结果
		 */
		getLen: function(key){
			return _queue[this._qz_queuekey || key].length;
		},

		/**
		 * 执行队列
		 *
		 * @param {string} key 队列名称
		 * @example QZFL.queue("test",[function(){alert("ok")}]);
		 * QZFL.queue.run("test");
		 * // 或者
		 * QZFL.queue("test",[function(){alert("ok")}]).run();
		 */
		run : function(key){
			var _q = _queue[this._qz_queuekey || key];
			if (_q) {
				_o.each(_q,QZFL.queue._exec);
			}
		},

		/**
		 * 分时执行队列
		 *
		 * @param {string} key 队列名称
		 * @param {object} conf 可选参数 默认值为{'run': 100, 'wait': 50};每次运行100ms,暂停50ms再继续运行队列,直至队列为空
		 * @example QZFL.queue("test",[function(){alert("1")},function(){alert("2")},function(){alert("3")}]);
		 * QZFL.queue.timedChunk("test", {'runTime': 1000, 'waitTime': 40, 'onRunEnd': function(){alert('allRuned');}, 'onWait': function(){alert('wait');}});
		 *
		 */
		timedChunk : function(key, conf){
			var _q = _queue[this._qz_queuekey || key], _conf;
			if (_q) {
				//合并用户传入的参数和默认参数
				_conf = QZFL.lang.propertieCopy(conf, QZFL.queue._tcCof, null, true);
				setTimeout(function(){
					var _start = +new Date();
					do {
						QZFL.queue.shift(key);
					} while (QZFL.queue.getLen(key) > 0 && (+new Date() - _start < _conf.runTime));

					if (QZFL.queue.getLen(key) > 0){
						setTimeout(arguments.callee, _conf.waitTime);
						_conf.onWait();
					} else {
						_conf.onRunEnd();
					}
				}, 0);
			}
		},

		/**
		 * 分时执行队列的默认参数
		 *
		 */
		_tcCof : {
				'runTime': 50, //每次队列运行时间
				'waitTime': 25, //暂停时间
				'onRunEnd': QZFL.emptyFn,//队列全部运行完毕触发的事件（只触发一次）
				'onWait': QZFL.emptyFn//每次暂停时触发的事件（触发多次，有可能为零次）
		},

		/**
		 *
		 */
		_exec : function(value,key,source){
			if (!value || _o.getType(value) != "function"){
				if (_o.getType(key) == "number") {
					source[key] = null;
				}
				return false;
			}

			try {
				return value();
			}catch(e){
				QZFL.console.print("QZFL Queue Got An Error: [" + e.name + "]  " + e.message,1)
			}
		}
	};

	_o.extend(_Queue.prototype,_extend);
	_o.extend(_Queue,_extend);

	return _Queue;
})();
/**
 * @fileoverview QZFL String 组件
 * @version 1.$Rev: 1392 $
 * @author QzoneWebGroup, ($LastChangedBy: zishunchen $)
 */
/**
 * @namespace QZFL String 封装接口。
 * @type
 */
QZFL.string = {
	RegExps: {
		trim: /^\s+|\s+$/g,
		ltrim: /^\s+/,
		rtrim: /\s+$/,
		nl2br: /\n/g,
		s2nb: /[\x20]{2}/g,
		URIencode: /[\x09\x0A\x0D\x20\x21-\x29\x2B\x2C\x2F\x3A-\x3F\x5B-\x5E\x60\x7B-\x7E]/g,
		escHTML: {
			re_amp: /&/g,
			re_lt : /</g,
			re_gt : />/g,
			re_apos : /\x27/g,
			re_quot : /\x22/g
		},
		
		escString: {
			bsls: /\\/g,
			nl: /\n/g,
			rt: /\r/g,
			tab: /\t/g
		},
		
		restXHTML: {
			re_amp: /&amp;/g,
			re_lt: /&lt;/g,
			re_gt: /&gt;/g,
			re_apos: /&(?:apos|#0?39);/g,
			re_quot: /&quot;/g
		},
		
		write: /\{(\d{1,2})(?:\:([xodQqb]))?\}/g,
		isURL : /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i,
		cut: /[\x00-\xFF]/,
		
		getRealLen: {
			r0: /[^\x00-\xFF]/g,
			r1: /[\x00-\xFF]/g
		},
		format: /\{([\d\w\.]+)\}/g
	},
	
	/**
	 * 通用替换
	 *
	 * @ignore
	 * @param {String} s 需要进行替换的字符串
	 * @param {String/RegExp} p 要替换的模式的 RegExp 对象
	 * @param {String} r 一个字符串值。规定了替换文本或生成替换文本的函数。
	 * @example
	 * 			QZFL.string.commonReplace(str + "", QZFL.string.RegExps.trim, '');
	 * @return {String} 处理结果
	 */
	commonReplace : function(s, p, r) {
		return s.replace(p, r);
	},
	
	/**
	 * 通用系列替换
	 *
	 * @ignore
	 * @param {String} s 需要进行替换的字符串
	 * @param {Object} l RegExp对象hashMap
	 * @example
	 * 			QZFL.string.listReplace(str,regHashmap);
	 * @return {String} 处理结果
	 */
	listReplace : function(s, l) {
		if (QZFL.lang.isHashMap(l)) {
			for (var i in l) {
				s = QZFL.string.commonReplace(s, l[i], i);
			}
			return s;
		} else {
			return s+'';
		}
	},
	
	/**
	 * 字符串前后去空格
	 *
	 * @param {String} str 目标字符串
	 * @example
	 * 			QZFL.string.trim(str);
	 * @return {String} 处理结果
	 */
	trim: function(str){
		return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.trim, '');
	},
	
	/**
	 * 字符串前去空格
	 *
	 * @param {String} str 目标字符串
	 * @example
	 * 			QZFL.string.ltrim(str);
	 * @return {String} 处理结果
	 */
	ltrim: function(str){
		return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.ltrim, '');
	},
	
	/**
	 * 字符串后去空格
	 *
	 * @param {String} str 目标字符串
	 * @example
	 * 			QZFL.string.rtrim(str);
	 * @return {String} 处理结果
	 */
	rtrim: function(str){
		return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.rtrim, '');
	},
	
	/**
	 * 制造html中换行符
	 *
	 * @param {String} str 目标字符串
	 * @example
	 * 			QZFL.string.nl2br(str);
	 * @return {String} 结果
	 */
	nl2br: function(str){
		return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.nl2br, '<br />');
	},
	
	/**
	 * 制造html中空格符，爽替换
	 *
	 * @param {String} str 目标字符串
	 * @example
	 * 			QZFL.string.s2nb(str);
	 * @return {String} 结果
	 */
	s2nb: function(str){
		return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.s2nb, '&nbsp;&nbsp;');
	},
	
	/**
	 * 对非汉字做URIencode
	 *
	 * @param {String} str 目标字符串
	 * @example
	 * 			QZFL.string.URIencode(str);
	 * @return {String} 结果
	 */
	URIencode: function(str){
		var cc, ccc;
		return (str + "").replace(QZFL.string.RegExps.URIencode, function(a){
			if (a == "\x20") {
				return "+";
			} else if (a == "\x0D") {
				return "";
			}
			cc = a.charCodeAt(0);
			ccc = cc.toString(16);
			return "%" + ((cc < 16) ? ("0" + ccc) : ccc);
		});
	},
	
	/**
	 * htmlEscape
	 *
	 * @param {String} str 目标串
	 * @example
	 * 			QZFL.string.escHTML(str);
	 * @return {String} 结果
	 */
	escHTML: function(str){
		var t = QZFL.string.RegExps.escHTML;
		return QZFL.string.listReplace((str + ""), {
		/*
		 * '&' must be
		 * escape first
		 */
			'&amp;' : t.re_amp,
			'&lt;' : t.re_lt,
			'&gt;' : t.re_gt,
			'&#039;' : t.re_apos,
			'&quot;' : t.re_quot
		});
	},
	
	/**
	 * CstringEscape
	 *
	 * @param {String} str 目标串
	 * @return {String} 结果
	 */
	escString: function(str){
		var t = QZFL.string.RegExps.escString,
			h = QZFL.string.RegExps.escHTML;
		return QZFL.string.listReplace((str + ""), {
			/*
			 * '\' must be
			 * escape first
			 */
			'\\\\' : t.bsls,
			'\\n' : t.nl,
			'' : t.rt,
			'\\t' : t.tab,
			'\\\'' : h.re_apos,
			'\\"' : h.re_quot
		});
	},
	
	/**
	 * htmlEscape还原
	 *
	 * @param {String} str 目标串
	 * @return {String} 结果
	 */
	restHTML: function(str){
		if (!QZFL.string.restHTML.__utilDiv) {
			/**
			 * 工具DIV
			 *
			 * @ignore
			 */
			QZFL.string.restHTML.__utilDiv = document.createElement("div");
		}
		var t = QZFL.string.restHTML.__utilDiv;
		t.innerHTML = (str + "");
		if (typeof(t.innerText) != 'undefined') {
			return t.innerText;
		} else if (typeof(t.textContent) != 'undefined') {
			return t.textContent;
		} else if (typeof(t.text) != 'undefined') {
			return t.text;
		} else {
			return '';
		}
	},
	
	/**
	 * xhtmlEscape还原
	 *
	 * @param {String} str 目标串
	 * @return {String} 结果
	 */
	restXHTML: function(str){
		var t = QZFL.string.RegExps.restXHTML;
		return QZFL.string.listReplace((str + ""), {
			/*
			 * '&' must be
			 * escape last
			 */
			'<': t.re_lt,
			'>': t.re_gt,
			'\x27': t.re_apos,
			'\x22': t.re_quot,
			'&': t.re_amp
		});
	},
	
	/**
	 * 字符串格式输出工具
	 *
	 * @param {String} 输出模式
	 * @param {Arguments} Arguments... 可变参数，表示模式中占位符处实际要替换的值
	 * @return {String} 结果字符串
	 */
	write: function(strFormat, someArgs){
		if (arguments.length < 1 || !QZFL.lang.isString(strFormat)) {
			// rt.warn('No patern to write()');
			return '';
		}
		var rArr = QZFL.lang.arg2arr(arguments), result = rArr.shift(), tmp;
		
		return result.replace(QZFL.string.RegExps.write, function(a, b, c){
			b = parseInt(b, 10);
			if (b < 0 || (typeof rArr[b] == 'undefined')) {
				// rt.warn('write() wrong patern:{0:Q}', strFormat);
				return '(n/a)';
			} else {
				if (!c) {
					return rArr[b];
				} else {
					switch (c) {
						case 'x':
							return '0x' + rArr[b].toString(16);
						case 'o':
							return 'o' + rArr[b].toString(8);
						case 'd':
							return rArr[b].toString(10);
						case 'Q':
							return '\x22' + rArr[b].toString(16) + '\x22';
						case 'q':
							return '`' + rArr[b].toString(16) + '\x27';
						case 'b':
							return '<' + !!rArr[b] + '>';
					}
				}
			}
		});
	},
	
	/**
	 * 是否是一个可接受的URL串
	 *
	 * @param {String} s 目标串
	 * @return {Boolean} 结果
	 */
	isURL: function(s){
		return QZFL.string.RegExps.isURL.test(s);
	},
	
	/**
	 * 按指定编码重编字符串
	 *
	 * @param {String} s 源字符串
	 * @param {String} type 类型说明字
	 * @return {String} 结果字符串
	 * @deprecated 这个有点傻
	 *
	customEncod/e : function(s, type) {
		var r;
		if (typeof type == 'undefined') {
			type = '';
		}
		switch (type.toUpperCase()) {
			case "URICPT" :
				r = encodeURIComponent(s);
				break;
			default :
				r = encodeURIComponent(s);
		}
		return r;
	},*/
	
	/**
	 * 包装的escape函数
	 *
	 * @param {String} s 源字符串
	 * @return {String} 结果串
	 */
	escapeURI: function(s){
		if (window.encodeURIComponent) {
			return encodeURIComponent(s);
		}
		if (window.escape) {
			return escape(s);
		}
		return '';
	},
	
	/**
	 * 用指定字符补足需要的数字位数
	 *
	 * @param {String} s 源字符串
	 * @param {Number} l 长度
	 * @param {String} [ss="0"] 指定字符
	 * @param {Boolean} [isBack=false] 补足的方向: true 后方; false 前方;
	 * @return {String} 返回的结果串
	 */
	fillLength: function(source, l, ch, isRight){
		if ((source = String(source)).length < l) {
			var ar = new Array(l - source.length);
			ar[isRight ? 'unshift' : 'push'](source);
			source = ar.join(ch || '0');
		}
		return source;
	},
	/**
	 * 用制定长度切割给定字符串
	 *
	 * @param {String} s 源字符串
	 * @param {Number} bl 期望长度(字节长度)
	 * @param {String} tails 增加在最后的修饰串,比如"..."
	 * @return {String} 结果串
	 */
	cut: function(str, bitLen, tails){
		str = String(str);
		bitLen -= 0;
		tails = tails || '';
		if (isNaN(bitLen)) {
			return str;
		}
		var len = str.length,
			i = Math.min(Math.floor(bitLen / 2), len),
			cnt = QZFL.string.getRealLen(str.slice(0, i));

		for (; i < len && cnt < bitLen; i++) {
			cnt += 1 + (str.charCodeAt(i) > 255);
		}
		return str.slice(0, cnt > bitLen ? i - 1 : i) + (i < len ? tails : '');
	},
	
	/**
	 * 计算字符串的真实长度
	 *
	 * @param {String} s 源字符串
	 * @param {Boolean} [isUTF8=false] 标示是否是utf-8计算
	 * @return {Number} 结果长度
	 */
	getRealLen: function(s, isUTF8){
		if (typeof(s) != 'string') {
			return 0;
		}
		
		if (!isUTF8) {
			return s.replace(QZFL.string.RegExps.getRealLen.r0, "**").length;
		} else {
			var cc = s.replace(QZFL.string.RegExps.getRealLen.r1, "");
			return (s.length - cc.length) + (encodeURI(cc).length / 3);
		}
	},
	format: function(str){
		var args = Array.prototype.slice.call(arguments), v;
		str = args.shift() + '';
		if (args.length == 1 && typeof(args[0]) == 'object') {
			args = args[0];
		}
		QZFL.string.RegExps.format.lastIndex = 0;
		return str.replace(QZFL.string.RegExps.format, function(m, n){
			v = QZFL.object.route(args, n);
			return v === undefined ? m : v;
		});
	}
};


/**
 * @fileoverview QZFL 通用接口核心库
 * @version 1.$Rev: 1392 $
 * @author QzoneWebGroup, ($LastChangedBy: zishunchen $)
 * @lastUpdate $Date: 2009-08-05 16:26:13 +0800 (Wed, 05 Aug 2009) $
 */

/**
 * 通用扩展接口
 *
 * @namespace 通用扩展接口
 */
QZFL.util = {
	/**
	 * 使用一个uri串制作一个类似location的对象
	 *
	 * @param {String} s 所需字符串
	 *
	 * @return QZFL.util.URI
	 * @see QZFL.util.URI
	 */
	buildUri : function(s) {
		return new QZFL.util.URI(s);
	},

	/**
	 * 使用一个uri串制作一个类似location的对象
	 *
	 * @param {String} s 所需字符串
	 * @class URI 引擎，可以把一个uri字符串转换成类似location的对象
	 * @constructor
	 */
	URI : function(s) {
		/*
		if ('string' == typeof(s)) {
			var pn = location.pathname, tail, arr;
			if (s.indexOf("://") < 1) {
				s = this.href = [this.protocol = location.protocol, '//', this.host = location.host, tail = s.indexOf("/") == 0 ? "" : pn.substr(0, pn.lastIndexOf("/") + 1) + s].join('');
			} else {
				arr = (this.href = s).split("://");
				if (!/^[a-z]+$/i.test(arr[0])) {
					return null;
				}
				this.protocol = arr[0].toLowerCase();
				arr = arr[1].split("/");
				this.host = arr.shift();
				tail = '/' + arr.join('/');
			}
			arr = this.host.split(':');
			this.hostname = arr.length > 1 ? arr[0] : this.host;
			this.port = arr.length > 1 && arr[1] - 80 ? (arr[1] - 0) : '';
			arr = tail.split('#');
			this.hash = arr[1] ? ('#' + arr[1]) : '';
			arr = arr[0].split('?');
			this.search = arr[1] ? ('?' + arr[1]) : '';
			this.pathname = arr[0] || '/';
		}
		return null;
		*/
		
		if (!(QZFL.object.getType(s) == "string")) {
			return null;
		}
		if (s.indexOf("://") < 1) {
			s = location.protocol + "//" + location.host + (s.indexOf("/") == 0 ? "" : location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)) + s;
		}
		var depart = s.split("://");
		if (QZFL.object.getType(depart) == "array" && depart.length > 1 && (/^[a-zA-Z]+$/).test(depart[0])) {
			this.protocol = depart[0].toLowerCase();
			var h = depart[1].split("/");
			if (QZFL.object.getType(h) == "array") {
				this.host = h[0];
				this.pathname = "/" + h.slice(1).join("/").replace(/(\?|\#).+/i, ""); // 修正pathname的返回错误
				this.href = s;
				var se = depart[1].lastIndexOf("?"), ha = depart[1].lastIndexOf("#");
				this.search = (se >= 0) ? depart[1].substring(se) : "";
				this.hash = (ha >= 0) ? depart[1].substring(ha) : "";
				if (this.search.length > 0 && this.hash.length > 0) {
					if (ha < se) {
						this.search = "";
					} else {
						this.search = depart[1].substring(se, ha);
					}
				}
				return this;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
};
/**
 * @fileoverview 增强脚本语言处理能力
 * @version 1.$Rev: 1597 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2009-11-30 21:51:19 +0800 (星期一, 30 十一月 2009) $
 */

 /**
 * 环境变量系统
 *
 * @namespace QZFL.lang
 */
QZFL.lang = {
	/**
	 * 是否字符串
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isString(obj);
	 */
	isString : function(o) {
		return QZFL.object.getType(o) == "string";
	},
	/**
	 * 是否数组对象
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isArray(obj);
	 */
	isArray : function(o) {
		return QZFL.object.getType(o) == "array";
	},
	/**
	 * 是否函数对象
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isArray(obj);
	 */
	isFunction: function(o) {
		return QZFL.object.getType(o) == "function";
	},
	/**
	 * 是否哈希表结构
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isHashMap(obj);
	 */
	isHashMap : function(o) {
		return QZFL.object.getType(o) == "object";
	},

	/**
	 * 是否Node节点对象
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isNode(obj);
	 */
	isNode : function(o) {
		return o && (typeof(o.nodeName) != 'undefined' || typeof(o.nodeType) != 'undefined');
	},

	/**
	 * 是否Element
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isElement(obj);
	 */
	isElement : function(o) {
		 return o && o.nodeType == 1;
	}
};

/**
 * @fileoverview QZFL.util 小工具扩展包
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup ($LastChangedBy: ryanzhao $) - $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */



(function() {
	var evalGlobalCnt = 0,
		runStyleGlobalCnt = 0;
	/**
	 * QZFL.util 工具包扩展
	 * @namespace QZFL.util 命名空间
	 * @name QZFL.util
	 *
	 */
	QZFL.object.extend(QZFL.util, /** @lends QZFL.util */{
		/**
		 * 复制到剪贴板，目前只支持IE 已经将上个版本jolt增加的剪贴板控制去除
		 * @param {string} text 要复制的文本
		 * @returns {boolean} 写入剪贴板是否成功
		 * @deprecated 认为在这里逻辑过多,建议设计统一的widget组件交付各个应用使用
		 * @example QZFL.util.copyToClip(text);
		 */
		copyToClip : function(text) {
			if (QZFL.userAgent.ie) {
				return clipboardData.setData("Text", text);
			} else {
				var o = QZFL.shareObject.getValidSO();
				return o ? o.setClipboard(text) : false;
			}
		},

		/**
		 * 在页面上执行一段js语句文本
		 * 这个是直接在全局部分执行，在js系统的任意部分调用也能保证在全局执行一段脚本
		 * @param {string} js 一段js语句文本
		 * @example QZFL.util.evalGlobal("var t = 1;");
		 */
		evalGlobal : function(js) {
			js = String(js);
			var obj = document.createElement('script'),
				head = document.documentElement || document.getElementsByTagName("head")[0];
			obj.type = 'text/javascript';
			obj.id = "__evalGlobal_" + evalGlobalCnt;
			try {
				obj.innerHTML = js;
			} catch (e) {
				obj.text = js;
			}
			head.insertBefore(obj,head.firstChild);
			evalGlobalCnt++;
			setTimeout(function(){QZFL.dom.removeElement(obj);}, 50);
		},

		/**
		 * 在页面上执行一段css语句文本
		 * @deprecated 专供safari使用
		 * @param {string} st 一段style语句
		 * @example QZFL.util.runStyleGlobal("body { font-size: 12px; }");
		 */
		runStyleGlobal : function(st) {
			if (QZFL.userAgent.safari) {
				var obj = document.createElement('style');
				obj.type = 'text/css';
				obj.id = "__runStyle_" + runStyleGlobalCnt;
				try {
					obj.textContent = st;
				} catch (e) {
					alert(e.message);
				}
				var h = document.getElementsByTagName("head")[0];
				if (h) {
					h.appendChild(obj);
					runStyleGlobalCnt++;
				}
			} else {
			//	rt.warn("plz use runStyleGlobal() in Safari!");
			}
		},

		/**
		 * http参数表对象变为HTTP协议数据串，如：param1=123&amp;param2=456
		 * @param {object} o 用来表示参数列表的hashTable
		 * @returns {string} 结果串
		 * @example QZFL.util.genHttpParamString({"param1":123, "param2":456});
		 */
		genHttpParamString : function(o) {
			return QZFL.util.commonDictionaryJoin(o, null, null, null, window.encodeURIComponent);
		},

		/**
		 * 将一个http参数序列字符串变为表映射对象
		 * @param {string} s 源字符串
		 * @returns {object} 结果
		 * @example QZFL.util.splitHttpParamString("param1=123&param2=456");
		 */
		splitHttpParamString : function(s) {
			return QZFL.util.commonDictionarySplit(s);
		},

		/**
		 * 将一个字典型序列字符串变为映射表对象
		 * @param {string} [s=''] 源字符串
		 * @param {string} [esp='&'] 项分隔符
		 * @param {string} [vq=''] 值封套
		 * @param {string} [eq='='] 等号字符
		 * @returns {object} 结果对象
		 * @example
QZFL.util.commonDictionarySplit(
	'form-data; name="file_upload"; file_name="c:\\data\\data.ini"; ',
	'; ',
	'"',
	'='
);
		 */
		commonDictionarySplit : function(s, esp, vq, eq) {
			var res = {},
				l,
				ks,
				vs,
				t;

			if(!s || typeof(s) != "string"){
				return res;
			}
			if (typeof(esp) != 'string') {
				esp = "&";
			}
			if (typeof(vq) != 'string') {
				vq = "";
			}
			if (typeof(eq) != 'string') {
				eq = "=";
			}

			l = s.split(esp); //a="1=2"tt"&b="2"s=t" -> a="1=2"tt"     b="2"s=t"

			if(l && l.length){
				for(var i = 0, len = l.length; i < len; ++i){
					ks = l[i].split(eq); //a="1=2"tt" -> a    "1    2"tt"
					if(ks.length > 1){
						t = ks.slice(1).join(eq); //"1=2"tt"
						vs = t.split(vq);
						res[ks[0]] = vs.slice(vq.length, vs.length - vq.length).join(vq);
					}else{
						ks[0] && (res[ks[0]] = true); //没有值的时候直接就用true作为值
					}
				}
			}						

			return res;
		},

		/**
		 * 将一个字典型映射表对象变为序列字符串
		 * @param {object} [o={}] 源映射对象
		 * @param {string} [esp='&'] 项分隔符
		 * @param {string} [vq=''] 值封套
		 * @param {string} [eq='='] 等号字符
		 * @param {function} [valueHandler=QZFL.emptyFn] 处理值的方法引用
		 * @returns {string} 结果串
		 * @example
QZFL.util.commonDictionaryJoin(
	{
		'form-data' : true,
		'name' : 'file_upload',
		'file_name' : 'c:\\data\\data.ini'
	}
	'; ',
	'"',
	'='
); //form-data="true"; name="file_upload"; file_name="c:\\data\\data.ini"
		 */
		commonDictionaryJoin : function(o, esp, vq, eq, valueHandler) {
			var res = [],
				t;

			if(!o || typeof(o) != "object"){
				return '';
			}
			if(typeof(o) == "string"){
				return o;
			}
			if (typeof(esp) != 'string') {
				esp = "&";
			}
			if (typeof(vq) != 'string') {
				vq = "";
			}
			if (typeof(eq) != 'string') {
				eq = "=";
			}

			for(var k in o){
				res.push(k + eq + vq + (typeof valueHandler == 'function' ? valueHandler(o[k]) : o[k]) + vq);
			}

			return res.join(esp);
		}

	});

})();

/**
 * @fileoverview 增强脚本语言处理能力
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 是否是有效的xml数据
 *
 * @param {object} o xmldom
 * @return {Boolean} 结果
 * @example QZFL.lang.isValidXMLdom(obj);
 */
QZFL.lang.isValidXMLdom = function(o) {
	return !!(o && o.xml && /^<\?xml/.test(o.xml));//ryan
};

/**
 * 将arguments对象转化为真数组
 *
 * @param {object} refArgs 对一个arguments对象的引用
 * @param {number} [start=0] 起始偏移量
 * @returns {object} 结果数组
 * @example QZFL.lang.arg2arr(obj,1);//从第二个参数开始转化
 */
QZFL.lang.arg2arr = function(refArgs, start) {
	return Array.prototype.slice.call(refArgs, (start || 0));
};

/**
 * 以window为根,获取指定命名描述的值
 *
 * @param {string} ns 描述,如: QZFL.foo.bar
 * @param {boolean} [setup=false] 不存在则创建
 * @example
 * 			QZFL.lang.getObjByNameSpace("QZFL.foo.bar",true);
 * @return {All} 获取到得值
 */
QZFL.lang.getObjByNameSpace = function(ns, setup) {
	if (typeof(ns) != 'string') {
		return ns;
	}
	var l = ns.split("."),
		r = window;

	try {
		for (var i = 0, len = l.length; i < len; ++i) {
			if(typeof(r[l[i]]) == 'undefined'){
				if(setup){
					r[l[i]] = {};
				}else{
					return void(0);
				}
			}
			r = r[l[i]];
		}
		return r;
	} catch (ignore) {
		return void(0);
	}
};

/**
 * JSON数据深度复制
 *
 * @param {All} obj 需要复制的JSON数据根部
 * @param {String} preventName 需要过滤的字段
 * @example
 * 			QZFL.lang.objectClone(re,"msg");
 * @return {All} 复制出的新JSON数据
 */
QZFL.lang.objectClone = function(obj, preventName) {
	if ((typeof obj) == 'object') {
		var res = (QZFL.lang.isArray(obj)) ? [] : {};
		for (var i in obj) {
			if (i != preventName)
				res[i] = QZFL.lang.objectClone(obj[i], preventName);
		}
		return res;
	} else if ((typeof obj) == 'function') {
		return Object;
	}
	return obj;
};


/**
 * JS Object convert to String
 * @param {All} obj
 * @returns {string} result
 * @example QZFL.lang.obj2str(obj);
 */
QZFL.lang.obj2str = function(obj) {
	var t, sw;

	if (typeof(obj) == 'object') {
		if(obj === null){ return 'null'; }

		if(window.JSON && window.JSON.stringify){
			return JSON.stringify(obj);
		}

		sw = QZFL.lang.isArray(obj);
		t = [];
		for (var i in obj) {
			t.push((sw ? "" : ("\"" + QZFL.string.escString(i) + "\":")) + obj2str(obj[i]));
		}
		t = t.join();
		return sw ? ("["+t+"]") : ("{"+t+"}");
	} else if (typeof(obj) == 'undefined') {
		return 'undefined';
	} else if (typeof(obj) == 'number' || typeof(obj) == 'function') {
		return obj.toString();
	}
	return !obj ? "\"\"" : ("\"" + QZFL.string.escString(obj) + "\"");
};

/**
 * 对象成员复制(浅表复制)
 *
 * @param {object} s 复制的目标对象
 * @param {object} b 复制的源对象
 * @param {object} [propertiSet] 所需要的属性名称集合
 * @param {boolean} [notOverWrite=false] 不复写
 * @returns {object} 目标对象
 * @example QZFL.lang.propertieCopy(objt,objs,parray,false);
 */
QZFL.lang.propertieCopy = function(s, b, propertiSet, notOverWrite) {
	// 如果propertiSet == null 或者 != Object，则使用b。
	var l = (!propertiSet || typeof(propertiSet) != 'object') ? b : propertiSet;

	s = s || {};

	for (var p in l) {
		if (!notOverWrite || !(p in s)) {
			s[p] = l[p];
		}
	}

	return s;
};

/**
 * 顺序执行一系列方法，得到第一个成功执行的结果
 *
 * @param {Functions} arguments... 可变参数，一系列函数执行
 * @example
 * 			QZFL.lang.tryThese(functionOne,functionTwo);
 * @return {Object/undefined} 执行结果
 */
QZFL.lang.tryThese = function(){
	for (var i = 0, len = arguments.length; i < len; ++i) {
		try {
			return arguments[i]();
		} catch (ign) {
			return void(0);
		}
	}
};

/**
 * 将两个执行过程连接起来，注意，连接后不可再分开，且执行过程用Boolean型数据标识是否成功执行
 *
 * @param {Function} u 要先执行的过程
 * @param {Function} v 后执行的过程
 * @example
 * 			QZFL.lang.chain(functionOne,functionTwo);
 * @return {Function} 连接后的执行过程
 */
QZFL.lang.chain = function(u, v) {
	var calls = QZFL.lang.arg2arr(arguments);
	return function() {
		for (var i = 0, len = calls.length; i < len; ++i) {
			if (calls[i] && calls[i].apply(null, arguments) === false) {
				return false;
			}
		}
		return true;
	};
};

/**
 * 去除数组中重复的元素
 *
 * @param {Array} arr
 * @example
 * 			QZFL.lang.uniqueArray(arr);
 * @returns {object} arr 去除重复元素的数组
 */
QZFL.lang.uniqueArray = function(arr) {
	if(!QZFL.lang.isArray(arr)){ return arr; }
	var flag = {},index = 0;
	while (index < arr.length) {
		if (flag[arr[index]] == typeof(arr[index])) {
			arr.splice(index, 1);
			continue;
		}
		flag[arr[index].toString()] = typeof(arr[index]);
		++index;
	}

	return arr;
};


/**
 * @fileoverview 封闭静态类ENV,管理环境变量
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 环境变量系统
 *
 * @namespace QZFL.enviroment
 */
QZFL.enviroment = (function() {
	var _p = {},
		hookPool = {};

	/**
	 * 获取指定的环境变量
	 *
	 * @ignore
	 * @param {String} kname 指定的环境变量名称
	 * @return {All} 存储在环境变量中的数据
	 * @example
	 * 			QZFL.enviroment.envGet(kname);
	 */
	function envGet(kname) {
		return _p[kname];
	}

	/**
	 * 删除指定的环境变量
	 *
	 * @ignore
	 * @param {String} kname 指定的环境变量名称
	 * @return {Boolean} 是否删除成功
	 * @example
	 * 			QZFL.enviroment.envDel(kname);
	 */
	function envDel(kname) {
		delete _p[kname];
		return true;
	}

	/**
	 * 以指定名称设置环境变量
	 *
	 * @ignore
	 * @param {String} kname 名称
	 * @param {All} value 值
	 * @return {Boolean} 是否成功
	 * @example
	 * 			QZFL.enviroment.envSet(kname,value);
	 */
	function envSet(kname, value) {
		if (typeof value == 'undefined') {
			if (typeof kname == 'undefined') {
				return false;
			} else if (!(_p[kname] === undefined)) {
				return false;
			}
		} else {
			_p[kname] = value;
			return true;
		}
	}

	return {
		/**
		 * 获取指定的环境变量
		 *
		 * @param {String} kname 指定的环境变量名称
		 * @return {All} 存储在环境变量中的数据
		 * @memberOf QZFL.enviroment
		 */
		get : envGet,
		/**
		 * 以指定名称设置环境变量
		 *
		 * @param {String} kname 名称
		 * @param {All} value 值
		 * @return {Boolean} 是否成功
		 * @memberOf QZFL.enviroment
		 */
		set : envSet,
		/**
		 * 删除指定的环境变量
		 *
		 * @param {String} kname 指定的环境变量名称
		 * @return {Boolean} 是否删除成功
		 * @memberOf QZFL.enviroment
		 */
		del : envDel,
		/**
		 * 事件钩子存放根
		 *
		 * @type {Object}
		 * @memberOf QZFL.enviroment
		 */
		hookPool : hookPool
	};
})();

/**
 * 页面级别事件处理
 *
 * @namespace QZFL.pageEvents
 * @example
 * 		QZFL.pageEvents.pageBaseInit();
 *		QZFL.pageEvents.onloadRegister(init);
 */
QZFL.pageEvents = (function() {
	/**
	 * 将queryString解析到环境变量
	 *
	 * @ignore
	 */
	function _ihp() {
		var qs = location.search.substring(1),
			qh = location.hash.substring(1),
			s, h, n;

		ENV.set("_queryString", qs);
		ENV.set("_queryHash", qh);
		ENV.set("queryString", s = QZFL.util.splitHttpParamString(qs));
		ENV.set("queryHash", h = QZFL.util.splitHttpParamString(qh));

		//为QZFL设置调试级别
		if(s && s.DEBUG){
			n = parseInt(s.DEBUG, 10);
			if (!isNaN(n)) {
				QZFL.config.debugLevel = n;
			}
		}

	}

	/**
	 * 页面启动器
	 *
	 * @ignore
	 */
	function _bootStrap() {
		if (document.addEventListener) {
			if (QZFL.userAgent.safari < 4) {
				var interval = setInterval(function() {
					if ((/loaded|complete/).test(document.readyState)) {
						_onloadHook();
						clearInterval(interval);
					}
				}, 50);
			} else {
				document.addEventListener("DOMContentLoaded", _onloadHook, true);
			}
		} else {
			var src = 'javascript:void(0)';
			if (window.location.protocol == 'https:') {
				src = '//:';
			}
			document.write('<script onreadystatechange="if(this.readyState==\'complete\'){this.parentNode.removeChild(this);QZFL.pageEvents._onloadHook();}" defer="defer" src="' + src + '"><\/script\>');
		}

		window.onload = QZFL.lang.chain(window.onload, function() {
			_onloadHook();
			_runHooks('onafterloadhooks');
		});
		/**
		 * 页面的onbeforeunload侦听
		 *
		 * @ignore
		 */
		window.onbeforeunload = function() {
			return _runHooks('onbeforeunloadhooks');
		};
		window.onunload = QZFL.lang.chain(window.onunload, function() {
			_runHooks('onunloadhooks');
		});
	}

	/**
	 * 执行所有page onload方法,并且置标志
	 */
	function _onloadHook() {
		_runHooks('onloadhooks');
		QZFL.enviroment.loaded = true;
	}

	/**
	 * 执行一个挂钩方法
	 *
	 * @param {Function} handler 指定的挂钩方法
	 */
	function _runHook(handler) {
		try {
			handler();
		} catch (ex) {
		}
	}

	/**
	 * 执行所有指定名称的挂钩程序
	 *
	 * @param {Object} hooks 挂钩名称
	 */
	function _runHooks(hooks) {
		var isbeforeunload = (hooks == 'onbeforeunloadhooks'),
			warn = null,
			hc = window.ENV.hookPool;

		do {
			var h = hc[hooks];
			if (!isbeforeunload) {
				hc[hooks] = null;
			}
			if (!h) {
				break;
			}
			for (var ii = 0; ii < h.length; ii++) {
				if (isbeforeunload) {
					warn = warn || h[ii]();
				} else {
					h[ii]();
				}
			}
			if (isbeforeunload) {
				break;
			}
		} while (hc[hooks]);

		if (isbeforeunload) {
			if (warn) {
				return warn;
			} else {
				QZFL.enviroment.loaded = false;
			}
		}
	}

	/**
	 * 增加事件挂钩
	 *
	 * @param {Object} hooks 挂钩名称
	 * @param {Function} handler 目标方法
	 */
	function _addHook(hooks, handler) {
		var c = window.ENV.hookPool;
		(c[hooks] ? c[hooks] : (c[hooks] = [])).push(handler);
	}

	/**
	 * 插入事件挂钩
	 *
	 * @param {Object} hooks 挂钩名称
	 * @param {Function} handler 目标方法
	 * @param {Number} position 目标位置
	 */
	function _insertHook(hooks, handler, position) {
		var c = window.ENV.hookPool;
		if (typeof(position) == 'number' && position >= 0) {
			if(!c[hooks]){
				c[hooks] = [];
			}
			c[hooks].splice(position, 0, handler);
		} else {
			return false;
		}
	}

	/**
	 * 页面onload方法注册
	 *
	 * @param {Function} handler 需要注册的页面onload方法引用
	 */
	function _lr(handler) {
		QZFL.enviroment.loaded ? _runHook(handler) : _addHook('onloadhooks', handler);
	}

	/**
	 * 页面onbeforeunload方法注册
	 *
	 * @param {Function} handler 需要注册的页面onbeforeunload方法引用
	 */
	function _bulr(handler) {
		_addHook('onbeforeunloadhooks', handler);
	}

	/**
	 * 页面onunload方法注册
	 *
	 * @param {Function} handler 需要注册的页面onunload方法引用
	 */
	function _ulr(handler) {
		_addHook('onunloadhooks', handler);
	}

	/**
	 * 页面初始化过程
	 */
	function pinit() {
		_bootStrap();
		_ihp();

		/**
		 * 错误输出
		 */
		var _dt;
		if (_dt = document.getElementById("__DEBUG_out")) {
			ENV.set("dout", _dt);
		}

		/**
		 * alert方法重定义
		 */
		var __dalert;
		if (!ENV.get("alertConverted")) {
			__dalert = alert;
			eval('var alert=function(msg){if(msg!=undefined){__dalert(msg);return msg;}}');// sds
			// 这里以后可以考虑更复杂的重定向
			ENV.set("alertConverted", true);
		}

		var t = ENV.get("queryHash");
		if(t && t.DEBUG){
			QZFL.config.debugLevel = 2;
		}
	}

	return {
		onloadRegister : _lr,
		onbeforeunloadRegister : _bulr,
		onunloadRegister : _ulr,
		initHttpParams : _ihp,
		bootstrapEventHandlers : _bootStrap,
		_onloadHook : _onloadHook,
		insertHooktoHooksQueue : _insertHook,
		pageBaseInit : pinit
	};
})();

/**
 * @fileOverview QZFL.string扩展包组件
 * @version $Rev: 1921 $
 * @author QzoneWebGroup - ($LastChangedBy: ryanzhao $) - ($Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $)
 */


/**
 * 内涵各种字符串处理类工具接口
 * @namespace QZFL.string名字空间
 * @name QZFL.string
 */
QZFL.string = QZONE.string || {};


/**
 * 尝试解析一段文本为XML DOM节点
 * @memberOf QZFL.string
 * @param {string} text 待解析的文本
 * @returns {object} 返回结果,失败是null,成功是documentElement
 */
QZFL.string.parseXML = function(text) {
	var doc;
	if (window.ActiveXObject) {
		doc = QZFL.lang.tryThese(function(){
			return new ActiveXObject('MSXML2.DOMDocument.6.0');
		}, function(){
			return new ActiveXObject('MSXML2.DOMDocument.5.0');
		}, function(){
			return new ActiveXObject('MSXML2.DOMDocument.4.0');
		}, function(){
			return new ActiveXObject('MSXML2.DOMDocument.3.0');
		}, function(){
			return new ActiveXObject('MSXML2.DOMDocument');
		}, function(){
			return new ActiveXObject('Microsoft.XMLDOM');
		});

		doc.async = "false";
		doc.loadXML(text);
		if (doc.parseError.reason) {
			// rt.error(doc.parseError.reason);
			return null;
		}
	} else {
		var parser = new DOMParser();
		doc = parser.parseFromString(text, "text/xml");
		if (doc.documentElement.nodeName == 'parsererror') {
			return null;
		}
	}
	return doc.documentElement;
};



/**
 * 格式化输出时间工具
 * @param {number|object} date 毫秒数描述的绝对是间值 / Date对象引用
 * @param {string} [ptn=undefined] <strong style="color:green;">若不给此参数，则进入自动相对时间模式</strong><br /><br />
 格式说明串<br />
 {y}两位年<br />
 {Y}四位年<br />
 {M}月<br />
 {d}日期<br />
 {h}小时<br />
 {m}分钟数<br />
 {s}秒数
 {_Y}相对年差数<br />
 {_M}相对月差数<br />
 {_d}相对日期差数<br />
 {_h}相对小时差数<br />
 {_m}相对分钟差数<br />
 {_s}相对秒差数
 * @param {object} [baseTime=new Date()] 相对时间基准对象
 * @returns {string} 格式输出的文本

 * @example
var d0 = new Date(2011, 1, 26, 23, 4, 50),
	d1 = new Date(2011, 2, 5, 23, 4, 50);

function layout(){
	document.write(Array.prototype.join.apply(arguments, ['&lt;br />']));
}

layout(
	QZFL.string.timeFormatString(d1), //10天前   其实是相对于当前时间的智能偏移提示
	QZFL.string.timeFormatString(d1, void(0), d0), //7天前
	QZFL.string.timeFormatString(d1, "{h}时{m}分{s}秒"), //23时04分50秒 
	QZFL.string.timeFormatString(d1, "{_s}分钟前", d0) //604800分钟前 
);

 */
QZFL.string.timeFormatString = function(date, ptn, baseTime){
	try{
		date = date.getTime ? date : (new Date(date));
	}catch(ign){
		return '';
	}
	
	var me = QZFL.string.timeFormatString,
		map = me._map,
		unt = me._units,
		rel = false,
		t,
		delta,
		v;

	if(!ptn){
		baseTime = baseTime || new Date();

		delta = Math.abs(date - baseTime);
		for(var i = 0, len = unt.length; i < len; ++i){
			t = map[unt[i]];
			if(delta > t[1]){
				return Math.floor(delta / t[1]) + t[2];
			}
		}
		return "刚刚";
	}else{
		return ptn.replace(me._re, function(a, b, c){
				(rel = b.charAt(0) == '_') && (b = b.charAt(1));
				if(!map[b]){
					return a;
				}
				if (!rel) {
					v = date[map[b][0]]();
					b == 'y' && (v %= 100);
					b == 'M' && v++;
					return v < 10 ? QZFL.string.fillLength(v, 2, c) : v.toString();
				} else {
					return Math.floor(Math.abs(date - baseTime) / map[b][1]);
				}
			});
	}
};
QZFL.string.timeFormatString._re = /\{([_yYMdhms]{1,2})(?:\:([\d\w\s]))?\}/g;
QZFL.string.timeFormatString._map = {	//sds 不要更改
	y: ['getYear', 31104000000],
	Y: ['getFullYear', 31104000000, '年前'],
	M: ['getMonth', 2592000000, '个月前'],
	d: ['getDate', 86400000, '天前'],
	h: ['getHours', 3600000, '小时前'],
	m: ['getMinutes', 60000, '分钟前'],
	s: ['getSeconds', 1000, '秒前']
};
QZFL.string.timeFormatString._units = [	//sds 不要更改
	'Y', 'M', 'd', 'h', 'm', 's'
];

/**
 * 字符串连加器 deprecated
 *
 * @class 字符串连加器
 * @constructor
 * @deprecated <strong style="color:red;">这个对象和数组连接没什么区别，建议以后不要使用了</strong>
 */
QZFL.string.StringBuilder = function() {
	this._strList = QZFL.lang.arg2arr(arguments);
};

QZFL.string.StringBuilder.prototype = {
	/**
	 * 在尾部增加一段字符串
	 *
	 * @param {string} str 需要加入的字符串
	 */
	append : function(str) {
		this._strList.push(String(str));
	},

	/**
	 * 在最前追加一段字符串
	 *
	 * @param {string} str 需要加入的字符串
	 */
	insertFirst : function(str) {
		this._strList.unshift(String(str));
	},

	/**
	 * 增加一系列字符串
	 *
	 * @param {string[]} arr 需要加入的字符串数组
	 */
	appendArray : function(arr) {
		this._strList = this._strList.concat(arr);
	},

	/**
	 * 系列化方法实现
	 *
	 * @param {string} [spliter=""] 用来分割字符组的符号
	 * @returns {string} 字符串连加器结果
	 */
	toString : function(spliter) {
		return this._strList.join(spliter || '');
	},

	/**
	 * 清空
	 */
	clear : function() {
		this._strList.splice(0, this._strList.length);
	}
};

/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return "text" === elem.getAttribute( 'type' );
		},
		radio: function( elem ) {
			return "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return "checkbox" === elem.type;
		},

		file: function( elem ) {
			return "file" === elem.type;
		},
		password: function( elem ) {
			return "password" === elem.type;
		},

		submit: function( elem ) {
			return "submit" === elem.type;
		},

		image: function( elem ) {
			return "image" === elem.type;
		},

		reset: function( elem ) {
			return "reset" === elem.type;
		},

		button: function( elem ) {
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

/**
 * @ignore
 */
var sortOrder,
	siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// If the nodes are siblings (or identical) we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector,
		pseudoWorks = false;

	try {
		// This should fail with an exception
		// Gecko does not error, returns false instead
		matches.call( document.documentElement, "[test!='']:sizzle" );
	
	} catch( pseudoError ) {
		pseudoWorks = true;
	}

	if ( matches ) {
		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						return matches.call( node, expr );
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}


if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) { //sds hacked
		if(a !== b && a.contains && b.contains){
			return a.contains(b);
		}else if(!b || b.nodeType == 9){
			return false;
		}else if(b === a){
			return true;
		}else{
			return Sizzle.contains(a, b.parentNode);
		}
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
QZFL.selector = window.Sizzle = Sizzle;
QZFL.object.makeArray = QZFL.dom.collection2Array = makeArray;
QZFL.dom.uniqueSort = Sizzle.uniqueSort;
QZFL.dom.contains = Sizzle.contains;


})();

/**
 * @fileoverview QZFL Element对象
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

;
(function() {
	/**
	 * QZFL Element 控制器,通常不要请自传入非string参数
	 *
	 * @param {string|elements} selector selector查询语句,或则一组elements对象
	 * @param {element} context element查询位置
	 * @class QZFL Element 控制器,通常不要请自传入非string参数
	 * @constructor
	 */
	var _handler = QZFL.ElementHandler = function(selector, context){
		/**
		 * 查询到的对象数组
		 *
		 * @type array
		 */
		this.elements = null;
		
		/**
		 * 用来做一个标示区分
		 *
		 * @ignore
		 */
		this._isElementHandler = true;
		
		this._init(selector, context);
		
	};
	/** @lends QZFL.ElementHandler.prototype */
	_handler.prototype = {
		/**
		 * 初始化 elementHandler对象
		 * @private
		 * @param {Object} selector
		 * @param {Object} context
		 */
		_init: function(selector, context){
			if (QZFL.lang.isString(selector)) {
				this.elements = QZFL.selector(selector, context);
			} else if (selector instanceof QZFL.ElementHandler) {
				this.elements = selector.elements.slice();
			} else if (QZFL.lang.isArray(selector)) {
				this.elements = selector;
			} else if (selector && ((selector.nodeType && selector.nodeType !== 3 && selector.nodeType !== 8) || selector.setTimeout)) {
				this.elements = [selector];
			} else {
				this.elements = [];
			}
		},
		/**
		 * 查找 elements 对象
		 *
		 * @param {string} selector selector查询语法
		 *            @example
		 *            $e("div").findElements("li");
		 * @return {Array} elements 数组
		 */
		findElements: function(selector){
			var _pushstack = [],_s;
			this.each(function(el){
				_s = QZFL.selector(selector, el);
				if (_s.length > 0) {
					_pushstack = _pushstack.concat(_s);
				}
			});
			return _pushstack;
		},

		/**
		 * 查找 elements ,并且创建QZFL Elements 对象.
		 *
		 * @param {string} selector selector查询语法
		 *            @example
		 *            $e("div").find("li");
		 * @return {QZFL.ElementHandler}
		 */
		find: function(selector){
			return _el.get(this.findElements(selector));
		},
		filter: function(expr, elems, not){
			if (not) {
				expr = ":not(" + expr + ")";
			}
			return _el.get(QZFL.selector.matches(expr, elems||this.elements));
		},
		/**
		 * 循环执行elements对象
		 *
		 * @param {function} fn 批量执行的操作
		 *            @example
		 *            $e("div").each(function(n){alert("hello!" + n)});
		 */
		each: function(fn){
			QZFL.object.each(this.elements, fn);
			return this;
		},

		/**
		 * 和其他 Element Handler 或 elements Array 合并
		 *
		 * @param {QZFL.ElementHandler|Array} elements Element Handler对象或则
		 *            Element 数组集合
		 *            @example
		 *            $e("div").concat($e("p"))
		 * @return {QZFL.ElementHandler}
		 */
		concat: function(elements){
			return _el.get(this.elements.concat(!!elements._isElementHandler ? elements.elements : elements));
		},

		/**
		 * 通过 index 获取其中一个 Element Handler
		 *
		 * @param {number} index 索引
		 * @return {QZFL.ElementHandler}
		 */
		get: function(index){
			return _el.get(this.elements[index]);
		},
		/**
		 * 取index元素
		 */
		eq: function(index){
			return this.elements[index || 0];
		},
		/**
		 * 含意同Array.prorotype.slice
		 * @param {number} index 索引
		 * @return {QZFL.ElementHandler}
		 */
		slice: function(){
			return _el.get(Array.prototype.slice.apply(this.elements, arguments));
		}
	};
	/**
	 * QZFL Element对象.
	 *
	 * @namespace QZFL element 对象的前端控制器
	 * @requires QZFL.selector
	 * @type Object
	 */
	var _el = QZFL.element = {
		/**
		 * 获取 element 对象
		 *
		 * @param {string} selector selector查询语句
		 *            @example
		 *            QZFL.element.get("div")
		 * @param {element} context element查询位置
		 * @see QZFL.ElementHandler
		 * @return QZFL.ElementHandler
		 */
		get : function(selector, context) {
			return new _handler(selector, context);
		},

		/**
		 * 扩展 QZFL elements Handler 对象接口
		 *
		 * @param {object} object 扩展接口
		 *            @example
		 *            QZFL.element.extend({show:function(){}})
		 */
		extend : function(object) {
			QZFL.object.extend(_handler, object);
		},

		/**
		 * 扩展 QZFL elements Handler 构造函数接口
		 *
		 * @param {object} object 扩展接口
		 *            @example
		 *            QZFL.element.extendFn({show:function(){}})
		 */
		extendFn : function(object) {
			QZFL.object.extend(_handler.prototype, object);
		},

		/**
		 * 返回 QZFL Elements 对象的版本
		 *
		 * @return {string}
		 */
		getVersion : function() {
			return _handler.version;
		}
	}
})();


// 扩展 QZFL Element 接口
QZFL.element.extend(/** @lends QZFL.ElementHandler */
{
	/**
	 * QZFL Element 版本
	 *
	 * @type String

	 */
	version : "1.0"
});

// Extend Events
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{
	/**
	 * 绑定事件
	 *
	 * @param {string} evtType 事件类型
	 * @param {function} fn 触发函数
	 *            @example
	 *            $e("div.head").bind("click",function(){});
	 * @param {object - Array} argArr 传入事件侦听器的参数列表
	 */
	bind : function(evtType, fn, argArr) {
		if(typeof(fn)!='function'){
			return false;
		}
		return this.each(function(el) {
			QZFL.event.addEvent(el, evtType, fn, argArr);
		});
	},

	/**
	 * 取消事件绑定
	 *
	 * @param {string} evtType 事件类型
	 * @param {function} fn 触发函数
	 *            @example
	 *            $e("div.head").unBind("click",function(){});
	 */
	unBind : function(evtType, fn) {
		return this.each(function(el) {
			QZFL.event[fn ? 'removeEvent' : 'purgeEvent'](el, evtType, fn);
		});
	},
	/**
	 * @param {} fn
	 */
	onHover : function(fnOver,fnOut) {
		this.onMouseOver( fnOver);
		return this.onMouseOut( fnOut);
	},
	onMouseEnter:function(fn){
		return this.bind('mouseover',function(evt){
			var rel = QZFL.event.getRelatedTarget(evt); // fromElement
			if(QZFL.lang.isFunction(fn) && !QZFL.dom.isAncestor(this,rel)){
				fn.call(this,evt);
			}
		});
	},
	onMouseLeave:function(fn){
		return this.bind('mouseout',function(evt){
			var rel = QZFL.event.getRelatedTarget(evt); // toElement
			if(QZFL.lang.isFunction(fn) && !QZFL.dom.isAncestor(this,rel)){
				fn.call(this,evt);
			}
		});
	}
});
QZFL.object.each(['onClick', 'onMouseDown', 'onMouseUp', 'onMouseOver', 'onMouseMove', 'onMouseOut', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyPress', 'onKeyUp'], function(name, index){
	QZFL.ElementHandler.prototype[name] = function(fn){
		return this.bind(name.slice(2).toLowerCase(), fn);
	};
});
// Extend Dom
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{

	/**
	 * 设置 dom 的html代码
	 *
	 * @param {string} value
	 */
	setHtml : function(value) {
		return this.setAttr("innerHTML", value);
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getHtml : function(/* @default 0 */index) {
		var _e = this.elements[index || 0];
		return !!_e ? _e.innerHTML : null;
	},

	/**
	 * @param {string} value
	 */
	setVal : function(value) {
		if (QZFL.object.getType(value) == "array") {
			var _v = "\x00" + value.join("\x00") + "\x00";
			this.each(function(el) {
				if (/radio|checkbox/.test(el.type)) {
					el.checked = el.nodeType && ("\x00" + _v.indexOf(el.value.toString() + "\x00") > -1 || _v.indexOf("\x00" + el.name.toString() + "\x00") > -1);
				} else if (el.tagName == "SELECT") {
					//el.selectedIndex = -1;
					QZFL.object.each(el.options, function(e) {
						e.selected = e.nodeType == 1 && ("\x00" + _v.indexOf(e.value.toString() + "\x00") > -1 || _v.indexOf("\x00" + e.text.toString() + "\x00") > -1);
					});
				} else {
					el.value = value;
				}
			})

		} else {
			this.setAttr("value", value);
		}
		return this;
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getVal : function(/* @default 0 */index) {
		var _e = this.elements[index || 0],_v;

		if (_e) {
			if (_e.tagName == "SELECT"){
				_v = [];
				if (_e.selectedIndex<0) {
					return null;
				}

				//如果是单选框
				if (_e.type == "select-one") {
					_v.push(_e.value);
				}else{
					QZFL.object.each(_e.options,function(e){
						if (e.nodeType == 1 && e.selected) {
							_v.push(e.value);
						}
					});
				}
			}else{
				_v = _e.value;
			}
		} else {
			return null
		}
		return _v;
	},

	/**
	 * @param {} className
	 */
	hasClass : function(className) {
		if(this.elements && this.elements.length){
			return QZFL.css.hasClassName(this.elements[0], className);
		}
		return false;
	},

	/**
	 * @param {} className
	 */
	addClass : function(className) {
		return this.each(function(el) {
			QZFL.css.addClassName(el, className);
		})
	},

	/**
	 * @param {} className
	 */
	removeClass : function(className) {
		return this.each(function(el) {
			QZFL.css.removeClassName(el, className);
		})
	},

	/**
	 * @param {} className
	 */
	toggleClass : function(className) {
		return this.each(function(el) {
			QZFL.css.toggleClassName(el, className);
		})
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getSize : function(/* @default 0 */index) {
		var _e = this.elements[index || 0];
		return !!_e ? QZFL.dom.getSize(_e) : null;
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getXY : function(/* @default 0 */index) {
		var _e = this.elements[index || 0];
		return !!_e ? QZFL.dom.getXY(_e) : null;
	},

	/**
	 * @param {} width
	 * @param {} height
	 */
	setSize : function(width, height) {
		return this.each(function(el) {
			QZFL.dom.setSize(el, width, height);
		})
	},

	/**
	 * @param {} X
	 * @param {} Y
	 */
	setXY : function(X, Y) {
		return this.each(function(el) {
			QZFL.dom.setXY(el, X, Y);
		})
	},

	/**
	 *
	 */
	hide : function() {
		return this.each(function(el) {
			QZFL.dom.setStyle(el, "display", "none");
		})
	},

	/**
	 *
	 */
	show : function(isBlock) {
		return this.each(function(el) {
			QZFL.dom.setStyle(el, "display", isBlock?'block':'');
		})
	},

	/**
	 * @param {} key
	 * @return {}
	 */
	getStyle : function(key, index) {
		var _e = this.elements[index || 0];
		return !!_e ? QZFL.dom.getStyle(_e, key) : null;
	},

	/**
	 * @param {} key
	 * @param {} value
	 */
	setStyle : function(key, value) {
		return this.each(function(el) {
			QZFL.dom.setStyle(el, key, value);
		})
	},
	/**
	 * 设置dom的属性
	 *
	 * @param {string} key 属性名称
	 * @param {string} value 属性
	 */
	setAttr : function(key, value) {
		key = (key=="class"?"className":key);

		return this.each(function(el) {
			el[key] = value;
		});
	},

	/**
	 * 获取dom对象的属性
	 */
	getAttr : function(key, index) {
		key = key == "class" ? "className" : key;
		var node = this.elements[index || 0];
		return node ? (node[key] === undefined ? node.getAttribute(key) : node[key]) : null;
	}
});

// Extend Element relation
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{
	/**
	 * @return {}
	 */
	getPrev : function() {
		var _arr = [];
		this.each(function(el) {
			var _e = QZFL.dom.getPreviousSibling(el);
			//if (_e) {
				_arr.push(_e);
			//}
		});

		return QZFL.element.get(_arr);
	},

	/**
	 * @return {}
	 */
	getNext : function() {
		var _arr = [];
		this.each(function(el) {
			var _e = QZFL.dom.getNextSibling(el);
			//if (_e) {
				_arr.push(_e);
			//}
		});

		return QZFL.element.get(_arr);
	},

	/**
	 * @return {}
	 */
	getChildren : function() {
		var _arr = [];
		this.each(function(el) {
			var node = QZFL.dom.getFirstChild(el);
			while (node) {
				if (!!node && node.nodeType == 1) {
					_arr.push(node);
				}
				node = node.nextSibling;
			}
		});

		return QZFL.element.get(_arr);
	},

	/**
	 * @return {}
	 */
	getParent : function() {
		var _arr = [];
		this.each(function(el) {
			var _e = el.parentNode;
			//if (_e) {
				_arr.push(_e);
			//}
		});

		return QZFL.element.get(_arr);
	}
});

// Extend
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{

	/**
	 * @param {} tagName
	 * @param {} attributes
	 * @return {}
	 */
	create : function(tagName, attributes) {
		var _arr = [];
		this.each(function(el) {
			_arr.push(QZFL.dom.createElementIn(tagName, el, false, attributes));
		});
		return QZFL.element.get(_arr);
	},

	/**
	 * @param {} el
	 */
	appendTo : function(el) {
		var el = (el.elements && el.elements[0]) || QZFL.dom.get(el);
		return this.each(function(element) {
			el.appendChild(element)
		});
	},

	/**
	 * @param {} el
	 */
	insertAfter : function(el) {
		var el = (el.elements && el.elements[0]) || QZFL.dom.get(el), _ns = el.nextSibling, _p = el.parentNode;
		return this.each(function(element) {
			_p[!_ns ? "appendChild" : "insertBefore"](element, _ns);
		});

	},

	/**
	 * @param {} el
	 */
	insertBefore : function(el) {
		var el = (el.elements && el.elements[0]) || QZFL.dom.get(el), _p = el.parentNode;
		return this.each(function(element) {
			_p.insertBefore(element, el)
		});
	},

	/**
	 *
	 */
	remove : function() {
		return this.each(function(el) {
			QZFL.dom.removeElement(el);
		})
	}
});

/**
 * QZFL基础动画类
 * @author joltwang
 * @example 更多示例请看src目录里的examples
 */
 QZFL.effect = {
     /**
      * 动画基础方法，对传入的多css属性值进行动画变化，对于支持css3的浏览器采用css3 transform，对于不支持css3的其他浏览器采用timer计算关键帧
      * 来改变元素css属性值。
      * @param elem [string or object] 需要动画处理的dom
      * @param prop [object] 传入需要修改的css属性，如{opacity: 0.25,left: '+=50',width: '+=150',height: '+=100'}
      * @param opts [object] 配置信息，如动画执行时间，执行完回调函数{duration:1000, complete:callbackFun}
      * @example 
      * QZFL.effect.run($('demo'), {
    	  opacity: 0,
    	  top:'100',
          width: '+=150',
          height: '+=100'
        }, {
        	duration : 1000,
            complete : function() {
                //alert('complete');
           }
      });
      */
 	run : function(elem, prop, opts){
		var opts = QZFL.effect._fixOpts(opts),//包装一下参数
            elem = QZFL.dom.get(elem),
            fprop = QZFL.effect._fixProps(prop,elem),
            ua = QZFL.userAgent;
		if(!elem){
			return;
		}

		if(QZFL.effect.isEmptyObject(prop)&&(opts&&!opts.easing)){ //参数为空，直接执行回调函数
			opts.complete();
		}

        if(ua.webkit){//对接css3 trans
            var csstrans = new QZFL.cssTransfrom(elem,fprop,opts);
            csstrans.firecss();
        }else{ //timer模式
            var opt = QZFL.object.extend({}, opts), fns = /^(?:show|hide)$/,cura={};
            //opt.curAnim = QZFL.object.extend({}, prop);//保存下原始值
            for(var i in prop){
				cura[QZFL.string.camelCase(i)]=prop[i];
			}
			opt.curAnim = cura;

            //遍历每个属性, 为每个属性的动画都生成一个animation对象.
            QZFL.object.each(fprop,function(f, pname){
                var e = new QZFL.keyframe(elem, opt, pname),v = prop[pname];
                if(fns.test(v)){
                    e[v === "show" ? v : "hide"](prop);
                }else{
                    e.fireframe(f.start,f.end,f.unit);
                }
            });
        }
 	},
 	
 	/**
 	 * mood的值可以是'timer','auto',可用于将所有的浏览器用timer模式实现动画
 	 * @type String
 	 */
 	mood : 'auto',

     /**
      * 动画淡入显示,IE下使用ie的滤镜实现淡入淡出，支持css3的浏览器使用css3 transform，其他浏览器使用timer模式来实现
      * @param elem [object or string] 需要动画处理的dom
      * @param duration [number] 动画持续的时间
      * @param callback [function] 动画完成后回调函数
      * @example
      * 	QZFL.effect.show($('demo'),1000,function(){
    	  		alert('complete');
      		});
      */
    show : function(elem, duration, callback){
        var elem = QZFL.dom.get(elem),duration = duration || 500, ef = QZFL.effect, ua = QZFL.userAgent;
        callback = QZFL.lang.isFunction(callback)?callback:QZFL.emptyFn
        if(ua.ie && ua.ie > 5&&ef.mood!='timer'){//使用IE的滤镜
        	ef.showElem(elem);
        	ef.fadeFilter(elem,'out',1);
            ef.fadeFilter(elem,'in',duration,callback);
        }else if(ua.webkit&&ef.mood!='timer'){
            ef.showElem(elem);
            QZFL.dom.setStyle(elem,'opacity',0);
            ef.run(elem, {opacity: 1}, {duration : duration, complete : function(){
                QZFL.dom.setStyle(elem,'opacity','');
                callback();
            }, easing: 'ease-in'});
        }else{//timer
            ef.run(elem, {opacity: "show"}, {duration : duration, complete : function(){
            	QZFL.dom.setStyle(elem,'opacity','');
            	callback();
            }});
        }
    },

     /**
      * 动画淡出隐藏，IE下使用ie的滤镜实现淡入淡出，支持css3的浏览器使用css3 transform，其他浏览器使用timer模式来实现
      * @param elem [object or string] 需要动画处理的dom
      * @param duration [number] 动画持续的时间
      * @param callback [function] 动画完成后回调函数
      * @example
      * QZFL.effect.hide($('demo'),1000,function(){
      		alert('complete');
  		});
      */
    hide : function(elem, duration, callback){
        var elem = QZFL.dom.get(elem),duration = duration || 500, ua = QZFL.userAgent,ef = QZFL.effect;
        callback = QZFL.lang.isFunction(callback)?callback:QZFL.emptyFn;
        if(ua.ie && ua.ie > 5&&ef.mood!='timer'){//使用IE的滤镜
            ef.fadeFilter(elem,'out',duration,callback);
            //ef.hideElem(elem);
           // ef.fadeFilter(elem,'in',1);
        }else if(ua.webkit&&ef.mood!='timer'){//css3
			ef.run(elem, {opacity: 0}, {duration : duration, complete : function(){
                ef.hideElem(elem);
                QZFL.dom.setStyle(elem,'opacity','');
                callback();
            }, easing: 'ease-out'});
        }else{//timer
            ef.run(elem, {opacity: "hide"}, {duration : duration, complete : function(){
            	QZFL.dom.setStyle(elem,'opacity','');
            	callback();
            }});
        }
    },

     /**
      * 淡入淡出对接IE的滤镜
      * @param elem [object or string] 需要动画处理的dom
      * @param type 淡入('in')还是淡出('out')
      * @param duration 动画执行时间，如1000(1秒)
      * @param callback 执行完回调
      * @example
      * QZFL.effect.fadeFilter($('demo'),'out',1000,function(){
      		alert('complete');
  		});
      */
    fadeFilter : function(elem,type,duration,callback){
        var duration = duration || 500,
        	func = 'progid:DXImageTransform.Microsoft.Fade(duration='+duration/1000+')',
            o = {'in':'visible','out':'hidden'};
        elem.style.filter = func;
        if (elem.filters && elem.filters.length>0){
            elem.filters[0].Apply();
        }
        elem.style.visibility=o[type];
        if (elem.filters && elem.filters.length>0){
            elem.filters[0].Play();
        }
        elem.onfilterchange=function(){
        	elem.style.filter = '';
            QZFL.lang.isFunction(callback)&&callback();
        }
    },
    
	/**
 	  * Show the matched element.
	  * @param elem [object or string] 需要动画处理的dom
	  * @param duration [number] 动画持续的时间
	  * @param callback [function] 动画完成后回调函数
	  * @example
	  * QZFL.effect.showElem($('demo'));
	  */
 	showElem : function(elem, duration, callback){
		var elem = QZFL.dom.get(elem), display, prop;
        prop = QZFL.effect._genAnimation("show", 3);
        
		if(duration || duration === 0){
			QZFL.effect.run(elem, prop, {duration : duration, complete : callback});
		}else{
            display = elem.style.display;
            if(!elem.predisplay && display === "none"){
                display = elem.style.display = "";
            }
            if(display === "" && QZFL.dom.getStyle( elem, "display" ) === "none"){
                elem.predisplay = QZFL.effect._defaultDisplay(elem.nodeName);//记录下之前的值
            }
            display = elem.style.display;
            if(display === "" || display === "none" ){
                elem.style.display = elem.predisplay || "";
            }
		}
 	},

	/**
 	  * Hide the matched element.
	  * @param elem [object or string] 需要动画处理的dom
	  * @param duration [number] 动画持续的时间
	  * @param callback [function] 动画完成后回调函数
	  * @example
	  * QZFL.effect.hideElem($('demo'));
	  */
 	hideElem : function(elem,speed){
		var elem = QZFL.dom.get(elem), display, prop;
        prop = QZFL.effect._genAnimation("hide", 3);

        if ( speed || speed === 0 ) {
            QZFL.effect.run(elem, prop, {duration : speed, complete : callback});
		} else {
            var display = QZFL.dom.getStyle(elem, "display" );

            if ( display !== "none" && !elem.predisplay) {
                elem.predisplay = display;
            }
			elem.style.display = "none";
		}
 	},

 	isEmptyObject: function( obj ){
		for(var name in obj){
			return false;
		}
		return true;
	},

     /**
      * 停止elme dom元素上的动画
      * @param elem [object or string] 需要动画处理的dom
      * @example
      * QZFL.effect.stop($('demo'));
      */
 	stop: function(elem){
 		var ua = QZFL.userAgent,elem = QZFL.dom.get(elem);
 		if(ua.webkit){
 			var uid = elem._transition._uid;
 			elem.style.cssText = QZFL.cssTransfrom._cssText[uid];
 		}else{
			var timers = QZFL.effect.timers;
	        for(var i = timers.length - 1; i >= 0; i--){
	            if(timers[i].elem === elem){
	                timers.splice(i, 1);
	            }
	        }
 		}
	},
	
	getPercent:function(elem){
		var ua = QZFL.userAgent,elem = QZFL.dom.get(elem);
		
		if(ua.webkit){
 			var p = elem._transition.percent;
 			return elem==null?0:p;
 		}else{
			return elem==null?0:elem.percent;
 		}
	},

 	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},
	
	/**
 	 * 修正一下传入的参数
     * @param opts 配置参数
 	 */
 	_fixOpts : function(opts){
		var opt = opts,ua = QZFL.userAgent;
		opt.duration = QZFL.keyframe.off ? 0 : typeof opt.duration === "number" ? opt.duration : (opt.duration in QZFL.keyframe.speeds ? QZFL.keyframe.speeds[opt.duration] : QZFL.keyframe.speeds._default);

		opt.easing = ua.webkit?(opts.easing || false):false;
		opt.old = opt.complete;
		opt.complete = function(){
			if(QZFL.lang.isFunction(opt.old)){
				opt.old.call( this );
			}
		};

		return opt;
 	},

     /**
      * 对传入的css属性做下计算
      * @param prop
      * @param elem
      */
    _fixProps : function(prop,elem){
        var fprop = {},es = QZFL.effect,ua = QZFL.userAgent,webkit = ua.webkit;

        //遍历每个属性
        QZFL.object.each(prop, function(val, pname){
        	pname = QZFL.string.camelCase(pname);
        	if(QZFL.object.getType(val) == "object"){
        		var f = es._cssValue(elem,val.value,pname);
        		if(webkit){
        			val.value = f.end + (f.unit?f.unit:0);
        			fprop[pname] = val;
        		}else{
        			fprop[pname] = f;
        		}
        	}else{
        		var d = es._cssValue(elem,val,pname);
        		if(webkit){
        			d =  d.end + (d.unit?d.unit:0); 
        		}
        		fprop[pname] = d;
        	}
        });
        
        return fprop;
    },
    
	/**
     * 计算某个动画元素上的起始值及单位
     */
    _cssValue : function(elem,val,name){
		var fnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,fprop = {}, parts = fnum.exec(val),es = QZFL.effect, start = es._cur(elem,name);//修正开始时的位置

        if(parts){ //如果是+= or -=
            var end = parseFloat(parts[2]), unit = parts[3]||(es._cssNumber[name] ? "" : "px");
            if (unit !== "px") {//单位不是px的
                QZFL.dom.setStyle(elem, name, (end || 1) + unit);
                start = ((end || 1) / es._cur(elem,name)) * start;
                QZFL.dom.setStyle(elem, name, start + unit);
            }
            if (parts[1]) {
                end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
            }
            fprop = {start : start,end : end,unit:unit};
        }else{
            fprop = {start : start,end : val,unit:''};
        }
        
        return fprop;
    },
    
    _cssNumber : {"zIndex": true,"fontWeight": true,"opacity": true,"zoom": true,"lineHeight": true},
	
	_cur : function(elem,p) {
		if(elem!=null && elem[p] != null && (!elem.style || elem.style[p] == null)){
			return elem[p];
		}
		var parsed, r = QZFL.dom.getStyle(elem,p);
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},
	
	_elemdisplay : {},

    _defaultDisplay : function(nodeName) {
    	var es = QZFL.effect;
        if(!es._elemdisplay[nodeName]){
            var elem = QZFL.dom.createElementIn(nodeName),display = QZFL.dom.getStyle(elem,"display");
            QZFL.dom.removeElement(elem);
            if(display === "none" || display === ""){
                display = "block";
            }
            es._elemdisplay[nodeName] = display;
        }
        return es._elemdisplay[ nodeName ];
    },

    _genAnimation : function(type){
        var obj = {},custom = ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ,"width", "marginLeft", "marginRight", "paddingLeft", "paddingRight", "opacity"];
        QZFL.object.each(custom, function(key, value){
            obj[key] = type;
        });
        return obj;
    },
    
    timers : [],
    timerId : null
 };

/**
 * 动画关键帧[timer模式]，供QZFL.effect使用，不单独调用
 */
 QZFL.keyframe = function(elem, opts, prop){
    this.opts = opts;
	this.elem = elem;
	this.prop = prop;

	if (!opts.orig) {
		opts.orig = {};
	}
 }

 QZFL.keyframe.prototype = {
	update : function() {
		if (this.opts.step ) {
			this.opts.step.call( this.elem, this.now, this );
		}
		(QZFL.keyframe.step[this.prop] || QZFL.keyframe.step._default)( this );
	},

	cur : function() {
		return QZFL.effect._cur(this.elem,this.prop);
	},

	fireframe : function( from, to, unit ) {
		var self = this, fx = QZFL.keyframe;

		this.startTime = QZFL.now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || (QZFL.effect._cssNumber[this.prop] ? "" : "px" );
		this.now = this.start;
		this.pos = this.state = 0;

		function t(gotoEnd) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if (t() && QZFL.effect.timers.push(t) && !QZFL.effect.timerId ) {
			QZFL.effect.timerId = setInterval(fx.fire, fx.interval);
		}
	},

	show: function(){
		//QZFL.dom.setStyle( this.elem, this.prop );
		this.opts.orig[this.prop] = QZFL.dom.getStyle(this.elem,this.prop);
		this.opts.show = true;
		this.fireframe(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
		QZFL.effect.showElem(this.elem);
	},

	hide: function(){
		//QZFL.dom.setStyle( this.elem, this.prop );
		this.opts.orig[this.prop] = QZFL.dom.getStyle( this.elem, this.prop );
		this.opts.hide = true;
		this.fireframe(this.cur(), 0);
	},

	step: function(gotoEnd){
		var t = QZFL.now(),percent=0, done = true;
		if( gotoEnd || t >= this.opts.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();
			this.opts.curAnim[ this.prop ] = true;
			percent = 100;
			this.elem.percent = percent;

			for(var i in this.opts.curAnim){
				if(this.opts.curAnim[i] !== true){
					done = false;
				}
			}
			if(done){
				if(this.opts.overflow != null) {
					var elem = this.elem,opts = this.opts;
					QZFL.object.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = opts.overflow[index];
					});
				}

				if(this.opts.hide){
					QZFL.effect.hideElem(this.elem);
				}

				if(this.opts.hide || this.opts.show){//淡入淡出时还原一些值，如opacity
					for(var p in this.opts.curAnim){
						QZFL.dom.setStyle(this.elem, p, this.opts.orig[p]);
					}
				}
				this.opts.complete.call( this.elem );
			}
			if(this.opts.change!=null && typeof this.opts.change == 'function'){
				var prop = this.prop;
				this.opts.change(this.elem,prop,parseFloat(QZFL.dom.getStyle(this.elem, prop)));
			}
			
			return false;
		}else{
			var n = t - this.startTime;
			this.state = n / this.opts.duration;
			var specialEasing = this.opts.specialEasing && this.opts.specialEasing[this.prop],
				defaultEasing = this.opts.easing || (QZFL.effect.easing.swing ? "swing" : "linear");
			this.pos = QZFL.effect.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.opts.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);
			this.update();
			percent = this.state*100||0;
		}
		if(this.opts.change!=null && typeof this.opts.change == 'function'){
			var prop = this.prop;
			this.opts.change(this.elem,prop,parseFloat(QZFL.dom.getStyle(this.elem, prop)));
		}
		this.elem.percent = percent;

		return true;
	}
};

QZFL.object.extend(QZFL.keyframe, {
	fire : function() { //启动关键帧，让其执行
		var timers = QZFL.effect.timers;
		for( var i = 0; i < timers.length; i++ ) {
			if(!timers[i]()){
				timers.splice(i--, 1);
			}
		}
		if(!timers.length){
			QZFL.keyframe.stop();
		}
	},

	step : {//渲染到页面上
		opacity: function(frame) {
			QZFL.dom.setStyle(frame.elem, "opacity", frame.now );
		},

		_default: function(frame) {
			if(frame.elem.style && frame.elem.style[ frame.prop ] != null){
				frame.elem.style[ frame.prop ] = (frame.prop === "width" || frame.prop === "height" ? Math.max(0, frame.now) : frame.now) + frame.unit;
			}else{
				frame.elem[ frame.prop ] = frame.now;
			}
		}
	},

	interval : 13,//关键帧间隔

	stop : function() {
		clearInterval(QZFL.effect.timerId);
		QZFL.effect.timerId = null;
	},

	speeds : {
		slow: 600,
		fast: 200,
		_default: 400
	}
});

/**
 * css3 transfrom[css3模式]，供QZFL.effect使用，不单独调用
 */
 QZFL.cssTransfrom = function(elem,prop,opts){
    var tran = this;
    tran._elem = elem;
    tran._uid = 'uid_'+QZFL.now();
    if(!tran._running && prop){
        tran._config = prop;
        tran._duration = ('duration' in opts) ? opts.duration/1000: 0.5;
        tran._delay = ('delay' in opts) ? opts.delay: 0;
        tran._easing = opts.easing || 'ease';
        tran._count = 0;
        tran._running = false;
        tran._callback = QZFL.lang.isFunction(opts.complete)?opts.complete:QZFL.emptyFn;
        tran._change = opts.change;
        elem._transition = tran;
    }
    return tran;
 };

 QZFL.cssTransfrom._cssText = {};
 QZFL.cssTransfrom._elemAttrs = {};
 QZFL.cssTransfrom._hasEnd = {};

 QZFL.cssTransfrom.prototype = {
    firecss : function(){
        var tran = this, elem = tran._elem,uid = tran._uid,
            config = this._config,
            style = elem.style,
            getStyle = QZFL.dom.getStyle,
            attrs = QZFL.cssTransfrom._elemAttrs[uid],
            cssText = '',
            DELAY = '-webkit-transition-delay',
            TRANSFORM = 'WebkitTransform',
            cssTransition = getStyle(elem,'-webkit-transition-property'),
            transitionText = '-webkit-transition-property: ',
            duration = '-webkit-transition-duration: ',
            easing = '-webkit-transition-timing-function: ',
            delay = DELAY + ': ',
			quote = /,$/,
			_cprop='';

        if (config.transform && !config[TRANSFORM]) {
            config[TRANSFORM] = config.transform;
            delete config.transform;
        }
        for (attr in config) {
            if(config.hasOwnProperty(attr)){
                tran._addProperty(attr,config[attr]);
                if (elem.style[attr] === '') {
                    QZFL.dom.setStyle(elem, attr, QZFL.dom.getStyle(elem, attr));
                }
            }
            _cprop = attr;
        }

        if(cssTransition !== 'all'){
            transitionText += cssTransition + ',';
            duration += getStyle(elem,'-webkit-transition-duration') + ',';
            easing += getStyle(elem,'-webkit-transition-timing-function') + ',';
            delay += getStyle(elem,DELAY) + ',';
        }

        attrs = QZFL.cssTransfrom._elemAttrs[uid];
        for(name in attrs){
            hyphy = tran._toHyphen(name);
            attr = attrs[name];
            if (attrs.hasOwnProperty(name) && attr.transition === tran) {
                if (name in elem.style) {
                    duration += parseFloat(attr.duration) + 's,';
                    delay += parseFloat(attr.delay) + 's,';
                    easing += (attr.easing) + ',';
                    transitionText += hyphy + ',';
                    cssText += hyphy + ': ' + attr.value + '; ';
                } else {
                    tran._removeProperty(name);
                }
            }
        }
        
        transitionText = transitionText.replace(quote, ';');
        duration = duration.replace(quote, ';');
        easing = easing.replace(quote, ';');
        delay = delay.replace(quote, ';');

        if(!QZFL.cssTransfrom._hasEnd[uid]) {//判断是否结束
            elem.addEventListener('webkitTransitionEnd', function(e){
            	tran._onTransfromEnd(e,uid);
            }, false);
            QZFL.cssTransfrom._hasEnd[uid] = true;
        }
		
		QZFL.cssTransfrom._cssText[uid] = cssText;//记录一下cssText，方便终止动画
		//开始渲染css3
        style.cssText += transitionText + duration + easing + delay + cssText;
		
		var t = tran._duration*1000,c=0,interval=13,timerId;
		elem._transition.percent = 0;
		timerId = setInterval(function(){
			var o = t-interval*c;
			if(o<interval&&o>0){
				clearInterval(timerId);
			}
			if(tran._change!=null&&typeof tran._change=='function'){
				tran._change(elem,_cprop,parseFloat(QZFL.dom.getStyle(elem, _cprop)));
			}
			if(elem._transition.percent<100){
				elem._transition.percent = (interval*c)/t*100||0;
			}
			c++;
		}, interval);
    },
    
	_toHyphen : function(prop) {
        prop = prop.replace(/([A-Z]?)([a-z]+)([A-Z]?)/g, function(m0, m1, m2, m3) {
            var str = '';
            m1&&(str += '-' + m1.toLowerCase());
            str += m2;
            m3&&(str += '-' + m3.toLowerCase());
            return str;
        });

        return prop;
	},

    _endTransfrom: function(sname) {//结束后，对元素上的style做下清理
        var elem = this._elem, value = QZFL.dom.getStyle(elem,'-webkit-transition-property');

        if(typeof value === 'string'){
            value = value.replace(new RegExp('(?:^|,\\s)' + sname + ',?'), ',');
            value = value.replace(/^,|,$/, '');
            elem.style['WebkitTransition'] = value;
        }
    },

    _onTransfromEnd: function(e,uid){
        var event = e,
        	elem = this._elem,
            pname = QZFL.string.camelCase(event.propertyName),
            elapsed = event.elapsedTime,
            attrs = QZFL.cssTransfrom._elemAttrs[uid],
            attr = attrs&&attrs[pname],
            tran = (attr) ? attr.transition : null,_cprop='';
        if(tran){
        	for (attr in this._config) {
	            _cprop = attr;
	        }
	        elem._transition.percent = 100;
        	if(this._change!=null&&typeof this._change=='function'){
				this._change(elem,_cprop,parseFloat(QZFL.dom.getStyle(elem, _cprop)));
			}
            tran._removeProperty(pname);
            tran._endTransfrom(pname);

            if(tran._count <= 0){
                tran._end(elapsed);
            }
        }
    },

    _addProperty: function(prop, config){//对动画配置项计算一下，并添加到_elemAttrs里
        var tran = this,node = this._elem,
            uid = tran._uid,
            attrs = QZFL.cssTransfrom._elemAttrs[uid],
            computed,compareVal,dur,attr,val;
        if(!attrs) {
            attrs = QZFL.cssTransfrom._elemAttrs[uid] = {};
        }
        attr = attrs[prop];
        if(config && config.value !== undefined) {
            val = config.value;
        }else if(config !== undefined) {
            val = config;
            config = {};
        }

        if(attr && attr.transition) {
            if (attr.transition !== tran) {
               attr.transition._count--;
            }
        }

        tran._count++;
        dur = ((typeof config.duration != 'undefined') ? config.duration : tran._duration) || 0.0001;

        attrs[prop] = {
            value: val,
            duration: dur,
            delay: (typeof config.delay != 'undefined') ? config.delay : tran._delay,
            easing: config.easing || tran._easing,
            transition: tran
        };

        computed = QZFL.dom.getStyle(node, prop);
        compareVal = (typeof val === 'string') ? computed : parseFloat(computed);

        if (compareVal === val) {
            setTimeout(function() {
                tran._onTransfromEnd.call(node, {
                    propertyName: prop,
                    elapsedTime: dur
                });
            }, dur * 1000);
        }
    },

    _removeProperty: function(prop){//清理参数
        var tran = this, attrs = QZFL.cssTransfrom._elemAttrs[tran._uid];

        if (attrs && attrs[prop]) {
            delete attrs[prop];
            tran._count--;
        }
    },

    _end: function(elapsed){//css3动画结束，执行回调
        var tran = this, elem = tran._elem, callback = tran._callback, config = tran._config;
        tran._running = false;
        tran._callback = null;
        
        if(elem&&callback){
        	setTimeout(function() {
				callback();
			}, 1);
        }
    }
 };
 
QZFL.now = function(){
    return (new Date()).getTime();
};

QZFL.string = QZFL.string||{};
/**
 * 将css属性名(例如margin-left)转化成javascript样式(例如marginLeft)
 * @param s [string] css  
 * @return {}
 */
QZFL.string.camelCase = function(s){
	var r = /-([a-z])/ig;
	return s.replace(r,function(all,letter) {
		return letter.toUpperCase();
	});
};

/**
 * 用新的QZFL.effect对接之前的Tween方法,老的版本不再合入QZFL版本里，如想使用请单独加载一份tween.js
 * @param {string} elem 需要动画处理的dom
 * @param {string} prop css属性名
 * @param {function} func 动画算子
 * @param {string or number} startValue 初始值
 * @param {string or number} finishValue 结束值
 * @param {number} duration 动画执行时间
 */
QZFL.Tween = function(elem, prop, func, startValue, finishValue, duration){
	this.elem = QZFL.dom.get(elem);
	this.prop = {};
	this.sv = startValue;
	this.pname = prop;
	this.prop[prop] = parseInt(finishValue);
	this.opts = {duration : duration*1000};
	this.onMotionStart = QZFL.emptyFn;
	this.onMotionChange = null;
	this.onMotionStop = QZFL.emptyFn;
}

/**
 * 开始运行动画
 * @param {} loop 废弃
 */
QZFL.Tween.prototype.start = function(loop){
	var that = this;
	QZFL.dom.setStyle(this.elem,this.pname,this.sv);
	this.opts.complete = this.onMotionStop;
	this.opts.change = function(){
		that.onMotionChange&&that.onMotionChange.apply(that,arguments);
	}
	this.onMotionStart.apply(this);
	QZFL.effect.run(this.elem,this.prop,this.opts);
}

QZFL.Tween.prototype.getPercent = function(){
	return QZFL.effect.getPercent(this.elem);
};

/**
 * 停止or暂停动画
 */
QZFL.Tween.prototype.stop = function() {
	QZFL.effect.stop(this.elem);
};

/**
 * 兼容老的算子类，老的版本不再合入QZFL版本里，如想使用请单独加载一份tween.js
 */
QZFL.transitions = {};
/**
 * @fileoverview 把tween类的接口封装到QZFL Elements
 * @version 1.$Rev: 1723 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2010-04-08 19:26:57 +0800 (周四, 08 四月 2010) $
 */
;(function() {
	/**
	 * resize和move的算法
	 */
	var _easeAnimate = function(_t, a1, a2, ease) {
		var _s = QZFL.dom["get" + _t](this), _reset = typeof a1 != "number" && typeof a2 != "number";

		if (_t == "Size" && _reset) {
			QZFL.dom["set" + _t](this, a1, a2);
			var _s1 = QZFL.dom["get" + _t](this);
			a1 = _s1[0];
			a2 = _s1[1];
		}

		var _v1 = _s[0] - a1;
		var _v2 = _s[1] - a2;

		var n = new QZFL.Tween(this, "_p", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, 0, 100, 0.5);

		n.onMotionChange = QZFL.event.bind(this, function() {
			var _p = arguments[2];
			QZFL.dom["set" + _t](this, typeof a1 != "number" ? _s[0] : (_s[0] - _p / 100 * _v1), typeof a2 != "number" ? _s[1] : (_s[1] - _p / 100 * _v2));
		});

		// reset size to auto
		if (_t == "Size" && _reset) {
			n.onMotionStop = QZFL.event.bind(this, function() {

				QZFL.dom["set" + _t](this);

			});
		}

		n.start();
	};

	var _easeShowAnimate = function(_t, ease) {
		var n = new QZFL.Tween(this, "opacity", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, (_t ? 0 : 1), (_t ? 1 : 0), 0.5);
		n[_t ? "onMotionStart" : "onMotionStop"] = QZFL.event.bind(this, function() {
			this.style.display = _t ? "" : "none";
			QZFL.dom.setStyle(this, "opacity", 1);
		});
		n.start();
	};

	var _easeScroll = function(top, left, ease) {
		if (this.nodeType == 9) {
			var _stl = [
						QZFL.dom.getScrollTop(this),
						QZFL.dom.getScrollLeft(this)];
		} else {
			var _stl = [this.scrollTop, this.scrollLeft];
		}

		var _st = _stl[0] - top;
		var _sl = _stl[1] - left;

		var n = new QZFL.Tween(this, "_p", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, 0, 100, 0.5);
		n.onMotionChange = QZFL.event.bind(this, function() {
			var _p = arguments[2], _t = (_stl[0] - _p / 100 * _st), _l = (_stl[1] - _p / 100 * _sl);

			if (this.nodeType == 9) {
				QZFL.dom.setScrollTop(_t, this);
				QZFL.dom.setScrollLeft(_l, this);
			} else {
				this.scrollTop = _t;
				this.scrollLeft = _l;
			}
		});
		n.start();
	};

	QZFL.element.extendFn({
		tween : function(){
			
		},
		
		/**
		 * 渐变显示
		 * @param {string} effect 转换效果,目前只支持"resize"
		 * @param {string} ease 动画效果
		 * @example $e(document).effectShow();
		 */
		
		effectShow : function(effect, ease) {
			this.each(function(el) {
				_easeShowAnimate.apply(el, [true, ease])
			});
			if (effect == "resize") {
				this.each(function(el) {
					_easeAnimate.apply(el, ["Size", null, null, ease])
				});
			}
		},
		/**
		 * 渐变隐藏
		 * @param {string} effect 转换效果,目前只支持"resize"
		 * @param {string} ease 动画效果
		 * @example $e(document).effectHide();
		 */
		effectHide : function(effect, ease) {
			this.each(function(el) {
				_easeShowAnimate.apply(el, [false, ease])
			});
			if (effect == "resize") {
				this.each(function(el) {
					_easeAnimate.apply(el, ["Size", 0, 0, ease])
				});
			}
		},
		/**
		 * 改变尺寸
		 * @param {number} width 宽度
		 * @param {number} height 高度
		 * @param {string} ease 动画效果
		 * @example $e(document).effectResize(200,200);
		 */
		effectResize : function(width, height, ease) {
			this.each(function(el) {
				_easeAnimate.apply(el, ["Size", width, height, ease])
			});
		},
		/**
		 * 改变位置
		 * @param {number} x x坐标
		 * @param {number} y y坐标
		 * @param {string} ease 动画效果
		 * @example $e(document).effectMove(200,200);
		 */
		effectMove : function(x, y, ease) {
			this.each(function(el) {
				_easeAnimate.apply(el, ["XY", x, y, ease])
			});
		},
		/**
		 * 滚动条滑动
		 * @param {number} top 纵向距离
		 * @param {number} left 横向距离
		 * @param {string} ease 动画效果
		 * @example $e(document).effectScroll(200);
		 */
		effectScroll : function(top, left, ease) {
			this.each(function(el) {
				_easeScroll.apply(el, [top, left, ease])
			});
		}
		// ,
		//
		// effectNotify : function(ease) {
		// this.each(function() {
		// var _c = QZFL.dom.getStyle(this,"backgroundColor");
		// var n = new QZFL.Tween(this, "backgroundColor",
		// QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, "#ffffff",
		// "#ffff00", 0.8);
		//
		// n.onMotionStop = QZFL.event.bind(this,function(){
		// var o = this;
		// setTimeout(function(){
		// var n = new QZFL.Tween(o, "backgroundColor", QZFL.transitions[ease]
		// || QZFL.transitions.regularEaseOut, "#ffff00", "#ffffff", 1);
		// n.onMotionStop = function(){
		// o.style.backgroundColor = "transparent";
		// }
		// n.start();
		// },1000)
		// });
		// n.start();
		// });
		// }
	})
})();
/**
 * @fileoverview QZFL AJAX类
 * @version 1.$Rev: 1924 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:52:16 +0800 (周二, 11 一月 2011) $
 */

/**
 * XMLHttpRequest通信器类
 *
 * @class QZFL.XHR
 * @constructor
 * @namespace QZFL.XHR
 * @param {String} actionURI 请求地址
 * @param {String} [cname] 对象实体的索引名，默认是"_xhrInstence_n"，n为序号
 * @param {String} [method] 发送方式，除非指明get，否则全部为post
 * @param {Object} [data] hashTable形式的字典
 * @param {Boolean} [isAsync] 是否异步，除非指明同步false,否则全部为异步true
 */
QZFL.XHR = function(actionURL, cname, method, data, isAsync, nocache) {
	/*if (!QZFL.string.isURL(actionURL)) {
		rt.error("error actionURL -> {0:Q} in QZFL.XHR construct!", actionURL);
		return null;
	}*/
	if (!cname) {
		cname = "_xhrInstence_" + (QZFL.XHR.counter + 1);
	}
	/**
	 * 辅助原型
	 *
	 * @type {QZFL.XHR}
	 */
	var prot;
	if (QZFL.XHR.instance[cname] instanceof QZFL.XHR) {
		prot = QZFL.XHR.instance[cname];
	} else {
		prot = (QZFL.XHR.instance[cname] = this);
		QZFL.XHR.counter++;
	}
	prot._name = cname;
	prot._nc = !!nocache;
	prot._method = (QZFL.object.getType(method) != "string" || method.toUpperCase() != "GET")
			? "POST"
			: (method = "GET");
	prot._isAsync = (!(isAsync === false)) ? true : isAsync;
	prot._uri = actionURL;
	prot._data = (QZFL.object.getType(data) == "object" || QZFL.object.getType(data) == 'string') ? data : {};
	prot._sender = null;
	prot._isHeaderSetted = false;

	// 对外的接口
	/**
	 * 当成功回调时,跨域请求和同域请求返回的数据不一样
	 *
	 * @event
	 * @memberOf QZFL.XHR
	 */
	this.onSuccess = QZFL.emptyFn;

	/**
	 * 当错误回调时,跨域请求和同域请求返回的数据不一样
	 *
	 * @event
	 * @memberOf QZFL.XHR
	 */
	this.onError = QZFL.emptyFn;

	/**
	 * 使用的编码
	 *
	 * @memberOf QZFL.XHR
	 * @type string
	 */
	this.charset = "gb2312";

	/**
	 * 参数化proxy的路径
	 * @type string
	 */
	this.proxyPath = "";



	return prot;
};

QZFL.XHR.instance = {};
QZFL.XHR.counter = 0;
QZFL.XHR._errCodeMap = {
	400 : {
		msg : 'Bad Request'
	},
	401 : {
		msg : 'Unauthorized'
	},
	403 : {
		msg : 'Forbidden'
	},
	404 : {
		msg : 'Not Found'
	},
	999 : {
		msg : 'Proxy page error'
	},
	1000 : {
		msg : 'Bad Response'
	},
	1001 : {
		msg : 'No Network'
	},
	1002 : {
		msg : 'No Data'
	},
	1003 : {
		msg : 'Eval Error'
	}
};

/**
 * 跨域发送请求
 *
 * @private
 * @return {Boolean} 是否成功
 */
QZFL.XHR.xsend = function(o, uri) {
	if (!(o instanceof QZFL.XHR)) {
		return false;
	}

	if (QZFL.userAgent.firefox && QZFL.userAgent.firefox < 3) {
		//QZFL.runTime.error("can't surport xsite in firefox!");
		return false;
	}

	function clear(obj) {
		try {
			obj._sender = obj._sender.callback = obj._sender.errorCallback = obj._sender.onreadystatechange = null;
		} catch (ignore) {
		}

		if (QZFL.userAgent.safari || QZFL.userAgent.opera) {
			setTimeout('QZFL.dom.removeElement($("_xsend_frm_' + obj._name + '"))', 50);
		} else {
			QZFL.dom.removeElement($("_xsend_frm_" + obj._name));
		}
	}

	if (o._sender === null || o._sender === void(0)) {
		var sender = document.createElement("iframe");
		sender.id = "_xsend_frm_" + o._name;
		sender.style.width = sender.style.height = sender.style.borderWidth = "0";
		document.body.appendChild(sender);
		sender.callback = QZFL.event.bind(o, function(data) {
					o.onSuccess(data);
					clear(o);
				});
		sender.errorCallback = QZFL.event.bind(o, function(num) {
					o.onError(QZFL.XHR._errCodeMap[num]);
					clear(o);
				});

		o._sender = sender;
	}
	// 获取proxy页面中js库的位置
	var tmp = QZFL.config.gbEncoderPath;
	o.GBEncoderPath = tmp ? tmp : "";

	o._sender.src = uri.protocol + "://" + uri.host + (this.proxyPath
			? this.proxyPath
			: "/xhr_proxy_gbk.html");
	return true;
};


QZFL.XHR.genHttpParamString = function(o, cs){
	cs = (cs || "gb2312").toLowerCase();
	var r = [];

	for (var i in o) {
		r.push(i + "=" + ((cs == "utf-8") ? encodeURIComponent(o[i]) : QZFL.string.URIencode(o[i])));
	}

	return r.join("&");
};


/**
 * 发送请求
 *
 * @return {Boolean} 是否成功
 */
QZFL.XHR.prototype.send = function() {
	if (this._method == 'POST' && this._data == null) {
		//QZFL.runTime.warn("QZFL.XHR -> {0:q}, can't send data 'null'!", this._name);
		return false;
	}

	var u = new QZFL.util.URI(this._uri);
	if (u == null) {
		//QZFL.runTime.warn("QZFL.XHR -> {0:q}, bad url", this._name);
		return false;
	}

	this._uri = u.href;

	if(QZFL.object.getType(this._data)=="object"){
		this._data = QZFL.XHR.genHttpParamString(this._data, this.charset);
	}

	if(this._method == 'GET' && this._data){
		this._uri += (this._uri.indexOf("?") < 0 ? "?"  : "&") +  this._data;
	}

	//判断是否需要跨域请求数据
	if (u.host != location.host) {
		return QZFL.XHR.xsend(this, u);
	}

	if (!this._sender) {

		var sender;

		if(window.XMLHttpRequest){
			sender = new XMLHttpRequest();
		}else if(window.ActiveXObject){
			try{
				!(sender = new ActiveXObject("Msxml2.XMLHTTP")) && (sender = new ActiveXObject("Microsoft.XMLHTTP"));
			}catch(ign){}
		}

		if (!sender) {
			//QZFL.runTime.error("QZFL.XHR -> {0:q}, create xhr object faild!", this._name);
			return false;
		}

		this._sender = sender;
	}

	try {
		this._sender.open(this._method, this._uri, this._isAsync);
	} catch (err) {
		//QZFL.runTime.error("exception when opening connection to {0:q}:{1}", this._uri,err);
		return false;
	}

	if (this._method == 'POST' && !this._isHeaderSetted) {
		this._sender.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		this._isHeaderSetted = true;
	}

	if (this._nc) {
		this._sender.setRequestHeader('If-Modified-Since', 'Thu, 1 Jan 1970 00:00:00 GMT');
		this._sender.setRequestHeader('Cache-Control', 'no-cache');
	}

	this._sender.onreadystatechange = QZFL.event.bind(this, function() {
		try {
			if (this._sender.readyState == 4) {
				if (this._sender.status >= 200 && this._sender.status < 300) {
					this.onSuccess({
						text : this._sender.responseText,
						xmlDom : this._sender.responseXML
					});
				} else {
					if (QZFL.userAgent.safari && (QZFL.object.getType(this._sender.status) == 'undefined')) {
						this.onError(QZFL.XHR._errCodeMap[1002]);
					} else {
						this.onError(QZFL.XHR._errCodeMap[this._sender.status]);
					}
				}
				delete this._sender;
				this._sender = null;
			}
		} catch (err) {
			//QZFL.runTime.error("unknow exception in QZFL.XHR.prototype.send()");
		}
	});

	this._sender.send((this._method == 'POST' ? this._data : void(0)));
	return true;
};

/**
 * QZFL.XHR对象自毁方法，用法 ins=ins.destroy();
 *
 * @return {Object} null用来复写引用本身
 */
//这个消毁方法没有使用啊，幸好！ ryan
//QZFL.XHR.counter的使用有问题，如果是当ID来用的，就不能--，如果是计数来用的，就不能做为frame的id
//否则可能导致请求丢掉
QZFL.XHR.prototype.destroy = function() {
	var n = this._name;
	delete QZFL.XHR.instance[n]._sender;
	QZFL.XHR.instance[n]._sender = null;
	delete QZFL.XHR.instance[n];
	QZFL.XHR.counter--;
	return null;
};

/**
 * @fileoverview QZFL cookie数据处理
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * cookie类,cookie类可以让开发很轻松得控制cookie，我们可以随意增加修改和删除cookie，也可以轻易设置cookie的path, domain, expire等信息
 *
 * @namespace QZFL.cookie
 */
QZFL.cookie = {
	/**
	 * 设置一个cookie,还有一点需要注意的，在qq.com下是无法获取qzone.qq.com的cookie，反正qzone.qq.com下能获取到qq.com的所有cookie.
	 * 简单得说，子域可以获取根域下的cookie, 但是根域无法获取子域下的cookie.
	 * @param {String} name cookie名称
	 * @param {String} value cookie值
	 * @param {String} domain 所在域名
	 * @param {String} path 所在路径
	 * @param {Number} hour 存活时间，单位:小时
	 * @return {Boolean} 是否成功
	 * @example
	 *  QZFL.cookie.set('value1',QZFL.dom.get('t1').value,"qzone.qq.com","/v5",24); //设置cookie
	 */
	set : function(name, value, domain, path, hour) {
		if (hour) {
			var expire = new Date();
			expire.setTime(expire.getTime() + 3600000 * hour);
		}
		document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + QZFL.config.domainPrefix + ";"));
		return true;
	},

	/**
	 * 获取指定名称的cookie值
	 *
	 * @param {String} name cookie名称
	 * @return {String} 获取到的cookie值
	 * @example
	 * 		QZFL.cookie.get('value1'); //获取cookie
	 */
	get : function(name) {
		//ryan
		//var s = ' ' + document.cookie + ';', pos;
		//return (pos = s.indexOf(' ' + name + '=')) > -1 ? s.slice(pos += name.length + 2, s.indexOf(';', pos)) : '';
		
		var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"), m = document.cookie.match(r);
		return (!m ? "" : m[1]);
	},

	/**
	 * 删除指定cookie,复写为过期
	 *
	 * @param {String} name cookie名称
	 * @param {String} domain 所在域
	 * @param {String} path 所在路径
	 * @example
	 * 		QZFL.cookie.del('value1'); //删除cookie
	 */
	del : function(name, domain, path) {
		document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + QZFL.config.domainPrefix + ";"));
	}
};

/**
 * @fileoverview 用于调试空间的错误信息
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 错误调试类
 *
 * @namespace QZFL.debug
 */
QZFL.debug = {
	/**
	 * 错误对象
	 */
	errorLogs : [],

	/**
	 * 启用Qzone调试模式，错误会记录到对象中
	 */
	startDebug : function() {
		/**
		 * 为窗口加入错误处理
		 *
		 * @ignore
		 * @param {Object} e
		 */
		window.onerror = function(msg,url,line) {
			var urls = (url || "").replace(/\\/g,"/").split("/");
			QZFL.console.print(msg + "<br/>" + urls[urls.length - 1] + " (line:" + line + ")",1);
			QZFL.debug.errorLogs.push(msg);
			return false;
		}
	},

	/**
	 * 停止Qzone调试模式
	 */
	stopDebug : function() {
		/**
		 * 为窗口加入错误处理
		 *
		 * @ignore
		 */
		window.onerror = null;
	},

	/**
	 * 清除所有错误信息
	 */
	clearErrorLog : function() {
		this.errorLogs = [];
	},

	showLog : function() {
		var o = ENV.get("debug_out");
		if (!!o) {
			o.innerHTML = QZFL.string.nl2br(QZFL.string.escHTML(this.errorLogs.join("\n")));
		}
	},

	getLogString : function() {
		return (this.errorLogs.join("\n"));
	}
};

/**
 * runtime处理工具静态类
 *
 * @namespace runtime处理工具静态类
 */
QZFL.runTime = (function() {
	/**
	 * 是否debug环境
	 *
	 * @return {Boolean} 是否呢
	 */
	function isDebugMode() {
		return (QZFL.config.debugLevel > 1);
	}

	/**
	 * log记录器
	 *
	 * @ignore
	 * @param {String} msg 信息记录器
	 */
	function log(msg, type) {
		var info;
		if (isDebugMode()) {
			info = msg + '\n=STACK=\n' + stack();
		} else {
			if (type == 'error') {
				info = msg;
			} else if (type == 'warn') {
				// TBD
			}
		}
		QZFL.debug.errorLogs.push(info);
	}

	/**
	 * 警告信息记录
	 *
	 * @param {String} sf 信息模式
	 * @param {All} args 填充参数
	 */
	function warn(sf, args) {
		log(QZFL.string.write.apply(QZFL.string, arguments), 'warn');
	}

	/**
	 * 错误信息记录
	 *
	 * @param {String} sf 信息模式
	 * @param {All} args 填充参数
	 */
	function error(sf, args) {
		log(QZFL.string.write.apply(QZFL.string, arguments), 'error');
	}

	/**
	 * 获取当前的运行堆栈信息
	 *
	 * @param {Error} e 可选，当时的异常对象
	 * @param {Arguments} a 可选，当时的参数表
	 * @return {String} 堆栈信息
	 */
	function stack(e, a) {
		function genTrace(ee, aa) {
			if (ee.stack) {
				return ee.stack;
			} else if (ee.message.indexOf("\nBacktrace:\n") >= 0) {
				var cnt = 0;
				return ee.message.split("\nBacktrace:\n")[1].replace(/\s*\n\s*/g, function() {
					cnt++;
					return (cnt % 2 == 0) ? "\n" : " @ ";
				});
			} else {
				var entry = (aa.callee == stack) ? aa.callee.caller : aa.callee;
				var eas = entry.arguments;
				var r = [];
				for (var i = 0, len = eas.length; i < len; i++) {
					r.push((typeof eas[i] == 'undefined') ? ("<u>") : ((eas[i] === null) ? ("<n>") : (eas[i])));
				}
				var fnp = /function\s+([^\s\(]+)\(/;
				var fname = fnp.test(entry.toString()) ? (fnp.exec(entry.toString())[1]) : ("<ANON>");
				return (fname + "(" + r.join() + ");").replace(/\n/g, "");
			}
		}

		var res;

		if ((e instanceof Error) && (typeof arguments == 'object') && (!!arguments.callee)) {
			res = genTrace(e, a);
		} else {
			try {
				({}).sds();
			} catch (err) {
				res = genTrace(err, arguments);
			}
		}

		return res.replace(/\n/g, " <= ");
	}

	return {
		/**
		 * 获取当前的运行堆栈信息
		 *
		 * @param {Error} e 可选，当时的异常对象
		 * @param {Arguments} a 可选，当时的参数表
		 * @return {String} 堆栈信息
		 */
		stack : stack,
		/**
		 * 警告信息记录
		 *
		 * @param {String} sf 信息模式
		 * @param {All} args 填充参数
		 */
		warn : warn,
		/**
		 * 错误信息记录
		 *
		 * @param {String} sf 信息模式
		 * @param {All} args 填充参数
		 */
		error : error,

		/**
		 * 是否调试模式
		 */
		isDebugMode : isDebugMode
	};

})();
/**
 * @fileoverview QZFL Javascript Loader
 * @version 1.$Rev: 1918 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 17:35:04 +0800 (周二, 11 一月 2011) $
 */

/**
 * Js Loader，js脚本异步加载
 *
 * @constructor
 * @example
 * 		var t=new QZFL.JsLoader();
 *		t.onload = function(){};
 *		t.load("/qzone/v5/tips_diamond.js", null, {"charset":"utf-8"});
 */
QZFL.JsLoader = function(isDebug) {
	//一个没用的属性 ryan
//	this.loaded = false;

	this.debug = isDebug || (QZFL.config.debugLevel > 1);

	/**
	 * 当js下载完成时
	 *
	 * @event
	 */
	this.onload = QZFL.emptyFn;

	/**
	 * 网络问题下载未完成时
	 *
	 * @event
	 */
	this.onerror = QZFL.emptyFn;

};
//这个ID还是没什么用，删除script元素时用的是元素的引用，和id没关系 ryan
//QZFL.JsLoader.scriptId = 1;

/**
 * 动态加载JS
 *
 * @param {string} src javascript文件地址
 * @param {Object} doc document
 * @param {string} [opt] 当为字符串时，指定charset
 * @param {object} [opt] 当为对象表时，指定<script>标签的各种属性
 *
 */
QZFL.JsLoader.prototype.load = function(src, doc, opt){

	var opts = {}, t = typeof(opt), o = this;

	if (t == "string") {
		opts.charset = opt;
	} else if (t == "object") {
		opts = opt;
	}
	opts.charset = opts.charset || "gb2312";

	//TO DO  一个防重加载优化
	setTimeout(function(){
		o._load.apply(o, [src, doc || document, opts]);
		o = null;
	}, 0);
};

QZFL.JsLoader.count = 0;
QZFL.JsLoader._idleInstancesIDQueue = [];

/**
 * 异步加载js脚本
 *
 * @param {Object} sId
 * @param {Object} src
 * @param {Object} doc
 * @param {Object} opts
 * @ignore
 * @private
 */
QZFL.JsLoader.prototype._load = function(/*sId, */src, doc, opts){
	var _ie = QZFL.userAgent.ie,
		o = this,
		tmp,
		k,
		idp = QZFL.JsLoader._idleInstancesIDQueue,
		_rm = QZFL.dom.removeElement,
		_ae = QZFL.event.addEvent,
		_new = false,
		_js;

	if(!(_js = document.getElementById(idp.pop())) || (QZFL.userAgent.ie && QZFL.userAgent.ie > 8)){
		_js = doc.createElement("script");
		_js.id = "_qz_jsloader_" + (++QZFL.JsLoader.count);
		_new = true;
	}

	// 处理加载成功的回调
	_ae(_js, (_ie ? "readystatechange" : "load"), function(){
		//ie的处理逻辑
		if (!_js || _ie && !(/*_js.readyState=="complete" || */_js.readyState == 'loaded')) {
			return;
		}

		_ie && idp.push(_js.id);
		_js._inUse = false;


		o.onload();
		!_ie && _rm(_js);
		_js = _ae = o = null;
	});

	if (!_ie) {
		_ae(_js, 'error', function(){

			_ie && idp.push(_js.id);
			_js._inUse = false;

			o.onerror();
			!_ie && _rm(_js);
			_js = _ae = o = null;
		})
	}

	for (k in opts) {
		if (typeof(tmp = opts[k]) == "string" && k.toLowerCase() != "src") {
			_js.setAttribute(k, tmp);
		}
	}

	_new && doc.getElementsByTagName("head")[0].appendChild(_js);

	_js._inUse = true;
	_js.src = src;

	opts = null;
};

/**
 * JsLoader的简写,避免被分析出来
 * @deprecated 不建议使用,只做兼容
 * @ignore
 */
QZFL["js"+"Loader"]=QZFL.JsLoader;

/**
 * @fileoverview QZFL Javascript Imports，支持并行加载、根据namespace加载
 * @version 1.$Rev: 1544 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 */
/**
 * 异步加载一些脚本库 by ryan
 * @param {Object} sources
 * @param {Object} succCallback
 * @param {Object} options
 */
QZFL.imports = function(sources, succCallback, options){
	var errCallback, url, len, countId, counter, scb, ecb, i, isFn = QZFL.lang.isFunction;
	options = QZFL.lang.isString(options) ? {
		charset: options
	} : (options || {});
	options.charset = options.charset || 'utf-8';
	var errCallback = isFn(options.errCallback) ? options.errCallback : QZFL.emptyFn;
	succCallback = isFn(succCallback) ? succCallback : QZFL.emptyFn;
	
	if (typeof(sources) == "string") {
		url = QZFL.imports.getUrl(sources);
		QZFL.imports.load(url, succCallback, errCallback, options);
	} else if (QZFL.lang.isArray(sources)) {
		countId = QZFL.imports.getCountId();
		len = QZFL.imports.counters[countId] = sources.length;
		counter = 0;
		scb = function(){
			counter++;
			if (counter == len) {
				if (isFn(succCallback)) succCallback();
			}
			delete QZFL.imports.counters[countId];
		};
		ecb = function(){
			if (isFn(errCallback)) errCallback();
			QZFL.imports.counters[countId];
		};
		
		for (i = 0; i < len; i++) {
			url = QZFL.imports.getUrl(sources[i]);
			QZFL.imports.load(url, scb, ecb, options);
		}
	}
};

QZFL.imports.getUrl = function(url){
	return QZFL.string.isURL(url) ?
		url
			:
		(QZFL.imports._indirectUrlRE.test(url) ?
			url
				:
			(QZFL.config.staticServer + url + '.js'));
};

QZFL.imports.urlCache = {};
QZFL.imports.counters = {};
QZFL.imports.count = 0;
QZFL.imports._indirectUrlRE = /^(?:\.{1,2})?\//;

QZFL.imports.getCountId = function(){
	return 'imports' + QZFL.imports.count++;
};

QZFL.imports.load = function(url, scb, ecb, opt){
	if (QZFL.imports.urlCache[url] === true) {
		setTimeout(function(){
			if (QZFL.lang.isFunction(scb)) scb()
		}, 0);
		return;
	}
	if (!QZFL.imports.urlCache[url]) {
		QZFL.imports.urlCache[url] = [];
		var loader = new QZFL.JsLoader();
		loader.onload = function(){
			QZFL.imports.execFnQueue(QZFL.imports.urlCache[url], 1);
			QZFL.imports.urlCache[url] = true;
		};
		loader.onerror = function(){
			QZFL.imports.execFnQueue(QZFL.imports.urlCache[url], 0);
			QZFL.imports.urlCache[url] = null;
			delete QZFL.imports.urlCache[url];
		};
		loader.load(url, null, opt);
	}
	QZFL.imports.urlCache[url].push([ecb, scb]);
};

QZFL.imports.execFnQueue = function(arFn, isSuccess){
	var f;
	while (arFn.length) {
		f = arFn.shift()[isSuccess];
		if (QZFL.lang.isFunction(f)) {
			setTimeout((function(fn){
				return fn
			})(f), 0);
		}
	}
};

/**
 * @fileoverview QZFL Form Submit Class
 * @version 1.$Rev: 1897 $
 * @author QzoneWebGroup, ($LastChangedBy: scorpionxu $)
 * @lastUpdate $Date: 2010-12-27 20:59:34 +0800 (周一, 27 十二月 2010) $
 */

/**
 * FormSender通信器类,建议写操作使用
 *
 * @param {String} actionURL 请求地址
 * @param {String} [method] 发送方式，除非指明get，否则全部为post
 * @param {Object} [data] hashTable形式的字典
 * @param {String} [charset="gb2312"] 于后台数据交互的字符集
 * @constructor
 * @namespace QZFL.FormSender
 *
 * cgi返回模板: <html><head><meta http-equiv="Content-Type" content="text/html;
 * charset=gb2312" /></head> <body><script type="text/javascript">
 * document.domain="qq.com"; frameElement.callback({JSON:"Data"}); </script></body></html>
 * @example
 * 		var fs = new QZFL.FormSender(APPLY_ENTRY_RIGHT,"post",{"hUin": getParameter("uin"),"vUin":checkLogin(),"msg":$("msg-area").value, "rd": Math.random()}, "utf-8");
 *		fs.onSuccess = function(re) {};
 *		fs.onError = function() {};
 *		fs.send();
 *
 */
QZFL.FormSender = function(actionURL, method, data, charset) {
/*	if (!QZFL.string.isURL(actionURL)) {
		rt.error("error actionURL -> {0:Q} in QZFL.FormSender construct!",
				actionURL);
		return null;
	}*/

	/**
	 * form的名称，默认为 _fpInstence_ + 计数
	 *
	 * @type string
	 */
	this.name = "_fpInstence_" + QZFL.FormSender.counter;
	QZFL.FormSender.instance[this.name] = this;
	QZFL.FormSender.counter++;

	/**
	 * 数据发送方式
	 *
	 * @type string
	 */
	this.method = method || "POST";

	/**
	 * 数据请求地址
	 *
	 * @type string
	 */
	this.uri = actionURL;

	/**
	 * 数据参数表
	 *
	 * @type object
	 */
	this.data = (typeof(data) == "object" || typeof(data) == 'string') ? data : null;
	this.proxyURL = (typeof(charset) == 'string' && charset.toUpperCase() == "UTF-8")
			? QZFL.config.FSHelperPage.replace(/_gbk/, "_utf8")
			: QZFL.config.FSHelperPage;

	this._sender = null;

	/**
	 * 服务器正确响应时的处理
	 *
	 * @event
	 */
	this.onSuccess = QZFL.emptyFn;

	/**
	 * 服务器无响应或预定的不正常响应处理
	 *
	 * @event
	 */
	this.onError = QZFL.emptyFn;
};

QZFL.FormSender.instance = {};
QZFL.FormSender.counter = 0;

QZFL.FormSender._errCodeMap = {
	999 : {
		msg : 'Connection or Server error'
	}
};



QZFL.FormSender.pluginsPool = {
	"formHandler" : []
};

QZFL.FormSender._pluginsRunner = function(pType, data){
	var _s = QZFL.FormSender,
		l = _s.pluginsPool[pType],
		t = data,
		len;

	if(l && (len = l.length)){
		for(var i = 0; i < len; ++i){
			if(typeof(l[i]) == "function"){
				t = l[i](t);
			}
		}
	}

	return t;
};



/**
 * 发送请求
 *
 * @return {Boolean} 是否成功
 */
QZFL.FormSender.prototype.send = function() {
	if (this.method == 'POST' && this.data == null) {
	//	rt.warn("QZFL.FormSender -> {0:q}, can't send data 'null'!", this.name);
		return false;
	}

	function clear(o) {
		o._sender = o._sender.callback = o._sender.errorCallback = o._sender.onreadystatechange = null;
		if (QZFL.userAgent.safari || QZFL.userAgent.opera) {
			setTimeout('QZFL.dom.removeElement(document.getElementById("_fp_frm_' + o.name + '"))', 50);
		} else {
			QZFL.dom.removeElement(document.getElementById("_fp_frm_" + o.name));
		}
	}

	if (this._sender === null || this._sender === void(0)) {
		var sender = document.createElement("iframe");
		sender.id = "_fp_frm_" + this.name;
		sender.style.cssText = "width:0;height:0;border-width:0;display:none;";
	//	sender.style.width = sender.style.height = sender.style.borderWidth = "0";
	//	sender.style.display = "none";
		document.body.appendChild(sender);

		sender.callback = QZFL.event.bind(this, function(o) {
					clearTimeout(timer);
					this.onSuccess(o);
					clear(this);
				});
		sender.errorCallback = QZFL.event.bind(this, function(o) {
					clearTimeout(timer);
					this.onError(o);
					clear(this);
				});

		if (typeof(sender.onreadystatechange) != 'undefined') {
			sender.onreadystatechange = QZFL.event.bind(this, function() {
				if (this._sender.readyState == 'complete' && this._sender.submited) {
					clear(this);
					this.onError(QZFL.FormSender._errCodeMap[999]);
				}
			});
		} else {
			var timer = setTimeout(QZFL.event.bind(this, function() {
					try {
						var _t = this._sender.contentWindow.location.href;
						if (_t.indexOf(this.uri) == 0) {
							clearTimeout(timer);
							clear(this);
							this.onError(QZFL.FormSender._errCodeMap[999]);
						}
					} catch (err) {
						clearTimeout(timer);
						clear(this);
						this.onError(QZFL.FormSender._errCodeMap[999]);
					}
				}), 200);
		}

		this._sender = sender;
	}

	this._sender.src = this.proxyURL;
	return true;
};

/**
 * QZFL.FormSender对象自毁方法，用法 ins=ins.destroy();
 *
 * @return {Object} null用来复写引用本身
 */
QZFL.FormSender.prototype.destroy = function() {
	var n = this.name;
	delete QZFL.FormSender.instance[n]._sender;
	QZFL.FormSender.instance[n]._sender = null;
	delete QZFL.FormSender.instance[n];
	QZFL.FormSender.counter--;
	return null;
};

/* by ryan
(function(){
	QZFL.FormSender = function(actionURL, method, data, charset){
		this.uri = actionURL;
		this.method = method || "POST";
		this.data = typeof(data) == "object" ? data : typeof(data) == 'string' ? QZFL.util.commonDictionarySplit(data, "&") : null;
		this.proxyURL = String(charset).toUpperCase() == "UTF-8" ? QZFL.config.FSHelperPage.replace(/_gbk/, "_utf8") : QZFL.config.FSHelperPage;
		this._sender = null;
		this.onSuccess = this.onError = QZFL.emptyFn;
	};
	QZFL.FormSender.prototype = {
		send: function(){
			if (this.method == 'POST' && this.data == null) {
				return false;
			}
			var sender = this.sender = new QZFL.SenderManager();
			sender.request(this.proxyURL, {
				callback: QZFL.event.bind(this, function(o){
					this.onSuccess(o);
					sender.free();
				}),
				errorCallback: QZFL.event.bind(this, function(o){
					this.onError(o);
					sender.free();
				}),
				onload: QZFL.event.bind(this, function(o){
					this.onError({
						msg: 'Connection or Server error'
					});
					sender.free();
				}),
				setting : this
			});
		},
		destroy: function(){
			this._sender = null;
			this.onSuccess = this.onError = QZFL.emptyFn;
		}
	};
})();
 */
/**
 * @fileoverview QZFL JSON类
 * @version 1.$Rev: 1895 $
 * @author QzoneWebGroup, ($LastChangedBy: scorpionxu $)
 * @lastUpdate $Date: 2010-12-27 20:19:39 +0800 (周一, 27 十二月 2010) $
 */

/**
 * JSONGetter通信器类,建议使用进行读操作的时候使用
 *
 * @param {String} actionURI 请求地址
 * @param {String} cname 可选，对象实体的索引名，默认是"_jsonInstence_n"，n为序号
 * @param {Object} data 可选，hashTable形式的字典
 * @param {String} charset 所拉取数据的字符集
 * @param {Boolean} [junctionMode=false] 使用插入script标签的方式拉取
 * @constructor
 * @example
 * 		var _loader = new QZFL.JSONGetter(GET_QUESTIONS_URL, void (0), {"uin": getParameter("uin"), "rd": Math.random()}, "utf-8");
 *		_loader.onSuccess = function(re){};
 *		_loader.send("_Callback");
 *		_loader.onError = function(){};
 */
QZFL.JSONGetter = function(actionURL, cname, data, charset, junctionMode) {
	if (QZFL.object.getType(cname) != "string") {
		cname = "_jsonInstence_" + (QZFL.JSONGetter.counter + 1);
	}
	
	var prot = QZFL.JSONGetter.instance[cname];
	if (prot instanceof QZFL.JSONGetter) {
		//ignore
	} else {
		QZFL.JSONGetter.instance[cname] = prot = this;
		QZFL.JSONGetter.counter++;

		prot._name = cname;
		prot._sender = null;
		prot._timer = null;
		
		/**
		 * 回调成功执行
		 * 
		 * @event
		 */
		this.onSuccess = QZFL.emptyFn;

		/**
		 * 解释失败
		 * 
		 * @event
		 */
		this.onError = QZFL.emptyFn;
		
		/**
		 * 当数据超时的时候
		 * 
		 * @event
		 */
		this.onTimeout = QZFL.emptyFn;
		
		/**
		 * 超时设置,默认5秒钟
		 */
		this.timeout = 5000;
		
		/**
		 * 抛出清理接口
		 */
		this.clear = QZFL.emptyFn;

		this._baseClear = function(){
			this._waiting = false;
			this._squeue = [];
			this._equeue = [];
			this.onSuccess = this.onError = QZFL.emptyFn;
			this.clear = null;
		};
	}

	prot._uri = actionURL;
	prot._data = (data && (QZFL.object.getType(data) == "object" || QZFL.object.getType(data) == "string")) ? data : null;
	prot._charset = (QZFL.object.getType(charset) != 'string') ? QZFL.config.defaultDataCharacterSet : charset;
	prot._jMode = !!junctionMode;

	return prot;
};

QZFL.JSONGetter.instance = {};
QZFL.JSONGetter.counter = 0;

QZFL.JSONGetter._errCodeMap = {
	999 : {
		msg : 'Connection or Server error.'
	},
	998 : {
		msg : 'Connection to Server timeout.'
	}
};

QZFL.JSONGetter.genHttpParamString = function(o){
	var r = [];

	for (var i in o) {
		r.push(i + "=" + encodeURIComponent(o[i]));
	}

	return r.join("&");
};

/**
 * 添加一个成功回调函数
 * @param {Function} f
 */
QZFL.JSONGetter.prototype.addOnSuccess = function(f){
	if(typeof(f) == "function"){
		if(this._squeue && this._squeue.push){

		}else{
			this._squeue = [];
		}
		this._squeue.push(f);
	}
};


QZFL.JSONGetter._runFnQueue = function(q, resultArgs, th){
	var f;
	if(q && q.length){
		while(q.length > 0){
			f = q.shift();
			if(typeof(f) == "function"){
				f.apply(th ? th : null, resultArgs);
			}
		}
	}
};

/**
 * 添加一个失败回调函数
 * @param {Function} f
 */
QZFL.JSONGetter.prototype.addOnError = function(f){
	if(typeof(f) == "function"){
		if(this._equeue && this._equeue.push){

		}else{
			this._equeue = [];
		}
		this._equeue.push(f);
	}
};


QZFL.JSONGetter.pluginsPool = {
	"srcStringHandler" : []
};

QZFL.JSONGetter._pluginsRunner = function(pType, data){
	var _s = QZFL.JSONGetter,
		l = _s.pluginsPool[pType],
		t = data,
		len;

	if(l && (len = l.length)){
		for(var i = 0; i < len; ++i){
			if(typeof(l[i]) == "function"){
				t = l[i](t);
			}
		}
	}

	return t;
};


QZFL.JSONGetter.prototype.send = function(callbackFnName) {
	if(this._waiting){ //已经在请求中那么就不再发请求了
		return;
	}

	var clear,
		cfn = (QZFL.object.getType(callbackFnName) != 'string') ? "callback" : callbackFnName,
		da = this._uri;
		
	if(this._data){
		da += (da.indexOf("?") < 0 ? "?" : "&") + ((typeof(this._data) == "object") ? QZFL.JSONGetter.genHttpParamString(this._data) : this._data);
	}

	da = QZFL.JSONGetter._pluginsRunner("srcStringHandler", da); //sds 用插件来跑一下url做插接功能，如反CSRF组件
	
	//传说中的jMode... 欲知详情，请咨询哓哓同学
	if(this._jMode){
		window[cfn] = this.onSuccess;
		var _sd = new QZFL.JsLoader();
		_sd.onerror = this.onError;
		_sd.load(da,void(0),this._charset);
		return;
	}

	//设置超时点
	this._timer = setTimeout(
			(function(th){
				return function(){
						//QZFL.console.print("jsonGetter timeout", 3);
						//TODO timeout can't push in success or failed... zishunchen 
						th.onTimeout();
					};
				})(this),
			this.timeout
		);
	
	if (QZFL.userAgent.ie && !(QZFL.userAgent.beta && navigator.appVersion.indexOf("Trident\/4.0") > -1)) { // IE8之前的方案.确定要平稳迁移么
		var df = document.createDocumentFragment(), sender = (QZFL.userAgent.ie == 9 ? document : df).createElement("script");//sds 加个IE9兼容
		
		sender.charset = this._charset;
		
		this._senderDoc = df;
		this._sender = sender;
		
		//回调后清理
		this.clear = clear = function(o){
			clearTimeout(o._timer);
			if (o._sender) {
				o._sender.onreadystatechange = null;
			}
			df = o._senderDoc = o._sender = null;
			o._baseClear();
		};
		
		//成功回调
		df[cfn] = (function(th){
				return (function(){
					th._waiting = false;
					th.onSuccess.apply(th, arguments);
					QZFL.JSONGetter._runFnQueue(th._squeue, arguments, th);
					clear(th);
				});
			})(this);
		
		//用来模拟ie在加载失败的情况
		sender.onreadystatechange = (function(th){
				return (function(){
					if (th._sender && th._sender.readyState == "loaded") {
						try {
							th._waiting = false;
							var _eo = QZFL.JSONGetter._errCodeMap[999];
							th.onError(_eo);
							QZFL.JSONGetter._runFnQueue(th._equeue, [_eo], th);
							clear(th);
						} 
						catch (ignore) {}
					}
				});
			})(this);
			
		this._waiting = true;
		
		df.appendChild(sender);
		this._sender.src = da;

	} else {

		//回调后清理
		this.clear = clear = function(o) {
			//QZFL.console.print(o._timer);
			clearTimeout(o._timer);
			if (o._sender) {
				o._sender.src = "about:blank";
				o._sender = o._sender.callback = o._sender.errorCallback = null;
			}
			
			if (QZFL.userAgent.safari || QZFL.userAgent.opera) {
				setTimeout('QZFL.dom.removeElement($("_JSON_frm_' + o._name + '"))', 50);
			} else {
				QZFL.dom.removeElement($("_JSON_frm_" + o._name));
			}
			o._baseClear();
		};
		
		//成功回调
		var _cb = (function(th){
				return (function() {
					th._waiting = false;
					th.onSuccess.apply(th, arguments);
					QZFL.JSONGetter._runFnQueue(th._squeue, arguments, th);
					clear(th);
				});
			})(this);
		
		//失败回调
		var _ecb = (function(th){
				return (function() {
					th._waiting = false;
					var _eo = QZFL.JSONGetter._errCodeMap[999];
					th.onError(_eo);
					QZFL.JSONGetter._runFnQueue(th._equeue, [_eo], th);
					clear(th);
				});
			})(this);
		
		//开始加载脚本数据
		var frm = document.createElement("iframe");
		frm.id = "_JSON_frm_" + this._name;
		frm.style.width = frm.style.height = frm.style.borderWidth = "0";
		this._sender = frm;

		//如果document.domain等于location.host一样则不进行host的修改，否则opera获取数据有问题
		var _dm = (document.domain == location.host)?'':'document.domain="' + document.domain + '";',
			dout = '<html><head><meta http-equiv="Content-type" content="text/html; charset=' + this._charset + '"/></head><body><script>'+_dm+';function ' + cfn + '(){frameElement.callback.apply(null, arguments);}<\/script><script charset="' + this._charset + '" src="' + da + '"><\/script><script>setTimeout(frameElement.errorCallback,50);<\/script></body></html>';

		frm.callback = _cb;
		frm.errorCallback = _ecb; 

		this._waiting = true;

		if (QZFL.userAgent.chrome || QZFL.userAgent.opera || QZFL.userAgent.firefox < 3) {
		    frm.src = "javascript:'" + encodeURIComponent(QZFL.string.escString(dout)) + "'";
		    document.body.appendChild(frm);
		} else {
		    document.body.appendChild(frm);
		    frm.contentWindow.document.open('text/html');
		    frm.contentWindow.document.write(dout);
		//	if(!QZFL.userAgent.chrome){ //chrome这里会访问不到contentWindow
			    frm.contentWindow.document.close();
		//	}
		}
	}
};

/**
 * QZFL.JSONGetter对象自毁方法，用法 ins=ins.destroy();
 * 
 * @return {Object} null用来复写引用本身
 */
QZFL.JSONGetter.prototype.destroy = function() {
	var n = this._name;
	//this.clear(this);
	delete QZFL.JSONGetter.instance[n]._sender;
	QZFL.JSONGetter.instance[n]._sender = null;
	delete QZFL.JSONGetter.instance[n];
	QZFL.JSONGetter.counter--;
	return null;
};

/***************************************** :) *****************************************************/
/**
 * 目前已经能完成数据请求功能，要注意，现在的调用方式和以前的不同
 * 未完成功能：
 * 	1. 对proxy cache里df或者frame进行延时清理，保持在一个或者两个就够了
 * 	2. 上报功能
 * 	3. addOnSuccess, addOnError
 * 	4. 对IE8 beta版进行提示，不再支持，现在是用frame实现的
 * /

QZFL.JSONGetterBeta = function(url){
	this.url = url;
	this.charset = QZFL.config.defaultDataCharacterSet;
	this.onTimeout = this.onSuccess = this.onError = QZFL.emptyFn;
};
QZFL.JSONGetterBeta.prototype.setCharset = function(charset){
	if (typeof(charset) == 'string') {
		this.charset = charset;
	}
};
QZFL.JSONGetterBeta.prototype.setQueryString = function(data){
	var type;
	if (data && ((type = typeof(data)) == 'object' || type == 'string')) {
		if (type == 'object') {
			var r = [];
			for (var k in data) {
				r.push(k + "=" + encodeURIComponent(data[k]));
			}
			data = r.join("&");
		}
		this.url += (this.url.indexOf("?") < 0 ? "?" : "&") + data;
	}
};
QZFL.JSONGetterBeta.prototype.send = function(cbFnName){
	cbFnName = cbFnName || 'callback';
	var me = this, proxy = QZFL.JSONGetterBeta.getProxy(), tmp;
	if (QZFL.JSONGetterBeta.isUseDF) {
		var scrpt = proxy.createElement("script");
		scrpt.charset = this.charset;
		proxy.appendChild(scrpt);
		
		proxy[cbFnName] = function(){
			proxy.requesting = false;
			me.onSuccess.apply(null, Array.prototype.slice.call(arguments));
			scrpt.removeNode(true);
			QZFL.console.print('request finish : ' + me.url);
			scrpt = scrpt.onreadystatechange = me = proxy = proxy[cbFnName] = null;
		};
		
		scrpt.onreadystatechange = function(){
			if (scrpt.readyState == "loaded") {
				proxy.requesting = false;
				me.onError({
					ret: 999,
					msg: 'Connection or Server error.'
				});
				scrpt.removeNode(true);
				QZFL.console.print('request Error : ' + me.url);
				scrpt = scrpt.onreadystatechange = me = proxy = proxy[cbFnName] = null;
			}
		};
		
		proxy.requesting = true;
		scrpt.src = this.url;
	} else {
		proxy.style.width = proxy.style.height = proxy.style.borderWidth = "0";
		
		proxy.callback = function(){
			proxy.requesting = false;
			me.onSuccess.apply(null, Array.prototype.slice.call(arguments));
			var win = proxy.contentWindow;
			clearTimeout(win.timer);
			var scrpts = win.document.getElementsByTagName('script');
			for (var i = 0, l = scrpts.length; i < l; i++) {
				QZFL.dom.removeElement(scrpts[i]);
			}
			QZFL.console.print('request finish : ' + me.url);
			me = proxy = proxy.callback = proxy.errorCallback = null;
		};
		proxy.errorCallback = function(){
			proxy.requesting = false;
			me.onError.apply(null, [{
				ret: 999,
				msg: 'Connection or Server error.'
			}]);
			var win = proxy.contentWindow;
			clearTimeout(win.timer);
			var scrpts = win.document.getElementsByTagName('script');
			for (var i = 0, l = scrpts.length; i < l; i++) {
				QZFL.dom.removeElement(scrpts[i]);
			}
			QZFL.console.print('request Error : ' + me.url);
			me = proxy = proxy.callback = proxy.errorCallback = null;
		};
		var dm = (document.domain == location.host) ? '' : 'document.domain="' + document.domain + '";', 
			html = '<html><head><meta http-equiv="Content-type" content="text/html; charset=' + this.charset + '"/></head><body><script>' + dm + ';function ' + cbFnName + '(){frameElement.callback.apply(null, arguments);}<\/script><script charset="' + this.charset + '" src="' + this.url + '"><\/script><script>timer=setTimeout(frameElement.errorCallback,50);<\/script></body></html>';
		
		proxy.requesting = true;
		if (QZFL.userAgent.opera || QZFL.userAgent.firefox < 3) {
			proxy.src = "javascript:'" + html + "'";
			document.body.appendChild(proxy);
		} else {
			document.body.appendChild(proxy);
			(tmp = proxy.contentWindow.document).open('text/html');
			tmp.write(html);
			tmp.close();
		}
	}
};
QZFL.JSONGetterBeta.getProxy = function(){
	for (var p, i = 0, len = QZFL.JSONGetterBeta.proxy.length; i < len; i++) {
		if ((p = QZFL.JSONGetterBeta.proxy[i]) && !p.requesting) {
			QZFL.console.print('找到第' + i + '个代理可用');
			return p;
		}
	}
	QZFL.console.print('没有可用的代理，创建一个新的');
	QZFL.JSONGetterBeta.proxy.push(p = QZFL.JSONGetterBeta.isUseDF ? document.createDocumentFragment() : document.createElement("iframe"));
	return p;
};
QZFL.JSONGetterBeta.proxy = [];
QZFL.JSONGetterBeta.isUseDF = QZFL.userAgent.ie && !QZFL.userAgent.beta;


//以下是几个测试用例
var jg = new QZFL.JSONGetterBeta('http://u.qzone.qq.com/cgi-bin/qzone_static_widget?fs=1&uin=20050606&timestamp=0');
jg.onSuccess = function(o){QZFL.console.print(o['_2_0']._uname_);};
jg.send('staticData_Callback');

var jg2 = new QZFL.JSONGetterBeta('http://g.qzone.qq.com/fcg-bin/cgi_emotion_list.fcg?uin=20050606&loginUin=0&s=820043');
jg2.onSuccess = function(o){QZFL.console.print(o.visitcount);};
jg2.send('visitCountCallBack');

var jg1 = new QZFL.JSONGetterBeta('http://n.qzone.qq.com/cgi-bin/pvuv/set_pvuv?uin=20050606&r=0.39620088664296915');
jg1.onSuccess = function(o){QZFL.console.print(o.todayPV);};
jg1.send('QZonePGVDataCallBack1');

var jg3 = new QZFL.JSONGetterBeta('http://u.qzone.qq.com/cgi-bin/qzone_static_widget?fs=1&uin=20050606&timestamp=0&r=' + Math.random());
jg3.onSuccess = function(o){QZFL.console.print(o['_2_0']._uname_);};
jg3.send('staticData_Callback');

var jg4 = new QZFL.JSONGetterBeta('http://n.qzone.qq.com/cgi-bin/pvuv/set_pvuv?uin=20050606&r=0.39620088664296915&r=' + Math.random());
jg4.onSuccess = function(o){QZFL.console.print(o.todayPV);};
jg4.send('QZonePGVDataCallBack1');

var jg5 = new QZFL.JSONGetterBeta('http://g.qzone.qq.com/fcg-bin/cgi_emotion_list.fcg?uin=20050606&loginUin=0&s=820043&r=' + Math.random());
jg5.onSuccess = function(o){QZFL.console.print(o.visitcount);};
jg5.send('visitCountCallBack');

 * 
 * 
 */
/*****************************************************************************************/

/**
 * @fileoverview 发一个简短get请求的组件
 *
 */


/**
 *
 *
 * @ignore
 *
 *
 */
if(typeof(window.QZFL) == "undefined"){
	window.QZFL = {};
}


/**
 * 简单get请求发送器
 *
 * @param {string} url 请求url
 * @param {number} [t = 500] 请求时延，单位ms
 *
 */
QZFL.pingSender = function(url, t){
	var _s = QZFL.pingSender,
		iid,
		img;

	if(!url){
		return;
	}
	
	iid = "sndImg_" + _s._sndCount++;
	img = _s._sndPool[iid] = new Image();
	img.iid = iid;
	img.onload = img.onerror = (function(t){
		return function(evt){
			QZFL.pingSender._clearFn(evt, t);
		};
	})(img);
	setTimeout(function(){
		img.src = url;
	}, t || 500);
};

/**
 *
 *
 * @private
 *
 *
 */
QZFL.pingSender._sndPool = {};

/**
 *
 *
 * @private
 *
 *
 */
QZFL.pingSender._sndCount = 0;

/**
 *
 *
 * @private
 *
 *
 */
QZFL.pingSender._clearFn = function(evt, ref){
	evt = window.event || evt;
	var _s = QZFL.pingSender;
	if(ref){
		_s._sndPool[ref.iid] = ref.onload = ref.onerror = null;
		delete _s._sndPool[ref.iid];
		_s._sndCount--;
		ref = null;
	}
};
/*ryan born this
(function(){
	QZFL.pingSender = function(url, t){
		new PingSender(url, t).send();
	};
	function PingSender(url, delay){
		this.url = url + '';
		this.delay = parseInt(delay, 10) || 500;
		var me = this;
		this.sender = new Image();
		this.sender.onload = this.sender.onerror = function(){
			me.die();
		};
	}
	PingSender.prototype = {
		send: function(){
			var me = this;
			setTimeout(function(){
				me.sender.src = me.url;
			}, this.delay);
		},
		die: function(){
			this.sender = this.sender.onload = this.sender.onerror = null;
		}
	};
})();
*/
/**
 * @fileoverview QZFL 多媒体类
 * @version 1.$Rev: 1924 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:52:16 +0800 (周二, 11 一月 2011) $
 */
/**
 * 增强对flash, wmp等多媒体控件的处理
 *
 * @namespace QZFL.media
 */
QZFL.media = {
	_tempImageList : [],

	_flashVersion : null,
	/**
	 * 按比例调节图的大小
	 * @example
	 * 			<img src="b.gif" onload="QZFL.media.adjustImageSize(200,150,'http://www.true.com/true.jpg')" />
	 * @param {Number} w 期望宽度上限
	 * @param {Number} h 期望高度上限
	 * @param {String} trueSrc 真正地图片源
	 * @param {Function} callback 图片大小调整完成后的回调
	 */
	adjustImageSize : function(w, h, trueSrc, callback,errCallback) {
		var ele = QZFL.event.getTarget();
		ele.onload = null;

		var offset, _c = QZFL.media._tempImageList;
		_c[offset = _c.length] = new Image();

		_c[offset].onload = (function(mainImg, tempImg, ew, eh) {
			return function() {
				tempImg.onload = null; // IE6 gif animation 302 bug!

				var ow = tempImg.width,
					oh = tempImg.height;
				if (ow / oh > ew / eh) {
					if (ow > ew) {
						mainImg.width = ew;
					}
				} else {
					if (oh > eh) {
						mainImg.height = eh;
					}
				}
				mainImg.src = tempImg.src;
				_c[offset] = null;
				delete _c[offset];
				if (typeof(callback) == 'function') {
					callback(mainImg, w, h, tempImg, ow, oh);
				}
			};
		})(ele, _c[offset], w, h);

		_c[offset].onerror = function(){
			_c[offset] = _c[offset].onerror = null;
			delete _c[offset];
			if (typeof(errCallback) == 'function') {
				errCallback();
			}
		};

		_c[offset].src = trueSrc;
	},

	/**
	 * 生成flash的描述HTML
	 *
	 * @param {Object} flashArguments 以hashTable描述的flash参数集合,flashUrl请用"src"
	 * @param {QZFL.media.SWFVersion} requiredVersion
	 *            所需要的flashPlayer的版本，QZFL.media.SWFVersion的实例
	 * @param {String} flashPlayerCID flash在IE中使用的classID,可选
	 * @return {String} 生成的HTML代码
	 * @example
	 * 			var swf_html = QZFL.media.getFlashHtml({
	 *									"src" :"your flash url",
	 *									"width" : "100%",
	 *									"height" : "100%",
	 *									"allowScriptAccess" : "always",
	 *									"id" : "avatar",
	 *									"name" : "avatar",
	 *									"wmode" : "opaque",
	 *                                  "noSrc" : false
	 *						});
	 */
	getFlashHtml : function(flashArguments, requiredVersion, flashPlayerCID) {
		var _attrs = [],
			_params = [];

		for (var k in flashArguments) {
			switch (k) {
				case "noSrc" :
				case "movie" :
					continue; //sds 这里是不处理的特性
					break;
				case "id" :
				case "name" :
				case "width" :
				case "height" :
				case "style" :
					if(typeof(flashArguments[k]) != 'undefined'){
						_attrs.push(' ', k, '="', flashArguments[k], '"');
					}
					break;
				case "src" :
					if (QZFL.userAgent.ie) {
						_params.push('<param name="movie" value="', (flashArguments.noSrc ? "" : flashArguments[k]), '"/>');
					//	_params.push('<param name="movie" value="', flashArguments[k], '"/>');
					}else{
						_attrs.push(' data="', (flashArguments.noSrc ? "" : flashArguments[k]), '"');
					}
					break;
				default :
					_params.push('<param name="', k, '" value="', flashArguments[k], '" />');
			}
		}
		
		
		if (QZFL.userAgent.ie) {
			_attrs.push(' classid="clsid:', flashPlayerCID || 'D27CDB6E-AE6D-11cf-96B8-444553540000', '"');
		}else{
			_attrs.push(' type="application/x-shockwave-flash"');
		}
	 	
		if (requiredVersion && (requiredVersion instanceof QZFL.media.SWFVersion)) {
			var _ver = QZFL.media.getFlashVersion().major,
				_needVer = requiredVersion.major;

			//当没有安装并且应用没有刻意指定的时候，走Codebase路线
			_attrs.push(' codeBase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=', requiredVersion, '"');
		}

		return "<object" + _attrs.join("") + ">" + _params.join("") + "</object>";
	},
	

	/**
	 * 对调用方给出的一个节点插入需要的flash object
	 * @param {HTMLElement} containerElement 容器节点，必须
	 * @param {Object} flashArguments @see QZFL.media.getFlashHtml()
	 * @return {boolean} 是否成功
	 *
	 *
	 */
	insertFlash : function(containerElement, flashArguments){
		if(!containerElement || typeof(containerElement.innerHTML) == "undefined"){
			return false;
		}
		flashArguments = flashArguments || {};
		flashArguments.src = flashArguments.src || "";
		flashArguments.width = flashArguments.width || "100%";
		flashArguments.height = flashArguments.height || "100%";

		flashArguments.noSrc = true;

		containerElement.innerHTML = QZFL.media.getFlashHtml(flashArguments);
		var f = containerElement.firstChild;

		if(QZFL.userAgent.ie){
			setTimeout(function(){
					f.LoadMovie(0, flashArguments.src);
				}, 0);
		}else{
			f.setAttribute("data", flashArguments.src);
		}
		return true;
	},

	/*
	 * 生成Windows Media Player的HTML描述
	 * @example
	 * 			var wmphtml=QZFL.media.getWMMHtml({id:'qzfl_media',name:'qzfl_wmp',width:'300px',height:'200px',src:'#',style:''});
	 */
	getWMMHtml : function(wmpArguments, cid) {
		var params = [],
			objArgm = [];

		for (var k in wmpArguments) {
			switch (k) {
				case "id" :
				case "width" :
				case "height" :
				case "style" :
				case "src" :
					objArgm.push(' ', k, '="', wmpArguments[k], '"');
					break;
				default :
					objArgm.push(' ', k, '="', wmpArguments[k], '"');
					params.push('<param name="', k, '" value="', wmpArguments[k], '" />');
			}
		}
		if (wmpArguments["src"]) {
			params.push('<param name="URL" value="', wmpArguments["src"], '" />');
		}

		if (QZFL.userAgent.ie) {
			return '<object classid="' + (cid || "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6") + '" ' + objArgm.join("") + '>' + params.join("") + '</object>';
		} else {
			return '<embed ' + objArgm.join("") + '></embed>';
		}
	}
};

/**
 * flash版本号显示器
 *
 * @param {Number} arguments...
 *            可变参数，一系列数字，前4个是flash的四段版本号，也可以单数组传入，也可以只使用一个整数表示主版本号
 * @constructor
 */
QZFL.media.SWFVersion = function() {
	var a;
	if (arguments.length > 1) {
		a = arg2arr(arguments);
	} else if (arguments.length == 1) {
		if (typeof(arguments[0]) == "object") {
			a = arguments[0];
		} else if (typeof arguments[0] == 'number') {
			a = [arguments[0]];
		} else {
			a = [];
		}
	} else {
		a = [];
	}

	this.major = parseInt(a[0], 10) || 0;
	this.minor = parseInt(a[1], 10) || 0;
	this.rev = parseInt(a[2], 10) || 0;
	this.add = parseInt(a[3], 10) || 0;
};

/**
 * flash版本显示器序列化方法
 *
 * @param {Object} spliter 版本号显示，数字分隔符
 * @return {String} 一个描述flashPlayer版本号的字符串
 */
QZFL.media.SWFVersion.prototype.toString = function(spliter) {
	return ([this.major, this.minor, this.rev, this.add])
			.join((typeof spliter == 'undefined') ? "," : spliter);
};
/**
 * flash版本显示器序列化方法
 *
 * @return {String} 一个描述flashPlayer版本号的数字
 */
QZFL.media.SWFVersion.prototype.toNumber = function() {
	var se = 0.001;
	return this.major + this.minor * se + this.rev * se * se + this.add * se * se * se;
};

/**
 * 获取当前浏览器上安装的flashPlayer的版本，未安装返回的实例toNumber()方法等于0
 *
 * @return {Object} 返回QZFL.media.SWFVersion的实例 {major,minor,rev,add}
 * @example
 * 			QZFL.media.getFlashVersion();
 */
QZFL.media.getFlashVersion = function() {
	if (!QZFL.media._flashVersion) {
		var resv = 0;
		if (navigator.plugins && navigator.mimeTypes.length) {
			var x = navigator.plugins['Shockwave Flash'];
			if (x && x.description) {
				resv = x.description.replace(/(?:[a-z]|[A-Z]|\s)+/, "")
						.replace(/(?:\s+r|\s+b[0-9]+)/, ".").split(".");
			}
		} else {
			try {
				for (var i = (resv = 6), axo = new Object(); axo != null; ++i) {
					axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
					resv = i;
				}
			} catch (e) {
				if (resv == 6) {
					resv = 0;
				}//6都没有就当没安装吧
				resv = Math.max(resv - 1, 0);
			}
			try {
				resv = new QZFL.media.SWFVersion(axo.GetVariable("$version")
						.split(" ")[1].split(","));
			} catch (ignore) {}
		}
		if (!(resv instanceof QZFL.media.SWFVersion)) {
			resv = new QZFL.media.SWFVersion(resv);
		}

		if (resv.major < 3) {
			resv.major = 0;
		}
		QZFL.media._flashVersion = resv;
	}
	return QZFL.media._flashVersion;
};

//sds 似乎也可以干掉了
//edit by youyeelu
/*
QZFL.media._changeFlashSrc = function(src, installVer, needVer) {
	//当用户安装了flash player，但是没有达到应用要求的版本的时候，走快速安装路线
	if( installVer >= 6 && needVer > installVer){
		src = "http://qzs.qq.com/qzone/flashinstall.swf";
	}
	return src;
};
*/
/**
 * @fileoverview QZFL ShareObject 存储类
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * Qzone 用于基本存储客户端基本信息
 *
 * @namespace QZFL.shareObject
 */
QZFL.shareObject = {};

/**
 * 初始化shareObject
 *
 * @param {String} [path] 要拉起的shareObject swf地址
 * @example
 * 			QZFL.shareObject.create();
 */
QZFL.shareObject.create = function(path) {
	if (typeof(path) == 'undefined') {
		path = QZFL.config.defaultShareObject;
	}
	var t = new QZFL.shareObject.DataBase(path);
};

QZFL.shareObject.instance = {};
QZFL.shareObject.refCount = 0;

/**
 * 获取一个可用的SO
 *
 * @return {Object} ShareObject实例
 * @example
 * 			var so=QZFL.shareObject.getValidSo();//获取一个可用的ShareObject
 */
QZFL.shareObject.getValidSO = function() {
	var cnt = QZFL.shareObject.refCount + 1;
	for (var i = 1; i < cnt; ++i) {
		if (QZFL.shareObject.instance["so_" + i] && QZFL.shareObject.instance["so_" + i]._ready) {
			return QZFL.shareObject.instance["so_" + i];
		}
	}
	return null;
};

/**
 * 获取数据的静态方法
 * @param {String} s 键名
 * @return {All} 存储的值
 * @example
 * 			QZFL.shareObject.get(key);//读取
 */
QZFL.shareObject.get = function(s){
	var o = QZFL.shareObject.getValidSO();
	if(o) return o.get(s);
	else return void(0);
};



/**
 * 存入数据的静态方法
 * @param {String} k 键名
 * @param {All} v 值
 * @return {Boolean} 是否成功
 * @example
 * 			QZFL.shareObject.set(key,value);//存入
 */
QZFL.shareObject.set =	function(k, v){
	var o = QZFL.shareObject.getValidSO();
	if(o) return o.set(k, v);
	else return false;
};


/**
 * flash客户端存储器构造器，只会在页面创建一个实例
 *
 * @constructor
 */
QZFL.shareObject.DataBase = function(soUrl) {
	/* 限制数目 */
	if (QZFL.shareObject.refCount > 0) {
		return QZFL.shareObject.instance["so_1"];
	}

	//TODO 暂时去掉对SO的判断
	//var fv = QZFL.media.getFlashVersion();
	//if (fv.toNumber() < 8) {
	//	rt.error("flash player version is too low to build a shareObject!");
	//	return null;
	//}

	this._ready = false;

	QZFL.shareObject.refCount++;
	var c = document.createElement("div");
	//c.style.marginTop = "-1px"; //removed by scorpionxu 这个有严重问题
	document.body.appendChild(c);
	c.innerHTML = QZFL.media.getFlashHtml({
		src : soUrl,
		id : "__so" + QZFL.shareObject.refCount,
		width : 1, //给一点可见性
		height : 0,
		allowscriptaccess : "always"
	});
	this.ele = $("__so" + QZFL.shareObject.refCount);

	QZFL.shareObject.instance["so_" + QZFL.shareObject.refCount] = this;
};

/**
 * 以指定键名，存储一个字符串描述的数据
 *
 * @param {String} key 存储的键名
 * @param {String} value 存储的值，必须是字符串类型
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.set = function(key, value) {
	if (this._ready) {
		this.ele.set("seed", Math.random());
		this.ele.set(key, value);
		this.ele.flush();
		return true;
	} else {
		return false;
	}
};
/**
 * 删除一个已经存储的键
 *
 * @param {String} key 存储的键名
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.del = function(key) {
	if (this._ready) {
		this.ele.set("seed", Math.random());
		this.ele.set(key, void(0));
		this.ele.flush();
		return true;
	} else {
		return false;
	}
};
/**
 * 获取指定键名的数据
 *
 * @param {String} key 指定的键名
 * @return {String/Object} 得到的值，null表示不存在
 */
QZFL.shareObject.DataBase.prototype.get = function(key) {
	return (this._ready) ? (this.ele.get(key)) : null;
};
/**
 * 清除所有数据，慎用！
 *
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.clear = function() {
	if (this._ready) {
		this.ele.clear();
		return true;
	} else {
		return false;
	}
};
/**
 * 获取数据长度
 *
 * @return {Number} -1表示失败
 */
QZFL.shareObject.DataBase.prototype.getDataSize = function() {
	if (this._ready) {
		return this.ele.getSize();
	} else {
		return -1;
	}
};
/**
 * 发起连接
 *
 * @param {String} url
 * @param {String} succFnName
 * @param {String} errFnName
 * @param {Object} data
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.load = function(url, succFnName,
		errFnName, data) {
	if (this._ready) {
		this.ele.load(url, succFnName, errFnName, data);
		return true;
	} else {
		return false;
	}
};
/**
 * @ignore
 */
QZFL.shareObject.DataBase.prototype.setReady = function() {
	this._ready = true;
};

/**
 * Flash初始化方法
 *
 * @return {String} flash内部使用
 */
function getShareObjectPrefix() {
	QZFL.shareObject.instance["so_" + QZFL.shareObject.refCount].setReady();
	// return location.host.match(/\w+/)[0];
	return location.host.replace(".qzone.qq.com","");
}

/**
 * 复制到剪贴板
 *
 * @param {String} value 要复制的值
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.setClipboard = function(value) {
	if (this._ready && isString(value)) {
		this.ele.setClipboard(value);
		return true;
	} else {
		return false;
	}
};
/**
 * @fileoverview QZFL 拖拽类
 * @version 1.$Rev: 1723 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2010-04-08 19:26:57 +0800 (周四, 08 四月 2010) $
 */

/**
 * 拖拽管理器，负责对dom对象进行拖拽的绑定。
 *
 * @namespace QZFL.dragdrop
 */
QZFL.dragdrop = {

	path : "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/widget/dragdrop.js",

	/**
	 * 拖拽池，用来记录已经注册拖拽的对象
	 */
	dragdropPool : {},

	/**
	 * 拖拽对象临时ID.
	 *
	 * @ignore
	 */
	count : 0,


	/**
	 * 注册拖拽对象, 注册后，返回拖放描述对象
	 *
	 * @param {HTMLElement} handle 推拽的对象的handler
	 * @param {HTMLElement} target 需要推拽的对象
	 * @param {Object} opts 参数 {range,rangeElement,x,y,ghost,ghostStyle} <br/><br/>
	 *            range [top,left,bottom,right]
	 *            指定一个封闭的拖放区域,参数可以不比全设置留空或设置为非数字如null[top,left,bottom,right]
	 *            是number<br/> rangeElement [element,[top,left,bottom,right],isStatic]
	 *            制定拖放区域的对象，限制物体只能在这个区域内拖放。 [top,left,bottom,right]
	 *            是boolean,rangeElement和target必须是同一个坐标系，而且target必须在rangeElement内
	 *            。isStatic {boolean} 是指 rangeElement 没有使用独立的坐标系(默认值是flase)。
	 *            <br/>
	 *            x,y 刻度偏移量（暂时未支持）<br/> ghost 如果拖放的对象是浮动的，是否拖放出现影子 ghostSize
	 *            鬼影的尺寸，当设置了尺寸，初始位置就以鼠标位置定位了，注意。 ignoreTagName 忽略的tagName.
	 *            一般用来忽略一些 控件等 例如 object embed autoScroll 是否自动滚屏 cursor 鼠标 <br/>
	 *            ghostStyle 设置ghost层次的样式
	 *            <br/><br/>
	 * @returns {object} 返回拖放描述对象
	 * @example
	 * 			QZFL.dragdrop.registerDragdropHandler(this.titleElement,this.mainElement,{range:[0,0,'',''],x:50,y:160});
	 */
	registerDragdropHandler : function(handler, target, opts) {
		var _e = QZFL.event,
			_s = QZFL.dragdrop,
			_hDom = QZFL.dom.get(handler),
			_tDom = QZFL.dom.get(target),
			targetObject;

		opts = opts || {
			range : [null, null, null, null],
			ghost : 0
		};

		if (!(_hDom = _hDom || _tDom)) { //啥都没给还玩神马？
			return null;
		}

		// 拖放目标对象
		targetObject = _tDom || _hDom;

		if (!_hDom.id) {
			_hDom.id = "dragdrop_" + (++_s.count);
		}

		_hDom.style.cursor = opts.cursor || "move";

		_s.dragdropPool[_hDom.id] = {};

		_e.on(_hDom, "mousedown", _s.startDrag, [_hDom.id, targetObject, opts]);

		return _s.dragdropPool[_hDom.id];
	},

	/**
	 * 取消注册拖拽对象
	 *
	 * @param {HTMLElement} handle 推拽的对象的handler
	 */
	unRegisterDragdropHandler : function(handler) {
		var _s = QZFL.dragdrop;
		QZFL.imports(_s.path, function(){
				_s.unRegisterDragdropHandler.call(_s, handler);
			});
	},

	startDrag : function(){
		QZFL.dragdrop.doStartDrag.apply(QZFL.dragdrop, arguments);
	},
	
	doStartDrag : function(evt, handlerId, target, opts){
		var _s = QZFL.dragdrop,
			_e = {};
		QZFL.object.extend(_e, evt);
		QZFL.imports(_s.path, function(){
				_s.startDrag.call(_s, _e, handlerId, target, opts);
			});
	}
};


//很重要，保存被覆盖前的老引用
QZFL.dragdrop._oldSD = QZFL.dragdrop.startDrag;


// Extend Dom
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{
	dragdrop : function(target, opts){
		var _arr = [];
		this.each(function(){
			_arr.push(QZFL.dragdrop.registerDragdropHandler(this, target, opts));
		});
		return _arr;
	},
	unDragdrop : function(target, opts){
		this.each(function(){
			_arr.push(QZFL.dragdrop.unRegisterDragdropHandler(this));
		});
	}
});
/*
 * Copyright (c) 2008, Tencent Inc. All rights reserved.
 */
/**
 * @fileoverview 信息提示类
 * @author QzoneWebGroup
 * @version 1.0

源结构:
<div class="gb_tip_layer_wrap">
	<span class="gb_tip_layer">
		<span class="gtl_ico_succ"></span>
			评论成功!好多字好多字好多字好多字好多字好多字好多字好多字好多字好多字好多字好多字
		<span class="gtl_end"></span>
	</span>
</div>
 */
/**
 * dom 对象处理
 *
 * @namespace QZFL.widget.msgbox
 */
QZFL.widget.msgbox = {
	/**
	 * css文件路径
	 */
	cssPath : "http://qzonestyle.gtimg.cn/ac/qzfl/release/css/msgbox.css",
	/**
	 * css文件路径
	 */
	path : "http://qzonestyle.gtimg.cn/ac/qzfl/release/widget/msgbox.js",
	/**
	 * 加载样式
	 */
	_loadCss : function(){
		var th = QZFL.widget.msgbox;
		if(!th._cssLoad){
			QZFL.css.insertCSSLink(th.cssPath);
			th._cssLoad = true;
		}
	},
	/**
	 * 显示信息
	 *
	 * @param {string} msgHtml 信息文字
	 * @param {number} type 信息提示类型 0~3 提示, 4:成功 5:失败 6:加载
	 * @param {number} timeout 提示信息超时关闭，0为手动关闭
	 * @param {number} [topPosition] 提示框的高度位置
	 */
	show : function(msgHtml, type, timeout, topPosition){
		QZFL.widget.msgbox._loadCss();

		QZFL.imports(QZFL.widget.msgbox.path, function(){
			QZFL.widget.msgbox.show(
				msgHtml,
				type,
				timeout,
				topPosition
			);
		});
	},

	/**
	 * 先做个壳
	 *
	 *
	 */
	hide : function(timeout){
		QZFL.widget.msgbox._loadCss();

		QZFL.imports(QZFL.widget.msgbox.path, function(){
			QZFL.widget.msgbox.hide(timeout);
		});
	}
};

/**
 * @fileOverview QZFL.dialog 通用对话框功能的外壳部分
 * @version 1.0
 * @author scorpionxu
 */


/**
 * QZFL的弹出对话框系统类,可能需要QZFL.dragdrop类支持
 *
 * @namespace 
 * @memberOf QZFL
 */
QZFL.dialog = {
	cssPath : "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/resource/css/dialog.css",
	currentCssPath : '',
	path : "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/widget/dialog.js?max_age=864001",
	count : 0,
	instances : {},

	/**
	 * 按钮类型的枚举常数包
	 * @type object
	 *
	 */
	BUTTON_TYPE : {
		Disabled : -1,
		Normal : 0,
		Cancel : 1,
		Confirm : 2,
		Negative : 3
	},

	/**
 	* 创建一个新的对话框
	* 老接口模型：create : function(title, content, width, height, useTween, noBorder) 不建议使用，但目前仍然兼容
	*     
 	* @param {string} [title=''] 标题
 	* @param {string} [content=''] 内容
 	* @param {object} [opts={}] 高级功能选项
	* @param {number} [opts.width=300] 宽度
	* @param {number} [opts.height=200] 高度，这里不是整个popup dialog的高度，而是内容区的高度
	* @param {number} [opts.top] 上角位置，默认是动态计算的位置
	* @param {number} [opts.left] 左角位置，默认是动态计算的位置
	* @param {boolean} [opts.useTween=false]
	* @param {boolean} [opts.noBorder=false]
	* @param {boolean} [opts.showMask=false] 是否使用蒙板
	* @param {string} [opts.title='']
	* @param {string} [opts.content='']
	* @param {string} [opts.cssPath='http://qzonestyle.gtimg.cn/ac/qzfl/release/resource/css/dialog.css']
	* @param {string} [opts.statusContent=''] 默认不展现，若有文本，则在左下角展示，所产生的行高不计算在内容高度中
	* @param {object[]} [opts.buttonConfig=[]] 按钮定义，默认无按钮
	* <pre>一个按钮配置:
{
	text: '按钮文字',
	tips: '按钮鼠标悬停后的小黄标提示文字',
	type: QZFL.dialog.BUTTON_TYPE.Normal, //按钮类型:
		//有Normal, Confirm, Negative, Cancel, Disabled 五种选择
		//其中Cancel, Confirm, Negative 三种关联到对象整体时间处理器onConfirm, onNegative, onCancel
		//且点击后dialog将关闭
	clickFn: function(){
			//to do 这里是直接按钮点击后的处理，可以和onConfirm等同时存在，先于执行
		}
}</pre>
	* 
	* 
 	*/
	create : function(title, content, opts /*width,height,tween,noborder,top,left*/) {
		var t,
			args,
			dialog;
		
		if(t = (typeof(opts) != "number" || isNaN(parseInt(opts, 10)))){ //判断兼容新老逻辑
			opts = opts || {};
			args = [0, 0, opts.width, opts.height, opts.useTween, opts.noBorder];
		}else{
			opts = {
				'width' : opts
			};
			args = arguments;
		}

		t && (opts.width = args[2] || 300);
		opts.height = args[3] || 200;
		opts.useTween = !!args[4];
		opts.noBorder = !!args[5];
		opts.title = title || opts.title || '';
		opts.content = content || opts.content || '';

		dialog = new QZFL.dialog.shell(opts);
		dialog.init(opts);
		return dialog;
	},


	/**
 	* 创建无边框的dialog视图 contributed by scorr
 	*
 	* @param {string} [content=''] 内容
 	* @param {number} [width=300] 宽度
 	* @param {number} [height=200] 高度
	* @deprecated 多此一举，以后不要用了
 	*/
	createBorderNone : function(content, width, height) {
		var opts = opts || {};
		opts.noBorder = true;
		opts.width = width || 300;
		opts.height = height || 200;
		return QZFL.dialog.create(null, content || '', opts);
	}
};

/**
 * 用于异步构建的虚方法对接器
 * @private
 * @param {string} pFnName 映射的方法名
 * @param {object} objInstance 触发方法的对象
 * @param {object[]} args 参数列表
 *
 */
QZFL.dialog._shellCall = function(pFnName, objInstance, args){
	var _s = QZFL.dialog;
	QZFL.imports(_s.path, (function(th){
				return function(){
						_s.base.prototype[pFnName].apply(th, args || []);
					};
			})(objInstance));
};

/**
 * 外壳对象构造器，只是临时使用，本体加载后将被覆盖
 * @memberOf QZFL.dialog
 * @constructor
 * @param {object} opts 格式同 QZFL.dialog.create 中的 opts
 */
QZFL.dialog.shell = function(opts){
	var _s = QZFL.dialog,
		cssp = opts.cssPath || _s.cssPath;
	if(cssp != _s.currentCssPath){ //把主样式加载回来
		QZFL.css.insertCSSLink(cssp);
		_s.currentCssPath = cssp;
	}

	this.opts = opts;
	this.id = ('qzDialog' + (++_s.count));
	_s.instances[this.id] = this;

	//兼容老版本 begin
	this.uniqueID = _s.count;
	//兼容老版本 end

	if(!_s.base){ //把主lib加载回来
		QZFL.imports(_s.path);
	}
};


/**
 * 获取zIndex
 * @deprecated 尽量不要用这个吧，用来干啥呢？没意义嘛
 * @returns {number} 返回z-index值
 */
QZFL.dialog.shell.prototype.getZIndex = function() {
	return this.zIndex || (6000 + QZFL.dialog.count); //这里必须要同步返回，不能用_shellCall，异步性无法被包容
};


(function(fl){ //把一个个shell方法都映射出来
	for(var i = 0, len = fl.length; i < len; ++i){
		QZFL.dialog.shell.prototype[fl[i]] = (function(pName){
				return function(){
						QZFL.dialog._shellCall(pName, this, arguments);
					};
			})(fl[i]);
	}
})(['hide', 'unload', 'init', 'fillTitle', 'fillContent', 'setSize', 'show', 'hide', 'focus', 'blur', 'setReturnValue']);


/**
 * @fileoverview confirm信息提示类
 * @version 1.$Rev: 1855 $
 * @author QzoneWebGroup, ($LastChangedBy: scorpionxu $)
 * @lastUpdate $Date: 2010-10-27 15:51:14 +0800 (周三, 27 十月 2010) $
 * @requires QZFL.dialog
 * @requires QZFL.maskLayout
 */

/**
 * confirm信息提示类,建议使用新的接口，如果在QZONE里建议只用QZONE.FP.confirm();具体接口请参见FrontPage接口文档。
 *
 * @param {string} title 对话框标题
 * @param {string} content 内容
 * @param {number} config 参数配置,说明{"type":"type 类型，类型占3位 111 001(1) ＝ 确定 010 (2)＝ 否定 100(4) ＝ 取消，默认为001","icontype":"confirm支持的提示类型,succ代表成功,warn代表提示,error代表错误,help代表问号","hastitle":false}
 * @constructor QZFL.widget.Confirm
 * @example
 * 			var _c = new QZFL.widget.Confirm(title, content, {"type":3,"icontype":"succ","hastitle":false});
 * 			_c.show();
 */
//@param {string} title 对话框标题
//@param {string} content 内容
//@param {number} type 类型，类型占3位 111 001(1) ＝ 确定 010 (2)＝ 否定 100(4) ＝ 取消，默认为001
//QZFL.widget.Confirm = function(title, content, type, btnText) {



QZFL.widget.Confirm = function(title, content, opts){
	//最先开始的是新老接口兼容
	if((typeof opts != 'undefined') && (typeof opts != 'object')){
		opts = {
			type : opts,
			tips : arguments[3]
		};
	}

	opts = opts || {};

	var n,
		_s = QZFL.widget.Confirm,
		cssp = opts.cssPath || _s.cssPath;


	opts.title = opts.title || title || '';
	opts.content = opts.content || content || '';

	this.opts = opts;

	//老代码兼容 .... 尼玛你们对内部成员依赖还要... begin
	this.tips = opts.tips = (opts.tips || []);
	//end

	n = (++_s.count);
	this.id = 'qzConfirm' + n;
	_s.instances[n] = this;

	if(cssp != _s.currentCssPath){ //把主样式加载回来
		QZFL.css.insertCSSLink(cssp);
		_s.currentCssPath = cssp;
	}

	if(!_s.iconMap){
		QZFL.imports(_s.path);
	}
};

QZFL.widget.Confirm.TYPE = {
	OK : 1,
	NO : 2,
	OK_NO : 3,
	CANCEL : 4,
	OK_CANCEL : 5,
	NO_CANCEL : 6,
	OK_NO_CANCEL : 7
};

QZFL.widget.Confirm.count = 0;
QZFL.widget.Confirm.instances = {};

QZFL.widget.Confirm.cssPath = "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/resource/css/confirm_by_dialog.css";
QZFL.widget.Confirm.path = "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/widget/confirm_base.js";


/**
 * 用于异步构建的虚方法对接器
 * @private
 *
 */
QZFL.widget.Confirm._shellCall = function(pFnName, objInstance, args){
	var _s = QZFL.widget.Confirm;
	QZFL.imports(_s.path, (function(th){
				return function(){
						_s.prototype[pFnName].apply(th, args || []);
					};
			})(objInstance));
};



(function(fl){ //把一个个shell方法都映射出来
	for(var i = 0, len = fl.length; i < len; ++i){
		QZFL.widget.Confirm.prototype[fl[i]] = (function(pName){
				return function(){
						QZFL.widget.Confirm._shellCall(pName, this, arguments);
					};
			})(fl[i]);
	}
})(['hide', 'show']);


/**
 * @fileoverview 数据中心 字典方式索引的数据中心 //to do
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 数据中心
 *
 * @namespace QZFL.dataCenter
 * 
 * 存在shareObject中的东西根本取不到
 */
(function(qdc){
	var dataPool = {};
	/**
	 * 内部实体
	 *
	 * @ignore
	 */
	qdc.get = qdc.load = function(key){
		return dataPool[key];
	};
	/**
	 * @内部实体
	 * @ignore
	 */
	qdc.del = function(key){
		dataPool[key] = null;
		delete dataPool[key];
		return true;
	};
	/**
	 * 内部实体
	 *
	 * @ignore
	 */
	qdc.save = function saveData(key, value){
		dataPool[key] = value;
		return true;
	};
})(QZFL.dataCenter = {});

/**
 * @fileoverview QZFL对话框类,需要QZFL.dragdrop类支持
 * @version 1.$Rev: 1917 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 */


/**
 * 开启一个全屏幕遮盖的灰色蒙板，灰度可调节，全局唯一
 * 也可以当建立遮罩层的方法
 *
 * @namespace 蒙板层组件
 * @name maskLayout
 * @memberOf QZFL
 * @function
 * @see QZFL.maskLayout.create
 * @example QZFL.maskLayout();
 */
QZFL.maskLayout = (function(){
	var masker = null,
		count = 0,

		/**
		 * 建立一个遮罩层
		 * @memberOf QZFL.maskLayout
		 * @name create
		 * @function
		 */
		qml = function(zi, doc, opts){
			++count;

			if(masker){
				return count;
			}

			zi = zi || 5000;
			doc = doc || document;

			masker = QZFL.dom.createElementIn("div", doc.body, false, {
				className: "qz_mask",
				unselectable: 'on'
			});

			masker.style.cssText = 'background-color:#000;-ms-filter:"alpha(opacity=20)";#filter:alpha(opacity=20);opacity:.2; position:fixed;_position:absolute;left:0;top:0;z-index:' + zi + ';width:100%;height:' + QZFL.dom[QZFL.userAgent.ie < 7 ? 'getScrollHeight' : 'getClientHeight'](doc) + 'px;';

			QZFL.dom.setStyle(masker, opts);

			return count;
		};

	/**
	 * 设置层透明度
	 * @memberOf QZFL.maskLayout
	 * @name setOpacity
	 * @function
	 * @param {number} ov 透明度比例，数值在 [0, 1] 区间内，如 0.35
	 */
	qml.setOpacity = function(ov){
		if (masker && ov) {
			QZFL.dom.setStyle(masker, 'opacity', ov);
		}
	};

	/**
	 * 获取当前遮罩层的DOM引用
	 * @memberOf QZFL.maskLayout
	 * @name getRef
	 * @function
	 * @returns {object} 当前遮罩层的DOM引用
	 */
	qml.getRef = function(){
		return masker;
	};

	/**
	 * 移除遮罩层
	 * @memberOf QZFL.maskLayout
	 * @name remove
	 * @function
	 * @param {boolean} [rmAll=false] 如果是true则立即移除，如果为false则只减少引用计数，计数为0时做实际移除
	 */
	qml.remove = function(rmAll){
		--count;

		if(!count || rmAll){
			QZFL.dom.removeElement(masker);
			masker = null;

			rmAll && (count = 0);
		}
	};

	return (qml.create = qml);
})();

/**
 * @fileoverview fixed层效果，主要正对IE6做兼容
 * @version 1.$Rev: 1723 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2010-04-08 19:26:57 +0800 (周四, 08 四月 2010) $
 */

/**
 * 页面上下区域的水印层生成器
 *
 * @namespace QZFL.fixLayout
 */
QZFL.fixLayout = {
	_fixLayout : null,
	_isIE6 : (QZFL.userAgent.ie && QZFL.userAgent.ie < 7),

	_layoutDiv : {},
	_layoutCount : 0,

	/**
	 * 初始化fixed层
	 *
	 * @ignore
	 */
	_init : function() {
		this._fixLayout = QZFL.dom.get("fixLayout") || QZFL.dom.createElementIn("div", document.body, false, {
			id : "fixLayout",
			style : "width:100%;"
		});
		this._isInit = true;
		// document.body.onscroll = this._onscroll;
		if (this._isIE6) {
			// // document.documentElement.onscroll = QZFL.event.bind(this,
			// this._onscroll);
			QZFL.event.addEvent(document.compatMode == "CSS1Compat" ? window : document.body, "scroll", QZFL.event.bind(this, this._onscroll));
		}
	},

	/**
	 * 创建一个自动修正的层, 不建议创建太多
	 *
	 * @param {String} html html内容
	 * @param {Boolean} isBottom=false 所在位置，是否处于底部,默认为创建顶部的容器
	 * @param {String} layerId 浮动层的dom id
	 * @param {bool} noFixed 不修正浮动层的位置 for ie6 only argument
	 * @param {Object} options 其他参数
	 * @return {Number} 返回这个层的id编号
	 * @example
	 * 			QZFL.fixLayout.create(html, true, "_returnTop_layout", false, {style : "right:0;z-index:5000" + (QZONE.userAgent.ie ? ";width:100%" : "")});
	 */
	create : function(html, isBottom, layerId, noFixed, options) {
		if (!this._isInit) { // 如果没有初始化，则自动初始化
			this._init();
		}
		options = options || {};
		var tmp = {
			style : (isBottom ? "bottom:0;" : "top:0;") + (options.style || "left:0;width:100%;z-index:10000")
		}, _c;

		if (layerId) {
			tmp.id = layerId;
		}
		this._layoutCount++;
		_c = this._layoutDiv[this._layoutCount] = QZFL.dom.createElementIn("div", this._fixLayout, false, tmp);
		_c.style.position = this._isIE6 ? "absolute" : "fixed";
		_c.isTop = !isBottom;
		_c.innerHTML = html;
		_c.noFixed = noFixed ? 1 : 0;
		return this._layoutCount;
	},

	/**
	 * 把固定层固定到顶部
	 *
	 * @param {number} layoutId 层编号 - 由create的时候返回的编号
	 */
	moveTop : function(layoutId) {
		if (!this._layoutDiv[layoutId].isTop) {
			with (this._layoutDiv[layoutId]) {
				if (this._isIE6 && !this._layoutDiv[layoutId].noFixed) {
					style.marginTop = QZFL.dom.getScrollTop() + "px";
					style.marginBottom = "0";
					style.marginBottom = "auto";
				}
				style.top = "0";
				style.bottom = "";
				isTop = true;
			}
		}
	},

	/**
	 * 把固定层固定到底部
	 *
	 * @param {number} layoutId 层编号 - 由create的时候返回的编号
	 */
	moveBottom : function(layoutId) {
		if (this._layoutDiv[layoutId].isTop) {
			with (this._layoutDiv[layoutId]) {
				if (this._isIE6 && !this._layoutDiv[layoutId].noFixed) {
					style.marginTop = "auto";
					style.marginBottom = "0";
					style.marginBottom = "auto";
				}
				style.top = "";
				style.bottom = "0";
				isTop = false;
			}
		}
	},

	/**
	 * 往固定层里填充html内容html
	 *
	 * @param {number} layoutId 层编号 - 由create的时候返回的编号
	 * @param {string} html html内容
	 */
	fillHtml : function(layoutId, html) {
		this._layoutDiv[layoutId].innerHTML = html;
	},

	/**
	 * 监听滚动条，for ie6
	 *
	 * @ignore
	 */
	_onscroll : function() {
		var o = QZFL.fixLayout;
		for (var k in o._layoutDiv) {
			if (o._layoutDiv[k].noFixed) {
				continue;
			}
			QZFL.dom.setStyle(o._layoutDiv[k], "display", 'none');
		}
	
		clearTimeout(this._timer);
		this._timer = setTimeout(this._doScroll, 500);

		if (this._doHide) {
			return
		}

		this._doHide = true;
	},

	/**
	 * 执行滚动条滚动后的脚本 for ie6
	 *
	 * @ignore
	 */
	_doScroll : function() {
		var o = QZFL.fixLayout;

		for (var k in o._layoutDiv) {
			if (o._layoutDiv[k].noFixed) {
				continue;
			}
			var _item = o._layoutDiv[k];
			if (_item.isTop) {
				o._layoutDiv[k].style.marginTop = QZFL.dom.getScrollTop() + "px";
			} else {
				// ie6的bottom 有bug...
				// 必须要重新设置一下，然后在还原marginBottom即可还原。崩溃了,想死的心都有了
				o._layoutDiv[k].style.marginBottom = "0";
				o._layoutDiv[k].style.marginBottom = "auto";
			}
		}
		
		clearTimeout(this._stimer);
		this._stimer = setTimeout(function(){
			for (var k in o._layoutDiv) {
				if (o._layoutDiv[k].noFixed) {
					continue;
				}
				QZFL.dom.setStyle(o._layoutDiv[k], "display", "");
			}
		},800);

		o._doHide = false;
	}
};

/**
 * @fileoverview 指向性提示框 外壳
 * @version 1.$Rev: 1821 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2010-09-26 12:22:44 +0800 (周日, 26 九月 2010) $
 */





/**
 * @fileoverview 气泡提示框
 * @version 1.$Rev: 1869 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2010-11-03 12:37:14 +0800 (周三, 03 十一月 2010) $
 */

/**
 * 气泡 widget
 * 
 * @namespace
 */
QZFL.widget.bubble = {
	/**
	 *
	 *
	 */
	path : "http://qzonestyle.gtimg.cn/ac/qzfl/release/widget/tips.js?v=2.1",

	/**
	 * 气泡提示接口
	 * 
	 * @param {Element} target 对象
	 * @param {String} title 气泡标题
	 * @param {String} msg 气泡内容
	 * @param {Object} opts 气泡参数 {timeout,className,id,styleText,call}
	 * @return 返回新建的气泡编号
	 */
	show : function(target, title, msg, opts) {
		opts = opts || {};
		var bid = opts.id || "oldBubble_" + (++QZFL.widget.bubble.count);
		opts.id = bid;
		QZFL.imports(QZFL.widget.bubble.path, function(){
			QZFL.widget.tips.show(
				'<div>' + title + '</div>' + msg,
				target,
				opts
			);
		});
		return bid;
	},

	/*
	 * 初始计数
	 */
	count: 0,

	/**
	 * 隐藏气泡
	 * 
	 * @param {Number} id 气泡编号
	 */
	hide : function(id) {
		if(QZFL.widget.tips){
			QZFL.widget.tips.close(id);
		}
	},

	/**
	 * 隐藏所有气泡
	 */
	hideAll : function() {
		if(QZFL.widget.tips){
			QZFL.widget.tips.closeAll();
		}
	}
};

/**
 * 隐藏气泡
 * @deprecated
 * @param {String} bubbleId 气泡编号
 */
function hideBubble(bubbleId) {
	QZFL.widget.bubble.hide(bubbleId);
}

/**
 * 隐藏所有气泡
 * @deprecated
 */
function hideAllBubble() {
	QZFL.widget.bubble.hideAll();
}
/**
 * @fileoverview 气泡功能扩展
 * @version 1.$Rev: 1869 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2010-11-03 12:37:14 +0800 (周三, 03 十一月 2010) $
 */

/**
 * extend Bubble Create
 * @deprecated
 * @param {String} key 关键key
 * @param {Element} target 对象
 * @param {String} msg 气泡标题
 * @param {Object} options 气泡参数 {timeout,className,id,styleText,callback}
 * @return 返回新建的气泡编号
 */
QZFL.widget.bubble.showEx = QZFL.emptyFn;

/**
 * 设置气泡是否不再显示的key
 * @deprecated
 * @param {string} key shareObject 的 key
 * @param {bool} value 设置不在显示的值
 */
QZFL.widget.bubble.setExKey =  QZFL.emptyFn;










/**
 * 气泡 widget
 * 
 * @namespace
 */
QZFL.widget.tips = {
	/**
	 *
	 *
	 */
	path : "http://qzonestyle.gtimg.cn/ac/qzfl/release/widget/tips.js",

	/**
	 * 气泡展示
	 *
	 * @param {string} [html = ""] 内容html
	 * @param {HTMLElement} [aim = document.body] 所指目标节点
	 * @param {object} [opts = {
			 x:0, //与默认计算的对齐位置的横向便宜，正负整数皆可
			 y:0, //与默认计算的对齐位置的纵向便宜，正负整数皆可
			 width:200, //宽度
			 height:100, //高度
			 arrowType:2 //2：90度角式样，经典场景 1：45度角式样，适合“谁谁说。。。”场景
			 arrowSize:(根据arrowType决定) //小尖角zoom大小
			 arrowEdge:(根据aim节点位置动态决定) //尖角所在的边 1：上 2：右 3：下 4：左
			 arrowPoint:(根据aim节点位置和arrowEdge动态决定) //尖角所靠近的端点 1：左上 2：右上 3：右下 4：左下
			 arrowOffset:(根据arrowtype和arrowSize动态计算) //尖角距离所指定的“靠近端点”的偏移
			 borderColor:'#cbae85',
			 backgroundColor:'#fdfdd9',
			 backgroundImageUrl:"", //整个内容区背景图URL
			 appendMode:0, //插入页面的方式：
			 //   0 [默认]绝对定位在页面body上插入
			 //   1 插在aim之后，与aim并列
			 //   2 插在aim之前，与aim并列
			 noShadow:false,
			 closeButtonColor:'#ba6f2b',
			 closeButtonSize:'12', //默认12px的字体大小（这里使用unicode '×' 字符实现的）
			 needFixed:false, //是否使用position:fixed模式
			 noQueue:false, //是否不参与排队，排队的意思是：当前有个tips在展示了，那么就pedding着，等当前tips关掉再显示自己
			 timeout:5000, //自动关闭前停留时间，需要恒定存在可以给 -1
			 callback:undefined //关闭后的回调函数
		 }]
	 * @return {string} 实体的id
	 */
	show : function(html, aim, opts) {
		opts = opts || {};
		var bid = opts.id || "QZFL_bubbleTips_" + (++QZFL.widget.tips.count);
		opts.id = bid;
		QZFL.imports(QZFL.widget.tips.path, function(){
			QZFL.widget.tips.show(
				html,
				aim,
				opts
			);
		});
		return bid;
	},

	/*
	 * 初始计数
	 */
	count: -1,

	/**
	 * 隐藏气泡
	 * 
	 * @param {Number} id 气泡编号
	 */
	close : function(id) {
		QZFL.imports(QZFL.widget.tips.path, function(){
			if(QZFL.widget.tips){
				QZFL.widget.tips.close(id);
			}
		});
	},

	/**
	 * 隐藏所有气泡
	 */
	closeAll : function() {
		QZFL.imports(QZFL.widget.tips.path, function(){
			if(QZFL.widget.tips){
				QZFL.widget.tips.closeAll();
			}
		});
	}
};


/*
 * Copyright (c) 2008, Tencent Inc. All rights reserved.
 */
/**
 * @fileoverview 随机seed
 * @author QzoneWebGroup
 * @version 1.0
 */

/**
 * 用来返回
 *
 * @namespace
 */
QZFL.widget.seed = {
	_seed : 1,

	/**
	 * 记录cooki的域名
	 */
	domain : "qq.com",
	
	prefix : "__Q_w_s_",

	/**
	 * 更新Seed数值
	 * @param {string} [k] seed的名称
	 * @param {object} [opt] 相关选项 useCookie, domain
	 * @return {number} 更新后的值，更新失败为0
	 */
	update : function(k, opt) {
		var n = 1, s, th = QZFL.widget.seed;
		if (typeof(k) == "undefined") {
			n = th._update();
		}else{
			k = th.prefix + k;
			if(opt && opt.useCookie){
				n = QZFL.cookie.get(k);
				if(n){
					QZFL.cookie.set(k, ++n, opt.domain || th.domain, null, 3000)
				}else{
					return 0;
				}
			}else{
				s = QZFL.shareObject.getValidSO();

				if (!s) {
					n = th._update();
				} else if (n = s.get(k)) {
					s.set(k, ++n);
				} else {
					return 0;
				}
			}
		}
		return n;
	},
	
	_update : function(){
		var th = QZFL.widget.seed;
		QZFL.cookie.set(
			"randomSeed",
			(th._seed = parseInt(Math.random() * 1000000, 10)),
			th.domain,
			null,
			3000);
		return th._seed;
	},

	/**
	 * 获得Seed数值
	 * @param {string} [k] seed的名称
	 * @param {object} [opt] 相关选项 useCookie, domain
	 * @return {number} seed值
	 */
	get : function(k, opt) {
		var s, n, th = QZFL.widget.seed;
		if (typeof(k) == "undefined") {
			return (th._seed = QZFL.cookie.get("randomSeed")) ? th._seed : th.update();
		}else{
			k = th.prefix + k;
			if(opt && opt.useCookie){
				return (n = QZFL.cookie.get(k)) ? n : (QZFL.cookie.set(k, n = 1, opt.domain || th.domain, null, 3000), n);
			}else{
				if(!(s = QZFL.shareObject.getValidSO())){
					return th._seed;
				}
				return (n = s.get(k)) ? n : (s.set(k, n = 1), n); /* 呵呵，好久不用逗号表达式了 */
			}
		}
	}
};
/**
 * @fileoverview 这是个有趣的widget,能够在两个Dom之期间绘制一个会跑的外框 需要 QZFL.Tween 支持
 */
/**
 * runBox widget 能够在两个Dom之期间绘制一个会跑的外框,可以用作提醒
 *
 * @namespace
 */
QZFL.widget.runBox = {
	/**
	 * 记录一些动作的队列,递增的.
	 */
	_actions: [],
	
	/**
	 * 一些默认配置：duration动画的持续时间，单位s（秒）。
	 */
	_def_cong: {
		'duration': 0.6
	},
	
	/**
	 * @param {HTMLElement|String} startDom 开始的dom
	 * @param {HTMLElement|String} finishDom 移动到结束的dom
	 * @param {Object} conf 可选参数 duration表示动画时间。默认为0.6s。
	 * eg : {duration:0.6}，可选参数使用object，便于扩展。
	 */
	start: function(startDom, finishDom, conf){
		this._actions.push(new this._runAction(startDom, finishDom, conf));
	},
	
	/**
	 * 播放动画的行为
	 *
	 * @param {HTMLElement|String} _sDom 开始的dom
	 * @param {HTMLElement|String} _fDom 移动到结束的dom
	 * @param {Object} conf 可选参数
	 * @ignore
	 * @constructor
	 */
	_runAction: function(_sDom, _fDom, _conf){
		/**
		 * 动画初始位置的dom
		 */
		this._sDom = QZFL.dom.get(_sDom);
		
		/**
		 * 动画结束位置的dom
		 */
		this._fDom = QZFL.dom.get(_fDom);
		
		/**
		 * 一些配置
		 */
		this._conf = QZFL.lang.propertieCopy(_conf, QZFL.widget.runBox._def_cong, null, true);
		
		
		this._actionID = -1;
		
		/**
		 * 记录初始的位置
		 */
		this._sPosition = null;
		
		/**
		 * 记录结束的位置
		 */
		this._fPosition = null;
		
		/**
		 * 逃跑的box
		 */
		this._runBox = null;
		
		if (_init.call(this)) { // 初始化数据,如果成功就开始run
			_run.call(this);
		}
		
		/**
		 * 初始化一些对象
		 *
		 * @ignore
		 * @return boolean 返回初始化是否成功
		 */
		function _init(){
			if (!this._sDom || !this._fDom) {
				return false;
			}
			var o = this;
			o._sPosition = QZFL.dom.getPosition(this._sDom);
			o._fPosition = QZFL.dom.getPosition(this._fDom);
			o._actionID = QZFL.widget.runBox._actions.length - 1;
			
			o._runBox = QZFL.dom.createElementIn("div", document.body, false, {
				style: "border:3px solid #999;z-index:10000;position:absolute"
			});
			QZFL.dom.setXY(this._runBox, this._sPosition.left, this._sPosition.top);
			QZFL.dom.setSize(this._runBox, this._sPosition.width, this._sPosition.height);
			// QZFL.dom.setStyle(this._runBox,"opacity",0.4);
			return true;
		}
		
		/**
		 * 开始执行
		 */
		function _run(){
			var _me = this;
			QZFL.effect.run(this._runBox, {
		    	left: _me._fPosition.left,
		    	top:_me._fPosition.top,
		        width: _me._fPosition.width,
		        height: _me._fPosition.height
		    },{
		        duration : this._conf.duration*1000,
		       	complete : function() {
			        delMe.call(_me);
					_me = null;
					_t = null;
		    	}
		    });
		}
		
		/**
		 * 删除runBox
		 */
		function delMe(){
			QZFL.dom.removeElement(this._runBox);
			QZFL.widget.runBox[this._actionID] = null;
		}
	}
};




/**
 * @author scorr
 */


/**
 * 需要打开string命名空间
 */
QZFL.object.map(QZFL.string || {});

/**
 * 需要打开util命名空间
 */
QZFL.object.map(QZFL.util || {});

/**
 * 需要打开lang命名空间
 */
QZFL.object.map(QZFL.lang || {});

(function(w){
	w.ua = w.ua || QZFL.userAgent;
	w.$e = QZFL.element.get;
	w.$ = QZFL.dom.get;
	w.removeNode = QZFL.dom.removeElement;
	w.ENV = QZFL.enviroment;
	w.addEvent = QZFL.event.addEvent;
	w.removeEvent = QZFL.event.removeEvent;
	w.getEvent = QZFL.event.getEvent;
	w.insertFlash = QZFL.media.getFlashHtml;
	w.getShareObjectPrefix = getShareObjectPrefix; //flash so 中要用的回调
})(window);
if(!QZFL.pluginsDefine){
	QZFL.pluginsDefine = {};
}

/**
 * 获取反CSRF的token
 * @author scorpionxu
 * @example QZONE.FrontPage.getACSRFToken();
 * @return {String} 返回token串
 *
 */
QZFL.pluginsDefine.getACSRFToken = function(){
	return arguments.callee._DJB(QZFL.cookie.get("skey"));
};

/**
 * 一个简单的摘要签名算法
 * @author scorpionxu
 * @ignore
 */
QZFL.pluginsDefine.getACSRFToken._DJB = function(str){
	var hash = 5381;

	for(var i = 0, len = str.length; i < len; ++i){
		hash += (hash << 5) + str.charCodeAt(i);
	}

	return hash & 0x7fffffff;
};

(function(){
	var t = QZONE.FormSender;


	if(t && t.pluginsPool){
		t.pluginsPool.formHandler.push(function(fm){
			if(fm){
				if(!fm.g_tk){
				/*	var ipt = QZFL.dom.createNamedElement("input", "g_tk", document);
					ipt.type = "hidden";
					ipt.value = QZFL.pluginsDefine.getACSRFToken();
					fm.appendChild(ipt);*/

					var a = QZFL.string.trim(fm.action);
					a += (a.indexOf("?") > -1 ? "&" : "?") + "g_tk=" + QZFL.pluginsDefine.getACSRFToken();
					fm.action = a;
				}
			}
		});
	}
})();
/*(function(){
	var t = QZONE.JSONGetter;


	if(t && t.pluginsPool){
		t.pluginsPool.srcStringHandler.push(function(ss){
			if(typeof(ss) == "string"){
				if(ss.indexOf("g_tk=") < 0){
					ss += (ss.indexOf("?") > -1 ? "&" : "?") + "g_tk=" + QZFL.pluginsDefine.getACSRFToken();
				}
			}
			return ss;
		});
	}
})();*/

(function(){
	var t = QZONE.JSONGetter,
		jsRE = /\.js$/i;


	if(t && t.pluginsPool){
		t.pluginsPool.srcStringHandler.push(function(ss){
			var sw, pn;
			if(typeof(ss) == "string"){
				if(ss.indexOf("g_tk=") < 0){
					pn = (sw = (ss.indexOf("?") > -1)) ? ss.split('?')[0] : ss;
					if(jsRE.lastIndex = 0, !jsRE.test(pn)){
						ss += (sw ? "&" : "?") + "g_tk=" + QZFL.pluginsDefine.getACSRFToken();
					}
				}
			}
			return ss;
		});
	}
})();



//(window.qzc = function(){




})();


/**
 * @fileOverview 需要用eval覆盖系统原生接口的fix都放在这里
 * @author scorr
 */


if(QZFL.userAgent.ie){ //一些浏览器行为矫正
	eval((QZFL.userAgent.ie < 9 ? "var document = QZFL._doc;" : "") + "var setTimeout = QZFL._setTimeout, setInterval = QZFL._setInterval");
}

