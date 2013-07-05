/**
 * Youshang javascript framework
 * first build 2010-4-20 21:00
 * last updated 2010-11-19 2009
 * 
 * author: sasumi<sobizz@163.com>
 * copyright: sasumi
 * any third part(un authorized) modification must notify the original author first before 
 * a new version published.
 * version: 0.0.9
 * 
 * compress by closure-compiler:http://closure-compiler.appspot.com/home
 * [Simple]:15.18KB
 * http://js.clicki.cc/
 */
(function(){
	var Y = {ver:'0.0.9', cp:'sasumi', build:'20101119'},
		W = window,
		D = document;
	
	/**
	 * user agent
	 */
	UA = function(){return W.navigator.userAgent.toLowerCase();}();
	
	/**
	 * ua info
	 * ua.ie || ua.opera || ua.safari || ua.firefox || ua.chrome
	 * ua.ver
	 */
	Y.ua = function(){
		var b = {
			ie: /ie/.test(UA) && !/opera/.test(UA),
			opera: /opera/.test(UA),
			safari: /webkit/.test(UA) && !/chrome/.test(UA),
			firefox: /firefox/.test(UA),
			chrome: /chrome/.test(UA)
		};
		
		var k = '';
		for (var i in b) {
			if(b[i]){ k = 'safari' == i ? 'version' : i; break; }
		}
		b.ver = k && RegExp("(?:" + k + ")[\\/: ]([\\d.]+)").test(UA) ? RegExp.$1 : "0";
		b.ver = b.ie ? parseInt(b.ver,10) : b.ver;
		if(b.ie){b['ie'+b.ver] = true;}
		return b;
	}();
	
	Y.copy = function(txt){
		if(Y.ua.ie){
			return W.clipboardData.setData('Text', txt);
		}
		return false;
	};
	
	/**
	 * copy location to clipboard
	 */
	Y.copyUrl = function(){
		return Y.copy(this.location.href);
	};
	
	/**
	 * extend destination property with source object's property
	 * @param object tag
	 * @param object src, source
	 * @param object ov, override
	 */
	Y.extend = function(tag, src, ov){
		if(!tag || !src){return false;}
		ov = ov!=undefined ? ov : false;
		for(var att in src){
			if(ov || !(att in tag)){
				tag[att] = src[att];
			}
		}
		return tag;
	};
	
	/**
	 * trans collection to array
	 * @param {Object} coll, dom collection
	 */
	Y.toArray = function(coll){
		 if(coll.item){
            var l = coll.length, arr = new Array(l);
            while (l--) arr[l] = coll[l];
            return arr;
        }
	};
	
	/**
	 * element prototype
	 * suply some dom object operate methods
	 */
	Y.element = {
		/**
		 * add object class
		 * @param object cls, css class
		 */
		addClass: function(cls){
			this.className += !this.existClass(cls) ? (' ' + cls) : '';
			return this;
		},
		
		/**
		 * remove object class
		 * @param object cls
		 */
		removeClass: function(cls){
			this.className = this.className.replace(new RegExp("\\b" + cls + "\\b\\s*", "g"), "");
			return this;
		},
		
		/**
		 * check exist element's object class
		 * @param object cls
		 */
		existClass: function(cls){
			return (' ' + this.className + ' ').indexOf(' '+cls+' ') >= 0;
		},
		
		/**
		 * toggle object class between cls1 and cls2
		 * @param object cls1
		 * @param object cls2
		 */
		toggleClass: function(cls1, cls2){
			if(this.existClass(cls1)){
				this.removeClass(cls1).addClass(cls2);
				return true;
			} else {
				this.addClass(cls1).removeClass(cls2);
				return false;
			}
		},
		
		/**
		 * set element's innerHTML
		 * @param string str
		 */
		html: function(s){
			if(s == undefined){
				return this.innerHTML;
			}
			this.innerHTML = s;
			return this;
		},
		
		/**
		 * set element's value
		 * @param string val
		 */
		val: function(v){
			if(v == undefined){
				return this.value;
			}
			
			this.value = v;
			return this;
		},
		
		/**
		 * set element's attribute
		 * @param string || object a, attribute
		 * @param string v, value
		 */
		attr: function(a, v){
			if(v == undefined && typeof(a) == 'string'){
				return this.getAttribute(a);
			} else if(typeof(a) == 'string'){
				this.setAttribute(a, v);
			} else {
				for(var i in a){
					this.setAttribute(i, a[i]);
				}
			}
			return this;
		},
		
		/**
		 * get object style
		 * @param string style_name
		 */
		getStyle: function(name){
			if(name){
				if (this.style[name]){
					return this.style[name];
				} else if(this.currentStyle){
					return this.currentStyle[name];
				} else if (D.defaultView && D.defaultView.getComputedStyle) {
					name = name.replace(/([A-Z])/g,"-$1");
					name = name.toLowerCase();
					var s = D.defaultView.getComputedStyle(this,"");
					return s && s.getPropertyValue(name);
				} else{
					return null;
				}
			}
			
			var style_data = (D.defaultView && D.defaultView.getComputedStyle(this,null)) 
				|| this.style || this.currentStyle;
			return name ? style_data[name.toLowerCase()] : style_data;
		},
		
		/**
		 * set element's style text
		 * @param string css_text
		 */
		setStyle: function(css){
			if(css == undefined){
				return this.style.cssText;
			}
			
			this.style.cssText = css;
			return this;
		},
		
		/**
		 * show object
		 */
		show: function(){
			this.style.display = 'block';
			return this;
		},
		
		/**
		 * hide object
		 */
		hide: function(){
			this.style.display = 'none';
			return this;
		},
		
		/**
		 * toggle object
		 */
		toggle: function(){
			this.style.display = this.style.display == 'none' ? '' : 'none';
			return this;
		},
		
		/**
		 * get object position
		 * return object
		 */
		getPos: function(){
			var r = {}, obj = this;
			r.x = obj.offsetLeft;
			r.y = obj.offsetTop;
			while(obj = obj.offsetParent) {
				r.x += obj.offsetLeft;
				r.y += obj.offsetTop;
			}
			return r;
		},
		
		/**
		 * get object size
		 * @return object
		 */
		getSize: function(){
			//这里tmp_s 不能直接取this.getStyle();IE6！
			var size = {}, tmp_s = {};
			tmp_s.visibility = this.getStyle('visibility');
			tmp_s.display = this.getStyle('display');
			tmp_s.position = this.getStyle('position');
			if(tmp_s.display && tmp_s.display != 'none'){
				size.w = this.offsetWidth || tmp_s.width;
				size.h = this.offsetHeight || tmp_s.height;
			} else {
				this.style.visibility = 'hidden';
				this.style.position = 'absolute';
				this.style.display = 'block';
				size.w = this.offsetWidth;
				size.h = this.offsetHeight;
				this.style.visibility = tmp_s.visibility;
				this.style.display = 'none';
				this.style.position = tmp_s.position;
			}
			return size;
		},
		
		/**
		 * create child node
		 * @param string tp node type
		 * @param integer pos position(0,...-1)
		 * @return object node
		 */
		create: function(tp, pos){
			pos = pos == undefined ? -1 : parseInt(pos,10);
			var n = typeof(tp) == 'string' ? D.createElement(tp) : tp;
			pos == -1 ? this.appendChild(n) : this.insertBefore(n, this.childNodes[pos]);
			return Y.getEl(n);
		},
		
		/**
		 * clone node
		 * @param boolean dep use deep clone
		 * @return object
		 */
		clone: function(dep){
			return Y.getEl(this.cloneNode(dep));
		},
		
		/**
		 * get parent node
		 */
		parent: function(tag){
			if(!tag){ return Y.getEl(this.parentNode);}
			p = tag.parentNode;
			while(p && p.tagName != tag){p = p.parentNode;}
			return p.tagName == tag ? p : null;
		},

		/**
		 * scale object by fix radio given in height & width
		 * @param object h height
		 * @param object w width
		 */
		scale: function(h, w){
			if(!h || !w){ return false;}
			var w_r = w / this.offsetWidth;
			var h_r = h / this.offsetHeight;
			
			w_r>h_r ? (this.style.height=h_r * this.offsetHeight + 'px') : 
				(this.style.width=w_r*this.offsetWidth+'px');
			return this;
		},
		
		/**
		 * add event to an object
		 * @param string e
		 * @param function fn
		 * @param boolean cap, useCapture
		 */
		addEvent: function(e, fn, cap, scope){
			cap = cap == undefined ? true : cap;
			scope && (this.scope=scope);
			Y.ua.ie ? this.attachEvent(['on'+e], fn)
				:this.addEventListener(e, fn, cap);
			return this;
		},
		
		/**
		 * remove event from an object
		 * @param string e
		 * @param function fn
		 * @param boolean useCapture
		 */
		removeEvent: function(e, fn, useCapture){
			Y.ua.ie ? this.dettachEvent('on'+e, fn)
				:this.removeEventListener(e, fn, useCapture);
		},
		
		/**
		 * stop event propagation
		 * @param object event
		 */
		stopEvent: function(e){
			e = e || W.event;
			if(e.stopPropagation){
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
		},
		
		/**
		 * get children nodes
		 * exclude empty text node
		 */
		getChildren: function(idx){
			var nodes = [], cns=this.childNodes;
		    for (var i = cns.length-1; i>=0; i--) {
		        if (cns[i].nodeName != '#text' && cns[i].nodeName != '#comment') {
		            nodes.unshift(Y.extend(cns[i], Y.element));
		        }
		    }
			return idx !== undefined ? nodes[idx] : nodes;
		},
		
		/**
		 * get element by tag name && by id
		 * current version support following format:
		 * 
			tag = [--  rule $1    --][-- rule $2 --][-- relation simbol --][-- rule $1 --]...
			tag = object + property ||   limitor           >             		non-ID
			rule $1:		#div || span.class || .class <==> *.class || *
			rule $2:		[attribute_name = value] || :first || :last
			rule$2.1: 	:input || :text || :password || :radio || :checkbox || :submit || :reset
		 * @param object tag
		 */
		getEl: function(tag, src, cond){
			var result_lst = [],									//query result
				src = src || (this.nodeType ? this : D),		//query source element
				cond = cond || ' ';									//query condition, all elements[' '] or children['>']
			
			if(typeof(tag) !== 'string'){
				return Y.extend(tag, Y.element);
			}
			
			if(tag == 'body' || tag == 'head' || tag == 'html'){
				return Y.extend(D.getElementsByTagName(tag)[0], Y.element);
			}
			
			//clean tags
			//etc:' #container  div.entry > h2 ' => '#container div.entry>h2'
			var _tag = tag.replace(/(^\s*)|(\s*$)/g, '').replace(/\s+/ig, ' ').replace(/\s*\>\s*/ig, '>');
			
			//divide sub models
			//etc:'#container div.entry>h2' => ['#container', ' ', 'div.entry', '>', 'h2']
			matches = _tag.match(/([^\s|^\>]+)|([\s|\>]+)/ig);

			//ID match
			if(matches.length == 1 && matches[0].charAt(0) == '#'){
				return Y.extend(D.getElementById(matches[0].substring(1)), Y.element);
			}
			
			//single model match
			else if(matches.length == 1){
				var src_lst = src.nodeType ? [src] : src;
				
				var tmp = tmp2 = [],
					node_tags = matches[0].match(/^\w+/ig);
					node_tag = node_tags ? node_tags[0] : null;
				
				for (var i = 0; i < src_lst.length; i++) {
					var sub_result_lst = [];
					
					//down level children relationship
					if(cond == '>'){
						Y.each(src_lst[i].getChildren(), function(node){
							node_tag? (node.nodeName.toLowerCase() == node_tag && sub_result_lst.push(node)): sub_result_lst.push(node);
						});
					}
					
					//all level children relationship
					else {
						//tag specified || get all children
						sub_result_lst = node_tag ? Y.toArray(src_lst[i].getElementsByTagName(node_tag))
							:sub_result_lst = sub_result_lst.concat(Y.toArray(src_lst[i].getElementsByTagName('*')));
					}
	
					//class filter
					if (tmp = matches[0].match(/\.([A-Za-z0-9_-]+)/i)) {
						tmp2 = [];
						Y.each(sub_result_lst, function(itm, idx){('  '+itm.className+' ').indexOf(' '+tmp[1]+' ') > 0 && tmp2.push(itm);});
						sub_result_lst = tmp2;
					}
					
					//attribute filter [attribute_name=attribute_value] 
					if (att = matches[0].match(/\[(.*?)\=(.*?)\]/i)) {
						tmp2 = [];
						Y.each(sub_result_lst, function(itm){(itm.getAttribute(att[1])==(att[2].replace(/\'/ig,''))) && tmp2.push(itm);});
						sub_result_lst = tmp2;
					}
					
					//pseudo matches:text,textarea,radio,checkbox,password,submit,reset
					//equate to E[type = *]
					if(pseudo = matches[0].match(/\:(text|textarea|radio|checkbox|password|submit|reset)/i)){
						tmp2 = [];
						Y.each(sub_result_lst, function(itm){(itm.type == pseudo[1]) && tmp2.push(itm);});
						sub_result_lst = tmp2;
						sub_result_lst = tmp2;
					}
					result_lst = result_lst.concat(sub_result_lst);
				}
				
				//*pseudo matches :first, :last, :even, :odd
				if(pseudo = matches[0].match(/\:(first|last|even|odd)/i)){
					switch(pseudo[1]){
						case 'first':
							result_lst = result_lst[0];
							break;
						case 'last':
							result_lst = result_lst.pop();
							break;
						case 'even':
							tmp2 = [];
							Y.each(result_lst, function(itm, idx){idx%2 && tmp2.push(itm);});
							result_lst = tmp2;
							break;
						case 'odd':
							tmp2 = [];
							Y.each(result_lst, function(itm, idx){idx%2 || tmp2.push(itm);});
							result_lst = tmp2;
							break;
					}
				}
			}
			
			//multiple patterns
			else {
				//console.log('matches',matches);
				
				//previous condition
				//ENUM in ' ' and '>'
				//#container, ' ', 'div.entry', '>', 'h2']
				for(var i=0; i<matches.length; i++){
					if(matches[i] != ' ' && matches[i] != '>'){
						if(i == 0){
							var _m = matches;
							result_lst = this.getEl(matches[i]);
							matches = _m;
							//console.log(matches, result_lst);
						} else {
							//console.log('后续检查', result_lst);
							if(!result_lst){ return null;}
							var _m = matches;
							result_lst = this.getEl(matches[i], result_lst, matches[i-1]);
							matches = _m;
						}
					}
				}
			}
			//console.log('result_lst',result_lst);
			if(result_lst && result_lst.nodeType){
				return Y.extend(result_lst, Y.element);
			} else if(!result_lst || result_lst.length == 0) {
				return null;
			} else {
				return Y.each(result_lst, function(item, idx){result_lst[idx] = Y.extend(item, Y.element);});
			}
		}
	};

	/**
	 * get element by tag name && by id
	 * @param object tag
	 */
	Y.getEl = function(tag){
		return Y.element.getEl(tag);
	};
	
	/**
	 * add style sheet to head
	 * @param string s
	 * @param string id
	 */
	Y.addStyleSheet = function(s, id){
		var ele = Y.getEl(id) || Y.getEl('head').create('style');
		id && ele.attr('id', id);
		
		if(ele.styleSheet){
			ele.styleSheet.cssText = s;
		} else {
			ele.appendChild(D.createTextNode(s));
		}
		return ele;
	};
	
	/**
	 * get window geometry
	 * 获取window的相关信息：
	 * win_x/win_y: 网页正文距离窗口距离
	 * view_w/view_h: 网页未滚动可视尺寸
	 * h_scroll/v_scroll: 网页已经距离上/左侧的滚动距离
	 * doc_w/doc_h: 网页整体尺寸（即：body背景色填充尺寸）
	 */	
	Y.getWinInfo = function(){
		var info = {};
		info.win_x = W.screenLeft ? W.screenLeft : W.screenX;
		info.win_y = W.screenTop ? W.screenTop : W.screenY;
		
		//no ie
		if(W.innerWidth){
			info.view_w = W.innerWidth;
			info.view_h = W.innerHeight;
			info.h_scroll = W.pageXOffset;
			info.v_scroll = W.pageYOffset;
		} 
		
		else {
			//IE + DOCTYPE defined || IE4, IE5, IE6+no DOCTYPE
			var tag = (D.documentElement && D.documentElement.clientWidth) ? 
				D.documentElement : D.body;
			info.view_w = tag.clientWidth;
			info.view_h = tag.clientHeight;
			info.h_scroll = tag.scrollLeft;
			info.v_scroll = tag.scrollTop;
		}
		
		var tag = (D.documentElement && D.documentElement.scrollWidth) ? 
				D.documentElement : D.body;
		info.doc_w = Math.max(tag.scrollWidth, info.view_w);
		info.doc_h = Math.max(tag.scrollHeight, info.view_h);
		return info;
	};
	
	/**
	 * date operate functions
	 */
	Y.date = {
		/**
		 * parse date string to YS.date object
		 * @param object tag
		 */
		parse: function(tag){
			var res = data = {}, def = {Y:0,m:1,d:1,H:0,i:0,s:0};
			
			if(typeof(tag) != 'string'){
				return Y.extend(tag, def);
			}
			
			tag = tag.replace(/(^\s*)|(\s*$)/g, '');
			
			//2010*8*20 23*59*59 233
			//2010*8*20 23*59*59
			if(res = tag.match(/(\d{4})\D*(\d{1,2})\D*(\d{1,2})\s*(\d{1,2})\D*(\d{1,2})\D*(\d{1,2})/)){
				data = {Y:res[1],m:res[2],d:res[3],H:res[4],i:res[5],s:res[6]};
			}
			
			//2010*8*20
			//2008/01/12
			else if(res = tag.match(/(\d{4})\D*(\d{1,2})\D*(\d{1,2})/)){
				data = {Y:res[1],m:res[2],d:res[3]};
			}
			
			//20*02*2003* 23*59*59
			else if(res = tag.match(/(\d{1,2})\D*(\d{1,2})\D*(\d{4})\s*(\d{1,2})\D*(\d{1,2})\D*(\d{1,2})/)){
				data = {Y:res[3], m:res[1], d:res[2], H:res[4], i:res[5], s:res[6]};
			}
			
			//parse error
			else {
				return null;
			}
			
			data = Y.extend(data, def);
			Y.each(data, function(item, i){data[i] =  parseInt(item, 10);});
			return data;
		},
		
		/**
		 * get today date object
		 */
		today: function(){
			var D = new Date();
			return {
				Y:D.getFullYear(),
				m:D.getMonth()+1,
				d:D.getDate(),
				H:D.getHours(),
				i:D.getMinutes(),
				s:D.getSeconds()
			};
		},
		
		/**
		 * get offset between end_date and start_date(or today)
		 * @param {Object} end_date
		 * @param {Object} start_date or today
		 * @return {Object}
		 */
		offset: function(end_date, start_date){
			start_date = start_date || this.today();
			d2 = this.parse(end_date);
			d1 = this.parse(start_date);
			
			var s_d = new Date(d1.Y, d1.m-1, d1.d, d1.H, d1.i, d1.s),
				e_d = new Date(d2.Y, d2.m-1, d2.d, d2.H, d2.i, d2.s),
				RT = {};
			var offset = (e_d.getTime() - s_d.getTime());
			if(offset < 0){
				return {Y:0,m:0,d:0,H:0,i:0,s:0};
			}
			RT.Y = Math.floor(offset/(86400*365000));
			RT.m = Math.floor((offset - 86400*365000*RT.Y)/(86400*30000));
			RT.d = Math.floor((offset - 86400*365000*RT.Y - 86400*30000*RT.m)/(86400000));
			RT.H = Math.floor((offset - 86400*365000*RT.Y - 86400*30000*RT.m - 86400000*RT.d)/(3600000));
			RT.i = Math.floor((offset - 86400*365000*RT.Y - 86400*30000*RT.m - 86400000*RT.d - 3600000*RT.H)/(60000));
			RT.s = Math.floor((offset - 86400*365000*RT.Y - 86400*30000*RT.m - 86400000*RT.d - 3600000*RT.H - RT.i*60000)/1000);
			return RT;
		}
	};
	
	/**
	 * Array each loop call
	 * @param array arr
	 * @param object call
	 */
	Y.each = function(arr, call){
		if(!arr || !arr.length){return null;}
		for(var i=0; i<arr.length; i++){
			void function(){
				var idx = i;
				call(arr[idx], idx);
			}();
		}
		return arr;
	};
	
	/**
	 * bind function
	 * @param object fn
	 * @param object obj
	 */
	Y.bind = function(fn, obj){
		var method = fn;
		return function(){
			method.apply(obj, arguments);
		};
	};
	
	/**
	 * write html code
	 * @param string code
	 */
	Y.write = function(code){
		D.writeln(code);
		return this;
	};
	
	/**
	 * DOM ready state changed caller
	 * @param function fn
	 */
	Y.ready = function(fn){
		this._rc_lst = this._rc_lst || [];
		this._rc_lst.push(fn);
		if(!this.ua.ie){
			Y.addEvent('DOMContentLoaded', function(){
				D.removeEventListener('DOMContentLoaded', arguments.callee, false);
				Y.each(Y._rc_lst, function(itm){itm();});
				Y._rc_lst.length = 0;
			}, false);
		} else if(D.getElementById){
			if(!D.getElementById('ie-domReady')){
				D.write('<script id="ie-domReady" defer="defer" src="//:"><\/script>');	
			}
			D.getElementById('ie-domReady').onreadystatechange = function(){
				if(this.readyState === 'complete') {
			        Y.each(Y._rc_lst, function(itm){itm();});
					Y._rc_lst.length = 0;
			        this.onreadystatechange = null;
			        this.parentNode.removeChild(this);
			    }
			};
		}
	};
	
	/**
	 * tab select function
	 * @param object tb, tab object
	 * @param object ctn, content object
	 * @param object e, active event
	 * @param object cls, css class name
	 */
	Y.tab = function(tb, ctn, e, cls){
		var tbs = this.getEl(tb) && this.getEl(tb).getChildren(),
			ctns = this.getEl(ctn) && this.getEl(ctn).getChildren(),
			e = e ? e : 'mouseover',
			cls = cls ? cls : 'current';
		Y.each(tbs,
			function(obj, idx){
				obj.addEvent(e, function(){
					Y.each(tbs, function(obj, j){j == idx ? obj.addClass(cls) : obj.removeClass(cls);});
					Y.each(ctns,function(obj, j){j == idx ? obj.addClass(cls) : obj.removeClass(cls);});
				});
			}
		);
	};
	
	/**
	 * slide
	 * @param object ctrl
	 * @param object ctn
	 * @param object cfg
	 */
	Y.slide = function(ctrl, ctn, cfg){
		var ctn_lst = Y.getEl(ctn).getChildren();
		if(ctn_lst.length < 2){
			return false;
		}
		var ctrl_lst = Y.getEl(ctrl).getChildren(),
			from_idx = 1,
			tag_idx = 2,
			timer = null,
			cfg = cfg || {},
			def_cfg = {animate: false,pause_time: 2000,cur_cls:'current'};
		cfg = Y.extend(cfg, def_cfg);
		
		//显示第tag_idx[1~len]个
		var static_handler = function(){
			Y.each(ctn_lst, function(itm){itm.removeClass(cfg.cur_cls);});
			Y.each(ctrl_lst, function(itm){itm.removeClass(cfg.cur_cls);});
			ctn_lst[tag_idx-1].addClass(cfg.cur_cls);
			ctrl_lst[tag_idx-1].addClass(cfg.cur_cls);
			cur_idx = tag_idx;
			tag_idx = (tag_idx==ctn_lst.length) ? 1 : (tag_idx+1);
		};
		
		//开始动作
		var start = function(){
			timer = cfg.animate ? setInterval(animate_handler, cfg.pause_time,0) : 
				setInterval(static_handler, cfg.pause_time, 0);
		};
		
		//暂停动作
		var pause = function(){clearInterval(timer);};
		
		//监听mouse动作执行停止或者开始
		void function(){
			Y.each(ctrl_lst,function(item, idx){
				item.addEvent('mouseover', function(){tag_idx = (parseInt(idx, 10)+1); static_handler(); pause();});
			});
			Y.each(ctrl_lst, function(item){item.addEvent('mouseout', function(){start();});});
		}();
		start();
	};
	
	/**
	 * slash window effect
	 * @param mix tag target DOM
	 * @param object cfg slash config, more detail please read following code
	 * @return null
	 */
	Y.slash = function(tag, cfg){
		tag = Y.getEl(tag);
		
		//store last slash object
		if(tag){
			W['_slash_tag_'] = tag;
		}
		
		cfg = Y.extend(cfg || {},{
			msk_id:'ys-slash-mask',
			msk_iframe_id:'ys-slash-mask-iframe',
			con_id:'ys-slash-container',
			ctn_id:'ys-slash-ctn',
			hd_id:'ys-slash-hd',
			style_id:'slash-style',
			c_btn_id:'ys-slash-close-btn',
			clone:true,
			mv:false,
			w: (tag && tag.getSize().w) || 200,
			h: (tag && tag.getSize().h) || 200
		});
		var msk = Y.getEl('#'+cfg.msk_id);
		
		if(!tag){msk && msk.hide();W['_slash_tag_'] && W['_slash_tag_'].hide();return true;}
		
		if(!Y.getEl('#'+cfg.style_id)){
			var style = 
				'.' + cfg.msk_id + '{background-color:black; z-index:997; top:0; left:0; width:100%; opacity:0.4; position:fixed !important; position:absolute; filter:Alpha(opacity=40);}'
				+ '.' + cfg.msk_iframe_id + ' {position:absolute;z-index:998;width:100%;height:100%;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)}'
				+ '.' + cfg.hd_id + '{-moz-user-select:-moz-none; height:28px; line-height:28px; padding-left:5px; font-weight:bolder; overflow:hidden; color:white; background:url("template/default/img/slash_bg.png") repeat-x 0 0;' +(cfg.move ? ' cursor:move;' : '')+'}'
				+ '.' + cfg.con_id + '{z-index:999; position:absolute; left:50%; top:50%; border:1px solid #6b97c1 ; visibility:visible;}'
				+ '.' + cfg.c_btn_id + '{float:right; width:34px; height:19px; display:block; margin-right:2px; *margin-top:-28px; float:right; background:url("template/default/img/slash_bg.png") no-repeat 0 -30px}'
				+ '.' + cfg.c_btn_id + ':hover{background-position:-36px -30px}'
				+ '.' + cfg.ctn_id + '{padding:10px; background-color:white;}';
			Y.addStyleSheet(style, cfg.style_id);
		}
		if(!msk){
			msk = Y.getEl('body').create('div').attr('id', cfg.msk_id).attr('class', cfg.msk_id);
			iframe = msk.create('iframe').attr('id', cfg.msk_iframe_id).attr('class', cfg.msk_iframe_id);
			msk.setStyle('');
		}
		msk.style.height = Y.ua.ie6 ? Y.getWinInfo().doc_h+'px':'100%';
		msk.show();
		
		//clone mode
		if(cfg.clone){
			con = Y.getEl('#'+cfg.con_id) || Y.getEl('body').create('div').attr('id',cfg.con_id).attr('class',cfg.con_id);
			con.show().html('<div id="'+cfg.hd_id+'" class="'+cfg.hd_id+'" onselectstart="return false">'+(cfg.title || '')+'<a href="javascript:void(0);" id="'+cfg.c_btn_id+'" class="'+cfg.c_btn_id+'"></a></div><div id="'+cfg.ctn_id+'" class="'+cfg.ctn_id+'"></div>').setStyle('width:'+cfg.w+'px;');
			con.style.marginLeft = '-'+(cfg.w/2)+'px';
			con.style.marginTop = (Y.getWinInfo().v_scroll - cfg.h/2)+'px';
			W['_slash_tag_'] = con;
			
			//IE6有问题 
			//Y.getEl('#'+cfg.ctn_id).appendChild(tag.clone(true).show());
			Y.getEl('#'+cfg.ctn_id).html(tag.html());
			Y.getEl('#'+cfg.c_btn_id).onclick = function(){msk.hide();con.hide();};
		}
		
		//other mode
		else {
			tag.show().style.cssText = 'margin-left:-'+(cfg.w/2)+'px; margin-top:' + 
				(Y.getWinInfo().v_scroll - cfg.h/2)+'px; display:block; position:absolute;z-index:1000; left:50%; top:50%; visibility:visible;';
		}
		
		//moveable
		if(cfg.mv && cfg.clone){
			var h = Y.getEl('#'+cfg.hd_id);
			h.onmousedown = function(e){
				var e = e || W.event;
				con.moving = false;
				if((Y.ua.ie && (e.button == 1 || e.button == 0)) || 
					e.button == 0){
					con.moving = true;
				}
				if(con.moving && (e.button == 1 || e.button == 0)){
					px = parseInt(e.clientX - con.offsetLeft - cfg.w/2);
					py = parseInt(e.clientY - con.offsetTop - cfg.h/2 + Y.getWinInfo().v_scroll);
					h.onmousemove = function(e2){
						e2 = e2 || W.event;
						var x = e2.clientX - px,
							y = e2.clientY - py;
						con.style.left = x + 'px';
						con.style.top = y + 'px';
					};
				}
			};
			h.onmouseout = function(){
				con.moving = false;
				this.onmousemove = null;
			};
			h.onmouseup = function(){
				con.moving = false;
				this.onmousemove = null;
			};
		}
	};

	/**
	 * ajax function
	 * _ajax_cache_data : ajax cache data store here
	 * config parameter setting:
	 * @param string cfg.url, request url
	 * @param boolean cfg.syn, use synchronize method
	 * @param string cfg.method, request method(GET,POST), default for GET
	 * @param string cfg.format, result format(xml, json, javascript, text), default for text
	 * @param string cfg.charset, request charset, default for utf-8
	 * @param boolean cfg.set_cache, default for use cache
	 * @param string cfg.param, post parameter data
	 * @param function cfg.init, initialize handle function
	 * @param function cfg.result, result handle function
	 * @param function cfg.error, error handle function
	 * @param function cfg.ready, ajax ready state handle function
	 * @param function cfg.loading, ajax loading data status handle function 
	 */
	Y._ac_d = {};
	Y.ajax = function(cfg){
		var def_cfg = {url:'', syn: false, method: 'GET', format: 'text', charset: 'utf-8',set_cache:false, param:null, 
			init:function(){}, result:function(){}, error:function(){}, ready:function(){}, loading:function(){}
		}, xml;
		cfg = Y.extend(cfg, def_cfg);
		var hdl = function(ret){
			var data = null;
			switch(cfg.format){
				case 'json' || 'javascript':
					ret.responseText.length>1 && eval('data = ' + ret.responseText);
					break;
				case 'xml':
					data = ret.responseXML;
					break;
				case 'bool':
					data = /yes|true|y/ig.test(ret.responseText)? true : false;
					break;
				default:
					data = ret.responseText;
			}
			Y._ac_d.url = data;
			cfg.result(data);
			ret = null;
			return data;
		};
		
		//check AJAX data cache
		if(cfg.set_cache && Y._ac_d.url){
			return Y._ac_d.url;
		}
		
		//initialize XMLHttpRequest object
		if (W.XMLHttpRequest) {
			xml = new XMLHttpRequest();
			xml.overrideMimeType && xml.overrideMimeType('text/xml');
        } else {
			if (W.ActiveXObject) {xml = new ActiveXObject('Msxml2.XMLHTTP') || new ActiveXObject('Microsoft.XMLHTTP');}
			else {alert('browser no support ajax');}
        }
		
		//bind ready state change event
        xml.onreadystatechange = function(){
			if(xml.readyState == 4) {
				xml.status == 200 ? hdl(xml) : cfg.error(xml.status);
	        } else {
				cfg.init(xml.readyState);
				xml.readyState==0 ? cfg.ready() : cfg.loading();
	        }
		};
		
		//open, set header & send
		xml.open(cfg.method, cfg.url, !cfg.syn);
		(cfg.format == 'xml') ? xml.setRequestHeader('Content-Type', 'text/xml;'):
			xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset='+cfg.charset);
		cfg.method == 'GET' && (param = null);
		xml.send(param);
		
		//syn handle
		if(cfg.syn && xml && xml.status == 200){
			return hdl(xml);
		}
	};
	
	Y.getJSON = function(url, fn){
		var c = 'ys_cross_' + parseInt(Math.random()*1000);
		var script = D.createElement('script');
		var done = false;
		script.onload = script.onreadystatechange = function(){
			if(!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')){
				done = true;
				
				script.onload = script.onreadystatechange = null;
				if(head && script.parentNode){
					head.removeChild(script);
				}
			}
		};
		Y.getEl('script:first').create(script,0);
	};
	
	/**
	 * include javascript
	 * @param string file
	 * @param function fn, handler
	 */
	Y.include = function(file, fn){
	    var head = Y.getEl('head'),
			js = D.createElement('script');
			fn = fn || function(){};
	    js.setAttribute('type', 'text/javascript');
	    js.setAttribute('src', file);
	    if (!Y.ua.ie) {
	        js.onload = fn;
	    } else {
	        js.onreadystatechange = function () {
	            if (js.readyState == 'loaded' || js.readyState == 'complete') {
					fn();
				}
	        };
	    }
	    head.appendChild(js);
	    return this;
	};
	
	/**
	 * select checkbox
	 * @param string tp select type: all, none, inv
	 * @param mix tag
	 */
	Y.select = function(tp, tag){
		var tag = Y.getEl(tag) || YS.getEl(D);
		var chks = tag.getEl('input:checkbox');
		Y.each(chks, function(chk){
			chk.checked = tp=='all'?true:(tp =='none'?false:!chk.checked);
		});
	};
	
	/**
	 * add site to bookmark
	 * @param string url
	 * @param string title
	 */
	Y.addFav = function(url, title){
		url = url || W.location.href;
		title = title || D.title;
		return W.sidebar ? W.sidebar.addPanel(title,url,'') : 
		(Y.ua.ie ? W.external.AddFavorite(url, title) : false);
	};
	
	/**
	 * set current page homepage
	 * @param string url
	 */
	Y.setHome = function(url){
		url = url || W.location.href;
	    try {
	        W.style.behavior = 'url(#default#homepage)';
	        W.setHomePage(url);
	    } catch (e) {
	        if (W.netscape) {
	            try {
	                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	            } catch (e) {
	                alert("操作失败！");
	            }
	            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	            prefs.setCharPref('browser.startup.homepage', url);
	        }
	    }
	};
	
	/**
	 * cookie object
	 * @param object key
	 * @param object val, value
	 * @param object h, hours
	 */
	Y.cookie = {
		create: function(key, val, h){
			if (h) {
		        var date = new Date();
		        date.setTime(date.getTime() + (h * 60 * 60 * 1000));
		        var expires = "; expires=" + date.toGMTString();
		    } else {
		    	var expires = '';
		    }
		    D.cookie = key + "=" + val + expires + "; path=/";
		},
		
		read: function(key){
			var n = key + '=';
			var ca = D.cookie.split(';');
		    for (var i = 0; i < ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0) == ' '){
		        	c = c.substring(1, c.length);
		        }
		        if (c.indexOf(n) == 0) {
		        	return c.substring(n.length, c.length);
		        }
		    }
		    return null;
		},
		
		remove: function(key){
			this.create(key, '', -1);
		}
	};
	

	/**
	 * text slide
	 */
	Y.textSlide = function(tag, cfg) {
		var tag = YS.getEl(tag);
		var nodes = tag.getChildren();
		var n = nodes.length,
			sc_h = tag.offsetHeight,
			int_tms = [],
			def_cfg = {interval:2500, speed:20},
			cfg = cfg || {};
		var cfg = YS.extend(def_cfg, cfg);

		var init = function() {
			YS.each(nodes, function(node){
				node.style.display = 'block';
				node.style.height = sc_h + 'px';
			});
			tag.create(nodes[0].clone(true));
			interval();
		};
		
		var interval = function(){int_tms[0] = setTimeout(start, cfg.interval);};
	 
		var start = function() {
			if (tag.scrollTop / sc_h == n) {
				tag.scrollTop = 0;
			}
			clearInterval(int_tms[1]);
			int_tms[1] = setInterval(scroll, cfg.speed);
		};
	 
		var scroll = function() {
			tag.scrollTop++;
			if (tag.scrollTop % sc_h == 0) {
				clearInterval(int_tms[1]);
				interval();
			}
		};

		tag.onmouseover = function() {clearInterval(int_tms[0]);};
		tag.onmouseout = function() {interval();};
		init();
	};

	/**
	 * namespace protected mode
	 * if window.YS is used by other statement,
	 * use YoushangJSF(abbreviate from youshang javascript framework)
	 * thanks & have a nice day :)
	 */
	if(W.YS == undefined){
		W.YS = Y;
	}
	W.YoushangJSF = Y;
})();