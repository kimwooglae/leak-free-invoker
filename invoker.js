(function(global) {
	var method_invoker = function(windowType, windowName, methodName) {
		var i, value, args = [];
		if( arguments.length < 3 ) return;
		var windowType = arguments[0];
		var windowName = arguments[1];
		var methodName = arguments[2];
		for( i = 3 ; i < arguments.length ; i++ ) {
			value = arguments[i];
			switch (typeof value) {
				case 'string':
				case 'boolean':
				case 'null':
				case 'number':
					args.push(1);	// not converted
					args.push(value);
					break;
				default:
					if( isXML() ) {
						args.push(2);	// XML
						args.push(serilaize(value));
						break;
					} else {
						args.push(3);  // JSON serialize object;
						args.push(JSON.stringify(value);
					}
			}
		}
		
		// find target window
		
	}

	var isXML = function(obj) {
		return false;
	}
	
	var serialize = function(obj) {
		return "";
	}
	
	var method_callee = function() {
	
	
	}



})(window)
