export const isObject = function(obj) {
	if(({}).toString.call(obj) === '[object Object]') {
		return true
	} else {
		return false
	}
}

export const isDomNode = function(obj) {
	let result
	if(typeof HTMLElement === 'object') {
		result = obj instanceof HTMLElement
	} else {
		result = obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
	}

	return result
}

export const isArray = function(val) {
	return typeof val === 'object' && ({}).toString.call(val) === '[object Array]'
}

export const isDef = function(val) {
	return val !== undefined && val !== null
}

export const isUndef = function(val) {
	return val === undefined || val === null
}