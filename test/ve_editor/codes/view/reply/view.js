/**
 * default viewer
 */
(function(window, document, undefined, v) {
	var is = ve.is, each = ve.each, isIE = ve.isIE, dom = ve.DOM, toolbarrows;
	v.Class('ve.editor.Reply:ve.editor.ViewControler', {
		init: function (editor, url) {
			var t = this, items = ['FontStyle', 'FontSize', 'Bold', 'Italic', 'Underline', 'ForeColor', 'BackColor', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'];
			t.editor = editor;
			t.editor.onInit.add(function () {
				t.editor.popupDialog.register('qzfl', 've.ui.QZonePopupDialog'); // regist popupdialog class
				if (t.editor.conf.contentCSS) {
					v.CSSLoader.load(t.editor.conf.contentCSS, t.editor.iframeContent);
				}
			});
			v.CSSLoader.load(new ve.util.Path().toAbs('view/' + t.editor.conf.viewer + '/css/global.css'));
			
		},

		renderUI: function (o) {
			var ic, tc, n, ec, t = this, cm = t.editor.controlManager, tb;
			ec = t.editor.createEditorContainer(); // editor container
			ic = t.editor.createIframeContainer();//dom.create('div', {'class':'veIframeContainer'}); // iframe container
			tc = t.editor.createToolbarContainer();//dom.create('div', {'class':'veToolbarContainer'}); // toolbar container

			ec.appendChild(tc); // append toolbar container
			ec.appendChild(ic); // append iframe container

			var tb = cm.createToolbar('group1', {'class': 'veStyleToolbar'}); // create toolbar
			tb.add(cm.createButton('bold', {title: '加粗', 'class': 'veButtonBold', cmd: 'Bold'}));
			tb.add(cm.createButton('italic', {title: '斜体', 'class': 'veButtonItalic', cmd: 'Italic'}));
			tb.add(cm.createButton('underline', {title: '下划线', 'class': 'veButtonUnderline', cmd: 'Underline'}));
			t.editor.addToolbar(tb);

			var h = '';
			ve.each(t.editor.toolbars, function (n) {
				n.renderTo(tc);
				ve.each(n.controls, function (m) {
					m.renderTo(n.dom);
				});
			});
			return {
				iframeContainer: ic,
				editorContainer: ec
			};
		}
	});
	v.viewManager.register('reply', ve.editor.Reply);
}) (window, document, undefined, ve);













/*

逻辑学测试题：
　　
　　某两会委员发言：“上海是全世界的上海,上海的房价应该和国际接轨,我觉得80后男孩子如果买不起房子,80后女孩子可以嫁给40岁的男人。
　　80后的男人如果有条件了,到40岁再娶20岁的女孩子也是不错的选择。”
　　
　　2楼回复：
　　我终于到40岁了,找到一个年轻貌美的20岁女友
　　去她家见家长
　　开门的是当年读大学时相处了几年的初恋女友
　　新女友喊了一声：妈~
　　
　　3楼补充：她妈看到我,惊得倒吸一口冷气。没等我反应过来,然后把女儿拉进房间里,对女儿说“你不能和他在一起,他是你亲生父亲啊！”
　　
　　4楼继续补充： 女儿：我已经有了他的骨肉……
　　
　　【5楼】 这时女孩的60多岁的父亲走出来看见了女孩的男友,小声的对他说：“你怎么来了,给你妈和你的生活费不是每月都按时打去的吗？
　　【6楼】这时"叮咚",女孩男友的妈来见亲家,见到女孩的父亲:"怎么是你..."
　　【7楼】女孩男友的父亲停完车也上楼了,一见女孩的父亲马上内流满面:"你不就是我失散多年的弟弟吗?"
　　【8楼】女孩母亲见到男友母亲:"妈!"
　　【9楼】女孩母亲见到男友他爸,叫了一声“爹！”,立刻晕厥过去
　　
　　问: 1、你能理解到几楼？
　　 2、男友他妈的妈见到女友他妈的爸叫什么?

*/