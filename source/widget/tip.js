(function(Y){
	var TIP_CONTAINER = null;
	var RES_URL = Y.ENV.getAbsUrl()+'res/';

	Y.dom.insertStyleSheet([
		'.ysl-tip-container-wrap {width:100%; text-align:center; left:0; position:fixed; top:46%; z-index: 65533; _position:absolute;}',
		'.ysl-tip-container {display:inline-block; height:54px; line-height:54px; color:#606060; font-weight:bold; font-size: 14px; background:url("'+RES_URL+'tip_layer.png") no-repeat 100% -271px; padding-right:13px;}',
		'.ysl-tip-icon-tip,',
		'.ysl-tip-icon-succ,',
		'.ysl-tip-icon-load,',
		'.ysl-tip-icon-err {background:url("'+RES_URL+'tip_layer.png") no-repeat -6px -109px; float:left; display:inline-block; height:54px; width:45px; margin:0 0 0 -45px; _margin:0 -4px 0 0;}',
		'.ysl-tip-icon-succ {background-position:-6px -55px;}',
		'.ysl-tip-icon-err {background-position:-6px -163px}',
		'.ysl-tip-icon-load {background-position:-6px -1px}',
		'.ysl-tip-icon-load i {display:block; width:100%; height:100%; display:block; background:url("'+RES_URL+'loading.gif") no-repeat 50% 50%}',
		'.ysl-tip-content {float: left; height:54px; line-height:54px; background:url("'+RES_URL+'tip_layer.png") repeat-x 100% -217px; padding:0 18px 0 9px}'].join(''));

	/**
	 * Show Tips
	 * @param {Mix} arg1
	 * @param {Integer} wtype
	 * @param {Integer} time
	 * @param {Function} closeCallback
	 */
	var Tip = function(arg1, wtype, time, closeCalllback){
		this.container = TIP_CONTAINER;
		var cfg = arg1;
		if(typeof(arg1) == 'string'){
			cfg = {
				'msg': arg1,
				'type': wtype || 0,
				'time': (time > 0 ? time*1000 : 2000)
			};
		}
		//extend default message config
		this.config = Y.object.extend({
			'msg': '',
			'type': 0,
			'time': 2000,
			'auto': true,
			'callback': closeCalllback
		}, cfg);

		//auto
		if(this.config.auto){
			this.show();
			if(this.config.time){
				setTimeout(Y.object.bind(this,function(){
					this.hide();
				}), this.config.time);
			}
		}
	};

	/**
	 * show tip
	 */
	Tip.prototype.show = function(){
		if(!this.container){
			this.container = TIP_CONTAINER = Y.dom.create('div').addClass('ysl-tip-container-wrap');
		}
		var html = ([
			'<span class="ysl-tip-container">',
				'<span class="ysl-tip-icon-',this.config.type,'"><i></i></span>',
				'<span class="ysl-tip-content">',this.config.msg,'</span>',
			'</div>'
		]).join('');

		//ie6 位置修正
		if(Y.ua.ie6){
			var viewP = Y.dom.getWindowRegion();
			this.container.setStyle('top',viewP.visibleHeight /2 + viewP.verticalScroll);
		}
		this.container.setHtml(html).show();
	};

	/**
	 * hide tip
	 */
	Tip.prototype.hide = function(){
		if(this.container){
			this.container.hide();
			this.config.callback && this.config.callback(this);
		}
	};

	/**
	 * hide all tip
	 */
	Tip.closeAll = function(){
		if(TIP_CONTAINER){
			TIP_CONTAINER.hide();
		}
	}

	/**
	 * destory tip container
	 */
	Tip.prototype.destory = function(){
		this.container.remove();
	};

	Y.widget.Tip = Tip;
})(YSL);