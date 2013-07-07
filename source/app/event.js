(function(Y){
	var EVENT_DATA = {};

	var Event = {
		on: function(ev, handler){
	        EVENT_DATA.push({
	            'handler': handler,
	            'event': ev
	        });
	        return this;
		},

		remove: function(ev, handler){
	 		for (var i = 0; i < EVENT_DATA.length; i++) {
	            if (EVENT_DATA[i] && (EVENT_DATA[i]['event'] == ev)) {
	                var hdl = EVENT_DATA[i]['handler'];
	                if (!handler) {
	                    EVENT_DATA[i] = null;
	                } else if (handler == hdl) {
	                    EVENT_DATA[i] = null;
	                }
	            }
	        }
		},

		fire: function(event, param1){
			var result = [],
	            _arg = Y.lang.toArray(arguments).slice(1),
	            found = false;
	        for (var i = 0; i < EVENT_DATA.length; i++) {
	            var ev = EVENT_DATA[i];
	            if (ev['event'] == event && ev['handler']) {
	                result.push(ev['handler'].apply(this, _arg));
	                EVENT_DATA[i].fired = true;
	                EVENT_DATA[i].args = _arg;
	                found = true;
	            }
	        }
	        if (!found) {
	            EVENT_DATA.push({
	                'handler': null,
	                'event': event,
	                'fired': true,
	                'args': _arg
	            });
	        }
	        if (!result.length) {
	            return null;
	        }
	        return result;
		},

		trigger: function(event, handler){
			for (var i = 0; i < EVENT_DATA.length; i++) {
	            var ev = EVENT_DATA[i];
	            if (ev['event'] == event && ev.fired == true) {
	                handler.apply(this, ev.args);
	                return -1;
	            }
	        }
	        return this.addEvent(event, handler);
		}
	};

	Y.App.Event = Event;
})(YSL);

