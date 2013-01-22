/**
 * QQ视频
 * 由媒体基础类扩展获取
 */
(function(v){
	v.Class('ve.plugin.QzoneFlash:ve.plugin.QzoneMedia', {
		editor: null,
		
		config: {
			baseURL: 'http://'+IMGCACHE_DOMAIN+'/qzone/newblog/v5/editor/dialog/flash.html',
			panel: {
				url: null,
				name: '插入Flash动画',
				width: 430,
				height: 233
			},
			pUrl: '',
			pAlbumId: '',
			cssClassName: 'blog_flash',
			
			disableScale: false
		},
		
		init: function (editor, url) {
			this.editor = editor;
			this.config.panel.url = this.config.baseURL + '?editorid='+this.editor.editorId;

			this.editor.addCommand('showFlashPanel', ve.bind(this,function(){
				top.popupCallback = ve.bind(this, function() {
					var id = this.editor.editorId;
					if(top.g_arrQZEditorReturnVal && top.g_arrQZEditorReturnVal[id]){
						var data = top.g_arrQZEditorReturnVal[id];
						var w = (data[3] ? data[3] : "520");
						var h = (data[2] ? data[2] : "425");
						var left = (data[4] ? data[4] : null);
						var _top = (data[5] ? data[5] : null);
						var cache_id = this.setCache(data);
						var style = _top ? ';position:absolute; top:'+_top+'px'+';left:'+left+'px;' : '';
						html = '<img src="/ac/b.gif" alt="flash" class="'+this.config.cssClassName+'" style="width:'+w+'px;height:'+h+'px;'+style+'" cache_id="'+cache_id+'" />';
						this.insertHtml(html);
					}
					
					try {
						top.g_arrQZEditorReturnVal[id] = null;	
					} catch(e){
						console.log(e);
					};
					this.closePanel();
	           	});
				
				this.showPanel();
			}));
			this.editor.addButton('VideoButton', {
				to: 'group4',
				at: 1,
				'class': 'veInsertFlash',
				title: '插入Flash动画',
				cmd: 'showFlashPanel'
			});
			
			this.setSetContentFilter(ve.bind(this, function(html){
				return this.onSetContent(html);
			}))
			
			this.setGetUBBContentParser(ve.bind(this, function(html){
				return this.onGetUBBContent(html);
			}));

			this.setGetContentFilter(ve.bind(this, function(html){
				return this.onGetContent(html);
			}));
			
			this.setInsertUBBParser(ve.bind(this, function(ubb){
				return this.onInsertUBB(ubb);
			}));
		},
		
		onSetContent: function(str){
			var _this = this;
			str = str.replace(/<object([^>]+)>(.*?)<\/object>/ig, function(){
				try {				
					if(/class=("|')*blog_(qqVideo|flash)/i.test(arguments[1])) {
						var res = /(<embed([^>]+)>)/ig.exec(arguments[2]);
						if(!!res) {
							return res[1];
						}
					}
				} catch(err){}
				return arguments[0];
			});
	
			str = str.replace(/<embed([^>]+)>/ig,function(){
				try{
					if(/class=("|')*blog_(qqVideo|flash)/i.test(arguments[1])) {
						var className = /class=("|')*blog_(qqVideo|flash)/i.exec(arguments[1]);
						var width = /width="([^"]+)"/i.exec(arguments[1]) || [];
						var height = /height="([^"]+)"/i.exec(arguments[1]) || [];
						var src = /src="([^"]+)"/i.exec(arguments[1]) || [];
						var _top = /top\:([^px])/i.exec(arguments[1]) || [];
						var left = /left:([^px])/i.exec(arguments[1]) || [];
						
						var data = [src[1],'auto',width[1],height[1],'false',left[1],_top[1]];
						var absStyle = _top[1] ? ';position:absolute; top:'+_top[1]+'px'+';left:'+left[1]+'px;' : '';
						var cache_id = _this.setCache(data);
						return '<img src="/ac/b.gif" class="blog_'+className[2]+'" style="width:'+(width[1]==0?400:width[1])+'px;height:'+(height[1]==0?300:height[1])+'px;'+ absStyle+'" cache_id="'+cache_id+'" />';
					}
				} catch(err){
					console.log('error', err);
				}
				return arguments[0];
			 });
			 return str;
		},
		
		onGetUBBContent: function(str){
			str = str.replace(/<object([^>]+)>(.*?)<\/object>/ig, function(){
				try {				
					if(/class=("|')*blog_(qqVideo|flash)/i.test(arguments[1])) {
						var res = /(<embed([^>]+)>)/ig.exec(arguments[2]);
						if(!!res) {
							return res[1];
						}
					}
				} catch(err){}
				return arguments[0];
			});
			
			str = str.replace(/<embed([^>]+)>/ig,function(){
				try{
					if(/class=("|')*blog_(qqVideo|flash)/i.test(arguments[1])) {
						var className = /class=("|')*blog_(qqVideo|flash)/i.exec(arguments[1]);
						var width = /width="([^"]+)"/i.exec(arguments[1]);
						var height = /height="([^"]+)"/i.exec(arguments[1]);
						var src = /src="([^"]+)"/i.exec(arguments[1]);
						var _top = /top\:([^px])/i.exec(arguments[1]);
						var left = /left:([^px])/i.exec(arguments[1]);
						var data = [src,'auto',width,height,'false',left,_top];
						var absStyle = _top ? ';position:absolute; top:'+_top+'px'+';left:'+left+'px;' : '';
						
						var ubbstr = ([
							'[flasht,',(data[3] ? data[3] : "520"),',',(data[2] ? data[2] :'425'),
							(data[5] ? data[5]+',':''),
							(data[6] ? data[6]+',':''),
							']',data[0],'[/flasht]'
						]).join('');
			 			return ubbstr;
					}
				} catch(err){
					console.log('onGetUBBContent err', err);
				}
				return arguments[0];
			});
			return str;
		},
		
		onGetContent: function(str){
			str = str.replace(/<img([^>]+)>/ig,ve.bind(this, function(){
				try{
					if(/class=("|')*blog_(qqVideo|flash)/i.test(arguments[1])) {
						var className = /class=("|')*blog_(qqVideo|flash)/i.exec(arguments[1]);
						var cache_id = /cache_id="([^"]+)"/i.exec(arguments[1]);
						data = this.getCache(cache_id[1]);
						var src = data && data[0];
						
						if(src) {
							var w = /WIDTH(:|=|: )(\d{1,3})/i.exec(arguments[1]);
							var h = /HEIGHT(:|=|: )(\d{1,3})/i.exec(arguments[1]);
							
							var flag = this.isInWhiteList(src);
							var isQQSound = /qzone\/flashmod\/ivrplayer\/ivrplayer.swf/i.test(src);
							var isQQVideo = /^http:\/\/((\w+\.|)(video|v|tv)).qq.com/i.test(src);
							var left = data[5];
							var _top = data[6];
							
							var style = left ? ' style="position:absolute;left:'+left+'px; top:'+_top+'px"' : '';
							
							var html = '<embed class="blog_'+className[2]+'" id="'+Math.random()+'" menu="false" invokeURLs="false" allowNetworking="'+(flag?'all':'internal')+'" allowFullScreen="'+
								(flag?'true':'false')+'" allowscriptaccess="'+(flag?'always':'never')+'"'+((isQQSound&&flag) ? (' flashvars="autoplay=1"') : '')+' wmode="transparent" src="'+src+'" ' + (h ? ' height="'+h[2]+'"' : '') + (w ? ' width="'+w[2]+'" ' : '')+ (!isQQVideo ? style : '') + '/>';
						
							if(isQQVideo) {
								return '<object class="blog_'+className[2]+'" id="'+Math.random()+'" codeBase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=8,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' + (w ? ' width="'+w[2]+'"' : '') + (h ? ' height="'+h[2]+'"' : '') + style + '>'+
									'<param name="movie" value="'+src+'" /><param name="wmode" value="transparent" /><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allownetworking" value="all" />'+html+'</object>';
							}
							return html;
						}
					}
				} catch(err){
					console.log('onGetContent ERR',err);
				}
				return arguments[0];
			 }));
			 return str;
		},
		
		onInsertUBB: function(str, bAddFlag){
			var _this = this;
			
			var reg = createRegEX('\\[flasht(|,(\\d+),(\\d+)),(\\d+)),(\\d+))\\](.*?)\\[\\/flasht\\]', 'ig');
			var regIsQQVideo = createRegEX('http:\\/\\/((\\w+\\.|)(video|v|tv)).qq.com', 'i');
			
			str = str.replace(reg,
				function(){
					var w = (arguments[1] ? arguments[1] : "520");
					var h = (arguments[2] ? arguments[2] : "425");
					var left = (arguments[3] ? arguments[3] : null);
					var _top = (arguments[4] ? arguments[5] : null);
					var src = arguments[5];
					var data = [src,'auto',w,h,'false',left,_top];
					var cache_id = _this.setCache(data);
					var style = _top ? ';position:absolute; top:'+_top+'px'+';left:'+left+'px;' : '';
					return '<img src="/ac/b.gif" class="blog_'+(regIsQQVideo.test(arguments[4])?"qqVideo":"flash")+'" style="'+style+' width:'+w+'px;height:'+h+'px;" cache_id="'+cache_id+'" />';
				}
			);
			return str;
		}
	});
	v.plugin.register('qzoneflash', ve.plugin.QzoneFlash);
})(ve);
