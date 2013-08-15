(function(){
	/**
	 * 由于getCurrentPopup对于内嵌的popup没有比较好的适配方案（去除对象引用），
	 * 因此Popup暂时不提供内嵌dialog无缝接口
	 */
	YSL.use('widget.masklayer', function(Y){
		Y.dom.insertStyleSheet([
			'.PopupDialog * {margin:0; padding:0}',
			'.PopupDialog {position:absolute; top:20px; left:20px; width:350px; border:1px solid #999; border-top-color:#bbb; border-left-color:#bbb; background-color:white; box-shadow:0 0 8px #aaa; border-radius:3px}',
			'.PopupDialog-hd {height:28px; background-color:#fff; cursor:move; position:relative; border-radius:3px 3px 0 0}',
			'.PopupDialog-hd h3 {font-size:12px; font-weight:bolder; color:gray; padding-left:10px; line-height:28px;}',
			'.PopupDialog-close {display:block; overflow:hidden; width:28px; height:28px; position:absolute; right:0; top:0; text-align:center; cursor:pointer; font-size:17px; font-family:Verdana; text-decoration:none; color:gray;}',
			'.PopupDialog-close:hover {color:black;}',
			'.PopupDialog-ft {background-color:#f3f3f3; white-space:nowrap; border-top:1px solid #e0e0e0; padding:5px 5px 5px 0; text-align:right; border-radius:0 0 3px 3px}',
			'.PopupDialog-text {padding:20px;}',
			'.PopupDialog-bd-frm {border:none; width:100%}',
			'.PopupDialog-btn {display:inline-block; font-size:12px; cursor:pointer; box-shadow:1px 1px #fff; text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.7); background:-moz-linear-gradient(19% 75% 90deg, #E0E0E0, #FAFAFA); background:-webkit-gradient(linear, left top, left bottom, from(#FAFAFA), to(#E0E0E0)); color:#4A4A4A; background-color:white; text-decoration:none; padding:0 15px; height:20px; line-height:20px; text-align:center; border:1px solid #ccd4dc; white-space:nowrap; border-radius:2px}',
			'.PopupDialog-btn:hover {background-color:#eee}',
			'.PopupDialog-btnDefault {}'].join(''), 'YSL_WIDGET_POPUP');

		var POPUP_COLLECTION = [];

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
			this._ios = {};
			this._readyCbList = [];
			this.guid = Y.guid();
			this.onShow = Y.emptyFn;
			this.onClose = Y.emptyFn;

			this.config = Y.object.extend(true, {
				ID_PRE: 'popup-dialog-id-pre',
				title: '对话框',				//标题
				content: '测试',				//content.src content.id
				width: 400,						//宽度
				moveEnable: true,				//框体可移动
				moveTriggerByContainer: false,	//内容可触发移动
				zIndex: 1000,					//高度
				isModal: false,					//模态对话框
				topCloseBtn: true,				//是否显示顶部关闭按钮,如果显示顶部关闭按钮，则支持ESC关闭窗口行为
				showMask: true,
				keepWhileHide: false,			//是否在隐藏的时候保留对象
				cssClass: {
					dialog: 'PopupDialog',
					head: 'PopupDialog-hd',
					body: 'PopupDialog-bd',
					textCon: 'PopupDialog-text',
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

			init.call(this);

			//ADD TO MONITER COLLECTION
			POPUP_COLLECTION.push(this);
		};

		/**
		 * on content onReady
		 * @param  {Function} callback
		 */
		Popup.prototype.onReady = function(callback) {
			if(this._ready){
				callback();
			} else {
				this._readyCbList.push(callback);
			}
		};

		/**
		 * call ready list
		 */
		Popup.prototype._callReadyList = function() {
			this._ready = true;
			Y.lang.each(this._readyCbList, function(fn){
				fn();
			});
			this._readyCbList = [];
		};

		/**
		 * show popup
		 */
		Popup.prototype.show = function(){
			var _this = this;

			this.onReady(function(){
				//CREATE MASK
				if(_this.config.showMask){
					Y.widget.masklayer.show();
				}

				_this.container.show();

				//CACULATE REGION INFO
				var region = Y.object.extend(true, _this.container.getRegion(), _this.config);
					region.minHeight = region.minHeight || 78;

				var scroll = Y.dom.getScroll(),
					winRegion = Y.dom.getWindowRegion(),
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
				var calStyle = {left:left,top:top,zIndex:_this.config.zIndex};
				_this.container.setStyle(calStyle);

				if(_this.config.height){
					_this.container.one('.'+_this.config.cssClass.body).setStyle('height', _this.config.height);
				}
				if(_this.config.width){
					_this.container.setStyle('width', _this.config.width);
				}

				_this.onShow();
				_this.status = 1;

				bindEvent.call(_this);
				bindMoveEvent.call(_this);
				bindEscCloseEvent.call(_this);

				var hasOtherModalPanel = false;

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

				_this.container.setStyle('zIndex', _this.config.zIndex);
				if(hasOtherModalPanel){
					_this.setDisable();
				} else if(_this.config.isModal){
					//设置除了当前模态对话框的其他对话框所有都为disable
					Y.lang.each(POPUP_COLLECTION, function(dialog){
						if(dialog != _this && dialog.status){
							dialog.setDisable();
						}
					});
					_this.focus();
				} else {
					_this.focus();
				}
			});
		};

		/**
		 * 聚焦到当前对话框第一个按钮
		 */
		Popup.prototype.focus = function() {
			var a = this.container.one('A');
			if(a){
				a.getDomNode().focus();
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
			}

			Y.lang.each(POPUP_COLLECTION, function(dialog){
				if(dialog.status){
					hasDialogLeft = true;
				}
				if(dialog.status && dialog.config.isModal){
					hasModalPanelLeft = true;
					dialog.setEnable();
					dialog.focus();
					return false;
				}
			});

			//没有显示的对话框
			if(!hasDialogLeft){
				Y.widget.masklayer.hide();
			}

			//剩下的都是普通对话框
			if(!hasModalPanelLeft){
				var _lastTopPanel;
				Y.lang.each(POPUP_COLLECTION, function(dialog){
					if(!dialog.status){
						return;
					}
					dialog.setEnable();
					if(!_lastTopPanel){
						_lastTopPanel = dialog;
					} else if(_lastTopPanel.config.zIndex <= dialog.config.zIndex){
						_lastTopPanel = dialog;
					}
				});
				if(_lastTopPanel){
					_lastTopPanel.focus();
				}
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
		 * 为当前popup添加一个IO
		 * @param {String} key
		 * @param {Mix} param
		 * @return {Boolean}
		 */
		Popup.prototype.addIO = function(key, param){
			return this._ios[key] = param;
		};

		/**
		 * 获取IO
		 * @param {String} key
		 * @param {Function} callback
		 */
		Popup.prototype.getIO = function(key, callback){
			if(this._ios[key]){
				callback(this._ios[key]);
			}
		};

		/**
		 * search popup by guid
		 * @param  {String} guid
		 * @return {Popup}
		 */
		Popup.getPopupByGuid = function(guid){
			var result;
			Y.lang.each(POPUP_COLLECTION, function(pop){
				if(pop.guid == guid){
					result = pop;
					return false;
				}
			});
			return result;
		};

		//!!以下方法仅在iframe里面提供
		if(Y.W.frameElement){
			/**
			 * 获取当前popup IO
			 * @param {String} key
			 * @param {Function} callback
			 */
			Popup.getIO = function(key, callback){
				var pop = Popup.getCurrentPopup();
				if(pop){
					pop.getIO(key, callback);
				}
			};

			/**
			 * 为当前popup添加一个IO
			 * @param {String} key
			 * @param {Mix} param
			 * @return {Boolean}
			 */
			Popup.addIO = function(key, callback){
				var pop = Popup.getCurrentPopup();
				if(pop){
					return pop.addIO(key, callback);
				}
				return false;
			};

			/**
			 * close all popup
			 * @see Popup#close
			 */
			Popup.closeAll = function(){
				Y.lang.each(POPUP_COLLECTION, function(pop){
					pop.close();
				});
			};

			/**
			 * resize current popup
			 * @deprecated only take effect in iframe mode
			 */
			Popup.resizeCurrentPopup = function(){
				Y.dom.one(Y.W).on('load', function(){
					var wr = Y.dom.getWindowRegion();
					Y.D.body.style.overflow = 'hidden';
					Y.W.frameElement.style.height = wr.documentHeight +'px';
				});
			};

			/**
			 * get current page located popup object
			 * @param  {Dom} win
			 * @return {Mix}
			 */
			Popup.getCurrentPopup = function(win){
				var guid = Y.W.frameElement.getAttribute('guid');
				if(guid){
					return parent.YSL.widget.Popup.getPopupByGuid(guid);
				}
				return null;
			};

			/**
			 * close current popup
			 * @deprecated only take effect in iframe mode
			 */
			Popup.closeCurrentPopup = function(){
				var curPop = this.getCurrentPopup();
				if(curPop){
					curPop.close();
				}
			};
		}

		/**
		 * 初始化对话框结构
		 */
		var init = function(){
			var _this = this;

			//DOM Clone Mode
			if(!this.container){
				this.container = Y.dom.create('div');
				this.container.addClass(this.config.cssClass.dialog);
				this.container.setStyle('left', '-9999px');
			}
			this.container.getDomNode().id = this.config.ID_PRE + Y.guid();

			//构建内容容器
			var content = '<div class="'+this.config.cssClass.body+'">';
			if(typeof(this.config.content) == 'string'){
				content += '<p class="'+this.config.cssClass.textCon+'">'+this.config.content+'</p>';
			} else if(this.config.content.src){
				content += '<iframe allowtransparency="true" guid="'+this.guid+'" src="'+this.config.content.src+'" class="'+this.config.cssClass.iframe+'" frameborder=0></iframe>';
			} else {
				content += '<div class="' + this.config.cssClass.container + '"></div>';
			}
			content += '</div>';

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
							(this.config.topCloseBtn ? '<span class="PopupDialog-close" tabindex="0" title="关闭窗口">x</span>' : ''),
						'</div>',content,btn_html,
					'</div>'
				]).join('');
			this.container.setHtml(html);

			if(this.config.content.src){
				this.container.one('iframe').on('load', function(){
					try {
						var ifr = this.getDomNode();
						var w = ifr.contentWindow;
						var d = w.document;
						var b = w.document.body;
						w.focus();
					} catch(ex){
						console.log(ex);
					}

					//Iframe+无指定固定宽高时 需要重新刷新size
					if(!_this.config.height && b){
						b.style.overflow = 'hidden';

						var info = {};
						if(w.innerWidth){
							info.visibleHeight = w.innerHeight;
						} else {
							var tag = (d.documentElement && d.documentElement.clientWidth) ?
								d.documentElement : d.body;
							info.visibleHeight = tag.clientHeight;
						}
						var tag = (d.documentElement && d.documentElement.scrollWidth) ?
								d.documentElement : d.body;
						info.documentHeight = Math.max(tag.scrollHeight, info.visibleHeight);

						ifr.style.height = info.documentHeight + 'px';
						_this.container.setStyle('height', 'auto');
					} else {
						this.setStyle('height', _this.config.height);
					}

					_this._callReadyList();
				});
			} else {
				//移动ID绑定模式的DOM对象【注意：这里移动之后，原来的元素就被删除了，为了做唯一性，这里只能这么干】
				if(this.config.content.id){
					Y.dom.one('#'+this.config.content.id).show();
					this.container.one('div.'+this.config.cssClass.container).append('#'+this.config.content.id);
				}
				_this._callReadyList();
			}
		};

		/**
		 * 绑定对话框按钮事件
		 */
		var bindEvent = function(){
			var _this = this;
			var topCloseBtn = this.container.one('.PopupDialog-close');

			if(topCloseBtn){
				topCloseBtn.on('click', function(){
					_this.close();
				});
			}

			this.container.all('a.PopupDialog-btn').each(function(btn, i){
				btn.on('click', function(){
					var hd = _this.config.buttons[i].handler || function(){_this.close();};
					if(typeof(hd) == 'string'){
						_this.getIO(hd, function(fn){fn();});
					} else {
						hd.apply(this, arguments);
					}
				});
			});

			var defBtn = this.container.one('a.PopupDialog-btnDefault');
			if(defBtn){
				defBtn.getDomNode().focus();
			}

			var _this = this;
			this.container.on('mousedown', function(){
				updateZindex.call(_this);
			});
		}

		/**
		 * update dialog panel z-index property
		 **/
		var updateZindex = function() {
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
		 * 绑定对话框移动事件
		 */
		var bindMoveEvent = function(){
			if(!this.config.moveEnable){
				return;
			}
			var _this = this;
			var _lastPoint = {X:0, Y:0};
			var _lastRegion = {top:0, left:0};
			var _moving;

			Y.event.add(Y.D, 'mousemove', function(e){
				e = e || Y.W.event;
				if(!_this.container || !_moving || Y.event.getButton(e) !== 0){
					return false;
				}
				offsetX = parseInt(e.clientX - _lastPoint.X, 10);
				offsetY = parseInt(e.clientY - _lastPoint.Y, 10);
				var newLeft = Math.max(_lastRegion.left + offsetX,0);
				var newTop = Math.max(_lastRegion.top + offsetY,0);
				_this.container.setStyle({top:newTop,left:newLeft});
			});

			Y.event.add(Y.D, 'mousedown', function(e){
				if(!_this.container || Y.event.getButton(e) !== 0){
					return;
				}
				var head = _this.config.moveTriggerByContainer ? _this.container : _this.container.one('.'+_this.config.cssClass.head);
				var tag = Y.dom.one(Y.event.getTarget());
				if(head.contains(tag)){
					_moving = true;
					_lastRegion = _this.container.getRegion();
					_lastPoint = {X: e.clientX, Y: e.clientY};
					Y.event.preventDefault(e);
				}
			});

			Y.event.add(Y.D, 'mouseup', function(){
				_moving = false;
			});
		};

		/**
		 * 绑定 ESC 关闭事件
		 * 注意，所有的对话框只绑定一次ESC事件
		 */
		var bindEscCloseEvent = (function(){
			var ESC_BINDED;
			return function(){
				if(ESC_BINDED){
					return;
				}
				ESC_BINDED = true;

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
		})();
		YSL.widget.Popup = Popup;
	});
})();