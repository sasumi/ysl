YSL.use('widget.Tween', function(Y){
	var SUPPORT_PROS_REG = /^(left|top|right|bottom|width|height|margin|padding|spacing|backgroundx|backgroundy)$/i;
	var STEP_FREQ = {
		'veryslow': 8,
		'slow': 2,
		'normal': 1,
		'fast': 0.5,
		'veryfast': 0.25
	};

	/**
	 * 简单动画库
	 * @param {Mix} tag
	 * @param {Object} config
	**/
	var Animate = function(tag, config){
		var _this = this;
		this.target = Y.dom.one(tag);
		this.config = Y.object.extend(true, {
			interval: 15,
			tween: 'Elastic.easeOut',
			from: {},
			to: {},
			speed: 'veryslow',
			step: null
		}, config);

		this.status = 0;	//0,1,2,3 normal, runing, pausing, finish
		this._t = 0;
		this._timer;

		this.onStart = this.onRuning = this.onPause = this.onResume = this.onFinish = Y.emptyFn;
		this.config.speed = this.config.speed.toLowerCase();

		if(Y.lang.isString(this.config.tween)){
			this.config.tween = Y.object.route(Y.widget.Tween, this.config.tween);
		}

		if(typeof(this.config.tween) != 'function' || !this.target){
			throw('PARAM ERROR IN ANIMATE');
		}

		Y.lang.each(this.config.to, function(val, key){
			if(SUPPORT_PROS_REG.test(key)){
				_this.config.from[key] = parseInt(_this.target.getStyle(key), 10);
				if(!_this.config.step){
					var f = Math.abs(Math.ceil((_this.config.to[key] - _this.config.from[key])/_this.config.interval));
					_this.config.step = Math.ceil(f*STEP_FREQ[_this.config.speed]);
				}
			}
		});
	};

	/**
	 * 运行
	**/
	Animate.prototype._run = function(){
		var _this = this;
		var b, c, d=this.config.step;
		var _run = function(){
			if(_this.status == 1){
				var newStyle = {};
				Y.lang.each(_this.config.to, function(item, key){
					c = item - _this.config.from[key];
					newStyle[key] = _this.config.tween(_this._t, _this.config.from[key], c, d);
				});
				_this.target.setStyle(newStyle);
				if(_this._t++ < d){
					_this.onRuning(_this._t);
					_this._timer = setTimeout(_run, _this.config.interval);
				} else {
					_this.onFinish();
					_this.status = 3;
				}
			}
		};
		_run();
	};

	/**
	 * 从初始状态开始
	**/
	Animate.prototype.start = function(){
		this.onStart();
		this.reset();
		this.status = 1;
		this._run();
	};

	/**
	 * 重设到初始态
	**/
	Animate.prototype.reset = function(){
		this.status = 0;
		this._t = 0;
		clearTimeout(this._timer);
		this.target.setStyle(this.config.from);
	};

	/**
	 * 停止动画
	 * @deprecate 与重设同样处理
	**/
	Animate.prototype.stop = function(){
		this.reset();
	};

	/**
	 * 暂停动画
	 * @deprecate 只有在动画运行中有效
	**/
	Animate.prototype.pause = function(){
		if(this.status == 1){
			this.status = 2;
			this.onPause();
		}
	};

	/**
	 * 恢复动画
	 * @deprecate 只有在动画暂停中有效
	**/
	Animate.prototype.resume = function(){
		if(this.status == 2){
			this.status = 1;
			this._run();
			this.onResume();
		}
	};

	Y.widget.Animate = Animate;
});
