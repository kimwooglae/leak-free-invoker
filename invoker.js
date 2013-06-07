(function(global) {
	var method_invoker = function() {
		if( arguments.length < 3 ) return;
		var i, value, winObj, windowType = arguments[0], windowName = arguments[1], args = [arguments[2]];
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
		if( windowType === 1 ) {	// iframe child
			winObj = document.getElementById(windowName).contentWindow;
		} else if( windowType === 2 ) { // frame child
		} else if( windowType === 3 ) { // popup
		} else if( windowType === 4 ) { // iframe parent
		} else if( windowType === 5 ) { // frame parent
		} else if( windowType === 6 ) { // opener
			
		}
		if( winObj) {
			ret = winobj["method_callee"].call(null, args);
			retType = ret[0];
			retValue = ret.substring(1);
			switch(retType) {
				case "0":	// undefined
					return undefined;
				case "1":	// null
					return null;
				case "2":   // boolean 
					return (retValue === 'true');
				case "3":	// number
					return Number(retValue);
				case "4":   //  String
					return retValue;
				case "5":  // Object
					return JSON.parse(retValue);
				case "6":  // XML
					return parse(retValue);
			}
		}
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
