(function(v) {
	var is = ve.is, each = ve.each, isIE = ve.isIE, dom = ve.DOM, toolbarrows;
	function loadColorPickerTo(ed, n, cmd) {
		var sc = new ve.net.ScriptLoader();
		var callback = function () {
			var opt = {
				defaultTab: 0,
				needFloat: true,
				realtime: false,
				cssText : ''
			};
			var pickerButton = new QZFL.widget.ColorPicker(n, function(color){
				ed.editorcommands.execCommand(cmd, false, color);
				
			}, opt);
			pickerButton.show();
			
			ed.onClick.add(function() {
				pickerButton.hide();
			});

			ed.onBeforeOpenListBox.add(function() {
				pickerButton.hide();
			});
		};
		if (!QZFL.widget.ColorPicker) {
			sc.load('http://qzs.qq.com/ac/qzone/qzfl/lc/qzfl.widget.colorpicker.js', {
				callback: callback 
			});
		}
		else {
			callback();
		}
	};
	
	/**
	 * 前景色
	 */
	v.Class('ve.plugin.ForeColor', {
		init: function (editor, url) {
			var t = this;
			t.editor = editor;
			t.editor.addCommand('ForeColor', function (ed, n) {
				loadColorPickerTo(ed, n, 'setForeColor');
			});
			t.editor.addButton('setForeColor', {
				to: 'group2',
			//	at: 1,
				'class': 'veForeColor',
				title: '设置文本颜色',
				cmd: 'ForeColor'
			});
		}
	});
	v.plugin.register('forecolor', ve.plugin.ForeColor);

	/**
	 * 背景色
	 */
	v.Class('ve.plugin.BackColor', {
		init: function (editor, url) {
			var t = this;
			t.editor = editor;
			t.editor.addCommand('BackColor', function (ed, n) {
				loadColorPickerTo(ed, n, 'setBackColor');
			});
			t.editor.addButton('setBackColor', {
				to: 'group2',
				at: 1,
				'class': 'veBackColor',
				title: '设置背景颜色',
				cmd: 'BackColor'
			});
		}
	});
	v.plugin.register('backcolor', ve.plugin.BackColor);
	
	/**
	 * 超链接
	 */
	v.Class('ve.plugin.link', {
		editor: null,
		pop: null,
		node: null,
		init: function(editor, url){
			this.editor = editor;
			
			this.editor.addCommand('showSetLink', ve.bind(this, function(ed, n){
				this.showPanel(null, n);
				QZFL.event.cancelBubble();
			}));
			
			dom.event.add(document.body, 'click', ve.bind(this,function(e){
				var target = QZFL.event.getTarget(e);
				if(!QZFL.dom.isAncestor(target, this.editor.iframeContainer)){
					this.closePanel();
				}
			}));
			
			this.editor.onClick.add(ve.bind(this, function(e){
				var link = QZFL.event.getTarget(e);
				if(link.tagName != 'A'){
					this.closePanel();
				} else {
					this.node = link;
					var href = link.href;
					var region = dom.getRegion(link);
					var iframeRegion = dom.getRegion(this.editor.iframeContainer);
					this.showPanel(href, null, {top:region.top+iframeRegion.top+region.height, left:region.left+iframeRegion.left});
					QZFL.event.cancelBubble();
				}
			}));
			
			this.editor.addButton('setLink', {
				to: 'group4',
				at: 5,
				'class': 'veLink',
				title: '设置链接',
				cmd: 'showSetLink'
			});
		},
		
		/**
		 * 显示面板
		 * @param {String} link
		 * @param {Object} node
		 * @param {Object} config
		 */
		showPanel: function(link, node, config){
			var config = ve.extend({left:0,top:0}, config || {});
			var html = ([
				'<div id="ed-insert-link-panel"><strong>设置超链接</strong>',
				'<div>',
					'<input type="text" id="link-val"/>',
					'<input type="button" value="确定" id="link-submit-btn"/>',
				'</div></div>'
			]).join('');
			
			if(!this.pop){
				this.pop = ve.ui.showSimplePopup(this.editor, node, {content: html, height:70, width:280});
				this.setupEvent(this.pop.getDOM());
			}
			dom.get('link-val').value = link || 'http://';
			this.pop.show();
			if(node){
				var region = dom.getRegion(node);
				config = ve.extend(config||{},{left:region.left, top:region.top+region.height});
			}
			
			//避免iframe遮蔽
			var toolbarContainerRegion = dom.getRegion(this.editor.toolbarContainer);
			var popRegion = dom.getRegion(this.pop.getDOM());
			if((config.left + popRegion.width) > (toolbarContainerRegion.left + toolbarContainerRegion.width)){
				config.left = toolbarContainerRegion.left + toolbarContainerRegion.width - popRegion.width;
			}
			this.pop.show(config);
		},
		
		/**
		 * 关闭面板
		 */
		closePanel: function(){
			this.node = null;
			if(this.pop){
				this.pop.hide();
			}
		},

		/**
		 * 设置链接
		 */
		setLink: function(){
			var link = dom.get('link-val').value;
			try {
				if(link == '' || link == 'http://'){
					this.editor.editorcommands.unlink();
				} else if(this.node){
					this.node.href = link;
					this.node = null;
				} else if(!this.editor.getSelection()){
					this.editor.setContent('<a href="'+link+'">'+link+'</a>');
				} else {
					this.editor.editorcommands.insertLink(null, link);
				}
			} catch(e){}
			return true;
		},
		
		/**
		 * 设置面板元素事件
		 * @param {Object} container
		 */
		setupEvent: function(container){
			dom.event.add(dom.get('link-val'), 'keydown', ve.bind(this, function(e){
				var e = e || window.event;
				if(e.keyCode == 13){
					if(this.setLink()){
						this.closePanel();
					};
					QZFL.event.cancelBubble();
					QZFL.event.preventDefault();
					return false;
				}
			}));
			dom.event.add(dom.get('link-submit-btn'), 'click', ve.bind(this,function(){
				if(this.setLink()){
					this.closePanel();
				};
			}));
		}
	});
	v.plugin.register('link', ve.plugin.link);
	
	/**
	 * 工具栏模式切换
	 */
	v.Class('ve.plugin.ToolbarSwitcher', {
		editor:null,
		curToolbarMode: 'default',
		button: null,
		init: function (editor, url) {
			this.editor = editor;

			//添加工具条模式
			this.editor.onInitComplete.add(
				ve.bind(this, function(){
					var ToolbarContainerFull = new ve.editor.ToolbarManager(this.editor, {'class':'veToolbarAdvMode', 'name':'advance'});
					this.editor.switchToolbar(ToolbarContainerFull);
					this.curToolbarMode = 'advance';
					var btn = this.editor.getButton('_switchtoolbar', 'advance');
					btn.dom.innerHTML = '基本功能<b></b>';
				})
			);
			this.editor.addCommand('_switchtoolbar', ve.bind(this, function(e,b){
				var tag = this.curToolbarMode == 'advance' ? 'default' : 'advance';
				var tagText = this.curToolbarMode == 'default' ? '基本功能<b></b>' : '高级功能<b></b>';
				this.editor.switchToolbar(tag);
				this.curToolbarMode = tag;
				var btn = this.editor.getButton('_switchtoolbar', tag);
				btn.dom.innerHTML = tagText;
			}));
			var btn = this.editor.addButton('switchtoolbar', {
				to: 'group5',
				at: 0,
				'class': 'veToolbarSwitcher',
				title: '工具条模式切换',
				text: '高级功能<b></b>',
				cmd: '_switchtoolbar'
			});
		}
	});
	v.plugin.register('toolbarswitcher', ve.plugin.ToolbarSwitcher);
	
	/**
	 * 剪贴板
	 */
	v.Class('ve.plugin.XPaste', {
		editor:null,
		pop: null,
		iframeDoc: null,
		url: null,
		matchCleanPattern: false,	//是否命中
		init: function (editor, url) {
			this.editor = editor;
			this.url = url;
			if(!ve.isChrome){
				this.editor.onInitComplete.add(ve.bind(this, this.autoDetectedPasteContent));	
			}
			this.editor.addCommand('showPasteContentPanel', ve.bind(this, function(e,b){
				this.showPanel(b);
			}));
			
			/** 暂时不开放这个按钮
			this.editor.addButton('switchtoolbar', {
				to: 'group5',
				at: 4,
				'class': 'vePasteRich',
				title: '粘贴富文本',
				cmd: 'showPasteContentPanel'
			});
			**/
		},
		
		/**
		 * 自动检测ctrl+v动作，实施过滤
		 */
		autoDetectedPasteContent: function(){
			this.editor.onPaste.add(ve.bind(this, function(){
				this.editor.setContent('<!--rtxtstart-->');
				window.setTimeout(ve.bind(this, function(){
					this.editor.setContent('<\!\-\-rtxtend\-\->');
					var oriContent = this.editor.getContent();
					var reg = /<\!\-\-rtxtstart\-\->([\s\S]*)<\!\-\-rtxtend\-\->/g;
					var result = reg.exec(oriContent);
					if(result && result[1]){
						var str = this.processContent(result[1]);
						var str2 = oriContent.replace(reg, function(){return str;});
						this.editor.clearContent();
						this.editor.setContent(str2);
						this.editor.selection.moveToBookmark(this.editor.bookmark);
					}
					this.showStatusTip();
				}), 200);
			}));
		},
		
		/**
		 * 显示粘贴富文本面板
		 * @param {Object} node
		 * @param {Object} config
		 */
		showPanel: function(node, config){
			var region = dom.getRegion(node);
			var config = ve.extend(config||{},{left:region.left, top:region.top+region.height});
			
			if(!this.pop){
				var url = /^https?/.test(this.url) ? this.url.replace(/\/\w+\.js$/, '/html/xpaste.html') : (new ve.util.Path().toAbs(this.url) + '/html/xpaste.html');
				var html = ([
					'<div id="ed-paste-richtext"><strong>粘贴富文本</strong>',
					'<div>',
						'<div id="ed-paste-iframe"></div>',
						'<input type="button" value="确定" id="paste-richtext-btn"/>',
					'</div></div>'
				]).join('');
				this.pop = ve.ui.showSimplePopup(this.editor, node, {content: html, height:210, width:350});
				this.setupEvent(this.pop.getDOM());

				var iframeHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
					iframeHTML += '<style type="text/css">html,body,p,ul,li,form{padding:0; margin:0;}body {background-color: transparent; width:100%}</style>';
				if (veEditor.domain){
					iframeHTML += '<script type="text/javascript">document.domain = "' + veEditor.domain + '";</script>';
					iframeHTML += '</head><body></body></html>';
				}
				
				var iframe = document.createElement('iframe');
					iframe.style.border = 'none';
					iframe.frameborder = '0';
				dom.get('ed-paste-iframe').appendChild(iframe);
				if(ve.isIE){
					if(document.readyState == 'complete' && iframe.readyState == 'complete'){
						this.iframeDoc = iframe.contentWindow.document;
						this.iframeDoc.designMode = 'On';
						this.iframeDoc.contentEditable = true;
						this.iframeDoc.open();
						this.iframeDoc.write(iframeHTML);
						this.iframeDoc.close();
						iframe.contentWindow.focus();
					}
				} else {
					this.iframeDoc = iframe.contentWindow.document;
					this.iframeDoc.designMode = 'On';
					this.iframeDoc.contentEditable = true;
					this.iframeDoc.open();
					this.iframeDoc.write(iframeHTML);
					this.iframeDoc.close();
					iframe.contentWindow.focus();
				}
			}
			this.pop.show();
			
			//避免iframe遮蔽
			var toolbarContainerRegion = dom.getRegion(this.editor.toolbarContainer);
			var popRegion = dom.getRegion(this.pop.getDOM());
			if((config.left + popRegion.width) > (toolbarContainerRegion.left + toolbarContainerRegion.width)){
				config.left = toolbarContainerRegion.left + toolbarContainerRegion.width - popRegion.width;
			}
			this.pop.show(config);
		},
		
		/**
		 * 绑定面板事件
		 * @param {Object} popContainer
		 */
		setupEvent: function(popContainer){
			dom.event.add($('txt-paste-richtext'), 'focus', function(){
				this.select();
			});
			dom.event.add($('paste-richtext-btn'), 'click', ve.bind(this, function(){
				var val = this.iframeDoc.body.innerHTML;
				if(val.trim() == ''){
					alert('请输入内容');
				} else {
					var result = this.processContent(val);
					if(result){
						this.editor.setContent(result);
						this.showStatusTip();
					} else {
						alert('清理失败');
					}
				}
				this.iframeDoc.body.innerHTML = '';
				this.closePanel();
			}));
		},
		
		showStatusTip: function(){
			if(this.matchCleanPattern){
				this.editor.showStatusbar('当前粘贴的内容已经经过过滤处理，如果与您实际的内容不符合，请手动编辑');
				setTimeout(ve.bind(this, function(){
					this.editor.hideStatusbar();
				}), 3000);
			}
		},
		
		/**
		 * 关闭面板
		 */
		closePanel: function(){
			this.node = null;
			if(this.pop){
				this.pop.hide();
			}
		},
		
		/**
		 * 清理内容
		 * @param {String} str
		 * @return {String}
		 */
		processContent: function(str){
			var _this = this;
			_this.matchCleanPattern = false;
			var process = function(items) {
				each(items, function(v) {
					try {
						if (v.constructor == RegExp){
							str = str.replace(v, function(str){
								if(str){
									_this.matchCleanPattern = true;
								}
								return '';
							});
						} else {
							str = str.replace(v[0], function(str){
								if(str){
									_this.matchCleanPattern = true;
								}
								return v[1];
							});
						}	
					} catch(e){
						//console.log('e:',e);
					}
				});
			};
			process([
				/[\r\n]/gi,
				/^\s*(&nbsp;)+/g,											// nbsp entities at the start of contents
				/(&nbsp;|<br[^>]*>)+\s*$/g,									// nbsp entities at the end of contents
				[/<!--\[if !supportLists\]-->/gi, '$&__VE_ITEM__'],			// Convert supportLists to a list item marker
				[/(<span[^>]+:\s*symbol[^>]+>)/gi, '$1__VE_ITEM__'],		// Convert symbol spans to list items
				[/(<span[^>]+mso-list:[^>]+>)/gi, '$1__VE_ITEM__'],			// Convert mso-list to item marker
				/<!--[\s\S]+?-->/gi,										// Word comments
			//	/<\/?(img|font|meta|link|style|div|v:\w+)[^>]*>/gi,			// Remove some tags including VML content
				/<\\?\?xml[^>]*>/gi,										// XML namespace declarations
				/<\/?o:[^>]*>/gi,											// MS namespaced elements <o:tag>
				/ (id|name|language|type|on\w+|v:\w+)=\"([^\"]*)\"/gi,		// on.., class, style and language attributes with quotes
				/ (id|name|language|type|on\w+|v:\w+)=(\w+)/gi,				// on.., class, style and language attributes without quotes (IE)
				[/<(\/?)s>/gi, '<$1strike>'],								// Convert <s> into <strike> for line-though
				/<script[^>]+>[\s\S]*?<\/script>/gi,						// All scripts elements for msoShowComment for example
				[/&nbsp;/g, '\u00a0'],										// Replace nsbp entites to char since it's easier to handle
				/<\/?(span)[^>]*>/gi,
				/ class=\"([^\"]*)\"/gi,									// class attributes with quotes
				/ class=(\w+)/gi,											// class attributes without quotes (IE)
				/ class=\"(mso[^\"]*)\"/gi,									// class attributes with quotes
				/ class=(mso\w+)/gi,										// class attributes without quotes (IE)
				/<\/?(span)[^>]*>/gi,
				[/<([\w]+\:[^ ]+)[^>]*>([^<]*)<\/?\1>/gi, '$2'],
				/<img[^>]+src=\"file:\/\/\/.*?>/gi,							//清理本地图片
				/<style[^>].*?<\/style>/gi
			]);
			return str;
		}
	});
	v.plugin.register('xpaste', ve.plugin.XPaste);
	
	/**
	 * HTML编辑器
	 */
	v.Class('ve.plugin.HtmlEditor', {
		editor: null,
		button: null,
		editorState: 0,		//编辑器状态，0：可视化编辑器，1：HTML代码编辑器
		copyState: false,
		config: {
			className: 'veHtmlEditor'
		},
		
		init: function (editor, url) {
			this.editor = editor;
			this.editor.addCommand('toggleHtmlEditor', ve.bind(this, function (ed, button) {
				this.toggleHtmlEditor();
			}));
			this.editor.addButton('toggleHtmlEditorBtn', {
				to: 'group5',
				at: 1,
				'class': 'veHtml',
				title: '切换到HTML代码模式',
				cmd: 'toggleHtmlEditor'
			});
		},
		
		/**
		 * 切换编辑器
		 **/
		toggleHtmlEditor: function(){
			if(!this.editor.htmlElement){
				this.createHtmlContainer();
			}
			
			this.editorState = this.editorState ? 0 : 1;
			
			//显示切换
			this.editor.iframeElement.style.display = this.editorState ? 'none' : '';
			this.editor.htmlElement.style.display = this.editorState ? '' : 'none';

			//设置工具条状态
			this.setOtherToolbarButtonsState(!this.editorState);
			
			//值传递
			if(this.editorState){
				this.editor.htmlElement.value = this.editor.getContent();
			} else {
				this.editor.clearContent();
				this.editor.setContent({content:this.editor.htmlElement.value,useParser:true});
			}
		},
		
		/**
		 * 设置工具条其他按钮状态
		 * @param {Boolean} enabled
		 **/
		setOtherToolbarButtonsState: function(enabled){
			var ctrls = this.editor.controlManager.controls;
			for(var i=0; i<ctrs.length; i++){
			
			}
			console.log('this.editor',this.editor);
			debugger;
			
			
			//这里需要toolbarmanager支持
			//console.log('this.editor',this.editor);
		},
		
		/**
		 * 创建textarea，绑定事件
		 * @return {Object}
		 **/
		createHtmlContainer: function(){
			var ta = v.createElement
			this.editor.htmlElement = dom.create('textarea', {
				allowtransparency: 'true',
				allowTransparency: 'true',
				style: {
					width : '100%',
					height : '100%',
					border: '1px solid #ccc'
				}
			},null, this.editor.iframeContainer);
			this.editor.htmlElement.className = this.config.className;
			
			//绑定change事件
			//每500毫秒触发一次
			//TODO 这里只绑定了keydown不够
			dom.event.add(this.editor.htmlElement, 'keydown', ve.bind(this,function(){
				if(!this.copyState){
					this.copyState = true;
					setTimeout(ve.bind(this,function(){
						this.editor.clearContent();
						this.editor.setContent({content:this.editor.htmlElement.value,useParser:true});
						this.copyState = false;
					}), 500);
				}
			}));
			return this.editor.htmlElement;
		}
	});
	v.plugin.register('htmleditor', ve.plugin.HtmlEditor);
}) (ve);