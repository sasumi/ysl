/**
 * QQ视频
 * 由媒体基础类扩展获取
 */
(function(v){
	v.Class('ve.plugin.QzoneVideo:ve.plugin.QzoneMedia', {
		editor: null,
		
		config: {
			baseURL: 'http://'+IMGCACHE_DOMAIN+'/qzone/mall/v5/video/index.html',
			panel: {
				url: null,
				name: '插入视频',
				width: 526,
				height: 450
			},
			cssClassName: 'blog_video',
			disableScale: false,
			defaultVideoWidth: 500,
			defaultVideoHeight: 425
		},
		
		init: function (editor, url) {
			this.editor = editor;
			this.config.panel.url = this.config.baseURL + '?editorid='+this.editor.editorId;

			this.editor.addCommand('showVideoPanel', ve.bind(this,function(){
				top.popupCallback = ve.bind(this, function() {
					var id = this.editor.editorId;
					if(top.g_arrQZEditorReturnVal && top.g_arrQZEditorReturnVal[id]){
						var cache_id = this.setCache(top.g_arrQZEditorReturnVal[id]);
						var w = top.g_arrQZEditorReturnVal[id][4] || this.config.defaultVideoWidth;
						var h = top.g_arrQZEditorReturnVal[id][3] || this.config.defaultVideoHeight;
						var html = (['<img src="/ac/b.gif" alt="视频" cache_id="',cache_id,'" class="',this.config.cssClassName,'" style="width:',w,'px; height:',h,'px"/>']).join('');
						this.insertHtml(html);
					}
					try {
						top.g_arrQZEditorReturnVal[id] = null;	
					} catch(e){};
					this.closePanel();
	           	});
				this.showPanel();
			}));
			this.editor.addButton('VideoButton', {
				to: 'group4',
				at: 1,
				'class': 'veInsertVideo',
				title: '插入视频',
				cmd: 'showVideoPanel'
			});
			
			this.setSetContentFilter(ve.bind(this, function(html){
				return this.onSetContent(html);
			}));
			
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
			str = str.replace(/<object([^>]+)>(.*?)<\/object>/ig, ve.bind(this,function(){
				try {				
					if(/class=("|')*blog_video/i.test(arguments[1])) {
						var res = /(<embed([^>]+)>)/ig.exec(arguments[2]);
						if(!!res) {
							return res[1];
						}
					}
				} catch(err){
					console.log('err', err);
				}
				return arguments[0];
			}));
	
			str = str.replace(/<embed([^>]+)>/ig, ve.bind(this, function(){
				try{				
					if(/class=("|')*blog_video/i.test(arguments[1])) {
						var w = /width="([^"]+)"/i.exec(arguments[1]) || [];
						var h = /height="([^"]+)"/i.exec(arguments[1]) || [];
						var loop = /loop="([^"]+)"/i.exec(arguments[1]) || [];
						var autostart = /autostart="([^"]+)"/i.exec(arguments[1]) || [];
						var autoplay = /autoplay="([^"]+)"/i.exec(arguments[1]) || [];
						var src = /src="([^"]+)"/i.exec(arguments[1]);
						var count = 0;
						
						var data = [count, src[1], loop[1], (w[1]||this.config.defaultVideoWidth), (h[1]||this.config.defaultVideoHeight), autostart[1],autoplay[1]];
						var cache_id = this.setCache(data);
						return (['<img src="/ac/b.gif" class="blog_video" style="width:',(w[1] || this.config.defaultVideoWidth),'px;height:',(h[1]||this.config.defaultVideoHeight),'px;" cache_id="',cache_id,'" />']).join('');
					}
				} catch(err){
					console.log('set content err', err);
				}
				return arguments[0];
			}));
			return str;
		},
		
		onGetUBBContent: function(str){
			str = str.replace(/<embed([^>]+)>/ig, ve.bind(this,function(){
				try{				
					if(/class=("|')*blog_video/i.test(arguments[1])) {
						var w = /width="([^"]+)"/i.exec(arguments[1]) || [];
						var h = /height="([^"]+)"/i.exec(arguments[1]) || [];
						var loop = /loop="([^"]+)"/i.exec(arguments[1]) || [];
						var autostart = /autostart="([^"]+)"/i.exec(arguments[1]);
						var src = /src="([^"]+)"/i.exec(arguments[1]);
						var data = [src[1], loop[1], autostart[1]];
						return "[video,"+(w[1] || this.config.defaultVideoWidth)+","+(h[1] || this.config.defaultVideoHeight)+","+data[1]+","+data[2]+"]" + data[0] + "[/video]";
					}
				} catch(err){
					console.log('qzonevideo onGetUBBContent err', e);
				}
				return arguments[0];
			}));
			return str;
		},
		
		onGetContent: function(html){
			str = html.replace(/<img([^>]+)>/ig, ve.bind(this, ve.bind(this,function(){
				try{				
					if(/class=("|')*blog_video/i.test(arguments[1])) {
						var cache_id = /cache_id="([^"]+)"/i.exec(arguments[1]);
						data = this.getCache(cache_id[1]);
						if(data) {
							var isQQVideo = /^http:\/\/((\w+\.|)(video|v|tv)).qq.com/i.test(data[1]);
	
							var url = (['<embed class="blog_video"',
										' allowNetworking="',(this.isInWhiteList(data[1]) ? 'all" allowScriptAccess="always"' : 'internal"'),
										' id="',Math.random(),'" enableContextMenu="False" ',
										' width="',(data[3] || this.config.defaultVideoWidth),'"',
										' height="',(data[4] || this.config.defaultVideoHeight),'"',
										'loop="',data[2],'" autostart="'+data[5]+'"',
										' showstatusbar="1" invokeURLs="false" src="'+data[1]+'" />']).join('');
							if(!isQQVideo) {
								return url;
							}
							
							return (['<object class="blog_video" id="',Math.random(),'" ',
										'codeBase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=8,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ',
										'width="',(data[3] || this.config.defaultVideoWidth),'" height="',(data[4] || this.config.defaultVideoHeight),'">',
										'<param name="loop" value="',data[2],'" />',
										'<param name="autostart" value="',data[5],'" />',
										'<param name="movie" value="',data[1],'" />',
										'<param name="allowFullScreen" value="true" />',
										'<param name="wmode" value="transparent" />',
										'<param name="allowScriptAccess" value="always" />',
										'<param name="allownetworking" value="all" />',url,
									'</object>']).join('');
						}
					}
				} catch(err){
					console.log('qzonevideo onGetContent', err);
				}
				return arguments[0];
			 })));
			return str;
		},
		
		onInsertUBB: function(str){
			var reg = createRegEX('\\[video,(\\d+|true|false),(\\d+|true|false)(|,(true|false),(true|false))\\](.*?)\\[\\/video\\]', 'ig');
			str = str.replace(reg, ve.bind(this,function(){				
				var w = arguments[3]?arguments[1]:this.config.defaultVideoWidth;
				var h = arguments[3]?arguments[2]:this.config.defaultVideoHeight;
				var r = arguments[3]?arguments[4]:arguments[1]; 					//循环播放
				var a = arguments[3]?arguments[5]:arguments[2]; 					//自动播放
				var data = [0,arguments[6], 'define', w, h, a, r];
				var cache_id = this.setCache(data);
				return '<img src="/ac/b.gif" width="'+w+'" height="'+h+'" class="blog_video" style="width:'+w+'px;height:'+h+'px;" cache_id="'+cache_id+'" />';
			}));
			return str;
		}
	});
	v.plugin.register('qzonevideo', ve.plugin.QzoneVideo);
})(ve);
