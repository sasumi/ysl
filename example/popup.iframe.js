YSL.dom.one('#btn').on('click', function(){
	YSL.use('widget.Popup', function(Y){
		var pop = new Y.widget.Popup({
				topCloseBtn: true,
				title: '来自iframe里面的popup',
				content: '来自iframe里面的popup',
				buttons: [{name:'关闭'}]
			});
		pop.show();

		setTimeout(function(){
			YSL.widget.Popup.closeAll();
		}, 5000);
	});
});