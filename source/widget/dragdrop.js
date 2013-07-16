(function(Y){
	var doc;

	var LOCATE_NORMAL = 0,	//普通拖动
		LOCATE_CENTER = 1,	//锁定鼠标到对象中心
		LOCATE_PERCENT = 2;	//根据比例锁定鼠标在代理物体的位置

	/**
	 * 拖拽
	 * @param mix tag 被拖动对象
	 * @param object option 选项
	 * 		option支持参数：
	 * 			container: 限定活动容器
	 * 			locateType: 0: default, 1: center, 2:by percent
	 **/
	var DD = function(tag, option){
		if(!doc){
			doc = Y.dom.one(document);
		}
		_init.call(this, tag, option);

		this.moveAble = false;
		var _this = this;
		var _moving = false;

		var _posInfo = {leftRate:0.5, topRate:0.5};
		var _proxyRegion = {};
		var _lastRegion = {};
		var _containerRegion = {};

		var _lastMouseInfo;

		//update proxy position info
		var updatePos = function(mouseX, mouseY){
			var newLeft, newTop;
			switch(_this.option.locateType){
				case LOCATE_CENTER:
				case LOCATE_PERCENT:
					newLeft = mouseX - Math.floor(_proxyRegion.width*_posInfo.leftRate);
					newTop = mouseY - Math.floor(_proxyRegion.height*_posInfo.topRate);
					break;

				case LOCATE_NORMAL:
				default:
					if(!_lastMouseInfo){
						_lastMouseInfo = {x:mouseX, y:mouseY};
					}
					newLeft = mouseX - (_lastMouseInfo.x - _proxyRegion.left);
					newTop = mouseY - (_lastMouseInfo.y - _proxyRegion.top);
			}

			//容器限制
			//这里注意，如果使用的是body的话，body默认高度可能为0
			if(_this.container){
				newLeft = Math.max(_containerRegion.left, newLeft);
				newTop = Math.max(_containerRegion.top, newTop);

				if((_proxyRegion.width + newLeft) > (_containerRegion.left + _containerRegion.width)){
					newLeft = _containerRegion.left + _containerRegion.width - _proxyRegion.width;
				}

				if((_proxyRegion.height + newTop) > (_containerRegion.top + _containerRegion.height)){
					newTop = _containerRegion.top + _containerRegion.height - _proxyRegion.height;
				}
			}
			_this.proxy.setStyle({top:newTop,left:newLeft, position:'absolute'});
		};

		doc.on('mousedown', function(e){
			var tag = Y.event.getTarget(e);
			if(_this.moveAble && (tag.getDomNode() == _this.tag.getDomNode() || _this.tag.contains(tag))){
				_this.onBeforeStart(e);
				_moving = true;
				_proxyRegion = _this.proxy.getRegion();
				_containerRegion = _this.container ? _this.container.getRegion() : {};

				//update rate info
				if(_this.option.locateType == LOCATE_PERCENT){
					_lastRegion = _this.tag.getRegion();
					_posInfo = {
						leftRate: (e.clientX - _lastRegion.left)/_lastRegion.width,
						topRate: (e.clientY - _lastRegion.top)/_lastRegion.height
					};
				}
				updatePos(e.clientX, e.clientY);
				_this.onStart(e);
				Y.event.preventDefault(e);
			}
		});

		doc.on('mousemove', function(e){
			if(_this.moveAble && _moving && Y.event.getButton(e) === 0){
				updatePos(e.clientX, e.clientY);
				_this.onMoving(e);
			}
		});

		doc.on('mouseup', function(e){
			_lastMouseInfo = null;
			if(_moving){
				_this.onStop(e);
				_moving = false;
			}
		});
	};

	var _init = function(tag, option){
		this.option = Y.object.extend(true, {
			proxy: this.tag,
			container: null,
			locateType: LOCATE_NORMAL
		}, option);

		this.tag = Y.dom.one(tag);
		this.proxy = Y.dom.one(this.option.proxy) || this.tag;
		this.proxy.setStyle({
			position: 'absolute',
			cursor: 'move'
		});
		this.container = Y.dom.one(this.option.container);
	};

	DD.prototype.onMoving = function(e){};
	DD.prototype.onBeforeStart = function(e){};
	DD.prototype.onStart = function(e){};
	DD.prototype.onStop = function(e){};
	DD.prototype.start = function(){this.moveAble = true;};
	DD.prototype.stop = function(){this.moveAble = false;};

	/**
	 * 单例模式
	 * @param mix tag
	 * @param mix object
	**/
	DD.singleton = (function(){
		var DD_COL = {};
		return function(tag, option){
			tag = Y.dom.one(tag);
			var tguid = tag.getAttr('dd-guid');
			if(!tguid){
				tguid = Y.guid();
				tag.setAttr('dd-guid', tguid);
			}
			var dobj = DD_COL[tguid];
			if(!dobj){
				dobj = new DD(tag, option);
				DD_COL[tguid] = dobj;
			}
			return dobj;
		};
	})();

	DD.LOCATE_NORMAL = LOCATE_NORMAL;
	DD.LOCATE_PERCENT = LOCATE_PERCENT;
	DD.LOCATE_CENTER = LOCATE_CENTER;
	Y.widget.Dragdrop = DD;
})(YSL);