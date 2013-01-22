/**
 * 图片工具条插件
 * 包括图片混排，插入图片链接
 * TIPS: 当前图文混排结构在IE6下面有点问题
 * @author sasumi
 * @build 20110321
 */
(function(v){
	v.Class('ve.plugin.ImageTools', {
		toolbar: null,
		editor: null,
		_lastImg: null,
		_lastAttr: null,
		
		init: function(editor, url){
			this.editor = editor;
			this.editor.onMouseDown.add(ve.bind(this, function(e){
				var img = QZFL.event.getTarget(e);
				if(img.tagName != 'IMG'){
					this.hideTools();
					return;
				}
				
				if(!this.checkImageEditAviable(img)){
					img.setAttribute("unselectable","on");   
			        img.style.MozUserSelect = "none"; 
			        img.style.MozUserFocus = "ignore";
					img.blur();
					QZFL.event.preventDefault();
					return false;
				} else {
					this.editor.undoManager.add();
					this._lastImg = img;
					this._lastAtrr = {
						width: img.width,
						height: img.height
					}
					this.showTools(img);
					dom.event.add(img, 'mouseup', ve.bind(this, function(){
						if(this._lastImg){
							if(this._lastImg.width != this._lastAtrr.width || this._lastImg.height != this._lastAtrr.height){
								this.editor.undoManager.add();
							}
							dom.event.remove(this._lastImg, 'mouseup', arguments.callee);
							this._lastImg = null;
							this._lastAtrr = null;
						}
					}));
				}
			}));
			
			this.editor.onKeyDown.add(ve.bind(this, function(e){
				if(e && e.keyCode == 46){
					this.hideTools();
				}
			}));
		},
		
		/**
		 * 过滤可编辑图片格式
		 * @param {Object} node
		 * @return {Object}
		 */
		checkImageEditAviable: function(node){
			if( !node.tagName == 'IMG' ||
				/em\/e(\d{1,3}).gif/i.test(node.src) ||	//表情 
				/blog_music/i.test(node.className) 	//音乐
			){
				return false;
			}
			
			return true;
		},
		
		/**
		 * 禁止编辑器缩放图片
		 */
		disableScale: function(tag){
			if(!tag || tag.tagName != 'IMG'){
				return;
			}
		},
		
		/**
		 * 显示工具条
		 * @param {Object} img
		 */
		showTools: function(img){
			if(!this.toolbar){
				this.toolbar = QZFL.dom.createElementIn('div');
				this.toolbar.className = 'qzEditor_tips pic_tips';
				this.toolbar.innerHTML = ([
					'<ul class="pic_function" id="qzEditor_tips_pic_function">',
						'<li class="father_button pic_position"><a title="编辑图片位置" class="main_btn first" href="javascript:;"><span class="icon_sprite icon_pic_position"></span><em class="none">编辑图片位置</em></a>',
							'<ol class="dropdown_functions">',
								'<li><a href="javascript:;" id="_pic_func_align_reset"><span class="icon_sprite icon_pic_reset"></span><em class="text_intro">默认</em></a></li>',
								'<li><a href="javascript:;" id="_pic_func_align_left"><span class="icon_sprite icon_pic_left"></span><em class="text_intro">居左</em></a></li>',
								'<li><a href="javascript:;" id="_pic_func_align_center"><span class="icon_sprite icon_pic_center"></span><em class="text_intro">居中</em></a></li>',
								'<li><a href="javascript:;" id="_pic_func_align_right"><span class="icon_sprite icon_pic_right"></span><em class="text_intro">居右</em></a></li>',
								'<li><a href="javascript:;" id="_pic_func_align_round_left"><span class="icon_sprite icon_pic_left_round"></span><em class="text_intro">居左环绕</em></a></li>',
								'<li><a href="javascript:;" id="_pic_func_align_round_right"><span class="icon_sprite icon_pic_right_round"></span><em class="text_intro">居右环绕</em></a></li>',
							'</ol>',
						'</li>',
						'<li class="father_button pic_link "><a class="main_btn" title="插入图片链接地址" href="javascript:;"><span class="icon_sprite icon_pic_link"></span><span class="none">插入图片链接地址</span></a>',
							'<div class="dropdown_functions pic_link_item "><strong class="title">链接地址:</strong><input type="text" class="url" id="_pic_func_link" value="http://" style="width:160px"/> <input type="button" value="确定" id="_pic_func_btn" /></div>',
						'</li>',
					'</ul>'
				]).join('');
				var btns = dom.get('qzEditor_tips_pic_function').getElementsByTagName('A');
				for(var i=0; i<btns.length; i++){
					if(dom.hasClass(btns[i], 'main_btn')){
						dom.event.add(btns[i].parentNode, 'mouseover', function(){dom.addClass(this, 'current');});
						dom.event.add(btns[i].parentNode, 'mouseout', function(){dom.removeClass(this, 'current')});
					}
				}
			}

			//绑定调整位置事件
			var _this = this;
			dom.event.add(dom.get('_pic_func_align_reset'), 'click', function(){_this.setImageAlign(img);});
			dom.event.add(dom.get('_pic_func_align_left'), 'click', function(){_this.setImageAlign(img, 'left');});
			dom.event.add(dom.get('_pic_func_align_center'), 'click', function(){_this.setImageAlign(img, 'center');});
			dom.event.add(dom.get('_pic_func_align_right'), 'click', function(){_this.setImageAlign(img, 'right');});
			dom.event.add(dom.get('_pic_func_align_round_left'), 'click', function(){_this.setImageAlign(img, 'roundLeft');});
			dom.event.add(dom.get('_pic_func_align_round_right'), 'click', function(){_this.setImageAlign(img, 'roundRight');});
			
			//初始化链接事件
			this.initLink(img);
			this.updateToolsPosition(img);
		},
		
		/**
		 * 初始化链接事件
		 * @param {Object} img
		 */
		initLink: function(img){
			if(img.parentNode.tagName == 'A'){
				dom.get('_pic_func_link').value = img.parentNode.href;
			}
			dom.event.add(dom.get('_pic_func_link'), 'keydown', ve.bind(this,function(e){
				var e = e || window.event;
				if(e.keyCode == 13){
					this.setLink(img, dom.get('_pic_func_link').value);
				}
			}));
			dom.event.add(dom.get('_pic_func_btn'), 'click', ve.bind(this,function(){
				this.setLink(img, dom.get('_pic_func_link').value);
			}));
		},
		
		/**
		 * 设置链接
		 * @param {Object} img
		 * @param {Object} link
		 */
		setLink: function(img, link){
			this.editor.undoManager.add();
			if(link == '' && img.parentNode.tagName == 'A'){
				_pn = img.parentNode;
				img.ownerDocument.body.appendChild(img);
				QZFL.dom.swapNode(img, _pn);
				_pn.parentNode.removeChild(_pn);
			} else if(img.parentNode.tagName == 'A'){
				img.parentNode.href = link;
			} else {
				var a = img.ownerDocument.createElement('A');
				img.ownerDocument.body.appendChild(a);
				a.href = link;
				a.target = '_blank';
				QZFL.dom.swapNode(img,a);
				a.appendChild(img);
			}
		},
		
		/**
		 * 设置图片排版方式
		 * @param {Object} img
		 * @param {String} align
		 */
		setImageAlign: function(img, align){
			var updateStyle = {};
			switch(align){
				case 'left':
					updateStyle = {'marginRight':'auto', 'display':'block'};
					break;
				case 'right':
					updateStyle = {'marginLeft':'auto', 'display':'block'};
					break;
				case 'center':
					updateStyle = {'marginLeft':'auto', 'marginRight':'auto', 'display':'block'};
					break;
				case 'roundLeft':
					updateStyle = {'float':'left'};
					break;
				case 'roundRight':
					updateStyle = {'float':'right'};
					break;
			}
			var clearStyle = {'marginLeft':0,'marginRight':0,'float':'none','display':''};
			dom.setStyles(img,clearStyle);
			dom.setStyles(img,updateStyle);
			this.updateToolsPosition(img);
			this.editor.undoManager.add();
			QZFL.event.preventDefault();
			return false;
		},
		
		/**
		 * 隐藏工具条
		 */
		hideTools: function(){
			if(this.toolbar){
				this.toolbar.style.display = 'none';
			}
		},
		
		/**
		 * 更新工具条位置
		 */
		updateToolsPosition: function(img){
			var toolbarRegion = dom.getRegion(this.toolbar),
				iframeRegion = dom.getRegion(this.editor.iframeElement),
				imgRegion = dom.getRegion(img);
			var styles = {
				display:'block',
				position:'absolute',
				top: iframeRegion.top+imgRegion.top,
				left: iframeRegion.left+imgRegion.left
			};
			for(var i in styles){
				dom.setStyle(this.toolbar, i, styles[i]);
			}
		}
	});
	v.plugin.register('imagetools', ve.plugin.ImageTools);
})(ve);
