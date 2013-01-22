/**
 * QQ音乐
 * 由媒体基础类扩展获取
 */
(function(v){
	v.Class('ve.plugin.QzoneMusic:ve.plugin.QzoneMedia', {
		editor: null,
		
		config: {
			baseURL: 'http://'+IMGCACHE_DOMAIN+'/music/musicbox_v2_1/doc/blog_add_song.html',
			panel: {
				url: null,
				name: '插入音乐',
				width: 640,
				height: 330
			},
			pUrl: '',
			pAlbumId: '',
			cssClassName1: 'blog_music',
			cssClassName2: 'blog_music_multiple',
			
			disableScale: true
		},
		
		/**
		 * 初始化
		 * @param {Object} editor
		 * @param {String} url
		 */
		init: function (editor, url) {
			this.editor = editor;
			this.config.panel.url = this.config.baseURL + '?editorid='+this.editor.editorId;

			this.editor.addCommand('showMusicPanel', ve.bind(this,function(){
				top.popupCallback = ve.bind(this, function() {
					var id = this.editor.editorId;
					if(top.g_arrQZEditorReturnVal && top.g_arrQZEditorReturnVal[id]){
						var data = top.g_arrQZEditorReturnVal[id];
						var arr = data.split("|");
						var cache_id = this.setCache(data);
						var html = '<img src="/ac/b.gif" alt="音乐" cache_id="'+cache_id+'" class="'+(arr.length>7?this.config.cssClassName2:this.config.cssClassName1)+'" onresizestart="return false;"/>&nbsp;';
						this.insertHtml(html);	
					}
					try {
						top.g_arrQZEditorReturnVal[id] = null;	
					} catch(e){};
					this.closePanel();
	           	});
				this.showPanel();
			}));
			
			this.editor.addButton('MusicButton', {
				to: 'group4',
				at: 1,
				'class': 'veInsertMusic',
				title: '插入音乐',
				cmd: 'showMusicPanel'
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
		
		/**
		 * 日志原文HTML转换到编辑状态
		 * @param {String} html
		 * @return {String}
		 */
		onSetContent: function(html){
			try {
				str = html.replace(/<object([^>]+)>(.*?)<\/object>/ig,ve.bind(this,function(){
					try{				
						if(/class=("|')*blog_music/i.test(arguments[1])) {
							var data = / ubb="([^"]+)"/i.exec(arguments[1]);
							var arr = data[1].split("|");
							var cache_id = this.setCache(data[1]);
							return '<img src="/ac/b.gif" alt="音乐" cache_id="'+cache_id+'" class="'+(arr.length>7?this.config.cssClassName2:this.config.cssClassName1)+'" onresizestart="return false;"/>';
						}
					} catch(err){
						console.log('qzonemusic onSetContent err ', err);
					}
					return arguments[0];
				 }));
			} catch(e){
				console.log('qzonemusic onSetContent err', e);
			}
			return str || html;
		},
		
		/**
		 * 转换HTML到UBB
		 * @param {String} str
		 * @return {String}
		 */
		onGetUBBContent: function(str){
			try {
				str = str.replace(/<object([^>]+)>(.*?)<\/object>/ig,function(){
					try{				
						if(/class=("|')*blog_music/i.test(arguments[1])) {
							var data = / ubb="([^"]+)"/i.exec(arguments[1]);
							return "[music]" + data + "[/music]";
						}
					} catch(err){}
					return arguments[0];
				 });
			} catch(e){
				console.log('qzonemusic onGetUBBContent err', e);
			}
			return str;
		},
		
		/**
		 * 转换UBB到HTML
		 * @param {String} str			UBB字串
		 * @param {Boolean} bAddFlag	UBB标记
		 * @return {String}
		 */
		onInsertUBB: function(str, bAddFlag){
			var _this = this;
			
			var reg = createRegEX('\\[music\\](.*?)\\[\\/music\\]', 'ig')
			str = str.replace(reg,function(){
				var arr = arguments[1].split("|");
				var isMultiple = (arr.length > 7 ? true : false);
				var cache_id = this.setCache(arguments[1]);				
				return '<img src="/ac/b.gif" alt="音乐" cache_id="'+cache_id+'" class="'+(arr.length>7?this.config.cssClassName2:this.config.cssClassName1)+'" onresizestart="return false;"/>';
			});
			
			var audioReg = createRegEX('\\[audio,(true|false),(true|false),(true|false)](.*?)\\[\\/audio\\]', 'ig');
			str = str.replace(audioReg,function(){
					var data = [arguments[4], arguments[1], arguments[2], arguments[3]]; // 顺序？历史遗留ubb标签
		   			var cache_id = _this.setCache(data.join('|'));
					return '<img src="/ac/b.gif" class="blog_audio" cache_id="'+cache_id+'" />'
				}
			);
			
			return str;
		},
		
		/**
		 * 转换IMG标签到FLASH标签,
		 * 主要提供给预览和内容存储的时候使用
		 * @param {String} str
		 * @return {String}
		 * 
		 */
		onGetContent: function(str){
			var count = 0;
			str = str.replace(/<img([^>]+)>/ig,ve.bind(this,function(){
				try {
					if(/class=("|')*blog_music/i.test(arguments[1])) {
						var cache_id = /cache_id="([^"]+)"/i.exec(arguments[1]);	
						var data = this.getCache(cache_id[1]);
						++count;
						var arr = data.split("|");
						
						/***
						return (['<embed class="blog_music"',
							' allowNetworking="all" allowScriptAccess="always"',
							' id="'+Math.random()+'" enableContextMenu="False"',
							(' width="'+((arr.length > 7) ? 440 : 410)+'"'),
							(' height="'+((arr.length>7) ? 190 : 100)+'"'),
							' autostart="false"',
							' ubb="',data,'"',
							' showstatusbar="1" invokeURLs="false" src="http://'+IMGCACHE_DOMAIN+'/music/musicbox_v2_1/img/MusicFlash.swf" />']).join('');
						****/
						
						return '<object codeBase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=8,0,0,0" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+((arr.length > 7) ? 440 : 410)+
							'" height="'+((arr.length>7) ? 190 : 100)+'" src="'+"http://"+IMGCACHE_DOMAIN+"/music/musicbox_v2_1/img/MusicFlash.swf"+
							'" bgcolor="#ffffff" scale="showall" menu="true" allowScriptAccess="always" name="musicFlash**" id="'+"musicFlash"+(count-1)+
							'" ubb="'+data+'" class="blog_music"><param name="movie" value="http://'+IMGCACHE_DOMAIN+'/music/musicbox_v2_1/img/MusicFlash.swf" />'+
							'<param name="bgColor" value="#ffffff" /><param name="scale" value="showall" /><param name="wmode" value="transparent" /><param name="menu" value="true" />' + 
							'<param name="allowScriptAccess" value="always" /></object>';					
					}
				} catch(err) {
					console.log('qzone music ongetContent error', err);
				}
				return arguments[0];
			}));
			return str;
		}
	});
	v.plugin.register('qzonemusic', ve.plugin.QzoneMusic);
})(ve);
