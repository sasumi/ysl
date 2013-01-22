(function (ve, veEditor, document) {
	var dom = ve.DOM, isIE = ve.isIE;
	String.prototype.htmlencode = parent.String.prototype.htmlencode;
	function init() {
		var tab = dom.selector('#top_nav_tab a', document), con = dom.selector('#tab_content_con .tab_content_con', document);
		var last = tab[0], last_con = con[0];
		var iframecon = dom.selector('#iframecon', document);
		
		dom.selector('#txtonly', document)[0].innerHTML = '';
		ve.each(tab, function (n) {
			dom.event.add(n, 'click', function (e) {
				if (last) {
					if (last == this) return;
					dom.addClass(last_con, 'none');
					dom.removeClass(last, 'sel');
				}
				var i = n.getAttribute('t');
				last_con = con[i || 0];
				last = this;
				dom.removeClass(last_con, 'none');
				dom.addClass(last, 'sel');
				dom.event.preventDefault(e);
			});
		});
		var save = dom.selector('#save_btn', document)[0];
		var cancel = dom.selector('#cancel_btn', document)[0];
		var ed = veEditor.popupEditor;
		dom.event.add(save, 'click', function () {
			var t = last.getAttribute('t'), h;
			if (t == '0') {
				h = document.getElementById('txtonly').value.htmlencode();
			}
			else {
				h = document.getElementById('iframe').contentWindow.document.body.innerHTML;
			}
			ed.editorcommands.execCommand('insertClipboardContent', h);
		});
		dom.event.add(cancel, 'click', function() {
			ed.popupDialog.close();
		});

		initIframe();
	}

	function initIframe() {
		var iframecon = dom.selector('#iframecon', document)[0], u, iframeHTML, ifr, doc;
		iframeHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
		iframeHTML += '<style type="text/css">html,body,p,ul,li,form{padding:0; margin:0;}body {background-color: transparent; width:100%;}</style>';
		if (veEditor.domain)
			iframeHTML += '<script type="text/javascript">document.domain = "' + veEditor.domain + '";</script>';
		if (ve.isIE) {
			iframeHTML += '</head><body></body></html>';
			u = 'javascript:(function() {document.open();document.write(\'' + iframeHTML + '\');document.close();})()';
		} 
		else {
			iframeHTML += '</head><body></body></html>';
		}
		iframecon.innerHTML = '<iframe id="iframe" src="javascript:\'\';" frameBorder="0" style="width:100%; height:100%;"></iframe>';
		ifr = document.getElementById('iframe');
		doc = ifr.contentWindow.document;
		doc.open();
		doc.write(iframeHTML);
		doc.close();
		doc.designMode = 'On';
		ifr.contentWindow.focus();
	}
	
	init();
}) (parent.ve, parent.veEditor, document);