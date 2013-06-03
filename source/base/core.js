/**
 * YSL core module
 */
(function(){
	if(window.YSL){
		throw("YSL NAMESPACE ALREADY DEFINED");
	}
	var Y = {
		meta: {
			ver:'3.0.0',		//version
			cp:'sasumi',		//copyright
			build:'20121004'	//last build
		},

		D:document,			//document alias
		L:location,			//location alias
		W:window,			//window alias
		com: {},			//component initialize
		widget:{},			//widget initialize
		TOP_FIRST: true
	};

	/**
	 * YSL empty function
	 */
	Y.emptyFn = function(){};

	//console adapter
	if(!Y.W.console){
		Y.W.console = {log:Y.emptyFn, warn:Y.emptyFn, exception:Y.emptyFn, error:Y.emptyFn, info:Y.emptyFn, dir:Y.emptyFn};
	}

	/**
	 * guid
	 * @return string
	 */
	Y.guid = (function(){
		var _ID = 0;
		return function(){
			return '_ysl_guid_'+(++_ID);
		};
	})();

	/**
	 * YSL ready state triggle
	 * @param {Function} fn
	 * @return {Object} Y.ready
	 */
	Y.ready = function(fn){
		var cb = function(){
			fn(Y);
		};
        if (Y.D.readyState === "complete") {
            return setTimeout(cb, 1);
        }
        if (Y.D.addEventListener) {
            Y.D.addEventListener("DOMContentLoaded", cb, false);
            Y.W.addEventListener("load", cb, false);
        } else if (Y.D.attachEvent) {
            Y.D.attachEvent("onreadystatechange", cb);
            Y.W.attachEvent("onload", cb);
        }
        return;
	}


	/**
	 * set YSL environment parameter
	 */
	Y.ENV = (function(){
		var ENV_DATA = {};
		var _ABS_URL;

		return {
			/**
			 * 获取当前YSL脚本所在的web路径
			 * @deprecate 依赖ysl合并后的文件名为 ysl.*.js 或者 y.*.js
			 * @return {String}
			**/
			getAbsUrl: function(){
				if(_ABS_URL){
					return _ABS_URL;
				}
				var scripts = Y.D.getElementsByTagName('SCRIPT');
				for(var i=0; i<scripts.length; i++){
					if(scripts[i].src){
						var match = /(.*\/)(.*?\.js$)/ig.exec(scripts[i].src);
						if(match[1] && /^ysl\..*js/i.test(match[2])){
							_ABS_URL = match[1];
							return _ABS_URL;
						}
					}
				}
			},

			setData: function(key, val){
				ENV_DATA[key] = val;
			},

			get: function(key){
				return ENV_DATA[key]
			},

			remove: function(key){
				delete ENV_DATA[key];
			}
		};
	})();

	/**
	 * 子模块加载
	 * 依赖net组件
	 * @param {String} module 模块名称，支持Y.string 或 YSL.string 或 Y.widget.popup形式
	 * @param {Function} modList
	 * @param {Function} callback 回调，第一个参数为YSL，其他的根据module按次序排列
	 **/
	Y.use = (function(){
		var CallbackList = [];
		
		/**
		 * 转换模块key为模块实体
		 * @param string modStr
		 * @return object||boolean
		 **/
		var transKeyToObj = function(modStr){
			var na = modStr.replace(/^Y\.|^YSL\./i, '');
			return Y.object.route(Y, na);
		};
		
		/**
		 * 转换模块名称为路径
		 * @param string modStr
		 * @return string
		 **/
		var transKeyToPath = (function(){
			var ABS_PATH = Y.ENV.getAbsUrl();
			return function(modStr){
				na = modStr.replace(/^Y\.|^YSL\./i, '');
				return ABS_PATH+na.replace(/\./g,'/').toLowerCase()+'.js'
			}
		})();

		/**
		 * 循环检测
		 **/
		var loopCheck = function(){
			var needUpdate = false;
			var tmp = [];
			Y.lang.each(CallbackList, function(item){
				var allLoaded = true;
				Y.lang.each(item.modList, function(modStr){
					if(!transKeyToObj(modStr)){
						allLoaded = false;
						return false;
					}
				});
				if(allLoaded){
					var param = [Y];
					Y.lang.each(item.modList, function(modStr){
						param.push(transKeyToObj(modStr));
					});
					item.fn.apply(null, param);
					needUpdate = true;
				} else {
					tmp.push(item);
				}
			});
			CallbackList = tmp;
			if(needUpdate){
				loopCheck();
			}
		};

		return function(modStr, callback){
			var modList = [];
			var fileList = [];
			Y.lang.each(modStr.split(','), function(str){
				var str = Y.string.trim(str);
				if(str){
					modList.push(str);
					if(!transKeyToObj(str)){
						fileList.push(transKeyToPath(str));
					}
				}
			});
			if(fileList.length){
				CallbackList.push({fn:callback, modList: modList});
				Y.net.loadScript(fileList, function(){
					loopCheck();
				});
			} else {
				var param = [Y];
				Y.lang.each(modList, function(modStr){
					param.push(transKeyToObj(modStr));
				});
				callback.apply(null, param);
			}
		};
	})();

	window.YSL = Y;
})();