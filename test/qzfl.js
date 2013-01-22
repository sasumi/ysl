window.QZFL = window.QZFL || {};
if (typeof(QZONE) == "object") {
    QZFL = QZONE;
}
else {
    window.QZONE = QZFL = {};
}
QZFL.version = "2.0.9.2";
QZFL._qzfl = 2.092;
QZFL.emptyFn = function(){
};
QZFL.returnFn = function(v){
    return v;
};
QZFL.userAgent = (function(){
    var t, vie, vff, vopera, vsf, vawk, vair, vchrome, winver, wintype, mactype, isBeta, isIPad, isIPhone, discerned, _ua = navigator.userAgent, _nv = navigator.appVersion, vffRE = /(?:Firefox|GranParadiso|Iceweasel|Minefield).(\d+\.\d+)/i, vwebkitRE = /AppleWebKit.(\d+\.\d+)/i, vchromeRE = /Chrome.(\d+\.\d+)/i, vsafariRE = /Version.(\d+\.\d+)/i, vwinRE = /Windows.+?(\d+\.\d+)/, vie = vff = vopera = vsf = vawk = vair = vchrome = winver = NaN;
    wintype = mactype = isBeta = isIPad = discerned = false;
    if (window.ActiveXObject) {
        vie = 9 - ((_nv.indexOf("Trident\/5.0") > -1) ? 0 : 1) - (window.XDomainRequest ? 0 : 1) - (window.XMLHttpRequest ? 0 : 1);
        t = navigator.appMinorVersion;
        if (vie > 7 && t && t.toLowerCase().indexOf("beta") > -1) {
            isBeta = true;
        }
    }
    else 
        if (document.getBoxObjectFor || typeof(window.mozInnerScreenX) != "undefined") {
            t = _ua.match(vffRE);
            vff = parseFloat((t && t[1]) || "3.3", 10);
        }
        else 
            if (!navigator.taintEnabled) {
                t = _ua.match(vwebkitRE);
                vawk = (t && t.length > 1) ? parseFloat(t[1], 10) : (!!document.evaluate ? (!!document.querySelector ? 525 : 420) : 419);
                if ((t = _nv.match(vchromeRE)) || window.chrome) {
                    if (!t) {
                        t = _ua.match(vchromeRE);
                    }
                    vchrome = parseFloat((t && t[1]) || "2.0", 10);
                }
                if ((t = _nv.match(vsafariRE)) && !window.chrome) {
                    if (!t) {
                        t = _ua.match(vsafariRE);
                    }
                    vsf = parseFloat((t && t[1]) || "3.3", 10);
                }
                if (_ua.indexOf("AdobeAIR") > -1) {
                    vair = 1;
                }
                if (_ua.indexOf("iPad") > -1) {
                    isIPad = true;
                }
                if (_ua.indexOf("iPhone") > -1) {
                    isIPhone = true;
                }
            }
            else 
                if (window.opera) {
                    vopera = parseFloat(_nv, 10);
                }
                else {
                    vie = 6;
                }
    if (_ua.indexOf("Windows") > -1) {
        wintype = true;
        t = _ua.match(vwinRE);
        winver = parseFloat((t && t[1]) || "5.1", 10);
    }
    else 
        if (_ua.indexOf("Mac OS X") > -1) {
            mactype = true;
        }
        else {
            wintype = true;
        }
    function adjustBehaviors(){
        if (!adjustBehaviors.adjusted && vie && vie < 7) {
            try {
                document.execCommand('BackgroundImageCache', false, true);
            } 
            catch (ignored) {
            }
            adjustBehaviors.adjusted = true;
        }
    }
    return {
        beta: isBeta,
        firefox: vff,
        ie: vie,
        opera: vopera,
        air: vair,
        safari: vsf,
        safariV: vsf,
        webkit: vawk,
        chrome: vchrome,
        adjustBehaviors: adjustBehaviors,
        windows: winver || wintype,
        isiPad: isIPad,
        isiPhone: isIPhone,
        macs: mactype
    };
})();
QZFL.object = {
    map: function(object, scope){
        scope = scope || window;
        QZFL.object.extend(scope, object);
    },
    extend: function(){
        var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (typeof target !== "object" && QZFL.object.getType(target) !== "function") {
            target = {};
        }
        if (length === i) {
            target = QZFL;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && typeof copy === "object" && !copy.nodeType) {
                        var clone;
                        if (src) {
                            clone = src;
                        }
                        else 
                            if (QZFL.lang.isArray(copy)) {
                                clone = [];
                            }
                            else 
                                if (QZFL.object.getType(copy) === 'object') {
                                    clone = {};
                                }
                                else {
                                    clone = copy;
                                }
                        target[name] = QZFL.object.extend(deep, clone, copy);
                    }
                    else 
                        if (copy !== undefined) {
                            target[name] = copy;
                        }
                }
            }
        }
        return target;
    },
    each: function(obj, callback){
        var name, value, i = 0, length = obj.length, isObj = (length === undefined) || (typeof(obj) == "function");
        if (isObj) {
            for (name in obj) {
                if (callback.call(obj[name], obj[name], name, obj) === false) {
                    break;
                }
            }
        }
        else {
            for (value = obj[0]; i < length && callback.call(value, value, i, obj) !== false; value = obj[++i]) {
            }
        }
        return obj;
    },
    getType: function(obj){
        return obj === null ? 'null' : (obj === undefined ? 'undefined' : Object.prototype.toString.call(obj).slice(8, -1).toLowerCase());
    },
    routeRE: /([\d\w_]+)/g,
    route: function(obj, path){
        obj = obj || {};
        path += '';
        var r = QZFL.object.routeRE, m;
        r.lastIndex = 0;
        while ((m = r.exec(path)) !== null) {
            obj = obj[m[0]];
            if (obj === undefined || obj === null) 
                break;
        }
        return obj;
    },
    bind: function(obj, fn){
        var args = Array.prototype.slice.call(arguments, 2);
        return function(){
            var _obj = obj || this, _args = args.concat(Array.prototype.slice.call(arguments, 0));
            if (typeof(fn) == "string") {
                if (_obj[fn]) {
                    return _obj[fn].apply(_obj, _args);
                }
            }
            else {
                return fn.apply(_obj, _args);
            }
        }
    }
};
QZFL.console = {
    print: function(msg, type){
        window.console && console.log((type == 4 ? (new Date() + ":") : "") + msg);
    }
};
QZFL.runTime = {
    isDebugMode: false,
    error: QZFL.emptyFn,
    warn: QZFL.emptyFn
};
QZFL.widget = {};
QZFL.namespace = QZFL.object;
QZFL.config = {
    debugLevel: 0,
    defaultDataCharacterSet: "GB2312",
    DCCookieDomain: "qzone.qq.com",
    domainPrefix: "qq.com",
    gbEncoderPath: "http://imgcache.qq.com/qzone/v5/toolpages/",
    FSHelperPage: "http://imgcache.qq.com/qzone/v5/toolpages/fp_gbk.html",
    defaultShareObject: "http://imgcache.qq.com/qzone/v5/toolpages/getset.swf",
    staticServer: "http://imgcache.qq.com/ac/qzone/qzfl/lc/"
};
QZFL.css = {
    classNameCache: {},
    getClassRegEx: function(className){
        var o = QZFL.css.classNameCache;
        return o[className] || (o[className] = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)'));
    },
    convertHexColor: function(color){
        var p = '0x';
        color = (color || '').toString();
        color.charAt(0) == '#' && (color = color.substring(1));
        color.length == 3 && (color = color.replace(/([0-9a-f])/ig, '$1$1'));
        return color.length == 6 ? [p + color.substr(0, 2) - 0, p + color.substr(2, 2) - 0, p + color.substr(4, 2) - 0] : [0, 0, 0];
    },
    styleSheets: {},
    getStyleSheetById: function(id){
        var s;
        return (s = QZFL.dom.get(id)) && s.sheet || (s = document.styleSheets) && s[id];
    },
    getRulesBySheet: function(sheetId){
        var ss = typeof(sheetId) == "object" ? sheetId : QZFL.css.getStyleSheetById(sheetId), rs = {}, head, base;
        if (ss && !(rs = ss.cssRules || ss.rules)) {
            if (head = document.getElementsByTagName('head')[0]) {
                if (base = head.getElementsByTagName('base')[0]) {
                    QZFL.dom.removeElement(base);
                    rs = ss.cssRules;
                    head.appendChild(base);
                }
            }
        }
        return rs;
    },
    getRuleBySelector: function(sheetId, selector){
        var _ss = QZFL.css.getStyleSheetById(sheetId), _rs = QZFL.css.getRulesBySheet(_ss);
        if (!_rs) {
            return null;
        }
        selector = (selector + '').toLowerCase();
        !_ss.cacheSelector && (_ss.cacheSelector = {});
        var _cs = _ss.cacheSelector[selector];
        if (_cs && _rs[_cs] && selector == (_rs[_cs].selectorText + '').toLowerCase()) {
            return _rs[_cs];
        }
        for (var i = 0, len = _rs.length; i < len; i++) {
            if (selector == (_rs[i].selectorText + '').toLowerCase()) {
                _ss.cacheSelector[selector] = i;
                return _rs[i];
            }
        }
        return null;
    },
    insertCSSLink: function(url, id){
        var doc = document, cssLink = (cssLink = $(id)) && cssLink.nodeName == 'LINK' ? cssLink : null, head = doc.getElementsByTagName("head")[0];
        if (!cssLink) {
            cssLink = doc.createElement("link");
            id && (cssLink.id = id);
            cssLink.rel = "stylesheet";
            cssLink.rev = "stylesheet";
            cssLink.type = "text/css";
            cssLink.media = "screen";
            head.appendChild(cssLink);
        }
        url && (cssLink.href = url);
        return cssLink.sheet || cssLink;
    },
    insertStyleSheet: function(sheetId, rules){
        var node = document.createElement("style");
        node.type = 'text/css';
        sheetId && (node.id = sheetId);
        document.getElementsByTagName("head")[0].appendChild(node);
        if (rules) {
            if (node.styleSheet) {
                node.styleSheet.cssText = rules;
            }
            else {
                node.appendChild(document.createTextNode(rules));
            }
        }
        return node.sheet || node;
    },
    removeStyleSheet: function(id){
        var _ss = QZFL.css.getStyleSheetById(id);
        _ss && QZFL.dom.removeElement(_ss.owningElement || _ss.ownerNode);
    },
    updateClassName: function(elem, removeNames, addNames){
        if (!elem || elem.nodeType != 1) {
            return;
        }
        var oriName = elem.className;
        if (removeNames && typeof(removeNames) == 'string' || addNames && typeof(addNames) == 'string') {
            if (removeNames == '*') {
                oriName = '';
            }
            else {
                var ar = oriName.split(' '), i = 0, k, l = ar.length, n, b;
                oriName = {};
                for (; i < l; i++) {
                    ar[i] && (oriName[ar[i]] = true);
                }
                if (addNames) {
                    ar = addNames.split(' ');
                    l = ar.length;
                    for (i = 0; i < l; i++) {
                        (n = ar[i]) && !oriName[n] && (b = oriName[n] = true);
                    }
                }
                if (removeNames) {
                    ar = removeNames.split(' ');
                    l = ar.length;
                    for (i = 0; i < l; i++) {
                        (n = ar[i]) && oriName[n] && (b = true) && delete oriName[n];
                    }
                }
                ar.length = 0;
                for (var k in oriName) {
                    ar.push(k);
                }
                oriName = ar.join(' ');
            }
            if (b) {
                elem.className = oriName;
            }
        }
        return oriName;
    },
    hasClassName: function(elem, name){
        return elem && (elem = elem.className) && name && ((' ' + elem + ' ').indexOf(' ' + name + ' ') + 1);
    },
    addClassName: function(elem, names){
        QZFL.css.updateClassName(elem, null, names);
    },
    removeClassName: function(elem, names){
        QZFL.css.updateClassName(elem, names);
    },
    replaceClassName: function(elems, a, b){
        QZFL.css.swapClassName(elems, a, b, true);
    },
    swapClassName: function(elems, a, b, _isRep){
        if (elems) {
            if (elems.constructor != Array) {
                elems = [elems];
            }
            for (var elem, i = 0, l = elems.length; i < l; i++) {
                if ((elem = elems[i]) && elem.nodeType == 1) {
                    if (QZFL.css.hasClassName(elem, a)) {
                        QZFL.css.updateClassName(elem, a, b);
                    }
                    else 
                        if (!_isRep && QZFL.css.hasClassName(elem, b)) {
                            QZFL.css.updateClassName(elem, b, a);
                        }
                }
            }
        }
    },
    toggleClassName: function(elem, name){
        if (!elem || elem.nodeType != 1) {
            return;
        }
        if (QZFL.css.hasClassName(elem, name)) {
            QZFL.css.updateClassName(elem, name);
        }
        else {
            QZFL.css.updateClassName(elem, null, name);
        }
    }
};
QZFL.dom = {
    getById: function(id){
        return document.getElementById(id);
    },
    getByName: function(name, tagName, rt){
        return QZFL.selector((tagName || "") + '[name="' + name + '"]', rt);
    },
    get: function(e){
        return (typeof(e) == "string") ? document.getElementById(e) : e;
    },
    getNode: function(e){
        return (e && (e.nodeType || e.item)) ? e : ((typeof(e) == 'string') ? document.getElementById(e) : null);
    },
    removeElement: function(el){
        if (typeof(el) == "string") {
            el = document.getElementById(el);
        }
        if (!el) {
            return;
        }
        if (el.removeNode) {
            el.removeNode(true);
        }
        else {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
        el = null;
        return null;
    },
    searchElementByClassName: function(el, className){
        el = QZFL.dom.get(el);
        if (!el) {
            return null
        }
        var re = QZFL.css.getClassRegEx(className);
        while (el) {
            if (re.test(el.className)) {
                return el;
            }
            el = el.parentNode;
        }
        return null;
    },
    getElementsByClassName: function(className, tag, root){
        return QZFL.selector((tag || '') + '.' + className, root);
    },
    isAncestor: function(node1, node2){
        if (!node1 || !node2) {
            return false;
        }
        if (node1.contains && node2.nodeType && !QZFL.userAgent.webkit) {
            return node1.contains(node2) && node1 != node2;
        }
        if (node1.compareDocumentPosition && node2.nodeType) {
            return !!(node1.compareDocumentPosition(node2) & 16);
        }
        else 
            if (node2.nodeType) {
                return !!QZFL.dom.getAncestorBy(node2, function(el){
                    return el == node1;
                });
            }
        return false;
    },
    getAncestorBy: function(node, method){
        while (node = node.parentNode) {
            if (node && node.nodeType == 1 && (!method || method(node))) {
                return node;
            }
        }
        return null;
    },
    getFirstChild: function(node){
        node = QZFL.dom.getNode(node);
        if (!node) {
            return null;
        }
        var child = !!node.firstChild && node.firstChild.nodeType == 1 ? node.firstChild : null;
        return child || QZFL.dom.getNextSibling(node.firstChild);
    },
    getNextSibling: function(node){
        node = QZFL.dom.getNode(node);
        if (!node) {
            return null;
        }
        while (node) {
            node = node.nextSibling;
            if (!!node && node.nodeType == 1) {
                return node;
            }
        }
        return null;
    },
    getPreviousSibling: function(node){
        node = QZFL.dom.getNode(node);
        if (!node) {
            return null;
        }
        while (node) {
            node = node.previousSibling;
            if (!!node && node.nodeType == 1) {
                return node;
            }
        }
        return null;
    },
    swapNode: function(node1, node2){
        if (node1.swapNode) {
            node1.swapNode(node2);
        }
        else {
            var prt = node2.parentNode, next = node2.nextSibling;
            if (next == node1) {
                prt.insertBefore(node1, node2);
            }
            else 
                if (node2 == node1.nextSibling) {
                    prt.insertBefore(node2, node1);
                }
                else {
                    node1.parentNode.replaceChild(node2, node1);
                    prt.insertBefore(node1, next);
                }
        }
    },
    createElementIn: function(tagName, el, insertFirst, attributes){
        var tagName = tagName || "div", el = QZFL.dom.get(el) || document.body, _doc = el.ownerDocument, _e = _doc.createElement(tagName);
        if (attributes) {
            for (var k in attributes) {
                if (k == "class") {
                    _e.className = attributes[k];
                }
                else 
                    if (k == "style") {
                        _e.style.cssText = attributes[k];
                    }
                    else {
                        _e[k] = attributes[k];
                    }
            }
        }
        if (insertFirst) {
            el.insertBefore(_e, el.firstChild);
        }
        else {
            el.appendChild(_e);
        }
        return _e;
    },
    getStyle: function(el, property){
        el = QZFL.dom.get(el);
        if (!el || el.nodeType == 9) {
            return null;
        }
        var w3cMode = document.defaultView && document.defaultView.getComputedStyle, computed = !w3cMode ? null : document.defaultView.getComputedStyle(el, ''), value = "";
        switch (property) {
            case "float":
                property = w3cMode ? "cssFloat" : "styleFloat";
                break;
            case "opacity":
                if (!w3cMode) {
                    var val = 100;
                    try {
                        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                    } 
                    catch (e) {
                        try {
                            val = el.filters('alpha').opacity;
                        } 
                        catch (e) {
                        }
                    }
                    return val / 100;
                }
                else {
                    return parseFloat((computed || el.style)[property]);
                }
                break;
            case "backgroundPositionX":
                if (w3cMode) {
                    property = "backgroundPosition";
                    return ((computed || el.style)[property]).split(" ")[0];
                }
                break;
            case "backgroundPositionY":
                if (w3cMode) {
                    property = "backgroundPosition";
                    return ((computed || el.style)[property]).split(" ")[1];
                }
                break;
        }
        if (w3cMode) {
            return (computed || el.style)[property];
        }
        else {
            return (el.currentStyle[property] || el.style[property]);
        }
    },
    setStyle: function(el, properties, value){
        if (!(el = QZFL.dom.get(el)) || el.nodeType != 1) {
            return false;
        }
        var tmp, bRtn = true, w3cMode = (tmp = document.defaultView) && tmp.getComputedStyle, rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;
        if (typeof(properties) == 'string') {
            tmp = properties;
            properties = {};
            properties[tmp] = value;
        }
        for (var prop in properties) {
            value = properties[prop];
            if (prop == 'float') {
                prop = w3cMode ? "cssFloat" : "styleFloat";
            }
            else 
                if (prop == 'opacity') {
                    if (!w3cMode) {
                        prop = 'filter';
                        value = value >= 1 ? '' : ('alpha(opacity=' + Math.round(value * 100) + ')');
                    }
                }
                else 
                    if (prop == 'backgroundPositionX' || prop == 'backgroundPositionY') {
                        tmp = prop.slice(-1) == 'X' ? 'Y' : 'X';
                        if (w3cMode) {
                            var v = QZFL.dom.getStyle(el, "backgroundPosition" + tmp);
                            prop = 'backgroundPosition';
                            typeof(value) == 'number' && (value = value + 'px');
                            value = tmp == 'Y' ? (value + " " + (v || "top")) : ((v || 'left') + " " + value);
                        }
                    }
            if (typeof el.style[prop] != "undefined") {
                el.style[prop] = value + (typeof value === "number" && !rexclude.test(prop) ? 'px' : '');
                bRtn = bRtn && true;
            }
            else {
                bRtn = bRtn && false;
            }
        }
        return bRtn;
    },
    createNamedElement: function(type, name, doc){
        var _doc = doc || document, element;
        try {
            element = _doc.createElement('<' + type + ' name="' + name + '">');
        } 
        catch (ign) {
        }
        if (!element) {
            element = _doc.createElement(type);
        }
        if (!element.name) {
            element.name = name;
        }
        return element;
    },
    getPosition: function(el){
        var xy = QZFL.dom.getXY(el), size = QZFL.dom.getSize(el);
        return {
            "top": xy[1],
            "left": xy[0],
            "width": size[0],
            "height": size[1]
        };
    },
    setPosition: function(el, pos){
        QZFL.dom.setXY(el, pos['left'], pos['top']);
        QZFL.dom.setSize(el, pos['width'], pos['height']);
    },
    getXY: function(el, doc){
        var _t = 0, _l = 0, _doc = doc || document;
        if (el) {
            if (_doc.documentElement.getBoundingClientRect && el.getBoundingClientRect) {
                var box = el.getBoundingClientRect(), oDoc = el.ownerDocument, _fix = QZFL.userAgent.ie ? 2 : 0;
                _t = box.top - _fix + QZFL.dom.getScrollTop(oDoc);
                _l = box.left - _fix + QZFL.dom.getScrollLeft(oDoc);
            }
            else {
                while (el.offsetParent) {
                    _t += el.offsetTop;
                    _l += el.offsetLeft;
                    el = el.offsetParent;
                }
            }
        }
        return [_l, _t];
    },
    getSize: function(el){
        var _fix = [0, 0];
        if (el) {
            QZFL.object.each(["Left", "Right", "Top", "Bottom"], function(v){
                _fix[v == "Left" || v == "Right" ? 0 : 1] += (parseInt(QZFL.dom.getStyle(el, "border" + v + "Width"), 10) || 0) + (parseInt(QZFL.dom.getStyle(el, "padding" + v), 10) || 0);
            });
            var _w = el.offsetWidth - _fix[0], _h = el.offsetHeight - _fix[1];
            return [_w, _h];
        }
        return [-1, -1];
    },
    setXY: function(el, x, y){
        el = QZFL.dom.get(el);
        var _ml = parseInt(QZFL.dom.getStyle(el, "marginLeft")) || 0, _mt = parseInt(QZFL.dom.getStyle(el, "marginTop")) || 0;
        QZFL.dom.setStyle(el, "left", parseInt(x) - _ml + "px");
        QZFL.dom.setStyle(el, "top", parseInt(y) - _mt + "px");
    },
    getScrollLeft: function(doc){
        var _doc = doc || document;
        return Math.max(_doc.documentElement.scrollLeft, _doc.body.scrollLeft);
    },
    getScrollTop: function(doc){
        var _doc = doc || document;
        return Math.max(_doc.documentElement.scrollTop, _doc.body.scrollTop);
    },
    getScrollHeight: function(doc){
        var _doc = doc || document;
        return Math.max(_doc.documentElement.scrollHeight, _doc.body.scrollHeight);
    },
    getScrollWidth: function(doc){
        var _doc = doc || document;
        return Math.max(_doc.documentElement.scrollWidth, _doc.body.scrollWidth);
    },
    setScrollLeft: function(value, doc){
        var _doc = doc || document;
        _doc[_doc.compatMode == "CSS1Compat" && !QZFL.userAgent.webkit ? "documentElement" : "body"].scrollLeft = value;
    },
    setScrollTop: function(value, doc){
        var _doc = doc || document;
        _doc[_doc.compatMode == "CSS1Compat" && !QZFL.userAgent.webkit ? "documentElement" : "body"].scrollTop = value;
    },
    getClientHeight: function(doc){
        var _doc = doc || document;
        return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientHeight : _doc.body.clientHeight;
    },
    getClientWidth: function(doc){
        var _doc = doc || document;
        return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientWidth : _doc.body.clientWidth;
    },
    _SET_SIZE_RE: /^\d+(?:\.\d*)?(px|%|em|in|cm|mm|pc|pt)?$/,
    setSize: function(el, w, h){
        el = QZFL.dom.get(el);
        var _r = QZFL.dom._SET_SIZE_RE, m;
        QZFL.dom.setStyle(el, "width", (m = _r.exec(w)) ? (m[1] ? w : (parseInt(w, 10) + 'px')) : 'auto');
        QZFL.dom.setStyle(el, "height", (m = _r.exec(h)) ? (m[1] ? h : (parseInt(h, 10) + 'px')) : 'auto');
    },
    getDocumentWindow: function(doc){
        var _doc = doc || document;
        return _doc.parentWindow || _doc.defaultView;
    },
    getElementsByTagNameNS: function(node, ns, tgn){
        var res = [];
        if (node) {
            if (node.getElementsByTagNameNS) {
                return node.getElementsByTagName(ns + ":" + tgn);
            }
            else 
                if (node.getElementsByTagName) {
                    var n = document.namespaces;
                    if (n.length > 0) {
                        var l = node.getElementsByTagName(tgn);
                        for (var i = 0, len = l.length; i < len; ++i) {
                            if (l[i].scopeName == ns) {
                                res.push(l[i]);
                            }
                        }
                    }
                }
        }
        return res;
    },
    collection2Array: function(coll){
        if (QZFL.lang.isArray(coll)) {
            return coll;
        }
        else {
            var r = [];
            for (var i = 0, len = coll.length; i < len; ++i) {
                r.push(coll[i]);
            }
        }
        return r;
    },
    getElementByTagNameBubble: function(a, tn){
        if (!isNode(a)) {
            return null;
        }
        tn += "";
        var maxLv = 31;
        while (a && a.tagName && (a.tagName != tn.toUpperCase())) {
            if (a == document.body || (--maxLv) < 0) {
                return null;
            }
            a = a.parentNode;
        }
        return a;
    }
};
QZFL.event = {
    KEYS: {
        BACKSPACE: 8,
        TAB: 9,
        RETURN: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DELETE: 46
    },
    _eventListDictionary: {},
    _fnSeqUID: 0,
    _objSeqUID: 0,
    addEvent: function(obj, eventType, fn, argArray){
        var cfn, res = false, l;
        if (!obj) {
            return res;
        }
        if (!obj.eventsListUID) {
            obj.eventsListUID = "e" + (++QZFL.event._objSeqUID);
        }
        if (!(l = QZFL.event._eventListDictionary[obj.eventsListUID])) {
            l = QZFL.event._eventListDictionary[obj.eventsListUID] = {};
        }
        if (!fn.__elUID) {
            fn.__elUID = "e" + (++QZFL.event._fnSeqUID) + obj.eventsListUID;
        }
        if (!l[eventType]) {
            l[eventType] = {};
        }
        if (typeof(l[eventType][fn.__elUID]) == 'function') {
            return false;
        }
        cfn = function(evt){
            return fn.apply(obj, !argArray ? [QZFL.event.getEvent(evt)] : ([QZFL.event.getEvent(evt)]).concat(argArray));
        };
        if (obj.addEventListener) {
            obj.addEventListener(eventType, cfn, false);
            res = true;
        }
        else 
            if (obj.attachEvent) {
                res = obj.attachEvent("on" + eventType, cfn);
            }
            else {
                res = false;
            }
        if (res) {
            l[eventType][fn.__elUID] = cfn;
        }
        return res;
    },
    removeEvent: function(obj, eventType, fn){
        var cfn = fn, res = false, l = QZFL.event._eventListDictionary, r;
        if (!obj) {
            return res;
        }
        if (!fn) {
            return QZFL.event.purgeEvent(obj, eventType);
        }
        if (obj.eventsListUID && l[obj.eventsListUID]) {
            l = l[obj.eventsListUID][eventType];
            if (l && l[fn.__elUID]) {
                cfn = l[fn.__elUID];
                r = l;
            }
        }
        if (obj.removeEventListener) {
            obj.removeEventListener(eventType, cfn, false);
            res = true;
        }
        else 
            if (obj.detachEvent) {
                obj.detachEvent("on" + eventType, cfn);
                res = true;
            }
            else {
                return false;
            }
        if (res && r && r[fn.__elUID]) {
            delete r[fn.__elUID];
        }
        return res;
    },
    purgeEvent: function(obj, type){
        var l;
        if (obj.eventsListUID && (l = QZFL.event._eventListDictionary[obj.eventsListUID]) && l[type]) {
            for (var k in l[type]) {
                if (obj.removeEventListener) {
                    obj.removeEventListener(type, l[type][k], false);
                }
                else 
                    if (obj.detachEvent) {
                        obj.detachEvent('on' + type, l[type][k]);
                    }
            }
        }
        if (obj['on' + type]) {
            obj['on' + type] = null;
        }
        if (l) {
            l[type] = null;
            delete l[type];
        }
        return true;
    },
    getEvent: function(evt){
        var evt = window.event || evt, c, cnt;
        if (!evt && window.Event) {
            c = arguments.callee;
            cnt = 0;
            while (c) {
                if ((evt = c.arguments[0]) && typeof(evt.srcElement) != "undefined") {
                    break;
                }
                else 
                    if (cnt > 9) {
                        break;
                    }
                c = c.caller;
                ++cnt;
            }
        }
        return evt;
    },
    getButton: function(evt){
        var e = QZFL.event.getEvent(evt);
        if (!e) {
            return -1
        }
        if (QZFL.userAgent.ie) {
            return e.button - Math.ceil(e.button / 2);
        }
        else {
            return e.button;
        }
    },
    getTarget: function(evt){
        var e = QZFL.event.getEvent(evt);
        if (e) {
            return e.srcElement || e.target;
        }
        else {
            return null;
        }
    },
    getCurrentTarget: function(evt){
        var e = QZFL.event.getEvent(evt);
        if (e) {
            return e.currentTarget || document.activeElement;
        }
        else {
            return null;
        }
    },
    cancelBubble: function(evt){
        evt = QZFL.event.getEvent(evt);
        if (!evt) {
            return false
        }
        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
        else {
            if (!evt.cancelBubble) {
                evt.cancelBubble = true;
            }
        }
    },
    preventDefault: function(evt){
        evt = QZFL.event.getEvent(evt);
        if (!evt) {
            return false
        }
        if (evt.preventDefault) {
            evt.preventDefault();
        }
        else {
            evt.returnValue = false;
        }
    },
    mouseX: function(evt){
        evt = QZFL.event.getEvent(evt);
        return evt.pageX || (evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
    },
    mouseY: function(evt){
        evt = QZFL.event.getEvent(evt);
        return evt.pageY || (evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
    },
    getRelatedTarget: function(ev){
        ev = QZFL.event.getEvent(ev);
        var t = ev.relatedTarget;
        if (!t) {
            if (ev.type == "mouseout") {
                t = ev.toElement;
            }
            else 
                if (ev.type == "mouseover") {
                    t = ev.fromElement;
                }
                else {
                }
        }
        return t;
    },
    onDomReady: function(fn){
        QZFL.event.onDomReady._fn = function(){
            fn();
            QZFL.event.onDomReady._fn = null;
        };
        if (document.addEventListener) {
            if (QZFL.userAgent.safari < 4) {
                var interval = setInterval(function(){
                    if ((/loaded|complete/).test(document.readyState)) {
                        QZFL.event.onDomReady._fn();
                        clearInterval(interval);
                    }
                }, 50);
            }
            else {
                document.addEventListener("DOMContentLoaded", QZFL.event.onDomReady._fn, true);
            }
        }
        else {
            var src = window.location.protocol == 'https:' ? '//:' : 'javascript:void(0)';
            document.write('<script onreadystatechange="if(this.readyState==\'complete\'){this.parentNode.removeChild(this);QZFL.event.onDomReady._fn();}" defer="defer" src="' + src + '"><\/script\>');
        }
    }
};
QZFL.event.on = QZFL.event.addEvent;
QZFL.event.bind = QZFL.object.bind;
QZFL.queue = (function(){
    var _o = QZFL.object;
    var _queue = {};
    var _Queue = function(key, queue){
        if (this instanceof arguments.callee) {
            this._qz_queuekey = key;
            return this;
        }
        if (_o.getType(queue = queue || []) == "array") {
            _queue[key] = queue;
        }
        return new _Queue(key);
    };
    var _extend = {
        push: function(key, fn){
            fn = this._qz_queuekey ? key : fn;
            _queue[this._qz_queuekey || key].push(fn);
        },
        shift: function(key){
            var _q = _queue[this._qz_queuekey || key];
            if (_q) {
                return QZFL.queue._exec(_q.shift());
            }
        },
        getLen: function(key){
            return _queue[this._qz_queuekey || key].length;
        },
        run: function(key){
            var _q = _queue[this._qz_queuekey || key];
            if (_q) {
                _o.each(_q, QZFL.queue._exec);
            }
        },
        timedChunk: function(key, conf){
            var _q = _queue[this._qz_queuekey || key], _conf;
            if (_q) {
                _conf = QZFL.lang.propertieCopy(conf, QZFL.queue._tcCof, null, true);
                setTimeout(function(){
                    var _start = +new Date();
                    do {
                        QZFL.queue.shift(key);
                    }
                    while (QZFL.queue.getLen(key) > 0 && (+new Date() - _start < _conf.runTime));
                    if (QZFL.queue.getLen(key) > 0) {
                        setTimeout(arguments.callee, _conf.waitTime);
                        _conf.onWait();
                    }
                    else {
                        _conf.onRunEnd();
                    }
                }, 0);
            }
        },
        _tcCof: {
            'runTime': 50,
            'waitTime': 25,
            'onRunEnd': QZFL.emptyFn,
            'onWait': QZFL.emptyFn
        },
        _exec: function(value, key, source){
            if (!value || _o.getType(value) != "function") {
                if (_o.getType(key) == "number") {
                    source[key] = null;
                }
                return false;
            }
            try {
                return value();
            } 
            catch (e) {
                QZFL.console.print("QZFL Queue Got An Error: [" + e.name + "]  " + e.message, 1)
            }
        }
    };
    _o.extend(_Queue.prototype, _extend);
    _o.extend(_Queue, _extend);
    return _Queue;
})();
QZFL.string = {
    RegExps: {
        trim: /^\s+|\s+$/g,
        ltrim: /^\s+/,
        rtrim: /\s+$/,
        nl2br: /\n/g,
        s2nb: /[\x20]{2}/g,
        URIencode: /[\x09\x0A\x0D\x20\x21-\x29\x2B\x2C\x2F\x3A-\x3F\x5B-\x5E\x60\x7B-\x7E]/g,
        escHTML: {
            re_amp: /&/g,
            re_lt: /</g,
            re_gt: />/g,
            re_apos: /\x27/g,
            re_quot: /\x22/g
        },
        escString: {
            bsls: /\\/g,
            nl: /\n/g,
            rt: /\r/g,
            tab: /\t/g
        },
        restXHTML: {
            re_amp: /&amp;/g,
            re_lt: /&lt;/g,
            re_gt: /&gt;/g,
            re_apos: /&(?:apos|#0?39);/g,
            re_quot: /&quot;/g
        },
        write: /\{(\d{1,2})(?:\:([xodQqb]))?\}/g,
        isURL: /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i,
        cut: /[\x00-\xFF]/,
        getRealLen: {
            r0: /[^\x00-\xFF]/g,
            r1: /[\x00-\xFF]/g
        },
        format: /\{([\d\w\.]+)\}/g
    },
    commonReplace: function(s, p, r){
        return s.replace(p, r);
    },
    listReplace: function(s, l){
        if (QZFL.lang.isHashMap(l)) {
            for (var i in l) {
                s = QZFL.string.commonReplace(s, l[i], i);
            }
            return s;
        }
        else {
            return s + '';
        }
    },
    trim: function(str){
        return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.trim, '');
    },
    ltrim: function(str){
        return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.ltrim, '');
    },
    rtrim: function(str){
        return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.rtrim, '');
    },
    nl2br: function(str){
        return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.nl2br, '<br />');
    },
    s2nb: function(str){
        return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.s2nb, '&nbsp;&nbsp;');
    },
    URIencode: function(str){
        var cc, ccc;
        return (str + "").replace(QZFL.string.RegExps.URIencode, function(a){
            if (a == "\x20") {
                return "+";
            }
            else 
                if (a == "\x0D") {
                    return "";
                }
            cc = a.charCodeAt(0);
            ccc = cc.toString(16);
            return "%" + ((cc < 16) ? ("0" + ccc) : ccc);
        });
    },
    escHTML: function(str){
        var t = QZFL.string.RegExps.escHTML;
        return QZFL.string.listReplace((str + ""), {
            '&amp;': t.re_amp,
            '&lt;': t.re_lt,
            '&gt;': t.re_gt,
            '&#039;': t.re_apos,
            '&quot;': t.re_quot
        });
    },
    escString: function(str){
        var t = QZFL.string.RegExps.escString, h = QZFL.string.RegExps.escHTML;
        return QZFL.string.listReplace((str + ""), {
            '\\\\': t.bsls,
            '\\n': t.nl,
            '': t.rt,
            '\\t': t.tab,
            '\\\'': h.re_apos,
            '\\"': h.re_quot
        });
    },
    restHTML: function(str){
        if (!QZFL.string.restHTML.__utilDiv) {
            QZFL.string.restHTML.__utilDiv = document.createElement("div");
        }
        var t = QZFL.string.restHTML.__utilDiv;
        t.innerHTML = (str + "");
        if (typeof(t.innerText) != 'undefined') {
            return t.innerText;
        }
        else 
            if (typeof(t.textContent) != 'undefined') {
                return t.textContent;
            }
            else 
                if (typeof(t.text) != 'undefined') {
                    return t.text;
                }
                else {
                    return '';
                }
    },
    restXHTML: function(str){
        var t = QZFL.string.RegExps.restXHTML;
        return QZFL.string.listReplace((str + ""), {
            '<': t.re_lt,
            '>': t.re_gt,
            '\x27': t.re_apos,
            '\x22': t.re_quot,
            '&': t.re_amp
        });
    },
    write: function(strFormat, someArgs){
        if (arguments.length < 1 || !QZFL.lang.isString(strFormat)) {
            return '';
        }
        var rArr = QZFL.lang.arg2arr(arguments), result = rArr.shift(), tmp;
        return result.replace(QZFL.string.RegExps.write, function(a, b, c){
            b = parseInt(b, 10);
            if (b < 0 || (typeof rArr[b] == 'undefined')) {
                return '(n/a)';
            }
            else {
                if (!c) {
                    return rArr[b];
                }
                else {
                    switch (c) {
                        case 'x':
                            return '0x' + rArr[b].toString(16);
                        case 'o':
                            return 'o' + rArr[b].toString(8);
                        case 'd':
                            return rArr[b].toString(10);
                        case 'Q':
                            return '\x22' + rArr[b].toString(16) + '\x22';
                        case 'q':
                            return '`' + rArr[b].toString(16) + '\x27';
                        case 'b':
                            return '<' + !!rArr[b] + '>';
                    }
                }
            }
        });
    },
    isURL: function(s){
        return QZFL.string.RegExps.isURL.test(s);
    },
    customEncode: function(s, type){
        var r;
        if (typeof type == 'undefined') {
            type = '';
        }
        switch (type.toUpperCase()) {
            case "URICPT":
                r = encodeURIComponent(s);
                break;
            default:
                r = encodeURIComponent(s);
        }
        return r;
    },
    escapeURI: function(s){
        if (window.encodeURIComponent) {
            return encodeURIComponent(s);
        }
        if (window.escape) {
            return escape(s);
        }
        return '';
    },
    fillLength: function(source, length, ch, isRight){
        source = source + '';
        if (source.length < length) {
            var res = (1 << (length - source.length)).toString(2).substring(1);
            if (ch) {
                res = res.replace("0", ch);
            }
            return isRight ? (source + res) : (res + source);
        }
        else {
            return source;
        }
    },
    cut: function(str, bitLen, tails){
        str += '';
        bitLen -= 0;
        tails = tails || '';
        if (isNaN(bitLen)) {
            return str;
        }
        var len = str.length, i = Math.min(Math.floor(bitLen / 2), len), cnt = QZFL.string.getRealLen(str.slice(0, i));
        for (; i < len && cnt < bitLen; i++) {
            cnt += 1 + !QZFL.string.RegExps.cut.test(str.charAt(i));
        }
        return str.slice(0, cnt > bitLen ? i - 1 : i) + (i < len ? tails : '');
    },
    getRealLen: function(s, isUTF8){
        if (typeof(s) != 'string') {
            return 0;
        }
        if (!isUTF8) {
            return s.replace(QZFL.string.RegExps.getRealLen.r0, "**").length;
        }
        else {
            var cc = s.replace(QZFL.string.RegExps.getRealLen.r1, "");
            return (s.length - cc.length) + (encodeURI(cc).length / 3);
        }
    },
    format: function(str){
        var args = Array.prototype.slice.call(arguments), v;
        str = args.shift() + '';
        if (args.length == 1 && typeof(args[0]) == 'object') {
            args = args[0];
        }
        QZFL.string.RegExps.format.lastIndex = 0;
        return str.replace(QZFL.string.RegExps.format, function(m, n){
            v = QZFL.object.route(args, n);
            return v === undefined ? m : v;
        });
    }
};
QZFL.util = {
    buildUri: function(s){
        return new QZFL.util.URI(s);
    },
    URI: function(s){
        if (!(QZFL.object.getType(s) == "string")) {
            return null;
        }
        if (s.indexOf("://") < 1) {
            s = location.protocol + "//" + location.host + (s.indexOf("/") == 0 ? "" : location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)) + s;
        }
        var depart = s.split("://");
        if (QZFL.object.getType(depart) == "array" && depart.length > 1 && (/^[a-zA-Z]+$/).test(depart[0])) {
            this.protocol = depart[0].toLowerCase();
            var h = depart[1].split("/");
            if (QZFL.object.getType(h) == "array") {
                this.host = h[0];
                this.pathname = "/" + h.slice(1).join("/").replace(/(\?|\#).+/i, "");
                this.href = s;
                var se = depart[1].lastIndexOf("?"), ha = depart[1].lastIndexOf("#");
                this.search = (se >= 0) ? depart[1].substring(se) : "";
                this.hash = (ha >= 0) ? depart[1].substring(ha) : "";
                if (this.search.length > 0 && this.hash.length > 0) {
                    if (ha < se) {
                        this.search = "";
                    }
                    else {
                        this.search = depart[1].substring(se, ha);
                    }
                }
                return this;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
};
QZFL.lang = {
    isString: function(o){
        return QZFL.object.getType(o) == "string";
    },
    isArray: function(o){
        return QZFL.object.getType(o) == "array";
    },
    isFunction: function(o){
        return QZFL.object.getType(o) == "function";
    },
    isHashMap: function(o){
        return QZFL.object.getType(o) == "object";
    },
    isNode: function(o){
        if (typeof(Node) == 'undefined') {
            Node = null;
        }
        try {
            if (!o || !((Node != undefined && o instanceof Node) || o.nodeName)) {
                return false;
            }
        } 
        catch (ignored) {
            return false;
        }
        return true;
    },
    isElement: function(o){
        return o && o.nodeType == 1;
    }
};
;
(function(){
    QZFL.object.extend(QZFL.util, {
        copyToClip: function(text){
            if (QZFL.userAgent.ie) {
                return clipboardData.setData("Text", text);
            }
            else {
                var o = QZFL.shareObject.getValidSO();
                return o ? o.setClipboard(text) : false;
            }
        },
        evalGlobal: function(js){
            js += "";
            var obj = document.createElement('script'), head = document.documentElement || document.getElementsByTagName("head")[0];
            obj.type = 'text/javascript';
            obj.id = "__evalGlobal_" + QZFL.util.evalGlobal._counter;
            try {
                obj.innerHTML = js;
            } 
            catch (e) {
                obj.text = js;
            }
            head.insertBefore(obj, head.firstChild);
            QZFL.util.evalGlobal._counter++;
            setTimeout(function(){
                QZFL.dom.removeElement(obj);
            }, 50);
        },
        runStyleGlobal: function(st){
            if (QZFL.userAgent.safari) {
                var obj = document.createElement('style');
                obj.type = 'text/css';
                obj.id = "__runStyle_" + QZFL.util.runStyleGlobal._counter;
                try {
                    obj.textContent = st;
                } 
                catch (e) {
                    alert(e.message);
                }
                var h = document.getElementsByTagName("head")[0];
                if (h) {
                    h.appendChild(obj);
                    QZFL.util.runStyleGlobal._counter++;
                }
            }
            else {
            }
        },
        genHttpParamString: function(o){
            if (QZFL.lang.isHashMap(o)) {
                var r = [];
                try {
                    for (var i in o) {
                        r.push(i + "=" + QZFL.string.customEncode(o[i], "URICPT"));
                    }
                } 
                catch (ignore) {
                    return '';
                }
                return r.join("&");
            }
            else 
                if (typeof(o) == 'string') {
                    return o;
                }
                else {
                    return '';
                }
        },
        splitHttpParamString: function(s){
            return QZFL.util.commonDictionarySplit(s, "&");
        },
        commonDictionarySplit: function(s, esp, vq, eq){
            var res = {};
            if (!s || typeof(s) != "string") {
                return res;
            }
            if (typeof(esp) != 'string') {
                esp = "&";
            }
            if (typeof(vq) != 'string') {
                vq = "";
            }
            if (typeof(eq) != 'string') {
                eq = "=";
            }
            var l = s.split(vq + esp), len = l.length, tmp, t = eq + vq, p;
            if (vq) {
                tmp = l[len - 1].split(vq);
                l[len - 1] = tmp.slice(0, tmp.length - 1).join(vq);
            }
            for (var i = 0, len; i < len; i++) {
                if (eq) {
                    tmp = l[i].split(t);
                    if (tmp.length > 1) {
                        res[tmp[0]] = tmp.slice(1).join(t);
                        continue;
                    }
                }
                res[l[i]] = true;
            }
            return res;
        }
    });
    QZFL.util.evalGlobal._counter = 0;
    QZFL.util.runStyleGlobal._counter = 0;
})();
QZFL.lang.isValidXMLdom = function(o){
    return !!(o && o.xml && /^<\?xml/.test(o.xml));
};
QZFL.lang.arg2arr = function(refArgs, start){
    return Array.prototype.slice.apply(refArgs, [start || 0, refArgs.length]);
};
QZFL.lang.getObjByNameSpace = function(ns, setup){
    if (typeof(ns) != 'string') {
        return ns;
    }
    var l = ns.split("."), r = window;
    try {
        for (var i = 0, len = l.length; i < len; ++i) {
            if (typeof(r[l[i]]) == 'undefined') {
                if (setup) {
                    r[l[i]] = {};
                }
                else {
                    return void (0);
                }
            }
            r = r[l[i]];
        }
        return r;
    } 
    catch (ignore) {
        return void (0);
    }
};
QZFL.lang.objectClone = function(obj, preventName){
    if ((typeof obj) == 'object') {
        var res = (QZFL.lang.isArray(obj)) ? [] : {};
        for (var i in obj) {
            if (i != preventName) 
                res[i] = QZFL.lang.objectClone(obj[i], preventName);
        }
        return res;
    }
    else 
        if ((typeof obj) == 'function') {
            return Object;
        }
    return obj;
};
QZFL.lang.obj2str = function(obj){
    var t, sw;
    if ((typeof obj) == 'object') {
        if (obj === null) {
            return 'null';
        }
        sw = QZFL.lang.isArray(obj);
        t = [];
        for (var i in obj) {
            t.push((sw ? "" : ("\"" + QZFL.string.escString(i) + "\":")) + obj2str(obj[i]));
        }
        t = t.join();
        return sw ? ("[" + t + "]") : ("{" + t + "}");
    }
    else 
        if ((typeof obj) == 'function') {
            return '';
        }
        else 
            if ((typeof obj) == 'undefined') {
                return 'undefined';
            }
            else 
                if ((typeof obj) == 'number') {
                    return obj.toString();
                }
    return !obj ? "\"\"" : ("\"" + QZFL.string.escString(obj) + "\"");
};
QZFL.lang.propertieCopy = function(s, b, propertiSet, notOverWrite){
    var l = (!propertiSet || typeof(propertiSet) != 'object') ? b : propertiSet;
    s = s || {};
    for (var p in l) {
        if (!notOverWrite || !(p in s)) {
            s[p] = l[p];
        }
    }
    return s;
};
QZFL.lang.tryThese = function(){
    for (var res, i = 0, len = arguments.length; i < len; i++) {
        try {
            return arguments[i]();
        } 
        catch (ignore) {
        }
    }
    return null;
};
QZFL.lang.chain = function(u, v){
    var calls = Array.prototype.slice.call(arguments);
    return function(){
        for (var i = 0, len = calls.length; i < len; i++) {
            if (calls[i] && calls[i].apply(null, arguments) === false) {
                return false;
            }
        }
        return true;
    };
};
QZFL.lang.uniqueArray = function(arr){
    if (!QZFL.lang.isArray(arr)) {
        return arr;
    }
    var flag = {}, index = 0;
    while (index < arr.length) {
        if (flag[arr[index]] == typeof(arr[index])) {
            arr.splice(index, 1);
            continue;
        }
        flag[arr[index].toString()] = typeof(arr[index]);
        ++index;
    }
    return arr;
};
QZFL.enviroment = (function(){
    var _p = {}, hookPool = {};
    function envGet(kname){
        return _p[kname];
    }
    function envDel(kname){
        delete _p[kname];
        return true;
    }
    function envSet(kname, value){
        if (typeof value == 'undefined') {
            if (typeof kname == 'undefined') {
                return false;
            }
            else 
                if (!(_p[kname] === undefined)) {
                    return false;
                }
        }
        else {
            _p[kname] = value;
            return true;
        }
    }
    return {
        get: envGet,
        set: envSet,
        del: envDel,
        hookPool: hookPool
    };
})();
QZFL.pageEvents = (function(){
    function _ihp(){
        var qs = location.search.substring(1), qh = location.hash.substring(1), s, h, n;
        ENV.set("_queryString", qs);
        ENV.set("_queryHash", qh);
        ENV.set("queryString", s = QZFL.util.splitHttpParamString(qs));
        ENV.set("queryHash", h = QZFL.util.splitHttpParamString(qh));
        if (s && s.DEBUG) {
            n = parseInt(s.DEBUG, 10);
            if (!isNaN(n)) {
                QZFL.config.debugLevel = n;
            }
        }
    }
    function _bootStrap(){
        if (document.addEventListener) {
            if (QZFL.userAgent.safari) {
                var interval = setInterval(function(){
                    if ((/loaded|complete/).test(document.readyState)) {
                        _onloadHook();
                        clearInterval(interval);
                    }
                }, 50);
            }
            else {
                document.addEventListener("DOMContentLoaded", _onloadHook, true);
            }
        }
        else {
            var src = 'javascript:void(0)';
            if (window.location.protocol == 'https:') {
                src = '//:';
            }
            document.write('<script onreadystatechange="if(this.readyState==\'complete\'){this.parentNode.removeChild(this);QZFL.pageEvents._onloadHook();}" defer="defer" src="' + src + '"><\/script\>');
        }
        window.onload = QZFL.lang.chain(window.onload, function(){
            _onloadHook();
            _runHooks('onafterloadhooks');
        });
        window.onbeforeunload = function(){
            return _runHooks('onbeforeunloadhooks');
        };
        window.onunload = QZFL.lang.chain(window.onunload, function(){
            _runHooks('onunloadhooks');
        });
    }
    function _onloadHook(){
        _runHooks('onloadhooks');
        QZFL.enviroment.loaded = true;
    }
    function _runHook(handler){
        try {
            handler();
        } 
        catch (ex) {
        }
    }
    function _runHooks(hooks){
        var isbeforeunload = (hooks == 'onbeforeunloadhooks'), warn = null, hc = window.ENV.hookPool;
        do {
            var h = hc[hooks];
            if (!isbeforeunload) {
                hc[hooks] = null;
            }
            if (!h) {
                break;
            }
            for (var ii = 0; ii < h.length; ii++) {
                if (isbeforeunload) {
                    warn = warn || h[ii]();
                }
                else {
                    h[ii]();
                }
            }
            if (isbeforeunload) {
                break;
            }
        }
        while (hc[hooks]);
        if (isbeforeunload) {
            if (warn) {
                return warn;
            }
            else {
                QZFL.enviroment.loaded = false;
            }
        }
    }
    function _addHook(hooks, handler){
        var c = window.ENV.hookPool;
        (c[hooks] ? c[hooks] : (c[hooks] = [])).push(handler);
    }
    function _insertHook(hooks, handler, position){
        var c = window.ENV.hookPool;
        if (typeof(position) == 'number' && position >= 0) {
            if (!c[hooks]) {
                c[hooks] = [];
            }
            c[hooks].splice(position, 0, handler);
        }
        else {
            return false;
        }
    }
    function _lr(handler){
        QZFL.enviroment.loaded ? _runHook(handler) : _addHook('onloadhooks', handler);
    }
    function _bulr(handler){
        _addHook('onbeforeunloadhooks', handler);
    }
    function _ulr(handler){
        _addHook('onunloadhooks', handler);
    }
    function pinit(){
        _bootStrap();
        _ihp();
        QZFL.userAgent.adjustBehaviors();
        var _dt = $("__DEBUG_out");
        if (_dt) {
            ENV.set("dout", _dt);
        }
        var __dalert;
        if (!ENV.get("alertConverted")) {
            __dalert = alert;
            eval('var alert=function(msg){if(msg!=undefined){__dalert(msg);return msg;}}');
            ENV.set("alertConverted", true);
        }
        var t = ENV.get("queryHash");
        if (t && t.DEBUG) {
            QZFL.config.debugLevel = 2;
        }
    }
    return {
        onloadRegister: _lr,
        onbeforeunloadRegister: _bulr,
        onunloadRegister: _ulr,
        initHttpParams: _ihp,
        bootstrapEventHandlers: _bootStrap,
        _onloadHook: _onloadHook,
        insertHooktoHooksQueue: _insertHook,
        pageBaseInit: pinit
    };
})();
QZFL.string.parseXML = function(text){
    var doc;
    if (window.ActiveXObject) {
        doc = QZFL.lang.tryThese(function(){
            return new ActiveXObject('MSXML2.DOMDocument.6.0');
        }, function(){
            return new ActiveXObject('MSXML2.DOMDocument.5.0');
        }, function(){
            return new ActiveXObject('MSXML2.DOMDocument.4.0');
        }, function(){
            return new ActiveXObject('MSXML2.DOMDocument.3.0');
        }, function(){
            return new ActiveXObject('MSXML2.DOMDocument');
        }, function(){
            return new ActiveXObject('Microsoft.XMLDOM');
        });
        doc.async = "false";
        doc.loadXML(text);
        if (doc.parseError.reason) {
            return null;
        }
    }
    else {
        var parser = new DOMParser();
        doc = parser.parseFromString(text, "text/xml");
        if (doc.documentElement.nodeName == 'parsererror') {
            return null;
        }
    }
    return doc.documentElement;
};
QZFL.string.timeFormatString = function(date, mask, baseTime){
    typeof(date) == 'number' && (date = new Date(date));
    if (isNaN(date) || !date instanceof Date) {
        return '';
    }
    try {
        date.getTime();
    } 
    catch (e) {
        return '';
    }
    if (typeof(mask) !== 'string') {
        return s + '';
    }
    baseTime = baseTime || 0;
    var me = QZFL.string.timeFormatString, map = me._map, isRelative = false, v;
    return mask.replace(me._re, function(a, b, c){
        (isRelative = b.charAt(0) == '_') && (b = b.charAt(1));
        if (!map[b]) {
            return a;
        }
        if (isRelative == false) {
            v = date[map[b][0]]();
            b == 'y' && (v %= 100);
            b == 'M' && v++;
            return v < 10 ? QZFL.string.fillLength(v, 2, c) : v.toString();
        }
        else {
            return Math.floor(Math.abs(date - baseTime) / map[b][1]);
        }
    });
};
QZFL.string.timeFormatString._re = /\{([_yYMdhms]{1,2})(?:\:([\d\w\s]))?\}/g;
QZFL.string.timeFormatString._map = {
    y: ['getYear', 31104000000],
    Y: ['getFullYear', 31104000000],
    M: ['getMonth', 2592000000],
    d: ['getDate', 86400000],
    h: ['getHours', 3600000],
    m: ['getMinutes', 60000],
    s: ['getSeconds', 1000]
};
QZFL.string.StringBuilder = function(){
    this._strList = QZFL.lang.arg2arr(arguments);
};
QZFL.string.StringBuilder.prototype = {
    append: function(str){
        if (QZFL.lang.isString(str)) {
            this._strList.push(str.toString());
        }
    },
    insertFirst: function(str){
        if (QZFL.lang.isString(str)) {
            this._strList.unshift(str.toString());
        }
    },
    appendArray: function(arr){
        if (isArray(arr)) {
            this._strList = this._strList.concat(arr);
        }
    },
    toString: function(spliter){
        return this._strList.join(!spliter ? '' : spliter);
    },
    clear: function(){
        this._strList.splice(0, this._strList.length);
    }
};
;
(function(){
    var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g, done = 0, toString = Object.prototype.toString, hasDuplicate = false;
    var Sizzle = function(selector, context, results, seed){
        results = results || [];
        var origContext = context = context || document;
        if (context.nodeType !== 1 && context.nodeType !== 9) {
            return [];
        }
        if (!selector || typeof selector !== "string") {
            return results;
        }
        var parts = [], m, set, checkSet, check, mode, extra, prune = true, contextXML = isXML(context);
        chunker.lastIndex = 0;
        while ((m = chunker.exec(selector)) !== null) {
            parts.push(m[1]);
            if (m[2]) {
                extra = RegExp.rightContext;
                break;
            }
        }
        if (parts.length > 1 && origPOS.exec(selector)) {
            if (parts.length === 2 && Expr.relative[parts[0]]) {
                set = posProcess(parts[0] + parts[1], context);
            }
            else {
                set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);
                while (parts.length) {
                    selector = parts.shift();
                    if (Expr.relative[selector]) 
                        selector += parts.shift();
                    set = posProcess(selector, set);
                }
            }
        }
        else {
            if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
                var ret = Sizzle.find(parts.shift(), context, contextXML);
                context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
            }
            if (context) {
                var ret = seed ? {
                    expr: parts.pop(),
                    set: makeArray(seed)
                } : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
                set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
                if (parts.length > 0) {
                    checkSet = makeArray(set);
                }
                else {
                    prune = false;
                }
                while (parts.length) {
                    var cur = parts.pop(), pop = cur;
                    if (!Expr.relative[cur]) {
                        cur = "";
                    }
                    else {
                        pop = parts.pop();
                    }
                    if (pop == null) {
                        pop = context;
                    }
                    Expr.relative[cur](checkSet, pop, contextXML);
                }
            }
            else {
                checkSet = parts = [];
            }
        }
        if (!checkSet) {
            checkSet = set;
        }
        if (!checkSet) {
            throw "Syntax error, unrecognized expression: " + (cur || selector);
        }
        if (toString.call(checkSet) === "[object Array]") {
            if (!prune) {
                results.push.apply(results, checkSet);
            }
            else 
                if (context && context.nodeType === 1) {
                    for (var i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i]))) {
                            results.push(set[i]);
                        }
                    }
                }
                else {
                    for (var i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && checkSet[i].nodeType === 1) {
                            results.push(set[i]);
                        }
                    }
                }
        }
        else {
            makeArray(checkSet, results);
        }
        if (extra) {
            Sizzle(extra, origContext, results, seed);
            Sizzle.uniqueSort(results);
        }
        return results;
    };
    Sizzle.uniqueSort = function(results){
        if (sortOrder) {
            hasDuplicate = false;
            results.sort(sortOrder);
            if (hasDuplicate) {
                for (var i = 1; i < results.length; i++) {
                    if (results[i] === results[i - 1]) {
                        results.splice(i--, 1);
                    }
                }
            }
        }
    };
    Sizzle.matches = function(expr, set){
        return Sizzle(expr, null, null, set);
    };
    Sizzle.find = function(expr, context, isXML){
        var set, match;
        if (!expr) {
            return [];
        }
        for (var i = 0, l = Expr.order.length; i < l; i++) {
            var type = Expr.order[i], match;
            if ((match = Expr.match[type].exec(expr))) {
                var left = RegExp.leftContext;
                if (left.substr(left.length - 1) !== "\\") {
                    match[1] = (match[1] || "").replace(/\\/g, "");
                    set = Expr.find[type](match, context, isXML);
                    if (set != null) {
                        expr = expr.replace(Expr.match[type], "");
                        break;
                    }
                }
            }
        }
        if (!set) {
            set = context.getElementsByTagName("*");
        }
        return {
            set: set,
            expr: expr
        };
    };
    Sizzle.filter = function(expr, set, inplace, not){
        var old = expr, result = [], curLoop = set, match, anyFound, isXMLFilter = set && set[0] && isXML(set[0]);
        while (expr && set.length) {
            for (var type in Expr.filter) {
                if ((match = Expr.match[type].exec(expr)) != null) {
                    var filter = Expr.filter[type], found, item;
                    anyFound = false;
                    if (curLoop == result) {
                        result = [];
                    }
                    if (Expr.preFilter[type]) {
                        match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
                        if (!match) {
                            anyFound = found = true;
                        }
                        else 
                            if (match === true) {
                                continue;
                            }
                    }
                    if (match) {
                        for (var i = 0; (item = curLoop[i]) != null; i++) {
                            if (item) {
                                found = filter(item, match, i, curLoop);
                                var pass = not ^ !!found;
                                if (inplace && found != null) {
                                    if (pass) {
                                        anyFound = true;
                                    }
                                    else {
                                        curLoop[i] = false;
                                    }
                                }
                                else 
                                    if (pass) {
                                        result.push(item);
                                        anyFound = true;
                                    }
                            }
                        }
                    }
                    if (found !== undefined) {
                        if (!inplace) {
                            curLoop = result;
                        }
                        expr = expr.replace(Expr.match[type], "");
                        if (!anyFound) {
                            return [];
                        }
                        break;
                    }
                }
            }
            if (expr == old) {
                if (anyFound == null) {
                    throw "Syntax error, unrecognized expression: " + expr;
                }
                else {
                    break;
                }
            }
            old = expr;
        }
        return curLoop;
    };
    var Expr = Sizzle.selectors = {
        order: ["ID", "NAME", "TAG"],
        match: {
            ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
            CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
            PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
        },
        attrMap: {
            "class": "className",
            "for": "htmlFor"
        },
        attrHandle: {
            href: function(elem){
                return elem.getAttribute("href");
            }
        },
        relative: {
            "+": function(checkSet, part, isXML){
                var isPartStr = typeof part === "string", isTag = isPartStr && !/\W/.test(part), isPartStrNotTag = isPartStr && !isTag;
                if (isTag && !isXML) {
                    part = part.toUpperCase();
                }
                for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                    if ((elem = checkSet[i])) {
                        while ((elem = elem.previousSibling) && elem.nodeType !== 1) {
                        }
                        checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ? elem || false : elem === part;
                    }
                }
                if (isPartStrNotTag) {
                    Sizzle.filter(part, checkSet, true);
                }
            },
            ">": function(checkSet, part, isXML){
                var isPartStr = typeof part === "string";
                if (isPartStr && !/\W/.test(part)) {
                    part = isXML ? part : part.toUpperCase();
                    for (var i = 0, l = checkSet.length; i < l; i++) {
                        var elem = checkSet[i];
                        if (elem) {
                            var parent = elem.parentNode;
                            checkSet[i] = parent.nodeName === part ? parent : false;
                        }
                    }
                }
                else {
                    for (var i = 0, l = checkSet.length; i < l; i++) {
                        var elem = checkSet[i];
                        if (elem) {
                            checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
                        }
                    }
                    if (isPartStr) {
                        Sizzle.filter(part, checkSet, true);
                    }
                }
            },
            "": function(checkSet, part, isXML){
                var doneName = done++, checkFn = dirCheck;
                if (!/\W/.test(part)) {
                    var nodeCheck = part = isXML ? part : part.toUpperCase();
                    checkFn = dirNodeCheck;
                }
                checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
            },
            "~": function(checkSet, part, isXML){
                var doneName = done++, checkFn = dirCheck;
                if (typeof part === "string" && !/\W/.test(part)) {
                    var nodeCheck = part = isXML ? part : part.toUpperCase();
                    checkFn = dirNodeCheck;
                }
                checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
            }
        },
        find: {
            ID: function(match, context, isXML){
                if (typeof context.getElementById !== "undefined" && !isXML) {
                    var m = context.getElementById(match[1]);
                    return m ? [m] : [];
                }
            },
            NAME: function(match, context, isXML){
                if (typeof context.getElementsByName !== "undefined") {
                    var ret = [], results = context.getElementsByName(match[1]);
                    for (var i = 0, l = results.length; i < l; i++) {
                        if (results[i].getAttribute("name") === match[1]) {
                            ret.push(results[i]);
                        }
                    }
                    return ret.length === 0 ? null : ret;
                }
            },
            TAG: function(match, context){
                return context.getElementsByTagName(match[1]);
            }
        },
        preFilter: {
            CLASS: function(match, curLoop, inplace, result, not, isXML){
                match = " " + match[1].replace(/\\/g, "") + " ";
                if (isXML) {
                    return match;
                }
                for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
                    if (elem) {
                        if (not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0)) {
                            if (!inplace) 
                                result.push(elem);
                        }
                        else 
                            if (inplace) {
                                curLoop[i] = false;
                            }
                    }
                }
                return false;
            },
            ID: function(match){
                return match[1].replace(/\\/g, "");
            },
            TAG: function(match, curLoop){
                for (var i = 0; curLoop[i] === false; i++) {
                }
                return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
            },
            CHILD: function(match){
                if (match[1] == "nth") {
                    var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
                    match[2] = (test[1] + (test[2] || 1)) - 0;
                    match[3] = test[3] - 0;
                }
                match[0] = done++;
                return match;
            },
            ATTR: function(match, curLoop, inplace, result, not, isXML){
                var name = match[1].replace(/\\/g, "");
                if (!isXML && Expr.attrMap[name]) {
                    match[1] = Expr.attrMap[name];
                }
                if (match[2] === "~=") {
                    match[4] = " " + match[4] + " ";
                }
                return match;
            },
            PSEUDO: function(match, curLoop, inplace, result, not){
                if (match[1] === "not") {
                    if (chunker.exec(match[3]).length > 1 || /^\w/.test(match[3])) {
                        match[3] = Sizzle(match[3], null, null, curLoop);
                    }
                    else {
                        var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                        if (!inplace) {
                            result.push.apply(result, ret);
                        }
                        return false;
                    }
                }
                else 
                    if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                        return true;
                    }
                return match;
            },
            POS: function(match){
                match.unshift(true);
                return match;
            }
        },
        filters: {
            enabled: function(elem){
                return elem.disabled === false && elem.type !== "hidden";
            },
            disabled: function(elem){
                return elem.disabled === true;
            },
            checked: function(elem){
                return elem.checked === true;
            },
            selected: function(elem){
                elem.parentNode.selectedIndex;
                return elem.selected === true;
            },
            parent: function(elem){
                return !!elem.firstChild;
            },
            empty: function(elem){
                return !elem.firstChild;
            },
            has: function(elem, i, match){
                return !!Sizzle(match[3], elem).length;
            },
            header: function(elem){
                return /h\d/i.test(elem.nodeName);
            },
            text: function(elem){
                return "text" === elem.type;
            },
            radio: function(elem){
                return "radio" === elem.type;
            },
            checkbox: function(elem){
                return "checkbox" === elem.type;
            },
            file: function(elem){
                return "file" === elem.type;
            },
            password: function(elem){
                return "password" === elem.type;
            },
            submit: function(elem){
                return "submit" === elem.type;
            },
            image: function(elem){
                return "image" === elem.type;
            },
            reset: function(elem){
                return "reset" === elem.type;
            },
            button: function(elem){
                return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
            },
            input: function(elem){
                return /input|select|textarea|button/i.test(elem.nodeName);
            }
        },
        setFilters: {
            first: function(elem, i){
                return i === 0;
            },
            last: function(elem, i, match, array){
                return i === array.length - 1;
            },
            even: function(elem, i){
                return i % 2 === 0;
            },
            odd: function(elem, i){
                return i % 2 === 1;
            },
            lt: function(elem, i, match){
                return i < match[3] - 0;
            },
            gt: function(elem, i, match){
                return i > match[3] - 0;
            },
            nth: function(elem, i, match){
                return match[3] - 0 == i;
            },
            eq: function(elem, i, match){
                return match[3] - 0 == i;
            }
        },
        filter: {
            PSEUDO: function(elem, match, i, array){
                var name = match[1], filter = Expr.filters[name];
                if (filter) {
                    return filter(elem, i, match, array);
                }
                else 
                    if (name === "contains") {
                        return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
                    }
                    else 
                        if (name === "not") {
                            var not = match[3];
                            for (i = 0, l = not.length; i < l; i++) {
                                if (not[i] === elem) {
                                    return false;
                                }
                            }
                            return true;
                        }
            },
            CHILD: function(elem, match){
                var type = match[1], node = elem;
                switch (type) {
                    case 'only':
                    case 'first':
                        while ((node = node.previousSibling)) {
                            if (node.nodeType === 1) {
                                return false;
                            }
                        }
                        if (type == 'first') {
                            return true;
                        }
                        node = elem;
                    case 'last':
                        while ((node = node.nextSibling)) {
                            if (node.nodeType === 1) 
                                return false;
                        }
                        return true;
                    case 'nth':
                        var first = match[2], last = match[3];
                        if (first == 1 && last == 0) {
                            return true;
                        }
                        var doneName = match[0], parent = elem.parentNode;
                        if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                            var count = 0;
                            for (node = parent.firstChild; node; node = node.nextSibling) {
                                if (node.nodeType === 1) {
                                    node.nodeIndex = ++count;
                                }
                            }
                            parent.sizcache = doneName;
                        }
                        var diff = elem.nodeIndex - last;
                        if (first == 0) {
                            return diff == 0;
                        }
                        else {
                            return (diff % first == 0 && diff / first >= 0);
                        }
                }
            },
            ID: function(elem, match){
                return elem.nodeType === 1 && elem.getAttribute("id") === match;
            },
            TAG: function(elem, match){
                return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
            },
            CLASS: function(elem, match){
                return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
            },
            ATTR: function(elem, match){
                var name = match[1], result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name), value = result + "", type = match[2], check = match[4];
                return result == null ? type === "!=" : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value != check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
            },
            POS: function(elem, match, i, array){
                var name = match[2], filter = Expr.setFilters[name];
                if (filter) {
                    return filter(elem, i, match, array);
                }
            }
        }
    };
    var origPOS = Expr.match.POS;
    for (var type in Expr.match) {
        Expr.match[type] = new RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source);
    }
    var makeArray = function(array, results){
        array = Array.prototype.slice.call(array);
        if (results) {
            results.push.apply(results, array);
            return results;
        }
        return array;
    };
    try {
        Array.prototype.slice.call(document.documentElement.childNodes);
    } 
    catch (e) {
        makeArray = function(array, results){
            var ret = results || [];
            if (toString.call(array) === "[object Array]") {
                Array.prototype.push.apply(ret, array);
            }
            else {
                if (typeof array.length === "number") {
                    for (var i = 0, l = array.length; i < l; i++) {
                        ret.push(array[i]);
                    }
                }
                else {
                    for (var i = 0; array[i]; i++) {
                        ret.push(array[i]);
                    }
                }
            }
            return ret;
        };
    }
    var sortOrder;
    if (document.documentElement.compareDocumentPosition) {
        sortOrder = function(a, b){
            var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
            if (ret === 0) {
                hasDuplicate = true;
            }
            return ret;
        };
    }
    else 
        if ("sourceIndex" in document.documentElement) {
            sortOrder = function(a, b){
                var ret = a.sourceIndex - b.sourceIndex;
                if (ret === 0) {
                    hasDuplicate = true;
                }
                return ret;
            };
        }
        else 
            if (document.createRange) {
                sortOrder = function(a, b){
                    var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
                    aRange.selectNode(a);
                    aRange.collapse(true);
                    bRange.selectNode(b);
                    bRange.collapse(true);
                    var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
                    if (ret === 0) {
                        hasDuplicate = true;
                    }
                    return ret;
                };
            }
    (function(){
        var form = document.createElement("div"), id = "script" + (new Date).getTime();
        form.innerHTML = "<a name='" + id + "'/>";
        var root = document.documentElement;
        root.insertBefore(form, root.firstChild);
        if (!!document.getElementById(id)) {
            Expr.find.ID = function(match, context, isXML){
                if (typeof context.getElementById !== "undefined" && !isXML) {
                    var m = context.getElementById(match[1]);
                    return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
                }
            };
            Expr.filter.ID = function(elem, match){
                var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                return elem.nodeType === 1 && node && node.nodeValue === match;
            };
        }
        root.removeChild(form);
        root = form = null;
    })();
    (function(){
        var div = document.createElement("div");
        div.appendChild(document.createComment(""));
        if (div.getElementsByTagName("*").length > 0) {
            Expr.find.TAG = function(match, context){
                var results = context.getElementsByTagName(match[1]);
                if (match[1] === "*") {
                    var tmp = [];
                    for (var i = 0; results[i]; i++) {
                        if (results[i].nodeType === 1) {
                            tmp.push(results[i]);
                        }
                    }
                    results = tmp;
                }
                return results;
            };
        }
        div.innerHTML = "<a href='#'></a>";
        if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
            Expr.attrHandle.href = function(elem){
                return elem.getAttribute("href", 2);
            };
        }
        div = null;
    })();
    if (document.querySelectorAll) 
        (function(){
            var oldSizzle = Sizzle, div = document.createElement("div");
            div.innerHTML = "<p class='TEST'></p>";
            if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
                return;
            }
            Sizzle = function(query, context, extra, seed){
                context = context || document;
                if (!seed && context.nodeType === 9 && !isXML(context)) {
                    try {
                        return makeArray(context.querySelectorAll(query), extra);
                    } 
                    catch (e) {
                    }
                }
                return oldSizzle(query, context, extra, seed);
            };
            for (var prop in oldSizzle) {
                Sizzle[prop] = oldSizzle[prop];
            }
            div = null;
        })();
    if (document.getElementsByClassName && document.documentElement.getElementsByClassName) 
        (function(){
            var div = document.createElement("div");
            div.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (div.getElementsByClassName("e").length === 0) 
                return;
            div.lastChild.className = "e";
            if (div.getElementsByClassName("e").length === 1) 
                return;
            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function(match, context, isXML){
                if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                    return context.getElementsByClassName(match[1]);
                }
            };
            div = null;
        })();
    function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML){
        var sibDir = dir == "previousSibling" && !isXML;
        for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];
            if (elem) {
                if (sibDir && elem.nodeType === 1) {
                    elem.sizcache = doneName;
                    elem.sizset = i;
                }
                elem = elem[dir];
                var match = false;
                while (elem) {
                    if (elem.sizcache === doneName) {
                        match = checkSet[elem.sizset];
                        break;
                    }
                    if (elem.nodeType === 1 && !isXML) {
                        elem.sizcache = doneName;
                        elem.sizset = i;
                    }
                    if (elem.nodeName === cur) {
                        match = elem;
                        break;
                    }
                    elem = elem[dir];
                }
                checkSet[i] = match;
            }
        }
    }
    function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML){
        var sibDir = dir == "previousSibling" && !isXML;
        for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];
            if (elem) {
                if (sibDir && elem.nodeType === 1) {
                    elem.sizcache = doneName;
                    elem.sizset = i;
                }
                elem = elem[dir];
                var match = false;
                while (elem) {
                    if (elem.sizcache === doneName) {
                        match = checkSet[elem.sizset];
                        break;
                    }
                    if (elem.nodeType === 1) {
                        if (!isXML) {
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }
                        if (typeof cur !== "string") {
                            if (elem === cur) {
                                match = true;
                                break;
                            }
                        }
                        else 
                            if (Sizzle.filter(cur, [elem]).length > 0) {
                                match = elem;
                                break;
                            }
                    }
                    elem = elem[dir];
                }
                checkSet[i] = match;
            }
        }
    }
    var contains = document.compareDocumentPosition ? function(a, b){
        return a.compareDocumentPosition(b) & 16;
    }
 : function(a, b){
        return a !== b && (a.contains ? a.contains(b) : true);
    };
    var isXML = function(elem){
        return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" || !!elem.ownerDocument && elem.ownerDocument.documentElement.nodeName !== "HTML";
    };
    var posProcess = function(selector, context){
        var tmpSet = [], later = "", match, root = context.nodeType ? [context] : context;
        while ((match = Expr.match.PSEUDO.exec(selector))) {
            later += match[0];
            selector = selector.replace(Expr.match.PSEUDO, "");
        }
        selector = Expr.relative[selector] ? selector + "*" : selector;
        for (var i = 0, l = root.length; i < l; i++) {
            Sizzle(selector, root[i], tmpSet);
        }
        return Sizzle.filter(later, tmpSet);
    };
    QZFL.selector = Sizzle;
    QZFL.object.makeArray = makeArray;
    QZFL.dom.uniqueSort = Sizzle.uniqueSort;
    QZFL.dom.contains = contains;
})();
;
(function(){
    var _handler = QZFL.ElementHandler = function(selector, context){
        this.elements = null;
        this._isElementHandler = true;
        this._init(selector, context);
    };
    _handler.prototype = {
        _init: function(selector, context){
            if (QZFL.lang.isString(selector)) {
                this.elements = QZFL.selector(selector, context);
            }
            else 
                if (selector instanceof QZFL.ElementHandler) {
                    this.elements = selector.elements.slice();
                }
                else 
                    if (QZFL.lang.isArray(selector)) {
                        this.elements = selector;
                    }
                    else 
                        if (selector && ((selector.nodeType && selector.nodeType !== 3 && selector.nodeType !== 8) || selector.setTimeout)) {
                            this.elements = [selector];
                        }
                        else {
                            this.elements = [];
                        }
        },
        findElements: function(selector){
            var _pushstack = [], _s;
            this.each(function(el){
                _s = QZFL.selector(selector, el);
                if (_s.length > 0) {
                    _pushstack = _pushstack.concat(_s);
                }
            });
            return _pushstack;
        },
        find: function(selector){
            return _el.get(this.findElements(selector));
        },
        filter: function(expr, elems, not){
            if (not) {
                expr = ":not(" + expr + ")";
            }
            return _el.get(QZFL.selector.matches(expr, elems || this.elements));
        },
        each: function(fn){
            QZFL.object.each(this.elements, fn);
            return this;
        },
        concat: function(elements){
            return _el.get(this.elements.concat(!!elements._isElementHandler ? elements.elements : elements));
        },
        get: function(index){
            return _el.get(this.elements[index]);
        },
        slice: function(){
            return _el.get(Array.prototype.slice.apply(this.elements, arguments));
        }
    };
    var _el = QZFL.element = {
        get: function(selector, context){
            return new _handler(selector, context);
        },
        extend: function(object){
            QZFL.object.extend(_handler, object);
        },
        extendFn: function(object){
            QZFL.object.extend(_handler.prototype, object);
        },
        getVersion: function(){
            return _handler.version;
        }
    }
})();
QZFL.element.extend({
    version: "1.0"
});
QZFL.element.extendFn({
    bind: function(evtType, fn){
        if (typeof(fn) != 'function') {
            return false;
        }
        return this.each(function(el){
            QZFL.event.addEvent(el, evtType, fn);
        });
    },
    unBind: function(evtType, fn){
        return this.each(function(el){
            QZFL.event[fn ? 'removeEvent' : 'purgeEvent'](el, evtType, fn);
        });
    },
    onHover: function(fnOver, fnOut){
        this.onMouseOver(fnOver);
        return this.onMouseOut(fnOut);
    },
    onMouseEnter: function(fn){
        return this.bind('mouseover', function(evt){
            var rel = QZFL.event.getRelatedTarget(evt);
            if (QZFL.lang.isFunction(fn) && !QZFL.dom.isAncestor(this, rel)) {
                fn.call(this, evt);
            }
        });
    },
    onMouseLeave: function(fn){
        return this.bind('mouseout', function(evt){
            var rel = QZFL.event.getRelatedTarget(evt);
            if (QZFL.lang.isFunction(fn) && !QZFL.dom.isAncestor(this, rel)) {
                fn.call(this, evt);
            }
        });
    }
});
QZFL.object.each(['onClick', 'onMouseOver', 'onMouseMove', 'onMouseOut', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyPress', 'onKeyUp'], function(name, index){
    QZFL.ElementHandler.prototype[name] = function(fn){
        return this.bind(name.slice(2).toLowerCase(), fn);
    };
});
QZFL.element.extendFn({
    setHtml: function(value){
        return this.setAttr("innerHTML", value);
    },
    getHtml: function(index){
        var _e = this.elements[index || 0];
        return !!_e ? _e.innerHTML : null;
    },
    setVal: function(value){
        if (QZFL.object.getType(value) == "array") {
            var _v = "\x00" + value.join("\x00") + "\x00";
            this.each(function(el){
                if (/radio|checkbox/.test(el.type)) {
                    el.checked = el.nodeType && ("\x00" + _v.indexOf(el.value.toString() + "\x00") > -1 || _v.indexOf("\x00" + el.name.toString() + "\x00") > -1);
                }
                else 
                    if (el.tagName == "SELECT") {
                        QZFL.object.each(el.options, function(e){
                            e.selected = e.nodeType == 1 && ("\x00" + _v.indexOf(e.value.toString() + "\x00") > -1 || _v.indexOf("\x00" + e.text.toString() + "\x00") > -1);
                        });
                    }
                    else {
                        el.value = value;
                    }
            })
        }
        else {
            this.setAttr("value", value);
        }
        return this;
    },
    getVal: function(index){
        var _e = this.elements[index || 0], _v;
        if (_e) {
            if (_e.tagName == "SELECT") {
                _v = [];
                if (_e.selectedIndex < 0) {
                    return null;
                }
                if (_e.type == "select-one") {
                    _v.push(_e.value);
                }
                else {
                    QZFL.object.each(_e.options, function(e){
                        if (e.nodeType == 1 && e.selected) {
                            _v.push(e.value);
                        }
                    });
                }
            }
            else {
                _v = _e.value;
            }
        }
        else {
            return null
        }
        return _v;
    },
    hasClass: function(className){
        if (this.elements && this.elements.length) {
            return QZFL.css.hasClassName(this.elements[0], className);
        }
        return false;
    },
    addClass: function(className){
        return this.each(function(el){
            QZFL.css.addClassName(el, className);
        })
    },
    removeClass: function(className){
        return this.each(function(el){
            QZFL.css.removeClassName(el, className);
        })
    },
    toggleClass: function(className){
        return this.each(function(el){
            QZFL.css.toggleClassName(el, className);
        })
    },
    getSize: function(index){
        var _e = this.elements[index || 0];
        return !!_e ? QZFL.dom.getSize(_e) : null;
    },
    getXY: function(index){
        var _e = this.elements[index || 0];
        return !!_e ? QZFL.dom.getXY(_e) : null;
    },
    setSize: function(width, height){
        return this.each(function(el){
            QZFL.dom.setSize(el, width, height);
        })
    },
    setXY: function(X, Y){
        return this.each(function(el){
            QZFL.dom.setXY(el, X, Y);
        })
    },
    hide: function(){
        return this.each(function(el){
            QZFL.dom.setStyle(el, "display", "none");
        })
    },
    show: function(isBlock){
        return this.each(function(el){
            QZFL.dom.setStyle(el, "display", isBlock ? 'block' : '');
        })
    },
    getStyle: function(key, index){
        var _e = this.elements[index || 0];
        return !!_e ? QZFL.dom.getStyle(_e, key) : null;
    },
    setStyle: function(key, value){
        return this.each(function(el){
            QZFL.dom.setStyle(el, key, value);
        })
    },
    setAttr: function(key, value){
        key = (key == "class" ? "className" : key);
        return this.each(function(el){
            el[key] = value;
        });
    },
    getAttr: function(key, index){
        key = (key == "class" ? "className" : key);
        var _e = this.elements[index || 0];
        return !!_e ? (_e[key] || _e.getAttribute(key)) : null;
    }
});
QZFL.element.extendFn({
    getPrev: function(){
        var _arr = [];
        this.each(function(el){
            var _e = QZFL.dom.getPreviousSibling(el);
            _arr.push(_e);
        });
        return QZFL.element.get(_arr);
    },
    getNext: function(){
        var _arr = [];
        this.each(function(el){
            var _e = QZFL.dom.getNextSibling(el);
            _arr.push(_e);
        });
        return QZFL.element.get(_arr);
    },
    getChildren: function(){
        var _arr = [];
        this.each(function(el){
            var node = QZFL.dom.getFirstChild(el);
            while (node) {
                if (!!node && node.nodeType == 1) {
                    _arr.push(node);
                }
                node = node.nextSibling;
            }
        });
        return QZFL.element.get(_arr);
    },
    getParent: function(){
        var _arr = [];
        this.each(function(el){
            var _e = el.parentNode;
            _arr.push(_e);
        });
        return QZFL.element.get(_arr);
    }
});
QZFL.element.extendFn({
    create: function(tagName, attributes){
        var _arr = [];
        this.each(function(el){
            _arr.push(QZFL.dom.createElementIn(tagName, el, false, attributes));
        });
        return QZFL.element.get(_arr);
    },
    appendTo: function(el){
        var el = (el.elements && el.elements[0]) || QZFL.dom.get(el);
        return this.each(function(element){
            el.appendChild(element)
        });
    },
    insertAfter: function(el){
        var el = (el.elements && el.elements[0]) || QZFL.dom.get(el), _ns = el.nextSibling, _p = el.parentNode;
        return this.each(function(element){
            _p[!_ns ? "appendChild" : "insertBefore"](element, _ns);
        });
    },
    insertBefore: function(el){
        var el = (el.elements && el.elements[0]) || QZFL.dom.get(el), _p = el.parentNode;
        return this.each(function(element){
            _p.insertBefore(element, el)
        });
    },
    remove: function(){
        return this.each(function(el){
            QZFL.dom.removeElement(el);
        })
    }
});
QZFL.Tween = function(el, property, func, startValue, finishValue, duration){
    this._func = func || QZFL.transitions.simple;
    this._obj = QZFL.dom.get(el);
    this.isColor = /^#/.test(startValue);
    this._prop = property;
    var reSuffix = /\d+([a-z%]+)/i.exec(startValue);
    this._suffix = reSuffix ? reSuffix[1] : "";
    this._startValue = this.isColor ? 0 : parseFloat(startValue);
    this._finishValue = this.isColor ? 100 : parseFloat(finishValue);
    if (this.isColor) {
        this._startColor = QZFL.css.convertHexColor(startValue);
        this._finishColor = QZFL.css.convertHexColor(finishValue);
    }
    this._duration = duration || 10;
    this._timeCount = 0;
    this._startTime = 0;
    this._changeValue = this._finishValue - this._startValue;
    this.currentValue = 0;
    this.isPlayed = false;
    this.isLoop = false;
    this.onMotionStart = QZFL.emptyFn;
    this.onMotionChange = QZFL.emptyFn;
    this.onMotionStop = QZFL.emptyFn;
};
QZFL.Tween.prototype.start = function(loop){
    this._reloadTimer();
    this.isPlayed = true;
    this._runTime();
    this.isLoop = loop ? true : false;
    this.onMotionStart.apply(this);
    return "d"
};
QZFL.Tween.prototype.pause = function(){
    this.isPlayed = false;
};
QZFL.Tween.prototype.stop = function(){
    this.isPlayed = false;
    this._playTime(this._duration + 0.1);
};
QZFL.Tween.prototype._reloadTimer = function(){
    this._startTime = new Date().getTime() - this._timeCount * 1000;
};
QZFL.Tween.prototype._playTime = function(time){
    var _isEnd = false;
    if (time > this._duration) {
        time = this._duration;
        _isEnd = true;
    }
    var pValue = this._func(time, this._startValue, this._changeValue, this._duration);
    this.currentValue = /(opacity)/i.test(this._prop) ? pValue : Math.round(pValue);
    if (this.isColor) {
        this.currentValue = QZFL.Tween.getColor(this._startColor, this._finishColor, pValue);
    }
    var _try2setCSS = QZFL.dom.setStyle(this._obj, this._prop, this.currentValue + this._suffix);
    if (!_try2setCSS) {
        this._obj[this._prop] = this.currentValue + this._suffix;
    }
    this.onMotionChange.apply(this, [this._obj, this._prop, this.currentValue]);
    if (_isEnd) {
        this.isPlayed = false;
        if (this.isLoop) {
            this.isPlayed = true;
            this._reloadTimer();
        }
        this.onMotionStop.apply(this);
        if (window.CollectGarbage) {
            CollectGarbage();
        }
    }
};
QZFL.Tween.prototype._runTime = function(){
    var o = this;
    if (o.isPlayed) {
        o._playTime((new Date().getTime() - this._startTime) / 1000);
        setTimeout(function(){
            o._runTime.apply(o, [])
        }, 0);
    }
};
QZFL.Tween.prototype.getPercent = function(){
    return (this.currentValue - this._startValue) / this._changeValue * 100;
};
QZFL.Tween.prototype.swapValue = function(){
    if (this.isColor) {
        var tempValue = this._startColor.join(",");
        this._startColor = this._finishColor;
        this._finishColor = tempValue.split(",");
    }
    else {
        var tempValue = this._startValue;
        this._startValue = this._finishValue;
        this._finishValue = tempValue;
        this._changeValue = this._finishValue - this._startValue;
    }
};
QZFL.Tween.getColor = function(startColor, finishColor, percent){
    var _sc = startColor, _fc = finishColor, _color = [];
    if (percent > 100) {
        percent = 100;
    }
    if (percent < 0) {
        percent = 0;
    }
    for (var i = 0; i < 3; i++) {
        _color[i] = Math.floor(_sc[i] * 1 + (percent / 100) * (_fc[i] - _sc[i])).toString(16);
        if (_color[i].length < 2) {
            _color[i] = "0" + _color[i];
        }
    }
    return "#" + _color.join("");
};
QZFL.transitions = {
    simple: function(time, startValue, changeValue, duration){
        return changeValue * time / duration + startValue;
    },
    regularEaseIn: function(t, b, c, d){
        return c * (t /= d) * t + b;
    },
    regularEaseOut: function(t, b, c, d){
        return -c * (t /= d) * (t - 2) + b;
    },
    regularEaseInOut: function(t, b, c, d){
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
};
QZFL.object.extend(QZFL.transitions, {
    backEaseIn: function(t, b, c, d){
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backEaseOut: function(t, b, c, d, a, p){
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backEaseInOut: function(t, b, c, d, a, p){
        var s = 1.70158;
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    bounceEaseOut: function(t, b, c, d){
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        }
        else 
            if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            }
            else 
                if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                }
                else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
                }
    },
    bounceEaseIn: function(t, b, c, d){
        return c - QZFL.transitions.bounceEaseOut(d - t, 0, c, d) + b;
    },
    bounceEaseInOut: function(t, b, c, d){
        if (t < d / 2) {
            return QZFL.transitions.bounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
        }
        else 
            return QZFL.transitions.bounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    },
    strongEaseIn: function(t, b, c, d){
        return c * (t /= d) * t * t * t * t + b;
    },
    strongEaseOut: function(t, b, c, d){
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    strongEaseInOut: function(t, b, c, d){
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    elasticEaseIn: function(t, b, c, d, a, p){
        if (t == 0) 
            return b;
        if ((t /= d) == 1) 
            return b + c;
        if (!p) 
            p = d * 0.3;
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticEaseOut: function(t, b, c, d, a, p){
        if (t == 0) 
            return b;
        if ((t /= d) == 1) 
            return b + c;
        if (!p) 
            p = d * 0.3;
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    elasticEaseInOut: function(t, b, c, d, a, p){
        if (t == 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            var p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            var a = c;
            var s = p / 4;
        }
        else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    }
});
;
(function(){
    var _easeAnimate = function(_t, a1, a2, ease){
        var _s = QZFL.dom["get" + _t](this), _reset = typeof a1 != "number" && typeof a2 != "number";
        if (_t == "Size" && _reset) {
            QZFL.dom["set" + _t](this, a1, a2);
            var _s1 = QZFL.dom["get" + _t](this);
            a1 = _s1[0];
            a2 = _s1[1];
        }
        var _v1 = _s[0] - a1;
        var _v2 = _s[1] - a2;
        var n = new QZFL.Tween(this, "_p", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, 0, 100, 0.5);
        n.onMotionChange = QZFL.event.bind(this, function(){
            var _p = arguments[2];
            QZFL.dom["set" + _t](this, typeof a1 != "number" ? _s[0] : (_s[0] - _p / 100 * _v1), typeof a2 != "number" ? _s[1] : (_s[1] - _p / 100 * _v2));
        });
        if (_t == "Size" && _reset) {
            n.onMotionStop = QZFL.event.bind(this, function(){
                QZFL.dom["set" + _t](this);
            });
        }
        n.start();
    };
    var _easeShowAnimate = function(_t, ease){
        var n = new QZFL.Tween(this, "opacity", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, (_t ? 0 : 1), (_t ? 1 : 0), 0.5);
        n[_t ? "onMotionStart" : "onMotionStop"] = QZFL.event.bind(this, function(){
            this.style.display = _t ? "" : "none";
            QZFL.dom.setStyle(this, "opacity", 1);
        });
        n.start();
    };
    var _easeScroll = function(top, left, ease){
        if (this.nodeType == 9) {
            var _stl = [QZFL.dom.getScrollTop(this), QZFL.dom.getScrollLeft(this)];
        }
        else {
            var _stl = [this.scrollTop, this.scrollLeft];
        }
        var _st = _stl[0] - top;
        var _sl = _stl[1] - left;
        var n = new QZFL.Tween(this, "_p", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, 0, 100, 0.5);
        n.onMotionChange = QZFL.event.bind(this, function(){
            var _p = arguments[2], _t = (_stl[0] - _p / 100 * _st), _l = (_stl[1] - _p / 100 * _sl);
            if (this.nodeType == 9) {
                QZFL.dom.setScrollTop(_t, this);
                QZFL.dom.setScrollLeft(_l, this);
            }
            else {
                this.scrollTop = _t;
                this.scrollLeft = _l;
            }
        });
        n.start();
    };
    QZFL.element.extendFn({
        tween: function(){
        },
        effectShow: function(effect, ease){
            this.each(function(el){
                _easeShowAnimate.apply(el, [true, ease])
            });
            if (effect == "resize") {
                this.each(function(el){
                    _easeAnimate.apply(el, ["Size", null, null, ease])
                });
            }
        },
        effectHide: function(effect, ease){
            this.each(function(el){
                _easeShowAnimate.apply(el, [false, ease])
            });
            if (effect == "resize") {
                this.each(function(el){
                    _easeAnimate.apply(el, ["Size", 0, 0, ease])
                });
            }
        },
        effectResize: function(width, height, ease){
            this.each(function(el){
                _easeAnimate.apply(el, ["Size", width, height, ease])
            });
        },
        effectMove: function(x, y, ease){
            this.each(function(el){
                _easeAnimate.apply(el, ["XY", x, y, ease])
            });
        },
        effectScroll: function(top, left, ease){
            this.each(function(el){
                _easeScroll.apply(el, [top, left, ease])
            });
        }
    })
})();
QZFL.XHR = function(actionURL, cname, method, data, isAsync, nocache){
    if (!cname) {
        cname = "_xhrInstence_" + (QZFL.XHR.counter + 1);
    }
    var prot;
    if (QZFL.XHR.instance[cname] instanceof QZFL.XHR) {
        prot = QZFL.XHR.instance[cname];
    }
    else {
        prot = (QZFL.XHR.instance[cname] = this);
        QZFL.XHR.counter++;
    }
    prot._name = cname;
    prot._nc = !!nocache;
    prot._method = (QZFL.object.getType(method) != "string" || method.toUpperCase() != "GET") ? "POST" : (method = "GET");
    prot._isAsync = (!(isAsync === false)) ? true : isAsync;
    prot._uri = actionURL;
    prot._data = (QZFL.object.getType(data) == "object" || QZFL.object.getType(data) == 'string') ? data : {};
    prot._sender = null;
    prot._isHeaderSetted = false;
    prot._xmlQueue = QZFL.queue("xhr" + cname, [function(){
        return new XMLHttpRequest();
    }, function(){
        return new ActiveXObject("Msxml2.XMLHTTP");
    }, function(){
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
]);
    this.onSuccess = QZFL.emptyFn;
    this.onError = QZFL.emptyFn;
    this.charset = "gb2312";
    this.proxyPath = "";
    return prot;
};
QZFL.XHR.instance = {};
QZFL.XHR.counter = 0;
QZFL.XHR._errCodeMap = {
    400: {
        msg: 'Bad Request'
    },
    401: {
        msg: 'Unauthorized'
    },
    403: {
        msg: 'Forbidden'
    },
    404: {
        msg: 'Not Found'
    },
    999: {
        msg: 'Proxy page error'
    },
    1000: {
        msg: 'Bad Response'
    },
    1001: {
        msg: 'No Network'
    },
    1002: {
        msg: 'No Data'
    },
    1003: {
        msg: 'Eval Error'
    }
};
QZFL.XHR.xsend = function(o, uri){
    if (!(o instanceof QZFL.XHR)) {
        return false;
    }
    if (QZFL.userAgent.firefox && QZFL.userAgent.firefox < 3) {
        return false;
    }
    function clear(obj){
        try {
            obj._sender = obj._sender.callback = obj._sender.errorCallback = obj._sender.onreadystatechange = null;
        } 
        catch (ignore) {
        }
        if (QZFL.userAgent.safari || QZFL.userAgent.opera) {
            setTimeout('QZFL.dom.removeElement($("_xsend_frm_' + obj._name + '"))', 50);
        }
        else {
            QZFL.dom.removeElement($("_xsend_frm_" + obj._name));
        }
    }
    if (o._sender === null || o._sender === void (0)) {
        var sender = document.createElement("iframe");
        sender.id = "_xsend_frm_" + o._name;
        sender.style.width = sender.style.height = sender.style.borderWidth = "0";
        document.body.appendChild(sender);
        sender.callback = QZFL.event.bind(o, function(data){
            o.onSuccess(data);
            clear(o);
        });
        sender.errorCallback = QZFL.event.bind(o, function(num){
            o.onError(QZFL.XHR._errCodeMap[num]);
            clear(o);
        });
        o._sender = sender;
    }
    var tmp = QZFL.config.gbEncoderPath;
    o.GBEncoderPath = tmp ? tmp : "";
    o._sender.src = uri.protocol + "://" + uri.host + (this.proxyPath ? this.proxyPath : "/xhr_proxy_gbk.html");
    return true;
};
QZFL.XHR.genHttpParamString = function(o, cs){
    cs = (cs || "gb2312").toLowerCase();
    var r = [];
    for (var i in o) {
        r.push(i + "=" + ((cs == "utf-8") ? encodeURIComponent(o[i]) : QZFL.string.URIencode(o[i])));
    }
    return r.join("&");
};
QZFL.XHR.prototype.send = function(){
    if (this._method == 'POST' && this._data == null) {
        return false;
    }
    var u = new QZFL.util.URI(this._uri);
    if (u == null) {
        return false;
    }
    this._uri = u.href;
    if (QZFL.object.getType(this._data) == "object") {
        this._data = QZFL.XHR.genHttpParamString(this._data, this.charset);
    }
    if (this._method == 'GET' && this._data) {
        this._uri += (this._uri.indexOf("?") < 0 ? "?" : "&") + this._data;
    }
    if (u.host != location.host) {
        return QZFL.XHR.xsend(this, u);
    }
    if (this._sender === null || this._sender === void (0)) {
        var sender = (function(){
            if (!this._xmlQueue.getLen()) {
                return null;
            }
            var _xhr = this._xmlQueue.shift();
            if (_xhr) {
                return _xhr;
            }
            else {
                return arguments.callee.call(this);
            }
        }).call(this);
        if (!sender) {
            return false;
        }
        this._sender = sender;
    }
    try {
        this._sender.open(this._method, this._uri, this._isAsync);
    } 
    catch (err) {
        return false;
    }
    if (this._method == 'POST' && !this._isHeaderSetted) {
        this._sender.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        this._isHeaderSetted = true;
    }
    if (this._nc) {
        this._sender.setRequestHeader('If-Modified-Since', 'Thu, 1 Jan 1970 00:00:00 GMT');
        this._sender.setRequestHeader('Cache-Control', 'no-cache');
    }
    this._sender.onreadystatechange = QZFL.event.bind(this, function(){
        try {
            if (this._sender.readyState == 4) {
                if (this._sender.status >= 200 && this._sender.status < 300) {
                    this.onSuccess({
                        text: this._sender.responseText,
                        xmlDom: this._sender.responseXML
                    });
                }
                else {
                    if (QZFL.userAgent.safari && (QZFL.object.getType(this._sender.status) == 'undefined')) {
                        this.onError(QZFL.XHR._errCodeMap[1002]);
                    }
                    else {
                        this.onError(QZFL.XHR._errCodeMap[this._sender.status]);
                    }
                }
                delete this._sender;
                this._sender = null;
            }
        } 
        catch (err) {
        }
    });
    this._sender.send((this._method == 'POST' ? this._data : void (0)));
    return true;
};
QZFL.XHR.prototype.destroy = function(){
    var n = this._name;
    delete QZFL.XHR.instance[n]._sender;
    QZFL.XHR.instance[n]._sender = null;
    delete QZFL.XHR.instance[n];
    QZFL.XHR.counter--;
    return null;
};
QZFL.cookie = {
    set: function(name, value, domain, path, hour){
        if (hour) {
            var expire = new Date();
            expire.setTime(expire.getTime() + 3600000 * hour);
        }
        document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + QZFL.config.domainPrefix + ";"));
        return true;
    },
    get: function(name){
        var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"), m = document.cookie.match(r);
        return (!m ? "" : m[1]);
    },
    del: function(name, domain, path){
        document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + QZFL.config.domainPrefix + ";"));
    }
};
QZFL.debug = {
    errorLogs: [],
    startDebug: function(){
        window.onerror = function(msg, url, line){
            var urls = (url || "").replace(/\\/g, "/").split("/");
            QZFL.console.print(msg + "<br/>" + urls[urls.length - 1] + " (line:" + line + ")", 1);
            QZFL.debug.errorLogs.push(msg);
            return false;
        }
    },
    stopDebug: function(){
        window.onerror = null;
    },
    clearErrorLog: function(){
        this.errorLogs = [];
    },
    showLog: function(){
        var o = ENV.get("debug_out");
        if (!!o) {
            o.innerHTML = QZFL.string.nl2br(QZFL.string.escHTML(this.errorLogs.join("\n")));
        }
    },
    getLogString: function(){
        return (this.errorLogs.join("\n"));
    }
};
QZFL.runTime = (function(){
    function isDebugMode(){
        return (QZFL.config.debugLevel > 1);
    }
    function log(msg, type){
        var info;
        if (isDebugMode()) {
            info = msg + '\n=STACK=\n' + stack();
        }
        else {
            if (type == 'error') {
                info = msg;
            }
            else 
                if (type == 'warn') {
                }
        }
        QZFL.debug.errorLogs.push(info);
    }
    function warn(sf, args){
        log(QZFL.string.write.apply(QZFL.string, arguments), 'warn');
    }
    function error(sf, args){
        log(QZFL.string.write.apply(QZFL.string, arguments), 'error');
    }
    function stack(e, a){
        function genTrace(ee, aa){
            if (ee.stack) {
                return ee.stack;
            }
            else 
                if (ee.message.indexOf("\nBacktrace:\n") >= 0) {
                    var cnt = 0;
                    return ee.message.split("\nBacktrace:\n")[1].replace(/\s*\n\s*/g, function(){
                        cnt++;
                        return (cnt % 2 == 0) ? "\n" : " @ ";
                    });
                }
                else {
                    var entry = (aa.callee == stack) ? aa.callee.caller : aa.callee;
                    var eas = entry.arguments;
                    var r = [];
                    for (var i = 0, len = eas.length; i < len; i++) {
                        r.push((typeof eas[i] == 'undefined') ? ("<u>") : ((eas[i] === null) ? ("<n>") : (eas[i])));
                    }
                    var fnp = /function\s+([^\s\(]+)\(/;
                    var fname = fnp.test(entry.toString()) ? (fnp.exec(entry.toString())[1]) : ("<ANON>");
                    return (fname + "(" + r.join() + ");").replace(/\n/g, "");
                }
        }
        var res;
        if ((e instanceof Error) && (typeof arguments == 'object') && (!!arguments.callee)) {
            res = genTrace(e, a);
        }
        else {
            try {
                ({}).sds();
            } 
            catch (err) {
                res = genTrace(err, arguments);
            }
        }
        return res.replace(/\n/g, " <= ");
    }
    return {
        stack: stack,
        warn: warn,
        error: error,
        isDebugMode: isDebugMode
    };
})();
QZFL.JsLoader = function(isDebug){
    this.debug = isDebug || (QZFL.config.debugLevel > 1);
    this.onload = QZFL.emptyFn;
    this.onerror = QZFL.emptyFn;
};
QZFL.JsLoader.prototype.load = function(src, doc, opt){
    var opts = {}, t = typeof(opt), o = this;
    if (t == "string") {
        opts.charset = opt;
    }
    else 
        if (t == "object") {
            opts = opt;
        }
    opts.charset = opts.charset || "gb2312";
    setTimeout(function(){
        o._load.apply(o, [src, doc || document, opts]);
        o = null;
    }, 0);
};
QZFL.JsLoader.prototype._load = function(src, doc, opts){
    var _ie = QZFL.userAgent.ie, _js = doc.createElement("script"), o = this, _rm = QZFL.dom.removeElement, _ae = QZFL.event.addEvent, tmp, k;
    _ae(_js, (_ie ? "readystatechange" : "load"), function(){
        if (!_js || _ie && !(_js.readyState == 'loaded')) {
            return;
        }
        o.onload();
        if (!o.debug) {
            _rm(_js);
        }
        _js = _rm = _ae = o = null;
    });
    if (!_ie) {
        _ae(_js, 'error', function(){
            o.onerror();
            if (!o.debug) {
                _rm(_js);
            }
            _js = _rm = _ae = o = null;
        })
    }
    for (k in opts) {
        if (typeof(tmp = opts[k]) == "string" && k.toLowerCase() != "src") {
            _js.setAttribute(k, tmp);
        }
    }
    doc.getElementsByTagName("head")[0].appendChild(_js);
    _js.src = src;
    opts = null;
};
QZFL["js" + "Loader"] = QZFL.JsLoader;
QZFL.imports = function(sources, succCallback, options){
    var errCallback, url, len, countId, counter, scb, ecb, i, isFn = QZFL.lang.isFunction;
    options = QZFL.lang.isString(options) ? {
        charset: options
    } : (options || {});
    options.charset = options.charset || 'utf-8';
    var errCallback = isFn(options.errCallback) ? options.errCallback : QZFL.emptyFn;
    succCallback = isFn(succCallback) ? succCallback : QZFL.emptyFn;
    if (typeof(sources) == "string") {
        url = QZFL.imports.getUrl(sources);
        QZFL.imports.load(url, succCallback, errCallback, options);
    }
    else 
        if (QZFL.lang.isArray(sources)) {
            countId = QZFL.imports.getCountId();
            len = QZFL.imports.counters[countId] = sources.length;
            counter = 0;
            scb = function(){
                counter++;
                if (counter == len) {
                    if (isFn(succCallback)) 
                        succCallback();
                }
                delete QZFL.imports.counters[countId];
            };
            ecb = function(){
                if (isFn(errCallback)) 
                    errCallback();
                QZFL.imports.counters[countId];
            };
            for (i = 0; i < len; i++) {
                url = QZFL.imports.getUrl(sources[i]);
                QZFL.imports.load(url, scb, ecb, options);
            }
        }
};
QZFL.imports.getUrl = function(url){
    return QZFL.string.isURL(url) ? url : (QZFL.imports._indirectUrlRE.test(url) ? url : (QZFL.config.staticServer + url + '.js'));
};
QZFL.imports.urlCache = {};
QZFL.imports.counters = {};
QZFL.imports.count = 0;
QZFL.imports._indirectUrlRE = /^(?:\.{1,2})?\//;
QZFL.imports.getCountId = function(){
    return 'imports' + QZFL.imports.count++;
};
QZFL.imports.load = function(url, scb, ecb, opt){
    if (QZFL.imports.urlCache[url] === true) {
        setTimeout(function(){
            if (QZFL.lang.isFunction(scb)) 
                scb()
        }, 0);
        return;
    }
    if (!QZFL.imports.urlCache[url]) {
        QZFL.imports.urlCache[url] = [];
        var loader = new QZFL.JsLoader();
        loader.onload = function(){
            QZFL.imports.execFnQueue(QZFL.imports.urlCache[url], 1);
            QZFL.imports.urlCache[url] = true;
        };
        loader.onerror = function(){
            QZFL.imports.execFnQueue(QZFL.imports.urlCache[url], 0);
            QZFL.imports.urlCache[url] = null;
            delete QZFL.imports.urlCache[url];
        };
        loader.load(url, null, opt);
    }
    QZFL.imports.urlCache[url].push([ecb, scb]);
};
QZFL.imports.execFnQueue = function(arFn, isSuccess){
    var f;
    while (arFn.length) {
        f = arFn.shift()[isSuccess];
        if (QZFL.lang.isFunction(f)) {
            setTimeout((function(fn){
                return fn
            })(f), 0);
        }
    }
};
QZFL.FormSender = function(actionURL, method, data, charset){
    this.name = "_fpInstence_" + QZFL.FormSender.counter;
    QZFL.FormSender.instance[this.name] = this;
    QZFL.FormSender.counter++;
    this.method = method || "POST";
    this.uri = actionURL;
    this.data = (typeof(data) == "object" || typeof(data) == 'string') ? data : null;
    this.proxyURL = (typeof(charset) == 'string' && charset.toUpperCase() == "UTF-8") ? QZFL.config.FSHelperPage.replace(/_gbk/, "_utf8") : QZFL.config.FSHelperPage;
    this._sender = null;
    this.onSuccess = QZFL.emptyFn;
    this.onError = QZFL.emptyFn;
};
QZFL.FormSender.instance = {};
QZFL.FormSender.counter = 0;
QZFL.FormSender._errCodeMap = {
    999: {
        msg: 'Connection or Server error'
    }
};
QZFL.FormSender.pluginsPool = {
    "formHandler": []
};
QZFL.FormSender._pluginsRunner = function(pType, data){
    var _s = QZFL.FormSender, l = _s.pluginsPool[pType], t = data, len;
    if (l && (len = l.length)) {
        for (var i = 0; i < len; ++i) {
            if (typeof(l[i]) == "function") {
                t = l[i](t);
            }
        }
    }
    return t;
};
QZFL.FormSender.prototype.send = function(){
    if (this.method == 'POST' && this.data == null) {
        return false;
    }
    function clear(o){
        o._sender = o._sender.callback = o._sender.errorCallback = o._sender.onreadystatechange = null;
        if (QZFL.userAgent.safari || QZFL.userAgent.opera) {
            setTimeout('QZFL.dom.removeElement(document.getElementById("_fp_frm_' + o.name + '"))', 50);
        }
        else {
            QZFL.dom.removeElement(document.getElementById("_fp_frm_" + o.name));
        }
    }
    if (this._sender === null || this._sender === void (0)) {
        var sender = document.createElement("iframe");
        sender.id = "_fp_frm_" + this.name;
        sender.style.cssText = "width:0;height:0;border-width:0;display:none;";
        document.body.appendChild(sender);
        sender.callback = QZFL.event.bind(this, function(o){
            clearTimeout(timer);
            this.onSuccess(o);
            clear(this);
        });
        sender.errorCallback = QZFL.event.bind(this, function(o){
            clearTimeout(timer);
            this.onError(o);
            clear(this);
        });
        if (typeof(sender.onreadystatechange) != 'undefined') {
            sender.onreadystatechange = QZFL.event.bind(this, function(){
                if (this._sender.readyState == 'complete' && this._sender.submited) {
                    clear(this);
                    this.onError(QZFL.FormSender._errCodeMap[999]);
                }
            });
        }
        else {
            var timer = setTimeout(QZFL.event.bind(this, function(){
                try {
                    var _t = this._sender.contentWindow.location.href;
                    if (_t.indexOf(this.uri) == 0) {
                        clearTimeout(timer);
                        clear(this);
                        this.onError(QZFL.FormSender._errCodeMap[999]);
                    }
                } 
                catch (err) {
                    clearTimeout(timer);
                    clear(this);
                    this.onError(QZFL.FormSender._errCodeMap[999]);
                }
            }), 200);
        }
        this._sender = sender;
    }
    this._sender.src = this.proxyURL;
    return true;
};
QZFL.FormSender.prototype.destroy = function(){
    var n = this.name;
    delete QZFL.FormSender.instance[n]._sender;
    QZFL.FormSender.instance[n]._sender = null;
    delete QZFL.FormSender.instance[n];
    QZFL.FormSender.counter--;
    return null;
};
QZFL.JSONGetter = function(actionURL, cname, data, charset, junctionMode){
    if (QZFL.object.getType(cname) != "string") {
        cname = "_jsonInstence_" + (QZFL.JSONGetter.counter + 1);
    }
    var prot = QZFL.JSONGetter.instance[cname];
    if (prot instanceof QZFL.JSONGetter) {
    }
    else {
        QZFL.JSONGetter.instance[cname] = prot = this;
        QZFL.JSONGetter.counter++;
        prot._name = cname;
        prot._sender = null;
        prot._timer = null;
        this.onSuccess = QZFL.emptyFn;
        this.onError = QZFL.emptyFn;
        this.onTimeout = QZFL.emptyFn;
        this.timeout = 5000;
        this.clear = QZFL.emptyFn;
        this._baseClear = function(){
            this._waiting = false;
            this._squeue = [];
            this._equeue = [];
            this.onSuccess = this.onError = QZFL.emptyFn;
            this.clear = null;
        };
    }
    prot._uri = actionURL;
    prot._data = (data && (QZFL.object.getType(data) == "object" || QZFL.object.getType(data) == "string")) ? data : null;
    prot._charset = (QZFL.object.getType(charset) != 'string') ? QZFL.config.defaultDataCharacterSet : charset;
    prot._jMode = !!junctionMode;
    return prot;
};
QZFL.JSONGetter.instance = {};
QZFL.JSONGetter.counter = 0;
QZFL.JSONGetter._errCodeMap = {
    999: {
        msg: 'Connection or Server error.'
    },
    998: {
        msg: 'Connection to Server timeout.'
    }
};
QZFL.JSONGetter.genHttpParamString = function(o){
    var r = [];
    for (var i in o) {
        r.push(i + "=" + encodeURIComponent(o[i]));
    }
    return r.join("&");
};
QZFL.JSONGetter.prototype.addOnSuccess = function(f){
    if (typeof(f) == "function") {
        if (this._squeue && this._squeue.push) {
        }
        else {
            this._squeue = [];
        }
        this._squeue.push(f);
    }
};
QZFL.JSONGetter._runFnQueue = function(q, resultArgs, th){
    var f;
    if (q && q.length) {
        while (q.length > 0) {
            f = q.shift();
            if (typeof(f) == "function") {
                f.apply(th ? th : null, resultArgs);
            }
        }
    }
};
QZFL.JSONGetter.prototype.addOnError = function(f){
    if (typeof(f) == "function") {
        if (this._equeue && this._equeue.push) {
        }
        else {
            this._equeue = [];
        }
        this._equeue.push(f);
    }
};
QZFL.JSONGetter.pluginsPool = {
    "srcStringHandler": []
};
QZFL.JSONGetter._pluginsRunner = function(pType, data){
    var _s = QZFL.JSONGetter, l = _s.pluginsPool[pType], t = data, len;
    if (l && (len = l.length)) {
        for (var i = 0; i < len; ++i) {
            if (typeof(l[i]) == "function") {
                t = l[i](t);
            }
        }
    }
    return t;
};
QZFL.JSONGetter.prototype.send = function(callbackFnName){
    if (this._waiting) {
        return;
    }
    var cfn = (QZFL.object.getType(callbackFnName) != 'string') ? "callback" : callbackFnName, clear, da = this._uri;
    if (this._data) {
        da += (da.indexOf("?") < 0 ? "?" : "&") + ((typeof(this._data) == "object") ? QZFL.JSONGetter.genHttpParamString(this._data) : this._data);
    }
    da = QZFL.JSONGetter._pluginsRunner("srcStringHandler", da);
    if (this._jMode) {
        window[cfn] = this.onSuccess;
        var _sd = new QZFL.JsLoader();
        _sd.onerror = this.onError;
        _sd.load(da, void (0), this._charset);
        return;
    }
    this._timer = setTimeout((function(th){
        return function(){
            th.onTimeout();
        };
    })(this), this.timeout);
    if (QZFL.userAgent.ie) {
        if (QZFL.userAgent.beta && navigator.appVersion.indexOf("Trident\/4.0") > -1) {
            var _hf = new ActiveXObject("htmlfile");
            this.clear = clear = function(o){
                clearTimeout(o._timer);
                if (o._sender) {
                    o._sender.close();
                    o._sender.parentWindow[cfn] = o._sender.parentWindow["errorCallback"] = null;
                    o._sender = null;
                }
                o._baseClear();
            };
            this._sender = _hf;
            var _cb = (function(th){
                return (function(){
                    setTimeout((function(_o, _a){
                        return (function(){
                            th._waiting = false;
                            _o.onSuccess.apply(_o, _a);
                            QZFL.JSONGetter._runFnQueue(th._squeue, _a, th);
                            clear(_o);
                        })
                    })(th, arguments), 0);
                });
            })(this);
            var _ecb = (function(th){
                return (function(){
                    th._waiting = false;
                    var _eo = QZFL.JSONGetter._errCodeMap[999];
                    th.onError(_eo);
                    QZFL.JSONGetter._runFnQueue(th._equeue, [_eo], th);
                    clear(th);
                });
            })(this);
            _hf.open();
            _hf.parentWindow[cfn] = function(){
                _cb.apply(null, arguments);
            };
            _hf.parentWindow["errorCallback"] = _ecb;
            this._waiting = true;
            _hf.write("<script src=\"" + da + "\" charset=\"" + this._charset + "\"><\/script><script defer>setTimeout(\"try{errorCallback();}catch(ign){}\",0)<\/script>");
        }
        else {
            var df = document.createDocumentFragment(), sender = (QZFL.userAgent.ie == 9 ? document : df).createElement("script");
            sender.charset = this._charset;
            this._senderDoc = df;
            this._sender = sender;
            this.clear = clear = function(o){
                clearTimeout(o._timer);
                if (o._sender) {
                    o._sender.onreadystatechange = null;
                }
                df = o._senderDoc = o._sender = null;
                o._baseClear();
            };
            df[cfn] = (function(th){
                return (function(){
                    th._waiting = false;
                    th.onSuccess.apply(th, arguments);
                    QZFL.JSONGetter._runFnQueue(th._squeue, arguments, th);
                    clear(th);
                });
            })(this);
            sender.onreadystatechange = (function(th){
                return (function(){
                    if (th._sender && th._sender.readyState == "loaded") {
                        try {
                            th._waiting = false;
                            var _eo = QZFL.JSONGetter._errCodeMap[999];
                            th.onError(_eo);
                            QZFL.JSONGetter._runFnQueue(th._equeue, [_eo], th);
                            clear(th);
                        } 
                        catch (ignore) {
                        }
                    }
                });
            })(this);
            this._waiting = true;
            df.appendChild(sender);
            this._sender.src = da;
        }
    }
    else {
        this.clear = clear = function(o){
            clearTimeout(o._timer);
            if (o._sender) {
                o._sender.src = "about:blank";
                o._sender = o._sender.callback = o._sender.errorCallback = null;
            }
            if (QZFL.userAgent.safari || QZFL.userAgent.opera) {
                setTimeout('QZFL.dom.removeElement($("_JSON_frm_' + o._name + '"))', 50);
            }
            else {
                QZFL.dom.removeElement($("_JSON_frm_" + o._name));
            }
            o._baseClear();
        };
        var _cb = (function(th){
            return (function(){
                th._waiting = false;
                th.onSuccess.apply(th, arguments);
                QZFL.JSONGetter._runFnQueue(th._squeue, arguments, th);
                clear(th);
            });
        })(this);
        var _ecb = (function(th){
            return (function(){
                th._waiting = false;
                var _eo = QZFL.JSONGetter._errCodeMap[999];
                th.onError(_eo);
                QZFL.JSONGetter._runFnQueue(th._equeue, [_eo], th);
                clear(th);
            });
        })(this);
        var frm = document.createElement("iframe");
        frm.id = "_JSON_frm_" + this._name;
        frm.style.width = frm.style.height = frm.style.borderWidth = "0";
        this._sender = frm;
        var _dm = (document.domain == location.host) ? '' : 'document.domain="' + document.domain + '";', dout = '<html><head><meta http-equiv="Content-type" content="text/html; charset=' + this._charset + '"/></head><body><script>' + _dm + ';function ' + cfn + '(){frameElement.callback.apply(null, arguments);}<\/script><script charset="' + this._charset + '" src="' + da + '"><\/script><script>setTimeout(frameElement.errorCallback,50);<\/script></body></html>';
        frm.callback = _cb;
        frm.errorCallback = _ecb;
        this._waiting = true;
        if (QZFL.userAgent.chrome || QZFL.userAgent.opera || QZFL.userAgent.firefox < 3) {
            frm.src = "javascript:'" + encodeURIComponent(QZFL.string.escString(dout)) + "'";
            document.body.appendChild(frm);
        }
        else {
            document.body.appendChild(frm);
            frm.contentWindow.document.open('text/html');
            frm.contentWindow.document.write(dout);
            frm.contentWindow.document.close();
        }
    }
};
QZFL.JSONGetter.prototype.destroy = function(){
    var n = this._name;
    delete QZFL.JSONGetter.instance[n]._sender;
    QZFL.JSONGetter.instance[n]._sender = null;
    delete QZFL.JSONGetter.instance[n];
    QZFL.JSONGetter.counter--;
    return null;
};
if (typeof(window.QZFL) == "undefined") {
    window.QZFL = {};
}
QZFL.pingSender = function(url, t){
    var _s = QZFL.pingSender, iid, img;
    if (!url) {
        return;
    }
    iid = "sndImg_" + _s._sndCount++;
    img = _s._sndPool[iid] = new Image();
    img.iid = iid;
    img.onload = img.onerror = (function(t){
        return function(evt){
            QZFL.pingSender._clearFn(evt, t);
        };
    })(img);
    setTimeout(function(){
        img.src = url;
    }, t || 500);
};
QZFL.pingSender._sndPool = {};
QZFL.pingSender._sndCount = 0;
QZFL.pingSender._clearFn = function(evt, ref){
    evt = window.event || evt;
    var _s = QZFL.pingSender;
    if (ref) {
        _s._sndPool[ref.iid] = ref.onload = ref.onerror = null;
        delete _s._sndPool[ref.iid];
        _s._sndCount--;
        ref = null;
    }
};
QZFL.media = {
    _tempImageList: [],
    _flashVersion: null,
    adjustImageSize: function(w, h, trueSrc, callback, errCallback){
        var ele = QZFL.event.getTarget();
        ele.onload = null;
        var offset, _c = QZFL.media._tempImageList;
        _c[offset = _c.length] = new Image();
        _c[offset].onload = (function(mainImg, tempImg, ew, eh){
            return function(){
                tempImg.onload = null;
                var ow = tempImg.width, oh = tempImg.height;
                if (ow / oh > ew / eh) {
                    if (ow > ew) {
                        mainImg.width = ew;
                    }
                }
                else {
                    if (oh > eh) {
                        mainImg.height = eh;
                    }
                }
                mainImg.src = tempImg.src;
                _c[offset] = null;
                delete _c[offset];
                if (typeof(callback) == 'function') {
                    callback(mainImg, w, h, tempImg, ow, oh);
                }
            };
        })(ele, _c[offset], w, h);
        _c[offset].onerror = function(){
            _c[offset] = _c[offset].onerror = null;
            delete _c[offset];
            if (typeof(errCallback) == 'function') {
                errCallback();
            }
        };
        _c[offset].src = trueSrc;
    },
    getFlashHtml: function(flashArguments, requiredVersion, flashPlayerCID){
        var _attrs = [], _params = [];
        for (var k in flashArguments) {
            switch (k) {
                case "noSrc":
                case "movie":
                    continue;
                    break;
                case "id":
                case "name":
                case "width":
                case "height":
                case "style":
                    if (typeof(flashArguments[k]) != 'undefined') {
                        _attrs.push(' ', k, '="', flashArguments[k], '"');
                    }
                    break;
                case "src":
                    if (QZFL.userAgent.ie) {
                        _params.push('<param name="movie" value="', (flashArguments.noSrc ? "" : flashArguments[k]), '"/>');
                    }
                    else {
                        _attrs.push(' data="', (flashArguments.noSrc ? "" : flashArguments[k]), '"');
                    }
                    break;
                default:
                    _params.push('<param name="', k, '" value="', flashArguments[k], '" />');
            }
        }
        if (QZFL.userAgent.ie) {
            _attrs.push(' classid="clsid:', flashPlayerCID || 'D27CDB6E-AE6D-11cf-96B8-444553540000', '"');
        }
        else {
            _attrs.push(' type="application/x-shockwave-flash"');
        }
        if (requiredVersion && (requiredVersion instanceof QZFL.media.SWFVersion)) {
            var _ver = QZFL.media.getFlashVersion().major, _needVer = requiredVersion.major;
            _attrs.push(' codeBase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=', requiredVersion, '"');
        }
        return "<object" + _attrs.join("") + ">" + _params.join("") + "</object>";
    },
    insertFlash: function(containerElement, flashArguments){
        if (!containerElement || typeof(containerElement.innerHTML) == "undefined") {
            return false;
        }
        flashArguments = flashArguments || {};
        flashArguments.src = flashArguments.src || "";
        flashArguments.width = flashArguments.width || "100%";
        flashArguments.height = flashArguments.height || "100%";
        flashArguments.noSrc = true;
        containerElement.innerHTML = QZFL.media.getFlashHtml(flashArguments);
        var f = containerElement.firstChild;
        if (QZFL.userAgent.ie) {
            setTimeout(function(){
                f.LoadMovie(0, flashArguments.src);
            }, 0);
        }
        else {
            f.setAttribute("data", flashArguments.src);
        }
        return true;
    },
    getWMMHtml: function(wmpArguments, cid){
        var params = [], objArgm = [];
        for (var k in wmpArguments) {
            switch (k) {
                case "id":
                case "width":
                case "height":
                case "style":
                case "src":
                    objArgm.push(' ', k, '="', wmpArguments[k], '"');
                    break;
                default:
                    objArgm.push(' ', k, '="', wmpArguments[k], '"');
                    params.push('<param name="', k, '" value="', wmpArguments[k], '" />');
            }
        }
        if (wmpArguments["src"]) {
            params.push('<param name="URL" value="', wmpArguments["src"], '" />');
        }
        if (QZFL.userAgent.ie) {
            return '<object classid="' + (cid || "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6") + '" ' + objArgm.join("") + '>' + params.join("") + '</object>';
        }
        else {
            return '<embed ' + objArgm.join("") + '></embed>';
        }
    }
};
QZFL.media.SWFVersion = function(){
    var a;
    if (arguments.length > 1) {
        a = arg2arr(arguments);
    }
    else 
        if (arguments.length == 1) {
            if (typeof(arguments[0]) == "object") {
                a = arguments[0];
            }
            else 
                if (typeof arguments[0] == 'number') {
                    a = [arguments[0]];
                }
                else {
                    a = [];
                }
        }
        else {
            a = [];
        }
    this.major = parseInt(a[0], 10) || 0;
    this.minor = parseInt(a[1], 10) || 0;
    this.rev = parseInt(a[2], 10) || 0;
    this.add = parseInt(a[3], 10) || 0;
};
QZFL.media.SWFVersion.prototype.toString = function(spliter){
    return ([this.major, this.minor, this.rev, this.add]).join((typeof spliter == 'undefined') ? "," : spliter);
};
QZFL.media.SWFVersion.prototype.toNumber = function(){
    var se = 0.001;
    return this.major + this.minor * se + this.rev * se * se + this.add * se * se * se;
};
QZFL.media.getFlashVersion = function(){
    if (!QZFL.media._flashVersion) {
        var resv = 0;
        if (navigator.plugins && navigator.mimeTypes.length) {
            var x = navigator.plugins['Shockwave Flash'];
            if (x && x.description) {
                resv = x.description.replace(/(?:[a-z]|[A-Z]|\s)+/, "").replace(/(?:\s+r|\s+b[0-9]+)/, ".").split(".");
            }
        }
        else {
            try {
                for (var i = (resv = 6), axo = new Object(); axo != null; ++i) {
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                    resv = i;
                }
            } 
            catch (e) {
                if (resv == 6) {
                    resv = 0;
                }
                resv = Math.max(resv - 1, 0);
            }
            try {
                resv = new QZFL.media.SWFVersion(axo.GetVariable("$version").split(" ")[1].split(","));
            } 
            catch (ignore) {
            }
        }
        if (!(resv instanceof QZFL.media.SWFVersion)) {
            resv = new QZFL.media.SWFVersion(resv);
        }
        if (resv.major < 3) {
            resv.major = 0;
        }
        QZFL.media._flashVersion = resv;
    }
    return QZFL.media._flashVersion;
};
QZFL.shareObject = {};
QZFL.shareObject.create = function(path){
    if (typeof(path) == 'undefined') {
        path = QZFL.config.defaultShareObject;
    }
    var t = new QZFL.shareObject.DataBase(path);
};
QZFL.shareObject.instance = {};
QZFL.shareObject.refCount = 0;
QZFL.shareObject.getValidSO = function(){
    var cnt = QZFL.shareObject.refCount + 1;
    for (var i = 1; i < cnt; ++i) {
        if (QZFL.shareObject.instance["so_" + i] && QZFL.shareObject.instance["so_" + i]._ready) {
            return QZFL.shareObject.instance["so_" + i];
        }
    }
    return null;
};
QZFL.shareObject.get = function(s){
    var o = QZFL.shareObject.getValidSO();
    if (o) 
        return o.get(s);
    else 
        return void (0);
};
QZFL.shareObject.set = function(k, v){
    var o = QZFL.shareObject.getValidSO();
    if (o) 
        return o.set(k, v);
    else 
        return false;
};
QZFL.shareObject.DataBase = function(soUrl){
    if (QZFL.shareObject.refCount > 0) {
        return QZFL.shareObject.instance["so_1"];
    }
    this._ready = false;
    QZFL.shareObject.refCount++;
    var c = document.createElement("div");
    document.body.appendChild(c);
    c.innerHTML = QZFL.media.getFlashHtml({
        src: soUrl,
        id: "__so" + QZFL.shareObject.refCount,
        width: 1,
        height: 0,
        allowscriptaccess: "always"
    });
    this.ele = $("__so" + QZFL.shareObject.refCount);
    QZFL.shareObject.instance["so_" + QZFL.shareObject.refCount] = this;
};
QZFL.shareObject.DataBase.prototype.set = function(key, value){
    if (this._ready) {
        this.ele.set("seed", Math.random());
        this.ele.set(key, value);
        this.ele.flush();
        return true;
    }
    else {
        return false;
    }
};
QZFL.shareObject.DataBase.prototype.del = function(key){
    if (this._ready) {
        this.ele.set("seed", Math.random());
        this.ele.set(key, void (0));
        this.ele.flush();
        return true;
    }
    else {
        return false;
    }
};
QZFL.shareObject.DataBase.prototype.get = function(key){
    return (this._ready) ? (this.ele.get(key)) : null;
};
QZFL.shareObject.DataBase.prototype.clear = function(){
    if (this._ready) {
        this.ele.clear();
        return true;
    }
    else {
        return false;
    }
};
QZFL.shareObject.DataBase.prototype.getDataSize = function(){
    if (this._ready) {
        return this.ele.getSize();
    }
    else {
        return -1;
    }
};
QZFL.shareObject.DataBase.prototype.load = function(url, succFnName, errFnName, data){
    if (this._ready) {
        this.ele.load(url, succFnName, errFnName, data);
        return true;
    }
    else {
        return false;
    }
};
QZFL.shareObject.DataBase.prototype.setReady = function(){
    this._ready = true;
};
function getShareObjectPrefix(){
    QZFL.shareObject.instance["so_" + QZFL.shareObject.refCount].setReady();
    return location.host.replace(".qzone.qq.com", "");
}

QZFL.shareObject.DataBase.prototype.setClipboard = function(value){
    if (this._ready && isString(value)) {
        this.ele.setClipboard(value);
        return true;
    }
    else {
        return false;
    }
};
QZFL.dragdrop = {
    dragdropPool: {},
    dragTempId: 0,
    _scrollRange: 0,
    dragGhostStyle: "cursor:move;position:absolute;border:1px solid #06c;background:#6cf;z-index:1000;color:#003;overflow:hidden",
    registerDragdropHandler: function(handler, target, options){
        var _e = QZFL.event;
        var _hDom = QZFL.dom.get(handler);
        var _tDom = QZFL.dom.get(target);
        options = options ||
        {
            range: [null, null, null, null],
            ghost: 0
        };
        if (!_hDom) {
            return null
        }
        var targetObject = _tDom || _hDom;
        if (!_hDom.id) {
            _hDom.id = "dragdrop_" + this.dragTempId;
            QZFL.dragdrop.dragTempId++;
        }
        _hDom.style.cursor = options.cursor || "move";
        this.dragdropPool[_hDom.id] = new this.eventController();
        _e.on(_hDom, "mousedown", _e.bind(this, this.startDrag), [_hDom.id, targetObject, options]);
        return this.dragdropPool[_hDom.id];
    },
    unRegisterDragdropHandler: function(handler){
        var _hDom = QZFL.dom.get(handler);
        var _e = QZFL.event;
        if (!_hDom) {
            return null
        }
        _hDom.style.cursor = "default";
        delete this.dragdropPool[_hDom.id];
        _e.removeEvent(_hDom, "mousedown");
    },
    startDrag: function(e, handlerId, target, options){
        var _d = QZFL.dom;
        var _e = QZFL.event;
        if (_e.getButton() != 0 || _e.getTarget().noDrag) {
            return;
        }
        if (options.ignoreTagName == _e.getTarget().tagName || _e.getTarget().noDragdrop) {
            return;
        }
        var size = _d.getSize(target);
        var stylePosition = _d.getStyle(target, "position");
        var isAbsolute = stylePosition == "absolute" || stylePosition == "fixed";
        var ghost = null, hasGhost = false;
        var xy = null;
        if (options.rangeElement) {
            var _re = options.rangeElement;
            var _el = QZFL.dom.get(_re[0]);
            var _elSize = QZFL.dom.getSize(_el);
            var _r = _re[1];
            if (!_re[2]) {
                options.range = [_r[0] ? 0 : null, _r[1] ? 0 : null, _r[2] ? _elSize[1] : null, _r[3] ? _elSize[0] : null];
            }
            else {
                var _elXY = QZFL.dom.getXY(_el);
                options.range = [_r[0] ? _elXY[1] : null, _r[1] ? _elXY[0] : null, _r[2] ? _elXY[1] + _elSize[1] : null, _r[3] ? _elXY[0] + _elSize[0] : null];
            }
        }
        if (!isAbsolute || options.ghost) {
            xy = isAbsolute ? [parseInt(target.style.left), parseInt(target.style.top)] : _d.getXY(target);
            ghost = _d.createElementIn("div", isAbsolute ? target.parentNode : document.body, false, {
                style: options.ghostStyle || this.dragGhostStyle
            });
            ghost.id = "dragGhost";
            _d.setStyle(ghost, "opacity", "0.8");
            setTimeout(function(){
                _d.setStyle(target, "opacity", "0.5");
            }, 0);
            if (options.ghostSize) {
                _d.setSize(ghost, options.ghostSize[0], options.ghostSize[1]);
                xy = [e.clientX + QZFL.dom.getScrollLeft() - 30, e.clientY + QZFL.dom.getScrollTop() - 20];
            }
            else {
                _d.setSize(ghost, size[0] - 2, size[1] - 2);
            }
            _d.setXY(ghost, xy[0], xy[1]);
            hasGhost = true;
        }
        else {
            xy = [parseInt(_d.getStyle(target, "left")), parseInt(_d.getStyle(target, "top"))];
        }
        var dragTarget = ghost || target;
        this.currentDragCache = {
            size: size,
            xy: xy,
            mXY: xy,
            dragTarget: dragTarget,
            target: target,
            x: e.clientX - parseInt(xy[0]),
            y: e.clientY - parseInt(xy[1]),
            ghost: ghost,
            hasGhost: hasGhost,
            isAbsolute: isAbsolute,
            options: options,
            scrollRangeTop: QZFL.dragdrop._scrollRange,
            scrollRangeBottom: QZFL.dom.getClientHeight() - QZFL.dragdrop._scrollRange,
            maxScrollRange: Math.max(QZFL.dom.getScrollHeight() - QZFL.dom.getClientHeight(), 0)
        };
        _e.on(document, "mousemove", _e.bind(this, this.doDrag), [handlerId, this.currentDragCache, options]);
        _e.on(document, "mouseup", _e.bind(this, this.endDrag), [handlerId, this.currentDragCache, options]);
        this.dragdropPool[handlerId].onStartDrag.apply(null, [e, handlerId, this.currentDragCache, options]);
        _e.preventDefault();
    },
    doDrag: function(e, handlerId, dragCache, options){
        var pos = {};
        if (options.autoScroll) {
            if (e.clientY < dragCache.scrollRangeTop) {
                if (!QZFL.dragdrop._scrollTop) {
                    QZFL.dragdrop._stopScroll();
                    QZFL.dragdrop._scrollTimer = setTimeout(function(){
                        QZFL.dragdrop._doScroll(true, dragCache)
                    }, 200);
                }
            }
            else 
                if (e.clientY > dragCache.scrollRangeBottom) {
                    if (!QZFL.dragdrop._scrollBottom) {
                        QZFL.dragdrop._stopScroll();
                        QZFL.dragdrop._scrollTimer = setTimeout(function(){
                            QZFL.dragdrop._doScroll(false, dragCache)
                        }, 200);
                    }
                }
                else {
                    QZFL.dragdrop._stopScroll();
                }
        }
        var mX = e.clientX - dragCache.x;
        var mY = e.clientY - dragCache.y;
        var xy = this._countXY(mX, mY, dragCache.size, options);
        mX = xy.x;
        mY = xy.y;
        QZFL.dom.setXY(dragCache.dragTarget, mX, mY);
        dragCache.mXY = [mX, mY];
        this.dragdropPool[handlerId].onDoDrag.apply(null, [e, handlerId, dragCache, options]);
        if (QZFL.userAgent.ie) {
            document.body.setCapture();
        }
        else 
            if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
        QZFL.event.preventDefault();
    },
    endDrag: function(e, handlerId, dragCache, options){
        var _d = QZFL.dom;
        if (dragCache.hasGhost) {
            QZFL.dom.removeElement(dragCache.dragTarget);
            var _t = dragCache.target;
            setTimeout(function(){
                QZFL.dom.setStyle(_t, "opacity", "1");
                _t = null;
            }, 0);
            if (dragCache.isAbsolute) {
                var x = parseInt(_d.getStyle(dragCache.target, "left")) + (dragCache.mXY[0] - dragCache.xy[0]);
                var y = parseInt(_d.getStyle(dragCache.target, "top")) + (dragCache.mXY[1] - dragCache.xy[1]);
                var xy = this._countXY(x, y, dragCache.size, options);
                QZFL.dom.setXY(dragCache.target, xy.x, xy.y);
            }
        }
        QZFL.event.removeEvent(document, "mousemove");
        QZFL.event.removeEvent(document, "mouseup");
        this.dragdropPool[handlerId].onEndDrag.apply(null, [e, handlerId, dragCache, options]);
        dragCache = null;
        QZFL.dragdrop._stopScroll();
        if (QZFL.userAgent.ie) {
            document.body.releaseCapture();
        }
        else 
            if (window.releaseEvents) {
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
    },
    _doScroll: function(isUp, dc){
        step = isUp ? -15 : 15;
        var _st = QZFL.dom.getScrollTop();
        if (isUp && _st + step < 0) {
            step = 0;
        }
        if (!isUp && _st + step > dc.maxScrollRange) {
            step = 0;
        }
        QZFL.dom.setScrollTop(_st + step);
        dc.y = dc.y - step;
        QZFL.dragdrop._scrollTop = isUp;
        QZFL.dragdrop._scrollBottom = !isUp;
        QZFL.dragdrop._scrollTimer = setTimeout(function(){
            QZFL.dragdrop._doScroll(isUp, dc)
        }, 16);
    },
    _stopScroll: function(){
        QZFL.dragdrop._scrollTop = QZFL.dragdrop._scrollBottom = false;
        clearTimeout(QZFL.dragdrop._scrollTimer);
    },
    _countXY: function(x, y, size, options){
        var pos = {
            x: x,
            y: y
        };
        if (options.x) {
            pos["x"] = parseInt(pos["x"] / options.x, 10) * options.x + (pos["x"] % options.x < options.x / 2 ? 0 : options.x);
        }
        if (options.y) {
            pos["y"] = parseInt(pos["y"] / options.y, 10) * options.y + (pos["y"] % options.y < options.y / 2 ? 0 : options.y);
        }
        if (options.range) {
            var _r = options.range;
            var i = 0, j = 0;
            while (i < _r.length && j < 2) {
                if (typeof _r[i] != "number") {
                    i++;
                    continue;
                };
                var k = i % 2 ? "x" : "y";
                var v = pos[k];
                pos[k] = i < 2 ? Math.max(pos[k], _r[i]) : Math.min(pos[k], _r[i] - size[(i + 1) % 2]);
                if (pos[k] != v) {
                    j++;
                };
                i++;
            }
        }
        return pos;
    }
};
QZFL.dragdrop.eventController = function(){
    this.onStartDrag = QZFL.emptyFn;
    this.onDoDrag = QZFL.emptyFn;
    this.onEndDrag = QZFL.emptyFn;
};
QZFL.element.extendFn({
    dragdrop: function(target, options){
        var _arr = [];
        this.each(function(){
            _arr.push(QZFL.dragdrop.registerDragdropHandler(this, target, options));
        });
        return _arr;
    },
    unDragdrop: function(target, options){
        this.each(function(){
            _arr.push(QZFL.dragdrop.unRegisterDragdropHandler(this));
        });
    }
});
QZFL.widget.msgbox = {
    cssPath: "http://qzonestyle.gtimg.cn/ac/qzfl/release/css/msgbox.css",
    path: "http://qzonestyle.gtimg.cn/ac/qzfl/release/widget/msgbox.js",
    _loadCss: function(){
        var th = QZFL.widget.msgbox;
        if (!th._cssLoad) {
            QZFL.css.insertCSSLink(th.cssPath);
            th._cssLoad = true;
        }
    },
    show: function(msgHtml, type, timeout, topPosition){
        QZFL.widget.msgbox._loadCss();
        QZFL.imports(QZFL.widget.msgbox.path, function(){
            QZFL.widget.msgbox.show(msgHtml, type, timeout, topPosition);
        });
    },
    hide: function(timeout){
        QZFL.widget.msgbox._loadCss();
        QZFL.imports(QZFL.widget.msgbox.path, function(){
            QZFL.widget.msgbox.hide(timeout);
        });
    }
};
QZFL.dialog = {
    items: [],
    lastFocus: null,
    tween: true,
    create: function(title, content, config){
        var width, height, tween, noborder, dialog, _i = QZFL.dialog.items;
        if ((typeof(config) == "object") && config) {
            width = config.width || 300;
            height = config.height || 400;
            tween = config.tween || false;
            noborder = config.noborder || false;
        }
        else {
            width = arguments[2] || 300;
            height = arguments[3] || 400;
            tween = arguments[4] || false;
            noborder = arguments[5] || false;
        }
        _i.push(new QZFL.DialogHandler(_i.length, noborder, tween));
        dialog = _i[_i.length - 1];
        dialog.init(width, height, config);
        dialog.fillTitle(title || "鏃犳爣棰�");
        dialog.fillContent(content || "");
        return dialog;
    },
    createBorderNone: function(content, width, height, config){
        config = config || {};
        config.noneBorder = true;
        var _i = this.items, dialog;
        _i.push(dialog = (new QZFL.DialogHandler(_i.length, true, config.tween)));
        dialog.init(width || 300, height || 200, config);
        dialog.fillContent(content || "");
        return dialog;
    }
};
QZFL.DialogHandler = function(id, isNoBorder, useTween){
    this._id = id;
    this.isNoBorder = !!isNoBorder;
    this._isIE6 = (QZFL.userAgent.ie && QZFL.userAgent.ie < 7);
    this.id = "dialog_" + id;
    this.mainId = "dialog_main_" + id;
    this.headId = "dialog_head_" + id;
    this.titleId = "dialog_title_" + id;
    this.closeId = "dialog_button_" + id;
    this.contentId = "dialog_content_" + id;
    this.frameId = "dialog_frame_" + id;
    this.useTween = (typeof(useTween) != "boolean") ? QZFL.dialog.tween : useTween;
    this.zIndex = 6000 + this._id;
    this.iconClass = "none";
    this.onBeforeUnload = function(){
        return true;
    };
    this.onUnload = QZFL.emptyFn;
    this.isFocus = false;
    var _t = ['<div id="', this.mainId, '" class="', (isNoBorder ? "" : "layer_global_main"), '">', '<div id=', this.headId, ' class="', (isNoBorder ? "none" : "layer_global_title"), '">', '<h3><img src="/ac/b.gif" alt="icon" class="', this.iconClass, '"/><span id=', this.titleId, ' ></span></h3>', '<button id="', this.closeId, '" title="鍏抽棴"><span class="none">&#9587;</span></button>', '</div>', '<div id="', this.contentId, '" class="', (isNoBorder ? "" : "layer_global_cont"), '"></div>', '</div>'];
    if (this._isIE6 && !isNoBorder) {
        _t.push('<iframe allowtransparency="yes" id="' + this.frameId + '" frameBorder="no" style="position:absolute;top:0;left:0;z-index:-1;" width="100%" height="100%"></iframe>');
    }
    this.temlate = _t.join("");
};
QZFL.DialogHandler.prototype.init = function(width, height, opts){
    if (typeof(opts) == "boolean" || typeof(opts) == "undefined") {
        opts = {
            noneBorder: opts
        };
    }
    if (typeof(opts.left) != "number") {
        opts.left = 0;
    }
    if (typeof(opts.top) != "number") {
        opts.top = 0;
    }
    this.dialog = document.createElement("div");
    this.dialog.id = this.id;
    var _l = opts.left || (QZFL.dom.getClientWidth() - width) / 2 + QZFL.dom.getScrollLeft(), _t = opts.top || Math.max((QZFL.dom.getClientHeight() - height) / 2 + QZFL.dom.getScrollTop(), 0);
    with (this.dialog) {
        if (!opts.noneBorder) {
            className = "layer_global";
        }
        style.position = "absolute";
        style.left = _l + "px";
        style.top = _t + "px";
        style.zIndex = this.zIndex;
        innerHTML = this.temlate;
    }
    document.body.appendChild(this.dialog);
    this.dialogClose = QZFL.dom.get(this.closeId);
    var o = this;
    QZFL.event.addEvent(this.dialog, "mousedown", QZFL.event.bind(o, o.focus));
    QZFL.event.addEvent(this.dialogClose, "click", function(){
        var t = QZFL.dialog.items[o._id];
        if (t) {
            t.unload();
        }
    });
    if (QZFL.dragdrop) {
        QZFL.dragdrop.registerDragdropHandler(QZFL.dom.get(this.headId), QZFL.dom.get(this.id), {
            range: [0, null, null, null],
            ghost: 0
        });
    }
    this.focus();
    this.setSize(width, height);
    if (this.useTween && QZFL.Tween) {
        QZFL.dom.setStyle(this.dialog, "opacity", 0);
        var tween1 = new QZFL.Tween(this.dialog, "top", QZFL.transitions.regularEaseIn, _t - 30 + "px", _t + "px", 0.3);
        tween1.onMotionChange = function(){
            QZFL.dom.setStyle(o.dialog, "opacity", this.getPercent() / 100);
        };
        tween1.onMotionStop = function(){
            QZFL.dom.setStyle(o.dialog, "opacity", 1);
            tween1 = null;
        };
        tween1.start();
    }
    else {
    }
};
QZFL.DialogHandler.prototype.focus = function(){
    if (this.isFocus) {
        return;
    }
    this.dialog.style.zIndex = this.zIndex + 3000;
    if (QZFL.dialog.lastFocus) {
        QZFL.dialog.lastFocus.blur();
    };
    this.isFocus = true;
    QZFL.dialog.lastFocus = this;
};
QZFL.DialogHandler.prototype.blur = function(){
    this.isFocus = false;
    this.dialog.style.zIndex = this.zIndex;
};
QZFL.DialogHandler.prototype.getZIndex = function(){
    return this.dialog.style.zIndex;
};
QZFL.DialogHandler.prototype.fillTitle = function(title){
    var _t = QZFL.dom.get(this.titleId);
    _t.innerHTML = title;
};
QZFL.DialogHandler.prototype.fillContent = function(html){
    var _c = QZFL.dom.get(this.contentId);
    _c.innerHTML = html;
};
QZFL.DialogHandler.prototype.setSize = function(width, height){
    var _m = QZFL.dom.get(this.id);
    _m.style.width = width + "px";
    var _c = QZFL.dom.get(this.contentId);
    if (!this.isNoBorder) {
        height = height - 28 < 0 ? 50 : height - 28;
    }
    _c.style[QZFL.userAgent.ie < 7 ? "height" : "minHeight"] = height + "px";
    if (this._isIE6) {
        var _s = QZFL.dom.getSize(QZFL.dom.get(this.id)), _f = QZFL.dom.get(this.frameId);
        if (_f) {
            QZFL.dom.setSize(_f, _s[0], _s[1]);
        }
    }
};
QZFL.DialogHandler.prototype.unload = function(){
    if (!this.onBeforeUnload()) {
        return;
    };
    var o = this;
    if (this.useTween && QZFL.Tween) {
        var tween1 = new QZFL.Tween(this.dialog, "opacity", QZFL.transitions.regularEaseIn, 1, 0, 0.2);
        tween1.onMotionStop = function(){
            o._unload();
            tween1 = null;
        };
        tween1.start();
    }
    else {
        this._unload();
    };
    };
QZFL.DialogHandler.prototype._unload = function(){
    this.onUnload();
    if (QZFL.dragdrop) {
        QZFL.dragdrop.unRegisterDragdropHandler(QZFL.dom.get(this.headId));
    }
    if (QZFL.userAgent.ie) {
        this.dialog.innerHTML = "";
    }
    QZFL.dom.removeElement(this.dialog);
    delete QZFL.dialog.items[this._id];
};
QZFL.widget.Confirm = function(title, content, config){
    this.buttonLayout = "confirm_button_" + QZFL.widget.Confirm.count;
    this.title = title || "杩欓噷鏄爣棰�";
    this.hasTitle = true;
    this.content = '<div class="mode_choose_new_index" style="height:48px;padding:18px">' + (content || "杩欓噷鏄唴瀹�") + '</div><div id="' + this.buttonLayout + '" class="global_tip_button tx_r" style="text-align:right !important"></div>';
    var isNewInterface = false;
    if ((config != null) && (typeof(config) == "object")) {
        var iconHash = {
            "warn": "icon_hint_warn",
            "error": "icon_hint_error",
            "succ": "icon_hint_succeed",
            "help": "icon_hint_help"
        };
        isNewInterface = true;
        this.hasTitle = (typeof(config.hastitle) == 'undefined') ? true : config.hastitle;
        if (!this.hasTitle) {
            this.content = '<div style="background-color:white;height:160px;width:350px;border:2px #6B97C1 solid"><div style="height:89px;padding:18px;"><img style="position:absolute; top:40px; left:40px;" class="' + iconHash[config.icontype] + '" alt="" src="http://imgcache.qq.com/ac/b.gif"/><h1 style="font-size: 14px; position: absolute; top: 40px; left: 76px; color:#424242;">' + (content || " ") + '</h1></div><div id="' + this.buttonLayout + '" class="global_tip_button tx_r" style="text-align:right !important"></div></div>';
        }
    }
    this.type = (isNewInterface ? config.type : config) || 1;
    var _tips = isNewInterface ? config.tips : arguments[3];
    this.tips = _tips ? [_tips[0] ? _tips[0] : "鏄�", _tips[1] ? _tips[1] : "鍚�", _tips[2] ? _tips[2] : "鍙栨秷"] : ["鏄�", "鍚�", "鍙栨秷"];
    this.showMask = (typeof(config.showMask) == "undefined") ? true : config.showMask;
    this.onConfirm = QZFL.emptyFn;
    this.onNo = QZFL.emptyFn;
    this.onCancel = QZFL.emptyFn;
    QZFL.widget.Confirm.count++;
};
QZFL.widget.Confirm.count = 0;
QZFL.widget.Confirm.TYPE = {
    OK: 1,
    NO: 2,
    OK_NO: 3,
    CANCEL: 4,
    OK_CANCEL: 5,
    NO_CANCEL: 6,
    OK_NO_CANCEL: 7
};
QZFL.widget.Confirm.prototype.show = function(){
    var _lastTween = QZFL.dialog.tween;
    QZFL.dialog.tween = false;
    if (!this.hasTitle) {
        this.dialog = QZFL.dialog.createBorderNone(this.content, "352", "160");
    }
    else {
        this.dialog = QZFL.dialog.create(this.title, this.content, "300", "140");
    }
    if (this.type & 1) {
        var _d = this._createButton(this.onConfirm, 0, "bt_tip_hit");
        _d.focus();
    }
    if (this.type & 2) {
        this._createButton(this.onNo, 1, "bt_tip_normal");
    }
    if (this.type & 4) {
        this._createButton(this.onCancel, 2, "bt_tip_normal");
    }
    this.dialog.onUnload = QZFL.event.bind(this, function(){
        this.hide();
        if (this.type == 1) {
            this.onConfirm();
        }
        else {
            this.onCancel();
        }
    });
    this._keyEvent = QZFL.event.bind(this, this.keyPress);
    QZFL.event.addEvent(document, "keydown", this._keyEvent);
    QZFL.dialog.tween = _lastTween;
    if (QZFL.maskLayout && this.showMask) {
        setTimeout((function(me, zi){
            return function(){
                if (me.dialog) {
                    me.maskId = QZFL.maskLayout.create(--zi);
                }
            };
        })(this, this.dialog.getZIndex()), 0);
    }
};
QZFL.widget.Confirm.prototype.keyPress = function(e){
    e = QZFL.event.getEvent(e);
    if (e.keyCode == 27) {
        this.hide();
    }
};
QZFL.widget.Confirm.prototype._createButton = function(e, tipsId, style){
    var el = QZFL.dom.get(this.buttonLayout), _d = QZFL.dom.createElementIn("button", el, false);
    _d.className = style;
    _d.innerHTML = this.tips[tipsId];
    QZFL.event.addEvent(_d, "click", QZFL.event.bind(this, function(){
        e();
        this.hide();
    }));
    return _d;
};
QZFL.widget.Confirm.prototype.hide = function(){
    this.dialog.onUnload = QZFL.emptyFn;
    this.dialog.unload();
    this.dialog = null;
    QZFL.event.removeEvent(document, "keydown", this._keyEvent);
    this._keyEvent = null;
    if (this.maskId) {
        QZFL.maskLayout.remove(this.maskId);
    }
};
(function(qdc){
    var dataPool = {};
    qdc.get = qdc.load = function(key){
        return dataPool[key];
    };
    qdc.del = function(key){
        dataPool[key] = null;
        delete dataPool[key];
        return true;
    };
    qdc.save = function saveData(key, value){
        dataPool[key] = value;
        return true;
    };
})(QZFL.dataCenter = {});
QZFL.maskLayout = {
    count: 0,
    items: {},
    create: function(zindex, _doc){
        this.count++;
        zindex = zindex || 5000;
        _doc = _doc || document;
        var _m = QZFL.dom.createElementIn("div", _doc.body, false, {
            className: "qz_mask_layout"
        }), _h, _ua = QZFL.userAgent;
        _h = (_ua.ie && _ua.ie < 7) ? Math.max(_doc.documentElement.scrollHeight, _doc.body.scrollHeight) : QZFL.dom.getClientHeight(_doc);
        _m.style.zIndex = zindex;
        _m.style.height = _h + "px";
        _m.unselectable = "on";
        this.items[this.count] = _m;
        return this.count;
    },
    remove: function(countId){
        QZFL.dom.removeElement(this.items[countId]);
        delete this.items[countId];
    }
};
QZFL.fixLayout = {
    _fixLayout: null,
    _isIE6: (QZFL.userAgent.ie && QZFL.userAgent.ie < 7),
    _layoutDiv: {},
    _layoutCount: 0,
    _init: function(){
        this._fixLayout = QZFL.dom.get("fixLayout") || QZFL.dom.createElementIn("div", document.body, false, {
            id: "fixLayout",
            style: "width:100%;"
        });
        this._isInit = true;
        if (this._isIE6) {
            QZFL.event.addEvent(document.compatMode == "CSS1Compat" ? window : document.body, "scroll", QZFL.event.bind(this, this._onscroll));
        }
    },
    create: function(html, isBottom, layerId, noFixed, options){
        if (!this._isInit) {
            this._init();
        }
        options = options || {};
        var tmp = {
            style: (isBottom ? "bottom:0;" : "top:0;") + (options.style || "left:0;width:100%;z-index:10000")
        }, _c;
        if (layerId) {
            tmp.id = layerId;
        }
        this._layoutCount++;
        _c = this._layoutDiv[this._layoutCount] = QZFL.dom.createElementIn("div", this._fixLayout, false, tmp);
        _c.style.position = this._isIE6 ? "absolute" : "fixed";
        _c.isTop = !isBottom;
        _c.innerHTML = html;
        _c.noFixed = noFixed ? 1 : 0;
        return this._layoutCount;
    },
    moveTop: function(layoutId){
        if (!this._layoutDiv[layoutId].isTop) {
            with (this._layoutDiv[layoutId]) {
                if (this._isIE6 && !this._layoutDiv[layoutId].noFixed) {
                    style.marginTop = QZFL.dom.getScrollTop() + "px";
                    style.marginBottom = "0";
                    style.marginBottom = "auto";
                }
                style.top = "0";
                style.bottom = "";
                isTop = true;
            }
        }
    },
    moveBottom: function(layoutId){
        if (this._layoutDiv[layoutId].isTop) {
            with (this._layoutDiv[layoutId]) {
                if (this._isIE6 && !this._layoutDiv[layoutId].noFixed) {
                    style.marginTop = "auto";
                    style.marginBottom = "0";
                    style.marginBottom = "auto";
                }
                style.top = "";
                style.bottom = "0";
                isTop = false;
            }
        }
    },
    fillHtml: function(layoutId, html){
        this._layoutDiv[layoutId].innerHTML = html;
    },
    _onscroll: function(){
        clearTimeout(this._timer);
        this._timer = setTimeout(this._doScroll, 500);
        if (this._doHide) {
            return
        }
        this._doHide = true;
        var o = this;
        var _c = new QZFL.Tween(this._fixLayout, "_null", QZFL.transitions.regularEaseOut, 0, 100, 0.2);
        _c.onMotionChange = function(){
            var o = QZFL.fixLayout;
            for (var k in o._layoutDiv) {
                if (o._layoutDiv[k].noFixed) {
                    continue;
                }
                QZFL.dom.setStyle(o._layoutDiv[k], "opacity", 1 - this.getPercent() / 100);
            }
        };
        _c.onMotionStop = function(){
            o = null;
        };
        _c.start();
    },
    _doScroll: function(){
        var o = QZFL.fixLayout;
        for (var k in o._layoutDiv) {
            if (o._layoutDiv[k].noFixed) {
                continue;
            }
            var _item = o._layoutDiv[k];
            if (_item.isTop) {
                o._layoutDiv[k].style.marginTop = QZFL.dom.getScrollTop() + "px";
            }
            else {
                o._layoutDiv[k].style.marginBottom = "0";
                o._layoutDiv[k].style.marginBottom = "auto";
            }
        }
        var _c = new QZFL.Tween(QZFL.fixLayout._fixLayout, "_null", QZFL.transitions.regularEaseOut, 0, 100, 0.3);
        _c.onMotionChange = function(){
            for (var k in o._layoutDiv) {
                if (o._layoutDiv[k].noFixed) {
                    continue;
                }
                QZFL.dom.setStyle(o._layoutDiv[k], "opacity", this.getPercent() / 100);
            }
        };
        _c.onMotionStop = function(){
            o = null;
        };
        _c.start();
        o._doHide = false;
    }
};
QZFL.widget.bubble = {
    path: "http://qzonestyle.gtimg.cn/ac/qzfl/release/widget/tips.js",
    show: function(target, title, msg, opts){
        opts = opts || {};
        var bid = opts.id || "oldBubble_" + (++QZFL.widget.bubble.count);
        opts.id = bid;
        QZFL.imports(QZFL.widget.bubble.path, function(){
            QZFL.widget.tips.show('<div>' + title + '</div>' + msg, target, opts);
        });
        return bid;
    },
    count: 0,
    hide: function(id){
        if (QZFL.widget.tips) {
            QZFL.widget.tips.close(id);
        }
    },
    hideAll: function(){
        if (QZFL.widget.tips) {
            QZFL.widget.tips.closeAll();
        }
    }
};
function hideBubble(bubbleId){
    QZFL.widget.bubble.hide(bubbleId);
}

function hideAllBubble(){
    QZFL.widget.bubble.hideAll();
}

QZFL.widget.bubble.showEx = QZFL.emptyFn;
QZFL.widget.bubble.setExKey = QZFL.emptyFn;
QZFL.widget.tips = {
    path: "http://qzonestyle.gtimg.cn/ac/qzfl/release/widget/tips.js",
    show: function(html, aim, opts){
        opts = opts || {};
        var bid = opts.id || "QZFL_bubbleTips_" + (++QZFL.widget.tips.count);
        opts.id = bid;
        QZFL.imports(QZFL.widget.tips.path, function(){
            QZFL.widget.tips.show(html, aim, opts);
        });
        return bid;
    },
    count: -1,
    close: function(id){
        QZFL.imports(QZFL.widget.tips.path, function(){
            if (QZFL.widget.tips) {
                QZFL.widget.tips.close(id);
            }
        });
    },
    closeAll: function(){
        QZFL.imports(QZFL.widget.tips.path, function(){
            if (QZFL.widget.tips) {
                QZFL.widget.tips.closeAll();
            }
        });
    }
};
QZFL.widget.seed = {
    _seed: 1,
    domain: "qq.com",
    prefix: "__Q_w_s_",
    update: function(k, opt){
        var n = 1, s, th = QZFL.widget.seed;
        if (typeof(k) == "undefined") {
            n = th._update();
        }
        else {
            k = th.prefix + k;
            if (opt && opt.useCookie) {
                n = QZFL.cookie.get(k);
                if (n) {
                    QZFL.cookie.set(k, ++n, opt.domain || th.domain, null, 3000)
                }
                else {
                    return 0;
                }
            }
            else {
                s = QZFL.shareObject.getValidSO();
                if (!s) {
                    n = th._update();
                }
                else 
                    if (n = s.get(k)) {
                        s.set(k, ++n);
                    }
                    else {
                        return 0;
                    }
            }
        }
        return n;
    },
    _update: function(){
        var th = QZFL.widget.seed;
        QZFL.cookie.set("randomSeed", (th._seed = parseInt(Math.random() * 1000000, 10)), th.domain, null, 3000);
        return th._seed;
    },
    get: function(k, opt){
        var s, n, th = QZFL.widget.seed;
        if (typeof(k) == "undefined") {
            return (th._seed = QZFL.cookie.get("randomSeed")) ? th._seed : th.update();
        }
        else {
            k = th.prefix + k;
            if (opt && opt.useCookie) {
                return (n = QZFL.cookie.get(k)) ? n : (QZFL.cookie.set(k, n = 1, opt.domain || th.domain, null, 3000), n);
            }
            else {
                if (!(s = QZFL.shareObject.getValidSO())) {
                    return th._seed;
                }
                return (n = s.get(k)) ? n : (s.set(k, n = 1), n);
            }
        }
    }
};
QZFL.widget.runBox = {
    _actions: [],
    _def_cong: {
        'duration': 0.6
    },
    start: function(startDom, finishDom, conf){
        this._actions.push(new this._runAction(startDom, finishDom, conf));
    },
    _runAction: function(_sDom, _fDom, _conf){
        this._sDom = QZFL.dom.get(_sDom);
        this._fDom = QZFL.dom.get(_fDom);
        this._conf = QZFL.lang.propertieCopy(_conf, QZFL.widget.runBox._def_cong, null, true);
        this._actionID = -1;
        this._sPosition = null;
        this._fPosition = null;
        this._runBox = null;
        if (_init.call(this)) {
            _run.call(this);
        }
        function _init(){
            if (!this._sDom || !this._fDom) {
                return false;
            }
            var o = this;
            o._sPosition = QZFL.dom.getPosition(this._sDom);
            o._fPosition = QZFL.dom.getPosition(this._fDom);
            o._actionID = QZFL.widget.runBox._actions.length - 1;
            o._runBox = QZFL.dom.createElementIn("div", document.body, false, {
                style: "border:3px solid #999;z-index:10000;position:absolute"
            });
            QZFL.dom.setXY(this._runBox, this._sPosition.left, this._sPosition.top);
            QZFL.dom.setSize(this._runBox, this._sPosition.width, this._sPosition.height);
            return true;
        }
        function _run(){
            var _t = new QZFL.Tween(this._runBox, "_p", QZFL.transitions.backEaseIn, 1, 100, this._conf.duration);
            var _me = this;
            _t.onMotionChange = function(o, p, c){
                var _p = c / 100;
                var l = _me._sPosition.left * (1 - _p) + _me._fPosition.left * _p;
                var t = _me._sPosition.top * (1 - _p) + _me._fPosition.top * _p;
                var w = _me._sPosition.width * (1 - _p) + _me._fPosition.width * _p;
                var h = _me._sPosition.height * (1 - _p) + _me._fPosition.height * _p;
                QZFL.dom.setXY(_me._runBox, l, t);
                QZFL.dom.setSize(_me._runBox, w, h);
            };
            _t.onMotionStop = function(){
                delMe.call(_me);
                _me = null;
                _t = null;
            };
            _t.start();
        }
        function delMe(){
            QZFL.dom.removeElement(this._runBox);
            QZFL.widget.runBox[this._actionID] = null;
        }
    }
};
QZFL.object.map(QZFL.string || {});
QZFL.object.map(QZFL.util || {});
QZFL.object.map(QZFL.lang || {});
var ua = window.ua || QZFL.userAgent, $e = QZFL.element.get, $ = QZFL.dom.get, removeNode = QZFL.dom.removeElement, ENV = QZFL.enviroment, addEvent = QZFL.event.addEvent, removeEvent = QZFL.event.removeEvent, getEvent = QZFL.event.getEvent, insertFlash = QZFL.media.getFlashHtml;
if (!QZFL.pluginsDefine) {
    QZFL.pluginsDefine = {};
}
QZFL.pluginsDefine.getACSRFToken = function(){
    return arguments.callee._DJB(QZFL.cookie.get("skey"));
};
QZFL.pluginsDefine.getACSRFToken._DJB = function(str){
    var hash = 5381;
    for (var i = 0, len = str.length; i < len; ++i) {
        hash += (hash << 5) + str.charAt(i).charCodeAt();
    }
    return hash & 0x7fffffff;
};
(function(){
    var t = QZONE.FormSender;
    if (t && t.pluginsPool) {
        t.pluginsPool.formHandler.push(function(fm){
            if (fm) {
                if (!fm.g_tk) {
                    var a = QZFL.string.trim(fm.action);
                    a += (a.indexOf("?") > -1 ? "&" : "?") + "g_tk=" + QZFL.pluginsDefine.getACSRFToken();
                    fm.action = a;
                }
            }
        });
    }
})();
(function(){
    var t = QZONE.JSONGetter;
    if (t && t.pluginsPool) {
        t.pluginsPool.srcStringHandler.push(function(ss){
            if (typeof(ss) == "string") {
                if (ss.indexOf("g_tk=") < 0) {
                    ss += (ss.indexOf("?") > -1 ? "&" : "?") + "g_tk=" + QZFL.pluginsDefine.getACSRFToken();
                }
            }
            return ss;
        });
    }
})();/* |xGv00|d1a296f019a84b93b1d3ca37f988ac5c */
