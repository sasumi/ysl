/**
 * QQ秀泡泡
 * 由媒体基础类扩展获取
 */
(function(v){
	v.Class('ve.plugin.QzoneQQShowBubble:ve.plugin.QzoneMedia', {
		editor: null,
		
		config: {
			baseURL: 'http://ptlogin2.qq.com/showbub?uin='+QZONE.cookie.get('zzpaneluin')+'&clientkey='+QZONE.cookie.get('zzpanelkey'),
			panel: {
				url: null,
				name: '插入QQ秀泡泡',
				width: 900,
				height: 505
			},
			pUrl: '',
			pAlbumId: '',
			cssClassName: '',
			disableScale: true,
			cacheKeyPre: 'image_'
		},
		
		init: function (editor, url) {
			this.editor = editor;
			this.editor.addCommand('showQQShowBubblePanel', ve.bind(this,function(){
				this.config.panel.url = this.config.baseURL + (!!this.config.pUrl ? ('&url='+this.config.pUrl.URLencode()) : '')+(!!this.config.pAlbumId ? ("&albid="+this.config.pAlbumId) : '');
				
				/**
				 * 业务回调
				 * @param {String} url 		泡泡图片URL
				 * @param {Integer} width	图片宽度
				 * @param {Integer} height	图片高度
				 * @param {String} sContent	泡泡文字内容
				 */
				parent._tempQFCallback = ve.bind(this, function(url, width, height, sContent){
					var html = '<img src="'+url+'" transimg="1" alt="'+sContent+'" style="height:'+height+'px; width:'+width+'px"/>'
					this.insertHtml(html);
					this.closePanel();
				})
				this.showPanel();
			}));
			
			//添加按钮
			this.editor.addButton('QQShowBubbleButton', {
				to: 'group4',
				at: 1,
				'class': 'veInsertQQShowBubble',
				title: '插入QQ秀泡泡',
				cmd: 'showQQShowBubblePanel'
			});
			
			//设置过滤器
			this.setInsertUBBParser(this.onInsertUBB);
		},
				
		onInsertUBB: function(str, bAddFlag){
			var regEx = createRegEX('\\[qqshow,(\\d{1,3}),(\\d{1,3}),(\\d{1,3}),(\\d{1,3})(,(.*?)|)\\]http(.[^\\]\\\'\\"]*)\\[\\/qqshow\\]','ig');
			str = str.replace(regEx, '<img content="$6" style="width:$1 px;height:$2 px;" src="http$7" />');
			return str;
		}
	});
	v.plugin.register('qzoneqqshowbubble', ve.plugin.QzoneQQShowBubble);
})(ve);