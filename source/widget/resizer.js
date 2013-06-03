(function(Y){
	var TPL = ['<div class="resizer-topbar"></div>',
				'<div class="resizer-leftbar"></div>',
				'<div class="resizer-rightbar"></div>',
				'<div class="resizer-btmbar"></div>',

				'<div class="resizer-topleft-btn"></div>',
				'<div class="resizer-topmid-btn"></div>',
				'<div class="resizer-topright-btn"></div>',
				'<div class="resizer-midleft-btn"></div>',
				'<div class="resizer-midright-btn"></div>',
				'<div class="resizer-btmleft-btn"></div>',
				'<div class="resizer-btmmid-btn"></div>',
				'<div class="resizer-btmright-btn"></div>',
			].join('');

	var CSS = '\
		.resizer {position:absolute}\
		.resizer-topleft-btn,\
		.resizer-topmid-btn,\
		.resizer-topright-btn,\
		.resizer-midleft-btn,\
		.resizer-midright-btn,\
		.resizer-btmleft-btn,\
		.resizer-btmmid-btn,\
		.resizer-btmright-btn {margin:-4px 0 0 -4px; font-size:1px; border-radius:2px; border:1px solid gray; width:7px; height:7px;  background-color:white; position:absolute;}\
		\
		.resizer-topleft-btn {cursor:nw-resize}\
		.resizer-topmid-btn {cursor:row-resize}\
		.resizer-topright-btn {cursor:sw-resize}\
		.resizer-midleft-btn {cursor:col-resize}\
		.resizer-midright-btn {cursor:col-resize}\
		.resizer-btmleft-btn {cursor:sw-resize}\
		.resizer-btmmid-btn {cursor:row-resize}\
		.resizer-btmright-btn {cursor:nw-resize}\
		\
		.resizer-topbar,\
		.resizer-btmbar {height:8px; width:100%; top:-4px; left:0; position:absolute; cursor:row-resize}\
		.resizer-leftbar,\
		.resizer-rightbar {width:8px; height:100%; left:-4px; position:absolute; cursor:col-resize}\
		.resizer-btmbar {bottom:-4px; top:auto;}\
		.resizer-rightbar {left:auto; right:-4px}';
	Y.dom.insertStyleSheet(CSS);

	var body = Y.dom.one('body');
	var Resizer = function(tag, option){
		this.tag = Y.dom.one(tag);
		this.option = Y.object.extend({
			maxWidth: null,
			maxHeight: null,
			minWidth: null,
			minHeight:null
		}, option);

		this.tag.setStyle('position', 'absolute');
		var tagIdx = this.tag.getStyle('zIndex') || 0;

		this.dom = body.create('div');
		this.dom.addClass('resizer');
		this.dom.setHtml(TPL);
		this.dom.hide();

		if(tagIdx){
			this.dom.setStyle('z-index', tagIdx+1);
		}

		var _curOp = '';
		var _moving = false;
		var _this = this;
		var _lastPoint = {x:0, y:0};
		var _lastRegion = {top:0, left:0};
		var con = _this.dom.one('.resizer');

		body.on('mousedown', function(e){
			var tag = Y.event.getTarget(e);
			if(tag.getDomNode() != _this.dom.getDomNode() && _this.dom.contains(tag)){
				_moving = true;
				_curOp = tag.getDomNode().className;
				_lastRegion = _this.tag.getRegion();
				_lastPoint = {x:e.clientX, y:e.clientY};
				_this.onStart(tag);
				Y.event.preventDefault(e);
			}
		});

		body.on('mousemove', function(e){
			if(_moving){
				e = e || Y.W.event;
				offsetX = parseInt(e.clientX - _lastPoint.x, 10);
				offsetY = parseInt(e.clientY - _lastPoint.y, 10);

				var newLeft = _lastRegion.left + offsetX,
					newTop = _lastRegion.top + offsetY,
					newWidth = 0,
					newHeight = 0,
					tagReg = {};
				switch(_curOp){
					case 'resizer-topleft-btn':
						newWidth = _lastRegion.left - newLeft + _lastRegion.width;
						newHeight = _lastRegion.top - newTop + _lastRegion.height;
						tagReg = {height: newHeight,width: newWidth};
						break;

					case 'resizer-topbar':
					case 'resizer-topmid-btn':
						newHeight = _lastRegion.top - newTop + _lastRegion.height;
						tagReg = {'height':newHeight};
						break;

					case 'resizer-topright-btn':
						newWidth = newLeft - _lastRegion.left + _lastRegion.width;
						newHeight = _lastRegion.top - newTop + _lastRegion.height;
						tagReg = {'height':newHeight, 'width': newWidth};
						break;

					case 'resizer-midleft-btn':
					case 'resizer-leftbar':
						newWidth = _lastRegion.left - newLeft + _lastRegion.width;
						tagReg = {'width':newWidth};
						break;

					case 'resizer-midright-btn':
					case 'resizer-rightbar':
						newWidth = newLeft - _lastRegion.left + _lastRegion.width;
						tagReg = {'width':newWidth};
						break;

					case 'resizer-btmleft-btn':
						newWidth = _lastRegion.left - newLeft + _lastRegion.width;
						newHeight = newTop - _lastRegion.top + _lastRegion.height;
						tagReg = {height: newHeight,width: newWidth};
						break;

					case 'resizer-btmmid-btn':
					case 'resizer-btmbar':
						newHeight = newTop - _lastRegion.top + _lastRegion.height;
						tagReg = {'height':newHeight};
						break;

					case 'resizer-btmright-btn':
						newWidth = newLeft - _lastRegion.left + _lastRegion.width;
						newHeight = newTop - _lastRegion.top + _lastRegion.height;
						tagReg = {height: newHeight,width: newWidth};
						break;
				}

				_this.updateResizerRegion(tagReg);
				_this.updateTagRegion(tagReg);
				_this.onResize(_lastRegion,tagReg);
			}
		});

		Y.dom.one('window').on('blur', function(){
			_moving = false;
		});

		body.on('mouseup', function(){
			_moving = false;
		});
	};

	/**
	 * 更新resizer位置信息
	 * @param {Object} region
	 **/
	Resizer.prototype.updateResizerRegion = function(region){
		region = region || this.tag.getRegion();
		var rg = _fixRegion(region, this.option);
		this.dom.setStyle({left:rg.left, top:rg.top, width:0, height:0});
		this.dom.one('.resizer-topmid-btn').setStyle('left', rg.width/2);
		this.dom.one('.resizer-topright-btn').setStyle('left', rg.width);
		this.dom.one('.resizer-midleft-btn').setStyle('top', rg.height/2);
		this.dom.one('.resizer-midright-btn').setStyle({top:rg.height/2, left:rg.width});
		this.dom.one('.resizer-btmleft-btn').setStyle('top', rg.height);
		this.dom.one('.resizer-btmmid-btn').setStyle({top:rg.height, left:rg.width/2});
		this.dom.one('.resizer-btmright-btn').setStyle({top:rg.height, left:rg.width});
	};

	/**
	 * 更新对象位置信息
	 * @param {Object} region
	**/
	Resizer.prototype.updateTagRegion = function(region){
		var rg = _fixRegion(region, this.option);
		this.tag.setStyle(region);
	};

	/**
	 * 更新位置
	 **/
	Resizer.prototype.update = function(){
		this.show();
	};
	Resizer.prototype.show = function(){
		var rg = this.tag.getRegion();
		this.updateResizerRegion(rg);
		this.dom.show();
	};

	Resizer.prototype.hide = function(){
		this.dom.hide();
	};

	Resizer.prototype.onStart = function(){};
	Resizer.prototype.onResize = function(oldReg, newReg){
		//console.log('onResize',oldReg, newReg);
	};

	/**
	 * 单例模式
	 * @param mix tag
	 * @param object option
	 **/
	Resizer.singleton = (function(){
		var _RESIZER_SINGLETON;
		return function(tag, option){
			if(_RESIZER_SINGLETON){
				_RESIZER_SINGLETON.tag = Y.dom.one(tag);
			} else {
				_RESIZER_SINGLETON = new Resizer(tag, option);
			}
			_RESIZER_SINGLETON.show();
			return _RESIZER_SINGLETON;
		}
	})();

	Y.widget.Resizer = Resizer;

	/**
	 * 限制高度
	 * @param number h
	 * @param object option
	 **/
	var _limitHeight = function(h, option){
		if(option.maxHeight){
			h = Math.min(option.maxHeight, h);
		}
		if(option.minHeight){
			h = Math.max(option.minHeight, h);
		}
		return h;
	};

	/**
	 * 限制宽度
	 * @param number h
	 * @param object option
	**/
	var _limitWidth = function(w, option){
		if(option.maxWidth){
			w = Math.min(option.maxWidth, w);
		}
		if(option.minWidth){
			w = Math.max(option.minWidth, w);
		}
		return w;
	};

	/**
	 * 修正位置信息
	 * @param object region
	 * @param object option
	 * @return object
	 **/
	var _fixRegion = function(region, option){
		var rg = Y.object.extend(true, region);
		for(var i in rg){
			if(i == 'height'){
				rg[i] = _limitHeight(region[i], option);
			}
			if(i == 'width'){
				rg[i] = _limitWidth(region[i], option);
			}
		}
		return rg;
	};
})(YSL);