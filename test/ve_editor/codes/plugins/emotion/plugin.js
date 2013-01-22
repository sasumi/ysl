/**
 * SOSO表情插件
 * @author sasumi
 * @build 20110321
 */
(function(v){
	v.Class('ve.plugin.Emotion:ve.plugin.QzoneMedia', {
		bEmotionLoaded: false,
		btnElement: null,
		editor: null,
		jsPath: 'http://image.soso.com/js/sosoexp_platform.js',
		
		init: function (editor, url) {
			this.editor = editor;
			this.editor.addCommand('showEmotionPanel', ve.bind(this,function (ed, btn) {
				this.btnElement = btn;
				this.show();
				QZFL.event.preventDefault();
				return false;
			}));
			this.editor.addButton('showEmotionPanel', {
				to: 'group4',
				at: 2,
				'class': 'veEmotion',
				title: '表情',
				cmd: 'showEmotionPanel'
			});
			this.editor.onClick.add(ve.bind(this, function(){this.hide()}));
			this.setInsertUBBParser(ve.bind(this, function(ubb){
				return this.onInsertUBB(ubb);
			}));
		},
		
		show: function(){
			var _this = this;
			
			//木有加载过文件
			if(typeof SOSO_EXP !== "object"){
				QZFL.imports(this.jsPath, function(){
					if(typeof SOSO_EXP === "object") {
						SOSO_EXP.Register(30001, 'qzone', _this.btnElement, 'bottom', _this.editor, function(a,b){
							b = b.replace(/^http:\/\/cache.soso.com\/img\/img\/e(\d{1,3}).gif/gi, "/qzone/em/e$1.gif");  // 替换默认表情
							a.setContent('<img src="'+b+'"/>');
						});
						_this.btnElement.setAttribute('binded', '1');
						SOSO_EXP.Platform.popupBox(_this.btnElement);
					}
				});
			}
			
			//木有绑定过事件
			else if(!_this.btnElement.getAttribute('binded')){
				SOSO_EXP.Register(30001, 'qzone', _this.btnElement, 'bottom', _this.editor, function(a,b){
					b = b.replace(/^http:\/\/cache.soso.com\/img\/img\/e(\d{1,3}).gif/gi, "/qzone/em/e$1.gif");	//替换默认表情
					var r = a.setContent('<img src="'+b+'"/>');
				});
				SOSO_EXP.Platform.popupBox(_this.btnElement);
			}
		},
		
		/**
		 * 隐藏表情，由于表情那边木有提供相关关闭窗口的接口，
		 * 当前只能这么干干了。
		 */
		hide: function(){
			if(typeof(SOSO_EXP) == 'object'){
				SOSO_EXP.Platform.hideBox();
			}
		},
		
		onInsertUBB: function(str){
			try {
				var reg = createRegEX('\\[em\\]e(\\d{1,3})\\[\\/em\\]', 'ig');
				str = str.replace(reg, '<img src="/qzone/em/e$1.gif" onresizestart="return false;">');
				return str;	
			} catch(e){
				console.log('UBB emotion log error');
				return str;
			}
		}
	});
	v.plugin.register('emotion', ve.plugin.Emotion);
})(ve);