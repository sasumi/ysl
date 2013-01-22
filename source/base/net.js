/**
 * YSL net module
 */
(function(Y){
	Y.net = {};
	var CACHE_DATA = {};

	/**
	 * 设置cache
	 * @param {String} key
	 * @param {Mix} data
	 * @param {Number} expired 过期时间（秒）
	 **/
	var setCache = function(key, data, expired){
		var expiredTime = (new Date()).getTime() + expired*1000;
		CACHE_DATA[key] = {data:data, expiredTime:expiredTime};
	};

	/**
	 * 获取cache
	 * @param {String} key
	 * @return {Mix}
	 **/
	var getCache = function(key){
		var time = new Date().getTime();
		if(CACHE_DATA[key] && CACHE_DATA[key].expired > time){
			return CACHE_DATA[key].data;
		} else {
			delete CACHE_DATA[key];
			return null;
		}
	};

	/**
	 * ajax请求组件
	 * @todo  组件暂时不处理跨域问题
	 **/
	Y.net.Ajax = (function(){
		/**
		 * 新建ajax组件对象
		 * @param {Object} config
		 **/
		var ajax = function(config){
			this.config = Y.object.extend(true, {
				url: null,			//请求url
				syn: false,			//是否为同步方法
				method: 'get',		//请求方法
				data: null,			//发送数据
				format: 'json',		//返回格式
				charset: 'utf-8',	//编码字符集
				cache: false		//是否cache
			}, config);

			if(!this.config.url){
				throw('NO REQUEST URL FOUND');
			}

			this.config.data = Y.net.buildParam(this.config.data);
			this.config.method = this.config.method.toLowerCase();
			this.config.format = this.config.format.toLowerCase();

			if (Y.W.XMLHttpRequest) {
				this.xmlObj = new XMLHttpRequest();
				if(this.xmlObj.overrideMimeType){
					this.xmlObj.overrideMimeType('text/xml');
				}
			} else if(Y.W.ActiveXObject){
				this.xmlObj = new ActiveXObject('Msxml2.XMLHTTP') || new ActiveXObject('Microsoft.XMLHTTP');
			} else {
				throw('browser no support ajax');
			}
		};

		/**
		 * 响应处理函数
		 * @param {Object} response
		 **/
		ajax.prototype.onResponse = function(response){
			if(!response || response.length == 0){
				this.onError();
				return;
			}

			var data = null;
			try {
				switch(this.config.format){
					case 'json' || 'javascript':
						eval('data = ' + response.responseText + ';');
						break;
					case 'xml':
						data = response.responseXML;
						break;
					case 'bool' || 'boolean':
						data = /yes|true|y/ig.test(ret.responseText)? true : false;
						break;
					default:
						data = response.responseText;
				}
			} catch(ex){}
			this.onResult(data);
		};

		/**
		 * 发送动作
		 **/
		ajax.prototype.send = function(){
			var _this = this;
			var cache_data = getCache(this.config.url);
			if(cache_data){
				this.onResponse(cache_data);
				return;
			}

			this.xmlObj.onreadystatechange = function(){
				if(_this.xmlObj.readyState == 4) {
					if(_this.xmlObj.status == 200){
						_this.onResponse(_this.xmlObj);
						setCache(_this.config.url, _this.xmlObj);
					} else {
						_this.onError(_this.xmlObj.status);
					}
				} else {
					if(_this.xmlObj.readyState == 0){
						_this.onReady();
					} else {
						_this.onLoading();
					}
				}
			};

			this.xmlObj.open(this.config.method, this.config.url, !this.config.syn);
			if(this.config.format == 'xml'){
				this.xmlObj.setRequestHeader('Content-Type','text/xml');
			} else {
				this.xmlObj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset='+this.config.charset);
			}

			if(this.config.method == 'GET'){
				param = null;
			}

			this.xmlObj.send(this.config.data);

			if(this.config.syn && this.xmlObj && this.xmlObj.status == 200){
				return this.callback(this.xmlObj);
			}
		};

		//附属额外处理事件
		ajax.prototype.onLoading = function(){};
		ajax.prototype.onResult = function(){};
		ajax.prototype.onError = function(){};
		ajax.prototype.onReady = function(){};
		ajax.prototype.onTimeout = function(){};
		return ajax;
	})();

	/**
	 * flash请求组件
	 * @deprecated 需要在服务器部署crossdomain.xml
	 **/
	Y.net.flashSender = (function(){
		var GUID = 0;
		var FLASHSENDER_ID = '';
		var FLASHSENDER_OBJ = '';
		var FLASHSENDER_SRC = '';
		var FLASHSENDER_READY;
		var FLASHSENDER_INIT_CALLBACK_METHOD = 'FLASHSENDER_INIT_CALLBACK';
		var FLASHSENDER_CALLBACK_METHOD = 'FLASHSENDER_CALLBACK';
		var FLASHSENDER_CALLBACK_LIST = {};

		/**
		 * flash初始化状态回调标记
		 **/
		Y.W[FLASHSENDER_INIT_CALLBACK_METHOD] = function(){
			FLASHSENDER_READY = true;
			delete(Y.W[FLASHSENDER_INIT_CALLBACK_METHOD]);
		};

		/**
		 * flash响应回调
		 * @param {Object} params
		 **/
		Y.W[FLASHSENDER_CALLBACK_METHOD] = function(params){
			if(!params || !params.guid || !params.data){
				console.log('FLAHSSENDER ERROR', params);
				return;
			}

			if(FLASHSENDER_CALLBACK_LIST[params.guid]){
				FLASHSENDER_CALLBACK_LIST[params.guid](params.data);
				delete(FLASHSENDER_CALLBACK_LIST[params.guid]);
			}
		};

		var sender = function(config){
			this.config = Y.object.extend(true, {
				url: '',
				method: 'get',
				data: {},
				cache: false,
				format: 'json',
				guid: ++GUID
			}, config);
		};
		sender.initialize = function(){
			if(FLASHSENDER_READY){
				return;
			} else {
				Y.use('media', function(){
					//Y.media.insertFlash();

				});
			}
		};

		sender.prototype.onResponse = function(data){

		};

		sender.prototype.send = function(){

		};

		return sender;
	})();

	/**
	 * 加载css样式表
	 * @param {string} url
	 * @param {function} callback 这里可能不准确
	 * @param {dom} doc
	 */
	Y.net.loadCss = function(url, callback, doc){
		setTimeout(function(){
			doc = doc || Y.D;
			callback = callback || YSL.emptyFn;
			var css = doc.createElement('link');
			css.rel = 'stylesheet';
			css.type = 'text/css';
			css.href = url;
			doc.getElementsByTagName('head')[0].appendChild(css);
			css.onreadystatechange = css.onload = callback();
		}, 0);
	};

	/**
	 * 加载脚本
	 **/
	(function(net){
		var ScriptLoader = function(){
			this.queue = [];
			this.lookup = {};
			this.callbackList = [];
			this.leftCount = 0;
		};

		ScriptLoader.prototype = {
			/**
			 * 加载javascript脚本
			 * @param {string} url
			 * @param {function} callback
			 * @param {object} config
			 */
			load: function (url, callback, conf) {
				var sc;
				conf = Y.object.extend({
					cache: 1,
					charset: 'utf-8',
					window: Y.W
				}, conf || {});

				function done() {
					callback && callback(url);
					if(sc.removeNode){
						sc.removeNode(true)
					} else {
						head.removeChild(sc);
					}
				};
				sc = conf.window.document.createElement('script');
				sc.setAttribute('charset', conf['charset']);
				sc.src = url;
				sc.onreadystatechange = sc.onload = function() {
					if (!sc.readyState || sc.readyState == "loaded" || sc.readyState == "complete") {
						done();
					}
				};
				var head = conf.window.document.getElementsByTagName('head')[0] || conf.window.document.body
				head.appendChild(sc);
			},

			/**
			 * 加载队列
			 * @param {Function} onAllDone
			 **/
			loadQueue: function (onAllDone) {
				var t = this;
				if(onAllDone){
					this.callbackList.push(onAllDone);
				}
				if (t.queue.length > 0) {
					var q = t.queue.shift();
					t.load(q.url, function () {
						t.leftCount--;

						//setTimeout去除模块多层嵌套问题
						setTimeout(function(){
							if(t.leftCount >0){
								t.loadQueue();
							} else {
								var cb;
								while(cb = t.callbackList.pop()){
									cb();
								}
							}
						}, 0);
					}, q.option);
					return;
				}
			},

			/**
			 * 单个添加
			 * @param {String} url
			 **/
			add: function (url, option) {
				if (this.lookup[url]){
					return;
				}
				this.lookup[url] = url;
				this.queue.push({'url':url, 'option':option});
				this.leftCount ++;
			},

			/**
			 * 批量添加
			 * @param {Array} urlList
			 **/
			addQueue: function(urlList){
				var _this = this;
				Y.lang.each(urlList, function(url){
					_this.add(url);
				});
			}
		};

		Y.net.ScriptLoader = ScriptLoader;
		var _scl = new ScriptLoader();
		Y.net.loadScript = _scl.load;
	})(Y.net);

	/**
	 * data getter
	 **/
	(function(net){
		var GUID = 0;
		var DataGetter = function(config){
			var _this = this;
			this.config = Y.object.extend(true, {
				url: null,
				callbacker: 'DataGetterCallback'+(GUID++)
			}, config);

			Y.W[this.config.callbacker] = function(data){
				if(!data){
					_this.onError();
				} else {
					_this.onResponse(data);
				}
				Y.W[_this.config.callbacker] = null;
				if(_this.tmpScriptNode){
					_this.tmpScriptNode.parentNode.removeChild(_this.tmpScriptNode);
				}
			};

			if(!this.config.url){
				throw('DATA GETTER PARAM ERROR');
			}
			this.config.url += (this.config.url.indexOf('?')>0 ? '&' : '?') + 'callback='+this.config.callbacker;
		};
		DataGetter.prototype.send = function(){
			this.tmpScriptNode = Y.net.loadScript(this.config.url, function(){
			}, this.config);
		};
		DataGetter.prototype.onError = function(){};
		DataGetter.prototype.onResponse = function(){};

		net.DataGetter = DataGetter;

		net.loadData = function(url, callback){
			var config = {url:url};
			var gd = new DataGetter(config);
				gd.onResponse = callback || Y.emptyFn;
				gd.send();
		};
	})(Y.net);

	/**
	 * 构造请求字符串
	 * @deprecated 当前params仅支持一层结构
	 * @param {Mix} objParam
	 * @return {String}
	**/
	Y.net.buildParam = function(){
		var fixType = function(val){
			return typeof(val) == 'string' || typeof(val) == 'number';
		};
		var data = [];
		Y.lang.each(arguments, function(params){
			if(Y.lang.isArray(params)){
				Y.lang.each(params, function(item){
					if(fixType(item)){
						data.push(item);
					}
				});
			} else if(typeof(params) == 'object'){
				for(var i in params){
					if(fixType(params[i])){
						data.push(i+'='+params[i]);
					}
				}
			} else {
				return params;
			}
		});
		return data.join('&');
	};

	/**
	 * 合并参数
	 * @param {String} url
	 * @param {Mix..} params
	 * @return {String}
	 **/
	Y.net.mergeRequest = function(url /** , params1, params2 **/){
		var params = Y.lang.toArray(arguments);
		if(params.length < 2){
			throw('params count illegle');
		}
		var str = Y.net.buildParam(params.slice(1));
		var url = params[0];
		return url + (url.indexOf('?') >= 0 ? '&' : '?') + str;
	};

	/**
	 * get param
	 * @param  {string} param
	 * @return {string}
	 */
	Y.net.getParameter = function(param, url){
		var r = new RegExp("(\\?|#|&)"+param+"=([^&#]*)(&|#|$)");
	    var m = (url || location.href).match(r);
	    return (!m?"":m[2]);
	}
})(YSL);
