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
				var found = false;
				Y.dom.all(selector).each(function(item){
					if(item && (item.contains(n) || item.equal(n))){
						found = true;
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
						if(check(n, selector)){
							handler.call(n, evt);
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
