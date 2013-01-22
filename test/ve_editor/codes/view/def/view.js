/**
 * default viewer
 */
(function(window, document, undefined, v) {
	var is = ve.is, each = ve.each, isIE = ve.isIE, dom = ve.DOM, toolbarrows, isIE6 = ve.isIE6;
	v.Class('ve.editor.Def:ve.editor.ViewControler', {
		init: function (editor, url) {
			var t = this, items = ['FontStyle', 'FontSize', 'Bold', 'Italic', 'Underline', 'ForeColor', 'BackColor', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'];
			t.editor = editor;
			t.editor.onInit.add(function () {
				v.CSSLoader.load(new ve.util.Path().toAbs('view/' + t.editor.conf.viewer + '/css/content.css'), t.editor.getWin());
				if (t.editor.conf.contentCSS) {
					v.CSSLoader.load(t.editor.conf.contentCSS, t.editor.iframeContent);
				}
			});
			v.CSSLoader.load(new ve.util.Path().toAbs('view/' + t.editor.conf.viewer + '/css/global.css'));
		},

		renderUI: function (o) {
			var ic, tc, n, ec, sc, t = this, cm = t.editor.controlManager, tb, layout;
			layout = t.editor.createLayout();
			
			var tb = cm.createToolbar('group1', {'class': 'veOperateToolbar'});
			tb.add(cm.createButton('save', {title:'保存', 'class':'veSave', cmd:'saveContent'}));
			tb.add(cm.createButton('undo', {title:'撤销(ctrl+z)', 'class':'veUndo', cmd:'undo'}));
			tb.add(cm.createButton('undo', {title:'重做(ctrl+y)', 'class':'veRedo', cmd:'redo'}));
			t.editor.addToolbar(tb);
			
			var tb = cm.createToolbar('group2', {'class': 'veFontStyleToolbar'}); // create toolbar
			var list1, list2;
			tb.add(list1 = cm.createListBox('fontname', {
				title: '选择字体', 
				'class': 'FontName', 
				cmd: 'FontName', 
				items: [['宋体','宋体', 'style=\"font-family:宋体\"'], 
					['新宋体','新宋体', 'style=\"font-family:新宋体\"'],
					['黑体','黑体', 'style=\"font-family:黑体\"'],
					['Arial','Arial', 'style=\"font-family:Arial\"'],
					['Verdana','Verdana', 'style=\"font-family:Verdana\"'],
					['Simsun','Simsun', 'style=\"font-family:Simsun\"'],
					['Mingliu','Mingliu', 'style=\"font-family:Mingliu\"'],
					['Helvetica','Helvetica', 'style=\"font-family:Helvetica\"'],
					['仿宋_GB2312','仿宋_GB2312', 'style=\"font-family:仿宋_GB2312\"'],
					['楷体_GB2312', '楷体_GB2312', 'style=\"font-family:楷体_GB2312\"']]
				}
			));
			tb.add(list2 = cm.createListBox('fontsize', {
				title: '选择字号', 
				'class': 
				'FontSize', 
				cmd: 'FontSize', 
				items: [[1, '1(8pt)', 'style=\"font-size:xx-small;\"'], 
					[2,'2(10pt)', 'style=\"font-size:x-small;\"'],
					[3,'3(12pt)', 'style=\"font-size:small\"'], 
					[4,'4(14pt)', 'style=\"font-size:medium\"'],
					[5,'5(18pt)', 'style=\"font-size:large;\"'], 
					[6,'6(24pt)', 'style=\"font-size:x-large;\"'], 
					[7,'7(36pt)', 'style=\"font-size:xx-large;\"']]
				}
			));
			
			tb.add(cm.createButton('bold', {title: '加粗(ctrl+b)', 'class': 'veButtonBold', cmd: 'Bold'}));
			tb.add(cm.createButton('italic', {title: '斜体(ctrl+i)', 'class': 'veButtonItalic', cmd: 'Italic'}));
			tb.add(cm.createButton('underline', {title: '下划线(ctrl+u)', 'class': 'veButtonUnderline', cmd: 'Underline'}));
			t.editor.addToolbar (tb);

			var tb = cm.createToolbar('group3', {'class': 'veJustifyToolbar'}),
				b1, b2, b3, b4, last;
			tb.add(b1 = cm.createButton('justifyleft', {title: '左对齐(ctrl+alt+l)', 'class': 'veJustifyLeft', cmd: 'justifyleft', toggle: 1}));
			tb.add(b2 = cm.createButton('justifycenter', {title: '居中对齐(ctrl+alt+c)', 'class': 'JustifyCenter', cmd: 'justifycenter'}));
			tb.add(b3 = cm.createButton('justifyright', {title: '右对齐(ctrl+alt+r)', 'class': 'JustifyRight', cmd: 'justifyright'}));
			tb.add(b4 = cm.createButton('justifyfull', {title: '默认', 'class': 'JustifyFull', cmd: 'justifyfull'}));

			tb.add(cm.createButton('listol', {title: '有序列表', 'class': 'listol', cmd: 'listol',disabled:true}));
			tb.add(cm.createButton('listul', {title: '无序列表', 'class': 'listul', cmd: 'listul',disabled:true}));
			tb.add(cm.createButton('tableft', {title: '向左缩进', 'class': 'tableft', cmd: 'tableft',disabled:false}));
			tb.add(cm.createButton('tabright', {title: '向右缩进', 'class': 'tabright', cmd: 'tabright',disabled:false}));
			
			var clearst = function() {
				ve.each([b1, b2, b3, b4], function(n) {
					n.setUnActive();
				})
			};
			b1.onClick.add(function() {clearst(); this.setActive();});
			b2.onClick.add(function() {clearst(); this.setActive();});
			b3.onClick.add(function() {clearst(); this.setActive();});
			b4.onClick.add(function() {clearst(); this.setActive();});

			t.editor.addToolbar (tb);
			
			
			var tb = cm.createToolbar('group4', {'class':'veAdvToolbar'});
			t.editor.addToolbar(tb);
			
			var tb = cm.createToolbar('group5', {'class':'veExtraToolbar'});
			//tb.add(cm.createButton('help',{title:'帮助', 'class':'veHelp', cmd:'goHelp'}));
			tb.add(cm.createButton('removeformat',{title:'清除格式', 'class':'veRemoveFormat', cmd:'removeformat'}))
			t.editor.addToolbar(tb);
		}
	});
	v.viewManager.register('def', ve.editor.Def);
}) (window, document, undefined, ve);