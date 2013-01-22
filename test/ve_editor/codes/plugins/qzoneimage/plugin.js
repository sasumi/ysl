/**
 * 插入图片插件
 * 由媒体基础类扩展获取
 */
(function(v){
	v.Class('ve.plugin.QzoneImage:ve.plugin.QzoneMedia', {
		editor: null,
		lastBlogAlbumId: null,
		
		config: {
			baseURL: 'http://'+IMGCACHE_DOMAIN+'/qzone/client/photo/pages/qzone_v4/insert_photo.html#referer=blog_editor',
			blogType: null,
			panel: {
				url: null,
				name: '插入图片',
				width: 610,
				height: 483
			},
			cssClassName: '',
			disableScale: false
		},
		
		init: function (editor, url) {
			this.editor = editor;
			this.config.blogType = 7; //为私密日志传图做准备
			
			this.editor.addCommand('showImagePanel', ve.bind(this,function(){
				QZONE.FP._t.insertPhotoContent = null;
				//业务参数
				this.config.panel.url = ([this.config.baseURL,
					'&blog_type=',this.blogType,
					'&uin=',QZBlog.Util.getSpaceUin(),
					'&albumid=',this.lastBlogAlbumId]).join('');
				this.showPanel();
			}));
			this.editor.addButton('ImageButton', {
				to: 'group4',
				at: 1,
				'class': 'veInsertImage',
				title: '插入图片',
				cmd: 'showImagePanel'
			});
			
			this.setSetContentFilter(ve.bind(this, function(html){
				return this.onSetContent(html);
			}));
			
			this.setInsertUBBParser(ve.bind(this, function(ubb){
				return this.onInsertUBB(ubb);
			}));
		},
		
		/**
		 * 关闭窗口、插入数据回调
		 */
		popupCallback: function(){
			var data = QZONE.FP._t.insertPhotoContent,
				maxWidth = this.editor.getBody().offsetWidth - 20;	//图片最大宽度
			this.lastBlogAlbumId = data.lastAlbumId;
			if(data && data.photos){
				for(var i=0; i<data.photos.length; i++){
					var p = data.photos[i],
						htmls = [],
						width = 0,
						id = '_qzone_image_plugin_id_pre_' + i + Math.random();
					if(p.width){
						width =  p.width > maxWidth ? maxWidth : width;
					}
					
					htmls.push('<img src="',p.url,'" alt="图片" appendurl="1" id="',id,'" ',(width?'style="width:'+width+'px;"':''),'/><br/>');
					if(data.needAlbumName && p.name){
						htmls.push('照片名称：'+p.name+'<br/>');
					}
					if(data.needAlbumName && p.albumName){
						htmls.push('所属相册：'+'<a href="'+p.albumUrl+'">'+p.albumName+'</a><br/>');
					}
					if(data.needPhotoDesc && p.desc){
						htmls.push('照片描述：'+p.desc+'<br/>');
					}
					this.insertHtml(htmls.join(''));
					
					if(!width){
						this.bindImageResize(id, maxWidth);	
					} else {
						this.editor.getDoc().getElementById(id).removeAttribute('id');
					}
				}
			}
			this.closePanel();
			QZONE.FP._t.insertPhotoContent = null;
		},
		
		/**
		 * 重新设定图片宽度
		 * @param {String} id
		 */
		bindImageResize: function(id, maxWidth){
			var img = this.editor.getDoc().getElementById(id);
			var width = img.width || img.offsetWidth || img.clientWidth;

			if(width && width > maxWidth){
				img.style.width = (maxWidth-20) + 'px';
			} else {
				img.onload = function(){
					this.onload = null;
					if(this.width > maxWidth){this.width = maxWidth;}
				};
			}
			img.removeAttribute('id');
		},
		
		/**
		 * 设置内容，兼容原来的 orgsrc形式
		 * TODO 后期完善
		 * @param {String} str
		 * @return {String}
		 */
		onSetContent: function(str){
			var result; 
			try {
				result = str.replace(/(<img[^>].*src=["|'])(.*?)(["|'].*orgsrc=["|'])(.*?)(["|'].*?>)/ig,"$1$4$3$5");
				result = result.replace(/orgsrc=["|'.*?["|']/ig,'');
			} catch(err){
				console.log('qzone image replace error');
			}
			return result || str;
		},
		
		onInsertUBB: function(str){
			try {
				var reg = createRegEX('\\[img\\]http(.[^\\]\\\'\\"]*)\\[\\/img\\]', 'ig');
				str = str.replace(reg, function(){
					var strUrl = arguments[1];
					return '<img appendurl="1" src="http' + strUrl + '" alt="图片" />';
				});
				var reg = createRegEX('ubbResizeImg', '\\[img,(\\d{1,4}),(\\d{1,4})\\]http(.[^\\]\\\'\\"]*)\\[\\/img\\]', 'ig');
				str = str.replace(reg, function(){
				var strUrl = arguments[3];
					var height = arguments[2];
					var width = arguments[1];
					return '<img'+(bAddFlag?' fromubb="1"':'')+' appendurl="1" src="http' + strUrl + '" border="0" width="' + width + '" height="' + height + '" alt="图片" />';
				});
				
				return str;	
			} catch(e){
				console.log(e, 'UBB image log error');
				return str;
			}
		}
	});
	v.plugin.register('qzoneimage', ve.plugin.QzoneImage);
})(ve);
