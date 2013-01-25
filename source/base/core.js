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
		widget:{}			//widget initialize
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
	 * @param {Function} moduleListStr
	 * @param {Object} option
	 **/
	Y.use = (function(){
		var DEF_SL;
		return function(moduleListStr, callback, option){
			callback = callback || Y.emptyFn;
			if(!Y.net){
				throw('NET MODULE REQUIRED');
			}

			if(!DEF_SL){
				DEF_SL = new Y.net.ScriptLoader();
			}

			var moduleList = [],
				tmpList = moduleListStr.split(',');
			for(var i=0; i<tmpList.length; i++){
				if(Y.string.trim(tmpList[i])){
					moduleList.push(Y.string.trim(tmpList[i]).replace(/^Y\.|^YSL\./i, ''));
				}
			}

			var doneCount = 0;
			var doneCheck = function(){
				if(doneCount == moduleList.length){
					callback(Y);
				}
			};

			Y.lang.each(moduleList, function(module){
				if(Y.object.route(Y, module)){
					doneCount++;
					doneCheck(Y);
				} else {
					var fileName = module.replace(/\./g, '/').toLowerCase() + '.js';
					var path = Y.ENV.getAbsUrl()+fileName;
					DEF_SL.add(path, option);
					DEF_SL.loadQueue(function(){
						doneCount++;
						doneCheck(Y);
					});
				}
			});
		};
	})();

	window.YSL = Y;
})();