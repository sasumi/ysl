(function(v) {
	/**
	 * define a popup dialog class;
	 */
	var timer;
	v.Class('ve.ui.Resizable', {
		Resizable: function(el, conf) {
			this.el = el;
			this.conf = conf;
			this.ss = dom.selector('.ve_resize', el);
			this.init();
		},
		
		init: function() {
			var _down, _move, _up, isdown;
			_down = function(e) {
			};
			ve.each(this.ss, function(n) {
				dom.event.add(n, 'mousedown', _down);
				dom.event.add(n, 'mousemove', _move);
				dom.event.add(n, 'mouseup', _up);
			});
		}
	});

	v.Class('ve.ui.DefPopupDialog', {
		DefPopupDialog: function (instance, ed, s) {
			var t = this;
			t.editor = ed;
			t.instance = instance;
			t.conf = ve.extend({
				title: 'OK。。。',
				resizable: 1,
				width: 600,
				height: 400
			}, s || {});
		},

		init: function (ed, s) {},

		open: function (s) {
			var t = this, dom = ve.DOM;
			s = ve.extend(t.conf, s);
			return t._renderDOM(s);
		},

		close: function () {
			this.instance.close();
		},

		_renderDOM: function (s) {
			var t = this, str, attrs, id, bodysize, isIE6 = ve.isIE6;
			s = ve.extend(s || {}, t.conf);
			id = 'qzonePopupDialog';
			bodysize = dom.getSize(dom.doc.documentElement);
			attrs = {
				'class': 'popupdialogcon', 
				'id': id,
				style: ve.extend({position: isIE6 && 'absolute' || 'fixed', left: 0.5 * (bodysize[0] - s.width), top: (isIE6 && document.documentElement.scrollTop || 0) + 0.5 * (document.documentElement.clientHeight - s.height)}, s)
			};
			var ihtml = '<h3><span class="txt_con">' + (s.title || '') + '</span><a class="close_icon" href="#" onclick="return false;"></a></h3>'
			+	'<div class="iframe_con" style="width: ' + (s.width - 10 )+ 'px;height:' + (s.height - 20) + 'px;"><iframe src="' + s.src + '" frameborder="0" allowtransparency="1" width="100%" height="' + (s.height - 30) + '"></iframe></div>';
			if (s.resizable) {
				ve.each('N|S|W|E|NE|NW|SW|SE'.split('|'), function(n) {
					ihtml += '<a class="ve_resize resize' + n + '" href="javascript:;"></a>';
				});
				
			}
			var popup = dom.create('div', attrs, ihtml);
			
			document.body.appendChild(popup)
			dom.find('#' + id + ' a.close_icon').onClick(function (e) {
				t.close();
				dom.event.preventDefault(e);
			});
			function _set() {
				dom.setStyles(popup, {
					top:  (isIE6 && document.documentElement.scrollTop || 0) + 0.5 * (document.documentElement.clientHeight - s.height),
					left: 0.5 * (document.documentElement.clientWidth - s.width)
				})
			};
			dom.event.add(window, 'resize', _set);
			dom.drag(dom.selector('h3')[0], popup);
//			new ve.ui.Resizable(popup);
			return popup;
		}
	});
	// regist popupdialog class
	ve.ui.PopupDialogManager.register('def', 've.ui.DefPopupDialog'); 

	v.Class('ve.ui.SimplePopup', {
		SimplePopup: function (ed, el, s) {
			var t = this;
			this.editor = ed;
			this.el = el;
			this.conf = ve.extend({
				src: '',
				content: '',
				width: 300,
				canClose: true,
				height: 200
			}, s || {});
			this.d = this._renderDOM();
			//this.onShow = new ve.dom.EventManager();
//			ed.onClick.add(function() {
//				t.hide();
//			});
			
//			var clearTimer = function(e) {
//				debugger;
//				clearTimeout(timer)
//				dom.event.cancelBubble(e);
//			};
//			dom.event.add(popup, 'click', clearTimer);
//			dom.event.add(this.el, 'click', clearTimer);
//			dom.event.add(document.body, 'click', function(e) {
//				if (t.el == (e.target || e.srcElement))
//					return;
//				t.hide();
//			});
		},

		/**
		 *  显示popup
		 * @param {Object} s 样式配置
		 */
		show: function(s) {
			if(s){
				dom.setStyles(this.d, s);
			}
			this.d.style.display = 'block';
		},

		/**
		 * 隐藏popup
		 */
		hide: function () {
			this.d.style.display = 'none';
		},
		
		/**
		 * 获取当前popup DOM
		 */
		getDOM: function(){
			return this.d;
		},

		/**
		 * 渲染DOM结构
		 * @param {Object} s
		 */
		_renderDOM: function (s) {
			var t = this, str, attrs, id, bodysize, isIE6 = ve.isIE6, html;
			var top = 0; left = 0;
			if(t.el){
				elpos = dom.getXY(t.el);
				elsize = dom.getSize(t.el);
				top = elpos[1] + elsize[1];
				left = elpos[0];
			}
			
			s = ve.extend(s || {}, t.conf);
			id = 'qzonesimplepopup';
			
			attrs = {
				'class': 'simplepopupcon', 
				'id': id,
				style: ve.extend({position: 'absolute', left:left, top:top, display:'none'}, s)
			};
			if (t.conf.canClose) {
				html = '<div class="close_con"><a href="#" class="close_icon">×</a></div>';
			}
			if (t.conf.src) {
				html += '<div class="iframe_con"><iframe src="' + t.conf.src + '" width="' + t.conf.width + '" height="' + t.conf.height + '" frameborder="0"></iframe></div>';
			}
			else if (t.conf.content){
				html += '<div class="content_con">' + t.conf.content + '</div>';
			}			
			var popup = dom.create('div', attrs, html);
			dom.event.add(popup, 'click', function(e) {
				dom.event.cancel(e);
			});
			document.body.appendChild(popup)
			dom.find('#' + id + ' a.close_icon').onClick(function (e) {
				t.hide();
				dom.event.preventDefault(e);
			});
			dom.event.add(document.body,'keydown', function(e){
				var e = e || window.event;
				if(e.keyCode == 0x1B){
					t.hide();
					dom.event.preventDefault(e);
				}
			});
			return popup;
		}
	});

	ve.ui.showSimplePopup = function(ed, el, conf) {
		var p = new ve.ui.SimplePopup(ed, el, conf);
		return p;
	}
}) (ve);

(function(v) {
	v.Class('ve.ui.Animate', {
		Animate: function(o) {
			var ss, es, e, arg = o;
			if (!o.obj || !(e = $(o.obj))) return;
			o.time = o.time || 1;
			o.step = o.step || 10;
			var pixelStyles = /top|left|bottom|right|width|height/;
			var cssre = /([A-Z])/g;
			var getcssv = function(e, s) {
				var dv = document.defaultView || {}, ret;
				
				if (dv.getComputedStyle) {
					s = s.toLowerCase().replace(cssre, '-$1');
					var computedstyle = dv.getComputedStyle(e, null);
					ret = computedstyle.getPropertyValue(s);
				}
				else {
					ret = e.currentStyle [s] || e.currentStyle[ s.replace(/\-(\w)/g, function(_0, _1) {
						return _1.toUpperCase();
					}) ];
				}
				return ret;
			};
			var tostr = function(styles) {
				var a = [];
				for (var i in styles) {
					var ki = i.replace(cssre, '-$1').toLowerCase();
					if (pixelStyles.test(i))
						a.push(ki + ':' + parseInt(styles[i]) + 'px');
					else 
						a.push(ki + ':' + styles[i]);
				}
				return a.join(';') + ';';
			};
			o.running = o.running || function() {};
			o.complete = o.complete || function() {};
			var re = /((?:\w|\w\-\w)+)\s*\:\s*([^(?:;|$)]+)/gi, rfn, dss;
			if (typeof o.expr == 'string') {
				var arexp = o.expr.replace(/\s+|;\s*$/g, '').split(';');
				var expre = /(\w*(?!(?:\-\w*))?)\s*(?:(\[|[\+\-\*\/]\=|\[\-))?\s*([^(?:;\s*|$|\])]*)/, exps, os = {}, oe = {}, tm, mtime = 1000, mstep = 1000, condition = '';
				for (var i = 0; i < arexp.length; i++) {
					exps = arexp[i].match(expre);
					switch(exps[2]) {
						case '[': 
							if ((tm = exps[3].match(/^((?:\-|\w)[^\-]*)(?:\-)(.*)/)).length == 3) {
								os[exps[1]] = tm[1];
								oe[exps[1]] = tm[2];
							}
							else if ((tm = exps[3].split(',')).length > 1) {
								os[exps[1]] = tm[0];
								oe[exps[1]] = tm[tm.length - 1];
								mstep = Math.min(mstep, tm.length);
								o.step = mstep;
								condition += 'if (w=="' + exps[1] + '") {return [' + tm + '][t];}';
								
							}
							break;
						default:
							os[exps[1]] = pixelStyles.test(exps[1]) ? getcssv(e, exps[1]) : '';
							oe[exps[1]] = pixelStyles.test(exps[1]) ? eval(parseInt(os[exps[1]]) + exps[2].charAt(0) + parseInt(exps[3]) * o.step) : '';
							condition += 'if (w=="' + exps[1] + '") return s' + exps[2] + parseInt(exps[3]) +'*t;';
							break;
					}
				}
				o.begin = os;
				o.end = oe;
				if (condition) {
					o.running = new Function('w', 's', 'e', 't', condition);
				}
			}
			if (typeof o.end == 'undefined') return;
			if (typeof o.end == 'string') 
				es = o.end;
			else if (typeof o.end == 'object') {
				es = tostr(o.end);
			}
			if (typeof o.begin == 'undefined') {
				var dv;
				
				ss = es.replace(re, function(_0, _1) {
					return _1.replace(cssre, '-$1') + ':' + (getcssv(e, _1) || ' ');
				});
			}
			else if (typeof o.begin == 'string') 
				ss = o.begin;
			else
				ss = tostr(o.begin);
			var ocss = e.style.cssText;
			rfn = function(w, s, e, t) {
				if (pixelStyles.test(w)) {
					s = parseInt(s);
					e = parseInt(e);
				}
				var r = '';
				r = o.running(w, s, e, t)
				if (typeof r != 'undefined') 
					return r;
				r = +s + t * (e - s) / Math.max(1, o.step);
				if ('opacity' == w) 
					r = +s + t * (e - s) / Math.max(1, o.step);
				if ('left' == w || 'top' == w || 'z-index' == w || 'zIndex' == w) 
					r = +s + t * Math.ceil((e - s) / Math.max(1, o.step));
				if (pixelStyles.test(w))
					r = r || 0;
				return r;
			};
			var t = 0;
			var opacityre = /opacity\:\s*([^(?:;|$)]+)/gi;
			(function() {
				var timer;
				dss = ss.replace(re, function(_0, _1, _2) {
					var m;
					_1 = _1.toLowerCase();
					if (!new RegExp(_1, 'i').test(es)) return _0;
					if (m = es.match(new RegExp('(?:^|;)' + _1.replace(/\-/g, '\\-') + '\\:([^(?:;|$)]+)', 'i')))
						return _1.replace(cssre, '-$1') + ':' + rfn(_1, _2, m[1], t) + (pixelStyles.test(_1) ? 'px' : '');
					return _0;
				});
				if (t == o.step && !o.loop) {
					if (typeof e.style.filter == 'string')
						es = es.replace(opacityre, function(_0, _1) {return 'filter:alpha(opacity=' + 100 * _1 + ')';});
					e.style.cssText = ocss + ';' + es;
					clearTimeout(timer);
					o.complete(o, dss);
					return;
				}
				else if (o.loop && t == o.step) {
					t = 0;
					setTimeout(arguments.callee, 0);
					return;
				}
				if (typeof e.style.filter == 'string') 
					dss = dss.replace(opacityre, function(_0, _1) {return 'filter:alpha(opacity=' + 100 * _1 + ')';});
				e.style.cssText = ocss + ';' + dss;
				t++;
				timer = setTimeout(arguments.callee, o.time / o.step);
			}) ();	
		},

		'static': {
			run: function(o) {
				new ve.ui.Animate(o);
			}
		}
	});
}) (ve);