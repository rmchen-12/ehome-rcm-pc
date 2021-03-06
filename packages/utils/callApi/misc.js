/**
 *
 * Misc utility helpers
 *
 * @Author  Kelven Yang
 *
 */

export function parseIndexPath (indexPathString) {
	if (!indexPathString) return null;

	if (!typeof indexPathString == 'string') {
		throw new Error('parseIndexPath() expects a string parameter');
	}

	if (indexPathString.length == 0) return [];

	return indexPathString.split('.').map(item => parseInt(item));
}

export function indexPathToString (indexPath) {
	if (!indexPath) return null;

	if (!Array.isArray(indexPath)) throw new Error('indexPathToString() expects indexPath to be array object');

	if (indexPath.length == 0) return '';

	return indexPath.join('.');
}

export function capitalize (words) {
	return words.replace(/(^|\s)([a-z])/g, (m, p1, p2) => {
		return p1 + p2.toUpperCase();
	});
}

export function isObject (value) {
	var type = typeof value;
	return !!value && (type == 'object' || type == 'function');
}

// http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */
export function utf8ArrayToStr (array) {
	var out, i, len, c;
	var char2, char3;

	out = '';
	len = array.length;
	i = 0;
	while (i < len) {
		c = array[i++];
		switch (c >> 4) {
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
			// 0xxxxxxx
			out += String.fromCharCode(c);
			break;
		case 12:
		case 13:
			// 110x xxxx   10xx xxxx
			char2 = array[i++];
			out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
			break;
		case 14:
			// 1110 xxxx  10xx xxxx  10xx xxxx
			char2 = array[i++];
			char3 = array[i++];
			out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
			break;
		}
	}

	return out;
}
