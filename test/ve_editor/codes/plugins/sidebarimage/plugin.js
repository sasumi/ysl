/**
 * 图片侧边栏工具
 * 这个估计有点依赖QZONE环境，主要集中在相册那边的代码能够独立的问题
 * @author sasumi
 * @build 20110331
 */
(function(v){
	v.Class('ve.plugin.SidebarImage', {
		btnElement: null,
		editor: null,
		
		panel: null,
		bPanelVisibile: false,
		preIdFlag: 'sidebar_upload_img_',
		src: '/qzone/photo/blog/insert_photo.htm',
		
		panelAttr: {
			id: 'sidebarImageUploader',
			style: 'display:block; position:absolute; z-index:112; overflow:hidden; width:240px; height:533px; background:white; border:1px solid #D9D9D9'	
		},
		
		init: function (editor, url) {
			this.editor = editor;
			this.editor.addCommand('toggleSidebarImagePanel', ve.bind(this,function (ed, btn) {
				this.btnElement = btn;
				this.togglePanel();
			}));
			this.editor.addButton('showSidebarImagePanel', {
				to: 'groupRight',
				at: 2,
				'class': 'veSidebarImage',
				title: '插入图片',
				cmd: 'toggleSidebarImagePanel'
			});
			v.CSSLoader.load(new ve.util.Path().toAbs('plugins/sidebarimage/css/style.css'));
			
			//兼容旧版
			if(!QZFL.widget.sidebarImage){
				QZFL.widget.sidebarImage = this;
			}
		},
		
		/**
		 * 显示侧边栏插图面板
		 */
		showPanel: function(){
			this._bindLayoutChangeEvent();
			if(!this.panel){
				this.panel = QZFL.dom.createElementIn('div', null, null, this.panelAttr);
				this.panel.innerHTML = '<iframe src="'+this.src+'" frameborder="no" style="width:100%;height:100%"></iframe>';
			}
			this.panel.style.display = 'block';
			var btnRegion = QZFL.dom.getPosition(this.btnElement),
				panelRegion = QZFL.dom.getPosition(this.panel);
			this.panel.style.top = (btnRegion.top + btnRegion.height + 3)+'px';
			this.panel.style.left = (btnRegion.left+btnRegion.width-panelRegion.width)+'px';
			this.bPanelVisibile = true;
			QZFL.css.addClassName(this.btnElement.parentNode, 'veSidebarImage_active');
		},
		
		hidePanel: function(){
			if(this.panel){
				this.panel.style.display = 'none';
			}
			this.bPanelVisibile = false;
			QZFL.css.removeClassName(this.btnElement.parentNode, 'veSidebarImage_active');
		},
		
		togglePanel: function(el){
			if(this.bPanelVisibile){
				this.hidePanel(el);
			} else {
				this.showPanel(el);
			}
			return this.bPanelVisibile;
		},
		
		/**
		 * 绑定layout改变事件
		 */
		_bindLayoutChangeEvent: function(){
		},
		
		getUploadPanelDocument: function(){
			var iframe = this.panel.getElementsByTagName('iframe')[0];
			return iframe.contentDocument || iframe.document;
		},
		
		getUploadPanelWindow: function(){
			var iframe = this.panel.getElementsByTagName('iframe')[0];
			return iframe.contentWindow;
		},
		
		/**
		 * 插入图片
		 * @param {Object} imgData
		 */
		insertImage: function(imgData){
			var html = '';
			
			if(!imgData || !imgData.photos.length || !imgData.from){
				return false;
			}
			
			//来自相册的图片
			if(imgData.from == 'album'){
				for(var i=0; i<imgData.photos.length; i++){
					html += (['<img src="',imgData.photos[i].url,'" alt="图片" />']).join('');
				}
				this.editor.setContent(html);
			}
			
			//本地上传图片
			else if(imgData.from == 'local'){
				for(var i=0; i<imgData.photos.length; i++){
					if(this.doUploadFile(imgData.photos[i])){
						html += (['<img src="/ac/b.gif" alt="图片" isuploadingimage="true" class="progress progress-0" id="',this.preIdFlag,imgData.photos[i].id,'"/>']).join('');;	
					}
				}
				if(html == ''){
					return null;
				}
				
				this.editor.setContent(html);
				if(ve.isIE){
					for(var i=0; i<imgData.photos.length; i++){
						var img = doc.getElementById(this.preIdFlag+imgData.photos[i].id);
						if(img){
							dom.event.add(img, 'resizestart', function(e){
								dom.event.cancel(e);
								return false;
							});
						}
					}
				}
			} else {
				return false;
			}
			return true;
		},
		
		/**
		 * 上传图片命令
		 * @param {Object} photo
		 */
		doUploadFile: function(photo){
			try {
				this.getUploadPanelWindow().ActObj.uploadFile(photo.id, photo.pre);
			} catch(e){
				alert(e);
			}
			return true;
		},
		
		/**
		 * 更新上传图片完成百分比
		 * @param {String} id	图片id
		 * @param {Integer} imgData	图片对象数据 {ret, url, p} 其中 ret == 0为正常，url在petcent=100时才会有
		 */
		updateImageState: function(id, imgData){
			if(imgData.ret != 0){
				return false;
			}
			imgData.p = parseInt(imgData.p, 10);
			var img = this.editor.getDoc().getElementById(this.preIdFlag+id);
			
			if(img){
				if (imgData.p == 100) {
					img.src = imgData.url;
					img.removeAttribute('id');
					img.removeAttribute('style');
					img.className = '';
					img.removeAttribute('isuploadingimage');	//FF
					dom.event.remove(img, 'resizestart');	//IE
				} else {
					if(imgData.p <= 20){
						img.className = 'progress progress-0';
					} else if(imgData.p <= 40){
						img.className = 'progress progress-40';
					} else if(imgData.p <= 60){
						img.className = 'progress progress-60';
					} else if(imgData.p <= 80){
						img.className = 'progress progress-80';
					}
					
					//容错
					else {
						img.className = 'progress progress-0';
					}
				}
			}
		}
	});
	v.plugin.register('sidebarimage', ve.plugin.SidebarImage);
})(ve);
