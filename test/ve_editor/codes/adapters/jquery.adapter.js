(function(window, document, undefined, ve) {
	var is = ve.is, each = ve.each, isIE = ve.isIE;
	ve.Class('static ve.adapter.Config', {
		init: function() {
			ve.Sizzle = jQuery.find;
			ve.dom.selector = jQuery.find;
			ve.DOM = jQuery(document);
			ve.DOM.event = jQuery.event;
		//	ve.DOM.event.add = QZFL.event.addEvent;
		}
	});

	ve.adapter.Config.init();
}) (window, document, undefined, ve);