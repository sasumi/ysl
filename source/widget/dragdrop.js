(function(Y){
	var body;

	var LOCATE_NORMAL = 0,
		LOCATE_CENTER = 1,
		LOCATE_PERCENT = 2;

	/**
	 * 拖拽
	 * @param mix tag 被拖动对象
	 * @param object option 选项
	 * 		option支持参数：
	 * 			container: 限定活动容器
	 * 			locateType: 0: default, 1: center, 2:by percent
	 * 			lockCenter: 是否锁定移动时，鼠标在目标位置中央
	 **/
	var DD = function(tag, option){
		if(!body){
			body = = Y.dom.one('body');
		}
		_init.call(this, tag, option);

		this.moveAble = false;
		var _this = this;
		var _moving = false;

		var _posInfo = {leftRate:0.5, topRate:0.5};
		var _proxyRegion = {};
		var _lastRegion = {};
		var _containerRegion = {};
		body.on('mousedown', function(e){
			var tag = Y.event.getTarget(e);
			if(tag.getDomNode() == _this.tag.getDomNode() || _this.tag.contains(tag)){
				if(_this.moveAble){
					_this.onBeforeStart(e);

					_moving = true;
					_lastRegion = _this.tag.getRegion();
					_proxyRegion = _this.proxy.getRegion();
					_containerRegion = _this.container ? _this.container.getRegion() : {};

					if(!_this.option.lockCenter){
						_posInfo = {
							leftRate: (e.clientX - _lastRegion.left)/_lastRegion.width,
							topRate: (e.clientY - _lastRegion.top)/_lastRegion.height
						};
					}

					updatePos.call(_this, e.clientX, e.clientY);
					_this.onStart(e);
					Y.event.preventDefault(e);
				}
			}
		});

		body.on('mousemove', function(e){
			if(_this.moveAble && _moving && Y.event.getButton(e) === 0){
				updatePos.call(_this, e.clientX, e.clientY);
				_this.onMoving(e);
			}
		});

		body.on('mouseup', function(e){
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
			lockCenter: false
		}, option);

		this.tag = Y.dom.one(tag);
		this.proxy = Y.dom.one(this.option.proxy) || this.tag;
		this.proxy.setStyle({
			position: 'absolute',
			cursor: 'move'
		});
		this.container = Y.dom.one(this.option.container);
	};

	var updatePos = function(mouseX, mouseY){
		var newLeft = mouseX - Math.floor(_proxyRegion.width*_posInfo.leftRate),
			newTop = mouseY - Math.floor(_proxyRegion.height*_posInfo.topRate);

		//容器限制
		//这里注意，如果使用的是body的话，body默认高度可能为0
		if(this.container){
			newLeft = Math.max(_containerRegion.left, newLeft);
			newTop = Math.max(_containerRegion.top, newTop);

			if((_proxyRegion.width + newLeft) > (_containerRegion.left + _containerRegion.width)){
				newLeft = _containerRegion.left + _containerRegion.width - _proxyRegion.width;
			}

			if((_proxyRegion.height + newTop) > (_containerRegion.top + _containerRegion.height)){
				newTop = _containerRegion.top + _containerRegion.height - _proxyRegion.height;
			}
		}
		this.proxy.setStyle({top:newTop,left:newLeft});
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
		var _DD_SINGLETON;
		return function(tag, option){
			if(!_DD_SINGLETON){
				_DD_SINGLETON = new DD(tag, option);
			} else {
				_init.call(_DD_SINGLETON, tag, option);
			}
			_DD_SINGLETON.start();
			return _DD_SINGLETON;
		};
	})();

	DD.LOCATE_NORMAL = LOCATE_NORMAL;
	DD.LOCATE_PERCENT = LOCATE_PERCENT;
	DD.LOCATE_CENTER = LOCATE_CENTER;


	Y.widget.Dragdrop = DD;
})(YSL);