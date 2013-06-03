YSL.use('widget.Animate', function(Y){
	var ani = new Y.widget.Animate('#blog_one', {
		to:{left:600, height:100, width:100, top:200}
	});
	Y.dom.one('#start').on('click', function(){
		ani.start();
	});
	Y.dom.one('#pause').on('click', function(){
		ani.pause();
	});
	Y.dom.one('#resume').on('click', function(){
		ani.resume();
	});
	Y.dom.one('#stop').on('click', function(){
		ani.stop();
	});
	ani.onRuning = function(step){
		//console.log('step', step);
	};
});