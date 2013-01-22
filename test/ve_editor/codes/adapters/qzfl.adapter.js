(function(window, document, undefined, v) {
	var is = ve.is, each = ve.each, isIE = v.isIE;
	v.Class('ve.dom.Utility:ve.dom.Abstructor', {
		Utility: function () {
			var t = this;
			this.event = {
				domLoaded: false,
				add: QZFL.event.addEvent,
				remove: QZFL.event.removeEvent,
				onDOMReady: function(fn) {
					t.domLoaded = true;
					QZFL.event.onDomReady(fn)
				},
				cancelBubble: QZFL.event.cancelBubble,
				preventDefault: QZFL.event.preventDefault,
				cancel: function (e) {
					var t = this;
					t.cancelBubble(e);
					t.preventDefault(e);
				}
			};
			each(['getXY', 'setXY', 'getSize', 'setSize', 'getById', 'removeElement', 'insertCSSLink'], function (v) {
				t[v] = QZFL.dom[v];
			});
		},
		remove: QZFL.dom.removeElement,
		find: $e,
		select: QZFL.selector, 
		selector: QZFL.selector, 
		getViewPort: function (w) {
			var isIE = ve.isIE, w = !w ? window : w, d = w.document, b = (!isIE || d.compatMode == "CSS1Compat") && d.documentElement || d.body;
			return {
				x : w.pageXOffset || b.scrollLeft,
				y : w.pageYOffset || b.scrollTop,
				w : w.innerWidth || b.clientWidth,
				h : w.innerHeight || b.clientHeight
			};
		},
		
		getRegion: function(el, doc){
			var xy = QZFL.dom.getXY(el,doc),
				sz = QZFL.dom.getSize(el);
			return {
				top:xy[1],
				left:xy[0],
				width:sz[0],
				height:sz[1]
			}
		},

		drag: function (dragEl, el) {
			el = el ? $(el) : dragEl.parentNode;
			var startdrag = false, startX, startY, origX, origY, deltaX, deltaY, _this = dragEl, timer;
			if (!dragEl) return;
			dom.setStyle(dragEl, 'cursor','move');
			function _mousedown(e) {
				dom.event.cancel(e);
				var s = e.target || e.srcElement;
				if (/a|button/i.test(s.nodeName)) return false;
				startdrag = true;
				startX = e.clientX, startY = e.clientY;
				origX = el.offsetLeft, origY = el.offsetTop;
				deltaX = startX - origX, deltaY = startY - origY;
				timer = setTimeout(function() {
					QZFL.dom.setStyle(el, 'opacity',.6);
				}, 400);
				if (_this.setCapture) _this.setCapture();
				dom.event.add(document, 'mousemove', _mousemove);
				dom.event.add(dragEl, 'mouseup', _mouseup);
			};
			function _mousemove(e) {
				if (!startdrag) return;
				dom.setStyle(el, 'left',((e.clientX - deltaX)<0?0:(e.clientX - deltaX)) + 'px');
				dom.setStyle(el, 'top',((e.clientY - deltaY)<0?0:(e.clientY - deltaY)) + 'px');
				dom.setStyle(el, 'opacity',.6);
			};
			function _mouseup(e) {
				startdrag = false;
				clearTimeout(timer);
				if (_this.releaseCapture) _this.releaseCapture();
				dom.setStyle(el, 'opacity',1);
				dom.event.remove(document, 'mousemove', _mousemove);
				dom.event.remove(dragEl, 'mouseup', _mouseup);
			};
			dom.event.add(dragEl, 'mousedown', _mousedown);
		}
	});
	
	v.Class('ve.adapter.Config', {
		init: function() {
			var util = new ve.dom.Utility();
			ve.Sizzle = QZFL.selector;
			ve.DOM = util;
			ve.ua = {};
			for (var i in QZFL.userAgent) { // adapte useragent
				ve.ua[i] = QZFL.userAgent[i];
			}

			ve.string = {};
			for (var i in QZFL.string) { // adapte QZFL.string
				ve.string[i] = QZFL.string[i];
			}

			ve.object = {}; 
			for (var i in QZFL.object) { // adapte QZFL.object
				ve.object[i] = QZFL.object[i];
			}
		}
	});
	var conf = new ve.adapter.Config();
	conf.init();
}) (window, document, undefined, ve);