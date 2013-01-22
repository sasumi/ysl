/**
 * 创建正则对象
 * @param {String} pattern
 * @param {String} flags
 */
var createRegEX = function(pattern, flags) {
	try {
		var reg = new RegExp('');
		reg.compile(pattern, flags);
		return reg;	
	} catch(e){
		console.log(e, pattern, flags);
	}
};

/**
 * QZONE媒体基础应用类(图片、音乐、影集、视频、flash)
 * 该插件必须运行在qzone环境下面，且先加载当前类
 * 当前类继承存在BUG。父类属性会被删除
 */
(function(v){
	v.Class('ve.plugin.QzoneMedia', {
		/**
		editor: {
			GetUBBContentParserList:[],	HTML转UBB解析器列表
			InsertUBBParserList:[],		编辑器插入解析器列表
			GetContentFilterList:[],	编辑器输出HTML(getContent)过滤器列表
			SetContentFilterList:[]		编辑器setContent输入过滤器列表
		},
		config: {
			disableScale: false		对象是否为可缩放,默认否
		},
		cacheData: {},
		**/
		
		//初始化所有html转换UBB需要的规则
		//禁止覆盖!!
		defaultHtmlToUBBRegEx : {
			toStrong: createRegEX('<([\\/]?)(strong|b)[^>]*>', 'ig'),
			toItalic: createRegEX('<([\\/]?)(em|i)[^>]*>', 'ig'),
			toUnderline: createRegEX('<([\\/]?)(ins|u)[^>]*>', 'ig'),
		
			toAlignCenter: createRegEX('<(div|p)[^>]+align.{0,2}center[^>]*>([^\\<]+)<\\/(div|p)[^>]*>', 'ig'),
			toAlignRight: createRegEX('<(div|p)[^>]+align.{0,2}right[^>]*>([^\\<]+)<\\/(div|p)[^>]*>', 'ig'),
			
			glowFont: createRegEX('<font[^>]+\\_glowcolor.{0,2}#(\\w{6})[^>]*>', 'ig'),
			removeDumpDiv: createRegEX('^<(div|p)></(div|p)>', 'i'),
		
			toNameCard: createRegEX('<a[^>]+link="nameCard_(\\d+)"[^>]*>(.*?)<\\/a[^>]*>', 'ig'),
			toMail: createRegEX('<a[^>]+href="mailto:(.*?)"[^>]*>(.*?)<\\/a[^>]*>', 'ig'),
			toUrl: createRegEX('<a[^>]+href="(.*?)"[^>]*>(.*?)<\\/a[^>]*>', 'ig'),
			toEmotion: createRegEX('<img[^>]+em\\/e(\\d{1,3}).gif[^>]*>', 'ig'),
			fullFont: createRegEX('<font[^>]+style="[^"].+color=#(\\w+).+color:\s#(\\w+).+"[^>]*>([^\\<]+)<\\/font[^>]*>', 'ig'),
		
			delScript: createRegEX('<script[^>]*>(.*?)<\\/script[^>]*>', 'ig'),
		
			blockLine: createRegEX('<(div|p)[^>]*>(.*?)(<b(r|r\\/)>|)<\\/(div|p)[^>]*>', 'ig'),
			block: createRegEX('<b(r|r\\/)>', 'ig'),
			paragraph: createRegEX('<p[^>]*>(.*?)<\/p>','ig'),
			paragraph2: 'hello',
		
			//这里有REG BUG
			//invalidProperties: createRegEX('[a-z]+="[^<>"]+[<>][^"]+")*', 'g'),
		
			orderedListStart: createRegEX('<ol(\\s*style="LIST-STYLE-TYPE:\\s*[a-z]+(;)?")?[^>]*>', 'ig'),
			orderedListEnd: createRegEX('<\\/ol>', 'ig'),
			unorderedListStart: createRegEX('<ul(\\s*style="LIST-STYLE-TYPE:\\s*[a-z]+(;)?")?[^>]*>', 'ig'),
			unorderedListEnd: createRegEX('<\\/ul>', 'ig'),
			listItemStart: createRegEX('<li(\\s*style="MARGIN:\\s*\\d+px(;)?")?[^>]*>', 'ig'),
			listItemEnd: createRegEX('<\\/li>', 'ig')
		},
		
		//初始化UBB转HTML正则
		defaultUBBToHtmlRegEX: {
			ubbNameCard: createRegEX('\\[card=(\\d+)\\](.+?)\\[\\/card\\]', 'ig'),
			ubbURL: createRegEX('\\[url=(http[^\\]\\"\\\']+)]([^\\[]+)\\[\\/url\\]', 'ig'),
			ubbGlow: createRegEX('\\[ffg,([#\\w]{1,10}),([#\\w]{1,10})\\]', 'ig'),
			ubbFont: createRegEX('\\[ft=([^\\]]+)\\]', 'ig'),
			ubbFontColor: createRegEX('\\[ftc=([#\\w]{1,10})\\]', 'ig'),
			ubbFontSize: createRegEX('\\[fts=([1-6]{1,1})\\]', 'ig'),
			ubbFontFace: createRegEX('\\[ftf=(.[^\\]]+)\\]', 'ig'),
			ubbVphoto: createRegEX('\\[vphoto,(\\d+),(\\d{5,11})](.*?)\\[\\/vphoto\\]', 'ig')
		},
			
		/**
		 * 设置配置
		 * @param {String} key
		 * @param {Mixed} val
		 * @return {Object}
		 */
		setConfig: function(key, val){
			this.config[key] = val;
			return this;
		},
		
		/**
		 * 获取配置
		 * @param {String} key
		 * @return {Mixed}
		 */
		getConfig: function(key){
			return key ? this.config[key] : this.config;
		},
		
		/**
		 * 显示插入面板
		 */
		showPanel: function(){
			var panelConfig = this.getConfig('panel');
			var dlg = QZONE.FP.popupDialog(panelConfig.name,{src:panelConfig.url},panelConfig.width, panelConfig.height);
			if(this.popupCallback){
				QZFL.FP.appendPopupFn(ve.bind(this,this.popupCallback));	
			}
			dom.event.cancel(e);
			return dlg;
		},
		
		/**
		 * 初始化
		 * @param {Object} editor
		 * @param {String} url
		 */
		init: function (editor, url) {
			this.editor = editor;
			this.bindInsertUBBMethod();
			this.setGetUBBContentParser(ve.bind(this,function(html){
				return this.defaultGetUBBContentParser(html);
			}));
			
			//绑定getUBBContent()
			this.bindGetUBBContentMethod();
			
			//绑定setContent事件
			this.bindSetContentEvent();
			
			//绑定getContent事件
			this.bindGetContentEvent();
		},
		
		/**
		 * 关闭插入面板
		 */
		closePanel: function(){
			window.setTimeout(function(){
				try {
					QZONE.FP.closePopup();
				} catch(e){};
			}, 100)
		},
		
		/**
		 * 设置HTML转UBB解析器
		 * @param {Function} fun
		 */
		setGetUBBContentParser: function(fun){
			if(!this.editor.GetUBBContentParserList){
				this.editor.GetUBBContentParserList = [];
			}
			this.editor.GetUBBContentParserList.push(fun);
		},
		
		/**
		 * 默认HTML转UBB处理
		 * @param {String} str
		 * @return {String}
		 */
		defaultGetUBBContentParser: function(str){
			//把html中的换行去掉
			str = str.replace(/(\n|\r)/g,'');
			
			//移除第一个div或p
			str = str.replace(this.defaultHtmlToUBBRegEx.removeDumpDiv, '');
	
			// 表情处理
			str = str.replace(this.defaultHtmlToUBBRegEx.toEmotion, "[em]e$1[/em]");
	
			// 图片处理
			str = str.replace(/<img([^>]+)>/ig, function() {
				try {
					var args = arguments;
					var orgSrc = /orgSrc="([^"]+)"/i.exec(args[1]);
	
					var src = (orgSrc && orgSrc[1]) ? orgSrc[1] : (/src="([^"]+)"/i.exec(args[1])[1]);
					var w = /WIDTH([\D]{0,2})(\d{1,4})/i.exec(args[1]);
					var h = /HEIGHT([\D]{0,2})(\d{1,4})/i.exec(args[1]);
					var t = /TRANSIMG=(\"*)(\d{1})/i.exec(args[1]);
					var ow = /ORIGINWIDTH=(\"*)(\d{1,4})/i.exec(args[1]);
					var oh = /ORIGINHEIGHT=(\"*)(\d{1,4})/i.exec(args[1]);
					var oContent = /CONTENT="([^"]+)"/i.exec(args[1]);
					var osrc = /ORIGINSRC="([^"]+)"/i.exec(args[1]);
					var c = (QZFL.userAgent.ie ? /class=(flash|video|audio|qqVideo|vphoto|music)/i.exec(args[1]) : /class="(flash|video|audio|qqVideo|vphoto)/i.exec(args[1]));
	
					// 表情符号处理
					var em = /em\/e(\d{1,3}).gif/i.exec(args[1]);
					if (em) {
						return "[em]e" + em[1] + "[/em]";
					}
	
					// 正常的图片处理
					if (w && h) {
						return "[img," + w[2] + "," + h[2] + "]" + src + "[/img]";
					}
	
					return "[img]" + src + "[/img]";
				} catch (e) {
					return ''
				}
			});
	
			// 居中居右处理
			str = str.replace(this.defaultHtmlToUBBRegEx.toAlignCenter, "[M]$2[/M]");
			str = str.replace(this.defaultHtmlToUBBRegEx.toAlignRight, "[R]$2[/R]");
	
			// 发光字处理
			str = str.replace(this.defaultHtmlToUBBRegEx.glowFont, "[ffg,#$1,#FFFFFF]");
	
			// 文字处理
			str = str.replace(/<font([^>]+)>/ig, function() {
				var args = arguments;
				var color = /color([^#\w]{0,2})([#\w]{1,7})/.exec(args[1]);
				var size = /size=["]?(\d{1})/.exec(args[1]); // 在firefox下用execCommand插入的的font只有size
				var face = /face=("|)([^"\s]+)("|)/.exec(args[1]);
				return "[ft=" + (color ? color[2] : '') + "," + (size ? size[1] : '') + "," + (face ? face[2] : '') + "]";
			});
	
			// 字符标签闭合
			str = str.replace(/<\/font[^>]*>/ig, "[/ft]");
	
			// 非ie字符处理
			if (!QZFL.userAgent.ie) {
				str = str.replace(/<(div|span)([^>]+)>(.*?)<\/(div|span)[^>]*>/ig, function(all, a, b, c, d) {
					var color = /color:\x20*?([^;]+)/.exec(b);
					var face = /font-family:\x20*?([^;]+)/.exec(b);
					var tmp;
					
					if(color && color[1]){
						color = color[1].toLowerCase();
						if(color.indexOf("rgb") > -1){
							tmp = color.replace(/[rgb\(\)]/g, '').split(",");
							if(tmp && tmp.length > 2){
								color = "#" + (tmp[0] - 0).toString(16) + (tmp[1] - 0).toString(16) + (tmp[2] - 0).toString(16);
							}
						}
					}
					else{
						color = '';
					}
					return "[ft=" + color + ",," + (face ? face[1] : '') + "]" + c + "[/ft]";
				});
			}
	
			//空行
			str = str.replace(this.defaultHtmlToUBBRegEx.blockLine, "$2\n");
			str = str.replace(this.defaultHtmlToUBBRegEx.block, "\n");
			
			//P转\n
			str = str.replace(this.defaultHtmlToUBBRegEx.paragraph, "$1\n");

			// 基本文字样式处理
			str = str.replace(this.defaultHtmlToUBBRegEx.toStrong, "[$1B]");
			str = str.replace(this.defaultHtmlToUBBRegEx.toItalic, "[$1I]");
			str = str.replace(this.defaultHtmlToUBBRegEx.toUnderline, "[$1U]");
				
			// 脚本标签移除
			str = str.replace(this.defaultHtmlToUBBRegEx.delScript, '');
	
			// 不合法属性去除
			//str = str.replace(this.defaultHtmlToUBBRegEx.invalidProperties, '');
	
			// 名片处理
			str = str.replace(this.defaultHtmlToUBBRegEx.toNameCard, "[card=$1]$2[/card]");
	
			// 地址处理
			str = str.replace(this.defaultHtmlToUBBRegEx.toMail, "[email=$2]$1[/email]");
			str = str.replace(this.defaultHtmlToUBBRegEx.toUrl, "[url=$1]$2[/url]");
			
			str = str.replace(this.defaultHtmlToUBBRegEx.orderedListStart, "[ol]");
			str = str.replace(this.defaultHtmlToUBBRegEx.orderedListEnd, "[/ol]");
			str = str.replace(this.defaultHtmlToUBBRegEx.unorderedListStart, "[ul]");
			str = str.replace(this.defaultHtmlToUBBRegEx.unorderedListEnd, "[/ul]");
			str = str.replace(this.defaultHtmlToUBBRegEx.listItemStart, "[li]");
			str = str.replace(this.defaultHtmlToUBBRegEx.listItemEnd, "[/li]");
			
			//这个放到最后执行
			str = str.replace(/<[^>]*?>/g, '');
			str = str.replace(/&shy;/ig, '');
			str = str.replace(/&nbsp;/ig, " ");
			str = str.replace(/&lt;/ig, "<");
			str = str.replace(/&gt;/ig, ">");
			str = str.replace(/&amp;/ig, "&");
			str = str.replace(/\n$/i, '');
	
			//去掉空的ubb标签
			str = str.replace(/\[(url|ft|b|i|u|email|ffg)[^\[]*?\](\x20*?)\[\/(url|ft|b|i|u|email)\]/, '');
			return str;
		},
		
		/**
		 * 绑定 getUBBContent方法
		 * 由于QzoneMedia类没有初始化，因此必须在设置解析器时进行重新绑定
		 * this.editor.getUBBContent(html=null);
		 */
		bindGetUBBContentMethod: function(){
			if(!this.editor.getUBBContent){
				this.editor.getUBBContent = ve.bind(this,function(html){
					if(!this.editor.GetUBBContentParserList){
						return html;
					}
					var htmlContent = html || this.editor.getContent(),
						ubbContent = htmlContent;
					for(var i=this.editor.GetUBBContentParserList.length-1; i>=0; i--){
						var ubbParser = this.editor.GetUBBContentParserList[i];
						ubbContent = ubbParser(ubbContent); 
					}
					return ubbContent;
				});
			}
		},
		
		/**
		 * 默认UBB转HTML方法
		 * @param {Object} str
		 */
		defaultInsertUBBParser: function(str){
			//默认UBB转HTML方法， 在最开始执行
			str = str.replace(/&/ig, "&amp;");
			str = str.replace(/  /ig, "&nbsp;&nbsp;");
			str = str.replace(/</ig, "&lt;");
			str = str.replace(/>/ig, "&gt;");
			str = str.replace(/(\n|\r)/g,"<br/>");
				
			//名片
			str = str.replace(this.defaultUBBToHtmlRegEX.ubbNameCard, '<a href="http://user.qzone.qq.com/$1" link="nameCard_$1" target="_blank" class="q_namecard">$2</a>');

			//无内容超链接
			str = str.replace(/\[url(|=([^\]]+))\]\[\/url\]/g, function() {
				var args = arguments;
				var href = '';
				var REG_HTTP = /^http:\/\/anchor/i;
				if (REG_HTTP.test(args[2])) { // 第一个参数是超链接
					href = args[2];
				} else if (REG_HTTP.test(args[3])) { // 第二个参数是超链接
					href = args[3];
				}
				if (!href){
					return args[0];
				}
				return '<a href="' + href + '">#</a>';
			});
	
			//有内容超链接
			str = str.replace(/\[url(|=([^\]]+))\](.+?)\[\/url\]/g, function() {
				var args = arguments;
				var REG_HTTP = /^http:\/\//i;
				var INVALID_HREF_STRING = /[\"\']/i;
				var INVALID_EXPLAIN_STRING = /\[(em|video|flash|audio|vphoto|quote|ffg|url|marque|email)/i;
	
				var explain = '';
				var href = '';
	
				if (!args[1]) {// [url][/url] 模式
					if (REG_HTTP.test(args[3])) {
						explain = href = args[3];
					}
				} else {// [url=][/url] 模式
					if (REG_HTTP.test(args[2])) { // 第一个参数是超链接
						explain = args[3];
						href = args[2];
					} else if (REG_HTTP.test(args[3])) { // 第二个参数是超链接
						explain = args[2];
						href = args[3];
					}
				}
	
				if (!href || !explain || INVALID_HREF_STRING.test(href) || INVALID_EXPLAIN_STRING.test(explain)){
					return args[0]; // 匹配不上
				} else {
					return '<a href="' + href + '" target="_blank">' + explain + '</a>';
				}
			});
	
	
			//字体
			var fontCount = 0;
			var a;
	
			//发光字
			if (a = str.match(this.defaultUBBToHtmlRegEX.ubbGlow)) {
				fontCount += a.length;
				str = str.replace(this.defaultUBBToHtmlRegEX.ubbGlow, '<font style="line-height:'+LINE_HEIGHT+'" class="lightFont" title="发光字" _glowColor="$1" color="$1">');
			}
	
			//字体
			if (a = str.match(this.defaultUBBToHtmlRegEX.ubbFont)) {
				fontCount += a.length;
				str = str.replace(this.defaultUBBToHtmlRegEX.ubbFont, function() {
					var s = arguments[1].split(",");
					var color = s[0] ? ' color=' + s[0] : '';
					var size = s[1] ? ' size=' + (s[1] > 6 ? 6 : s[1]) : '';
					var face = s[2] ? ' face=' + s[2] : '';
					return '<font style="line-height:'+LINE_HEIGHT+'" ' + color + size + face + '>';
				});
			}
			
			//颜色
			if (a = str.match(this.defaultUBBToHtmlRegEX.ubbFontColor)) {
				fontCount += a.length;
				str = str.replace(this.defaultUBBToHtmlRegEX.ubbFontColor, '<font color="$1" style="line-height:'+LINE_HEIGHT+'">');
			}
	
			//大小
			if (a = str.match(this.defaultUBBToHtmlRegEX.ubbFontSize)) {
				fontCount += a.length;
				str = str.replace(this.defaultUBBToHtmlRegEX.ubbFontSize, '<font size="$1" style="line-height:'+LINE_HEIGHT+'">');
			}
	
			//字体
			if (a = str.match(this.defaultUBBToHtmlRegEX.ubbFontFace)) {
				fontCount += a.length;
				str = str.replace(this.defaultUBBToHtmlRegEX.ubbFontFace, '<font face="$1" style="line-height:'+LINE_HEIGHT+'">');
			}
	
			//缺省字体
			var regstr = /\[\/ft\]/g;
			if (a = str.match(regstr)) {
				fontCount -= a.length;
				str = str.replace(regstr, "</font>");
			}
	
			if (fontCount > 0) {
				str += (new Array(fontCount + 1)).join("</font>");
			}
	
			//li ol ul
			str = str.replace(/\[ol\]/ig, '<ol style="list-style-type:decimal">').replace(/\[\/ol\]/ig, "</ol>").replace(
				/\[ul\]/ig, '<ul style="list-style-type:disc">').replace(/\[\/ul\]/ig, "</ul>").replace(
				/\[li\]/ig, '<li>').replace(/\[\/li\]/ig, "</li>");
	
			//email
			var regstr = new RegExp("\\[email\\](.*?)\\[\\/email\\]", "ig");
			str = str.replace(regstr, '<a href="mailto:$1" target="_blank">$1</a>');
			
			var regstr = new RegExp("\\[email=(.*?)\\](.*?)\\[\\/email\\]", "ig");
			str = str.replace(regstr, '<a href="mailto:$2" target="_blank">$1</a>');
	
			//<j> replace font style
			str = str.replace(/\[B\](.*?)\[\/B\]/ig, '<B>$1</B>');
			str = str.replace(/\[U\](.*?)\[\/U\]/ig, '<U>$1</U>');
			str = str.replace(/\[I\](.*?)\[\/I\]/ig, '<I>$1</I>');
	
			str = str.replace(/\[M\]/ig, '<p align=center>&shy;');
			str = str.replace(/\[\/M\]/ig, "</p>");
	
			str = str.replace(/\[R\]/ig, '<p align=right>&shy;');
			str = str.replace(/\[\/R\]/ig, "</p>");
			return str;
		},
		
		/**
		 * 设置UBB转HTML方法
		 * @param {Object} fun
		 */
		setInsertUBBParser: function(fun){
			if(!this.editor.InsertUBBParserList){
				this.editor.InsertUBBParserList = [this.defaultInsertUBBParser];
			}
			this.editor.InsertUBBParserList.push(fun);
		},
		
		/**
		 * 设置HTML输入过滤器
		 * @param {Object} fun
		 */
		setSetContentFilter: function(fun){
			if(!this.editor.SetContentFilterList){
				this.editor.SetContentFilterList = [/**这里可以添加默认的setContent过滤器**/];
			}
			this.editor.SetContentFilterList.push(fun);
		},
		
		/**
		 * 设置HTML输出过滤器
		 * @param {Object} fun
		 */
		setGetContentFilter: function(fun){
			if(!this.editor.GetContentFilterList){
				this.editor.GetContentFilterList = [/**这里可以添加默认的 getContent过滤器**/];
			}
			this.editor.GetContentFilterList.push(fun);
		},
		
		/**
		 * 绑定 insertUBB方法
		 * 由于QzoneMedia类没有初始化，因此必须在设置解析器时进行重新绑定
		 * this.editor.insertUBB(ubb);
		 */
		bindInsertUBBMethod: function(){
			if(!this.editor.insertUBB){
				this.editor.insertUBB = ve.bind(this,function(ubb){
					var html = ubb;
					if(this.editor.InsertUBBParserList){
						for(var i=0; i<this.editor.InsertUBBParserList.length; i++){
							var htmlParser = this.editor.InsertUBBParserList[i];
							html = htmlParser.call(this,html);
						}	
					}
					this.editor.setContent(html);
				});	
			}
		},
		
		/**
		 * 绑定setContent方法
		 */
		bindSetContentEvent: function(){
			this.editor.onSetContent.add(ve.bind(this, function(data){
				var html = data;
				if(this.editor.SetContentFilterList){
					for(var i=0; i<this.editor.SetContentFilterList.length; i++){
						var fn = this.editor.SetContentFilterList[i];
						html = fn(html);
					}
				}
				return html;
			}));
		},
		
		/**
		 * 绑定getContent方法
		 * @param {Object} html
		 */
		bindGetContentEvent: function(){
			this.editor.onGetContent.add(ve.bind(this, function(data){
				var html = data;
				if(this.editor.GetContentFilterList){
					for(var i=0; i<this.editor.GetContentFilterList.length; i++){
						var fn = this.editor.GetContentFilterList[i];
						html = fn(html);
					}
				}
				return html;
			}));
		},
		
		isInWhiteList: function(url) {
			var isQQVideo = /^http:\/\/((\w+\.|)(video|v|tv)).qq.com/i.test(url);
			var isImgCache = /^http:\/\/(?:cnc.|edu.|ctc.)?imgcache.qq.com/i.test(url) || /^http:\/\/(?:cm.|cn.|os.|cnc.|edu.)?qzs.qq.com/i.test(url);
			var isComic = /^http:\/\/comic.qq.com/i.test(url);		
	
			return (isQQVideo || isImgCache || isComic);
		},
		
		escData: function(str){
			var rEscHTML = /[&<>\x27\x22]/g, hEscHTML = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				"'": '&#039;',
				'"': '&quot;'
			};
			return (str + '').replace(rEscHTML, function(c){
				return hEscHTML[c];
			});
		},
		
		restData: function(str){
			if (!ve.plugin.QzoneMedia.__utilDiv) {
				ve.plugin.QzoneMedia.__utilDiv = document.createElement("div");
			}
			var t = ve.plugin.QzoneMedia.__utilDiv;
			t.innerHTML = (str + '');
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
		 * 插入媒体
		 */
		insertHtml: function(html){
			this.editor.setContent(html);
		},
		
		setCache: function(data){
			if(!window.qzonemedia_cache_id_count){
				window.qzonemedia_cache_id_count = 1000;
				window.qzonemedia_cache_data = {};
			}
			window.qzonemedia_cache_id_count += 1;
			window.qzonemedia_cache_data[window.qzonemedia_cache_id_count] = data;
			return window.qzonemedia_cache_id_count; 
		},
		
		getCache: function(id){
			return window.qzonemedia_cache_data[id] || null;
		}
	});
	v.plugin.register('qzonemedia', ve.plugin.QzoneMedia);
})(ve);