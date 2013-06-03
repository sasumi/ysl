(function(Y){
	Y.dom.one('#btn1').addEvent('click', function(){
		Y.use('widget.Popup', function(Y){
			var pop = new Y.widget.Popup({
					title: '普通对话框',
					content: 'normal pop'
				});
			pop.show();
		});
	});

	Y.dom.one('#btn2').addEvent('click', function(){
		Y.use('widget.Popup', function(){
			var pop = new Y.widget.Popup({
					title: '页面source引用对话框',
					content: {'src':'index.html'},
					height: 400
				});
			pop.show();
		});
	})

	Y.dom.one('#btn3').addEvent('click', function(){
		Y.use('widget.Popup', function(){
			var pop = new YSL.widget.Popup({
					topCloseBtn: false,
					title: '木有顶部关闭按钮',
					content: '木有顶部关闭按钮',
					buttons: [{name:'配置必须写按钮，否则木得关闭'}]
				});
			pop.show();
		});
	})

	Y.dom.one('#btn4').addEvent('click', function(){
		Y.use('widget.Popup', function(){
			for(var i=0; i<3; i++){
				var pop = new YSL.widget.Popup({
					title: '多对话框' + i,
					content: 'normal pop'
				});
				pop.show();
				pop.container.setStyle({top: Math.random()*100+'px', left:Math.random()*200+'px'})
			}
		});
	})


	Y.dom.one('#btn5').addEvent('click', function(){

		Y.use('widget.Popup', function(){
			for(var i=0; i<1; i++){
				var pop = new YSL.widget.Popup({
					title: '多对话框' + i,
					content: 'normal pop'
				});
				pop.show();
				pop.container.setStyle({top: Math.random()*100+'px', left:Math.random()*200+'px'})
			}

			var pop = new YSL.widget.Popup({
					title: '模态对话框',
					isModal: true,
					content: 'normal pop'
				});
				pop.show();
			var pop2 = new YSL.widget.Popup({
					title: '模态对话框',
					isModal: true,
					content: 'normal pop'
				});
				pop2.show();
		});
	})

	Y.dom.one('#btn6').addEvent('click', function(){
		Y.use('widget.Popup', function(){
			var pop1 = new YSL.widget.Popup({
					title: '模态对话框1',
					isModal: true,
					content: 'normal pop'
				});
				pop1.show();
				pop1.container.setStyle({top: Math.random()*100+'px', left:Math.random()*200+'px'})

			for(var i=0; i<3; i++){
				var pop = new YSL.widget.Popup({
					title: '多对话框' + i,
					content: 'normal pop'
				});
				pop.show();
				pop.container.setStyle({top: Math.random()*100+'px', left:Math.random()*200+'px'})
			}

			var pop2 = new YSL.widget.Popup({
					title: '模态对话框2',
					isModal: true,
					content: 'normal pop'
				});
				pop2.show();
				pop2.container.setStyle({top: Math.random()*100+'px', left:Math.random()*200+'px'})
		});
	});

	Y.dom.one('#btn7').addEvent('click', function(){
		Y.use('widget.Popup', function(){
			var pop = new YSL.widget.Popup({
				title: '自定义按钮',
				content: 'normal pop',
				buttons: [
					{name: '测试按钮', handler: function(){
						alert('测试按钮被按到');
						pop.close();
					}, setDefault: true}
				]
			});
			pop.show();
		});
	})

	Y.dom.one('#btn8').addEvent('click', function(){
		Y.use('widget.Popup', function(){
			var pop = new YSL.widget.Popup({
				title: '任意个按钮',
				content: '只要你的界面放得下，这货想要多少有多少',
				buttons: [
					{name: '默认的按钮', handler: function(){alert('按钮一');pop.close();}, setDefault: true},
					{name: '对话框2', handler: function(){
						var p = new YSL.widget.Popup({
							title: 'asfdasfd',
							content: 'asfdasdf',
							buttons: [{name:'关闭'}]
						});
						p.show();
					}},
					{name: '模态对话框', handler: function(){
						var p2 = new YSL.widget.Popup({
							title: '模态对话框',
							content: '模态对话框',
							isModal: true,
							buttons: [{name:'关闭'}]
						});
						p2.show();
					}},
					{name: '按钮4', handler: function(){alert('按钮4');}}
				]
			});
			pop.show();
		});
	});

	Y.dom.one('#btn9').addEvent('click', function(){
		Y.use('widget.Popup', function(Y, Pop){
			var pop = new Pop({
				title: 'IO demo',
				content: {src:'popup.io.html'},
				buttons: [
					{name: 'Cancel'}
				]
			});
			pop.addIO('testIO', function(){
				alert('i m a function');
			});
			pop.show();
		});
	});
})(YSL);