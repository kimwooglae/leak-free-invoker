/*
 * top, opener, parent 지원
 * 함수 iframe(), wqiframe(), wqpopup()
 * 나머지는 전역변수로 가정
 * 예제
 *   top.opener.parent  // 최상위 윈도우 객체의 opener의 부모창
 *   parent.iframe(frame001) // id가 frame001인 형제 iframe창
 *   parent.wqiframe(iframe001) // websquare id가 iframe001인 형채 iframe창
 *   wqpopup(popup01)		// websquare id가 popup01인 popup창
 *   popupObj.iframe(frame001)  // 전역 변수가 popupObj인 창의 하위에 있는 id가 frame001인 iframe창
*/

(function(global) {
	var re1 = /[i]?frame\W*\(\W*['"]?([^'"]+)['"]?\W*\)/i;
	var re2 = /wqiframe\W*\(\W*['"]?([^'"]+)['"]?\W*\)/i;
	var re3 = /wqpopup\W*\(\W*['"]?([^'"]+)['"]?\W*\)/i;

	global.method_invoker = function() {
		if( arguments.length < 2) return;
		if( typeof arguments[1] !== 'string') return;
		var i, value, winObj, windowName = arguments[0].split('.'), args = [arguments[1]], found;
		for( i = 2 ; i < arguments.length ; i++ ) {
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
					} else if( value instanceof String ) {	// typeof obj == 'object' // new String()
						args.push('string');	// vector
						args.push(value.toString());

/// For WebSqure [start]
					} else if( value instanceof WebSquare.collection.Vector ) {
						args.push('vector');	// vector
						args.push(value.toString());
					} else if( value instanceof WebSquare.collection.Hashtable ) {
						args.push('hashtable');	// hashtable
						args.push(value.toString());
					} else if( isXML(value) ) {
						args.push('xml');	// XML
						args.push(serializeXML(value));
/// For WebSqure [end]

					} else {
						args.push('object');  // JSON serialize object;
						args.push(JSON.stringify(value));
					}
			}
		}
		
		winObj = global;
		for(i=0;i<windowName.length;i++) {
			found = windowName[i].match(re3);	// websquare popup
			if(found) {
				winObj = winObj.WebSquare.util.getPopupWindow(found[1]);
			} else {
				found = windowName[i].match(re2);	// webwquare iframe
				if(found) {
					winObj = winObj[found[1]].getWindow();
				} else {
					found = windowName[i].match(re1);	// iframe, frame
					if(found) {
						winObj = winObj.document.getElementById(found[1]).contentWindow;
					} else {	// opener, parent, top, 기타
						winObj = winObj[windowName[i]];
					}
				}
			}
		}
				
		if( winObj) {
			ret = winObj["method_callee"].apply(null, args);
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

/// For WebSqure [start]
					case "6":  // XML
						return parseXML(retValue);
					case "7":  // vector
						return WebSquare.collection.toVector(retValue);
					case "8":  // hashtable
						return WebSquare.collection.toHashtable(retValue);
/// For WebSqure [end]

				}
			}
		}
	}
	
	global.method_callee = function() {
		if(arguments.length < 1) return;
		var i,value, valeuType, args = [], method_name = arguments[0].split('.'), method_obj;
		for( i = 1 ; i < arguments.length ; ) {
			valueType = arguments[i++];
			value = arguments[i++];

			switch (valueType) {
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

/// For WebSqure [start]
				case 'xml':
					args.push(parseXML(value));
					break;
				case 'vector':
					args.push(WebSquare.collection.toVector(value));
					break;
				case 'hashtable':
					args.push(WebSquare.collection.toHashtable(value));
					break;
/// For WebSqure [end]

			}
		}
		method_obj = global[method_name[0]];
		for(i=1;i<method_name.length;i++) {
			method_obj = method_obj[method_name[i]];
		}
		value = method_obj.apply(null, args);
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
				} else if( value instanceof String ) {
					return "4" + value.toString();

/// For WebSqure [start]
				} else if( value instanceof WebSquare.collection.Vector ) {
					return "7" + value.toString();
				} else if( value instanceof WebSquare.collection.Hashtable ) {
					return "8" + value.toString();
				} else if( isXML(value) ) {
					return '6' + serializeXML(value);
/// For WebSqure [end]

				} else {
					return '5' + JSON.stringify(value);
				}
		}
	}


/// For WebSqure [start]
	var isXML = function(obj) {
		return WebSquare.xml.isDocument(obj);
	}
	
	var serializeXML = function(obj) {
		return WebSquare.xml.serialize(obj);
	}
	
	var parseXML = function(str) {
		return WebSquare.xml._parse(str);
	}
/// For WebSqure [end]

})(window)

function test1() {
	alert(location.href);
}

function test2(value) {
	switch (typeof value) {
		case 'undefined':
			return value;
		case 'boolean':
			return !value;
		case 'number':
			return value*123;
		case 'string':
			return value +" \n dest : " + location.href;
		default:
			if (!value) {
				return null;
			} else if( value instanceof WebSquare.collection.Vector ) {
				value.addElement(location.href);
				return WebSquare.collection.toVector(value.toString());
			} else if( value instanceof WebSquare.collection.Hashtable ) {
				value.put("target", location.href);
				return WebSquare.collection.toHashtable(value.toString());
			} else if( WebSquare.xml.isDocument(value) ) {
				return WebSquare.xml._parse("<msg target='" + WebSquare.xml.encode(location.href) + "'>" +WebSquare.xml.serialize(value) + "</msg>");
			} else {
				value.target = location.href;
				return value;
			}
	}
}


function tester(target, method, objType) {
  var value, ret;
  if(!objType) {
    objType = document.getElementById("dataType");
    objType = objType.value;
  }
  switch (objType) {
    case 'undefined':
      break;
    case 'boolean':
      value = true;
      break;
    case 'number':
      value = 3241;
      break;
    case 'string':
      value ="src : " + location.href;
      break;
    case 'vector':
      value = new WebSquare.collection.Vector();
      value.addElement(location.href);
      break;
    case 'hashtable':
      value = new WebSquare.collection.Hashtable();
      value.put("source", location.href);
      break;
    case 'xml':
      value = WebSquare.xml._parse("<ttt src='" + WebSquare.xml.encode(location.href)+ "'/>");
      break;
    default:
      value = {source:location.href};
  }
//  if( target == "iframe011" || target == "iframe012" ) {
//    ret = method_invoker(type, "iframe001", "method_invoker", type, target, method, value);
//  } else if( target == "iframe021" || target == "iframe022" ) {
//    ret = method_invoker(type, "iframe002", "method_invoker", type, target, method, value);
//  } else {
    ret = method_invoker(target, method, value);
//  }

  switch (typeof ret) {
    case 'undefined':
      alert("undefined " + ret);
      break;
    case 'boolean':
      alert("boolean " + ret);
      break;
    case 'number':
      alert("number " + ret);
      break;
    case 'string':
      alert("string " + ret);
      break;
    default:
      if (!ret) {
        alert("null " + ret);
      } else if( ret instanceof String ) {  // typeof obj == 'object'
        alert("string2 " + ret);
      } else if( ret instanceof WebSquare.collection.Vector ) {
        alert("vector " + ret);
      } else if( ret instanceof WebSquare.collection.Hashtable ) {
        alert("hashtable " + ret);
      } else if( WebSquare.xml.isDocument(ret) ) {
        alert("xml " + WebSquare.xml.serialize(ret));
      } else {
        alert("json " + JSON.stringify(ret));
      }
  }
}
