/**
 * KineticJS JavaScript Library v3.8.2
 * http://www.kineticjs.com/
 * Copyright 2012, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Mar 03 2012
 *
 * Copyright (C) 2011 - 2012 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

 var Kinetic = {};
Kinetic.GlobalObject = {
    stages: [],
    idCounter: 0,
    isAnimating: false,
    frame: {
        time: 0,
        timeDiff: 0,
        lastTime: 0
    },
    drag: {
        moving: false,
        node: undefined,
        offset: {
            x: 0,
            y: 0
        }
    },
    extend: function (c, b) {
        for (var a in b.prototype) {
            if (b.prototype.hasOwnProperty(a)) {
                c.prototype[a] = b.prototype[a]
            }
        }
    },
    _isaCanvasAnimating: function () {
        for (var a = 0; a < this.stages.length; a++) {
            if (this.stages[a].isAnimating) {
                return true
            }
        }
        return false
    },
    _runFrames: function () {
        for (var a = 0; a < this.stages.length; a++) {
            if (this.stages[a].isAnimating) {
                this.stages[a].onFrameFunc(this.frame)
            }
        }
    },
    _updateFrameObject: function () {
        var a = new Date();
        var b = a.getTime();
        if (this.frame.lastTime === 0) {
            this.frame.lastTime = b
        } else {
            this.frame.timeDiff = b - this.frame.lastTime;
            this.frame.lastTime = b;
            this.frame.time += this.frame.timeDiff
        }
    },
    _animationLoop: function () {
        if (this.isAnimating) {
            this._updateFrameObject();
            this._runFrames();
            var a = this;
            requestAnimFrame(function () {
                a._animationLoop()
            })
        }
    },
    _handleAnimation: function () {
        var a = this;
        if (!this.isAnimating && this._isaCanvasAnimating()) {
            this.isAnimating = true;
            a._animationLoop()
        } else {
            if (this.isAnimating && !this._isaCanvasAnimating()) {
                this.isAnimating = false
            }
        }
    }
};
window.requestAnimFrame = (function (a) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function (b) {
        window.setTimeout(b, 1000 / 60)
    }
})();
Kinetic.Node = function (a) {
    this.visible = true;
    this.isListening = true;
    this.name = undefined;
    this.alpha = 1;
    this.x = 0;
    this.y = 0;
    this.scale = {
        x: 1,
        y: 1
    };
    this.rotation = 0;
    this.centerOffset = {
        x: 0,
        y: 0
    };
    this.eventListeners = {};
    this.drag = {
        x: false,
        y: false
    };
    if (a) {
        for (var b in a) {
            switch (b) {
            case "draggable":
                this.draggable(a[b]);
                break;
            case "draggableX":
                this.draggableX(a[b]);
                break;
            case "draggableY":
                this.draggableY(a[b]);
                break;
            case "listen":
                this.listen(a[b]);
                break;
            case "rotationDeg":
                this.rotation = a[b] * Math.PI / 180;
                break;
            default:
                this[b] = a[b];
                break
            }
        }
    }
    if (this.centerOffset.x === undefined) {
        this.centerOffset.x = 0
    }
    if (this.centerOffset.y === undefined) {
        this.centerOffset.y = 0
    }
};
Kinetic.Node.prototype = {
    on: function (c, i) {
        var g = c.split(" ");
        for (var d = 0; d < g.length; d++) {
            var h = g[d];
            var b = (h.indexOf("touch") === -1) ? "on" + h : h;
            var f = b.split(".");
            var e = f[0];
            var a = f.length > 1 ? f[1] : "";
            if (!this.eventListeners[e]) {
                this.eventListeners[e] = []
            }
            this.eventListeners[e].push({
                name: a,
                handler: i
            })
        }
    },
    off: function (b) {
        var h = b.split(" ");
        for (var d = 0; d < h.length; d++) {
            var j = h[d];
            var a = (j.indexOf("touch") === -1) ? "on" + j : j;
            var f = a.split(".");
            var e = f[0];
            if (this.eventListeners[e] && f.length > 1) {
                var c = f[1];
                for (var g = 0; g < this.eventListeners[e].length; g++) {
                    if (this.eventListeners[e][g].name === c) {
                        this.eventListeners[e].splice(g, 1);
                        if (this.eventListeners[e].length === 0) {
                            this.eventListeners[e] = undefined
                        }
                        break
                    }
                }
            } else {
                this.eventListeners[e] = undefined
            }
        }
    },
    show: function () {
        this.visible = true
    },
    hide: function () {
        this.visible = false
    },
    getZIndex: function () {
        return this.index
    },
    setScale: function (b, a) {
        if (a) {
            this.scale.x = b;
            this.scale.y = a
        } else {
            this.scale.x = b;
            this.scale.y = b
        }
    },
    getScale: function () {
        return this.scale
    },
    setPosition: function (a, b) {
        this.x = a;
        this.y = b
    },
    getPosition: function () {
        return {
            x: this.x,
            y: this.y
        }
    },
    getAbsolutePosition: function () {
        var a = this.x;
        var c = this.y;
        var b = this.getParent();
        while (b.className !== "Stage") {
            a += b.x;
            c += b.y;
            b = b.parent
        }
        return {
            x: a,
            y: c
        }
    },
    move: function (a, b) {
        this.x += a;
        this.y += b
    },
    setRotation: function (a) {
        this.rotation = a
    },
    setRotationDeg: function (a) {
        this.rotation = (a * Math.PI / 180)
    },
    getRotation: function () {
        return this.rotation
    },
    getRotationDeg: function () {
        return this.rotation * 180 / Math.PI
    },
    rotate: function (a) {
        this.rotation += a
    },
    rotateDeg: function (a) {
        this.rotation += (a * Math.PI / 180)
    },
    listen: function (a) {
        this.isListening = a
    },
    moveToTop: function () {
        var a = this.index;
        this.parent.children.splice(a, 1);
        this.parent.children.push(this);
        this.parent._setChildrenIndices()
    },
    moveUp: function () {
        var a = this.index;
        this.parent.children.splice(a, 1);
        this.parent.children.splice(a + 1, 0, this);
        this.parent._setChildrenIndices()
    },
    moveDown: function () {
        var a = this.index;
        if (a > 0) {
            this.parent.children.splice(a, 1);
            this.parent.children.splice(a - 1, 0, this);
            this.parent._setChildrenIndices()
        }
    },
    moveToBottom: function () {
        var a = this.index;
        this.parent.children.splice(a, 1);
        this.parent.children.unshift(this);
        this.parent._setChildrenIndices()
    },
    setZIndex: function (b) {
        var a = this.index;
        this.parent.children.splice(a, 1);
        this.parent.children.splice(b, 0, this);
        this.parent._setChildrenIndices()
    },
    setAlpha: function (a) {
        this.alpha = a
    },
    getAlpha: function () {
        return this.alpha
    },
    getAbsoluteAlpha: function () {
        var b = 1;
        var a = this;
        while (a.className !== "Stage") {
            b *= a.alpha;
            a = a.parent
        }
        return b
    },
    _initDrag: function () {
        var b = Kinetic.GlobalObject;
        var a = this;
        this.on("mousedown.initdrag touchstart.initdrag", function (c) {
            var d = a.getStage();
            var e = d.getUserPosition();
            if (e) {
                b.drag.node = a;
                b.drag.offset.x = e.x - a.x;
                b.drag.offset.y = e.y - a.y
            }
        })
    },
    _dragCleanup: function () {
        if (!this.drag.x && !this.drag.y) {
            this.off("mousedown.initdrag");
            this.off("touchstart.initdrag")
        }
    },
    draggable: function (b) {
        if (b) {
            var a = !this.drag.x && !this.drag.y;
            this.drag.x = true;
            this.drag.y = true;
            if (a) {
                this._initDrag()
            }
        } else {
            this.drag.x = false;
            this.drag.y = false;
            this._dragCleanup()
        }
    },
    draggableX: function (b) {
        if (b) {
            var a = !this.drag.x && !this.drag.y;
            this.drag.x = true;
            if (a) {
                this._initDrag()
            }
        } else {
            this.drag.x = false;
            this._dragCleanup()
        }
    },
    draggableY: function (b) {
        if (b) {
            var a = !this.drag.x && !this.drag.y;
            this.drag.y = true;
            if (a) {
                this._initDrag()
            }
        } else {
            this.drag.y = false;
            this._dragCleanup()
        }
    },
    isDragging: function () {
        var a = Kinetic.GlobalObject;
        return a.drag.node !== undefined && a.drag.node.id === this.id && a.drag.moving
    },
    _handleEvents: function (b, a) {
        function c(g) {
            var f = g.eventListeners;
            if (f[b]) {
                var e = f[b];
                for (var d = 0; d < e.length; d++) {
                    e[d].handler.apply(g, [a])
                }
            }
            if (g.parent.className !== "Stage") {
                c(g.parent)
            }
        }
        c(this)
    },
    moveTo: function (b) {
        var a = this.parent;
        a.children.splice(this.index, 1);
        a._setChildrenIndices();
        b.children.push(this);
        this.index = b.children.length - 1;
        this.parent = b;
        b._setChildrenIndices();
        if (this.name) {
            a.childrenNames[this.name] = undefined;
            b.childrenNames[this.name] = this
        }
    },
    getParent: function () {
        return this.parent
    },
    getLayer: function () {
        if (this.className === "Layer") {
            return this
        } else {
            return this.getParent().getLayer()
        }
    },
    getStage: function () {
        return this.getParent().getStage()
    },
    getName: function () {
        return this.name
    },
    setCenterOffset: function (a, b) {
        this.centerOffset.x = a;
        this.centerOffset.y = b
    },
    getCenterOffset: function () {
        return this.centerOffset
    }
};
Kinetic.Container = function () {
    this.children = [];
    this.childrenNames = {}
};
Kinetic.Container.prototype = {
    _setChildrenIndices: function () {
        if (this.className === "Stage") {
            var c = this.container.childNodes;
            var a = c[0];
            var b = c[1];
            this.container.innerHTML = "";
            this.container.appendChild(a);
            this.container.appendChild(b)
        }
        for (var d = 0; d < this.children.length; d++) {
            this.children[d].index = d;
            if (this.className === "Stage") {
                this.container.appendChild(this.children[d].canvas)
            }
        }
    },
    _drawChildren: function () {
        var a = this.children;
        for (var c = 0; c < a.length; c++) {
            var b = a[c];
            if (b.className === "Shape") {
                b._draw(b.getLayer())
            } else {
                b._draw()
            }
        }
    },
    getChildren: function () {
        return this.children
    },
    getChild: function (a) {
        return this.childrenNames[a]
    },
    _add: function (a) {
        if (a.name) {
            this.childrenNames[a.name] = a
        }
        a.id = Kinetic.GlobalObject.idCounter++;
        a.index = this.children.length;
        a.parent = this;
        this.children.push(a)
    },
    _remove: function (a) {
        if (a.name !== undefined) {
            this.childrenNames[a.name] = undefined
        }
        this.children.splice(a.index, 1);
        this._setChildrenIndices();
        a = undefined
    },
    removeChildren: function () {
        while (this.children.length > 0) {
            this.remove(this.children[0])
        }
    }
};
Kinetic.Stage = function (b, c, a) {
    this.className = "Stage";
    this.container = typeof b === "string" ? document.getElementById(b) : b;
    this.width = c;
    this.height = a;
    this.scale = {
        x: 1,
        y: 1
    };
    this.dblClickWindow = 400;
    this.targetShape = undefined;
    this.clickStart = false;
    this.mousePos = undefined;
    this.mouseDown = false;
    this.mouseUp = false;
    this.touchPos = undefined;
    this.touchStart = false;
    this.touchEnd = false;
    this.bufferLayer = new Kinetic.Layer();
    this.backstageLayer = new Kinetic.Layer();
    this.bufferLayer.parent = this;
    this.backstageLayer.parent = this;
    var e = this.backstageLayer;
    this._stripLayer(e);
    this.bufferLayer.getCanvas().style.display = "none";
    this.backstageLayer.getCanvas().style.display = "none";
    this.bufferLayer.canvas.width = this.width;
    this.bufferLayer.canvas.height = this.height;
    this.container.appendChild(this.bufferLayer.canvas);
    this.backstageLayer.canvas.width = this.width;
    this.backstageLayer.canvas.height = this.height;
    this.container.appendChild(this.backstageLayer.canvas);
    this._listen();
    this._prepareDrag();
    var d = Kinetic.GlobalObject.stages;
    d.push(this);
    this.id = Kinetic.GlobalObject.idCounter++;
    this.isAnimating = false;
    this.onFrameFunc = undefined;
    Kinetic.Container.apply(this, [])
};
Kinetic.Stage.prototype = {
    onFrame: function (a) {
        this.onFrameFunc = a
    },
    start: function () {
        this.isAnimating = true;
        Kinetic.GlobalObject._handleAnimation()
    },
    stop: function () {
        this.isAnimating = false;
        Kinetic.GlobalObject._handleAnimation()
    },
    draw: function () {
        this._drawChildren()
    },
    _stripLayer: function (a) {
        a.context.stroke = function () {};
        a.context.fill = function () {};
        a.context.fillRect = function (c, e, d, b) {
            a.context.rect(c, e, d, b)
        };
        a.context.strokeRect = function (c, e, d, b) {
            a.context.rect(c, e, d, b)
        };
        a.context.drawImage = function () {};
        a.context.fillText = function () {};
        a.context.strokeText = function () {}
    },
    _endDrag: function (a) {
        var b = Kinetic.GlobalObject;
        if (b.drag.node) {
            if (b.drag.moving) {
                b.drag.moving = false;
                b.drag.node._handleEvents("ondragend", a)
            }
        }
        b.drag.node = undefined
    },
    _prepareDrag: function () {
        var a = this;
        this.on("mousemove touchmove", function (b) {
            var c = Kinetic.GlobalObject;
            if (c.drag.node) {
                var d = a.getUserPosition();
                if (c.drag.node.drag.x) {
                    c.drag.node.x = d.x - c.drag.offset.x
                }
                if (c.drag.node.drag.y) {
                    c.drag.node.y = d.y - c.drag.offset.y
                }
                c.drag.node.getLayer().draw();
                if (!c.drag.moving) {
                    c.drag.moving = true;
                    c.drag.node._handleEvents("ondragstart", b)
                }
                c.drag.node._handleEvents("ondragmove", b)
            }
        }, false);
        this.on("mouseup touchend mouseout", function (b) {
            a._endDrag(b)
        })
    },
    setSize: function (c, a) {
        var d = this.children;
        for (var e = 0; e < d.length; e++) {
            var b = d[e];
            b.getCanvas().width = c;
            b.getCanvas().height = a;
            b.draw()
        }
        this.width = c;
        this.height = a;
        this.bufferLayer.getCanvas().width = c;
        this.bufferLayer.getCanvas().height = a;
        this.backstageLayer.getCanvas().width = c;
        this.backstageLayer.getCanvas().height = a
    },
    setScale: function (d, c) {
        var b = this.scale.x;
        var a = this.scale.y;
        if (c) {
            this.scale.x = d;
            this.scale.y = c
        } else {
            this.scale.x = d;
            this.scale.y = d
        }
        var f = this.children;
        var e = this;

        function g(j) {
            for (var h = 0; h < j.length; h++) {
                var k = j[h];
                k.x *= e.scale.x / b;
                k.y *= e.scale.y / a;
                if (k.children) {
                    g(k.children)
                }
            }
        }
        g(f)
    },
    getScale: function () {
        return this.scale
    },
    clear: function () {
        var a = this.children;
        for (var b = 0; b < a.length; b++) {
            a[b].clear()
        }
    },
    toDataURL: function (e) {
        var b = this.bufferLayer;
        var a = b.getContext();
        var d = this.children;

        function c(h) {
            var g = d[h].getCanvas().toDataURL();
            var f = new Image();
            f.onload = function () {
                a.drawImage(this, 0, 0);
                h++;
                if (h < d.length) {
                    c(h)
                } else {
                    e(b.getCanvas().toDataURL())
                }
            };
            f.src = g
        }
        b.clear();
        c(0)
    },
    remove: function (a) {
        this.container.removeChild(a.canvas);
        this._remove(a)
    },
    on: function (b, d) {
        var c = b.split(" ");
        for (var e = 0; e < c.length; e++) {
            var a = c[e];
            this.container.addEventListener(a, d, false)
        }
    },
    add: function (a) {
        if (a.name) {
            this.childrenNames[a.name] = a
        }
        a.canvas.width = this.width;
        a.canvas.height = this.height;
        this._add(a);
        a.draw();
        this.container.appendChild(a.canvas)
    },
    _handleEvent: function (j) {
        if (!j) {
            j = window.event
        }
        this._setMousePosition(j);
        this._setTouchPosition(j);
        var d = this.backstageLayer;
        var g = d.getContext();
        var h = this;
        d.clear();
        var i = false;

        function e(k) {
            k._draw(d);
            var p = h.getUserPosition();
            var o = k.eventListeners;
            if (h.targetShape && k.id === h.targetShape.id) {
                i = true
            }
            if (k.visible && p !== undefined && g.isPointInPath(p.x, p.y)) {
                if (h.mouseDown) {
                    h.mouseDown = false;
                    h.clickStart = true;
                    k._handleEvents("onmousedown", j);
                    return true
                } else {
                    if (h.mouseUp) {
                        h.mouseUp = false;
                        k._handleEvents("onmouseup", j);
                        if (h.clickStart) {
                            if ((!b.drag.moving) || !b.drag.node) {
                                k._handleEvents("onclick", j);
                                if (k.inDoubleClickWindow) {
                                    k._handleEvents("ondblclick", j)
                                }
                                k.inDoubleClickWindow = true;
                                setTimeout(function () {
                                    k.inDoubleClickWindow = false
                                }, h.dblClickWindow)
                            }
                        }
                        return true
                    } else {
                        if (h.touchStart) {
                            h.touchStart = false;
                            k._handleEvents("touchstart", j);
                            if (o.ondbltap && k.inDoubleClickWindow) {
                                var n = o.ondbltap;
                                for (var m = 0; m < n.length; m++) {
                                    n[m].handler.apply(k, [j])
                                }
                            }
                            k.inDoubleClickWindow = true;
                            setTimeout(function () {
                                k.inDoubleClickWindow = false
                            }, h.dblClickWindow);
                            return true
                        } else {
                            if (h.touchEnd) {
                                h.touchEnd = false;
                                k._handleEvents("touchend", j);
                                return true
                            } else {
                                if (o.touchmove) {
                                    k._handleEvents("touchmove", j);
                                    return true
                                } else {
                                    if (!h.targetShape || (!i && k.id !== h.targetShape.id)) {
                                        if (h.targetShape) {
                                            var l = h.targetShape.eventListeners;
                                            if (l) {
                                                h.targetShape._handleEvents("onmouseout", j)
                                            }
                                        }
                                        h.targetShape = k;
                                        k._handleEvents("onmouseover", j);
                                        return true
                                    } else {
                                        k._handleEvents("onmousemove", j);
                                        return true
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if (h.targetShape && h.targetShape.id === k.id) {
                    h.targetShape = undefined;
                    k._handleEvents("onmouseout", j);
                    return true
                }
            }
            return false
        }
        function c(n) {
            var m = n.children;
            for (var l = m.length - 1; l >= 0; l--) {
                var o = m[l];
                if (o.className === "Shape") {
                    var k = e(o);
                    if (k) {
                        return true
                    }
                } else {
                    c(o)
                }
            }
            return false
        }
        var b = Kinetic.GlobalObject;
        if (b.drag.node === undefined) {
            for (var a = this.children.length - 1; a >= 0; a--) {
                var f = this.children[a];
                if (f.visible && a >= 0 && f.isListening) {
                    if (c(f)) {
                        a = -1
                    }
                }
            }
        }
    },
    _listen: function () {
        var a = this;
        this.container.addEventListener("mousedown", function (b) {
            a.mouseDown = true;
            a._handleEvent(b)
        }, false);
        this.container.addEventListener("mousemove", function (b) {
            a.mouseUp = false;
            a.mouseDown = false;
            a._handleEvent(b)
        }, false);
        this.container.addEventListener("mouseup", function (b) {
            a.mouseUp = true;
            a.mouseDown = false;
            a._handleEvent(b);
            a.clickStart = false
        }, false);
        this.container.addEventListener("mouseover", function (b) {
            a._handleEvent(b)
        }, false);
        this.container.addEventListener("mouseout", function (b) {
            a.mousePos = undefined
        }, false);
        this.container.addEventListener("touchstart", function (b) {
            b.preventDefault();
            a.touchStart = true;
            a._handleEvent(b)
        }, false);
        this.container.addEventListener("touchmove", function (b) {
            b.preventDefault();
            a._handleEvent(b)
        }, false);
        this.container.addEventListener("touchend", function (b) {
            b.preventDefault();
            a.touchEnd = true;
            a._handleEvent(b)
        }, false)
    },
    getMousePosition: function (a) {
        return this.mousePos
    },
    getTouchPosition: function (a) {
        return this.touchPos
    },
    getUserPosition: function (a) {
        return this.getTouchPosition() || this.getMousePosition()
    },
    _setMousePosition: function (a) {
        var c = a.clientX - this._getContainerPosition().left + window.pageXOffset;
        var b = a.clientY - this._getContainerPosition().top + window.pageYOffset;
        this.mousePos = {
            x: c,
            y: b
        }
    },
    _setTouchPosition: function (c) {
        if (c.touches !== undefined && c.touches.length === 1) {
            var d = c.touches[0];
            var b = d.clientX - this._getContainerPosition().left + window.pageXOffset;
            var a = d.clientY - this._getContainerPosition().top + window.pageYOffset;
            this.touchPos = {
                x: b,
                y: a
            }
        }
    },
    _getContainerPosition: function () {
        var c = this.container;
        var b = 0;
        var a = 0;
        while (c && c.tagName !== "BODY") {
            b += c.offsetTop;
            a += c.offsetLeft;
            c = c.offsetParent
        }
        return {
            top: b,
            left: a
        }
    },
    getContainer: function () {
        return this.container
    },
    getStage: function () {
        return this
    },
    getTargetShape: function () {
        return this.targetShape
    }
};
Kinetic.GlobalObject.extend(Kinetic.Stage, Kinetic.Container);
Kinetic.Layer = function (a) {
    this.className = "Layer";
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.style.position = "absolute";
    Kinetic.Container.apply(this, []);
    Kinetic.Node.apply(this, [a])
};
Kinetic.Layer.prototype = {
    draw: function () {
        this._draw()
    },
    _draw: function () {
        this.clear();
        if (this.visible) {
            this._drawChildren()
        }
    },
    clear: function () {
        var b = this.getContext();
        var a = this.getCanvas();
        b.clearRect(0, 0, a.width, a.height)
    },
    getCanvas: function () {
        return this.canvas
    },
    getContext: function () {
        return this.context
    },
    add: function (a) {
        this._add(a)
    },
    remove: function (a) {
        this._remove(a)
    }
};
Kinetic.GlobalObject.extend(Kinetic.Layer, Kinetic.Container);
Kinetic.GlobalObject.extend(Kinetic.Layer, Kinetic.Node);
Kinetic.Group = function (a) {
    this.className = "Group";
    Kinetic.Container.apply(this, []);
    Kinetic.Node.apply(this, [a])
};
Kinetic.Group.prototype = {
    _draw: function () {
        if (this.visible) {
            this._drawChildren()
        }
    },
    add: function (a) {
        this._add(a)
    },
    remove: function (a) {
        this._remove(a)
    }
};
Kinetic.GlobalObject.extend(Kinetic.Group, Kinetic.Container);
Kinetic.GlobalObject.extend(Kinetic.Group, Kinetic.Node);
Kinetic.Shape = function (a) {
    this.className = "Shape";
    if (a.stroke !== undefined || a.strokeWidth !== undefined) {
        if (a.stroke === undefined) {
            a.stroke = "black"
        } else {
            if (a.strokeWidth === undefined) {
                a.strokeWidth = 2
            }
        }
    }
    this.drawFunc = a.drawFunc;
    Kinetic.Node.apply(this, [a])
};
Kinetic.Shape.prototype = {
    getContext: function () {
        return this.tempLayer.getContext()
    },
    getCanvas: function () {
        return this.tempLayer.getCanvas()
    },
    _draw: function (d) {
        if (this.visible) {
            var a = d.getStage();
            var c = d.getContext();
            var f = [];
            f.unshift(this);
            var e = this.parent;
            while (e.className !== "Stage") {
                f.unshift(e);
                e = e.parent
            }
            for (var h = 0; h < f.length; h++) {
                var g = f[h];
                c.save();
                if (g.x !== 0 || g.y !== 0) {
                    c.translate(g.x, g.y)
                }
                if (g.centerOffset.x !== 0 || g.centerOffset.y !== 0) {
                    c.translate(g.centerOffset.x, g.centerOffset.y)
                }
                if (g.rotation !== 0) {
                    c.rotate(g.rotation)
                }
                if (g.scale.x !== 1 || g.scale.y !== 1) {
                    c.scale(g.scale.x, g.scale.y)
                }
                if (g.centerOffset.x !== 0 || g.centerOffset.y !== 0) {
                    c.translate(-1 * g.centerOffset.x, -1 * g.centerOffset.y)
                }
                if (g.getAbsoluteAlpha() !== 1) {
                    c.globalAlpha = g.getAbsoluteAlpha()
                }
            }
            c.save();
            if (a && (a.scale.x !== 1 || a.scale.y !== 1)) {
                c.scale(a.scale.x, a.scale.y)
            }
            this.tempLayer = d;
            this.drawFunc.call(this);
            for (var b = 0; b < f.length; b++) {
                c.restore()
            }
            c.restore()
        }
    },
    fillStroke: function () {
        var a = this.getContext();
        if (this.fill !== undefined) {
            a.fillStyle = this.fill;
            a.fill()
        }
        if (this.stroke !== undefined) {
            a.lineWidth = this.strokeWidth === undefined ? 1 : this.strokeWidth;
            a.strokeStyle = this.stroke;
            a.stroke()
        }
    },
    setFill: function (a) {
        this.fill = a
    },
    getFill: function () {
        return this.fill
    },
    setStroke: function (a) {
        this.stroke = a
    },
    getStroke: function () {
        return this.stroke
    },
    setStrokeWidth: function (a) {
        this.strokeWidth = a
    },
    getStrokeWidth: function () {
        return this.strokeWidth
    }
};
Kinetic.GlobalObject.extend(Kinetic.Shape, Kinetic.Node);
Kinetic.Rect = function (a) {
    a.drawFunc = function () {
        var b = this.getCanvas();
        var c = this.getContext();
        c.beginPath();
        c.rect(0, 0, this.width, this.height);
        c.closePath();
        this.fillStroke()
    };
    Kinetic.Shape.apply(this, [a])
};
Kinetic.Rect.prototype = {
    setWidth: function (a) {
        this.width = a
    },
    getWidth: function () {
        return this.width
    },
    setHeight: function (a) {
        this.height = a
    },
    getHeight: function () {
        return this.height
    },
    setSize: function (b, a) {
        this.width = b;
        this.height = a
    }
};
Kinetic.GlobalObject.extend(Kinetic.Rect, Kinetic.Shape);
Kinetic.Circle = function (a) {
    a.drawFunc = function () {
        var b = this.getCanvas();
        var c = this.getContext();
        c.beginPath();
        c.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        c.closePath();
        this.fillStroke()
    };
    Kinetic.Shape.apply(this, [a])
};
Kinetic.Circle.prototype = {
    setRadius: function (a) {
        this.radius = a
    },
    getRadius: function () {
        return this.radius
    }
};
Kinetic.GlobalObject.extend(Kinetic.Circle, Kinetic.Shape);
Kinetic.Image = function (a) {
    if (a.width === undefined) {
        a.width = a.image.width
    }
    if (a.height === undefined) {
        a.height = a.image.height
    }
    a.drawFunc = function () {
        var b = this.getCanvas();
        var c = this.getContext();
        c.beginPath();
        c.rect(0, 0, this.width, this.height);
        c.closePath();
        this.fillStroke();
        c.drawImage(this.image, 0, 0, this.width, this.height)
    };
    Kinetic.Shape.apply(this, [a])
};
Kinetic.Image.prototype = {
    setImage: function (a) {
        this.image = a
    },
    getImage: function (a) {
        return this.image
    },
    setWidth: function (a) {
        this.width = a
    },
    getWidth: function () {
        return this.width
    },
    setHeight: function (a) {
        this.height = a
    },
    getHeight: function () {
        return this.height
    },
    setSize: function (b, a) {
        this.width = b;
        this.height = a
    }
};
Kinetic.GlobalObject.extend(Kinetic.Image, Kinetic.Shape);
Kinetic.Polygon = function (a) {
    a.drawFunc = function () {
        var b = this.getContext();
        b.beginPath();
        b.moveTo(this.points[0].x, this.points[0].y);
        for (var c = 1; c < this.points.length; c++) {
            b.lineTo(this.points[c].x, this.points[c].y)
        }
        b.closePath();
        this.fillStroke()
    };
    Kinetic.Shape.apply(this, [a])
};
Kinetic.Polygon.prototype = {
    setPoints: function (a) {
        this.points = a
    },
    getPoints: function () {
        return this.points
    }
};
Kinetic.GlobalObject.extend(Kinetic.Polygon, Kinetic.Shape);
Kinetic.RegularPolygon = function (a) {
    a.drawFunc = function () {
        var c = this.getContext();
        c.beginPath();
        c.moveTo(0, 0 - this.radius);
        for (var e = 1; e < this.sides; e++) {
            var b = this.radius * Math.sin(e * 2 * Math.PI / this.sides);
            var d = -1 * this.radius * Math.cos(e * 2 * Math.PI / this.sides);
            c.lineTo(b, d)
        }
        c.closePath();
        this.fillStroke()
    };
    Kinetic.Shape.apply(this, [a])
};
Kinetic.RegularPolygon.prototype = {
    setPoints: function (a) {
        this.points = a
    },
    getPoints: function () {
        return this.points
    },
    setRadius: function (a) {
        this.radius = a
    },
    getRadius: function () {
        return this.radius
    },
    setSides: function (a) {
        this.sides = a
    },
    getSides: function () {
        return this.sides
    }
};
Kinetic.GlobalObject.extend(Kinetic.RegularPolygon, Kinetic.Shape);
Kinetic.Star = function (a) {
    a.drawFunc = function () {
        var d = this.getContext();
        d.beginPath();
        d.moveTo(0, 0 - this.outerRadius);
        for (var f = 1; f < this.points * 2; f++) {
            var c = f % 2 === 0 ? this.outerRadius : this.innerRadius;
            var b = c * Math.sin(f * Math.PI / this.points);
            var e = -1 * c * Math.cos(f * Math.PI / this.points);
            d.lineTo(b, e)
        }
        d.closePath();
        this.fillStroke()
    };
    Kinetic.Shape.apply(this, [a])
};
Kinetic.Star.prototype = {
    setPoints: function (a) {
        this.points = a
    },
    getPoints: function () {
        return this.points
    },
    setOuterRadius: function (a) {
        this.outerRadius = a
    },
    getOuterRadius: function () {
        return this.outerRadius
    },
    setInnerRadius: function (a) {
        this.innerRadius = a
    },
    getInnerRadius: function () {
        return this.innerRadius
    }
};
Kinetic.GlobalObject.extend(Kinetic.Star, Kinetic.Shape);
Kinetic.Text = function (a) {
    if (a.textStroke !== undefined || a.textStrokeWidth !== undefined) {
        if (a.textStroke === undefined) {
            a.textStroke = "black"
        } else {
            if (a.textStrokeWidth === undefined) {
                a.textStrokeWidth = 2
            }
        }
    }
    if (a.align === undefined) {
        a.align = "left"
    }
    if (a.verticalAlign === undefined) {
        a.verticalAlign = "top"
    }
    if (a.padding === undefined) {
        a.padding = 0
    }
    a.drawFunc = function () {
        var d = this.getCanvas();
        var c = this.getContext();
        c.font = this.fontSize + "pt " + this.fontFamily;
        c.textBaseline = "middle";
        var h = c.measureText(this.text);
        var j = this.fontSize;
        var g = h.width;
        var b = this.padding;
        var k = 0;
        var i = 0;
        switch (this.align) {
        case "center":
            k = g / -2 - b;
            break;
        case "right":
            k = -1 * g - b;
            break
        }
        switch (this.verticalAlign) {
        case "middle":
            i = j / -2 - b;
            break;
        case "bottom":
            i = -1 * j - b;
            break
        }
        c.save();
        c.beginPath();
        c.rect(k, i, g + b * 2, j + b * 2);
        c.closePath();
        this.fillStroke();
        c.restore();
        var f = b + k;
        var e = j / 2 + b + i;
        if (this.textFill !== undefined) {
            c.fillStyle = this.textFill;
            c.fillText(this.text, f, e)
        }
        if (this.textStroke !== undefined || this.textStrokeWidth !== undefined) {
            if (this.textStroke === undefined) {
                this.textStroke = "black"
            } else {
                if (this.textStrokeWidth === undefined) {
                    this.textStrokeWidth = 2
                }
            }
            c.lineWidth = this.textStrokeWidth;
            c.strokeStyle = this.textStroke;
            c.strokeText(this.text, f, e)
        }
    };
    Kinetic.Shape.apply(this, [a])
};
Kinetic.Text.prototype = {
    setFontFamily: function (a) {
        this.fontFamily = a
    },
    getFontFamily: function () {
        return this.fontFamily
    },
    setFontSize: function (a) {
        this.fontSize = a
    },
    getFontSize: function () {
        return this.fontSize
    },
    setTextFill: function (a) {
        this.textFill = a
    },
    getTextFill: function () {
        return this.textFill
    },
    setTextStroke: function (a) {
        this.textStroke = a
    },
    getTextStroke: function () {
        return this.textStroke
    },
    setTextStrokeWidth: function (a) {
        this.textStrokeWidth = a
    },
    getTextStrokeWidth: function () {
        return this.textStrokeWidth
    },
    setPadding: function (a) {
        this.padding = a
    },
    getPadding: function () {
        return this.padding
    },
    setAlign: function (a) {
        this.align = a
    },
    getAlign: function () {
        return this.align
    },
    setVerticalAlign: function (a) {
        this.verticalAlign = a
    },
    getVerticalAlign: function () {
        return this.verticalAlign
    },
    setText: function (a) {
        this.text = a
    },
    getText: function () {
        return this.text
    }
};
Kinetic.GlobalObject.extend(Kinetic.Text, Kinetic.Shape);
