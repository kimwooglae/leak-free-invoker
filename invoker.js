(function(global) {
	global.method_invoker = function() {
		if( arguments.length < 3 ) return;
		var i, value, winObj, windowType = arguments[0], windowName = arguments[1], args = [arguments[2]];
		for( i = 3 ; i < arguments.length ; i++ ) {
			value = arguments[i];
			switch (typeof value) {
				case 'undefined':
				case 'boolean':
				case 'number':
				case 'string':
					args.push(typeof value);	// not converted
					args.push(value);
					break;
				default:
					if (!value) {
						args.push('null');	// null
						args.push(null);
					} else if( isXML() ) {
						args.push('xml');	// XML
						args.push(serilaize(value));
					} else {
						args.push('object');  // JSON serialize object;
						args.push(JSON.stringify(value));
					}
			}
		}
		
		// find target window
		if( windowType === 1 ) {	// iframe child
			winObj = document.getElementById(windowName).contentWindow;
		} else if( windowType === 2 ) { // frame child
		} else if( windowType === 3 ) { // popup
			winObj = parent;
		} else if( windowType === 4 ) { // iframe parent
			winObj = parent;
		} else if( windowType === 5 ) { // frame parent
			winObj = parent;
		} else if( windowType === 6 ) { // opener
			winObj = opener;
		}
		if( winObj) {
			ret = winObj["method_callee"].call(null, args);
			if(typeof ret === 'string') {
				retType = ret.charAt(0);
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
	}

	var isXML = function(obj) {
		return false;
	}
	
	var serializeXML = function(obj) {
		return "";
	}
	
	var parseXML = function(obj) {
		
	}
	
	global.method_callee = function() {
		if(arguments.length < 1) return;
		var i,value, valeuType, args = [], method_name = arguments[0].split('.'), method_obj;
		for( i = 1 ; i < arguments.length ; ) {
			valueType = arguments[i++];
			value = arguments[i++];

			switch (typeof valueType) {
				case 'undefined':
				case 'null':
				case 'boolean':
				case 'number':
				case 'string':
					args.push(value);
					break;
				case 'object':
					args.push(JSON.parse(value));
					break;
				case 'xml':
					args.push(parseXML(value));
					break;
			}
		}
		method_obj = global[method_name[0]];
		for(i=1;i<method_name.length;i++) {
			method_obj = method_obj[method_name[i]];
		}
		value = method_obj.call(null, args);
		switch (typeof value) {
			case 'undefined':
				return '0undefined';
			case 'boolean':
				return '2'+value;
			case 'number':
				return '3'+value;
			case 'string':
				return '4'+value;
			default:
				if(!value) {
					return "1null";
				} else if( isXML() ) {
					return '6' + serilaizeXML(value);
				} else {
					return '5' + JSON.stringify(value);
				}
		}
	}

})(window)
