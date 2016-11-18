(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('url'), require('pixi-gl-core'), require('fs'), require('path')) :
	typeof define === 'function' && define.amd ? define(['exports', 'url', 'pixi-gl-core', 'fs', 'path'], factory) :
	(factory((global.pixi = global.pixi || {}),global._url,global.glCore,global.fs,global.path));
}(this, (function (exports,_url,glCore,fs,path) { 'use strict';

_url = 'default' in _url ? _url['default'] : _url;
var glCore__default = 'default' in glCore ? glCore['default'] : glCore;

/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

// References:
// https://github.com/sindresorhus/object-assign
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

if (!Object.assign) {
    Object.assign = index;
}

// References:
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// https://gist.github.com/1579671
// http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
// https://gist.github.com/timhall/4078614
// https://github.com/Financial-Times/polyfill-service/tree/master/polyfills/requestAnimationFrame

// Expected to be used with Browserfiy
// Browserify automatically detects the use of `global` and passes the
// correct reference of `global`, `self`, and finally `window`

var ONE_FRAME_TIME = 16;

// Date.now
if (!(Date.now && Date.prototype.getTime)) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// performance.now
if (!(global.performance && global.performance.now)) {
    (function () {
        var startTime = Date.now();

        if (!global.performance) {
            global.performance = {};
        }

        global.performance.now = function () {
            return Date.now() - startTime;
        };
    })();
}

// requestAnimationFrame
var lastTime = Date.now();
var vendors = ['ms', 'moz', 'webkit', 'o'];

for (var x = 0; x < vendors.length && !global.requestAnimationFrame; ++x) {
    var p = vendors[x];

    global.requestAnimationFrame = global[p + 'RequestAnimationFrame'];
    global.cancelAnimationFrame = global[p + 'CancelAnimationFrame'] || global[p + 'CancelRequestAnimationFrame'];
}

if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = function (callback) {
        if (typeof callback !== 'function') {
            throw new TypeError(callback + 'is not a function');
        }

        var currentTime = Date.now();
        var delay = ONE_FRAME_TIME + lastTime - currentTime;

        if (delay < 0) {
            delay = 0;
        }

        lastTime = currentTime;

        return setTimeout(function () {
            lastTime = Date.now();
            callback(performance.now());
        }, delay);
    };
}

if (!global.cancelAnimationFrame) {
    global.cancelAnimationFrame = function (id) {
        return clearTimeout(id);
    };
}

// References:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

if (!Math.sign) {
    Math.sign = function mathSign(x) {
        x = Number(x);

        if (x === 0 || isNaN(x)) {
            return x;
        }

        return x > 0 ? 1 : -1;
    };
}

if (!window.ArrayBuffer) {
    window.ArrayBuffer = Array;
}

if (!window.Float32Array) {
    window.Float32Array = Array;
}

if (!window.Uint32Array) {
    window.Uint32Array = Array;
}

if (!window.Uint16Array) {
    window.Uint16Array = Array;
}

function canUploadSameBuffer() {
	// Uploading the same buffer multiple times in a single frame can cause perf issues.
	// Apparent on IOS so only check for that at the moment
	// this check may become more complex if this issue pops up elsewhere.
	var ios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

	return !ios;
}

/**
 * String of the current PIXI version.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {string}
 */
var VERSION = '4.2.1-tmpo';

/**
 * Two Pi.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
var PI_2 = Math.PI * 2;

/**
 * Conversion factor for converting radians to degrees.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
var RAD_TO_DEG = 180 / Math.PI;

/**
 * Conversion factor for converting degrees to radians.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
var DEG_TO_RAD = Math.PI / 180;

/**
 * Constant to identify the Renderer Type.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} UNKNOWN - Unknown render type.
 * @property {number} WEBGL - WebGL render type.
 * @property {number} CANVAS - Canvas render type.
 */
var RENDERER_TYPE = {
  UNKNOWN: 0,
  WEBGL: 1,
  CANVAS: 2
};

/**
 * Various blend modes supported by PIXI.
 *
 * IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
 * Anything else will silently act like NORMAL.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} NORMAL
 * @property {number} ADD
 * @property {number} MULTIPLY
 * @property {number} SCREEN
 * @property {number} OVERLAY
 * @property {number} DARKEN
 * @property {number} LIGHTEN
 * @property {number} COLOR_DODGE
 * @property {number} COLOR_BURN
 * @property {number} HARD_LIGHT
 * @property {number} SOFT_LIGHT
 * @property {number} DIFFERENCE
 * @property {number} EXCLUSION
 * @property {number} HUE
 * @property {number} SATURATION
 * @property {number} COLOR
 * @property {number} LUMINOSITY
 */
var BLEND_MODES = {
  NORMAL: 0,
  ADD: 1,
  MULTIPLY: 2,
  SCREEN: 3,
  OVERLAY: 4,
  DARKEN: 5,
  LIGHTEN: 6,
  COLOR_DODGE: 7,
  COLOR_BURN: 8,
  HARD_LIGHT: 9,
  SOFT_LIGHT: 10,
  DIFFERENCE: 11,
  EXCLUSION: 12,
  HUE: 13,
  SATURATION: 14,
  COLOR: 15,
  LUMINOSITY: 16
};

/**
 * Various webgl draw modes. These can be used to specify which GL drawMode to use
 * under certain situations and renderers.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} POINTS
 * @property {number} LINES
 * @property {number} LINE_LOOP
 * @property {number} LINE_STRIP
 * @property {number} TRIANGLES
 * @property {number} TRIANGLE_STRIP
 * @property {number} TRIANGLE_FAN
 */
var DRAW_MODES = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
};

/**
 * The scale modes that are supported by pixi.
 *
 * The PIXI.settings.SCALE_MODE scale mode affects the default scaling mode of future operations.
 * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} LINEAR Smooth scaling
 * @property {number} NEAREST Pixelating scaling
 */
var SCALE_MODES = {
  LINEAR: 0,
  NEAREST: 1
};

/**
 * The wrap modes that are supported by pixi.
 *
 * The PIXI.settings.WRAP_MODE wrap mode affects the default wraping mode of future operations.
 * It can be re-assigned to either CLAMP or REPEAT, depending upon suitability.
 * If the texture is non power of two then clamp will be used regardless as webGL can
 * only use REPEAT if the texture is po2.
 *
 * This property only affects WebGL.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} CLAMP - The textures uvs are clamped
 * @property {number} REPEAT - The texture uvs tile and repeat
 * @property {number} MIRRORED_REPEAT - The texture uvs tile and repeat with mirroring
 */
var WRAP_MODES = {
  CLAMP: 0,
  REPEAT: 1,
  MIRRORED_REPEAT: 2
};

/**
 * The gc modes that are supported by pixi.
 *
 * The PIXI.settings.GC_MODE Garbage Collection mode for pixi textures is AUTO
 * If set to GC_MODE, the renderer will occasianally check textures usage. If they are not
 * used for a specified period of time they will be removed from the GPU. They will of course
 * be uploaded again when they are required. This is a silent behind the scenes process that
 * should ensure that the GPU does not  get filled up.
 *
 * Handy for mobile devices!
 * This property only affects WebGL.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} AUTO - Garbage collection will happen periodically automatically
 * @property {number} MANUAL - Garbage collection will need to be called manually
 */
var GC_MODES = {
  AUTO: 0,
  MANUAL: 1
};

/**
 * Regexp for image type by extension.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {RegExp|string}
 * @example `image.png`
 */
var URL_FILE_EXTENSION = /\.(\w{3,4})(?:$|\?|#)/i;

/**
 * Regexp for data URI.
 * Based on: https://github.com/ragingwind/data-uri-regex
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {RegExp|string}
 * @example `data:image/png;base64`
 */
var DATA_URI = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;(charset=[\w-]+|base64))?,(.*)/i;

/**
 * Regexp for SVG size.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {RegExp|string}
 * @example `<svg width="100" height="100"></svg>`
 */
var SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i; // eslint-disable-line max-len

/**
 * Constants that identify shapes, mainly to prevent `instanceof` calls.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} POLY
 * @property {number} RECT
 * @property {number} CIRC
 * @property {number} ELIP
 * @property {number} RREC
 */
var SHAPES = {
  POLY: 0,
  RECT: 1,
  CIRC: 2,
  ELIP: 3,
  RREC: 4
};

/**
 * Constants that specify float precision in shaders.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {string} LOW='lowp'
 * @property {string} MEDIUM='mediump'
 * @property {string} HIGH='highp'
 */
var PRECISION = {
  LOW: 'lowp',
  MEDIUM: 'mediump',
  HIGH: 'highp'
};

/**
 * Constants that specify the transform type.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} STATIC
 * @property {number} DYNAMIC
 */
var TRANSFORM_MODE = {
  STATIC: 0,
  DYNAMIC: 1
};

/**
 * Constants that define the type of gradient on text.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} LINEAR_VERTICAL
 * @property {number} LINEAR_HORIZONTAL
 */
var TEXT_GRADIENT = {
  LINEAR_VERTICAL: 0,
  LINEAR_HORIZONTAL: 1
};

// TODO: maybe change to SPRITE.BATCH_SIZE: 2000
// TODO: maybe add PARTICLE.BATCH_SIZE: 15000

/**
 * Can we upload the same buffer in a single frame?
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {boolean}
 */
var CAN_UPLOAD_SAME_BUFFER = canUploadSameBuffer();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents
 * the horizontal axis and y represents the vertical axis.
 *
 * @class
 * @memberof PIXI
 */
var Point = function () {
  /**
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  function Point() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    classCallCheck(this, Point);

    /**
     * @member {number}
     * @default 0
     */
    this.x = x;

    /**
     * @member {number}
     * @default 0
     */
    this.y = y;
  }

  /**
   * Creates a clone of this point
   *
   * @return {PIXI.Point} a copy of the point
   */


  createClass(Point, [{
    key: "clone",
    value: function clone() {
      return new Point(this.x, this.y);
    }

    /**
     * Copies x and y from the given point
     *
     * @param {PIXI.Point} p - The point to copy.
     */

  }, {
    key: "copy",
    value: function copy(p) {
      this.set(p.x, p.y);
    }

    /**
     * Returns true if the given point is equal to this point
     *
     * @param {PIXI.Point} p - The point to check
     * @returns {boolean} Whether the given point equal to this point
     */

  }, {
    key: "equals",
    value: function equals(p) {
      return p.x === this.x && p.y === this.y;
    }

    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */

  }, {
    key: "set",
    value: function set(x, y) {
      this.x = x || 0;
      this.y = y || (y !== 0 ? this.x : 0);
    }
  }]);
  return Point;
}();

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents
 * the horizontal axis and y represents the vertical axis.
 * An observable point is a point that triggers a callback when the point's position is changed.
 *
 * @class
 * @memberof PIXI
 */
var ObservablePoint = function () {
    /**
     * @param {Function} cb - callback when changed
     * @param {object} scope - owner of callback
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */
    function ObservablePoint(cb, scope) {
        var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        classCallCheck(this, ObservablePoint);

        this._x = x;
        this._y = y;

        this.cb = cb;
        this.scope = scope;
    }

    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */


    createClass(ObservablePoint, [{
        key: "set",
        value: function set(x, y) {
            var _x = x || 0;
            var _y = y || (y !== 0 ? _x : 0);

            if (this._x !== _x || this._y !== _y) {
                this._x = _x;
                this._y = _y;
                this.cb.call(this.scope);
            }
        }

        /**
         * Copies the data from another point
         *
         * @param {PIXI.Point|PIXI.ObservablePoint} point - point to copy from
         */

    }, {
        key: "copy",
        value: function copy(point) {
            if (this._x !== point.x || this._y !== point.y) {
                this._x = point.x;
                this._y = point.y;
                this.cb.call(this.scope);
            }
        }

        /**
         * The position of the displayObject on the x axis relative to the local coordinates of the parent.
         *
         * @member {number}
         * @memberof PIXI.ObservablePoint#
         */

    }, {
        key: "x",
        get: function get() {
            return this._x;
        }

        /**
         * Sets the X component.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            if (this._x !== value) {
                this._x = value;
                this.cb.call(this.scope);
            }
        }

        /**
         * The position of the displayObject on the x axis relative to the local coordinates of the parent.
         *
         * @member {number}
         * @memberof PIXI.ObservablePoint#
         */

    }, {
        key: "y",
        get: function get() {
            return this._y;
        }

        /**
         * Sets the Y component.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            if (this._y !== value) {
                this._y = value;
                this.cb.call(this.scope);
            }
        }
    }]);
    return ObservablePoint;
}();

/**
 * The pixi Matrix class as an object, which makes it a lot faster,
 * here is a representation of it :
 * | a | b | tx|
 * | c | d | ty|
 * | 0 | 0 | 1 |
 *
 * @class
 * @memberof PIXI
 */

var Matrix = function () {
    /**
     *
     */
    function Matrix() {
        classCallCheck(this, Matrix);

        /**
         * @member {number}
         * @default 1
         */
        this.a = 1;

        /**
         * @member {number}
         * @default 0
         */
        this.b = 0;

        /**
         * @member {number}
         * @default 0
         */
        this.c = 0;

        /**
         * @member {number}
         * @default 1
         */
        this.d = 1;

        /**
         * @member {number}
         * @default 0
         */
        this.tx = 0;

        /**
         * @member {number}
         * @default 0
         */
        this.ty = 0;

        this.array = null;
    }

    /**
     * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
     *
     * a = array[0]
     * b = array[1]
     * c = array[3]
     * d = array[4]
     * tx = array[2]
     * ty = array[5]
     *
     * @param {number[]} array - The array that the matrix will be populated from.
     */


    createClass(Matrix, [{
        key: 'fromArray',
        value: function fromArray(array) {
            this.a = array[0];
            this.b = array[1];
            this.c = array[3];
            this.d = array[4];
            this.tx = array[2];
            this.ty = array[5];
        }

        /**
         * sets the matrix properties
         *
         * @param {number} a - Matrix component
         * @param {number} b - Matrix component
         * @param {number} c - Matrix component
         * @param {number} d - Matrix component
         * @param {number} tx - Matrix component
         * @param {number} ty - Matrix component
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'set',
        value: function set(a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;

            return this;
        }

        /**
         * Creates an array from the current Matrix object.
         *
         * @param {boolean} transpose - Whether we need to transpose the matrix or not
         * @param {Float32Array} [out=new Float32Array(9)] - If provided the array will be assigned to out
         * @return {number[]} the newly created array which contains the matrix
         */

    }, {
        key: 'toArray',
        value: function toArray(transpose, out) {
            if (!this.array) {
                this.array = new Float32Array(9);
            }

            var array = out || this.array;

            if (transpose) {
                array[0] = this.a;
                array[1] = this.b;
                array[2] = 0;
                array[3] = this.c;
                array[4] = this.d;
                array[5] = 0;
                array[6] = this.tx;
                array[7] = this.ty;
                array[8] = 1;
            } else {
                array[0] = this.a;
                array[1] = this.c;
                array[2] = this.tx;
                array[3] = this.b;
                array[4] = this.d;
                array[5] = this.ty;
                array[6] = 0;
                array[7] = 0;
                array[8] = 1;
            }

            return array;
        }

        /**
         * Get a new position with the current transformation applied.
         * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
         *
         * @param {PIXI.Point} pos - The origin
         * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
         * @return {PIXI.Point} The new point, transformed through this matrix
         */

    }, {
        key: 'apply',
        value: function apply(pos, newPos) {
            newPos = newPos || new Point();

            var x = pos.x;
            var y = pos.y;

            newPos.x = this.a * x + this.c * y + this.tx;
            newPos.y = this.b * x + this.d * y + this.ty;

            return newPos;
        }

        /**
         * Get a new position with the inverse of the current transformation applied.
         * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
         *
         * @param {PIXI.Point} pos - The origin
         * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
         * @return {PIXI.Point} The new point, inverse-transformed through this matrix
         */

    }, {
        key: 'applyInverse',
        value: function applyInverse(pos, newPos) {
            newPos = newPos || new Point();

            var id = 1 / (this.a * this.d + this.c * -this.b);

            var x = pos.x;
            var y = pos.y;

            newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
            newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;

            return newPos;
        }

        /**
         * Translates the matrix on the x and y.
         *
         * @param {number} x How much to translate x by
         * @param {number} y How much to translate y by
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'translate',
        value: function translate(x, y) {
            this.tx += x;
            this.ty += y;

            return this;
        }

        /**
         * Applies a scale transformation to the matrix.
         *
         * @param {number} x The amount to scale horizontally
         * @param {number} y The amount to scale vertically
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'scale',
        value: function scale(x, y) {
            this.a *= x;
            this.d *= y;
            this.c *= x;
            this.b *= y;
            this.tx *= x;
            this.ty *= y;

            return this;
        }

        /**
         * Applies a rotation transformation to the matrix.
         *
         * @param {number} angle - The angle in radians.
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'rotate',
        value: function rotate(angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);

            var a1 = this.a;
            var c1 = this.c;
            var tx1 = this.tx;

            this.a = a1 * cos - this.b * sin;
            this.b = a1 * sin + this.b * cos;
            this.c = c1 * cos - this.d * sin;
            this.d = c1 * sin + this.d * cos;
            this.tx = tx1 * cos - this.ty * sin;
            this.ty = tx1 * sin + this.ty * cos;

            return this;
        }

        /**
         * Appends the given Matrix to this Matrix.
         *
         * @param {PIXI.Matrix} matrix - The matrix to append.
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'append',
        value: function append(matrix) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;

            this.a = matrix.a * a1 + matrix.b * c1;
            this.b = matrix.a * b1 + matrix.b * d1;
            this.c = matrix.c * a1 + matrix.d * c1;
            this.d = matrix.c * b1 + matrix.d * d1;

            this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
            this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;

            return this;
        }

        /**
         * Sets the matrix based on all the available properties
         *
         * @param {number} x - Position on the x axis
         * @param {number} y - Position on the y axis
         * @param {number} pivotX - Pivot on the x axis
         * @param {number} pivotY - Pivot on the y axis
         * @param {number} scaleX - Scale on the x axis
         * @param {number} scaleY - Scale on the y axis
         * @param {number} rotation - Rotation in radians
         * @param {number} skewX - Skew on the x axis
         * @param {number} skewY - Skew on the y axis
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'setTransform',
        value: function setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
            var sr = Math.sin(rotation);
            var cr = Math.cos(rotation);
            var cy = Math.cos(skewY);
            var sy = Math.sin(skewY);
            var nsx = -Math.sin(skewX);
            var cx = Math.cos(skewX);

            var a = cr * scaleX;
            var b = sr * scaleX;
            var c = -sr * scaleY;
            var d = cr * scaleY;

            this.a = cy * a + sy * c;
            this.b = cy * b + sy * d;
            this.c = nsx * a + cx * c;
            this.d = nsx * b + cx * d;

            this.tx = x + (pivotX * a + pivotY * c);
            this.ty = y + (pivotX * b + pivotY * d);

            return this;
        }

        /**
         * Prepends the given Matrix to this Matrix.
         *
         * @param {PIXI.Matrix} matrix - The matrix to prepend
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'prepend',
        value: function prepend(matrix) {
            var tx1 = this.tx;

            if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
                var a1 = this.a;
                var c1 = this.c;

                this.a = a1 * matrix.a + this.b * matrix.c;
                this.b = a1 * matrix.b + this.b * matrix.d;
                this.c = c1 * matrix.a + this.d * matrix.c;
                this.d = c1 * matrix.b + this.d * matrix.d;
            }

            this.tx = tx1 * matrix.a + this.ty * matrix.c + matrix.tx;
            this.ty = tx1 * matrix.b + this.ty * matrix.d + matrix.ty;

            return this;
        }

        /**
         * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
         *
         * @param {PIXI.Transform|PIXI.TransformStatic} transform - The transform to apply the properties to.
         * @return {PIXI.Transform|PIXI.TransformStatic} The transform with the newly applied properties
         */

    }, {
        key: 'decompose',
        value: function decompose(transform) {
            // sort out rotation / skew..
            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;

            var skewX = Math.atan2(-c, d);
            var skewY = Math.atan2(b, a);

            var delta = Math.abs(1 - skewX / skewY);

            if (delta < 0.00001) {
                transform.rotation = skewY;

                if (a < 0 && d >= 0) {
                    transform.rotation += transform.rotation <= 0 ? Math.PI : -Math.PI;
                }

                transform.skew.x = transform.skew.y = 0;
            } else {
                transform.skew.x = skewX;
                transform.skew.y = skewY;
            }

            // next set scale
            transform.scale.x = Math.sqrt(a * a + b * b);
            transform.scale.y = Math.sqrt(c * c + d * d);

            // next set position
            transform.position.x = this.tx;
            transform.position.y = this.ty;

            return transform;
        }

        /**
         * Inverts this matrix
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'invert',
        value: function invert() {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var n = a1 * d1 - b1 * c1;

            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = (c1 * this.ty - d1 * tx1) / n;
            this.ty = -(a1 * this.ty - b1 * tx1) / n;

            return this;
        }

        /**
         * Resets this Matix to an identity (default) matrix.
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'identity',
        value: function identity() {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;

            return this;
        }

        /**
         * Creates a new Matrix object with the same values as this one.
         *
         * @return {PIXI.Matrix} A copy of this matrix. Good for chaining method calls.
         */

    }, {
        key: 'clone',
        value: function clone() {
            var matrix = new Matrix();

            matrix.a = this.a;
            matrix.b = this.b;
            matrix.c = this.c;
            matrix.d = this.d;
            matrix.tx = this.tx;
            matrix.ty = this.ty;

            return matrix;
        }

        /**
         * Changes the values of the given matrix to be the same as the ones in this matrix
         *
         * @param {PIXI.Matrix} matrix - The matrix to copy from.
         * @return {PIXI.Matrix} The matrix given in parameter with its values updated.
         */

    }, {
        key: 'copy',
        value: function copy(matrix) {
            matrix.a = this.a;
            matrix.b = this.b;
            matrix.c = this.c;
            matrix.d = this.d;
            matrix.tx = this.tx;
            matrix.ty = this.ty;

            return matrix;
        }

        /**
         * A default (identity) matrix
         *
         * @static
         * @const
         */

    }], [{
        key: 'IDENTITY',
        get: function get() {
            return new Matrix();
        }

        /**
         * A temp matrix
         *
         * @static
         * @const
         */

    }, {
        key: 'TEMP_MATRIX',
        get: function get() {
            return new Matrix();
        }
    }]);
    return Matrix;
}();

// Your friendly neighbour https://en.wikipedia.org/wiki/Dihedral_group of order 16
var ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1];
var uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
var vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
var vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
var tempMatrices = [];

var mul = [];

function signum(x) {
    if (x < 0) {
        return -1;
    }
    if (x > 0) {
        return 1;
    }

    return 0;
}

function init() {
    for (var i = 0; i < 16; i++) {
        var row = [];

        mul.push(row);

        for (var j = 0; j < 16; j++) {
            var _ux = signum(ux[i] * ux[j] + vx[i] * uy[j]);
            var _uy = signum(uy[i] * ux[j] + vy[i] * uy[j]);
            var _vx = signum(ux[i] * vx[j] + vx[i] * vy[j]);
            var _vy = signum(uy[i] * vx[j] + vy[i] * vy[j]);

            for (var k = 0; k < 16; k++) {
                if (ux[k] === _ux && uy[k] === _uy && vx[k] === _vx && vy[k] === _vy) {
                    row.push(k);
                    break;
                }
            }
        }
    }

    for (var _i = 0; _i < 16; _i++) {
        var mat = new Matrix();

        mat.set(ux[_i], uy[_i], vx[_i], vy[_i], 0, 0);
        tempMatrices.push(mat);
    }
}

init();

/**
 * Implements Dihedral Group D_8, see [group D4]{@link http://mathworld.wolfram.com/DihedralGroupD4.html},
 * D8 is the same but with diagonals. Used for texture rotations.
 *
 * Vector xX(i), xY(i) is U-axis of sprite with rotation i
 * Vector yY(i), yY(i) is V-axis of sprite with rotation i
 * Rotations: 0 grad (0), 90 grad (2), 180 grad (4), 270 grad (6)
 * Mirrors: vertical (8), main diagonal (10), horizontal (12), reverse diagonal (14)
 * This is the small part of gameofbombs.com portal system. It works.
 *
 * @author Ivan @ivanpopelyshev
 *
 * @namespace PIXI.GroupD8
 */
var GroupD8 = {
    E: 0,
    SE: 1,
    S: 2,
    SW: 3,
    W: 4,
    NW: 5,
    N: 6,
    NE: 7,
    MIRROR_VERTICAL: 8,
    MIRROR_HORIZONTAL: 12,
    uX: function uX(ind) {
        return ux[ind];
    },
    uY: function uY(ind) {
        return uy[ind];
    },
    vX: function vX(ind) {
        return vx[ind];
    },
    vY: function vY(ind) {
        return vy[ind];
    },
    inv: function inv(rotation) {
        if (rotation & 8) {
            return rotation & 15;
        }

        return -rotation & 7;
    },
    add: function add(rotationSecond, rotationFirst) {
        return mul[rotationSecond][rotationFirst];
    },
    sub: function sub(rotationSecond, rotationFirst) {
        return mul[rotationSecond][GroupD8.inv(rotationFirst)];
    },

    /**
     * Adds 180 degrees to rotation. Commutative operation.
     *
     * @method
     * @param {number} rotation - The number to rotate.
     * @returns {number} rotated number
     */
    rotate180: function rotate180(rotation) {
        return rotation ^ 4;
    },

    /**
     * I dont know why sometimes width and heights needs to be swapped. We'll fix it later.
     *
     * @param {number} rotation - The number to check.
     * @returns {boolean} Whether or not the width/height should be swapped.
     */
    isSwapWidthHeight: function isSwapWidthHeight(rotation) {
        return (rotation & 3) === 2;
    },

    /**
     * @param {number} dx - TODO
     * @param {number} dy - TODO
     *
     * @return {number} TODO
     */
    byDirection: function byDirection(dx, dy) {
        if (Math.abs(dx) * 2 <= Math.abs(dy)) {
            if (dy >= 0) {
                return GroupD8.S;
            }

            return GroupD8.N;
        } else if (Math.abs(dy) * 2 <= Math.abs(dx)) {
            if (dx > 0) {
                return GroupD8.E;
            }

            return GroupD8.W;
        } else if (dy > 0) {
            if (dx > 0) {
                return GroupD8.SE;
            }

            return GroupD8.SW;
        } else if (dx > 0) {
            return GroupD8.NE;
        }

        return GroupD8.NW;
    },

    /**
     * Helps sprite to compensate texture packer rotation.
     *
     * @param {PIXI.Matrix} matrix - sprite world matrix
     * @param {number} rotation - The rotation factor to use.
     * @param {number} tx - sprite anchoring
     * @param {number} ty - sprite anchoring
     */
    matrixAppendRotationInv: function matrixAppendRotationInv(matrix, rotation) {
        var tx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var ty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        // Packer used "rotation", we use "inv(rotation)"
        var mat = tempMatrices[GroupD8.inv(rotation)];

        mat.tx = tx;
        mat.ty = ty;
        matrix.append(mat);
    }
};

/**
 * Rectangle object is an area defined by its position, as indicated by its top-left corner
 * point (x, y) and by its width and its height.
 *
 * @class
 * @memberof PIXI
 */

var Rectangle = function () {
    /**
     * @param {number} [x=0] - The X coordinate of the upper-left corner of the rectangle
     * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rectangle
     * @param {number} [width=0] - The overall width of this rectangle
     * @param {number} [height=0] - The overall height of this rectangle
     */
    function Rectangle() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        classCallCheck(this, Rectangle);

        /**
         * @member {number}
         * @default 0
         */
        this.x = x;

        /**
         * @member {number}
         * @default 0
         */
        this.y = y;

        /**
         * @member {number}
         * @default 0
         */
        this.width = width;

        /**
         * @member {number}
         * @default 0
         */
        this.height = height;

        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.RECT
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.RECT;
    }

    /**
     * returns the left edge of the rectangle
     *
     * @member {number}
     * @memberof PIXI.Rectangle#
     */


    createClass(Rectangle, [{
        key: 'clone',


        /**
         * Creates a clone of this Rectangle
         *
         * @return {PIXI.Rectangle} a copy of the rectangle
         */
        value: function clone() {
            return new Rectangle(this.x, this.y, this.width, this.height);
        }

        /**
         * Copies another rectangle to this one.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to copy.
         * @return {PIXI.Rectangle} Returns itself.
         */

    }, {
        key: 'copy',
        value: function copy(rectangle) {
            this.x = rectangle.x;
            this.y = rectangle.y;
            this.width = rectangle.width;
            this.height = rectangle.height;

            return this;
        }

        /**
         * Checks whether the x and y coordinates given are contained within this Rectangle
         *
         * @param {number} x - The X coordinate of the point to test
         * @param {number} y - The Y coordinate of the point to test
         * @return {boolean} Whether the x/y coordinates are within this Rectangle
         */

    }, {
        key: 'contains',
        value: function contains(x, y) {
            if (this.width <= 0 || this.height <= 0) {
                return false;
            }

            if (x >= this.x && x < this.x + this.width) {
                if (y >= this.y && y < this.y + this.height) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Pads the rectangle making it grow in all directions.
         *
         * @param {number} paddingX - The horizontal padding amount.
         * @param {number} paddingY - The vertical padding amount.
         */

    }, {
        key: 'pad',
        value: function pad(paddingX, paddingY) {
            paddingX = paddingX || 0;
            paddingY = paddingY || (paddingY !== 0 ? paddingX : 0);

            this.x -= paddingX;
            this.y -= paddingY;

            this.width += paddingX * 2;
            this.height += paddingY * 2;
        }

        /**
         * Fits this rectangle around the passed one.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to fit.
         */

    }, {
        key: 'fit',
        value: function fit(rectangle) {
            if (this.x < rectangle.x) {
                this.width += this.x;
                if (this.width < 0) {
                    this.width = 0;
                }

                this.x = rectangle.x;
            }

            if (this.y < rectangle.y) {
                this.height += this.y;
                if (this.height < 0) {
                    this.height = 0;
                }
                this.y = rectangle.y;
            }

            if (this.x + this.width > rectangle.x + rectangle.width) {
                this.width = rectangle.width - this.x;
                if (this.width < 0) {
                    this.width = 0;
                }
            }

            if (this.y + this.height > rectangle.y + rectangle.height) {
                this.height = rectangle.height - this.y;
                if (this.height < 0) {
                    this.height = 0;
                }
            }
        }

        /**
         * Enlarges this rectangle to include the passed rectangle.
         *
         * @param {PIXI.Rectangle} rect - The rectangle to include.
         */

    }, {
        key: 'enlarge',
        value: function enlarge(rect) {
            if (rect === Rectangle.EMPTY) {
                return;
            }

            var x1 = Math.min(this.x, rect.x);
            var x2 = Math.max(this.x + this.width, rect.x + rect.width);
            var y1 = Math.min(this.y, rect.y);
            var y2 = Math.max(this.y + this.height, rect.y + rect.height);

            this.x = x1;
            this.width = x2 - x1;
            this.y = y1;
            this.height = y2 - y1;
        }
    }, {
        key: 'left',
        get: function get() {
            return this.x;
        }

        /**
         * returns the right edge of the rectangle
         *
         * @member {number}
         * @memberof PIXI.Rectangle
         */

    }, {
        key: 'right',
        get: function get() {
            return this.x + this.width;
        }

        /**
         * returns the top edge of the rectangle
         *
         * @member {number}
         * @memberof PIXI.Rectangle
         */

    }, {
        key: 'top',
        get: function get() {
            return this.y;
        }

        /**
         * returns the bottom edge of the rectangle
         *
         * @member {number}
         * @memberof PIXI.Rectangle
         */

    }, {
        key: 'bottom',
        get: function get() {
            return this.y + this.height;
        }

        /**
         * A constant empty rectangle.
         *
         * @static
         * @constant
         */

    }], [{
        key: 'EMPTY',
        get: function get() {
            return new Rectangle(0, 0, 0, 0);
        }
    }]);
    return Rectangle;
}();

/**
 * The Circle object can be used to specify a hit area for displayObjects
 *
 * @class
 * @memberof PIXI
 */

var Circle = function () {
  /**
   * @param {number} [x=0] - The X coordinate of the center of this circle
   * @param {number} [y=0] - The Y coordinate of the center of this circle
   * @param {number} [radius=0] - The radius of the circle
   */
  function Circle() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    classCallCheck(this, Circle);

    /**
     * @member {number}
     * @default 0
     */
    this.x = x;

    /**
     * @member {number}
     * @default 0
     */
    this.y = y;

    /**
     * @member {number}
     * @default 0
     */
    this.radius = radius;

    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     *
     * @member {number}
     * @readOnly
     * @default PIXI.SHAPES.CIRC
     * @see PIXI.SHAPES
     */
    this.type = SHAPES.CIRC;
  }

  /**
   * Creates a clone of this Circle instance
   *
   * @return {PIXI.Circle} a copy of the Circle
   */


  createClass(Circle, [{
    key: 'clone',
    value: function clone() {
      return new Circle(this.x, this.y, this.radius);
    }

    /**
     * Checks whether the x and y coordinates given are contained within this circle
     *
     * @param {number} x - The X coordinate of the point to test
     * @param {number} y - The Y coordinate of the point to test
     * @return {boolean} Whether the x/y coordinates are within this Circle
     */

  }, {
    key: 'contains',
    value: function contains(x, y) {
      if (this.radius <= 0) {
        return false;
      }

      var r2 = this.radius * this.radius;
      var dx = this.x - x;
      var dy = this.y - y;

      dx *= dx;
      dy *= dy;

      return dx + dy <= r2;
    }

    /**
    * Returns the framing rectangle of the circle as a Rectangle object
    *
    * @return {PIXI.Rectangle} the framing rectangle
    */

  }, {
    key: 'getBounds',
    value: function getBounds() {
      return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
  }]);
  return Circle;
}();

/**
 * The Ellipse object can be used to specify a hit area for displayObjects
 *
 * @class
 * @memberof PIXI
 */

var Ellipse = function () {
  /**
   * @param {number} [x=0] - The X coordinate of the center of this circle
   * @param {number} [y=0] - The Y coordinate of the center of this circle
   * @param {number} [width=0] - The half width of this ellipse
   * @param {number} [height=0] - The half height of this ellipse
   */
  function Ellipse() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    classCallCheck(this, Ellipse);

    /**
     * @member {number}
     * @default 0
     */
    this.x = x;

    /**
     * @member {number}
     * @default 0
     */
    this.y = y;

    /**
     * @member {number}
     * @default 0
     */
    this.width = width;

    /**
     * @member {number}
     * @default 0
     */
    this.height = height;

    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     *
     * @member {number}
     * @readOnly
     * @default PIXI.SHAPES.ELIP
     * @see PIXI.SHAPES
     */
    this.type = SHAPES.ELIP;
  }

  /**
   * Creates a clone of this Ellipse instance
   *
   * @return {PIXI.Ellipse} a copy of the ellipse
   */


  createClass(Ellipse, [{
    key: 'clone',
    value: function clone() {
      return new Ellipse(this.x, this.y, this.width, this.height);
    }

    /**
     * Checks whether the x and y coordinates given are contained within this ellipse
     *
     * @param {number} x - The X coordinate of the point to test
     * @param {number} y - The Y coordinate of the point to test
     * @return {boolean} Whether the x/y coords are within this ellipse
     */

  }, {
    key: 'contains',
    value: function contains(x, y) {
      if (this.width <= 0 || this.height <= 0) {
        return false;
      }

      // normalize the coords to an ellipse with center 0,0
      var normx = (x - this.x) / this.width;
      var normy = (y - this.y) / this.height;

      normx *= normx;
      normy *= normy;

      return normx + normy <= 1;
    }

    /**
     * Returns the framing rectangle of the ellipse as a Rectangle object
     *
     * @return {PIXI.Rectangle} the framing rectangle
     */

  }, {
    key: 'getBounds',
    value: function getBounds() {
      return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
    }
  }]);
  return Ellipse;
}();

/**
 * @class
 * @memberof PIXI
 */

var Polygon = function () {
    /**
     * @param {PIXI.Point[]|number[]} points - This can be an array of Points
     *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
     *  the arguments passed can be all the points of the polygon e.g.
     *  `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the arguments passed can be flat
     *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
     */
    function Polygon() {
        for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
            points[_key] = arguments[_key];
        }

        classCallCheck(this, Polygon);

        if (Array.isArray(points[0])) {
            points = points[0];
        }

        // if this is an array of points, convert it to a flat array of numbers
        if (points[0] instanceof Point) {
            var p = [];

            for (var i = 0, il = points.length; i < il; i++) {
                p.push(points[i].x, points[i].y);
            }

            points = p;
        }

        this.closed = true;

        /**
         * An array of the points of this polygon
         *
         * @member {number[]}
         */
        this.points = points;

        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.POLY
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.POLY;
    }

    /**
     * Creates a clone of this polygon
     *
     * @return {PIXI.Polygon} a copy of the polygon
     */


    createClass(Polygon, [{
        key: 'clone',
        value: function clone() {
            return new Polygon(this.points.slice());
        }

        /**
         * Closes the polygon, adding points if necessary.
         *
         */

    }, {
        key: 'close',
        value: function close() {
            var points = this.points;

            // close the poly if the value is true!
            if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1]) {
                points.push(points[0], points[1]);
            }
        }

        /**
         * Checks whether the x and y coordinates passed to this function are contained within this polygon
         *
         * @param {number} x - The X coordinate of the point to test
         * @param {number} y - The Y coordinate of the point to test
         * @return {boolean} Whether the x/y coordinates are within this polygon
         */

    }, {
        key: 'contains',
        value: function contains(x, y) {
            var inside = false;

            // use some raycasting to test hits
            // https://github.com/substack/point-in-polygon/blob/master/index.js
            var length = this.points.length / 2;

            for (var i = 0, j = length - 1; i < length; j = i++) {
                var xi = this.points[i * 2];
                var yi = this.points[i * 2 + 1];
                var xj = this.points[j * 2];
                var yj = this.points[j * 2 + 1];
                var intersect = yi > y !== yj > y && x < (xj - xi) * ((y - yi) / (yj - yi)) + xi;

                if (intersect) {
                    inside = !inside;
                }
            }

            return inside;
        }
    }]);
    return Polygon;
}();

/**
 * The Rounded Rectangle object is an area that has nice rounded corners, as indicated by its
 * top-left corner point (x, y) and by its width and its height and its radius.
 *
 * @class
 * @memberof PIXI
 */

var RoundedRectangle = function () {
    /**
     * @param {number} [x=0] - The X coordinate of the upper-left corner of the rounded rectangle
     * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rounded rectangle
     * @param {number} [width=0] - The overall width of this rounded rectangle
     * @param {number} [height=0] - The overall height of this rounded rectangle
     * @param {number} [radius=20] - Controls the radius of the rounded corners
     */
    function RoundedRectangle() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var radius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20;
        classCallCheck(this, RoundedRectangle);

        /**
         * @member {number}
         * @default 0
         */
        this.x = x;

        /**
         * @member {number}
         * @default 0
         */
        this.y = y;

        /**
         * @member {number}
         * @default 0
         */
        this.width = width;

        /**
         * @member {number}
         * @default 0
         */
        this.height = height;

        /**
         * @member {number}
         * @default 20
         */
        this.radius = radius;

        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readonly
         * @default PIXI.SHAPES.RREC
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.RREC;
    }

    /**
     * Creates a clone of this Rounded Rectangle
     *
     * @return {PIXI.RoundedRectangle} a copy of the rounded rectangle
     */


    createClass(RoundedRectangle, [{
        key: 'clone',
        value: function clone() {
            return new RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
        }

        /**
         * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
         *
         * @param {number} x - The X coordinate of the point to test
         * @param {number} y - The Y coordinate of the point to test
         * @return {boolean} Whether the x/y coordinates are within this Rounded Rectangle
         */

    }, {
        key: 'contains',
        value: function contains(x, y) {
            if (this.width <= 0 || this.height <= 0) {
                return false;
            }
            if (x >= this.x && x <= this.x + this.width) {
                if (y >= this.y && y <= this.y + this.height) {
                    if (y >= this.y + this.radius && y <= this.y + this.height - this.radius || x >= this.x + this.radius && x <= this.x + this.width - this.radius) {
                        return true;
                    }
                    var dx = x - (this.x + this.radius);
                    var dy = y - (this.y + this.radius);
                    var radius2 = this.radius * this.radius;

                    if (dx * dx + dy * dy <= radius2) {
                        return true;
                    }
                    dx = x - (this.x + this.width - this.radius);
                    if (dx * dx + dy * dy <= radius2) {
                        return true;
                    }
                    dy = y - (this.y + this.height - this.radius);
                    if (dx * dx + dy * dy <= radius2) {
                        return true;
                    }
                    dx = x - (this.x + this.radius);
                    if (dx * dx + dy * dy <= radius2) {
                        return true;
                    }
                }
            }

            return false;
        }
    }]);
    return RoundedRectangle;
}();

/**
 * Math classes and utilities mixed into PIXI namespace.
 *
 * @lends PIXI
 */

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var isMobile = createCommonjsModule(function (module) {
/**
 * isMobile.js v0.4.0
 *
 * A simple library to detect Apple phones and tablets,
 * Android phones and tablets, other mobile devices (like blackberry, mini-opera and windows phone),
 * and any kind of seven inch device, via user agent sniffing.
 *
 * @author: Kai Mallea (kmallea@gmail.com)
 *
 * @license: http://creativecommons.org/publicdomain/zero/1.0/
 */
(function (global) {

    var apple_phone         = /iPhone/i,
        apple_ipod          = /iPod/i,
        apple_tablet        = /iPad/i,
        android_phone       = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, // Match 'Android' AND 'Mobile'
        android_tablet      = /Android/i,
        amazon_phone        = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        amazon_tablet       = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        windows_phone       = /IEMobile/i,
        windows_tablet      = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, // Match 'Windows' AND 'ARM'
        other_blackberry    = /BlackBerry/i,
        other_blackberry_10 = /BB10/i,
        other_opera         = /Opera Mini/i,
        other_chrome        = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
        other_firefox       = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, // Match 'Firefox' AND 'Mobile'
        seven_inch = new RegExp(
            '(?:' +         // Non-capturing group

            'Nexus 7' +     // Nexus 7

            '|' +           // OR

            'BNTV250' +     // B&N Nook Tablet 7 inch

            '|' +           // OR

            'Kindle Fire' + // Kindle Fire

            '|' +           // OR

            'Silk' +        // Kindle Fire, Silk Accelerated

            '|' +           // OR

            'GT-P1000' +    // Galaxy Tab 7 inch

            ')',            // End non-capturing group

            'i');           // Case-insensitive matching

    var match = function(regex, userAgent) {
        return regex.test(userAgent);
    };

    var IsMobileClass = function(userAgent) {
        var ua = userAgent || navigator.userAgent;

        // Facebook mobile app's integrated browser adds a bunch of strings that
        // match everything. Strip it out if it exists.
        var tmp = ua.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }

        // Twitter mobile app's integrated browser on iPad adds a "Twitter for
        // iPhone" string. Same probable happens on other tablet platforms.
        // This will confuse detection so strip it out if it exists.
        tmp = ua.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }

        this.apple = {
            phone:  match(apple_phone, ua),
            ipod:   match(apple_ipod, ua),
            tablet: !match(apple_phone, ua) && match(apple_tablet, ua),
            device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
        };
        this.amazon = {
            phone:  match(amazon_phone, ua),
            tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua)
        };
        this.android = {
            phone:  match(amazon_phone, ua) || match(android_phone, ua),
            tablet: !match(amazon_phone, ua) && !match(android_phone, ua) && (match(amazon_tablet, ua) || match(android_tablet, ua)),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua) || match(android_phone, ua) || match(android_tablet, ua)
        };
        this.windows = {
            phone:  match(windows_phone, ua),
            tablet: match(windows_tablet, ua),
            device: match(windows_phone, ua) || match(windows_tablet, ua)
        };
        this.other = {
            blackberry:   match(other_blackberry, ua),
            blackberry10: match(other_blackberry_10, ua),
            opera:        match(other_opera, ua),
            firefox:      match(other_firefox, ua),
            chrome:       match(other_chrome, ua),
            device:       match(other_blackberry, ua) || match(other_blackberry_10, ua) || match(other_opera, ua) || match(other_firefox, ua) || match(other_chrome, ua)
        };
        this.seven_inch = match(seven_inch, ua);
        this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;

        // excludes 'other' devices and ipods, targeting touchscreen phones
        this.phone = this.apple.phone || this.android.phone || this.windows.phone;

        // excludes 7 inch devices, classifying as phone or tablet is left to the user
        this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

        if (typeof window === 'undefined') {
            return this;
        }
    };

    var instantiate = function() {
        var IM = new IsMobileClass();
        IM.Class = IsMobileClass;
        return IM;
    };

    if (typeof module !== 'undefined' && module.exports && typeof window === 'undefined') {
        //node
        module.exports = IsMobileClass;
    } else if (typeof module !== 'undefined' && module.exports && typeof window !== 'undefined') {
        //browserify
        module.exports = instantiate();
    } else if (typeof define === 'function' && define.amd) {
        //AMD
        define('isMobile', [], global.isMobile = instantiate());
    } else {
        global.isMobile = instantiate();
    }

})(commonjsGlobal);
});



var isMobile$1 = Object.freeze({
	default: isMobile,
	__moduleExports: isMobile
});

function maxRecommendedTextures(max) {
    if (isMobile.tablet || isMobile.phone) {
        // check if the res is iphone 6 or higher..
        return 4;
    }

    // desktop should be ok
    return max;
}

/**
 * @namespace PIXI.settings
 */
var settings = {

  /**
   * Target frames per millisecond.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 0.06
   */
  TARGET_FPMS: 0.06,

  /**
   * If set to true WebGL will attempt make textures mimpaped by default.
   * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
   *
   * @static
   * @memberof PIXI.settings
   * @type {boolean}
   * @default true
   */
  MIPMAP_TEXTURES: true,

  /**
   * Default resolution / device pixel ratio of the renderer.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 1
   */
  RESOLUTION: 1,

  /**
   * Default filter resolution.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 1
   */
  FILTER_RESOLUTION: 1,

  /**
   * The maximum textures that this device supports.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 32
   */
  SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),

  /**
   * The default sprite batch size.
   *
   * The default aims to balance desktop and mobile devices.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 4096
   */
  SPRITE_BATCH_SIZE: 4096,

  /**
   * The prefix that denotes a URL is for a retina asset.
   *
   * @static
   * @memberof PIXI.settings
   * @type {RegExp|string}
   * @example `@2x`
   * @default /@(.+)x/
   */
  RETINA_PREFIX: /@(.+)x/,

  /**
   * The default render options if none are supplied to {@link PIXI.WebGLRenderer}
   * or {@link PIXI.CanvasRenderer}.
   *
   * @static
   * @constant
   * @memberof PIXI.settings
   * @type {object}
   * @property {HTMLCanvasElement} view=null
   * @property {number} resolution=1
   * @property {boolean} antialias=false
   * @property {boolean} forceFXAA=false
   * @property {boolean} autoResize=false
   * @property {boolean} transparent=false
   * @property {number} backgroundColor=0x000000
   * @property {boolean} clearBeforeRender=true
   * @property {boolean} preserveDrawingBuffer=false
   * @property {boolean} roundPixels=false
   */
  RENDER_OPTIONS: {
    view: null,
    antialias: false,
    forceFXAA: false,
    autoResize: false,
    transparent: false,
    backgroundColor: 0x000000,
    clearBeforeRender: true,
    preserveDrawingBuffer: false,
    roundPixels: false
  },

  /**
   * Default transform type.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default PIXI.TRANSFORM_MODE.STATIC
   */
  TRANSFORM_MODE: 0,

  /**
   * Default Garbage Collection mode.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default PIXI.GC_MODES.AUTO
   */
  GC_MODE: 0,

  /**
   * Default Garbage Collection max idle.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 3600
   */
  GC_MAX_IDLE: 60 * 60,

  /**
   * Default Garbage Collection maximum check count.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default 600
   */
  GC_MAX_CHECK_COUNT: 60 * 10,

  /**
   * Default wrap modes that are supported by pixi.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default PIXI.WRAP_MODES.CLAMP
   */
  WRAP_MODE: 0,

  /**
   * The scale modes that are supported by pixi.
   *
   * @static
   * @memberof PIXI.settings
   * @type {number}
   * @default PIXI.SCALE_MODES.LINEAR
   */
  SCALE_MODE: 0,

  /**
   * Default specify float precision in shaders.
   *
   * @static
   * @memberof PIXI.settings
   * @type {string}
   * @default PIXI.PRECISION.MEDIUM
   */
  PRECISION: 'mediump'

};

var index$2 = createCommonjsModule(function (module) {
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}
});

/**
 * Mixins functionality to make an object have "plugins".
 *
 * @example
 *      function MyObject() {}
 *
 *      pluginTarget.mixin(MyObject);
 *
 * @mixin
 * @memberof PIXI.utils
 * @param {object} obj - The object to mix into.
 */
function pluginTarget(obj) {
    obj.__plugins = {};

    /**
     * Adds a plugin to an object
     *
     * @param {string} pluginName - The events that should be listed.
     * @param {Function} ctor - The constructor function for the plugin.
     */
    obj.registerPlugin = function registerPlugin(pluginName, ctor) {
        obj.__plugins[pluginName] = ctor;
    };

    /**
     * Instantiates all the plugins of this object
     *
     */
    obj.prototype.initPlugins = function initPlugins() {
        this.plugins = this.plugins || {};

        for (var o in obj.__plugins) {
            this.plugins[o] = new obj.__plugins[o](this);
        }
    };

    /**
     * Removes all the plugins of this object
     *
     */
    obj.prototype.destroyPlugins = function destroyPlugins() {
        for (var o in this.plugins) {
            this.plugins[o].destroy();
            this.plugins[o] = null;
        }

        this.plugins = null;
    };
}

var pluginTarget$1 = {
    /**
     * Mixes in the properties of the pluginTarget into another object
     *
     * @param {object} obj - The obj to mix into
     */
    mixin: function mixin(obj) {
        pluginTarget(obj);
    }
};

var nextUid = 0;
var saidHello = false;

/**
 * Gets the next unique identifier
 *
 * @memberof PIXI.utils
 * @function uid
 * @return {number} The next unique identifier to use.
 */
function uid() {
    return ++nextUid;
}

/**
 * Converts a hex color number to an [R, G, B] array
 *
 * @memberof PIXI.utils
 * @function hex2rgb
 * @param {number} hex - The number to convert
 * @param  {number[]} [out=[]] If supplied, this array will be used rather than returning a new one
 * @return {number[]} An array representing the [R, G, B] of the color.
 */
function hex2rgb(hex, out) {
    out = out || [];

    out[0] = (hex >> 16 & 0xFF) / 255;
    out[1] = (hex >> 8 & 0xFF) / 255;
    out[2] = (hex & 0xFF) / 255;

    return out;
}

/**
 * Converts a hex color number to a string.
 *
 * @memberof PIXI.utils
 * @function hex2string
 * @param {number} hex - Number in hex
 * @return {string} The string color.
 */
function hex2string(hex) {
    hex = hex.toString(16);
    hex = '000000'.substr(0, 6 - hex.length) + hex;

    return '#' + hex;
}

/**
 * Converts a color as an [R, G, B] array to a hex number
 *
 * @memberof PIXI.utils
 * @function rgb2hex
 * @param {number[]} rgb - rgb array
 * @return {number} The color number
 */
function rgb2hex(rgb) {
    return (rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + rgb[2] * 255;
}

/**
 * get the resolution / device pixel ratio of an asset by looking for the prefix
 * used by spritesheets and image urls
 *
 * @memberof PIXI.utils
 * @function getResolutionOfUrl
 * @param {string} url - the image path
 * @return {number} resolution / device pixel ratio of an asset
 */
function getResolutionOfUrl(url) {
    var resolution = settings.RETINA_PREFIX.exec(url);

    if (resolution) {
        return parseFloat(resolution[1]);
    }

    return 1;
}

/**
 * Typedef for decomposeDataUri return object.
 *
 * @typedef {object} DecomposedDataUri
 * @property {mediaType} Media type, eg. `image`
 * @property {subType} Sub type, eg. `png`
 * @property {encoding} Data encoding, eg. `base64`
 * @property {data} The actual data
 */

/**
 * Split a data URI into components. Returns undefined if
 * parameter `dataUri` is not a valid data URI.
 *
 * @memberof PIXI.utils
 * @function decomposeDataUri
 * @param {string} dataUri - the data URI to check
 * @return {DecomposedDataUri|undefined} The decomposed data uri or undefined
 */
function decomposeDataUri(dataUri) {
    var dataUriMatch = DATA_URI.exec(dataUri);

    if (dataUriMatch) {
        return {
            mediaType: dataUriMatch[1] ? dataUriMatch[1].toLowerCase() : undefined,
            subType: dataUriMatch[2] ? dataUriMatch[2].toLowerCase() : undefined,
            encoding: dataUriMatch[3] ? dataUriMatch[3].toLowerCase() : undefined,
            data: dataUriMatch[4]
        };
    }

    return undefined;
}

/**
 * Get type of the image by regexp for extension. Returns undefined for unknown extensions.
 *
 * @memberof PIXI.utils
 * @function getUrlFileExtension
 * @param {string} url - the image path
 * @return {string|undefined} image extension
 */
function getUrlFileExtension(url) {
    var extension = URL_FILE_EXTENSION.exec(url);

    if (extension) {
        return extension[1].toLowerCase();
    }

    return undefined;
}

/**
 * Typedef for Size object.
 *
 * @typedef {object} Size
 * @property {width} Width component
 * @property {height} Height component
 */

/**
 * Get size from an svg string using regexp.
 *
 * @memberof PIXI.utils
 * @function getSvgSize
 * @param {string} svgString - a serialized svg element
 * @return {Size|undefined} image extension
 */
function getSvgSize(svgString) {
    var sizeMatch = SVG_SIZE.exec(svgString);
    var size = {};

    if (sizeMatch) {
        size[sizeMatch[1]] = Math.round(parseFloat(sizeMatch[3]));
        size[sizeMatch[5]] = Math.round(parseFloat(sizeMatch[7]));
    }

    return size;
}

/**
 * Skips the hello message of renderers that are created after this is run.
 *
 * @function skipHello
 * @memberof PIXI.utils
 */
function skipHello() {
    saidHello = true;
}

/**
 * Logs out the version and renderer information for this running instance of PIXI.
 * If you don't want to see this message you can run `PIXI.utils.skipHello()` before
 * creating your renderer. Keep in mind that doing that will forever makes you a jerk face.
 *
 * @static
 * @function sayHello
 * @memberof PIXI.utils
 * @param {string} type - The string renderer type to log.
 */
function sayHello(type) {
    if (saidHello) {
        return;
    }

    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var args = ['\n %c %c %c Pixi.js ' + VERSION + ' - \u2730 ' + type + ' \u2730  %c  %c  http://www.pixijs.com/  %c %c \u2665%c\u2665%c\u2665 \n\n', 'background: #ff66a5; padding:5px 0;', 'background: #ff66a5; padding:5px 0;', 'color: #ff66a5; background: #030307; padding:5px 0;', 'background: #ff66a5; padding:5px 0;', 'background: #ffc3dc; padding:5px 0;', 'background: #ff66a5; padding:5px 0;', 'color: #ff2424; background: #fff; padding:5px 0;', 'color: #ff2424; background: #fff; padding:5px 0;', 'color: #ff2424; background: #fff; padding:5px 0;'];

        window.console.log.apply(console, args);
    } else if (window.console) {
        window.console.log('Pixi.js ' + VERSION + ' - ' + type + ' - http://www.pixijs.com/');
    }

    saidHello = true;
}

/**
 * Helper for checking for webgl support
 *
 * @memberof PIXI.utils
 * @function isWebGLSupported
 * @return {boolean} is webgl supported
 */
function isWebGLSupported() {
    var contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true };

    try {
        if (!window.WebGLRenderingContext) {
            return false;
        }

        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);

        var success = !!(gl && gl.getContextAttributes().stencil);

        if (gl) {
            var loseContext = gl.getExtension('WEBGL_lose_context');

            if (loseContext) {
                loseContext.loseContext();
            }
        }

        gl = null;

        return success;
    } catch (e) {
        return false;
    }
}

/**
 * Returns sign of number
 *
 * @memberof PIXI.utils
 * @function sign
 * @param {number} n - the number to check the sign of
 * @returns {number} 0 if `n` is 0, -1 if `n` is negative, 1 if `n` is positive
 */
function sign(n) {
    if (n === 0) return 0;

    return n < 0 ? -1 : 1;
}

/**
 * Remove a range of items from an array
 *
 * @memberof PIXI.utils
 * @function removeItems
 * @param {Array<*>} arr The target array
 * @param {number} startIdx The index to begin removing from (inclusive)
 * @param {number} removeCount How many items to remove
 */
function removeItems(arr, startIdx, removeCount) {
    var length = arr.length;

    if (startIdx >= length || removeCount === 0) {
        return;
    }

    removeCount = startIdx + removeCount > length ? length - startIdx : removeCount;

    var len = length - removeCount;

    for (var i = startIdx; i < len; ++i) {
        arr[i] = arr[i + removeCount];
    }

    arr.length = len;
}

/**
 * @todo Describe property usage
 *
 * @memberof PIXI.utils
 * @private
 */
var TextureCache = {};

/**
 * @todo Describe property usage
 *
 * @memberof PIXI.utils
 * @private
 */
var BaseTextureCache = {};

var index$1 = Object.freeze({
	isMobile: isMobile$1,
	EventEmitter: index$2,
	pluginTarget: pluginTarget$1,
	uid: uid,
	hex2rgb: hex2rgb,
	hex2string: hex2string,
	rgb2hex: rgb2hex,
	getResolutionOfUrl: getResolutionOfUrl,
	decomposeDataUri: decomposeDataUri,
	getUrlFileExtension: getUrlFileExtension,
	getSvgSize: getSvgSize,
	skipHello: skipHello,
	sayHello: sayHello,
	isWebGLSupported: isWebGLSupported,
	sign: sign,
	removeItems: removeItems,
	TextureCache: TextureCache,
	BaseTextureCache: BaseTextureCache
});

// Internal event used by composed emitter
var TICK = 'tick';

var TARGET_FPMS = settings.TARGET_FPMS;

/**
 * A Ticker class that runs an update loop that other objects listen to.
 * This class is composed around an EventEmitter object to add listeners
 * meant for execution on the next requested animation frame.
 * Animation frames are requested only when necessary,
 * e.g. When the ticker is started and the emitter has listeners.
 *
 * @class
 * @memberof PIXI.ticker
 */

var Ticker = function () {
    /**
     *
     */
    function Ticker() {
        var _this = this;

        classCallCheck(this, Ticker);

        /**
         * Internal emitter used to fire 'tick' event
         * @private
         */
        this._emitter = new index$2();

        /**
         * Internal current frame request ID
         * @private
         */
        this._requestId = null;

        /**
         * Internal value managed by minFPS property setter and getter.
         * This is the maximum allowed milliseconds between updates.
         * @private
         */
        this._maxElapsedMS = 100;

        /**
         * Whether or not this ticker should invoke the method
         * {@link PIXI.ticker.Ticker#start} automatically
         * when a listener is added.
         *
         * @member {boolean}
         * @default false
         */
        this.autoStart = false;

        /**
         * Scalar time value from last frame to this frame.
         * This value is capped by setting {@link PIXI.ticker.Ticker#minFPS}
         * and is scaled with {@link PIXI.ticker.Ticker#speed}.
         * **Note:** The cap may be exceeded by scaling.
         *
         * @member {number}
         * @default 1
         */
        this.deltaTime = 1;

        /**
         * Time elapsed in milliseconds from last frame to this frame.
         * Opposed to what the scalar {@link PIXI.ticker.Ticker#deltaTime}
         * is based, this value is neither capped nor scaled.
         * If the platform supports DOMHighResTimeStamp,
         * this value will have a precision of 1 µs.
         *
         * @member {number}
         * @default 1 / TARGET_FPMS
         */
        this.elapsedMS = 1 / TARGET_FPMS; // default to target frame time

        /**
         * The last time {@link PIXI.ticker.Ticker#update} was invoked.
         * This value is also reset internally outside of invoking
         * update, but only when a new animation frame is requested.
         * If the platform supports DOMHighResTimeStamp,
         * this value will have a precision of 1 µs.
         *
         * @member {number}
         * @default 0
         */
        this.lastTime = 0;

        /**
         * Factor of current {@link PIXI.ticker.Ticker#deltaTime}.
         * @example
         * // Scales ticker.deltaTime to what would be
         * // the equivalent of approximately 120 FPS
         * ticker.speed = 2;
         *
         * @member {number}
         * @default 1
         */
        this.speed = 1;

        /**
         * Whether or not this ticker has been started.
         * `true` if {@link PIXI.ticker.Ticker#start} has been called.
         * `false` if {@link PIXI.ticker.Ticker#stop} has been called.
         * While `false`, this value may change to `true` in the
         * event of {@link PIXI.ticker.Ticker#autoStart} being `true`
         * and a listener is added.
         *
         * @member {boolean}
         * @default false
         */
        this.started = false;

        /**
         * Internal tick method bound to ticker instance.
         * This is because in early 2015, Function.bind
         * is still 60% slower in high performance scenarios.
         * Also separating frame requests from update method
         * so listeners may be called at any time and with
         * any animation API, just invoke ticker.update(time).
         *
         * @private
         * @param {number} time - Time since last tick.
         */
        this._tick = function (time) {
            _this._requestId = null;

            if (_this.started) {
                // Invoke listeners now
                _this.update(time);
                // Listener side effects may have modified ticker state.
                if (_this.started && _this._requestId === null && _this._emitter.listeners(TICK, true)) {
                    _this._requestId = requestAnimationFrame(_this._tick);
                }
            }
        };
    }

    /**
     * Conditionally requests a new animation frame.
     * If a frame has not already been requested, and if the internal
     * emitter has listeners, a new frame is requested.
     *
     * @private
     */


    createClass(Ticker, [{
        key: '_requestIfNeeded',
        value: function _requestIfNeeded() {
            if (this._requestId === null && this._emitter.listeners(TICK, true)) {
                // ensure callbacks get correct delta
                this.lastTime = performance.now();
                this._requestId = requestAnimationFrame(this._tick);
            }
        }

        /**
         * Conditionally cancels a pending animation frame.
         *
         * @private
         */

    }, {
        key: '_cancelIfNeeded',
        value: function _cancelIfNeeded() {
            if (this._requestId !== null) {
                cancelAnimationFrame(this._requestId);
                this._requestId = null;
            }
        }

        /**
         * Conditionally requests a new animation frame.
         * If the ticker has been started it checks if a frame has not already
         * been requested, and if the internal emitter has listeners. If these
         * conditions are met, a new frame is requested. If the ticker has not
         * been started, but autoStart is `true`, then the ticker starts now,
         * and continues with the previous conditions to request a new frame.
         *
         * @private
         */

    }, {
        key: '_startIfPossible',
        value: function _startIfPossible() {
            if (this.started) {
                this._requestIfNeeded();
            } else if (this.autoStart) {
                this.start();
            }
        }

        /**
         * Calls {@link module:eventemitter3.EventEmitter#on} internally for the
         * internal 'tick' event. It checks if the emitter has listeners,
         * and if so it requests a new animation frame at this point.
         *
         * @param {Function} fn - The listener function to be added for updates
         * @param {Function} [context] - The listener context
         * @returns {PIXI.ticker.Ticker} This instance of a ticker
         */

    }, {
        key: 'add',
        value: function add(fn, context) {
            this._emitter.on(TICK, fn, context);

            this._startIfPossible();

            return this;
        }

        /**
         * Calls {@link module:eventemitter3.EventEmitter#once} internally for the
         * internal 'tick' event. It checks if the emitter has listeners,
         * and if so it requests a new animation frame at this point.
         *
         * @param {Function} fn - The listener function to be added for one update
         * @param {Function} [context] - The listener context
         * @returns {PIXI.ticker.Ticker} This instance of a ticker
         */

    }, {
        key: 'addOnce',
        value: function addOnce(fn, context) {
            this._emitter.once(TICK, fn, context);

            this._startIfPossible();

            return this;
        }

        /**
         * Calls {@link module:eventemitter3.EventEmitter#off} internally for 'tick' event.
         * It checks if the emitter has listeners for 'tick' event.
         * If it does, then it cancels the animation frame.
         *
         * @param {Function} [fn] - The listener function to be removed
         * @param {Function} [context] - The listener context to be removed
         * @returns {PIXI.ticker.Ticker} This instance of a ticker
         */

    }, {
        key: 'remove',
        value: function remove(fn, context) {
            this._emitter.off(TICK, fn, context);

            if (!this._emitter.listeners(TICK, true)) {
                this._cancelIfNeeded();
            }

            return this;
        }

        /**
         * Starts the ticker. If the ticker has listeners
         * a new animation frame is requested at this point.
         */

    }, {
        key: 'start',
        value: function start() {
            if (!this.started) {
                this.started = true;
                this._requestIfNeeded();
            }
        }

        /**
         * Stops the ticker. If the ticker has requested
         * an animation frame it is canceled at this point.
         */

    }, {
        key: 'stop',
        value: function stop() {
            if (this.started) {
                this.started = false;
                this._cancelIfNeeded();
            }
        }

        /**
         * Triggers an update. An update entails setting the
         * current {@link PIXI.ticker.Ticker#elapsedMS},
         * the current {@link PIXI.ticker.Ticker#deltaTime},
         * invoking all listeners with current deltaTime,
         * and then finally setting {@link PIXI.ticker.Ticker#lastTime}
         * with the value of currentTime that was provided.
         * This method will be called automatically by animation
         * frame callbacks if the ticker instance has been started
         * and listeners are added.
         *
         * @param {number} [currentTime=performance.now()] - the current time of execution
         */

    }, {
        key: 'update',
        value: function update() {
            var currentTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : performance.now();

            var elapsedMS = void 0;

            // If the difference in time is zero or negative, we ignore most of the work done here.
            // If there is no valid difference, then should be no reason to let anyone know about it.
            // A zero delta, is exactly that, nothing should update.
            //
            // The difference in time can be negative, and no this does not mean time traveling.
            // This can be the result of a race condition between when an animation frame is requested
            // on the current JavaScript engine event loop, and when the ticker's start method is invoked
            // (which invokes the internal _requestIfNeeded method). If a frame is requested before
            // _requestIfNeeded is invoked, then the callback for the animation frame the ticker requests,
            // can receive a time argument that can be less than the lastTime value that was set within
            // _requestIfNeeded. This difference is in microseconds, but this is enough to cause problems.
            //
            // This check covers this browser engine timing issue, as well as if consumers pass an invalid
            // currentTime value. This may happen if consumers opt-out of the autoStart, and update themselves.

            if (currentTime > this.lastTime) {
                // Save uncapped elapsedMS for measurement
                elapsedMS = this.elapsedMS = currentTime - this.lastTime;

                // cap the milliseconds elapsed used for deltaTime
                if (elapsedMS > this._maxElapsedMS) {
                    elapsedMS = this._maxElapsedMS;
                }

                this.deltaTime = elapsedMS * TARGET_FPMS * this.speed;

                // Invoke listeners added to internal emitter
                this._emitter.emit(TICK, this.deltaTime);
            } else {
                this.deltaTime = this.elapsedMS = 0;
            }

            this.lastTime = currentTime;
        }

        /**
         * The frames per second at which this ticker is running.
         * The default is approximately 60 in most modern browsers.
         * **Note:** This does not factor in the value of
         * {@link PIXI.ticker.Ticker#speed}, which is specific
         * to scaling {@link PIXI.ticker.Ticker#deltaTime}.
         *
         * @memberof PIXI.ticker.Ticker#
         * @readonly
         */

    }, {
        key: 'FPS',
        get: function get() {
            return 1000 / this.elapsedMS;
        }

        /**
         * Manages the maximum amount of milliseconds allowed to
         * elapse between invoking {@link PIXI.ticker.Ticker#update}.
         * This value is used to cap {@link PIXI.ticker.Ticker#deltaTime},
         * but does not effect the measured value of {@link PIXI.ticker.Ticker#FPS}.
         * When setting this property it is clamped to a value between
         * `0` and `PIXI.settings.TARGET_FPMS * 1000`.
         *
         * @memberof PIXI.ticker.Ticker#
         * @default 10
         */

    }, {
        key: 'minFPS',
        get: function get() {
            return 1000 / this._maxElapsedMS;
        }

        /**
         * Sets the min fps.
         *
         * @param {number} fps - value to set.
         */
        ,
        set: function set(fps) {
            // Clamp: 0 to TARGET_FPMS
            var minFPMS = Math.min(Math.max(0, fps) / 1000, TARGET_FPMS);

            this._maxElapsedMS = 1 / minFPMS;
        }
    }]);
    return Ticker;
}();

/**
 * The shared ticker instance used by {@link PIXI.extras.AnimatedSprite}.
 * and by {@link PIXI.interaction.InteractionManager}.
 * The property {@link PIXI.ticker.Ticker#autoStart} is set to `true`
 * for this instance. Please follow the examples for usage, including
 * how to opt-out of auto-starting the shared ticker.
 *
 * @example
 * let ticker = PIXI.ticker.shared;
 * // Set this to prevent starting this ticker when listeners are added.
 * // By default this is true only for the PIXI.ticker.shared instance.
 * ticker.autoStart = false;
 * // FYI, call this to ensure the ticker is stopped. It should be stopped
 * // if you have not attempted to render anything yet.
 * ticker.stop();
 * // Call this when you are ready for a running shared ticker.
 * ticker.start();
 *
 * @example
 * // You may use the shared ticker to render...
 * let renderer = PIXI.autoDetectRenderer(800, 600);
 * let stage = new PIXI.Container();
 * let interactionManager = PIXI.interaction.InteractionManager(renderer);
 * document.body.appendChild(renderer.view);
 * ticker.add(function (time) {
 *     renderer.render(stage);
 * });
 *
 * @example
 * // Or you can just update it manually.
 * ticker.autoStart = false;
 * ticker.stop();
 * function animate(time) {
 *     ticker.update(time);
 *     renderer.render(stage);
 *     requestAnimationFrame(animate);
 * }
 * animate(performance.now());
 *
 * @type {PIXI.ticker.Ticker}
 * @memberof PIXI.ticker
 */
var shared = new Ticker();

shared.autoStart = true;



var index$3 = Object.freeze({
	shared: shared,
	Ticker: Ticker
});

/**
 * Generic class to deal with traditional 2D matrix transforms
 *
 * @class
 * @memberof PIXI
 */

var TransformBase = function () {
  /**
   *
   */
  function TransformBase() {
    classCallCheck(this, TransformBase);

    /**
     * The global matrix transform. It can be swapped temporarily by some functions like getLocalBounds()
     *
     * @member {PIXI.Matrix}
     */
    this.worldTransform = new Matrix();

    /**
     * The local matrix transform
     *
     * @member {PIXI.Matrix}
     */
    this.localTransform = new Matrix();

    this._worldID = 0;
    this._parentID = 0;
  }

  /**
   * TransformBase does not have decomposition, so this function wont do anything
   */


  createClass(TransformBase, [{
    key: 'updateLocalTransform',
    value: function updateLocalTransform() {}
    // empty


    /**
     * Updates the values of the object and applies the parent's transform.
     *
     * @param {PIXI.TransformBase} parentTransform - The transform of the parent of this object
     */

  }, {
    key: 'updateTransform',
    value: function updateTransform(parentTransform) {
      var pt = parentTransform.worldTransform;
      var wt = this.worldTransform;
      var lt = this.localTransform;

      // concat the parent matrix with the objects transform.
      wt.a = lt.a * pt.a + lt.b * pt.c;
      wt.b = lt.a * pt.b + lt.b * pt.d;
      wt.c = lt.c * pt.a + lt.d * pt.c;
      wt.d = lt.c * pt.b + lt.d * pt.d;
      wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
      wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;

      this._worldID++;
    }
  }]);
  return TransformBase;
}();

TransformBase.prototype.updateWorldTransform = TransformBase.prototype.updateTransform;

TransformBase.IDENTITY = new TransformBase();

/**
 * Transform that takes care about its versions
 *
 * @class
 * @extends PIXI.TransformBase
 * @memberof PIXI
 */

var TransformStatic = function (_TransformBase) {
  inherits(TransformStatic, _TransformBase);

  /**
   *
   */
  function TransformStatic() {
    classCallCheck(this, TransformStatic);

    /**
    * The coordinate of the object relative to the local coordinates of the parent.
    *
    * @member {PIXI.ObservablePoint}
    */
    var _this = possibleConstructorReturn(this, (TransformStatic.__proto__ || Object.getPrototypeOf(TransformStatic)).call(this));

    _this.position = new ObservablePoint(_this.onChange, _this, 0, 0);

    /**
     * The scale factor of the object.
     *
     * @member {PIXI.ObservablePoint}
     */
    _this.scale = new ObservablePoint(_this.onChange, _this, 1, 1);

    /**
     * The pivot point of the displayObject that it rotates around
     *
     * @member {PIXI.ObservablePoint}
     */
    _this.pivot = new ObservablePoint(_this.onChange, _this, 0, 0);

    /**
     * The skew amount, on the x and y axis.
     *
     * @member {PIXI.ObservablePoint}
     */
    _this.skew = new ObservablePoint(_this.updateSkew, _this, 0, 0);

    _this._rotation = 0;

    _this._sr = Math.sin(0);
    _this._cr = Math.cos(0);
    _this._cy = Math.cos(0); // skewY);
    _this._sy = Math.sin(0); // skewY);
    _this._nsx = Math.sin(0); // skewX);
    _this._cx = Math.cos(0); // skewX);

    _this._localID = 0;
    _this._currentLocalID = 0;
    return _this;
  }

  /**
   * Called when a value changes.
   *
   * @private
   */


  createClass(TransformStatic, [{
    key: 'onChange',
    value: function onChange() {
      this._localID++;
    }

    /**
     * Called when skew changes
     *
     * @private
     */

  }, {
    key: 'updateSkew',
    value: function updateSkew() {
      this._cy = Math.cos(this.skew._y);
      this._sy = Math.sin(this.skew._y);
      this._nsx = Math.sin(this.skew._x);
      this._cx = Math.cos(this.skew._x);

      this._localID++;
    }

    /**
     * Updates only local matrix
     */

  }, {
    key: 'updateLocalTransform',
    value: function updateLocalTransform() {
      var lt = this.localTransform;

      if (this._localID !== this._currentLocalID) {
        // get the matrix values of the displayobject based on its transform properties..
        var a = this._cr * this.scale._x;
        var b = this._sr * this.scale._x;
        var c = -this._sr * this.scale._y;
        var d = this._cr * this.scale._y;

        lt.a = this._cy * a + this._sy * c;
        lt.b = this._cy * b + this._sy * d;
        lt.c = this._nsx * a + this._cx * c;
        lt.d = this._nsx * b + this._cx * d;

        lt.tx = this.position._x - (this.pivot._x * lt.a + this.pivot._y * lt.c);
        lt.ty = this.position._y - (this.pivot._x * lt.b + this.pivot._y * lt.d);
        this._currentLocalID = this._localID;

        // force an update..
        this._parentID = -1;
      }
    }

    /**
     * Updates the values of the object and applies the parent's transform.
     *
     * @param {PIXI.Transform} parentTransform - The transform of the parent of this object
     */

  }, {
    key: 'updateTransform',
    value: function updateTransform(parentTransform) {
      var pt = parentTransform.worldTransform;
      var wt = this.worldTransform;
      var lt = this.localTransform;

      if (this._localID !== this._currentLocalID) {
        // get the matrix values of the displayobject based on its transform properties..
        var a = this._cr * this.scale._x;
        var b = this._sr * this.scale._x;
        var c = -this._sr * this.scale._y;
        var d = this._cr * this.scale._y;

        lt.a = this._cy * a + this._sy * c;
        lt.b = this._cy * b + this._sy * d;
        lt.c = this._nsx * a + this._cx * c;
        lt.d = this._nsx * b + this._cx * d;

        lt.tx = this.position._x - (this.pivot._x * lt.a + this.pivot._y * lt.c);
        lt.ty = this.position._y - (this.pivot._x * lt.b + this.pivot._y * lt.d);
        this._currentLocalID = this._localID;

        // force an update..
        this._parentID = -1;
      }

      if (this._parentID !== parentTransform._worldID) {
        // concat the parent matrix with the objects transform.
        wt.a = lt.a * pt.a + lt.b * pt.c;
        wt.b = lt.a * pt.b + lt.b * pt.d;
        wt.c = lt.c * pt.a + lt.d * pt.c;
        wt.d = lt.c * pt.b + lt.d * pt.d;
        wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
        wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;

        this._parentID = parentTransform._worldID;

        // update the id of the transform..
        this._worldID++;
      }
    }

    /**
     * Decomposes a matrix and sets the transforms properties based on it.
     *
     * @param {PIXI.Matrix} matrix - The matrix to decompose
     */

  }, {
    key: 'setFromMatrix',
    value: function setFromMatrix(matrix) {
      matrix.decompose(this);
      this._localID++;
    }

    /**
     * The rotation of the object in radians.
     *
     * @member {number}
     * @memberof PIXI.TransformStatic#
     */

  }, {
    key: 'rotation',
    get: function get() {
      return this._rotation;
    }

    /**
     * Sets the rotation of the transform.
     *
     * @param {number} value - The value to set to.
     */
    ,
    set: function set(value) {
      this._rotation = value;
      this._sr = Math.sin(value);
      this._cr = Math.cos(value);
      this._localID++;
    }
  }]);
  return TransformStatic;
}(TransformBase);

/**
 * Generic class to deal with traditional 2D matrix transforms
 * local transformation is calculated from position,scale,skew and rotation
 *
 * @class
 * @extends PIXI.TransformBase
 * @memberof PIXI
 */

var Transform = function (_TransformBase) {
  inherits(Transform, _TransformBase);

  /**
   *
   */
  function Transform() {
    classCallCheck(this, Transform);

    /**
    * The coordinate of the object relative to the local coordinates of the parent.
    *
    * @member {PIXI.Point}
    */
    var _this = possibleConstructorReturn(this, (Transform.__proto__ || Object.getPrototypeOf(Transform)).call(this));

    _this.position = new Point(0, 0);

    /**
     * The scale factor of the object.
     *
     * @member {PIXI.Point}
     */
    _this.scale = new Point(1, 1);

    /**
     * The skew amount, on the x and y axis.
     *
     * @member {PIXI.ObservablePoint}
     */
    _this.skew = new ObservablePoint(_this.updateSkew, _this, 0, 0);

    /**
     * The pivot point of the displayObject that it rotates around
     *
     * @member {PIXI.Point}
     */
    _this.pivot = new Point(0, 0);

    /**
     * The rotation value of the object, in radians
     *
     * @member {Number}
     * @private
     */
    _this._rotation = 0;

    _this._sr = Math.sin(0);
    _this._cr = Math.cos(0);
    _this._cy = Math.cos(0); // skewY);
    _this._sy = Math.sin(0); // skewY);
    _this._nsx = Math.sin(0); // skewX);
    _this._cx = Math.cos(0); // skewX);
    return _this;
  }

  /**
   * Updates the skew values when the skew changes.
   *
   * @private
   */


  createClass(Transform, [{
    key: 'updateSkew',
    value: function updateSkew() {
      this._cy = Math.cos(this.skew.y);
      this._sy = Math.sin(this.skew.y);
      this._nsx = Math.sin(this.skew.x);
      this._cx = Math.cos(this.skew.x);
    }

    /**
     * Updates only local matrix
     */

  }, {
    key: 'updateLocalTransform',
    value: function updateLocalTransform() {
      var lt = this.localTransform;
      var a = this._cr * this.scale.x;
      var b = this._sr * this.scale.x;
      var c = -this._sr * this.scale.y;
      var d = this._cr * this.scale.y;

      lt.a = this._cy * a + this._sy * c;
      lt.b = this._cy * b + this._sy * d;
      lt.c = this._nsx * a + this._cx * c;
      lt.d = this._nsx * b + this._cx * d;
    }

    /**
     * Updates the values of the object and applies the parent's transform.
     *
     * @param {PIXI.Transform} parentTransform - The transform of the parent of this object
     */

  }, {
    key: 'updateTransform',
    value: function updateTransform(parentTransform) {
      var pt = parentTransform.worldTransform;
      var wt = this.worldTransform;
      var lt = this.localTransform;

      var a = this._cr * this.scale.x;
      var b = this._sr * this.scale.x;
      var c = -this._sr * this.scale.y;
      var d = this._cr * this.scale.y;

      lt.a = this._cy * a + this._sy * c;
      lt.b = this._cy * b + this._sy * d;
      lt.c = this._nsx * a + this._cx * c;
      lt.d = this._nsx * b + this._cx * d;

      lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
      lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);

      // concat the parent matrix with the objects transform.
      wt.a = lt.a * pt.a + lt.b * pt.c;
      wt.b = lt.a * pt.b + lt.b * pt.d;
      wt.c = lt.c * pt.a + lt.d * pt.c;
      wt.d = lt.c * pt.b + lt.d * pt.d;
      wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
      wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;

      this._worldID++;
    }

    /**
     * Decomposes a matrix and sets the transforms properties based on it.
     *
     * @param {PIXI.Matrix} matrix - The matrix to decompose
     */

  }, {
    key: 'setFromMatrix',
    value: function setFromMatrix(matrix) {
      matrix.decompose(this);
    }

    /**
     * The rotation of the object in radians.
     *
     * @member {number}
     * @memberof PIXI.Transform#
     */

  }, {
    key: 'rotation',
    get: function get() {
      return this._rotation;
    }

    /**
     * Set the rotation of the transform.
     *
     * @param {number} value - The value to set to.
     */
    ,
    set: function set(value) {
      this._rotation = value;
      this._sr = Math.sin(value);
      this._cr = Math.cos(value);
    }
  }]);
  return Transform;
}(TransformBase);

/**
 * 'Builder' pattern for bounds rectangles
 * Axis-Aligned Bounding Box
 * It is not a shape! Its mutable thing, no 'EMPTY' or that kind of problems
 *
 * @class
 * @memberof PIXI
 */

var Bounds = function () {
    /**
     *
     */
    function Bounds() {
        classCallCheck(this, Bounds);

        /**
         * @member {number}
         * @default 0
         */
        this.minX = Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.minY = Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.maxX = -Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.maxY = -Infinity;

        this.rect = null;
    }

    /**
     * Checks if bounds are empty.
     *
     * @return {boolean} True if empty.
     */


    createClass(Bounds, [{
        key: 'isEmpty',
        value: function isEmpty() {
            return this.minX > this.maxX || this.minY > this.maxY;
        }

        /**
         * Clears the bounds and resets.
         *
         */

    }, {
        key: 'clear',
        value: function clear() {
            this.updateID++;

            this.minX = Infinity;
            this.minY = Infinity;
            this.maxX = -Infinity;
            this.maxY = -Infinity;
        }

        /**
         * Can return Rectangle.EMPTY constant, either construct new rectangle, either use your rectangle
         * It is not guaranteed that it will return tempRect
         *
         * @param {PIXI.Rectangle} rect - temporary object will be used if AABB is not empty
         * @returns {PIXI.Rectangle} A rectangle of the bounds
         */

    }, {
        key: 'getRectangle',
        value: function getRectangle(rect) {
            if (this.minX > this.maxX || this.minY > this.maxY) {
                return Rectangle.EMPTY;
            }

            rect = rect || new Rectangle(0, 0, 1, 1);

            rect.x = this.minX;
            rect.y = this.minY;
            rect.width = this.maxX - this.minX;
            rect.height = this.maxY - this.minY;

            return rect;
        }

        /**
         * This function should be inlined when its possible.
         *
         * @param {PIXI.Point} point - The point to add.
         */

    }, {
        key: 'addPoint',
        value: function addPoint(point) {
            this.minX = Math.min(this.minX, point.x);
            this.maxX = Math.max(this.maxX, point.x);
            this.minY = Math.min(this.minY, point.y);
            this.maxY = Math.max(this.maxY, point.y);
        }

        /**
         * Adds a quad, not transformed
         *
         * @param {Float32Array} vertices - The verts to add.
         */

    }, {
        key: 'addQuad',
        value: function addQuad(vertices) {
            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;

            var x = vertices[0];
            var y = vertices[1];

            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;

            x = vertices[2];
            y = vertices[3];
            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;

            x = vertices[4];
            y = vertices[5];
            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;

            x = vertices[6];
            y = vertices[7];
            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;

            this.minX = minX;
            this.minY = minY;
            this.maxX = maxX;
            this.maxY = maxY;
        }

        /**
         * Adds sprite frame, transformed.
         *
         * @param {PIXI.TransformBase} transform - TODO
         * @param {number} x0 - TODO
         * @param {number} y0 - TODO
         * @param {number} x1 - TODO
         * @param {number} y1 - TODO
         */

    }, {
        key: 'addFrame',
        value: function addFrame(transform, x0, y0, x1, y1) {
            var matrix = transform.worldTransform;
            var a = matrix.a;
            var b = matrix.b;
            var c = matrix.c;
            var d = matrix.d;
            var tx = matrix.tx;
            var ty = matrix.ty;

            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;

            var x = a * x0 + c * y0 + tx;
            var y = b * x0 + d * y0 + ty;

            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;

            x = a * x1 + c * y0 + tx;
            y = b * x1 + d * y0 + ty;
            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;

            x = a * x0 + c * y1 + tx;
            y = b * x0 + d * y1 + ty;
            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;

            x = a * x1 + c * y1 + tx;
            y = b * x1 + d * y1 + ty;
            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;

            this.minX = minX;
            this.minY = minY;
            this.maxX = maxX;
            this.maxY = maxY;
        }

        /**
         * Add an array of vertices
         *
         * @param {PIXI.TransformBase} transform - TODO
         * @param {Float32Array} vertices - TODO
         * @param {number} beginOffset - TODO
         * @param {number} endOffset - TODO
         */

    }, {
        key: 'addVertices',
        value: function addVertices(transform, vertices, beginOffset, endOffset) {
            var matrix = transform.worldTransform;
            var a = matrix.a;
            var b = matrix.b;
            var c = matrix.c;
            var d = matrix.d;
            var tx = matrix.tx;
            var ty = matrix.ty;

            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;

            for (var i = beginOffset; i < endOffset; i += 2) {
                var rawX = vertices[i];
                var rawY = vertices[i + 1];
                var x = a * rawX + c * rawY + tx;
                var y = d * rawY + b * rawX + ty;

                minX = x < minX ? x : minX;
                minY = y < minY ? y : minY;
                maxX = x > maxX ? x : maxX;
                maxY = y > maxY ? y : maxY;
            }

            this.minX = minX;
            this.minY = minY;
            this.maxX = maxX;
            this.maxY = maxY;
        }

        /**
         * Adds other Bounds
         *
         * @param {PIXI.Bounds} bounds - TODO
         */

    }, {
        key: 'addBounds',
        value: function addBounds(bounds) {
            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;

            this.minX = bounds.minX < minX ? bounds.minX : minX;
            this.minY = bounds.minY < minY ? bounds.minY : minY;
            this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
            this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
        }

        /**
         * Adds other Bounds, masked with Bounds
         *
         * @param {PIXI.Bounds} bounds - TODO
         * @param {PIXI.Bounds} mask - TODO
         */

    }, {
        key: 'addBoundsMask',
        value: function addBoundsMask(bounds, mask) {
            var _minX = bounds.minX > mask.minX ? bounds.minX : mask.minX;
            var _minY = bounds.minY > mask.minY ? bounds.minY : mask.minY;
            var _maxX = bounds.maxX < mask.maxX ? bounds.maxX : mask.maxX;
            var _maxY = bounds.maxY < mask.maxY ? bounds.maxY : mask.maxY;

            if (_minX <= _maxX && _minY <= _maxY) {
                var minX = this.minX;
                var minY = this.minY;
                var maxX = this.maxX;
                var maxY = this.maxY;

                this.minX = _minX < minX ? _minX : minX;
                this.minY = _minY < minY ? _minY : minY;
                this.maxX = _maxX > maxX ? _maxX : maxX;
                this.maxY = _maxY > maxY ? _maxY : maxY;
            }
        }

        /**
         * Adds other Bounds, masked with Rectangle
         *
         * @param {PIXI.Bounds} bounds - TODO
         * @param {PIXI.Rectangle} area - TODO
         */

    }, {
        key: 'addBoundsArea',
        value: function addBoundsArea(bounds, area) {
            var _minX = bounds.minX > area.x ? bounds.minX : area.x;
            var _minY = bounds.minY > area.y ? bounds.minY : area.y;
            var _maxX = bounds.maxX < area.x + area.width ? bounds.maxX : area.x + area.width;
            var _maxY = bounds.maxY < area.y + area.height ? bounds.maxY : area.y + area.height;

            if (_minX <= _maxX && _minY <= _maxY) {
                var minX = this.minX;
                var minY = this.minY;
                var maxX = this.maxX;
                var maxY = this.maxY;

                this.minX = _minX < minX ? _minX : minX;
                this.minY = _minY < minY ? _minY : minY;
                this.maxX = _maxX > maxX ? _maxX : maxX;
                this.maxY = _maxY > maxY ? _maxY : maxY;
            }
        }
    }]);
    return Bounds;
}();

// _tempDisplayObjectParent = new DisplayObject();

/**
 * The base class for all objects that are rendered on the screen.
 * This is an abstract class and should not be used on its own rather it should be extended.
 *
 * @class
 * @extends EventEmitter
 * @mixes PIXI.interaction.interactiveTarget
 * @memberof PIXI
 */

var DisplayObject = function (_EventEmitter) {
    inherits(DisplayObject, _EventEmitter);

    /**
     *
     */
    function DisplayObject() {
        classCallCheck(this, DisplayObject);

        var _this = possibleConstructorReturn(this, (DisplayObject.__proto__ || Object.getPrototypeOf(DisplayObject)).call(this));

        var TransformClass = settings.TRANSFORM_MODE === TRANSFORM_MODE.STATIC ? TransformStatic : Transform;

        _this.tempDisplayObjectParent = null;

        // TODO: need to create Transform from factory
        /**
         * World transform and local transform of this object.
         * This will become read-only later, please do not assign anything there unless you know what are you doing
         *
         * @member {PIXI.TransformBase}
         */
        _this.transform = new TransformClass();

        /**
         * The opacity of the object.
         *
         * @member {number}
         */
        _this.alpha = 1;

        /**
         * The visibility of the object. If false the object will not be drawn, and
         * the updateTransform function will not be called.
         *
         * Only affects recursive calls from parent. You can ask for bounds or call updateTransform manually
         *
         * @member {boolean}
         */
        _this.visible = true;

        /**
         * Can this object be rendered, if false the object will not be drawn but the updateTransform
         * methods will still be called.
         *
         * Only affects recursive calls from parent. You can ask for bounds manually
         *
         * @member {boolean}
         */
        _this.renderable = true;

        /**
         * The display object container that contains this display object.
         *
         * @member {PIXI.Container}
         * @readonly
         */
        _this.parent = null;

        /**
         * The multiplied alpha of the displayObject
         *
         * @member {number}
         * @readonly
         */
        _this.worldAlpha = 1;

        /**
         * The area the filter is applied to. This is used as more of an optimisation
         * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle
         *
         * Also works as an interaction mask
         *
         * @member {PIXI.Rectangle}
         */
        _this.filterArea = null;

        _this._filters = null;
        _this._enabledFilters = null;

        /**
         * The bounds object, this is used to calculate and store the bounds of the displayObject
         *
         * @member {PIXI.Rectangle}
         * @private
         */
        _this._bounds = new Bounds();
        _this._boundsID = 0;
        _this._lastBoundsID = -1;
        _this._boundsRect = null;
        _this._localBoundsRect = null;

        /**
         * The original, cached mask of the object
         *
         * @member {PIXI.Rectangle}
         * @private
         */
        _this._mask = null;
        return _this;
    }

    /**
     * @private
     * @member {PIXI.DisplayObject}
     */


    createClass(DisplayObject, [{
        key: 'updateTransform',


        /**
         * Updates the object transform for rendering
         *
         * TODO - Optimization pass!
         */
        value: function updateTransform() {
            this.transform.updateTransform(this.parent.transform);
            // multiply the alphas..
            this.worldAlpha = this.alpha * this.parent.worldAlpha;

            this._bounds.updateID++;
        }

        /**
         * recursively updates transform of all objects from the root to this one
         * internal function for toLocal()
         */

    }, {
        key: '_recursivePostUpdateTransform',
        value: function _recursivePostUpdateTransform() {
            if (this.parent) {
                this.parent._recursivePostUpdateTransform();
                this.transform.updateTransform(this.parent.transform);
            } else {
                this.transform.updateTransform(this._tempDisplayObjectParent.transform);
            }
        }

        /**
         * Retrieves the bounds of the displayObject as a rectangle object.
         *
         * @param {boolean} skipUpdate - setting to true will stop the transforms of the scene graph from
         *  being updated. This means the calculation returned MAY be out of date BUT will give you a
         *  nice performance boost
         * @param {PIXI.Rectangle} rect - Optional rectangle to store the result of the bounds calculation
         * @return {PIXI.Rectangle} the rectangular bounding area
         */

    }, {
        key: 'getBounds',
        value: function getBounds(skipUpdate, rect) {
            if (!skipUpdate) {
                if (!this.parent) {
                    this.parent = this._tempDisplayObjectParent;
                    this.updateTransform();
                    this.parent = null;
                } else {
                    this._recursivePostUpdateTransform();
                    this.updateTransform();
                }
            }

            if (this._boundsID !== this._lastBoundsID) {
                this.calculateBounds();
            }

            if (!rect) {
                if (!this._boundsRect) {
                    this._boundsRect = new Rectangle();
                }

                rect = this._boundsRect;
            }

            return this._bounds.getRectangle(rect);
        }

        /**
         * Retrieves the local bounds of the displayObject as a rectangle object
         *
         * @param {PIXI.Rectangle} [rect] - Optional rectangle to store the result of the bounds calculation
         * @return {PIXI.Rectangle} the rectangular bounding area
         */

    }, {
        key: 'getLocalBounds',
        value: function getLocalBounds(rect) {
            var transformRef = this.transform;
            var parentRef = this.parent;

            this.parent = null;
            this.transform = this._tempDisplayObjectParent.transform;

            if (!rect) {
                if (!this._localBoundsRect) {
                    this._localBoundsRect = new Rectangle();
                }

                rect = this._localBoundsRect;
            }

            var bounds = this.getBounds(false, rect);

            this.parent = parentRef;
            this.transform = transformRef;

            return bounds;
        }

        /**
         * Calculates the global position of the display object
         *
         * @param {PIXI.Point} position - The world origin to calculate from
         * @param {PIXI.Point} [point] - A Point object in which to store the value, optional
         *  (otherwise will create a new Point)
         * @param {boolean} [skipUpdate=false] - Should we skip the update transform.
         * @return {PIXI.Point} A point object representing the position of this object
         */

    }, {
        key: 'toGlobal',
        value: function toGlobal(position, point) {
            var skipUpdate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (!skipUpdate) {
                this._recursivePostUpdateTransform();

                // this parent check is for just in case the item is a root object.
                // If it is we need to give it a temporary parent so that displayObjectUpdateTransform works correctly
                // this is mainly to avoid a parent check in the main loop. Every little helps for performance :)
                if (!this.parent) {
                    this.parent = this._tempDisplayObjectParent;
                    this.displayObjectUpdateTransform();
                    this.parent = null;
                } else {
                    this.displayObjectUpdateTransform();
                }
            }

            // don't need to update the lot
            return this.worldTransform.apply(position, point);
        }

        /**
         * Calculates the local position of the display object relative to another point
         *
         * @param {PIXI.Point} position - The world origin to calculate from
         * @param {PIXI.DisplayObject} [from] - The DisplayObject to calculate the global position from
         * @param {PIXI.Point} [point] - A Point object in which to store the value, optional
         *  (otherwise will create a new Point)
         * @param {boolean} [skipUpdate=false] - Should we skip the update transform
         * @return {PIXI.Point} A point object representing the position of this object
         */

    }, {
        key: 'toLocal',
        value: function toLocal(position, from, point, skipUpdate) {
            if (from) {
                position = from.toGlobal(position, point, skipUpdate);
            }

            if (!skipUpdate) {
                this._recursivePostUpdateTransform();

                // this parent check is for just in case the item is a root object.
                // If it is we need to give it a temporary parent so that displayObjectUpdateTransform works correctly
                // this is mainly to avoid a parent check in the main loop. Every little helps for performance :)
                if (!this.parent) {
                    this.parent = this._tempDisplayObjectParent;
                    this.displayObjectUpdateTransform();
                    this.parent = null;
                } else {
                    this.displayObjectUpdateTransform();
                }
            }

            // simply apply the matrix..
            return this.worldTransform.applyInverse(position, point);
        }

        /**
         * Renders the object using the WebGL renderer
         *
         * @param {PIXI.WebGLRenderer} renderer - The renderer
         */

    }, {
        key: 'renderWebGL',
        value: function renderWebGL(renderer) // eslint-disable-line no-unused-vars
        {}
        // OVERWRITE;


        /**
         * Renders the object using the Canvas renderer
         *
         * @param {PIXI.CanvasRenderer} renderer - The renderer
         */

    }, {
        key: 'renderCanvas',
        value: function renderCanvas(renderer) // eslint-disable-line no-unused-vars
        {}
        // OVERWRITE;


        /**
         * Set the parent Container of this DisplayObject
         *
         * @param {PIXI.Container} container - The Container to add this DisplayObject to
         * @return {PIXI.Container} The Container that this DisplayObject was added to
         */

    }, {
        key: 'setParent',
        value: function setParent(container) {
            if (!container || !container.addChild) {
                throw new Error('setParent: Argument must be a Container');
            }

            container.addChild(this);

            return container;
        }

        /**
         * Convenience function to set the position, scale, skew and pivot at once.
         *
         * @param {number} [x=0] - The X position
         * @param {number} [y=0] - The Y position
         * @param {number} [scaleX=1] - The X scale value
         * @param {number} [scaleY=1] - The Y scale value
         * @param {number} [rotation=0] - The rotation
         * @param {number} [skewX=0] - The X skew value
         * @param {number} [skewY=0] - The Y skew value
         * @param {number} [pivotX=0] - The X pivot value
         * @param {number} [pivotY=0] - The Y pivot value
         * @return {PIXI.DisplayObject} The DisplayObject instance
         */

    }, {
        key: 'setTransform',
        value: function setTransform() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var scaleX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
            var scaleY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
            var rotation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var skewX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
            var skewY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
            var pivotX = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
            var pivotY = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;

            this.position.x = x;
            this.position.y = y;
            this.scale.x = !scaleX ? 1 : scaleX;
            this.scale.y = !scaleY ? 1 : scaleY;
            this.rotation = rotation;
            this.skew.x = skewX;
            this.skew.y = skewY;
            this.pivot.x = pivotX;
            this.pivot.y = pivotY;

            return this;
        }

        /**
         * Base destroy method for generic display objects. This will automatically
         * remove the display object from its parent Container as well as remove
         * all current event listeners and internal references. Do not use a DisplayObject
         * after calling `destroy`.
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.removeAllListeners();
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.transform = null;

            this.parent = null;

            this._bounds = null;
            this._currentBounds = null;
            this._mask = null;

            this.filterArea = null;

            this.interactive = false;
            this.interactiveChildren = false;
        }

        /**
         * The position of the displayObject on the x axis relative to the local coordinates of the parent.
         * An alias to position.x
         *
         * @member {number}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: '_tempDisplayObjectParent',
        get: function get() {
            if (this.tempDisplayObjectParent === null) {
                this.tempDisplayObjectParent = new DisplayObject();
            }

            return this.tempDisplayObjectParent;
        }
    }, {
        key: 'x',
        get: function get() {
            return this.position.x;
        }

        /**
         * Sets the X position of the object.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.position.x = value;
        }

        /**
         * The position of the displayObject on the y axis relative to the local coordinates of the parent.
         * An alias to position.y
         *
         * @member {number}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'y',
        get: function get() {
            return this.position.y;
        }

        /**
         * Sets the Y position of the object.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.position.y = value;
        }

        /**
         * Current transform of the object based on world (parent) factors
         *
         * @member {PIXI.Matrix}
         * @memberof PIXI.DisplayObject#
         * @readonly
         */

    }, {
        key: 'worldTransform',
        get: function get() {
            return this.transform.worldTransform;
        }

        /**
         * Current transform of the object based on local factors: position, scale, other stuff
         *
         * @member {PIXI.Matrix}
         * @memberof PIXI.DisplayObject#
         * @readonly
         */

    }, {
        key: 'localTransform',
        get: function get() {
            return this.transform.localTransform;
        }

        /**
         * The coordinate of the object relative to the local coordinates of the parent.
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.Point|PIXI.ObservablePoint}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'position',
        get: function get() {
            return this.transform.position;
        }

        /**
         * Copies the point to the position of the object.
         *
         * @param {PIXI.Point} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.position.copy(value);
        }

        /**
         * The scale factor of the object.
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.Point|PIXI.ObservablePoint}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'scale',
        get: function get() {
            return this.transform.scale;
        }

        /**
         * Copies the point to the scale of the object.
         *
         * @param {PIXI.Point} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.scale.copy(value);
        }

        /**
         * The pivot point of the displayObject that it rotates around
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.Point|PIXI.ObservablePoint}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'pivot',
        get: function get() {
            return this.transform.pivot;
        }

        /**
         * Copies the point to the pivot of the object.
         *
         * @param {PIXI.Point} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.pivot.copy(value);
        }

        /**
         * The skew factor for the object in radians.
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.ObservablePoint}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'skew',
        get: function get() {
            return this.transform.skew;
        }

        /**
         * Copies the point to the skew of the object.
         *
         * @param {PIXI.Point} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.skew.copy(value);
        }

        /**
         * The rotation of the object in radians.
         *
         * @member {number}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'rotation',
        get: function get() {
            return this.transform.rotation;
        }

        /**
         * Sets the rotation of the object.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.rotation = value;
        }

        /**
         * Indicates if the object is globally visible.
         *
         * @member {boolean}
         * @memberof PIXI.DisplayObject#
         * @readonly
         */

    }, {
        key: 'worldVisible',
        get: function get() {
            var item = this;

            do {
                if (!item.visible) {
                    return false;
                }

                item = item.parent;
            } while (item);

            return true;
        }

        /**
         * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
         * object to the shape of the mask applied to it. In PIXI a regular mask must be a
         * PIXI.Graphics or a PIXI.Sprite object. This allows for much faster masking in canvas as it
         * utilises shape clipping. To remove a mask, set this property to null.
         *
         * @todo For the moment, PIXI.CanvasRenderer doesn't support PIXI.Sprite as mask.
         *
         * @member {PIXI.Graphics|PIXI.Sprite}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'mask',
        get: function get() {
            return this._mask;
        }

        /**
         * Sets the mask.
         *
         * @param {PIXI.Graphics|PIXI.Sprite} value - The value to set to.
         */
        ,
        set: function set(value) {
            if (this._mask) {
                this._mask.renderable = true;
            }

            this._mask = value;

            if (this._mask) {
                this._mask.renderable = false;
            }
        }

        /**
         * Sets the filters for the displayObject.
         * * IMPORTANT: This is a webGL only feature and will be ignored by the canvas renderer.
         * To remove filters simply set this property to 'null'
         *
         * @member {PIXI.Filter[]}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'filters',
        get: function get() {
            return this._filters && this._filters.slice();
        }

        /**
         * Shallow copies the array to the filters of the object.
         *
         * @param {PIXI.Filter[]} value - The filters to set.
         */
        ,
        set: function set(value) {
            this._filters = value && value.slice();
        }
    }]);
    return DisplayObject;
}(index$2);

DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;

/**
 * A Container represents a collection of display objects.
 * It is the base class of all display objects that act as a container for other objects.
 *
 *```js
 * let container = new PIXI.Container();
 * container.addChild(sprite);
 * ```
 *
 * @class
 * @extends PIXI.DisplayObject
 * @memberof PIXI
 */

var Container = function (_DisplayObject) {
    inherits(Container, _DisplayObject);

    /**
     *
     */
    function Container() {
        classCallCheck(this, Container);

        /**
         * The array of children of this container.
         *
         * @member {PIXI.DisplayObject[]}
         * @readonly
         */
        var _this = possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this));

        _this.children = [];
        return _this;
    }

    /**
     * Overridable method that can be used by Container subclasses whenever the children array is modified
     *
     * @private
     */


    createClass(Container, [{
        key: 'onChildrenChange',
        value: function onChildrenChange() {}
        /* empty */


        /**
         * Adds one or more children to the container.
         *
         * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
         *
         * @param {...PIXI.DisplayObject} child - The DisplayObject(s) to add to the container
         * @return {PIXI.DisplayObject} The first child that was added.
         */

    }, {
        key: 'addChild',
        value: function addChild(child) {
            var argumentsLength = arguments.length;

            // if there is only one argument we can bypass looping through the them
            if (argumentsLength > 1) {
                // loop through the arguments property and add all children
                // use it the right way (.length and [i]) so that this function can still be optimised by JS runtimes
                for (var i = 0; i < argumentsLength; i++) {
                    this.addChild(arguments[i]);
                }
            } else {
                // if the child has a parent then lets remove it as Pixi objects can only exist in one place
                if (child.parent) {
                    child.parent.removeChild(child);
                }

                child.parent = this;

                // ensure a transform will be recalculated..
                this.transform._parentID = -1;
                this._boundsID++;

                this.children.push(child);

                // TODO - lets either do all callbacks or all events.. not both!
                this.onChildrenChange(this.children.length - 1);
                child.emit('added', this);
            }

            return child;
        }

        /**
         * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
         *
         * @param {PIXI.DisplayObject} child - The child to add
         * @param {number} index - The index to place the child in
         * @return {PIXI.DisplayObject} The child that was added.
         */

    }, {
        key: 'addChildAt',
        value: function addChildAt(child, index) {
            if (index < 0 || index > this.children.length) {
                throw new Error(child + 'addChildAt: The index ' + index + ' supplied is out of bounds ' + this.children.length);
            }

            if (child.parent) {
                child.parent.removeChild(child);
            }

            child.parent = this;

            this.children.splice(index, 0, child);

            // TODO - lets either do all callbacks or all events.. not both!
            this.onChildrenChange(index);
            child.emit('added', this);

            return child;
        }

        /**
         * Swaps the position of 2 Display Objects within this container.
         *
         * @param {PIXI.DisplayObject} child - First display object to swap
         * @param {PIXI.DisplayObject} child2 - Second display object to swap
         */

    }, {
        key: 'swapChildren',
        value: function swapChildren(child, child2) {
            if (child === child2) {
                return;
            }

            var index1 = this.getChildIndex(child);
            var index2 = this.getChildIndex(child2);

            this.children[index1] = child2;
            this.children[index2] = child;
            this.onChildrenChange(index1 < index2 ? index1 : index2);
        }

        /**
         * Returns the index position of a child DisplayObject instance
         *
         * @param {PIXI.DisplayObject} child - The DisplayObject instance to identify
         * @return {number} The index position of the child display object to identify
         */

    }, {
        key: 'getChildIndex',
        value: function getChildIndex(child) {
            var index = this.children.indexOf(child);

            if (index === -1) {
                throw new Error('The supplied DisplayObject must be a child of the caller');
            }

            return index;
        }

        /**
         * Changes the position of an existing child in the display object container
         *
         * @param {PIXI.DisplayObject} child - The child DisplayObject instance for which you want to change the index number
         * @param {number} index - The resulting index number for the child display object
         */

    }, {
        key: 'setChildIndex',
        value: function setChildIndex(child, index) {
            if (index < 0 || index >= this.children.length) {
                throw new Error('The supplied index is out of bounds');
            }

            var currentIndex = this.getChildIndex(child);

            removeItems(this.children, currentIndex, 1); // remove from old position
            this.children.splice(index, 0, child); // add at new position
            this.onChildrenChange(index);
        }

        /**
         * Returns the child at the specified index
         *
         * @param {number} index - The index to get the child at
         * @return {PIXI.DisplayObject} The child at the given index, if any.
         */

    }, {
        key: 'getChildAt',
        value: function getChildAt(index) {
            if (index < 0 || index >= this.children.length) {
                throw new Error('getChildAt: Index (' + index + ') does not exist.');
            }

            return this.children[index];
        }

        /**
         * Removes one or more children from the container.
         *
         * @param {...PIXI.DisplayObject} child - The DisplayObject(s) to remove
         * @return {PIXI.DisplayObject} The first child that was removed.
         */

    }, {
        key: 'removeChild',
        value: function removeChild(child) {
            var argumentsLength = arguments.length;

            // if there is only one argument we can bypass looping through the them
            if (argumentsLength > 1) {
                // loop through the arguments property and add all children
                // use it the right way (.length and [i]) so that this function can still be optimised by JS runtimes
                for (var i = 0; i < argumentsLength; i++) {
                    this.removeChild(arguments[i]);
                }
            } else {
                var index = this.children.indexOf(child);

                if (index === -1) return null;

                child.parent = null;
                removeItems(this.children, index, 1);

                // ensure a transform will be recalculated..
                this.transform._parentID = -1;
                this._boundsID++;

                // TODO - lets either do all callbacks or all events.. not both!
                this.onChildrenChange(index);
                child.emit('removed', this);
            }

            return child;
        }

        /**
         * Removes a child from the specified index position.
         *
         * @param {number} index - The index to get the child from
         * @return {PIXI.DisplayObject} The child that was removed.
         */

    }, {
        key: 'removeChildAt',
        value: function removeChildAt(index) {
            var child = this.getChildAt(index);

            child.parent = null;
            removeItems(this.children, index, 1);

            // TODO - lets either do all callbacks or all events.. not both!
            this.onChildrenChange(index);
            child.emit('removed', this);

            return child;
        }

        /**
         * Removes all children from this container that are within the begin and end indexes.
         *
         * @param {number} [beginIndex=0] - The beginning position.
         * @param {number} [endIndex=this.children.length] - The ending position. Default value is size of the container.
         * @returns {DisplayObject[]} List of removed children
         */

    }, {
        key: 'removeChildren',
        value: function removeChildren() {
            var beginIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var endIndex = arguments[1];

            var begin = beginIndex;
            var end = typeof endIndex === 'number' ? endIndex : this.children.length;
            var range = end - begin;
            var removed = void 0;

            if (range > 0 && range <= end) {
                removed = this.children.splice(begin, range);

                for (var i = 0; i < removed.length; ++i) {
                    removed[i].parent = null;
                }

                this.onChildrenChange(beginIndex);

                for (var _i = 0; _i < removed.length; ++_i) {
                    removed[_i].emit('removed', this);
                }

                return removed;
            } else if (range === 0 && this.children.length === 0) {
                return [];
            }

            throw new RangeError('removeChildren: numeric values are outside the acceptable range.');
        }

        /**
         * Updates the transform on all children of this container for rendering
         *
         * @private
         */

    }, {
        key: 'updateTransform',
        value: function updateTransform() {
            this._boundsID++;

            this.transform.updateTransform(this.parent.transform);

            // TODO: check render flags, how to process stuff here
            this.worldAlpha = this.alpha * this.parent.worldAlpha;

            for (var i = 0, j = this.children.length; i < j; ++i) {
                var child = this.children[i];

                if (child.visible) {
                    child.updateTransform();
                }
            }
        }

        /**
         * Recalculates the bounds of the container.
         *
         */

    }, {
        key: 'calculateBounds',
        value: function calculateBounds() {
            this._bounds.clear();

            this._calculateBounds();

            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];

                if (!child.visible || !child.renderable) {
                    continue;
                }

                child.calculateBounds();

                // TODO: filter+mask, need to mask both somehow
                if (child._mask) {
                    child._mask.calculateBounds();
                    this._bounds.addBoundsMask(child._bounds, child._mask._bounds);
                } else if (child.filterArea) {
                    this._bounds.addBoundsArea(child._bounds, child.filterArea);
                } else {
                    this._bounds.addBounds(child._bounds);
                }
            }

            this._lastBoundsID = this._boundsID;
        }

        /**
         * Recalculates the bounds of the object. Override this to
         * calculate the bounds of the specific object (not including children).
         *
         */

    }, {
        key: '_calculateBounds',
        value: function _calculateBounds() {}
        // FILL IN//


        /**
         * Renders the object using the WebGL renderer
         *
         * @param {PIXI.WebGLRenderer} renderer - The renderer
         */

    }, {
        key: 'renderWebGL',
        value: function renderWebGL(renderer) {
            // if the object is not visible or the alpha is 0 then no need to render this element
            if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
                return;
            }

            // do a quick check to see if this element has a mask or a filter.
            if (this._mask || this._filters) {
                this.renderAdvancedWebGL(renderer);
            } else {
                this._renderWebGL(renderer);

                // simple render children!
                for (var i = 0, j = this.children.length; i < j; ++i) {
                    this.children[i].renderWebGL(renderer);
                }
            }
        }

        /**
         * Render the object using the WebGL renderer and advanced features.
         *
         * @private
         * @param {PIXI.WebGLRenderer} renderer - The renderer
         */

    }, {
        key: 'renderAdvancedWebGL',
        value: function renderAdvancedWebGL(renderer) {
            renderer.flush();

            var filters = this._filters;
            var mask = this._mask;

            // push filter first as we need to ensure the stencil buffer is correct for any masking
            if (filters) {
                if (!this._enabledFilters) {
                    this._enabledFilters = [];
                }

                this._enabledFilters.length = 0;

                for (var i = 0; i < filters.length; i++) {
                    if (filters[i].enabled) {
                        this._enabledFilters.push(filters[i]);
                    }
                }

                if (this._enabledFilters.length) {
                    renderer.filterManager.pushFilter(this, this._enabledFilters);
                }
            }

            if (mask) {
                renderer.maskManager.pushMask(this, this._mask);
            }

            // add this object to the batch, only rendered if it has a texture.
            this._renderWebGL(renderer);

            // now loop through the children and make sure they get rendered
            for (var _i2 = 0, j = this.children.length; _i2 < j; _i2++) {
                this.children[_i2].renderWebGL(renderer);
            }

            renderer.flush();

            if (mask) {
                renderer.maskManager.popMask(this, this._mask);
            }

            if (filters && this._enabledFilters && this._enabledFilters.length) {
                renderer.filterManager.popFilter();
            }
        }

        /**
         * To be overridden by the subclasses.
         *
         * @private
         * @param {PIXI.WebGLRenderer} renderer - The renderer
         */

    }, {
        key: '_renderWebGL',
        value: function _renderWebGL(renderer) // eslint-disable-line no-unused-vars
        {}
        // this is where content itself gets rendered...


        /**
         * To be overridden by the subclass
         *
         * @private
         * @param {PIXI.CanvasRenderer} renderer - The renderer
         */

    }, {
        key: '_renderCanvas',
        value: function _renderCanvas(renderer) // eslint-disable-line no-unused-vars
        {}
        // this is where content itself gets rendered...


        /**
         * Renders the object using the Canvas renderer
         *
         * @param {PIXI.CanvasRenderer} renderer - The renderer
         */

    }, {
        key: 'renderCanvas',
        value: function renderCanvas(renderer) {
            // if not visible or the alpha is 0 then no need to render this
            if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
                return;
            }

            if (this._mask) {
                renderer.maskManager.pushMask(this._mask);
            }

            this._renderCanvas(renderer);
            for (var i = 0, j = this.children.length; i < j; ++i) {
                this.children[i].renderCanvas(renderer);
            }

            if (this._mask) {
                renderer.maskManager.popMask(renderer);
            }
        }

        /**
         * Removes all internal references and listeners as well as removes children from the display list.
         * Do not use a Container after calling `destroy`.
         *
         * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
         *  have been set to that value
         * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
         *  method called as well. 'options' will be passed on to those calls.
         */

    }, {
        key: 'destroy',
        value: function destroy(options) {
            get$1(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'destroy', this).call(this);

            var destroyChildren = typeof options === 'boolean' ? options : options && options.children;

            var oldChildren = this.removeChildren(0, this.children.length);

            if (destroyChildren) {
                for (var i = 0; i < oldChildren.length; ++i) {
                    oldChildren[i].destroy(options);
                }
            }
        }

        /**
         * The width of the Container, setting this will actually modify the scale to achieve the value set
         *
         * @member {number}
         * @memberof PIXI.Container#
         */

    }, {
        key: 'width',
        get: function get() {
            return this.scale.x * this.getLocalBounds().width;
        }

        /**
         * Sets the width of the container by modifying the scale.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            var width = this.getLocalBounds().width;

            if (width !== 0) {
                this.scale.x = value / width;
            } else {
                this.scale.x = 1;
            }

            this._width = value;
        }

        /**
         * The height of the Container, setting this will actually modify the scale to achieve the value set
         *
         * @member {number}
         * @memberof PIXI.Container#
         */

    }, {
        key: 'height',
        get: function get() {
            return this.scale.y * this.getLocalBounds().height;
        }

        /**
         * Sets the height of the container by modifying the scale.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            var height = this.getLocalBounds().height;

            if (height !== 0) {
                this.scale.y = value / height;
            } else {
                this.scale.y = 1;
            }

            this._height = value;
        }
    }]);
    return Container;
}(DisplayObject);

Container.prototype.containerUpdateTransform = Container.prototype.updateTransform;

var tempAnchor = void 0;

/**
 * Sets the `crossOrigin` property for this resource based on if the url
 * for this resource is cross-origin. If crossOrigin was manually set, this
 * function does nothing.
 * Nipped from the resource loader!
 *
 * @ignore
 * @param {string} url - The url to test.
 * @param {object} [loc=window.location] - The location object to test against.
 * @return {string} The crossOrigin value to use (or empty string for none).
 */
function determineCrossOrigin(url) {
    var loc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location;

    // data: and javascript: urls are considered same-origin
    if (url.indexOf('data:') === 0) {
        return '';
    }

    // default is window.location
    loc = loc || window.location;

    if (!tempAnchor) {
        tempAnchor = document.createElement('a');
    }

    // let the browser determine the full href for the url of this resource and then
    // parse with the node url lib, we can't use the properties of the anchor element
    // because they don't work in IE9 :(
    tempAnchor.href = url;
    url = _url.parse(tempAnchor.href);

    var samePort = !url.port && loc.port === '' || url.port === loc.port;

    // if cross origin
    if (url.hostname !== loc.hostname || !samePort || url.protocol !== loc.protocol) {
        return 'anonymous';
    }

    return '';
}

/**
 * Bit twiddling hacks for JavaScript.
 *
 * Author: Mikola Lysenko
 *
 * Ported from Stanford bit twiddling hack library:
 *    http://graphics.stanford.edu/~seander/bithacks.html
 */

//Number of bits in an integer
var INT_BITS = 32;

//Constants
var INT_BITS_1 = INT_BITS;
var INT_MAX = 0x7fffffff;
var INT_MIN = -1<<(INT_BITS-1);

//Returns -1, 0, +1 depending on sign of x
var sign$1 = function(v) {
  return (v > 0) - (v < 0);
};

//Computes absolute value of integer
var abs = function(v) {
  var mask = v >> (INT_BITS-1);
  return (v ^ mask) - mask;
};

//Computes minimum of integers x and y
var min = function(x, y) {
  return y ^ ((x ^ y) & -(x < y));
};

//Computes maximum of integers x and y
var max = function(x, y) {
  return x ^ ((x ^ y) & -(x < y));
};

//Checks if a number is a power of two
var isPow2 = function(v) {
  return !(v & (v-1)) && (!!v);
};

//Computes log base 2 of v
var log2 = function(v) {
  var r, shift;
  r =     (v > 0xFFFF) << 4; v >>>= r;
  shift = (v > 0xFF  ) << 3; v >>>= shift; r |= shift;
  shift = (v > 0xF   ) << 2; v >>>= shift; r |= shift;
  shift = (v > 0x3   ) << 1; v >>>= shift; r |= shift;
  return r | (v >> 1);
};

//Computes log base 10 of v
var log10 = function(v) {
  return  (v >= 1000000000) ? 9 : (v >= 100000000) ? 8 : (v >= 10000000) ? 7 :
          (v >= 1000000) ? 6 : (v >= 100000) ? 5 : (v >= 10000) ? 4 :
          (v >= 1000) ? 3 : (v >= 100) ? 2 : (v >= 10) ? 1 : 0;
};

//Counts number of bits
var popCount = function(v) {
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
};

//Counts number of trailing zeros
function countTrailingZeros(v) {
  var c = 32;
  v &= -v;
  if (v) c--;
  if (v & 0x0000FFFF) c -= 16;
  if (v & 0x00FF00FF) c -= 8;
  if (v & 0x0F0F0F0F) c -= 4;
  if (v & 0x33333333) c -= 2;
  if (v & 0x55555555) c -= 1;
  return c;
}
var countTrailingZeros_1 = countTrailingZeros;

//Rounds to next power of 2
var nextPow2 = function(v) {
  v += v === 0;
  --v;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v + 1;
};

//Rounds down to previous power of 2
var prevPow2 = function(v) {
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v - (v>>>1);
};

//Computes parity of word
var parity = function(v) {
  v ^= v >>> 16;
  v ^= v >>> 8;
  v ^= v >>> 4;
  v &= 0xf;
  return (0x6996 >>> v) & 1;
};

var REVERSE_TABLE = new Array(256);

(function(tab) {
  for(var i=0; i<256; ++i) {
    var v = i, r = i, s = 7;
    for (v >>>= 1; v; v >>>= 1) {
      r <<= 1;
      r |= v & 1;
      --s;
    }
    tab[i] = (r << s) & 0xff;
  }
})(REVERSE_TABLE);

//Reverse bits in a 32 bit word
var reverse = function(v) {
  return  (REVERSE_TABLE[ v         & 0xff] << 24) |
          (REVERSE_TABLE[(v >>> 8)  & 0xff] << 16) |
          (REVERSE_TABLE[(v >>> 16) & 0xff] << 8)  |
           REVERSE_TABLE[(v >>> 24) & 0xff];
};

//Interleave bits of 2 coordinates with 16 bits.  Useful for fast quadtree codes
var interleave2 = function(x, y) {
  x &= 0xFFFF;
  x = (x | (x << 8)) & 0x00FF00FF;
  x = (x | (x << 4)) & 0x0F0F0F0F;
  x = (x | (x << 2)) & 0x33333333;
  x = (x | (x << 1)) & 0x55555555;

  y &= 0xFFFF;
  y = (y | (y << 8)) & 0x00FF00FF;
  y = (y | (y << 4)) & 0x0F0F0F0F;
  y = (y | (y << 2)) & 0x33333333;
  y = (y | (y << 1)) & 0x55555555;

  return x | (y << 1);
};

//Extracts the nth interleaved component
var deinterleave2 = function(v, n) {
  v = (v >>> n) & 0x55555555;
  v = (v | (v >>> 1))  & 0x33333333;
  v = (v | (v >>> 2))  & 0x0F0F0F0F;
  v = (v | (v >>> 4))  & 0x00FF00FF;
  v = (v | (v >>> 16)) & 0x000FFFF;
  return (v << 16) >> 16;
};


//Interleave bits of 3 coordinates, each with 10 bits.  Useful for fast octree codes
var interleave3 = function(x, y, z) {
  x &= 0x3FF;
  x  = (x | (x<<16)) & 4278190335;
  x  = (x | (x<<8))  & 251719695;
  x  = (x | (x<<4))  & 3272356035;
  x  = (x | (x<<2))  & 1227133513;

  y &= 0x3FF;
  y  = (y | (y<<16)) & 4278190335;
  y  = (y | (y<<8))  & 251719695;
  y  = (y | (y<<4))  & 3272356035;
  y  = (y | (y<<2))  & 1227133513;
  x |= (y << 1);
  
  z &= 0x3FF;
  z  = (z | (z<<16)) & 4278190335;
  z  = (z | (z<<8))  & 251719695;
  z  = (z | (z<<4))  & 3272356035;
  z  = (z | (z<<2))  & 1227133513;
  
  return x | (z << 2);
};

//Extracts nth interleaved component of a 3-tuple
var deinterleave3 = function(v, n) {
  v = (v >>> n)       & 1227133513;
  v = (v | (v>>>2))   & 3272356035;
  v = (v | (v>>>4))   & 251719695;
  v = (v | (v>>>8))   & 4278190335;
  v = (v | (v>>>16))  & 0x3FF;
  return (v<<22)>>22;
};

//Computes next combination in colexicographic order (this is mistakenly called nextPermutation on the bit twiddling hacks page)
var nextCombination = function(v) {
  var t = v | (v - 1);
  return (t + 1) | (((~t & -~t) - 1) >>> (countTrailingZeros(v) + 1));
};

var twiddle = {
	INT_BITS: INT_BITS_1,
	INT_MAX: INT_MAX,
	INT_MIN: INT_MIN,
	sign: sign$1,
	abs: abs,
	min: min,
	max: max,
	isPow2: isPow2,
	log2: log2,
	log10: log10,
	popCount: popCount,
	countTrailingZeros: countTrailingZeros_1,
	nextPow2: nextPow2,
	prevPow2: prevPow2,
	parity: parity,
	reverse: reverse,
	interleave2: interleave2,
	deinterleave2: deinterleave2,
	interleave3: interleave3,
	deinterleave3: deinterleave3,
	nextCombination: nextCombination
};

var RESOLUTION$2 = settings.RESOLUTION;
var MIPMAP_TEXTURES = settings.MIPMAP_TEXTURES;
var SCALE_MODE$1 = settings.SCALE_MODE;
var WRAP_MODE = settings.WRAP_MODE;

/**
 * A texture stores the information that represents an image. All textures have a base texture.
 *
 * @class
 * @extends EventEmitter
 * @memberof PIXI
 */

var BaseTexture = function (_EventEmitter) {
    inherits(BaseTexture, _EventEmitter);

    /**
     * @param {HTMLImageElement|HTMLCanvasElement} [source] - the source object of the texture.
     * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
     * @param {number} [resolution=1] - The resolution / device pixel ratio of the texture
     */
    function BaseTexture(source, scaleMode, resolution) {
        classCallCheck(this, BaseTexture);

        var _this = possibleConstructorReturn(this, (BaseTexture.__proto__ || Object.getPrototypeOf(BaseTexture)).call(this));

        _this.uid = uid();

        _this.touched = 0;

        /**
         * The resolution / device pixel ratio of the texture
         *
         * @member {number}
         * @default 1
         */
        _this.resolution = resolution || RESOLUTION$2;

        /**
         * The width of the base texture set when the image has loaded
         *
         * @readonly
         * @member {number}
         */
        _this.width = 100;

        /**
         * The height of the base texture set when the image has loaded
         *
         * @readonly
         * @member {number}
         */
        _this.height = 100;

        // TODO docs
        // used to store the actual dimensions of the source
        /**
         * Used to store the actual width of the source of this texture
         *
         * @readonly
         * @member {number}
         */
        _this.realWidth = 100;
        /**
         * Used to store the actual height of the source of this texture
         *
         * @readonly
         * @member {number}
         */
        _this.realHeight = 100;

        /**
         * The scale mode to apply when scaling this texture
         *
         * @member {number}
         * @default PIXI.settings.SCALE_MODE
         * @see PIXI.SCALE_MODES
         */
        _this.scaleMode = scaleMode || SCALE_MODE$1;

        /**
         * Set to true once the base texture has successfully loaded.
         *
         * This is never true if the underlying source fails to load or has no texture data.
         *
         * @readonly
         * @member {boolean}
         */
        _this.hasLoaded = false;

        /**
         * Set to true if the source is currently loading.
         *
         * If an Image source is loading the 'loaded' or 'error' event will be
         * dispatched when the operation ends. An underyling source that is
         * immediately-available bypasses loading entirely.
         *
         * @readonly
         * @member {boolean}
         */
        _this.isLoading = false;

        /**
         * The image source that is used to create the texture.
         *
         * TODO: Make this a setter that calls loadSource();
         *
         * @readonly
         * @member {HTMLImageElement|HTMLCanvasElement}
         */
        _this.source = null; // set in loadSource, if at all

        /**
         * The image source that is used to create the texture. This is used to
         * store the original Svg source when it is replaced with a canvas element.
         *
         * TODO: Currently not in use but could be used when re-scaling svg.
         *
         * @readonly
         * @member {Image}
         */
        _this.origSource = null; // set in loadSvg, if at all

        /**
         * Type of image defined in source, eg. `png` or `svg`
         *
         * @readonly
         * @member {string}
         */
        _this.imageType = null; // set in updateImageType

        /**
         * Scale for source image. Used with Svg images to scale them before rasterization.
         *
         * @readonly
         * @member {number}
         */
        _this.sourceScale = 1.0;

        /**
         * Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)
         * All blend modes, and shaders written for default value. Change it on your own risk.
         *
         * @member {boolean}
         * @default true
         */
        _this.premultipliedAlpha = true;

        /**
         * The image url of the texture
         *
         * @member {string}
         */
        _this.imageUrl = null;

        /**
         * Whether or not the texture is a power of two, try to use power of two textures as much
         * as you can
         *
         * @private
         * @member {boolean}
         */
        _this.isPowerOfTwo = false;

        // used for webGL

        /**
         *
         * Set this to true if a mipmap of this texture needs to be generated. This value needs
         * to be set before the texture is used
         * Also the texture must be a power of two size to work
         *
         * @member {boolean}
         * @see PIXI.MIPMAP_TEXTURES
         */
        _this.mipmap = MIPMAP_TEXTURES;

        /**
         *
         * WebGL Texture wrap mode
         *
         * @member {number}
         * @see PIXI.WRAP_MODES
         */
        _this.wrapMode = WRAP_MODE;

        /**
         * A map of renderer IDs to webgl textures
         *
         * @private
         * @member {object<number, WebGLTexture>}
         */
        _this._glTextures = {};

        _this._enabled = 0;
        _this._virtalBoundId = -1;

        // if no source passed don't try to load
        if (source) {
            _this.loadSource(source);
        }

        /**
         * Fired when a not-immediately-available source finishes loading.
         *
         * @protected
         * @event loaded
         * @memberof PIXI.BaseTexture#
         */

        /**
         * Fired when a not-immediately-available source fails to load.
         *
         * @protected
         * @event error
         * @memberof PIXI.BaseTexture#
         */
        return _this;
    }

    /**
     * Updates the texture on all the webgl renderers, this also assumes the src has changed.
     *
     * @fires update
     */


    createClass(BaseTexture, [{
        key: 'update',
        value: function update() {
            // Svg size is handled during load
            if (this.imageType !== 'svg') {
                this.realWidth = this.source.naturalWidth || this.source.videoWidth || this.source.width;
                this.realHeight = this.source.naturalHeight || this.source.videoHeight || this.source.height;

                this.width = this.realWidth / this.resolution;
                this.height = this.realHeight / this.resolution;

                this.isPowerOfTwo = twiddle.isPow2(this.realWidth) && twiddle.isPow2(this.realHeight);
            }

            this.emit('update', this);
        }

        /**
         * Load a source.
         *
         * If the source is not-immediately-available, such as an image that needs to be
         * downloaded, then the 'loaded' or 'error' event will be dispatched in the future
         * and `hasLoaded` will remain false after this call.
         *
         * The logic state after calling `loadSource` directly or indirectly (eg. `fromImage`, `new BaseTexture`) is:
         *
         *     if (texture.hasLoaded) {
         *        // texture ready for use
         *     } else if (texture.isLoading) {
         *        // listen to 'loaded' and/or 'error' events on texture
         *     } else {
         *        // not loading, not going to load UNLESS the source is reloaded
         *        // (it may still make sense to listen to the events)
         *     }
         *
         * @protected
         * @param {HTMLImageElement|HTMLCanvasElement} source - the source object of the texture.
         */

    }, {
        key: 'loadSource',
        value: function loadSource(source) {
            var _this2 = this;

            var wasLoading = this.isLoading;

            this.hasLoaded = false;
            this.isLoading = false;

            if (wasLoading && this.source) {
                this.source.onload = null;
                this.source.onerror = null;
            }

            var firstSourceLoaded = !this.source;

            this.source = source;

            // Apply source if loaded. Otherwise setup appropriate loading monitors.
            if ((source.src && source.complete || source.getContext) && source.width && source.height) {
                this._updateImageType();

                if (this.imageType === 'svg') {
                    this._loadSvgSource();
                } else {
                    this._sourceLoaded();
                }

                if (firstSourceLoaded) {
                    // send loaded event if previous source was null and we have been passed a pre-loaded IMG element
                    this.emit('loaded', this);
                }
            } else if (!source.getContext) {
                var _ret = function () {
                    // Image fail / not ready
                    _this2.isLoading = true;

                    var scope = _this2;

                    source.onload = function () {
                        scope._updateImageType();
                        source.onload = null;
                        source.onerror = null;

                        if (!scope.isLoading) {
                            return;
                        }

                        scope.isLoading = false;
                        scope._sourceLoaded();

                        if (scope.imageType === 'svg') {
                            scope._loadSvgSource();

                            return;
                        }

                        scope.emit('loaded', scope);
                    };

                    source.onerror = function () {
                        source.onload = null;
                        source.onerror = null;

                        if (!scope.isLoading) {
                            return;
                        }

                        scope.isLoading = false;
                        scope.emit('error', scope);
                    };

                    // Per http://www.w3.org/TR/html5/embedded-content-0.html#the-img-element
                    //   "The value of `complete` can thus change while a script is executing."
                    // So complete needs to be re-checked after the callbacks have been added..
                    // NOTE: complete will be true if the image has no src so best to check if the src is set.
                    if (source.complete && source.src) {
                        // ..and if we're complete now, no need for callbacks
                        source.onload = null;
                        source.onerror = null;

                        if (scope.imageType === 'svg') {
                            scope._loadSvgSource();

                            return {
                                v: void 0
                            };
                        }

                        _this2.isLoading = false;

                        if (source.width && source.height) {
                            _this2._sourceLoaded();

                            // If any previous subscribers possible
                            if (wasLoading) {
                                _this2.emit('loaded', _this2);
                            }
                        }
                        // If any previous subscribers possible
                        else if (wasLoading) {
                                _this2.emit('error', _this2);
                            }
                    }
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
        }

        /**
         * Updates type of the source image.
         */

    }, {
        key: '_updateImageType',
        value: function _updateImageType() {
            if (!this.imageUrl) {
                return;
            }

            var dataUri = decomposeDataUri(this.imageUrl);
            var imageType = void 0;

            if (dataUri && dataUri.mediaType === 'image') {
                // Check for subType validity
                var firstSubType = dataUri.subType.split('+')[0];

                imageType = getUrlFileExtension('.' + firstSubType);

                if (!imageType) {
                    throw new Error('Invalid image type in data URI.');
                }
            } else {
                imageType = getUrlFileExtension(this.imageUrl);

                if (!imageType) {
                    imageType = 'png';
                }
            }

            this.imageType = imageType;
        }

        /**
         * Checks if `source` is an SVG image and whether it's loaded via a URL or a data URI. Then calls
         * `_loadSvgSourceUsingDataUri` or `_loadSvgSourceUsingXhr`.
         */

    }, {
        key: '_loadSvgSource',
        value: function _loadSvgSource() {
            if (this.imageType !== 'svg') {
                // Do nothing if source is not svg
                return;
            }

            var dataUri = decomposeDataUri(this.imageUrl);

            if (dataUri) {
                this._loadSvgSourceUsingDataUri(dataUri);
            } else {
                // We got an URL, so we need to do an XHR to check the svg size
                this._loadSvgSourceUsingXhr();
            }
        }

        /**
         * Reads an SVG string from data URI and then calls `_loadSvgSourceUsingString`.
         *
         * @param {string} dataUri - The data uri to load from.
         */

    }, {
        key: '_loadSvgSourceUsingDataUri',
        value: function _loadSvgSourceUsingDataUri(dataUri) {
            var svgString = void 0;

            if (dataUri.encoding === 'base64') {
                if (!atob) {
                    throw new Error('Your browser doesn\'t support base64 conversions.');
                }
                svgString = atob(dataUri.data);
            } else {
                svgString = dataUri.data;
            }

            this._loadSvgSourceUsingString(svgString);
        }

        /**
         * Loads an SVG string from `imageUrl` using XHR and then calls `_loadSvgSourceUsingString`.
         */

    }, {
        key: '_loadSvgSourceUsingXhr',
        value: function _loadSvgSourceUsingXhr() {
            var _this3 = this;

            var svgXhr = new XMLHttpRequest();

            // This throws error on IE, so SVG Document can't be used
            // svgXhr.responseType = 'document';

            // This is not needed since we load the svg as string (breaks IE too)
            // but overrideMimeType() can be used to force the response to be parsed as XML
            // svgXhr.overrideMimeType('image/svg+xml');

            svgXhr.onload = function () {
                if (svgXhr.readyState !== svgXhr.DONE || svgXhr.status !== 200) {
                    throw new Error('Failed to load SVG using XHR.');
                }

                _this3._loadSvgSourceUsingString(svgXhr.response);
            };

            svgXhr.onerror = function () {
                return _this3.emit('error', _this3);
            };

            svgXhr.open('GET', this.imageUrl, true);
            svgXhr.send();
        }

        /**
         * Loads texture using an SVG string. The original SVG Image is stored as `origSource` and the
         * created canvas is the new `source`. The SVG is scaled using `sourceScale`. Called by
         * `_loadSvgSourceUsingXhr` or `_loadSvgSourceUsingDataUri`.
         *
         * @param  {string} svgString SVG source as string
         *
         * @fires loaded
         */

    }, {
        key: '_loadSvgSourceUsingString',
        value: function _loadSvgSourceUsingString(svgString) {
            var svgSize = getSvgSize(svgString);

            var svgWidth = svgSize.width;
            var svgHeight = svgSize.height;

            if (!svgWidth || !svgHeight) {
                throw new Error('The SVG image must have width and height defined (in pixels), canvas API needs them.');
            }

            // Scale realWidth and realHeight
            this.realWidth = Math.round(svgWidth * this.sourceScale);
            this.realHeight = Math.round(svgHeight * this.sourceScale);

            this.width = this.realWidth / this.resolution;
            this.height = this.realHeight / this.resolution;

            // Check pow2 after scale
            this.isPowerOfTwo = twiddle.isPow2(this.realWidth) && twiddle.isPow2(this.realHeight);

            // Create a canvas element
            var canvas = document.createElement('canvas');

            canvas.width = this.realWidth;
            canvas.height = this.realHeight;
            canvas._pixiId = 'canvas_' + uid();

            // Draw the Svg to the canvas
            canvas.getContext('2d').drawImage(this.source, 0, 0, svgWidth, svgHeight, 0, 0, this.realWidth, this.realHeight);

            // Replace the original source image with the canvas
            this.origSource = this.source;
            this.source = canvas;

            // Add also the canvas in cache (destroy clears by `imageUrl` and `source._pixiId`)
            BaseTextureCache[canvas._pixiId] = this;

            this.isLoading = false;
            this._sourceLoaded();
            this.emit('loaded', this);
        }

        /**
         * Used internally to update the width, height, and some other tracking vars once
         * a source has successfully loaded.
         *
         * @private
         */

    }, {
        key: '_sourceLoaded',
        value: function _sourceLoaded() {
            this.hasLoaded = true;
            this.update();
        }

        /**
         * Destroys this base texture
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.imageUrl) {
                delete BaseTextureCache[this.imageUrl];
                delete TextureCache[this.imageUrl];

                this.imageUrl = null;

                if (!navigator.isCocoonJS) {
                    this.source.src = '';
                }
            }
            // An svg source has both `imageUrl` and `__pixiId`, so no `else if` here
            if (this.source && this.source._pixiId) {
                delete BaseTextureCache[this.source._pixiId];
            }

            this.source = null;

            this.dispose();
        }

        /**
         * Frees the texture from WebGL memory without destroying this texture object.
         * This means you can still use the texture later which will upload it to GPU
         * memory again.
         *
         */

    }, {
        key: 'dispose',
        value: function dispose() {
            this.emit('dispose', this);
        }

        /**
         * Changes the source image of the texture.
         * The original source must be an Image element.
         *
         * @param {string} newSrc - the path of the image
         */

    }, {
        key: 'updateSourceImage',
        value: function updateSourceImage(newSrc) {
            this.source.src = newSrc;

            this.loadSource(this.source);
        }

        /**
         * Helper function that creates a base texture from the given image url.
         * If the image is not in the base texture cache it will be created and loaded.
         *
         * @static
         * @param {string} imageUrl - The image url of the texture
         * @param {boolean} [crossorigin=(auto)] - Should use anonymous CORS? Defaults to true if the URL is not a data-URI.
         * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
         * @param {number} [sourceScale=(auto)] - Scale for the original image, used with Svg images.
         * @return {PIXI.BaseTexture} The new base texture.
         */

    }], [{
        key: 'fromImage',
        value: function fromImage(imageUrl, crossorigin, scaleMode, sourceScale) {
            var baseTexture = BaseTextureCache[imageUrl];

            if (!baseTexture) {
                // new Image() breaks tex loading in some versions of Chrome.
                // See https://code.google.com/p/chromium/issues/detail?id=238071
                var image = new Image(); // document.createElement('img');

                if (crossorigin === undefined && imageUrl.indexOf('data:') !== 0) {
                    image.crossOrigin = determineCrossOrigin(imageUrl);
                }

                baseTexture = new BaseTexture(image, scaleMode);
                baseTexture.imageUrl = imageUrl;

                if (sourceScale) {
                    baseTexture.sourceScale = sourceScale;
                }

                // if there is an @2x at the end of the url we are going to assume its a highres image
                baseTexture.resolution = getResolutionOfUrl(imageUrl);

                image.src = imageUrl; // Setting this triggers load

                BaseTextureCache[imageUrl] = baseTexture;
            }

            return baseTexture;
        }

        /**
         * Helper function that creates a base texture from the given canvas element.
         *
         * @static
         * @param {HTMLCanvasElement} canvas - The canvas element source of the texture
         * @param {number} scaleMode - See {@link PIXI.SCALE_MODES} for possible values
         * @return {PIXI.BaseTexture} The new base texture.
         */

    }, {
        key: 'fromCanvas',
        value: function fromCanvas(canvas, scaleMode) {
            if (!canvas._pixiId) {
                canvas._pixiId = 'canvas_' + uid();
            }

            var baseTexture = BaseTextureCache[canvas._pixiId];

            if (!baseTexture) {
                baseTexture = new BaseTexture(canvas, scaleMode);
                BaseTextureCache[canvas._pixiId] = baseTexture;
            }

            return baseTexture;
        }
    }]);
    return BaseTexture;
}(index$2);

var RESOLUTION$1 = settings.RESOLUTION;
var SCALE_MODE = settings.SCALE_MODE;

/**
 * A BaseRenderTexture is a special texture that allows any Pixi display object to be rendered to it.
 *
 * __Hint__: All DisplayObjects (i.e. Sprites) that render to a BaseRenderTexture should be preloaded
 * otherwise black rectangles will be drawn instead.
 *
 * A BaseRenderTexture takes a snapshot of any Display Object given to its render method. The position
 * and rotation of the given Display Objects is ignored. For example:
 *
 * ```js
 * let renderer = PIXI.autoDetectRenderer(1024, 1024, { view: canvas, ratio: 1 });
 * let baseRenderTexture = new PIXI.BaseRenderTexture(renderer, 800, 600);
 * let sprite = PIXI.Sprite.fromImage("spinObj_01.png");
 *
 * sprite.position.x = 800/2;
 * sprite.position.y = 600/2;
 * sprite.anchor.x = 0.5;
 * sprite.anchor.y = 0.5;
 *
 * baseRenderTexture.render(sprite);
 * ```
 *
 * The Sprite in this case will be rendered to a position of 0,0. To render this sprite at its actual
 * position a Container should be used:
 *
 * ```js
 * let doc = new PIXI.Container();
 *
 * doc.addChild(sprite);
 *
 * let baseRenderTexture = new PIXI.BaseRenderTexture(100, 100);
 * let renderTexture = new PIXI.RenderTexture(baseRenderTexture);
 *
 * renderer.render(doc, renderTexture);  // Renders to center of RenderTexture
 * ```
 *
 * @class
 * @extends PIXI.BaseTexture
 * @memberof PIXI
 */

var BaseRenderTexture = function (_BaseTexture) {
  inherits(BaseRenderTexture, _BaseTexture);

  /**
   * @param {number} [width=100] - The width of the base render texture
   * @param {number} [height=100] - The height of the base render texture
   * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
   * @param {number} [resolution=1] - The resolution / device pixel ratio of the texture being generated
   */
  function BaseRenderTexture() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var scaleMode = arguments[2];
    var resolution = arguments[3];
    classCallCheck(this, BaseRenderTexture);

    var _this = possibleConstructorReturn(this, (BaseRenderTexture.__proto__ || Object.getPrototypeOf(BaseRenderTexture)).call(this, null, scaleMode));

    _this.resolution = resolution || RESOLUTION$1;

    _this.width = width;
    _this.height = height;

    _this.realWidth = _this.width * _this.resolution;
    _this.realHeight = _this.height * _this.resolution;

    _this.scaleMode = scaleMode || SCALE_MODE;
    _this.hasLoaded = true;

    /**
     * A map of renderer IDs to webgl renderTargets
     *
     * @private
     * @member {object<number, WebGLTexture>}
     */
    _this._glRenderTargets = {};

    /**
     * A reference to the canvas render target (we only need one as this can be shared across renderers)
     *
     * @private
     * @member {object<number, WebGLTexture>}
     */
    _this._canvasRenderTarget = null;

    /**
     * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
     *
     * @member {boolean}
     */
    _this.valid = false;
    return _this;
  }

  /**
   * Resizes the BaseRenderTexture.
   *
   * @param {number} width - The width to resize to.
   * @param {number} height - The height to resize to.
   */


  createClass(BaseRenderTexture, [{
    key: 'resize',
    value: function resize(width, height) {
      if (width === this.width && height === this.height) {
        return;
      }

      this.valid = width > 0 && height > 0;

      this.width = width;
      this.height = height;

      this.realWidth = this.width * this.resolution;
      this.realHeight = this.height * this.resolution;

      if (!this.valid) {
        return;
      }

      this.emit('update', this);
    }

    /**
     * Destroys this texture
     *
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      get$1(BaseRenderTexture.prototype.__proto__ || Object.getPrototypeOf(BaseRenderTexture.prototype), 'destroy', this).call(this, true);
      this.renderer = null;
    }
  }]);
  return BaseRenderTexture;
}(BaseTexture);

/**
 * A texture of a [playing] Video.
 *
 * Video base textures mimic Pixi BaseTexture.from.... method in their creation process.
 *
 * This can be used in several ways, such as:
 *
 * ```js
 * let texture = PIXI.VideoBaseTexture.fromUrl('http://mydomain.com/video.mp4');
 *
 * let texture = PIXI.VideoBaseTexture.fromUrl({ src: 'http://mydomain.com/video.mp4', mime: 'video/mp4' });
 *
 * let texture = PIXI.VideoBaseTexture.fromUrls(['/video.webm', '/video.mp4']);
 *
 * let texture = PIXI.VideoBaseTexture.fromUrls([
 *     { src: '/video.webm', mime: 'video/webm' },
 *     { src: '/video.mp4', mime: 'video/mp4' }
 * ]);
 * ```
 *
 * See the ["deus" demo](http://www.goodboydigital.com/pixijs/examples/deus/).
 *
 * @class
 * @extends PIXI.BaseTexture
 * @memberof PIXI
 */

var VideoBaseTexture = function (_BaseTexture) {
    inherits(VideoBaseTexture, _BaseTexture);

    /**
     * @param {HTMLVideoElement} source - Video source
     * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
     */
    function VideoBaseTexture(source, scaleMode) {
        classCallCheck(this, VideoBaseTexture);

        if (!source) {
            throw new Error('No video source element specified.');
        }

        // hook in here to check if video is already available.
        // BaseTexture looks for a source.complete boolean, plus width & height.

        if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA) && source.width && source.height) {
            source.complete = true;
        }

        var _this = possibleConstructorReturn(this, (VideoBaseTexture.__proto__ || Object.getPrototypeOf(VideoBaseTexture)).call(this, source, scaleMode));

        _this.width = source.videoWidth;
        _this.height = source.videoHeight;

        _this._autoUpdate = true;
        _this._isAutoUpdating = false;

        /**
         * When set to true will automatically play videos used by this texture once
         * they are loaded. If false, it will not modify the playing state.
         *
         * @member {boolean}
         * @default true
         */
        _this.autoPlay = true;

        _this.update = _this.update.bind(_this);
        _this._onCanPlay = _this._onCanPlay.bind(_this);

        source.addEventListener('play', _this._onPlayStart.bind(_this));
        source.addEventListener('pause', _this._onPlayStop.bind(_this));
        _this.hasLoaded = false;
        _this.__loaded = false;

        if (!_this._isSourceReady()) {
            source.addEventListener('canplay', _this._onCanPlay);
            source.addEventListener('canplaythrough', _this._onCanPlay);
        } else {
            _this._onCanPlay();
        }
        return _this;
    }

    /**
     * Returns true if the underlying source is playing.
     *
     * @private
     * @return {boolean} True if playing.
     */


    createClass(VideoBaseTexture, [{
        key: '_isSourcePlaying',
        value: function _isSourcePlaying() {
            var source = this.source;

            return source.currentTime > 0 && source.paused === false && source.ended === false && source.readyState > 2;
        }

        /**
         * Returns true if the underlying source is ready for playing.
         *
         * @private
         * @return {boolean} True if ready.
         */

    }, {
        key: '_isSourceReady',
        value: function _isSourceReady() {
            return this.source.readyState === 3 || this.source.readyState === 4;
        }

        /**
         * Runs the update loop when the video is ready to play
         *
         * @private
         */

    }, {
        key: '_onPlayStart',
        value: function _onPlayStart() {
            // Just in case the video has not received its can play even yet..
            if (!this.hasLoaded) {
                this._onCanPlay();
            }

            if (!this._isAutoUpdating && this.autoUpdate) {
                shared.add(this.update, this);
                this._isAutoUpdating = true;
            }
        }

        /**
         * Fired when a pause event is triggered, stops the update loop
         *
         * @private
         */

    }, {
        key: '_onPlayStop',
        value: function _onPlayStop() {
            if (this._isAutoUpdating) {
                shared.remove(this.update, this);
                this._isAutoUpdating = false;
            }
        }

        /**
         * Fired when the video is loaded and ready to play
         *
         * @private
         */

    }, {
        key: '_onCanPlay',
        value: function _onCanPlay() {
            this.hasLoaded = true;

            if (this.source) {
                this.source.removeEventListener('canplay', this._onCanPlay);
                this.source.removeEventListener('canplaythrough', this._onCanPlay);

                this.width = this.source.videoWidth;
                this.height = this.source.videoHeight;

                // prevent multiple loaded dispatches..
                if (!this.__loaded) {
                    this.__loaded = true;
                    this.emit('loaded', this);
                }

                if (this._isSourcePlaying()) {
                    this._onPlayStart();
                } else if (this.autoPlay) {
                    this.source.play();
                }
            }
        }

        /**
         * Destroys this texture
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            if (this._isAutoUpdating) {
                shared.remove(this.update, this);
            }

            if (this.source && this.source._pixiId) {
                delete BaseTextureCache[this.source._pixiId];
                delete this.source._pixiId;
            }

            get$1(VideoBaseTexture.prototype.__proto__ || Object.getPrototypeOf(VideoBaseTexture.prototype), 'destroy', this).call(this);
        }

        /**
         * Mimic Pixi BaseTexture.from.... method.
         *
         * @static
         * @param {HTMLVideoElement} video - Video to create texture from
         * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
         * @return {PIXI.VideoBaseTexture} Newly created VideoBaseTexture
         */

    }, {
        key: 'autoUpdate',


        /**
         * Should the base texture automatically update itself, set to true by default
         *
         * @member {boolean}
         * @memberof PIXI.VideoBaseTexture#
         */
        get: function get() {
            return this._autoUpdate;
        }

        /**
         * Sets autoUpdate property.
         *
         * @param {number} value - enable auto update or not
         */
        ,
        set: function set(value) {
            if (value !== this._autoUpdate) {
                this._autoUpdate = value;

                if (!this._autoUpdate && this._isAutoUpdating) {
                    shared.remove(this.update, this);
                    this._isAutoUpdating = false;
                } else if (this._autoUpdate && !this._isAutoUpdating) {
                    shared.add(this.update, this);
                    this._isAutoUpdating = true;
                }
            }
        }
    }], [{
        key: 'fromVideo',
        value: function fromVideo(video, scaleMode) {
            if (!video._pixiId) {
                video._pixiId = 'video_' + uid();
            }

            var baseTexture = BaseTextureCache[video._pixiId];

            if (!baseTexture) {
                baseTexture = new VideoBaseTexture(video, scaleMode);
                BaseTextureCache[video._pixiId] = baseTexture;
            }

            return baseTexture;
        }

        /**
         * Helper function that creates a new BaseTexture based on the given video element.
         * This BaseTexture can then be used to create a texture
         *
         * @static
         * @param {string|object|string[]|object[]} videoSrc - The URL(s) for the video.
         * @param {string} [videoSrc.src] - One of the source urls for the video
         * @param {string} [videoSrc.mime] - The mimetype of the video (e.g. 'video/mp4'). If not specified
         *  the url's extension will be used as the second part of the mime type.
         * @param {number} scaleMode - See {@link PIXI.SCALE_MODES} for possible values
         * @return {PIXI.VideoBaseTexture} Newly created VideoBaseTexture
         */

    }, {
        key: 'fromUrl',
        value: function fromUrl(videoSrc, scaleMode) {
            var video = document.createElement('video');

            video.setAttribute('webkit-playsinline', '');
            video.setAttribute('playsinline', '');

            // array of objects or strings
            if (Array.isArray(videoSrc)) {
                for (var i = 0; i < videoSrc.length; ++i) {
                    video.appendChild(createSource(videoSrc[i].src || videoSrc[i], videoSrc[i].mime));
                }
            }
            // single object or string
            else {
                    video.appendChild(createSource(videoSrc.src || videoSrc, videoSrc.mime));
                }

            video.load();

            return VideoBaseTexture.fromVideo(video, scaleMode);
        }
    }]);
    return VideoBaseTexture;
}(BaseTexture);

VideoBaseTexture.fromUrls = VideoBaseTexture.fromUrl;

function createSource(path$$1, type) {
    if (!type) {
        type = 'video/' + path$$1.substr(path$$1.lastIndexOf('.') + 1);
    }

    var source = document.createElement('source');

    source.src = path$$1;
    source.type = type;

    return source;
}

/**
 * A standard object to store the Uvs of a texture
 *
 * @class
 * @private
 * @memberof PIXI
 */

var TextureUvs = function () {
    /**
     *
     */
    function TextureUvs() {
        classCallCheck(this, TextureUvs);

        this.x0 = 0;
        this.y0 = 0;

        this.x1 = 1;
        this.y1 = 0;

        this.x2 = 1;
        this.y2 = 1;

        this.x3 = 0;
        this.y3 = 1;

        this.uvsUint32 = new Uint32Array(4);
    }

    /**
     * Sets the texture Uvs based on the given frame information.
     *
     * @private
     * @param {PIXI.Rectangle} frame - The frame of the texture
     * @param {PIXI.Rectangle} baseFrame - The base frame of the texture
     * @param {number} rotate - Rotation of frame, see {@link PIXI.GroupD8}
     */


    createClass(TextureUvs, [{
        key: 'set',
        value: function set(frame, baseFrame, rotate) {
            var tw = baseFrame.width;
            var th = baseFrame.height;

            if (rotate) {
                // width and height div 2 div baseFrame size
                var w2 = frame.width / 2 / tw;
                var h2 = frame.height / 2 / th;

                // coordinates of center
                var cX = frame.x / tw + w2;
                var cY = frame.y / th + h2;

                rotate = GroupD8.add(rotate, GroupD8.NW); // NW is top-left corner
                this.x0 = cX + w2 * GroupD8.uX(rotate);
                this.y0 = cY + h2 * GroupD8.uY(rotate);

                rotate = GroupD8.add(rotate, 2); // rotate 90 degrees clockwise
                this.x1 = cX + w2 * GroupD8.uX(rotate);
                this.y1 = cY + h2 * GroupD8.uY(rotate);

                rotate = GroupD8.add(rotate, 2);
                this.x2 = cX + w2 * GroupD8.uX(rotate);
                this.y2 = cY + h2 * GroupD8.uY(rotate);

                rotate = GroupD8.add(rotate, 2);
                this.x3 = cX + w2 * GroupD8.uX(rotate);
                this.y3 = cY + h2 * GroupD8.uY(rotate);
            } else {
                this.x0 = frame.x / tw;
                this.y0 = frame.y / th;

                this.x1 = (frame.x + frame.width) / tw;
                this.y1 = frame.y / th;

                this.x2 = (frame.x + frame.width) / tw;
                this.y2 = (frame.y + frame.height) / th;

                this.x3 = frame.x / tw;
                this.y3 = (frame.y + frame.height) / th;
            }

            this.uvsUint32[0] = (this.y0 * 65535 & 0xFFFF) << 16 | this.x0 * 65535 & 0xFFFF;
            this.uvsUint32[1] = (this.y1 * 65535 & 0xFFFF) << 16 | this.x1 * 65535 & 0xFFFF;
            this.uvsUint32[2] = (this.y2 * 65535 & 0xFFFF) << 16 | this.x2 * 65535 & 0xFFFF;
            this.uvsUint32[3] = (this.y3 * 65535 & 0xFFFF) << 16 | this.x3 * 65535 & 0xFFFF;
        }
    }]);
    return TextureUvs;
}();

/**
 * A texture stores the information that represents an image or part of an image. It cannot be added
 * to the display list directly. Instead use it as the texture for a Sprite. If no frame is provided
 * then the whole image is used.
 *
 * You can directly create a texture from an image and then reuse it multiple times like this :
 *
 * ```js
 * let texture = PIXI.Texture.fromImage('assets/image.png');
 * let sprite1 = new PIXI.Sprite(texture);
 * let sprite2 = new PIXI.Sprite(texture);
 * ```
 *
 * Textures made from SVGs, loaded or not, cannot be used before the file finishes processing.
 * You can check for this by checking the sprite's _textureID property.
 * ```js
 * var texture = PIXI.Texture.fromImage('assets/image.svg');
 * var sprite1 = new PIXI.Sprite(texture);
 * //sprite1._textureID should not be undefined if the texture has finished processing the SVG file
 * ```
 * You can use a ticker or rAF to ensure your sprites load the finished textures after processing. See issue #3068.
 *
 * @class
 * @extends EventEmitter
 * @memberof PIXI
 */

var Texture = function (_EventEmitter) {
    inherits(Texture, _EventEmitter);

    /**
     * @param {PIXI.BaseTexture} baseTexture - The base texture source to create the texture from
     * @param {PIXI.Rectangle} [frame] - The rectangle frame of the texture to show
     * @param {PIXI.Rectangle} [orig] - The area of original texture
     * @param {PIXI.Rectangle} [trim] - Trimmed rectangle of original texture
     * @param {number} [rotate] - indicates how the texture was rotated by texture packer. See {@link PIXI.GroupD8}
     */
    function Texture(baseTexture, frame, orig, trim, rotate) {
        classCallCheck(this, Texture);

        /**
         * Does this Texture have any frame data assigned to it?
         *
         * @member {boolean}
         */
        var _this = possibleConstructorReturn(this, (Texture.__proto__ || Object.getPrototypeOf(Texture)).call(this));

        _this.noFrame = false;

        if (!frame) {
            _this.noFrame = true;
            frame = new Rectangle(0, 0, 1, 1);
        }

        if (baseTexture instanceof Texture) {
            baseTexture = baseTexture.baseTexture;
        }

        /**
         * The base texture that this texture uses.
         *
         * @member {PIXI.BaseTexture}
         */
        _this.baseTexture = baseTexture;

        /**
         * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
         * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
         *
         * @member {PIXI.Rectangle}
         */
        _this._frame = frame;

        /**
         * This is the trimmed area of original texture, before it was put in atlas
         *
         * @member {PIXI.Rectangle}
         */
        _this.trim = trim;

        /**
         * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
         *
         * @member {boolean}
         */
        _this.valid = false;

        /**
         * This will let a renderer know that a texture has been updated (used mainly for webGL uv updates)
         *
         * @member {boolean}
         */
        _this.requiresUpdate = false;

        /**
         * The WebGL UV data cache.
         *
         * @member {PIXI.TextureUvs}
         * @private
         */
        _this._uvs = null;

        /**
         * This is the area of original texture, before it was put in atlas
         *
         * @member {PIXI.Rectangle}
         */
        _this.orig = orig || frame; // new Rectangle(0, 0, 1, 1);

        _this._rotate = Number(rotate || 0);

        if (rotate === true) {
            // this is old texturepacker legacy, some games/libraries are passing "true" for rotated textures
            _this._rotate = 2;
        } else if (_this._rotate % 2 !== 0) {
            throw new Error('attempt to use diamond-shaped UVs. If you are sure, set rotation manually');
        }

        if (baseTexture.hasLoaded) {
            if (_this.noFrame) {
                frame = new Rectangle(0, 0, baseTexture.width, baseTexture.height);

                // if there is no frame we should monitor for any base texture changes..
                baseTexture.on('update', _this.onBaseTextureUpdated, _this);
            }
            _this.frame = frame;
        } else {
            baseTexture.once('loaded', _this.onBaseTextureLoaded, _this);
        }

        /**
         * Fired when the texture is updated. This happens if the frame or the baseTexture is updated.
         *
         * @event update
         * @memberof PIXI.Texture#
         * @protected
         */

        _this._updateID = 0;

        /**
         * Extra field for extra plugins. May contain clamp settings and some matrices
         * @type {Object}
         */
        _this.transform = null;
        return _this;
    }

    /**
     * Updates this texture on the gpu.
     *
     */


    createClass(Texture, [{
        key: 'update',
        value: function update() {
            this.baseTexture.update();
        }

        /**
         * Called when the base texture is loaded
         *
         * @private
         * @param {PIXI.BaseTexture} baseTexture - The base texture.
         */

    }, {
        key: 'onBaseTextureLoaded',
        value: function onBaseTextureLoaded(baseTexture) {
            this._updateID++;

            // TODO this code looks confusing.. boo to abusing getters and setters!
            if (this.noFrame) {
                this.frame = new Rectangle(0, 0, baseTexture.width, baseTexture.height);
            } else {
                this.frame = this._frame;
            }

            this.baseTexture.on('update', this.onBaseTextureUpdated, this);
            this.emit('update', this);
        }

        /**
         * Called when the base texture is updated
         *
         * @private
         * @param {PIXI.BaseTexture} baseTexture - The base texture.
         */

    }, {
        key: 'onBaseTextureUpdated',
        value: function onBaseTextureUpdated(baseTexture) {
            this._updateID++;

            this._frame.width = baseTexture.width;
            this._frame.height = baseTexture.height;

            this.emit('update', this);
        }

        /**
         * Destroys this texture
         *
         * @param {boolean} [destroyBase=false] Whether to destroy the base texture as well
         */

    }, {
        key: 'destroy',
        value: function destroy(destroyBase) {
            if (this.baseTexture) {
                if (destroyBase) {
                    // delete the texture if it exists in the texture cache..
                    // this only needs to be removed if the base texture is actually destroyed too..
                    if (TextureCache[this.baseTexture.imageUrl]) {
                        delete TextureCache[this.baseTexture.imageUrl];
                    }

                    this.baseTexture.destroy();
                }

                this.baseTexture.off('update', this.onBaseTextureUpdated, this);
                this.baseTexture.off('loaded', this.onBaseTextureLoaded, this);

                this.baseTexture = null;
            }

            this._frame = null;
            this._uvs = null;
            this.trim = null;
            this.orig = null;

            this.valid = false;

            this.off('dispose', this.dispose, this);
            this.off('update', this.update, this);
        }

        /**
         * Creates a new texture object that acts the same as this one.
         *
         * @return {PIXI.Texture} The new texture
         */

    }, {
        key: 'clone',
        value: function clone() {
            return new Texture(this.baseTexture, this.frame, this.orig, this.trim, this.rotate);
        }

        /**
         * Updates the internal WebGL UV cache.
         *
         * @protected
         */

    }, {
        key: '_updateUvs',
        value: function _updateUvs() {
            if (!this._uvs) {
                this._uvs = new TextureUvs();
            }

            this._uvs.set(this._frame, this.baseTexture, this.rotate);

            this._updateID++;
        }

        /**
         * Helper function that creates a Texture object from the given image url.
         * If the image is not in the texture cache it will be  created and loaded.
         *
         * @static
         * @param {string} imageUrl - The image url of the texture
         * @param {boolean} [crossorigin] - Whether requests should be treated as crossorigin
         * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
         * @param {number} [sourceScale=(auto)] - Scale for the original image, used with SVG images.
         * @return {PIXI.Texture} The newly created texture
         */

    }, {
        key: 'frame',


        /**
         * The frame specifies the region of the base texture that this texture uses.
         *
         * @member {PIXI.Rectangle}
         * @memberof PIXI.Texture#
         */
        get: function get() {
            return this._frame;
        }

        /**
         * Set the frame.
         *
         * @param {Rectangle} frame - The new frame to set.
         */
        ,
        set: function set(frame) {
            this._frame = frame;

            this.noFrame = false;

            if (frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height) {
                throw new Error('Texture Error: frame does not fit inside the base Texture dimensions ' + this);
            }

            // this.valid = frame && frame.width && frame.height && this.baseTexture.source && this.baseTexture.hasLoaded;
            this.valid = frame && frame.width && frame.height && this.baseTexture.hasLoaded;

            if (!this.trim && !this.rotate) {
                this.orig = frame;
            }

            if (this.valid) {
                this._updateUvs();
            }
        }

        /**
         * Indicates whether the texture is rotated inside the atlas
         * set to 2 to compensate for texture packer rotation
         * set to 6 to compensate for spine packer rotation
         * can be used to rotate or mirror sprites
         * See {@link PIXI.GroupD8} for explanation
         *
         * @member {number}
         */

    }, {
        key: 'rotate',
        get: function get() {
            return this._rotate;
        }

        /**
         * Set the rotation
         *
         * @param {number} rotate - The new rotation to set.
         */
        ,
        set: function set(rotate) {
            this._rotate = rotate;
            if (this.valid) {
                this._updateUvs();
            }
        }

        /**
         * The width of the Texture in pixels.
         *
         * @member {number}
         */

    }, {
        key: 'width',
        get: function get() {
            return this.orig ? this.orig.width : 0;
        }

        /**
         * The height of the Texture in pixels.
         *
         * @member {number}
         */

    }, {
        key: 'height',
        get: function get() {
            return this.orig ? this.orig.height : 0;
        }
    }], [{
        key: 'fromImage',
        value: function fromImage(imageUrl, crossorigin, scaleMode, sourceScale) {
            var texture = TextureCache[imageUrl];

            if (!texture) {
                texture = new Texture(BaseTexture.fromImage(imageUrl, crossorigin, scaleMode, sourceScale));
                TextureCache[imageUrl] = texture;
            }

            return texture;
        }

        /**
         * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
         * The frame ids are created when a Texture packer file has been loaded
         *
         * @static
         * @param {string} frameId - The frame Id of the texture in the cache
         * @return {PIXI.Texture} The newly created texture
         */

    }, {
        key: 'fromFrame',
        value: function fromFrame(frameId) {
            var texture = TextureCache[frameId];

            if (!texture) {
                throw new Error('The frameId "' + frameId + '" does not exist in the texture cache');
            }

            return texture;
        }

        /**
         * Helper function that creates a new Texture based on the given canvas element.
         *
         * @static
         * @param {HTMLCanvasElement} canvas - The canvas element source of the texture
         * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
         * @return {PIXI.Texture} The newly created texture
         */

    }, {
        key: 'fromCanvas',
        value: function fromCanvas(canvas, scaleMode) {
            return new Texture(BaseTexture.fromCanvas(canvas, scaleMode));
        }

        /**
         * Helper function that creates a new Texture based on the given video element.
         *
         * @static
         * @param {HTMLVideoElement|string} video - The URL or actual element of the video
         * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
         * @return {PIXI.Texture} The newly created texture
         */

    }, {
        key: 'fromVideo',
        value: function fromVideo(video, scaleMode) {
            if (typeof video === 'string') {
                return Texture.fromVideoUrl(video, scaleMode);
            }

            return new Texture(VideoBaseTexture.fromVideo(video, scaleMode));
        }

        /**
         * Helper function that creates a new Texture based on the video url.
         *
         * @static
         * @param {string} videoUrl - URL of the video
         * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
         * @return {PIXI.Texture} The newly created texture
         */

    }, {
        key: 'fromVideoUrl',
        value: function fromVideoUrl(videoUrl, scaleMode) {
            return new Texture(VideoBaseTexture.fromUrl(videoUrl, scaleMode));
        }

        /**
         * Helper function that creates a new Texture based on the source you provide.
         * The source can be - frame id, image url, video url, canvas element, video element, base texture
         *
         * @static
         * @param {number|string|PIXI.BaseTexture|HTMLCanvasElement|HTMLVideoElement} source - Source to create texture from
         * @return {PIXI.Texture} The newly created texture
         */

    }, {
        key: 'from',
        value: function from(source) {
            // TODO auto detect cross origin..
            // TODO pass in scale mode?
            if (typeof source === 'string') {
                var texture = TextureCache[source];

                if (!texture) {
                    // check if its a video..
                    var isVideo = source.match(/\.(mp4|webm|ogg|h264|avi|mov)$/) !== null;

                    if (isVideo) {
                        return Texture.fromVideoUrl(source);
                    }

                    return Texture.fromImage(source);
                }

                return texture;
            } else if (source instanceof HTMLImageElement) {
                return new Texture(new BaseTexture(source));
            } else if (source instanceof HTMLCanvasElement) {
                return Texture.fromCanvas(source);
            } else if (source instanceof HTMLVideoElement) {
                return Texture.fromVideo(source);
            } else if (source instanceof BaseTexture) {
                return new Texture(source);
            }

            // lets assume its a texture!
            return source;
        }

        /**
         * Adds a texture to the global TextureCache. This cache is shared across the whole PIXI object.
         *
         * @static
         * @param {PIXI.Texture} texture - The Texture to add to the cache.
         * @param {string} id - The id that the texture will be stored against.
         */

    }, {
        key: 'addTextureToCache',
        value: function addTextureToCache(texture, id) {
            TextureCache[id] = texture;
        }

        /**
         * Remove a texture from the global TextureCache.
         *
         * @static
         * @param {string} id - The id of the texture to be removed
         * @return {PIXI.Texture} The texture that was removed
         */

    }, {
        key: 'removeTextureFromCache',
        value: function removeTextureFromCache(id) {
            var texture = TextureCache[id];

            delete TextureCache[id];
            delete BaseTextureCache[id];

            return texture;
        }
    }]);
    return Texture;
}(index$2);

Texture.EMPTY = new Texture(new BaseTexture());
Texture.EMPTY.destroy = function _emptyDestroy() {/* empty */};
Texture.EMPTY.on = function _emptyOn() {/* empty */};
Texture.EMPTY.once = function _emptyOnce() {/* empty */};
Texture.EMPTY.emit = function _emptyEmit() {/* empty */};

/**
 * A RenderTexture is a special texture that allows any Pixi display object to be rendered to it.
 *
 * __Hint__: All DisplayObjects (i.e. Sprites) that render to a RenderTexture should be preloaded
 * otherwise black rectangles will be drawn instead.
 *
 * A RenderTexture takes a snapshot of any Display Object given to its render method. The position
 * and rotation of the given Display Objects is ignored. For example:
 *
 * ```js
 * let renderer = PIXI.autoDetectRenderer(1024, 1024, { view: canvas, ratio: 1 });
 * let renderTexture = PIXI.RenderTexture.create(800, 600);
 * let sprite = PIXI.Sprite.fromImage("spinObj_01.png");
 *
 * sprite.position.x = 800/2;
 * sprite.position.y = 600/2;
 * sprite.anchor.x = 0.5;
 * sprite.anchor.y = 0.5;
 *
 * renderer.render(sprite, renderTexture);
 * ```
 *
 * The Sprite in this case will be rendered to a position of 0,0. To render this sprite at its actual
 * position a Container should be used:
 *
 * ```js
 * let doc = new PIXI.Container();
 *
 * doc.addChild(sprite);
 *
 * renderer.render(doc, renderTexture);  // Renders to center of renderTexture
 * ```
 *
 * @class
 * @extends PIXI.Texture
 * @memberof PIXI
 */

var RenderTexture = function (_Texture) {
    inherits(RenderTexture, _Texture);

    /**
     * @param {PIXI.BaseRenderTexture} baseRenderTexture - The renderer used for this RenderTexture
     * @param {PIXI.Rectangle} [frame] - The rectangle frame of the texture to show
     */
    function RenderTexture(baseRenderTexture, frame) {
        classCallCheck(this, RenderTexture);

        // support for legacy..
        var _legacyRenderer = null;

        if (!(baseRenderTexture instanceof BaseRenderTexture)) {
            /* eslint-disable prefer-rest-params, no-console */
            var width = arguments[1];
            var height = arguments[2];
            var scaleMode = arguments[3] || 0;
            var resolution = arguments[4] || 1;

            // we have an old render texture..
            console.warn('Please use RenderTexture.create(' + width + ', ' + height + ') instead of the ctor directly.');
            _legacyRenderer = arguments[0];
            /* eslint-enable prefer-rest-params, no-console */

            frame = null;
            baseRenderTexture = new BaseRenderTexture(width, height, scaleMode, resolution);
        }

        /**
         * The base texture object that this texture uses
         *
         * @member {BaseTexture}
         */

        var _this = possibleConstructorReturn(this, (RenderTexture.__proto__ || Object.getPrototypeOf(RenderTexture)).call(this, baseRenderTexture, frame));

        _this.legacyRenderer = _legacyRenderer;

        /**
         * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
         *
         * @member {boolean}
         */
        _this.valid = true;

        _this._updateUvs();
        return _this;
    }

    /**
     * Resizes the RenderTexture.
     *
     * @param {number} width - The width to resize to.
     * @param {number} height - The height to resize to.
     * @param {boolean} doNotResizeBaseTexture - Should the baseTexture.width and height values be resized as well?
     */


    createClass(RenderTexture, [{
        key: 'resize',
        value: function resize(width, height, doNotResizeBaseTexture) {
            // TODO - could be not required..
            this.valid = width > 0 && height > 0;

            this._frame.width = this.orig.width = width;
            this._frame.height = this.orig.height = height;

            if (!doNotResizeBaseTexture) {
                this.baseTexture.resize(width, height);
            }

            this._updateUvs();
        }

        /**
         * A short hand way of creating a render texture.
         *
         * @param {number} [width=100] - The width of the render texture
         * @param {number} [height=100] - The height of the render texture
         * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
         * @param {number} [resolution=1] - The resolution / device pixel ratio of the texture being generated
         * @return {PIXI.RenderTexture} The new render texture
         */

    }], [{
        key: 'create',
        value: function create(width, height, scaleMode, resolution) {
            return new RenderTexture(new BaseRenderTexture(width, height, scaleMode, resolution));
        }
    }]);
    return RenderTexture;
}(Texture);

var tempMatrix = new Matrix();
var RESOLUTION = settings.RESOLUTION;
var RENDER_OPTIONS = settings.RENDER_OPTIONS;

/**
 * The SystemRenderer is the base for a Pixi Renderer. It is extended by the {@link PIXI.CanvasRenderer}
 * and {@link PIXI.WebGLRenderer} which can be used for rendering a Pixi scene.
 *
 * @abstract
 * @class
 * @extends EventEmitter
 * @memberof PIXI
 */

var SystemRenderer = function (_EventEmitter) {
  inherits(SystemRenderer, _EventEmitter);

  /**
   * @param {string} system - The name of the system this renderer is for.
   * @param {number} [width=800] - the width of the canvas view
   * @param {number} [height=600] - the height of the canvas view
   * @param {object} [options] - The optional renderer parameters
   * @param {HTMLCanvasElement} [options.view] - the canvas to use as a view, optional
   * @param {boolean} [options.transparent=false] - If the render view is transparent, default false
   * @param {boolean} [options.autoResize=false] - If the render view is automatically resized, default false
   * @param {boolean} [options.antialias=false] - sets antialias (only applicable in chrome at the moment)
   * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer. The
   *  resolution of the renderer retina would be 2.
   * @param {boolean} [options.clearBeforeRender=true] - This sets if the CanvasRenderer will clear the canvas or
   *      not before the new render pass.
   * @param {number} [options.backgroundColor=0x000000] - The background color of the rendered area
   *  (shown if not transparent).
   * @param {boolean} [options.roundPixels=false] - If true Pixi will Math.floor() x/y values when rendering,
   *  stopping pixel interpolation.
   */
  function SystemRenderer(system, width, height, options) {
    classCallCheck(this, SystemRenderer);

    var _this = possibleConstructorReturn(this, (SystemRenderer.__proto__ || Object.getPrototypeOf(SystemRenderer)).call(this));

    sayHello(system);

    // prepare options
    if (options) {
      for (var i in RENDER_OPTIONS) {
        if (typeof options[i] === 'undefined') {
          options[i] = RENDER_OPTIONS[i];
        }
      }
    } else {
      options = RENDER_OPTIONS;
    }

    /**
     * The type of the renderer.
     *
     * @member {number}
     * @default PIXI.RENDERER_TYPE.UNKNOWN
     * @see PIXI.RENDERER_TYPE
     */
    _this.type = RENDERER_TYPE.UNKNOWN;

    /**
     * The width of the canvas view
     *
     * @member {number}
     * @default 800
     */
    _this.width = width || 800;

    /**
     * The height of the canvas view
     *
     * @member {number}
     * @default 600
     */
    _this.height = height || 600;

    /**
     * The canvas element that everything is drawn to
     *
     * @member {HTMLCanvasElement}
     */
    _this.view = options.view || document.createElement('canvas');

    /**
     * The resolution / device pixel ratio of the renderer
     *
     * @member {number}
     * @default 1
     */
    _this.resolution = options.resolution || RESOLUTION;

    /**
     * Whether the render view is transparent
     *
     * @member {boolean}
     */
    _this.transparent = options.transparent;

    /**
     * Whether the render view should be resized automatically
     *
     * @member {boolean}
     */
    _this.autoResize = options.autoResize || false;

    /**
     * Tracks the blend modes useful for this renderer.
     *
     * @member {object<string, mixed>}
     */
    _this.blendModes = null;

    /**
     * The value of the preserveDrawingBuffer flag affects whether or not the contents of
     * the stencil buffer is retained after rendering.
     *
     * @member {boolean}
     */
    _this.preserveDrawingBuffer = options.preserveDrawingBuffer;

    /**
     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
     * If the scene is NOT transparent Pixi will use a canvas sized fillRect operation every
     * frame to set the canvas background color. If the scene is transparent Pixi will use clearRect
     * to clear the canvas every frame. Disable this by setting this to false. For example if
     * your game has a canvas filling background image you often don't need this set.
     *
     * @member {boolean}
     * @default
     */
    _this.clearBeforeRender = options.clearBeforeRender;

    /**
     * If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.
     * Handy for crisp pixel art and speed on legacy devices.
     *
     * @member {boolean}
     */
    _this.roundPixels = options.roundPixels;

    /**
     * The background color as a number.
     *
     * @member {number}
     * @private
     */
    _this._backgroundColor = 0x000000;

    /**
     * The background color as an [R, G, B] array.
     *
     * @member {number[]}
     * @private
     */
    _this._backgroundColorRgba = [0, 0, 0, 0];

    /**
     * The background color as a string.
     *
     * @member {string}
     * @private
     */
    _this._backgroundColorString = '#000000';

    _this.backgroundColor = options.backgroundColor || _this._backgroundColor; // run bg color setter

    /**
     * This temporary display object used as the parent of the currently being rendered item
     *
     * @member {PIXI.DisplayObject}
     * @private
     */
    _this._tempDisplayObjectParent = new Container();

    /**
     * The last root object that the renderer tried to render.
     *
     * @member {PIXI.DisplayObject}
     * @private
     */
    _this._lastObjectRendered = _this._tempDisplayObjectParent;
    return _this;
  }

  /**
   * Resizes the canvas view to the specified width and height
   *
   * @param {number} width - the new width of the canvas view
   * @param {number} height - the new height of the canvas view
   */


  createClass(SystemRenderer, [{
    key: 'resize',
    value: function resize(width, height) {
      this.width = width * this.resolution;
      this.height = height * this.resolution;

      this.view.width = this.width;
      this.view.height = this.height;

      if (this.autoResize) {
        this.view.style.width = this.width / this.resolution + 'px';
        this.view.style.height = this.height / this.resolution + 'px';
      }
    }

    /**
     * Useful function that returns a texture of the display object that can then be used to create sprites
     * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
     *
     * @param {PIXI.DisplayObject} displayObject - The displayObject the object will be generated from
     * @param {number} scaleMode - Should be one of the scaleMode consts
     * @param {number} resolution - The resolution / device pixel ratio of the texture being generated
     * @return {PIXI.Texture} a texture of the graphics object
     */

  }, {
    key: 'generateTexture',
    value: function generateTexture(displayObject, scaleMode, resolution) {
      var bounds = displayObject.getLocalBounds();

      var renderTexture = RenderTexture.create(bounds.width | 0, bounds.height | 0, scaleMode, resolution);

      tempMatrix.tx = -bounds.x;
      tempMatrix.ty = -bounds.y;

      this.render(displayObject, renderTexture, false, tempMatrix, true);

      return renderTexture;
    }

    /**
     * Removes everything from the renderer and optionally removes the Canvas DOM element.
     *
     * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
     */

  }, {
    key: 'destroy',
    value: function destroy(removeView) {
      if (removeView && this.view.parentNode) {
        this.view.parentNode.removeChild(this.view);
      }

      this.type = RENDERER_TYPE.UNKNOWN;

      this.width = 0;
      this.height = 0;

      this.view = null;

      this.resolution = 0;

      this.transparent = false;

      this.autoResize = false;

      this.blendModes = null;

      this.preserveDrawingBuffer = false;
      this.clearBeforeRender = false;

      this.roundPixels = false;

      this._backgroundColor = 0;
      this._backgroundColorRgba = null;
      this._backgroundColorString = null;

      this.backgroundColor = 0;
      this._tempDisplayObjectParent = null;
      this._lastObjectRendered = null;
    }

    /**
     * The background color to fill if not transparent
     *
     * @member {number}
     * @memberof PIXI.SystemRenderer#
     */

  }, {
    key: 'backgroundColor',
    get: function get() {
      return this._backgroundColor;
    }

    /**
     * Sets the background color.
     *
     * @param {number} value - The value to set to.
     */
    ,
    set: function set(value) {
      this._backgroundColor = value;
      this._backgroundColorString = hex2string(value);
      hex2rgb(value, this._backgroundColorRgba);
    }
  }]);
  return SystemRenderer;
}(index$2);

/**
 * A set of functions used to handle masking.
 *
 * @class
 * @memberof PIXI
 */

var CanvasMaskManager = function () {
    /**
     * @param {PIXI.CanvasRenderer} renderer - The canvas renderer.
     */
    function CanvasMaskManager(renderer) {
        classCallCheck(this, CanvasMaskManager);

        this.renderer = renderer;
    }

    /**
     * This method adds it to the current stack of masks.
     *
     * @param {object} maskData - the maskData that will be pushed
     */


    createClass(CanvasMaskManager, [{
        key: 'pushMask',
        value: function pushMask(maskData) {
            var renderer = this.renderer;

            renderer.context.save();

            var cacheAlpha = maskData.alpha;
            var transform = maskData.transform.worldTransform;
            var resolution = renderer.resolution;

            renderer.context.setTransform(transform.a * resolution, transform.b * resolution, transform.c * resolution, transform.d * resolution, transform.tx * resolution, transform.ty * resolution);

            // TODO suport sprite alpha masks??
            // lots of effort required. If demand is great enough..
            if (!maskData._texture) {
                this.renderGraphicsShape(maskData);
                renderer.context.clip();
            }

            maskData.worldAlpha = cacheAlpha;
        }

        /**
         * Renders a PIXI.Graphics shape.
         *
         * @param {PIXI.Graphics} graphics - The object to render.
         */

    }, {
        key: 'renderGraphicsShape',
        value: function renderGraphicsShape(graphics) {
            var context = this.renderer.context;
            var len = graphics.graphicsData.length;

            if (len === 0) {
                return;
            }

            context.beginPath();

            for (var i = 0; i < len; i++) {
                var data = graphics.graphicsData[i];
                var shape = data.shape;

                if (data.type === SHAPES.POLY) {
                    var points = shape.points;

                    context.moveTo(points[0], points[1]);

                    for (var j = 1; j < points.length / 2; j++) {
                        context.lineTo(points[j * 2], points[j * 2 + 1]);
                    }

                    // if the first and last point are the same close the path - much neater :)
                    if (points[0] === points[points.length - 2] && points[1] === points[points.length - 1]) {
                        context.closePath();
                    }
                } else if (data.type === SHAPES.RECT) {
                    context.rect(shape.x, shape.y, shape.width, shape.height);
                    context.closePath();
                } else if (data.type === SHAPES.CIRC) {
                    // TODO - need to be Undefined!
                    context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                    context.closePath();
                } else if (data.type === SHAPES.ELIP) {
                    // ellipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas

                    var w = shape.width * 2;
                    var h = shape.height * 2;

                    var x = shape.x - w / 2;
                    var y = shape.y - h / 2;

                    var kappa = 0.5522848;
                    var ox = w / 2 * kappa; // control point offset horizontal
                    var oy = h / 2 * kappa; // control point offset vertical
                    var xe = x + w; // x-end
                    var ye = y + h; // y-end
                    var xm = x + w / 2; // x-middle
                    var ym = y + h / 2; // y-middle

                    context.moveTo(x, ym);
                    context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                    context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                    context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                    context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                    context.closePath();
                } else if (data.type === SHAPES.RREC) {
                    var rx = shape.x;
                    var ry = shape.y;
                    var width = shape.width;
                    var height = shape.height;
                    var radius = shape.radius;

                    var maxRadius = Math.min(width, height) / 2 | 0;

                    radius = radius > maxRadius ? maxRadius : radius;

                    context.moveTo(rx, ry + radius);
                    context.lineTo(rx, ry + height - radius);
                    context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
                    context.lineTo(rx + width - radius, ry + height);
                    context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
                    context.lineTo(rx + width, ry + radius);
                    context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
                    context.lineTo(rx + radius, ry);
                    context.quadraticCurveTo(rx, ry, rx, ry + radius);
                    context.closePath();
                }
            }
        }

        /**
         * Restores the current drawing context to the state it was before the mask was applied.
         *
         * @param {PIXI.CanvasRenderer} renderer - The renderer context to use.
         */

    }, {
        key: 'popMask',
        value: function popMask(renderer) {
            renderer.context.restore();
        }

        /**
         * Destroys this canvas mask manager.
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            /* empty */
        }
    }]);
    return CanvasMaskManager;
}();

var RESOLUTION$3 = settings.RESOLUTION;

/**
 * Creates a Canvas element of the given size.
 *
 * @class
 * @memberof PIXI
 */

var CanvasRenderTarget = function () {
  /**
   * @param {number} width - the width for the newly created canvas
   * @param {number} height - the height for the newly created canvas
   * @param {number} [resolution=1] - The resolution / device pixel ratio of the canvas
   */
  function CanvasRenderTarget(width, height, resolution) {
    classCallCheck(this, CanvasRenderTarget);

    /**
     * The Canvas object that belongs to this CanvasRenderTarget.
     *
     * @member {HTMLCanvasElement}
     */
    this.canvas = document.createElement('canvas');

    /**
     * A CanvasRenderingContext2D object representing a two-dimensional rendering context.
     *
     * @member {CanvasRenderingContext2D}
     */
    this.context = this.canvas.getContext('2d');

    this.resolution = resolution || RESOLUTION$3;

    this.resize(width, height);
  }

  /**
   * Clears the canvas that was created by the CanvasRenderTarget class.
   *
   * @private
   */


  createClass(CanvasRenderTarget, [{
    key: 'clear',
    value: function clear() {
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Resizes the canvas to the specified width and height.
     *
     * @param {number} width - the new width of the canvas
     * @param {number} height - the new height of the canvas
     */

  }, {
    key: 'resize',
    value: function resize(width, height) {
      this.canvas.width = width * this.resolution;
      this.canvas.height = height * this.resolution;
    }

    /**
     * Destroys this canvas.
     *
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.context = null;
      this.canvas = null;
    }

    /**
     * The width of the canvas buffer in pixels.
     *
     * @member {number}
     * @memberof PIXI.CanvasRenderTarget#
     */

  }, {
    key: 'width',
    get: function get() {
      return this.canvas.width;
    }

    /**
     * Sets the width.
     *
     * @param {number} val - The value to set.
     */
    ,
    set: function set(val) {
      this.canvas.width = val;
    }

    /**
     * The height of the canvas buffer in pixels.
     *
     * @member {number}
     * @memberof PIXI.CanvasRenderTarget#
     */

  }, {
    key: 'height',
    get: function get() {
      return this.canvas.height;
    }

    /**
     * Sets the height.
     *
     * @param {number} val - The value to set.
     */
    ,
    set: function set(val) {
      this.canvas.height = val;
    }
  }]);
  return CanvasRenderTarget;
}();

/**
 * Creates a little colored canvas
 *
 * @ignore
 * @param {number} color - The color to make the canvas
 * @return {canvas} a small canvas element
 */
function createColoredCanvas(color) {
    var canvas = document.createElement('canvas');

    canvas.width = 6;
    canvas.height = 1;

    var context = canvas.getContext('2d');

    context.fillStyle = color;
    context.fillRect(0, 0, 6, 1);

    return canvas;
}

/**
 * Checks whether the Canvas BlendModes are supported by the current browser
 *
 * @return {boolean} whether they are supported
 */
function canUseNewCanvasBlendModes() {
    if (typeof document === 'undefined') {
        return false;
    }

    var magenta = createColoredCanvas('#ff00ff');
    var yellow = createColoredCanvas('#ffff00');

    var canvas = document.createElement('canvas');

    canvas.width = 6;
    canvas.height = 1;

    var context = canvas.getContext('2d');

    context.globalCompositeOperation = 'multiply';
    context.drawImage(magenta, 0, 0);
    context.drawImage(yellow, 2, 0);

    var imageData = context.getImageData(2, 0, 1, 1);

    if (!imageData) {
        return false;
    }

    var data = imageData.data;

    return data[0] === 255 && data[1] === 0 && data[2] === 0;
}

/**
 * Maps blend combinations to Canvas.
 *
 * @memberof PIXI
 * @function mapCanvasBlendModesToPixi
 * @private
 * @param {string[]} [array=[]] - The array to output into.
 * @return {string[]} Mapped modes.
 */
function mapCanvasBlendModesToPixi() {
    var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    if (canUseNewCanvasBlendModes()) {
        array[BLEND_MODES.NORMAL] = 'source-over';
        array[BLEND_MODES.ADD] = 'lighter'; // IS THIS OK???
        array[BLEND_MODES.MULTIPLY] = 'multiply';
        array[BLEND_MODES.SCREEN] = 'screen';
        array[BLEND_MODES.OVERLAY] = 'overlay';
        array[BLEND_MODES.DARKEN] = 'darken';
        array[BLEND_MODES.LIGHTEN] = 'lighten';
        array[BLEND_MODES.COLOR_DODGE] = 'color-dodge';
        array[BLEND_MODES.COLOR_BURN] = 'color-burn';
        array[BLEND_MODES.HARD_LIGHT] = 'hard-light';
        array[BLEND_MODES.SOFT_LIGHT] = 'soft-light';
        array[BLEND_MODES.DIFFERENCE] = 'difference';
        array[BLEND_MODES.EXCLUSION] = 'exclusion';
        array[BLEND_MODES.HUE] = 'hue';
        array[BLEND_MODES.SATURATION] = 'saturate';
        array[BLEND_MODES.COLOR] = 'color';
        array[BLEND_MODES.LUMINOSITY] = 'luminosity';
    } else {
        // this means that the browser does not support the cool new blend modes in canvas 'cough' ie 'cough'
        array[BLEND_MODES.NORMAL] = 'source-over';
        array[BLEND_MODES.ADD] = 'lighter'; // IS THIS OK???
        array[BLEND_MODES.MULTIPLY] = 'source-over';
        array[BLEND_MODES.SCREEN] = 'source-over';
        array[BLEND_MODES.OVERLAY] = 'source-over';
        array[BLEND_MODES.DARKEN] = 'source-over';
        array[BLEND_MODES.LIGHTEN] = 'source-over';
        array[BLEND_MODES.COLOR_DODGE] = 'source-over';
        array[BLEND_MODES.COLOR_BURN] = 'source-over';
        array[BLEND_MODES.HARD_LIGHT] = 'source-over';
        array[BLEND_MODES.SOFT_LIGHT] = 'source-over';
        array[BLEND_MODES.DIFFERENCE] = 'source-over';
        array[BLEND_MODES.EXCLUSION] = 'source-over';
        array[BLEND_MODES.HUE] = 'source-over';
        array[BLEND_MODES.SATURATION] = 'source-over';
        array[BLEND_MODES.COLOR] = 'source-over';
        array[BLEND_MODES.LUMINOSITY] = 'source-over';
    }

    return array;
}

/**
 * The CanvasRenderer draws the scene and all its content onto a 2d canvas. This renderer should
 * be used for browsers that do not support WebGL. Don't forget to add the CanvasRenderer.view to
 * your DOM or you will not see anything :)
 *
 * @class
 * @memberof PIXI
 * @extends PIXI.SystemRenderer
 */

var CanvasRenderer = function (_SystemRenderer) {
    inherits(CanvasRenderer, _SystemRenderer);

    /**
     * @param {number} [width=800] - the width of the canvas view
     * @param {number} [height=600] - the height of the canvas view
     * @param {object} [options] - The optional renderer parameters
     * @param {HTMLCanvasElement} [options.view] - the canvas to use as a view, optional
     * @param {boolean} [options.transparent=false] - If the render view is transparent, default false
     * @param {boolean} [options.autoResize=false] - If the render view is automatically resized, default false
     * @param {boolean} [options.antialias=false] - sets antialias (only applicable in chrome at the moment)
     * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer. The
     *  resolution of the renderer retina would be 2.
     * @param {boolean} [options.clearBeforeRender=true] - This sets if the CanvasRenderer will clear the canvas or
     *      not before the new render pass.
     * @param {number} [options.backgroundColor=0x000000] - The background color of the rendered area
     *  (shown if not transparent).
     * @param {boolean} [options.roundPixels=false] - If true Pixi will Math.floor() x/y values when rendering,
     *  stopping pixel interpolation.
     */
    function CanvasRenderer(width, height) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        classCallCheck(this, CanvasRenderer);

        var _this = possibleConstructorReturn(this, (CanvasRenderer.__proto__ || Object.getPrototypeOf(CanvasRenderer)).call(this, 'Canvas', width, height, options));

        _this.type = RENDERER_TYPE.CANVAS;

        /**
         * The canvas 2d context that everything is drawn with.
         *
         * @member {CanvasRenderingContext2D}
         */
        _this.rootContext = _this.view.getContext('2d', { alpha: _this.transparent });

        /**
         * Boolean flag controlling canvas refresh.
         *
         * @member {boolean}
         */
        _this.refresh = true;

        /**
         * Instance of a CanvasMaskManager, handles masking when using the canvas renderer.
         *
         * @member {PIXI.CanvasMaskManager}
         */
        _this.maskManager = new CanvasMaskManager(_this);

        /**
         * The canvas property used to set the canvas smoothing property.
         *
         * @member {string}
         */
        _this.smoothProperty = 'imageSmoothingEnabled';

        if (!_this.rootContext.imageSmoothingEnabled) {
            if (_this.rootContext.webkitImageSmoothingEnabled) {
                _this.smoothProperty = 'webkitImageSmoothingEnabled';
            } else if (_this.rootContext.mozImageSmoothingEnabled) {
                _this.smoothProperty = 'mozImageSmoothingEnabled';
            } else if (_this.rootContext.oImageSmoothingEnabled) {
                _this.smoothProperty = 'oImageSmoothingEnabled';
            } else if (_this.rootContext.msImageSmoothingEnabled) {
                _this.smoothProperty = 'msImageSmoothingEnabled';
            }
        }

        _this.initPlugins();

        _this.blendModes = mapCanvasBlendModesToPixi();
        _this._activeBlendMode = null;

        _this.context = null;
        _this.renderingToScreen = false;

        _this.resize(width, height);
        return _this;
    }

    /**
     * Renders the object to this canvas view
     *
     * @param {PIXI.DisplayObject} displayObject - The object to be rendered
     * @param {PIXI.RenderTexture} [renderTexture] - A render texture to be rendered to.
     *  If unset, it will render to the root context.
     * @param {boolean} [clear=false] - Whether to clear the canvas before drawing
     * @param {PIXI.Transform} [transform] - A transformation to be applied
     * @param {boolean} [skipUpdateTransform=false] - Whether to skip the update transform
     */


    createClass(CanvasRenderer, [{
        key: 'render',
        value: function render(displayObject, renderTexture, clear, transform, skipUpdateTransform) {
            if (!this.view) {
                return;
            }

            // can be handy to know!
            this.renderingToScreen = !renderTexture;

            this.emit('prerender');

            if (renderTexture) {
                renderTexture = renderTexture.baseTexture || renderTexture;

                if (!renderTexture._canvasRenderTarget) {
                    renderTexture._canvasRenderTarget = new CanvasRenderTarget(renderTexture.width, renderTexture.height, renderTexture.resolution);
                    renderTexture.source = renderTexture._canvasRenderTarget.canvas;
                    renderTexture.valid = true;
                }

                this.context = renderTexture._canvasRenderTarget.context;
                this.resolution = renderTexture._canvasRenderTarget.resolution;
            } else {
                this.context = this.rootContext;
            }

            var context = this.context;

            if (!renderTexture) {
                this._lastObjectRendered = displayObject;
            }

            if (!skipUpdateTransform) {
                // update the scene graph
                var cacheParent = displayObject.parent;
                var tempWt = this._tempDisplayObjectParent.transform.worldTransform;

                if (transform) {
                    transform.copy(tempWt);
                } else {
                    tempWt.identity();
                }

                displayObject.parent = this._tempDisplayObjectParent;
                displayObject.updateTransform();
                displayObject.parent = cacheParent;
                // displayObject.hitArea = //TODO add a temp hit area
            }

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.globalAlpha = 1;
            context.globalCompositeOperation = this.blendModes[BLEND_MODES.NORMAL];

            if (navigator.isCocoonJS && this.view.screencanvas) {
                context.fillStyle = 'black';
                context.clear();
            }

            if (clear !== undefined ? clear : this.clearBeforeRender) {
                if (this.renderingToScreen) {
                    if (this.transparent) {
                        context.clearRect(0, 0, this.width, this.height);
                    } else {
                        context.fillStyle = this._backgroundColorString;
                        context.fillRect(0, 0, this.width, this.height);
                    }
                } // else {
                // TODO: implement background for CanvasRenderTarget or RenderTexture?
                // }
            }

            // TODO RENDER TARGET STUFF HERE..
            var tempContext = this.context;

            this.context = context;
            displayObject.renderCanvas(this);
            this.context = tempContext;

            this.emit('postrender');
        }

        /**
         * Sets the blend mode of the renderer.
         *
         * @param {number} blendMode - See {@link PIXI.BLEND_MODES} for valid values.
         */

    }, {
        key: 'setBlendMode',
        value: function setBlendMode(blendMode) {
            if (this._activeBlendMode === blendMode) {
                return;
            }

            this._activeBlendMode = blendMode;
            this.context.globalCompositeOperation = this.blendModes[blendMode];
        }

        /**
         * Removes everything from the renderer and optionally removes the Canvas DOM element.
         *
         * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
         */

    }, {
        key: 'destroy',
        value: function destroy(removeView) {
            this.destroyPlugins();

            // call the base destroy
            get$1(CanvasRenderer.prototype.__proto__ || Object.getPrototypeOf(CanvasRenderer.prototype), 'destroy', this).call(this, removeView);

            this.context = null;

            this.refresh = true;

            this.maskManager.destroy();
            this.maskManager = null;

            this.smoothProperty = null;
        }

        /**
         * Resizes the canvas view to the specified width and height.
         *
         * @extends PIXI.SystemRenderer#resize
         *
         * @param {number} width - The new width of the canvas view
         * @param {number} height - The new height of the canvas view
         */

    }, {
        key: 'resize',
        value: function resize(width, height) {
            get$1(CanvasRenderer.prototype.__proto__ || Object.getPrototypeOf(CanvasRenderer.prototype), 'resize', this).call(this, width, height);

            // reset the scale mode.. oddly this seems to be reset when the canvas is resized.
            // surely a browser bug?? Let pixi fix that for you..
            if (this.smoothProperty) {
                this.rootContext[this.smoothProperty] = settings.SCALE_MODE === SCALE_MODES.LINEAR;
            }
        }
    }]);
    return CanvasRenderer;
}(SystemRenderer);

pluginTarget$1.mixin(CanvasRenderer);

/**
 * @class
 * @memberof PIXI
 */
var WebGLManager = function () {
  /**
   * @param {PIXI.WebGLRenderer} renderer - The renderer this manager works for.
   */
  function WebGLManager(renderer) {
    classCallCheck(this, WebGLManager);

    /**
     * The renderer this manager works for.
     *
     * @member {PIXI.WebGLRenderer}
     */
    this.renderer = renderer;

    this.renderer.on('context', this.onContextChange, this);
  }

  /**
   * Generic method called when there is a WebGL context change.
   *
   */


  createClass(WebGLManager, [{
    key: 'onContextChange',
    value: function onContextChange() {}
    // do some codes init!


    /**
     * Generic destroy methods to be overridden by the subclass
     *
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.renderer.off('context', this.onContextChange, this);

      this.renderer = null;
    }
  }]);
  return WebGLManager;
}();

var defaultValue = glCore__default.shader.defaultValue;

function extractUniformsFromSrc(vertexSrc, fragmentSrc, mask) {
    var vertUniforms = extractUniformsFromString(vertexSrc, mask);
    var fragUniforms = extractUniformsFromString(fragmentSrc, mask);

    return Object.assign(vertUniforms, fragUniforms);
}

function extractUniformsFromString(string) {
    var maskRegex = new RegExp('^(projectionMatrix|uSampler|filterArea)$');

    var uniforms = {};
    var nameSplit = void 0;

    // clean the lines a little - remove extra spaces / tabs etc
    // then split along ';'
    var lines = string.replace(/\s+/g, ' ').split(/\s*;\s*/);

    // loop through..
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        if (line.indexOf('uniform') > -1) {
            var splitLine = line.split(' ');
            var type = splitLine[1];

            var name = splitLine[2];
            var size = 1;

            if (name.indexOf('[') > -1) {
                // array!
                nameSplit = name.split(/\[|]/);
                name = nameSplit[0];
                size *= Number(nameSplit[1]);
            }

            if (!name.match(maskRegex)) {
                uniforms[name] = {
                    value: defaultValue(type, size),
                    name: name,
                    type: type
                };
            }
        }
    }

    return uniforms;
}

var SOURCE_KEY_MAP = {};

// let math = require('../../../math');
/**
 * @class
 * @memberof PIXI
 * @extends PIXI.Shader
 */

var Filter = function () {
  /**
   * @param {string} [vertexSrc] - The source of the vertex shader.
   * @param {string} [fragmentSrc] - The source of the fragment shader.
   * @param {object} [uniforms] - Custom uniforms to use to augment the built-in ones.
   */
  function Filter(vertexSrc, fragmentSrc, uniforms) {
    classCallCheck(this, Filter);

    /**
     * The vertex shader.
     *
     * @member {string}
     */
    this.vertexSrc = vertexSrc || Filter.defaultVertexSrc;

    /**
     * The fragment shader.
     *
     * @member {string}
     */
    this.fragmentSrc = fragmentSrc || Filter.defaultFragmentSrc;

    this.blendMode = BLEND_MODES.NORMAL;

    // pull out the vertex and shader uniforms if they are not specified..
    // currently this does not extract structs only default types
    this.uniformData = uniforms || extractUniformsFromSrc(this.vertexSrc, this.fragmentSrc, 'projectionMatrix|uSampler');

    /**
     * An object containing the current values of custom uniforms.
     * @example <caption>Updating the value of a custom uniform</caption>
     * filter.uniforms.time = performance.now();
     *
     * @member {object}
     */
    this.uniforms = {};

    for (var i in this.uniformData) {
      this.uniforms[i] = this.uniformData[i].value;
    }

    // this is where we store shader references..
    // TODO we could cache this!
    this.glShaders = {};

    // used for cacheing.. sure there is a better way!
    if (!SOURCE_KEY_MAP[this.vertexSrc + this.fragmentSrc]) {
      SOURCE_KEY_MAP[this.vertexSrc + this.fragmentSrc] = uid();
    }

    this.glShaderKey = SOURCE_KEY_MAP[this.vertexSrc + this.fragmentSrc];

    /**
     * The padding of the filter. Some filters require extra space to breath such as a blur.
     * Increasing this will add extra width and height to the bounds of the object that the
     * filter is applied to.
     *
     * @member {number}
     */
    this.padding = 4;

    /**
     * The resolution of the filter. Setting this to be lower will lower the quality but
     * increase the performance of the filter.
     *
     * @member {number}
     */
    this.resolution = 1;

    /**
     * If enabled is true the filter is applied, if false it will not.
     *
     * @member {boolean}
     */
    this.enabled = true;
  }

  /**
   * Applies the filter
   *
   * @param {PIXI.FilterManager} filterManager - The renderer to retrieve the filter from
   * @param {PIXI.RenderTarget} input - The input render target.
   * @param {PIXI.RenderTarget} output - The target to output to.
   * @param {boolean} clear - Should the output be cleared before rendering to it
   */


  createClass(Filter, [{
    key: 'apply',
    value: function apply(filterManager, input, output, clear) {
      // --- //
      //  this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(tempMatrix, window.panda );

      // do as you please!

      filterManager.applyFilter(this, input, output, clear);

      // or just do a regular render..
    }

    /**
     * The default vertex shader source
     *
     * @static
     * @constant
     */

  }], [{
    key: 'defaultVertexSrc',
    get: function get() {
      return ['attribute vec2 aVertexPosition;', 'attribute vec2 aTextureCoord;', 'uniform mat3 projectionMatrix;', 'uniform mat3 filterMatrix;', 'varying vec2 vTextureCoord;', 'varying vec2 vFilterCoord;', 'void main(void){', '   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);', '   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;', '   vTextureCoord = aTextureCoord ;', '}'].join('\n');
    }

    /**
     * The default fragment shader source
     *
     * @static
     * @constant
     */

  }, {
    key: 'defaultFragmentSrc',
    get: function get() {
      return ['varying vec2 vTextureCoord;', 'varying vec2 vFilterCoord;', 'uniform sampler2D uSampler;', 'uniform sampler2D filterSampler;', 'void main(void){', '   vec4 masky = texture2D(filterSampler, vFilterCoord);', '   vec4 sample = texture2D(uSampler, vTextureCoord);', '   vec4 color;', '   if(mod(vFilterCoord.x, 1.0) > 0.5)', '   {', '     color = vec4(1.0, 0.0, 0.0, 1.0);', '   }', '   else', '   {', '     color = vec4(0.0, 1.0, 0.0, 1.0);', '   }',
      // '   gl_FragColor = vec4(mod(vFilterCoord.x, 1.5), vFilterCoord.y,0.0,1.0);',
      '   gl_FragColor = mix(sample, masky, 0.5);', '   gl_FragColor *= sample.a;', '}'].join('\n');
    }
  }]);
  return Filter;
}();

/**
 * The SpriteMaskFilter class
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI
 */

var SpriteMaskFilter = function (_Filter) {
    inherits(SpriteMaskFilter, _Filter);

    /**
     * @param {PIXI.Sprite} sprite - the target sprite
     */
    function SpriteMaskFilter(sprite) {
        classCallCheck(this, SpriteMaskFilter);

        var maskMatrix = new Matrix();

        var _this = possibleConstructorReturn(this, (SpriteMaskFilter.__proto__ || Object.getPrototypeOf(SpriteMaskFilter)).call(this, fs.readFileSync(path.join(__dirname, './spriteMaskFilter.vert'), 'utf8'), fs.readFileSync(path.join(__dirname, './spriteMaskFilter.frag'), 'utf8')));

        sprite.renderable = false;

        _this.maskSprite = sprite;
        _this.maskMatrix = maskMatrix;
        return _this;
    }

    /**
     * Applies the filter
     *
     * @param {PIXI.FilterManager} filterManager - The renderer to retrieve the filter from
     * @param {PIXI.RenderTarget} input - The input render target.
     * @param {PIXI.RenderTarget} output - The target to output to.
     */


    createClass(SpriteMaskFilter, [{
        key: 'apply',
        value: function apply(filterManager, input, output) {
            var maskSprite = this.maskSprite;

            this.uniforms.mask = maskSprite._texture;
            this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite);
            this.uniforms.alpha = maskSprite.worldAlpha;

            filterManager.applyFilter(this, input, output);
        }
    }]);
    return SpriteMaskFilter;
}(Filter);

/**
 * @class
 * @extends PIXI.WebGLManager
 * @memberof PIXI
 */

var MaskManager = function (_WebGLManager) {
    inherits(MaskManager, _WebGLManager);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this manager works for.
     */
    function MaskManager(renderer) {
        classCallCheck(this, MaskManager);

        // TODO - we don't need both!
        var _this = possibleConstructorReturn(this, (MaskManager.__proto__ || Object.getPrototypeOf(MaskManager)).call(this, renderer));

        _this.scissor = false;
        _this.scissorData = null;
        _this.scissorRenderTarget = null;

        _this.enableScissor = true;

        _this.alphaMaskPool = [];
        _this.alphaMaskIndex = 0;
        return _this;
    }

    /**
     * Applies the Mask and adds it to the current filter stack.
     *
     * @param {PIXI.DisplayObject} target - Display Object to push the mask to
     * @param {PIXI.Sprite|PIXI.Graphics} maskData - The masking data.
     */


    createClass(MaskManager, [{
        key: 'pushMask',
        value: function pushMask(target, maskData) {
            if (maskData.texture) {
                this.pushSpriteMask(target, maskData);
            } else if (this.enableScissor && !this.scissor && !this.renderer.stencilManager.stencilMaskStack.length && maskData.isFastRect()) {
                var matrix = maskData.worldTransform;

                var rot = Math.atan2(matrix.b, matrix.a);

                // use the nearest degree!
                rot = Math.round(rot * (180 / Math.PI));

                if (rot % 90) {
                    this.pushStencilMask(maskData);
                } else {
                    this.pushScissorMask(target, maskData);
                }
            } else {
                this.pushStencilMask(maskData);
            }
        }

        /**
         * Removes the last mask from the mask stack and doesn't return it.
         *
         * @param {PIXI.DisplayObject} target - Display Object to pop the mask from
         * @param {PIXI.Sprite|PIXI.Graphics} maskData - The masking data.
         */

    }, {
        key: 'popMask',
        value: function popMask(target, maskData) {
            if (maskData.texture) {
                this.popSpriteMask(target, maskData);
            } else if (this.enableScissor && !this.renderer.stencilManager.stencilMaskStack.length) {
                this.popScissorMask(target, maskData);
            } else {
                this.popStencilMask(target, maskData);
            }
        }

        /**
         * Applies the Mask and adds it to the current filter stack.
         *
         * @param {PIXI.RenderTarget} target - Display Object to push the sprite mask to
         * @param {PIXI.Sprite} maskData - Sprite to be used as the mask
         */

    }, {
        key: 'pushSpriteMask',
        value: function pushSpriteMask(target, maskData) {
            var alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];

            if (!alphaMaskFilter) {
                alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new SpriteMaskFilter(maskData)];
            }

            alphaMaskFilter[0].resolution = this.renderer.resolution;
            alphaMaskFilter[0].maskSprite = maskData;

            // TODO - may cause issues!
            target.filterArea = maskData.getBounds(true);

            this.renderer.filterManager.pushFilter(target, alphaMaskFilter);

            this.alphaMaskIndex++;
        }

        /**
         * Removes the last filter from the filter stack and doesn't return it.
         *
         */

    }, {
        key: 'popSpriteMask',
        value: function popSpriteMask() {
            this.renderer.filterManager.popFilter();
            this.alphaMaskIndex--;
        }

        /**
         * Applies the Mask and adds it to the current filter stack.
         *
         * @param {PIXI.Sprite|PIXI.Graphics} maskData - The masking data.
         */

    }, {
        key: 'pushStencilMask',
        value: function pushStencilMask(maskData) {
            this.renderer.currentRenderer.stop();
            this.renderer.stencilManager.pushStencil(maskData);
        }

        /**
         * Removes the last filter from the filter stack and doesn't return it.
         *
         */

    }, {
        key: 'popStencilMask',
        value: function popStencilMask() {
            this.renderer.currentRenderer.stop();
            this.renderer.stencilManager.popStencil();
        }

        /**
         *
         * @param {PIXI.DisplayObject} target - Display Object to push the mask to
         * @param {PIXI.Graphics} maskData - The masking data.
         */

    }, {
        key: 'pushScissorMask',
        value: function pushScissorMask(target, maskData) {
            maskData.renderable = true;

            var renderTarget = this.renderer._activeRenderTarget;

            var bounds = maskData.getBounds();

            bounds.fit(renderTarget.size);
            maskData.renderable = false;

            this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST);

            var resolution = this.renderer.resolution;

            this.renderer.gl.scissor(bounds.x * resolution, (renderTarget.root ? renderTarget.size.height - bounds.y - bounds.height : bounds.y) * resolution, bounds.width * resolution, bounds.height * resolution);

            this.scissorRenderTarget = renderTarget;
            this.scissorData = maskData;
            this.scissor = true;
        }

        /**
         *
         *
         */

    }, {
        key: 'popScissorMask',
        value: function popScissorMask() {
            this.scissorRenderTarget = null;
            this.scissorData = null;
            this.scissor = false;

            // must be scissor!
            var gl = this.renderer.gl;

            gl.disable(gl.SCISSOR_TEST);
        }
    }]);
    return MaskManager;
}(WebGLManager);

/**
 * @class
 * @extends PIXI.WebGLManager
 * @memberof PIXI
 */

var StencilManager = function (_WebGLManager) {
    inherits(StencilManager, _WebGLManager);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this manager works for.
     */
    function StencilManager(renderer) {
        classCallCheck(this, StencilManager);

        var _this = possibleConstructorReturn(this, (StencilManager.__proto__ || Object.getPrototypeOf(StencilManager)).call(this, renderer));

        _this.stencilMaskStack = null;
        return _this;
    }

    /**
     * Changes the mask stack that is used by this manager.
     *
     * @param {PIXI.Graphics[]} stencilMaskStack - The mask stack
     */


    createClass(StencilManager, [{
        key: 'setMaskStack',
        value: function setMaskStack(stencilMaskStack) {
            this.stencilMaskStack = stencilMaskStack;

            var gl = this.renderer.gl;

            if (stencilMaskStack.length === 0) {
                gl.disable(gl.STENCIL_TEST);
            } else {
                gl.enable(gl.STENCIL_TEST);
            }
        }

        /**
         * Applies the Mask and adds it to the current filter stack. @alvin
         *
         * @param {PIXI.Graphics} graphics - The mask
         */

    }, {
        key: 'pushStencil',
        value: function pushStencil(graphics) {
            this.renderer.setObjectRenderer(this.renderer.plugins.graphics);

            this.renderer._activeRenderTarget.attachStencilBuffer();

            var gl = this.renderer.gl;
            var sms = this.stencilMaskStack;

            if (sms.length === 0) {
                gl.enable(gl.STENCIL_TEST);
                gl.clear(gl.STENCIL_BUFFER_BIT);
                gl.stencilFunc(gl.ALWAYS, 1, 1);
            }

            sms.push(graphics);

            gl.colorMask(false, false, false, false);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

            this.renderer.plugins.graphics.render(graphics);

            gl.colorMask(true, true, true, true);
            gl.stencilFunc(gl.NOTEQUAL, 0, sms.length);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        }

        /**
         * TODO @alvin
         */

    }, {
        key: 'popStencil',
        value: function popStencil() {
            this.renderer.setObjectRenderer(this.renderer.plugins.graphics);

            var gl = this.renderer.gl;
            var sms = this.stencilMaskStack;

            var graphics = sms.pop();

            if (sms.length === 0) {
                // the stack is empty!
                gl.disable(gl.STENCIL_TEST);
            } else {
                gl.colorMask(false, false, false, false);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);

                this.renderer.plugins.graphics.render(graphics);

                gl.colorMask(true, true, true, true);
                gl.stencilFunc(gl.NOTEQUAL, 0, sms.length);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            }
        }

        /**
         * Destroys the mask stack.
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            WebGLManager.prototype.destroy.call(this);

            this.stencilMaskStack.stencilStack = null;
        }
    }]);
    return StencilManager;
}(WebGLManager);

var RESOLUTION$4 = settings.RESOLUTION;
var SCALE_MODE$2 = settings.SCALE_MODE;

/**
 * @class
 * @memberof PIXI
 */

var RenderTarget = function () {
  /**
   * @param {WebGLRenderingContext} gl - The current WebGL drawing context
   * @param {number} [width=0] - the horizontal range of the filter
   * @param {number} [height=0] - the vertical range of the filter
   * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES} for possible values
   * @param {number} [resolution=1] - The current resolution / device pixel ratio
   * @param {boolean} [root=false] - Whether this object is the root element or not
   */
  function RenderTarget(gl, width, height, scaleMode, resolution, root) {
    classCallCheck(this, RenderTarget);

    // TODO Resolution could go here ( eg low res blurs )

    /**
     * The current WebGL drawing context.
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    // next time to create a frame buffer and texture

    /**
     * A frame buffer
     *
     * @member {PIXI.glCore.GLFramebuffer}
     */
    this.frameBuffer = null;

    /**
     * The texture
     *
     * @member {PIXI.glCore.GLTexture}
     */
    this.texture = null;

    /**
     * The background colour of this render target, as an array of [r,g,b,a] values
     *
     * @member {number[]}
     */
    this.clearColor = [0, 0, 0, 0];

    /**
     * The size of the object as a rectangle
     *
     * @member {PIXI.Rectangle}
     */
    this.size = new Rectangle(0, 0, 1, 1);

    /**
     * The current resolution / device pixel ratio
     *
     * @member {number}
     * @default 1
     */
    this.resolution = resolution || RESOLUTION$4;

    /**
     * The projection matrix
     *
     * @member {PIXI.Matrix}
     */
    this.projectionMatrix = new Matrix();

    /**
     * The object's transform
     *
     * @member {PIXI.Matrix}
     */
    this.transform = null;

    /**
     * The frame.
     *
     * @member {PIXI.Rectangle}
     */
    this.frame = null;

    /**
     * The stencil buffer stores masking data for the render target
     *
     * @member {glCore.GLBuffer}
     */
    this.defaultFrame = new Rectangle();
    this.destinationFrame = null;
    this.sourceFrame = null;

    /**
     * The stencil buffer stores masking data for the render target
     *
     * @member {glCore.GLBuffer}
     */
    this.stencilBuffer = null;

    /**
     * The data structure for the stencil masks
     *
     * @member {PIXI.Graphics[]}
     */
    this.stencilMaskStack = [];

    /**
     * Stores filter data for the render target
     *
     * @member {object[]}
     */
    this.filterData = null;

    /**
     * The scale mode.
     *
     * @member {number}
     * @default PIXI.settings.SCALE_MODE
     * @see PIXI.SCALE_MODES
     */
    this.scaleMode = scaleMode || SCALE_MODE$2;

    /**
     * Whether this object is the root element or not
     *
     * @member {boolean}
     */
    this.root = root;

    if (!this.root) {
      this.frameBuffer = glCore.GLFramebuffer.createRGBA(gl, 100, 100);

      if (this.scaleMode === SCALE_MODES.NEAREST) {
        this.frameBuffer.texture.enableNearestScaling();
      } else {
        this.frameBuffer.texture.enableLinearScaling();
      }
      /*
          A frame buffer needs a target to render to..
          create a texture and bind it attach it to the framebuffer..
       */

      // this is used by the base texture
      this.texture = this.frameBuffer.texture;
    } else {
      // make it a null framebuffer..
      this.frameBuffer = new glCore.GLFramebuffer(gl, 100, 100);
      this.frameBuffer.framebuffer = null;
    }

    this.setFrame();

    this.resize(width, height);
  }

  /**
   * Clears the filter texture.
   *
   * @param {number[]} [clearColor=this.clearColor] - Array of [r,g,b,a] to clear the framebuffer
   */


  createClass(RenderTarget, [{
    key: 'clear',
    value: function clear(clearColor) {
      var cc = clearColor || this.clearColor;

      this.frameBuffer.clear(cc[0], cc[1], cc[2], cc[3]); // r,g,b,a);
    }

    /**
     * Binds the stencil buffer.
     *
     */

  }, {
    key: 'attachStencilBuffer',
    value: function attachStencilBuffer() {
      // TODO check if stencil is done?
      /**
       * The stencil buffer is used for masking in pixi
       * lets create one and then add attach it to the framebuffer..
       */
      if (!this.root) {
        this.frameBuffer.enableStencil();
      }
    }

    /**
     * Sets the frame of the render target.
     *
     * @param {Rectangle} destinationFrame - The destination frame.
     * @param {Rectangle} sourceFrame - The source frame.
     */

  }, {
    key: 'setFrame',
    value: function setFrame(destinationFrame, sourceFrame) {
      this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
      this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
    }

    /**
     * Binds the buffers and initialises the viewport.
     *
     */

  }, {
    key: 'activate',
    value: function activate() {
      // TOOD refactor usage of frame..
      var gl = this.gl;

      // make sure the texture is unbound!
      this.frameBuffer.bind();

      this.calculateProjection(this.destinationFrame, this.sourceFrame);

      if (this.transform) {
        this.projectionMatrix.append(this.transform);
      }

      // TODO add a check as them may be the same!
      if (this.destinationFrame !== this.sourceFrame) {
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
      } else {
        gl.disable(gl.SCISSOR_TEST);
      }

      // TODO - does not need to be updated all the time??
      gl.viewport(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
    }

    /**
     * Updates the projection matrix based on a projection frame (which is a rectangle)
     *
     * @param {Rectangle} destinationFrame - The destination frame.
     * @param {Rectangle} sourceFrame - The source frame.
     */

  }, {
    key: 'calculateProjection',
    value: function calculateProjection(destinationFrame, sourceFrame) {
      var pm = this.projectionMatrix;

      sourceFrame = sourceFrame || destinationFrame;

      pm.identity();

      // TODO: make dest scale source
      if (!this.root) {
        pm.a = 1 / destinationFrame.width * 2;
        pm.d = 1 / destinationFrame.height * 2;

        pm.tx = -1 - sourceFrame.x * pm.a;
        pm.ty = -1 - sourceFrame.y * pm.d;
      } else {
        pm.a = 1 / destinationFrame.width * 2;
        pm.d = -1 / destinationFrame.height * 2;

        pm.tx = -1 - sourceFrame.x * pm.a;
        pm.ty = 1 - sourceFrame.y * pm.d;
      }
    }

    /**
     * Resizes the texture to the specified width and height
     *
     * @param {number} width - the new width of the texture
     * @param {number} height - the new height of the texture
     */

  }, {
    key: 'resize',
    value: function resize(width, height) {
      width = width | 0;
      height = height | 0;

      if (this.size.width === width && this.size.height === height) {
        return;
      }

      this.size.width = width;
      this.size.height = height;

      this.defaultFrame.width = width;
      this.defaultFrame.height = height;

      this.frameBuffer.resize(width * this.resolution, height * this.resolution);

      var projectionFrame = this.frame || this.size;

      this.calculateProjection(projectionFrame);
    }

    /**
     * Destroys the render target.
     *
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.frameBuffer.destroy();

      this.frameBuffer = null;
      this.texture = null;
    }
  }]);
  return RenderTarget;
}();

/**
 * Generic Mask Stack data structure
 *
 * @memberof PIXI
 * @function createIndicesForQuads
 * @private
 * @param {number} size - Number of quads
 * @return {Uint16Array} indices
 */
function createIndicesForQuads(size) {
    // the total number of indices in our array, there are 6 points per quad.

    var totalIndices = size * 6;

    var indices = new Uint16Array(totalIndices);

    // fill the indices with the quads to draw
    for (var i = 0, j = 0; i < totalIndices; i += 6, j += 4) {
        indices[i + 0] = j + 0;
        indices[i + 1] = j + 1;
        indices[i + 2] = j + 2;
        indices[i + 3] = j + 0;
        indices[i + 4] = j + 2;
        indices[i + 5] = j + 3;
    }

    return indices;
}

/**
 * Helper class to create a quad
 *
 * @class
 * @memberof PIXI
 */

var Quad = function () {
  /**
   * @param {WebGLRenderingContext} gl - The gl context for this quad to use.
   * @param {object} state - TODO: Description
   */
  function Quad(gl, state) {
    classCallCheck(this, Quad);

    /*
     * the current WebGL drawing context
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    /**
     * An array of vertices
     *
     * @member {Float32Array}
     */
    this.vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);

    /**
     * The Uvs of the quad
     *
     * @member {Float32Array}
     */
    this.uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);

    this.interleaved = new Float32Array(8 * 2);

    for (var i = 0; i < 4; i++) {
      this.interleaved[i * 4] = this.vertices[i * 2];
      this.interleaved[i * 4 + 1] = this.vertices[i * 2 + 1];
      this.interleaved[i * 4 + 2] = this.uvs[i * 2];
      this.interleaved[i * 4 + 3] = this.uvs[i * 2 + 1];
    }

    /*
     * @member {Uint16Array} An array containing the indices of the vertices
     */
    this.indices = createIndicesForQuads(1);

    /*
     * @member {glCore.GLBuffer} The vertex buffer
     */
    this.vertexBuffer = glCore__default.GLBuffer.createVertexBuffer(gl, this.interleaved, gl.STATIC_DRAW);

    /*
     * @member {glCore.GLBuffer} The index buffer
     */
    this.indexBuffer = glCore__default.GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);

    /*
     * @member {glCore.VertexArrayObject} The index buffer
     */
    this.vao = new glCore__default.VertexArrayObject(gl, state);
  }

  /**
   * Initialises the vaos and uses the shader.
   *
   * @param {PIXI.Shader} shader - the shader to use
   */


  createClass(Quad, [{
    key: 'initVao',
    value: function initVao(shader) {
      this.vao.clear().addIndex(this.indexBuffer).addAttribute(this.vertexBuffer, shader.attributes.aVertexPosition, this.gl.FLOAT, false, 4 * 4, 0).addAttribute(this.vertexBuffer, shader.attributes.aTextureCoord, this.gl.FLOAT, false, 4 * 4, 2 * 4);
    }

    /**
     * Maps two Rectangle to the quad.
     *
     * @param {PIXI.Rectangle} targetTextureFrame - the first rectangle
     * @param {PIXI.Rectangle} destinationFrame - the second rectangle
     * @return {PIXI.Quad} Returns itself.
     */

  }, {
    key: 'map',
    value: function map(targetTextureFrame, destinationFrame) {
      var x = 0; // destinationFrame.x / targetTextureFrame.width;
      var y = 0; // destinationFrame.y / targetTextureFrame.height;

      this.uvs[0] = x;
      this.uvs[1] = y;

      this.uvs[2] = x + destinationFrame.width / targetTextureFrame.width;
      this.uvs[3] = y;

      this.uvs[4] = x + destinationFrame.width / targetTextureFrame.width;
      this.uvs[5] = y + destinationFrame.height / targetTextureFrame.height;

      this.uvs[6] = x;
      this.uvs[7] = y + destinationFrame.height / targetTextureFrame.height;

      x = destinationFrame.x;
      y = destinationFrame.y;

      this.vertices[0] = x;
      this.vertices[1] = y;

      this.vertices[2] = x + destinationFrame.width;
      this.vertices[3] = y;

      this.vertices[4] = x + destinationFrame.width;
      this.vertices[5] = y + destinationFrame.height;

      this.vertices[6] = x;
      this.vertices[7] = y + destinationFrame.height;

      return this;
    }

    /**
     * Binds the buffer and uploads the data
     *
     * @return {PIXI.Quad} Returns itself.
     */

  }, {
    key: 'upload',
    value: function upload() {
      for (var i = 0; i < 4; i++) {
        this.interleaved[i * 4] = this.vertices[i * 2];
        this.interleaved[i * 4 + 1] = this.vertices[i * 2 + 1];
        this.interleaved[i * 4 + 2] = this.uvs[i * 2];
        this.interleaved[i * 4 + 3] = this.uvs[i * 2 + 1];
      }

      this.vertexBuffer.upload(this.interleaved);

      return this;
    }

    /**
     * Removes this quad from WebGL
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var gl = this.gl;

      gl.deleteBuffer(this.vertexBuffer);
      gl.deleteBuffer(this.indexBuffer);
    }
  }]);
  return Quad;
}();

var PRECISION$1 = settings.PRECISION;


function checkPrecision(src) {
    if (src instanceof Array) {
        if (src[0].substring(0, 9) !== 'precision') {
            var copy = src.slice(0);

            copy.unshift('precision ' + PRECISION$1 + ' float;');

            return copy;
        }
    } else if (src.substring(0, 9) !== 'precision') {
        return 'precision ' + PRECISION$1 + ' float;\n' + src;
    }

    return src;
}

/**
 * Wrapper class, webGL Shader for Pixi.
 * Adds precision string if vertexSrc or fragmentSrc have no mention of it.
 *
 * @class
 * @extends GLShader
 * @memberof PIXI
 */

var Shader = function (_GLShader) {
    inherits(Shader, _GLShader);

    /**
     *
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {string|string[]} vertexSrc - The vertex shader source as an array of strings.
     * @param {string|string[]} fragmentSrc - The fragment shader source as an array of strings.
     */
    function Shader(gl, vertexSrc, fragmentSrc) {
        classCallCheck(this, Shader);
        return possibleConstructorReturn(this, (Shader.__proto__ || Object.getPrototypeOf(Shader)).call(this, gl, checkPrecision(vertexSrc), checkPrecision(fragmentSrc)));
    }

    return Shader;
}(glCore.GLShader);

/*
 * Calculates the mapped matrix
 * @param filterArea {Rectangle} The filter area
 * @param sprite {Sprite} the target sprite
 * @param outputMatrix {Matrix} @alvin
 */
// TODO playing around here.. this is temporary - (will end up in the shader)
// this returns a matrix that will normalise map filter cords in the filter to screen space
function calculateScreenSpaceMatrix$1(outputMatrix, filterArea, textureSize) {
    // let worldTransform = sprite.worldTransform.copy(Matrix.TEMP_MATRIX),
    // let texture = {width:1136, height:700};//sprite._texture.baseTexture;

    // TODO unwrap?
    var mappedMatrix = outputMatrix.identity();

    mappedMatrix.translate(filterArea.x / textureSize.width, filterArea.y / textureSize.height);

    mappedMatrix.scale(textureSize.width, textureSize.height);

    return mappedMatrix;
}

function calculateNormalizedScreenSpaceMatrix$1(outputMatrix, filterArea, textureSize) {
    var mappedMatrix = outputMatrix.identity();

    mappedMatrix.translate(filterArea.x / textureSize.width, filterArea.y / textureSize.height);

    var translateScaleX = textureSize.width / filterArea.width;
    var translateScaleY = textureSize.height / filterArea.height;

    mappedMatrix.scale(translateScaleX, translateScaleY);

    return mappedMatrix;
}

// this will map the filter coord so that a texture can be used based on the transform of a sprite
function calculateSpriteMatrix$1(outputMatrix, filterArea, textureSize, sprite) {
    var worldTransform = sprite.worldTransform.copy(Matrix.TEMP_MATRIX);
    var texture = sprite._texture.baseTexture;

    // TODO unwrap?
    var mappedMatrix = outputMatrix.identity();

    // scale..
    var ratio = textureSize.height / textureSize.width;

    mappedMatrix.translate(filterArea.x / textureSize.width, filterArea.y / textureSize.height);

    mappedMatrix.scale(1, ratio);

    var translateScaleX = textureSize.width / texture.width;
    var translateScaleY = textureSize.height / texture.height;

    worldTransform.tx /= texture.width * translateScaleX;

    // this...?  free beer for anyone who can explain why this makes sense!
    worldTransform.ty /= texture.width * translateScaleX;
    // worldTransform.ty /= texture.height * translateScaleY;

    worldTransform.invert();
    mappedMatrix.prepend(worldTransform);

    // apply inverse scale..
    mappedMatrix.scale(1, 1 / ratio);

    mappedMatrix.scale(translateScaleX, translateScaleY);

    mappedMatrix.translate(sprite.anchor.x, sprite.anchor.y);

    return mappedMatrix;
}

/**
 * @ignore
 * @class
 */

var FilterState =
/**
 *
 */
function FilterState() {
    classCallCheck(this, FilterState);

    this.renderTarget = null;
    this.sourceFrame = new Rectangle();
    this.destinationFrame = new Rectangle();
    this.filters = [];
    this.target = null;
    this.resolution = 1;
};

/**
 * @class
 * @memberof PIXI
 * @extends PIXI.WebGLManager
 */


var FilterManager = function (_WebGLManager) {
    inherits(FilterManager, _WebGLManager);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this manager works for.
     */
    function FilterManager(renderer) {
        classCallCheck(this, FilterManager);

        var _this = possibleConstructorReturn(this, (FilterManager.__proto__ || Object.getPrototypeOf(FilterManager)).call(this, renderer));

        _this.gl = _this.renderer.gl;
        // know about sprites!
        _this.quad = new Quad(_this.gl, renderer.state.attribState);

        _this.shaderCache = {};
        // todo add default!
        _this.pool = {};

        _this.filterData = null;
        return _this;
    }

    /**
     * Adds a new filter to the manager.
     *
     * @param {PIXI.DisplayObject} target - The target of the filter to render.
     * @param {PIXI.Filter[]} filters - The filters to apply.
     */


    createClass(FilterManager, [{
        key: 'pushFilter',
        value: function pushFilter(target, filters) {
            var renderer = this.renderer;

            var filterData = this.filterData;

            if (!filterData) {
                filterData = this.renderer._activeRenderTarget.filterStack;

                // add new stack
                var filterState = new FilterState();

                filterState.sourceFrame = filterState.destinationFrame = this.renderer._activeRenderTarget.size;
                filterState.renderTarget = renderer._activeRenderTarget;

                this.renderer._activeRenderTarget.filterData = filterData = {
                    index: 0,
                    stack: [filterState]
                };

                this.filterData = filterData;
            }

            // get the current filter state..
            var currentState = filterData.stack[++filterData.index];

            if (!currentState) {
                currentState = filterData.stack[filterData.index] = new FilterState();
            }

            // for now we go off the filter of the first resolution..
            var resolution = filters[0].resolution;
            var padding = filters[0].padding | 0;
            var targetBounds = target.filterArea || target.getBounds(true);
            var sourceFrame = currentState.sourceFrame;
            var destinationFrame = currentState.destinationFrame;

            sourceFrame.x = (targetBounds.x * resolution | 0) / resolution;
            sourceFrame.y = (targetBounds.y * resolution | 0) / resolution;
            sourceFrame.width = (targetBounds.width * resolution | 0) / resolution;
            sourceFrame.height = (targetBounds.height * resolution | 0) / resolution;

            if (filterData.stack[0].renderTarget.transform) {//

                // TODO we should fit the rect around the transform..
            } else {
                sourceFrame.fit(filterData.stack[0].destinationFrame);
            }

            // lets apply the padding After we fit the element to the screen.
            // this should stop the strange side effects that can occur when cropping to the edges
            sourceFrame.pad(padding);

            destinationFrame.width = sourceFrame.width;
            destinationFrame.height = sourceFrame.height;

            // lets play the padding after we fit the element to the screen.
            // this should stop the strange side effects that can occur when cropping to the edges

            var renderTarget = this.getPotRenderTarget(renderer.gl, sourceFrame.width, sourceFrame.height, resolution);

            currentState.target = target;
            currentState.filters = filters;
            currentState.resolution = resolution;
            currentState.renderTarget = renderTarget;

            // bind the render target to draw the shape in the top corner..

            renderTarget.setFrame(destinationFrame, sourceFrame);
            // bind the render target
            renderer.bindRenderTarget(renderTarget);

            // clear the renderTarget
            renderer.clear(); // [0.5,0.5,0.5, 1.0]);
        }

        /**
         * Pops off the filter and applies it.
         *
         */

    }, {
        key: 'popFilter',
        value: function popFilter() {
            var filterData = this.filterData;

            var lastState = filterData.stack[filterData.index - 1];
            var currentState = filterData.stack[filterData.index];

            this.quad.map(currentState.renderTarget.size, currentState.sourceFrame).upload();

            var filters = currentState.filters;

            if (filters.length === 1) {
                filters[0].apply(this, currentState.renderTarget, lastState.renderTarget, false);
                this.freePotRenderTarget(currentState.renderTarget);
            } else {
                var flip = currentState.renderTarget;
                var flop = this.getPotRenderTarget(this.renderer.gl, currentState.sourceFrame.width, currentState.sourceFrame.height, currentState.resolution);

                flop.setFrame(currentState.destinationFrame, currentState.sourceFrame);

                var i = 0;

                for (i = 0; i < filters.length - 1; ++i) {
                    filters[i].apply(this, flip, flop, true);

                    var t = flip;

                    flip = flop;
                    flop = t;
                }

                filters[i].apply(this, flip, lastState.renderTarget, false);

                this.freePotRenderTarget(flip);
                this.freePotRenderTarget(flop);
            }

            filterData.index--;

            if (filterData.index === 0) {
                this.filterData = null;
            }
        }

        /**
         * Draws a filter.
         *
         * @param {PIXI.Filter} filter - The filter to draw.
         * @param {PIXI.RenderTarget} input - The input render target.
         * @param {PIXI.RenderTarget} output - The target to output to.
         * @param {boolean} clear - Should the output be cleared before rendering to it
         */

    }, {
        key: 'applyFilter',
        value: function applyFilter(filter, input, output, clear) {
            var renderer = this.renderer;
            var gl = renderer.gl;

            var shader = filter.glShaders[renderer.CONTEXT_UID];

            // cacheing..
            if (!shader) {
                if (filter.glShaderKey) {
                    shader = this.shaderCache[filter.glShaderKey];

                    if (!shader) {
                        shader = new Shader(this.gl, filter.vertexSrc, filter.fragmentSrc);

                        filter.glShaders[renderer.CONTEXT_UID] = this.shaderCache[filter.glShaderKey] = shader;
                    }
                } else {
                    shader = filter.glShaders[renderer.CONTEXT_UID] = new Shader(this.gl, filter.vertexSrc, filter.fragmentSrc);
                }

                // TODO - this only needs to be done once?
                renderer.bindVao(null);

                this.quad.initVao(shader);
            }

            renderer.bindVao(this.quad.vao);

            renderer.bindRenderTarget(output);

            if (clear) {
                gl.disable(gl.SCISSOR_TEST);
                renderer.clear(); // [1, 1, 1, 1]);
                gl.enable(gl.SCISSOR_TEST);
            }

            // in case the render target is being masked using a scissor rect
            if (output === renderer.maskManager.scissorRenderTarget) {
                renderer.maskManager.pushScissorMask(null, renderer.maskManager.scissorData);
            }

            renderer.bindShader(shader);

            // this syncs the pixi filters  uniforms with glsl uniforms
            this.syncUniforms(shader, filter);

            renderer.state.setBlendMode(filter.blendMode);

            // temporary bypass cache..
            var tex = this.renderer.boundTextures[0];

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, input.texture.texture);

            this.quad.vao.draw(this.renderer.gl.TRIANGLES, 6, 0);

            // restore cache.
            gl.bindTexture(gl.TEXTURE_2D, tex._glTextures[this.renderer.CONTEXT_UID].texture);
        }

        /**
         * Uploads the uniforms of the filter.
         *
         * @param {GLShader} shader - The underlying gl shader.
         * @param {PIXI.Filter} filter - The filter we are synchronizing.
         */

    }, {
        key: 'syncUniforms',
        value: function syncUniforms(shader, filter) {
            var uniformData = filter.uniformData;
            var uniforms = filter.uniforms;

            // 0 is reserved for the pixi texture so we start at 1!
            var textureCount = 1;
            var currentState = void 0;

            if (shader.uniforms.data.filterArea) {
                currentState = this.filterData.stack[this.filterData.index];
                var filterArea = shader.uniforms.filterArea;

                filterArea[0] = currentState.renderTarget.size.width;
                filterArea[1] = currentState.renderTarget.size.height;
                filterArea[2] = currentState.sourceFrame.x;
                filterArea[3] = currentState.sourceFrame.y;

                shader.uniforms.filterArea = filterArea;
            }

            // use this to clamp displaced texture coords so they belong to filterArea
            // see displacementFilter fragment shader for an example
            if (shader.uniforms.data.filterClamp) {
                currentState = this.filterData.stack[this.filterData.index];

                var filterClamp = shader.uniforms.filterClamp;

                filterClamp[0] = 0;
                filterClamp[1] = 0;
                filterClamp[2] = (currentState.sourceFrame.width - 1) / currentState.renderTarget.size.width;
                filterClamp[3] = (currentState.sourceFrame.height - 1) / currentState.renderTarget.size.height;

                shader.uniforms.filterClamp = filterClamp;
            }

            // TODO Cacheing layer..
            for (var i in uniformData) {
                if (uniformData[i].type === 'sampler2D' && uniforms[i] !== 0) {
                    if (uniforms[i].baseTexture) {
                        shader.uniforms[i] = this.renderer.bindTexture(uniforms[i].baseTexture, textureCount);
                    } else {
                        shader.uniforms[i] = textureCount;

                        // TODO
                        // this is helpful as renderTargets can also be set.
                        // Although thinking about it, we could probably
                        // make the filter texture cache return a RenderTexture
                        // rather than a renderTarget
                        var gl = this.renderer.gl;

                        gl.activeTexture(gl.TEXTURE0 + textureCount);
                        uniforms[i].texture.bind();
                    }

                    textureCount++;
                } else if (uniformData[i].type === 'mat3') {
                    // check if its pixi matrix..
                    if (uniforms[i].a !== undefined) {
                        shader.uniforms[i] = uniforms[i].toArray(true);
                    } else {
                        shader.uniforms[i] = uniforms[i];
                    }
                } else if (uniformData[i].type === 'vec2') {
                    // check if its a point..
                    if (uniforms[i].x !== undefined) {
                        var val = shader.uniforms[i] || new Float32Array(2);

                        val[0] = uniforms[i].x;
                        val[1] = uniforms[i].y;
                        shader.uniforms[i] = val;
                    } else {
                        shader.uniforms[i] = uniforms[i];
                    }
                } else if (uniformData[i].type === 'float') {
                    if (shader.uniforms.data[i].value !== uniformData[i]) {
                        shader.uniforms[i] = uniforms[i];
                    }
                } else {
                    shader.uniforms[i] = uniforms[i];
                }
            }
        }

        /**
         * Gets a render target from the pool, or creates a new one.
         *
         * @param {boolean} clear - Should we clear the render texture when we get it?
         * @param {number} resolution - The resolution of the target.
         * @return {PIXI.RenderTarget} The new render target
         */

    }, {
        key: 'getRenderTarget',
        value: function getRenderTarget(clear, resolution) {
            var currentState = this.filterData.stack[this.filterData.index];
            var renderTarget = this.getPotRenderTarget(this.renderer.gl, currentState.sourceFrame.width, currentState.sourceFrame.height, resolution || currentState.resolution);

            renderTarget.setFrame(currentState.destinationFrame, currentState.sourceFrame);

            return renderTarget;
        }

        /**
         * Returns a render target to the pool.
         *
         * @param {PIXI.RenderTarget} renderTarget - The render target to return.
         */

    }, {
        key: 'returnRenderTarget',
        value: function returnRenderTarget(renderTarget) {
            this.freePotRenderTarget(renderTarget);
        }

        /**
         * Calculates the mapped matrix.
         *
         * TODO playing around here.. this is temporary - (will end up in the shader)
         * this returns a matrix that will normalise map filter cords in the filter to screen space
         *
         * @param {PIXI.Matrix} outputMatrix - the matrix to output to.
         * @return {PIXI.Matrix} The mapped matrix.
         */

    }, {
        key: 'calculateScreenSpaceMatrix',
        value: function calculateScreenSpaceMatrix(outputMatrix) {
            var currentState = this.filterData.stack[this.filterData.index];

            return calculateScreenSpaceMatrix$1(outputMatrix, currentState.sourceFrame, currentState.renderTarget.size);
        }

        /**
         * Multiply vTextureCoord to this matrix to achieve (0,0,1,1) for filterArea
         *
         * @param {PIXI.Matrix} outputMatrix - The matrix to output to.
         * @return {PIXI.Matrix} The mapped matrix.
         */

    }, {
        key: 'calculateNormalizedScreenSpaceMatrix',
        value: function calculateNormalizedScreenSpaceMatrix(outputMatrix) {
            var currentState = this.filterData.stack[this.filterData.index];

            return calculateNormalizedScreenSpaceMatrix$1(outputMatrix, currentState.sourceFrame, currentState.renderTarget.size, currentState.destinationFrame);
        }

        /**
         * This will map the filter coord so that a texture can be used based on the transform of a sprite
         *
         * @param {PIXI.Matrix} outputMatrix - The matrix to output to.
         * @param {PIXI.Sprite} sprite - The sprite to map to.
         * @return {PIXI.Matrix} The mapped matrix.
         */

    }, {
        key: 'calculateSpriteMatrix',
        value: function calculateSpriteMatrix(outputMatrix, sprite) {
            var currentState = this.filterData.stack[this.filterData.index];

            return calculateSpriteMatrix$1(outputMatrix, currentState.sourceFrame, currentState.renderTarget.size, sprite);
        }

        /**
         * Destroys this Filter Manager.
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.shaderCache = [];
            this.emptyPool();
        }

        /**
         * Gets a Power-of-Two render texture.
         *
         * TODO move to a seperate class could be on renderer?
         * also - could cause issue with multiple contexts?
         *
         * @private
         * @param {WebGLRenderingContext} gl - The webgl rendering context
         * @param {number} minWidth - The minimum width of the render target.
         * @param {number} minHeight - The minimum height of the render target.
         * @param {number} resolution - The resolution of the render target.
         * @return {PIXI.RenderTarget} The new render target.
         */

    }, {
        key: 'getPotRenderTarget',
        value: function getPotRenderTarget(gl, minWidth, minHeight, resolution) {
            // TODO you could return a bigger texture if there is not one in the pool?
            minWidth = twiddle.nextPow2(minWidth * resolution);
            minHeight = twiddle.nextPow2(minHeight * resolution);

            var key = (minWidth & 0xFFFF) << 16 | minHeight & 0xFFFF;

            if (!this.pool[key]) {
                this.pool[key] = [];
            }

            var renderTarget = this.pool[key].pop();

            // creating render target will cause texture to be bound!
            if (!renderTarget) {
                // temporary bypass cache..
                var tex = this.renderer.boundTextures[0];

                gl.activeTexture(gl.TEXTURE0);

                // internally - this will cause a texture to be bound..
                renderTarget = new RenderTarget(gl, minWidth, minHeight, null, 1);

                // set the current one back
                gl.bindTexture(gl.TEXTURE_2D, tex._glTextures[this.renderer.CONTEXT_UID].texture);
            }

            // manually tweak the resolution...
            // this will not modify the size of the frame buffer, just its resolution.
            renderTarget.resolution = resolution;
            renderTarget.defaultFrame.width = renderTarget.size.width = minWidth / resolution;
            renderTarget.defaultFrame.height = renderTarget.size.height = minHeight / resolution;

            return renderTarget;
        }

        /**
         * Empties the texture pool.
         *
         */

    }, {
        key: 'emptyPool',
        value: function emptyPool() {
            for (var i in this.pool) {
                var textures = this.pool[i];

                if (textures) {
                    for (var j = 0; j < textures.length; j++) {
                        textures[j].destroy(true);
                    }
                }
            }

            this.pool = {};
        }

        /**
         * Frees a render target back into the pool.
         *
         * @param {PIXI.RenderTarget} renderTarget - The renderTarget to free
         */

    }, {
        key: 'freePotRenderTarget',
        value: function freePotRenderTarget(renderTarget) {
            var minWidth = renderTarget.size.width * renderTarget.resolution;
            var minHeight = renderTarget.size.height * renderTarget.resolution;
            var key = (minWidth & 0xFFFF) << 16 | minHeight & 0xFFFF;

            this.pool[key].push(renderTarget);
        }
    }]);
    return FilterManager;
}(WebGLManager);

/**
 * Base for a common object renderer that can be used as a system renderer plugin.
 *
 * @class
 * @extends PIXI.WebGLManager
 * @memberof PIXI
 */

var ObjectRenderer = function (_WebGLManager) {
  inherits(ObjectRenderer, _WebGLManager);

  function ObjectRenderer() {
    classCallCheck(this, ObjectRenderer);
    return possibleConstructorReturn(this, (ObjectRenderer.__proto__ || Object.getPrototypeOf(ObjectRenderer)).apply(this, arguments));
  }

  createClass(ObjectRenderer, [{
    key: 'start',

    /**
     * Starts the renderer and sets the shader
     *
     */
    value: function start() {}
    // set the shader..


    /**
     * Stops the renderer
     *
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.flush();
    }

    /**
     * Stub method for rendering content and emptying the current batch.
     *
     */

  }, {
    key: 'flush',
    value: function flush() {}
    // flush!


    /**
     * Renders an object
     *
     * @param {PIXI.DisplayObject} object - The object to render.
     */

  }, {
    key: 'render',
    value: function render(object) // eslint-disable-line no-unused-vars
    {
      // render the object
    }
  }]);
  return ObjectRenderer;
}(WebGLManager);

/**
 * Helper class to create a webGL Texture
 *
 * @class
 * @memberof PIXI
 */

var TextureManager = function () {
    /**
     * @param {PIXI.WebGLRenderer} renderer - A reference to the current renderer
     */
    function TextureManager(renderer) {
        classCallCheck(this, TextureManager);

        /**
         * A reference to the current renderer
         *
         * @member {PIXI.WebGLRenderer}
         */
        this.renderer = renderer;

        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = renderer.gl;

        /**
         * Track textures in the renderer so we can no longer listen to them on destruction.
         *
         * @member {Array<*>}
         * @private
         */
        this._managedTextures = [];
    }

    /**
     * Binds a texture.
     *
     */


    createClass(TextureManager, [{
        key: 'bindTexture',
        value: function bindTexture() {}
        // empty


        /**
         * Gets a texture.
         *
         */

    }, {
        key: 'getTexture',
        value: function getTexture() {}
        // empty


        /**
         * Updates and/or Creates a WebGL texture for the renderer's context.
         *
         * @param {PIXI.BaseTexture|PIXI.Texture} texture - the texture to update
         * @param {Number} location - the location the texture will be bound to.
         * @return {GLTexture} The gl texture.
         */

    }, {
        key: 'updateTexture',
        value: function updateTexture(texture, location) {
            // assume it good!
            // texture = texture.baseTexture || texture;
            location = location || 0;

            var gl = this.gl;

            var isRenderTexture = !!texture._glRenderTargets;

            if (!texture.hasLoaded) {
                return null;
            }

            gl.activeTexture(gl.TEXTURE0 + location);

            var glTexture = texture._glTextures[this.renderer.CONTEXT_UID];

            if (!glTexture) {
                if (isRenderTexture) {
                    var renderTarget = new RenderTarget(this.gl, texture.width, texture.height, texture.scaleMode, texture.resolution);

                    renderTarget.resize(texture.width, texture.height);
                    texture._glRenderTargets[this.renderer.CONTEXT_UID] = renderTarget;
                    glTexture = renderTarget.texture;
                } else {
                    glTexture = new glCore.GLTexture(this.gl, null, null, null, null);
                    glTexture.bind(location);
                    glTexture.premultiplyAlpha = true;
                    glTexture.upload(texture.source);
                }

                texture._glTextures[this.renderer.CONTEXT_UID] = glTexture;

                texture.on('update', this.updateTexture, this);
                texture.on('dispose', this.destroyTexture, this);

                this._managedTextures.push(texture);

                if (texture.isPowerOfTwo) {
                    if (texture.mipmap) {
                        glTexture.enableMipmap();
                    }

                    if (texture.wrapMode === WRAP_MODES.CLAMP) {
                        glTexture.enableWrapClamp();
                    } else if (texture.wrapMode === WRAP_MODES.REPEAT) {
                        glTexture.enableWrapRepeat();
                    } else {
                        glTexture.enableWrapMirrorRepeat();
                    }
                } else {
                    glTexture.enableWrapClamp();
                }

                if (texture.scaleMode === SCALE_MODES.NEAREST) {
                    glTexture.enableNearestScaling();
                } else {
                    glTexture.enableLinearScaling();
                }
            }
            // the texture already exists so we only need to update it..
            else if (isRenderTexture) {
                    texture._glRenderTargets[this.renderer.CONTEXT_UID].resize(texture.width, texture.height);
                } else {
                    glTexture.upload(texture.source);
                }

            this.renderer.boundTextures[location] = texture;

            return glTexture;
        }

        /**
         * Deletes the texture from WebGL
         *
         * @param {PIXI.BaseTexture|PIXI.Texture} texture - the texture to destroy
         * @param {boolean} [skipRemove=false] - Whether to skip removing the texture from the TextureManager.
         */

    }, {
        key: 'destroyTexture',
        value: function destroyTexture(texture, skipRemove) {
            texture = texture.baseTexture || texture;

            if (!texture.hasLoaded) {
                return;
            }

            if (texture._glTextures[this.renderer.CONTEXT_UID]) {
                this.renderer.unbindTexture(texture);

                texture._glTextures[this.renderer.CONTEXT_UID].destroy();
                texture.off('update', this.updateTexture, this);
                texture.off('dispose', this.destroyTexture, this);

                delete texture._glTextures[this.renderer.CONTEXT_UID];

                if (!skipRemove) {
                    var i = this._managedTextures.indexOf(texture);

                    if (i !== -1) {
                        removeItems(this._managedTextures, i, 1);
                    }
                }
            }
        }

        /**
         * Deletes all the textures from WebGL
         */

    }, {
        key: 'removeAll',
        value: function removeAll() {
            // empty all the old gl textures as they are useless now
            for (var i = 0; i < this._managedTextures.length; ++i) {
                var texture = this._managedTextures[i];

                if (texture._glTextures[this.renderer.CONTEXT_UID]) {
                    delete texture._glTextures[this.renderer.CONTEXT_UID];
                }
            }
        }

        /**
         * Destroys this manager and removes all its textures
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            // destroy managed textures
            for (var i = 0; i < this._managedTextures.length; ++i) {
                var texture = this._managedTextures[i];

                this.destroyTexture(texture, true);

                texture.off('update', this.updateTexture, this);
                texture.off('dispose', this.destroyTexture, this);
            }

            this._managedTextures = null;
        }
    }]);
    return TextureManager;
}();

var GC_MODE = settings.GC_MODE;
var GC_MAX_IDLE = settings.GC_MAX_IDLE;
var GC_MAX_CHECK_COUNT = settings.GC_MAX_CHECK_COUNT;

/**
 * TextureGarbageCollector. This class manages the GPU and ensures that it does not get clogged
 * up with textures that are no longer being used.
 *
 * @class
 * @memberof PIXI
 */

var TextureGarbageCollector = function () {
    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this manager works for.
     */
    function TextureGarbageCollector(renderer) {
        classCallCheck(this, TextureGarbageCollector);

        this.renderer = renderer;

        this.count = 0;
        this.checkCount = 0;
        this.maxIdle = GC_MAX_IDLE;
        this.checkCountMax = GC_MAX_CHECK_COUNT;
        this.mode = GC_MODE;
    }

    /**
     * Checks to see when the last time a texture was used
     * if the texture has not been used for a specified amount of time it will be removed from the GPU
     */


    createClass(TextureGarbageCollector, [{
        key: 'update',
        value: function update() {
            this.count++;

            if (this.mode === GC_MODES.MANUAL) {
                return;
            }

            this.checkCount++;

            if (this.checkCount > this.checkCountMax) {
                this.checkCount = 0;

                this.run();
            }
        }

        /**
         * Checks to see when the last time a texture was used
         * if the texture has not been used for a specified amount of time it will be removed from the GPU
         */

    }, {
        key: 'run',
        value: function run() {
            var tm = this.renderer.textureManager;
            var managedTextures = tm._managedTextures;
            var wasRemoved = false;

            for (var i = 0; i < managedTextures.length; i++) {
                var texture = managedTextures[i];

                // only supports non generated textures at the moment!
                if (!texture._glRenderTargets && this.count - texture.touched > this.maxIdle) {
                    tm.destroyTexture(texture, true);
                    managedTextures[i] = null;
                    wasRemoved = true;
                }
            }

            if (wasRemoved) {
                var j = 0;

                for (var _i = 0; _i < managedTextures.length; _i++) {
                    if (managedTextures[_i] !== null) {
                        managedTextures[j++] = managedTextures[_i];
                    }
                }

                managedTextures.length = j;
            }
        }

        /**
         * Removes all the textures within the specified displayObject and its children from the GPU
         *
         * @param {PIXI.DisplayObject} displayObject - the displayObject to remove the textures from.
         */

    }, {
        key: 'unload',
        value: function unload(displayObject) {
            var tm = this.renderer.textureManager;

            if (displayObject._texture) {
                tm.destroyTexture(displayObject._texture, true);
            }

            for (var i = displayObject.children.length - 1; i >= 0; i--) {
                this.unload(displayObject.children[i]);
            }
        }
    }]);
    return TextureGarbageCollector;
}();

/**
 * Maps gl blend combinations to WebGL.
 *
 * @memberof PIXI
 * @function mapWebGLBlendModesToPixi
 * @private
 * @param {WebGLRenderingContext} gl - The rendering context.
 * @param {string[]} [array=[]] - The array to output into.
 * @return {string[]} Mapped modes.
 */
function mapWebGLBlendModesToPixi(gl) {
    var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    // TODO - premultiply alpha would be different.
    // add a boolean for that!
    array[BLEND_MODES.NORMAL] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.ADD] = [gl.ONE, gl.DST_ALPHA];
    array[BLEND_MODES.MULTIPLY] = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.SCREEN] = [gl.ONE, gl.ONE_MINUS_SRC_COLOR];
    array[BLEND_MODES.OVERLAY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.DARKEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.LIGHTEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.COLOR_DODGE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.COLOR_BURN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.HARD_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.SOFT_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.DIFFERENCE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.EXCLUSION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.HUE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.SATURATION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.COLOR] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[BLEND_MODES.LUMINOSITY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];

    return array;
}

var BLEND = 0;
var DEPTH_TEST = 1;
var FRONT_FACE = 2;
var CULL_FACE = 3;
var BLEND_FUNC = 4;

/**
 * A WebGL state machines
 *
 * @memberof PIXI
 * @class
 */

var WebGLState = function () {
    /**
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     */
    function WebGLState(gl) {
        classCallCheck(this, WebGLState);

        /**
         * The current active state
         *
         * @member {Uint8Array}
         */
        this.activeState = new Uint8Array(16);

        /**
         * The default state
         *
         * @member {Uint8Array}
         */
        this.defaultState = new Uint8Array(16);

        // default blend mode..
        this.defaultState[0] = 1;

        /**
         * The current state index in the stack
         *
         * @member {number}
         * @private
         */
        this.stackIndex = 0;

        /**
         * The stack holding all the different states
         *
         * @member {Array<*>}
         * @private
         */
        this.stack = [];

        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        this.maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

        this.attribState = {
            tempAttribState: new Array(this.maxAttribs),
            attribState: new Array(this.maxAttribs)
        };

        this.blendModes = mapWebGLBlendModesToPixi(gl);

        // check we have vao..
        this.nativeVaoExtension = gl.getExtension('OES_vertex_array_object') || gl.getExtension('MOZ_OES_vertex_array_object') || gl.getExtension('WEBKIT_OES_vertex_array_object');
    }

    /**
     * Pushes a new active state
     */


    createClass(WebGLState, [{
        key: 'push',
        value: function push() {
            // next state..
            var state = this.stack[++this.stackIndex];

            if (!state) {
                state = this.stack[this.stackIndex] = new Uint8Array(16);
            }

            // copy state..
            // set active state so we can force overrides of gl state
            for (var i = 0; i < this.activeState.length; i++) {
                this.activeState[i] = state[i];
            }
        }

        /**
         * Pops a state out
         */

    }, {
        key: 'pop',
        value: function pop() {
            var state = this.stack[--this.stackIndex];

            this.setState(state);
        }

        /**
         * Sets the current state
         *
         * @param {*} state - The state to set.
         */

    }, {
        key: 'setState',
        value: function setState(state) {
            this.setBlend(state[BLEND]);
            this.setDepthTest(state[DEPTH_TEST]);
            this.setFrontFace(state[FRONT_FACE]);
            this.setCullFace(state[CULL_FACE]);
            this.setBlendMode(state[BLEND_FUNC]);
        }

        /**
         * Enables or disabled blending.
         *
         * @param {boolean} value - Turn on or off webgl blending.
         */

    }, {
        key: 'setBlend',
        value: function setBlend(value) {
            value = value ? 1 : 0;

            if (this.activeState[BLEND] === value) {
                return;
            }

            this.activeState[BLEND] = value;
            this.gl[value ? 'enable' : 'disable'](this.gl.BLEND);
        }

        /**
         * Sets the blend mode.
         *
         * @param {number} value - The blend mode to set to.
         */

    }, {
        key: 'setBlendMode',
        value: function setBlendMode(value) {
            if (value === this.activeState[BLEND_FUNC]) {
                return;
            }

            this.activeState[BLEND_FUNC] = value;

            this.gl.blendFunc(this.blendModes[value][0], this.blendModes[value][1]);
        }

        /**
         * Sets whether to enable or disable depth test.
         *
         * @param {boolean} value - Turn on or off webgl depth testing.
         */

    }, {
        key: 'setDepthTest',
        value: function setDepthTest(value) {
            value = value ? 1 : 0;

            if (this.activeState[DEPTH_TEST] === value) {
                return;
            }

            this.activeState[DEPTH_TEST] = value;
            this.gl[value ? 'enable' : 'disable'](this.gl.DEPTH_TEST);
        }

        /**
         * Sets whether to enable or disable cull face.
         *
         * @param {boolean} value - Turn on or off webgl cull face.
         */

    }, {
        key: 'setCullFace',
        value: function setCullFace(value) {
            value = value ? 1 : 0;

            if (this.activeState[CULL_FACE] === value) {
                return;
            }

            this.activeState[CULL_FACE] = value;
            this.gl[value ? 'enable' : 'disable'](this.gl.CULL_FACE);
        }

        /**
         * Sets the gl front face.
         *
         * @param {boolean} value - true is clockwise and false is counter-clockwise
         */

    }, {
        key: 'setFrontFace',
        value: function setFrontFace(value) {
            value = value ? 1 : 0;

            if (this.activeState[FRONT_FACE] === value) {
                return;
            }

            this.activeState[FRONT_FACE] = value;
            this.gl.frontFace(this.gl[value ? 'CW' : 'CCW']);
        }

        /**
         * Disables all the vaos in use
         *
         */

    }, {
        key: 'resetAttributes',
        value: function resetAttributes() {
            for (var i = 0; i < this.attribState.tempAttribState.length; i++) {
                this.attribState.tempAttribState[i] = 0;
            }

            for (var _i = 0; _i < this.attribState.attribState.length; _i++) {
                this.attribState.attribState[_i] = 0;
            }

            // im going to assume one is always active for performance reasons.
            for (var _i2 = 1; _i2 < this.maxAttribs; _i2++) {
                this.gl.disableVertexAttribArray(_i2);
            }
        }

        // used
        /**
         * Resets all the logic and disables the vaos
         */

    }, {
        key: 'resetToDefault',
        value: function resetToDefault() {
            // unbind any VAO if they exist..
            if (this.nativeVaoExtension) {
                this.nativeVaoExtension.bindVertexArrayOES(null);
            }

            // reset all attributes..
            this.resetAttributes();

            // set active state so we can force overrides of gl state
            for (var i = 0; i < this.activeState.length; ++i) {
                this.activeState[i] = 32;
            }

            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);

            this.setState(this.defaultState);
        }
    }]);
    return WebGLState;
}();

/**
 * Generic Mask Stack data structure.
 *
 * @memberof PIXI
 * @function mapWebGLDrawModesToPixi
 * @private
 * @param {WebGLRenderingContext} gl - The current WebGL drawing context
 * @param {object} [object={}] - The object to map into
 * @return {object} The mapped draw modes.
 */
function mapWebGLDrawModesToPixi(gl) {
  var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  object[DRAW_MODES.POINTS] = gl.POINTS;
  object[DRAW_MODES.LINES] = gl.LINES;
  object[DRAW_MODES.LINE_LOOP] = gl.LINE_LOOP;
  object[DRAW_MODES.LINE_STRIP] = gl.LINE_STRIP;
  object[DRAW_MODES.TRIANGLES] = gl.TRIANGLES;
  object[DRAW_MODES.TRIANGLE_STRIP] = gl.TRIANGLE_STRIP;
  object[DRAW_MODES.TRIANGLE_FAN] = gl.TRIANGLE_FAN;

  return object;
}

function validateContext(gl) {
    var attributes = gl.getContextAttributes();

    // this is going to be fairly simple for now.. but at least we have room to grow!
    if (!attributes.stencil) {
        /* eslint-disable no-console */
        console.warn('Provided WebGL context does not have a stencil buffer, masks may not render correctly');
        /* eslint-enable no-console */
    }
}

var CONTEXT_UID = 0;

/**
 * The WebGLRenderer draws the scene and all its content onto a webGL enabled canvas. This renderer
 * should be used for browsers that support webGL. This Render works by automatically managing webGLBatchs.
 * So no need for Sprite Batches or Sprite Clouds.
 * Don't forget to add the view to your DOM or you will not see anything :)
 *
 * @class
 * @memberof PIXI
 * @extends PIXI.SystemRenderer
 */

var WebGLRenderer = function (_SystemRenderer) {
    inherits(WebGLRenderer, _SystemRenderer);

    /**
     *
     * @param {number} [width=0] - the width of the canvas view
     * @param {number} [height=0] - the height of the canvas view
     * @param {object} [options] - The optional renderer parameters
     * @param {HTMLCanvasElement} [options.view] - the canvas to use as a view, optional
     * @param {boolean} [options.transparent=false] - If the render view is transparent, default false
     * @param {boolean} [options.autoResize=false] - If the render view is automatically resized, default false
     * @param {boolean} [options.antialias=false] - sets antialias. If not available natively then FXAA
     *  antialiasing is used
     * @param {boolean} [options.forceFXAA=false] - forces FXAA antialiasing to be used over native.
     *  FXAA is faster, but may not always look as great
     * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer.
     *  The resolution of the renderer retina would be 2.
     * @param {boolean} [options.clearBeforeRender=true] - This sets if the CanvasRenderer will clear
     *  the canvas or not before the new render pass. If you wish to set this to false, you *must* set
     *  preserveDrawingBuffer to `true`.
     * @param {boolean} [options.preserveDrawingBuffer=false] - enables drawing buffer preservation,
     *  enable this if you need to call toDataUrl on the webgl context.
     * @param {boolean} [options.roundPixels=false] - If true Pixi will Math.floor() x/y values when
     *  rendering, stopping pixel interpolation.
     */
    function WebGLRenderer(width, height) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        classCallCheck(this, WebGLRenderer);

        /**
         * The type of this renderer as a standardised const
         *
         * @member {number}
         * @see PIXI.RENDERER_TYPE
         */
        var _this = possibleConstructorReturn(this, (WebGLRenderer.__proto__ || Object.getPrototypeOf(WebGLRenderer)).call(this, 'WebGL', width, height, options));

        _this.type = RENDERER_TYPE.WEBGL;

        _this.handleContextLost = _this.handleContextLost.bind(_this);
        _this.handleContextRestored = _this.handleContextRestored.bind(_this);

        _this.view.addEventListener('webglcontextlost', _this.handleContextLost, false);
        _this.view.addEventListener('webglcontextrestored', _this.handleContextRestored, false);

        /**
         * The options passed in to create a new webgl context.
         *
         * @member {object}
         * @private
         */
        _this._contextOptions = {
            alpha: _this.transparent,
            antialias: options.antialias,
            premultipliedAlpha: _this.transparent && _this.transparent !== 'notMultiplied',
            stencil: true,
            preserveDrawingBuffer: options.preserveDrawingBuffer
        };

        _this._backgroundColorRgba[3] = _this.transparent ? 0 : 1;

        /**
         * Manages the masks using the stencil buffer.
         *
         * @member {PIXI.MaskManager}
         */
        _this.maskManager = new MaskManager(_this);

        /**
         * Manages the stencil buffer.
         *
         * @member {PIXI.StencilManager}
         */
        _this.stencilManager = new StencilManager(_this);

        /**
         * An empty renderer.
         *
         * @member {PIXI.ObjectRenderer}
         */
        _this.emptyRenderer = new ObjectRenderer(_this);

        /**
         * The currently active ObjectRenderer.
         *
         * @member {PIXI.ObjectRenderer}
         */
        _this.currentRenderer = _this.emptyRenderer;

        _this.initPlugins();

        /**
         * The current WebGL rendering context, it is created here
         *
         * @member {WebGLRenderingContext}
         */
        // initialize the context so it is ready for the managers.
        if (options.context) {
            // checks to see if a context is valid..
            validateContext(options.context);
        }

        _this.gl = options.context || glCore__default.createContext(_this.view, _this._contextOptions);

        _this.CONTEXT_UID = CONTEXT_UID++;

        /**
         * The currently active ObjectRenderer.
         *
         * @member {PIXI.WebGLState}
         */
        _this.state = new WebGLState(_this.gl);

        _this.renderingToScreen = true;

        /**
         * Holds the current state of textures bound to the GPU.
         * @type {Array}
         */
        _this.boundTextures = null;

        _this._initContext();
        /**
         * Manages the filters.
         *
         * @member {PIXI.FilterManager}
         */
        _this.filterManager = new FilterManager(_this);
        // map some webGL blend and drawmodes..
        _this.drawModes = mapWebGLDrawModesToPixi(_this.gl);

        /**
         * Holds the current shader
         *
         * @member {PIXI.Shader}
         */
        _this._activeShader = null;

        _this._activeVao = null;

        /**
         * Holds the current render target
         *
         * @member {PIXI.RenderTarget}
         */
        _this._activeRenderTarget = null;

        _this._nextTextureLocation = 0;

        _this.setBlendMode(0);
        return _this;
    }

    /**
     * Creates the WebGL context
     *
     * @private
     */


    createClass(WebGLRenderer, [{
        key: '_initContext',
        value: function _initContext() {
            var gl = this.gl;

            // restore a context if it was previously lost
            if (gl.isContextLost() && gl.getExtension('WEBGL_lose_context')) {
                gl.getExtension('WEBGL_lose_context').restoreContext();
            }

            var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

            this.boundTextures = new Array(maxTextures);
            this.emptyTextures = new Array(maxTextures);

            // create a texture manager...
            this.textureManager = new TextureManager(this);
            this.textureGC = new TextureGarbageCollector(this);

            this.state.resetToDefault();

            this.rootRenderTarget = new RenderTarget(gl, this.width, this.height, null, this.resolution, true);
            this.rootRenderTarget.clearColor = this._backgroundColorRgba;

            this.bindRenderTarget(this.rootRenderTarget);

            // now lets fill up the textures with empty ones!
            var emptyGLTexture = new glCore__default.GLTexture.fromData(gl, null, 1, 1);

            var tempObj = { _glTextures: {} };

            tempObj._glTextures[this.CONTEXT_UID] = {};

            for (var i = 0; i < maxTextures; i++) {
                var empty = new BaseTexture();

                empty._glTextures[this.CONTEXT_UID] = emptyGLTexture;

                this.boundTextures[i] = tempObj;
                this.emptyTextures[i] = empty;
                this.bindTexture(null, i);
            }

            this.emit('context', gl);

            // setup the width/height properties and gl viewport
            this.resize(this.width, this.height);
        }

        /**
         * Renders the object to its webGL view
         *
         * @param {PIXI.DisplayObject} displayObject - the object to be rendered
         * @param {PIXI.RenderTexture} renderTexture - The render texture to render to.
         * @param {boolean} [clear] - Should the canvas be cleared before the new render
         * @param {PIXI.Transform} [transform] - A transform to apply to the render texture before rendering.
         * @param {boolean} [skipUpdateTransform] - Should we skip the update transform pass?
         */

    }, {
        key: 'render',
        value: function render(displayObject, renderTexture, clear, transform, skipUpdateTransform) {
            // can be handy to know!
            this.renderingToScreen = !renderTexture;

            this.emit('prerender');

            // no point rendering if our context has been blown up!
            if (!this.gl || this.gl.isContextLost()) {
                return;
            }

            this._nextTextureLocation = 0;

            if (!renderTexture) {
                this._lastObjectRendered = displayObject;
            }

            if (!skipUpdateTransform) {
                // update the scene graph
                var cacheParent = displayObject.parent;

                displayObject.parent = this._tempDisplayObjectParent;
                displayObject.updateTransform();
                displayObject.parent = cacheParent;
                // displayObject.hitArea = //TODO add a temp hit area
            }

            this.bindRenderTexture(renderTexture, transform);

            this.currentRenderer.start();

            if (clear !== undefined ? clear : this.clearBeforeRender) {
                this._activeRenderTarget.clear();
            }

            displayObject.renderWebGL(this);

            // apply transform..
            this.currentRenderer.flush();

            // this.setObjectRenderer(this.emptyRenderer);

            this.textureGC.update();

            this.emit('postrender');
        }

        /**
         * Changes the current renderer to the one given in parameter
         *
         * @param {PIXI.ObjectRenderer} objectRenderer - The object renderer to use.
         */

    }, {
        key: 'setObjectRenderer',
        value: function setObjectRenderer(objectRenderer) {
            if (this.currentRenderer === objectRenderer) {
                return;
            }

            this.currentRenderer.stop();
            this.currentRenderer = objectRenderer;
            this.currentRenderer.start();
        }

        /**
         * This should be called if you wish to do some custom rendering
         * It will basically render anything that may be batched up such as sprites
         *
         */

    }, {
        key: 'flush',
        value: function flush() {
            this.setObjectRenderer(this.emptyRenderer);
        }

        /**
         * Resizes the webGL view to the specified width and height.
         *
         * @param {number} width - the new width of the webGL view
         * @param {number} height - the new height of the webGL view
         */

    }, {
        key: 'resize',
        value: function resize(width, height) {
            //  if(width * this.resolution === this.width && height * this.resolution === this.height)return;

            SystemRenderer.prototype.resize.call(this, width, height);

            this.rootRenderTarget.resize(width, height);

            if (this._activeRenderTarget === this.rootRenderTarget) {
                this.rootRenderTarget.activate();

                if (this._activeShader) {
                    this._activeShader.uniforms.projectionMatrix = this.rootRenderTarget.projectionMatrix.toArray(true);
                }
            }
        }

        /**
         * Resizes the webGL view to the specified width and height.
         *
         * @param {number} blendMode - the desired blend mode
         */

    }, {
        key: 'setBlendMode',
        value: function setBlendMode(blendMode) {
            this.state.setBlendMode(blendMode);
        }

        /**
         * Erases the active render target and fills the drawing area with a colour
         *
         * @param {number} [clearColor] - The colour
         */

    }, {
        key: 'clear',
        value: function clear(clearColor) {
            this._activeRenderTarget.clear(clearColor);
        }

        /**
         * Sets the transform of the active render target to the given matrix
         *
         * @param {PIXI.Matrix} matrix - The transformation matrix
         */

    }, {
        key: 'setTransform',
        value: function setTransform(matrix) {
            this._activeRenderTarget.transform = matrix;
        }

        /**
         * Binds a render texture for rendering
         *
         * @param {PIXI.RenderTexture} renderTexture - The render texture to render
         * @param {PIXI.Transform} transform - The transform to be applied to the render texture
         * @return {PIXI.WebGLRenderer} Returns itself.
         */

    }, {
        key: 'bindRenderTexture',
        value: function bindRenderTexture(renderTexture, transform) {
            var renderTarget = void 0;

            if (renderTexture) {
                var baseTexture = renderTexture.baseTexture;

                if (!baseTexture._glRenderTargets[this.CONTEXT_UID]) {
                    // bind the current texture
                    this.textureManager.updateTexture(baseTexture, 0);
                }

                this.unbindTexture(baseTexture);

                renderTarget = baseTexture._glRenderTargets[this.CONTEXT_UID];
                renderTarget.setFrame(renderTexture.frame);
            } else {
                renderTarget = this.rootRenderTarget;
            }

            renderTarget.transform = transform;
            this.bindRenderTarget(renderTarget);

            return this;
        }

        /**
         * Changes the current render target to the one given in parameter
         *
         * @param {PIXI.RenderTarget} renderTarget - the new render target
         * @return {PIXI.WebGLRenderer} Returns itself.
         */

    }, {
        key: 'bindRenderTarget',
        value: function bindRenderTarget(renderTarget) {
            if (renderTarget !== this._activeRenderTarget) {
                this._activeRenderTarget = renderTarget;
                renderTarget.activate();

                if (this._activeShader) {
                    this._activeShader.uniforms.projectionMatrix = renderTarget.projectionMatrix.toArray(true);
                }

                this.stencilManager.setMaskStack(renderTarget.stencilMaskStack);
            }

            return this;
        }

        /**
         * Changes the current shader to the one given in parameter
         *
         * @param {PIXI.Shader} shader - the new shader
         * @return {PIXI.WebGLRenderer} Returns itself.
         */

    }, {
        key: 'bindShader',
        value: function bindShader(shader) {
            // TODO cache
            if (this._activeShader !== shader) {
                this._activeShader = shader;
                shader.bind();

                // automatically set the projection matrix
                shader.uniforms.projectionMatrix = this._activeRenderTarget.projectionMatrix.toArray(true);
            }

            return this;
        }

        /**
         * Binds the texture. This will return the location of the bound texture.
         * It may not be the same as the one you pass in. This is due to optimisation that prevents
         * needless binding of textures. For example if the texture is already bound it will return the
         * current location of the texture instead of the one provided. To bypass this use force location
         *
         * @param {PIXI.Texture} texture - the new texture
         * @param {number} location - the suggested texture location
         * @param {boolean} forceLocation - force the location
         * @return {PIXI.WebGLRenderer} Returns itself.
         */

    }, {
        key: 'bindTexture',
        value: function bindTexture(texture, location, forceLocation) {
            texture = texture || this.emptyTextures[location];
            texture = texture.baseTexture || texture;
            texture.touched = this.textureGC.count;

            if (!forceLocation) {
                // TODO - maybe look into adding boundIds.. save us the loop?
                for (var i = 0; i < this.boundTextures.length; i++) {
                    if (this.boundTextures[i] === texture) {
                        return i;
                    }
                }

                if (location === undefined) {
                    this._nextTextureLocation++;
                    this._nextTextureLocation %= this.boundTextures.length;
                    location = this.boundTextures.length - this._nextTextureLocation - 1;
                }
            } else {
                location = location || 0;
            }

            var gl = this.gl;
            var glTexture = texture._glTextures[this.CONTEXT_UID];

            if (!glTexture) {
                // this will also bind the texture..
                this.textureManager.updateTexture(texture, location);
            } else {
                // bind the current texture
                this.boundTextures[location] = texture;
                gl.activeTexture(gl.TEXTURE0 + location);
                gl.bindTexture(gl.TEXTURE_2D, glTexture.texture);
            }

            return location;
        }

        /**
        * unbinds the texture ...
        *
        * @param {PIXI.Texture} texture - the texture to unbind
        * @return {PIXI.WebGLRenderer} Returns itself.
        */

    }, {
        key: 'unbindTexture',
        value: function unbindTexture(texture) {
            var gl = this.gl;

            texture = texture.baseTexture || texture;

            for (var i = 0; i < this.boundTextures.length; i++) {
                if (this.boundTextures[i] === texture) {
                    this.boundTextures[i] = this.emptyTextures[i];

                    gl.activeTexture(gl.TEXTURE0 + i);
                    gl.bindTexture(gl.TEXTURE_2D, this.emptyTextures[i]._glTextures[this.CONTEXT_UID].texture);
                }
            }

            return this;
        }

        /**
         * Creates a new VAO from this renderer's context and state.
         *
         * @return {VertexArrayObject} The new VAO.
         */

    }, {
        key: 'createVao',
        value: function createVao() {
            return new glCore__default.VertexArrayObject(this.gl, this.state.attribState);
        }

        /**
         * Changes the current Vao to the one given in parameter
         *
         * @param {PIXI.VertexArrayObject} vao - the new Vao
         * @return {PIXI.WebGLRenderer} Returns itself.
         */

    }, {
        key: 'bindVao',
        value: function bindVao(vao) {
            if (this._activeVao === vao) {
                return this;
            }

            if (vao) {
                vao.bind();
            } else if (this._activeVao) {
                // TODO this should always be true i think?
                this._activeVao.unbind();
            }

            this._activeVao = vao;

            return this;
        }

        /**
         * Resets the WebGL state so you can render things however you fancy!
         *
         * @return {PIXI.WebGLRenderer} Returns itself.
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.setObjectRenderer(this.emptyRenderer);

            this._activeShader = null;
            this._activeRenderTarget = this.rootRenderTarget;

            // bind the main frame buffer (the screen);
            this.rootRenderTarget.activate();

            this.state.resetToDefault();

            return this;
        }

        /**
         * Handles a lost webgl context
         *
         * @private
         * @param {WebGLContextEvent} event - The context lost event.
         */

    }, {
        key: 'handleContextLost',
        value: function handleContextLost(event) {
            event.preventDefault();
        }

        /**
         * Handles a restored webgl context
         *
         * @private
         */

    }, {
        key: 'handleContextRestored',
        value: function handleContextRestored() {
            this._initContext();
            this.textureManager.removeAll();
        }

        /**
         * Removes everything from the renderer (event listeners, spritebatch, etc...)
         *
         * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
         *  See: https://github.com/pixijs/pixi.js/issues/2233
         */

    }, {
        key: 'destroy',
        value: function destroy(removeView) {
            this.destroyPlugins();

            // remove listeners
            this.view.removeEventListener('webglcontextlost', this.handleContextLost);
            this.view.removeEventListener('webglcontextrestored', this.handleContextRestored);

            this.textureManager.destroy();

            // call base destroy
            get$1(WebGLRenderer.prototype.__proto__ || Object.getPrototypeOf(WebGLRenderer.prototype), 'destroy', this).call(this, removeView);

            this.uid = 0;

            // destroy the managers
            this.maskManager.destroy();
            this.stencilManager.destroy();
            this.filterManager.destroy();

            this.maskManager = null;
            this.filterManager = null;
            this.textureManager = null;
            this.currentRenderer = null;

            this.handleContextLost = null;
            this.handleContextRestored = null;

            this._contextOptions = null;
            this.gl.useProgram(null);

            if (this.gl.getExtension('WEBGL_lose_context')) {
                this.gl.getExtension('WEBGL_lose_context').loseContext();
            }

            this.gl = null;

            // this = null;
        }
    }]);
    return WebGLRenderer;
}(SystemRenderer);

pluginTarget$1.mixin(WebGLRenderer);

var tempPoint = new Point();

/**
 * The Sprite object is the base for all textured objects that are rendered to the screen
 *
 * A sprite can be created directly from an image like this:
 *
 * ```js
 * let sprite = new PIXI.Sprite.fromImage('assets/image.png');
 * ```
 *
 * @class
 * @extends PIXI.Container
 * @memberof PIXI
 */

var Sprite = function (_Container) {
    inherits(Sprite, _Container);

    /**
     * @param {PIXI.Texture} texture - The texture for this sprite
     */
    function Sprite(texture) {
        classCallCheck(this, Sprite);

        /**
         * The anchor sets the origin point of the texture.
         * The default is 0,0 this means the texture's origin is the top left
         * Setting the anchor to 0.5,0.5 means the texture's origin is centered
         * Setting the anchor to 1,1 would mean the texture's origin point will be the bottom right corner
         *
         * @member {PIXI.ObservablePoint}
         * @private
         */
        var _this = possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this));

        _this._anchor = new ObservablePoint(_this._onAnchorUpdate, _this);

        /**
         * The texture that the sprite is using
         *
         * @private
         * @member {PIXI.Texture}
         */
        _this._texture = null;

        /**
         * The width of the sprite (this is initially set by the texture)
         *
         * @private
         * @member {number}
         */
        _this._width = 0;

        /**
         * The height of the sprite (this is initially set by the texture)
         *
         * @private
         * @member {number}
         */
        _this._height = 0;

        /**
         * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
         *
         * @private
         * @member {number}
         * @default 0xFFFFFF
         */
        _this._tint = null;
        _this._tintRGB = null;
        _this.tint = 0xFFFFFF;

        /**
         * The blend mode to be applied to the sprite. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
         *
         * @member {number}
         * @default PIXI.BLEND_MODES.NORMAL
         * @see PIXI.BLEND_MODES
         */
        _this.blendMode = BLEND_MODES.NORMAL;

        /**
         * The shader that will be used to render the sprite. Set to null to remove a current shader.
         *
         * @member {PIXI.Filter|PIXI.Shader}
         */
        _this.shader = null;

        /**
         * An internal cached value of the tint.
         *
         * @private
         * @member {number}
         * @default 0xFFFFFF
         */
        _this.cachedTint = 0xFFFFFF;

        // call texture setter
        _this.texture = texture || Texture.EMPTY;

        /**
         * this is used to store the vertex data of the sprite (basically a quad)
         *
         * @private
         * @member {Float32Array}
         */
        _this.vertexData = new Float32Array(8);

        /**
         * This is used to calculate the bounds of the object IF it is a trimmed sprite
         *
         * @private
         * @member {Float32Array}
         */
        _this.vertexTrimmedData = null;

        _this._transformID = -1;
        _this._textureID = -1;
        return _this;
    }

    /**
     * When the texture is updated, this event will fire to update the scale and frame
     *
     * @private
     */


    createClass(Sprite, [{
        key: '_onTextureUpdate',
        value: function _onTextureUpdate() {
            this._textureID = -1;

            // so if _width is 0 then width was not set..
            if (this._width) {
                this.scale.x = sign(this.scale.x) * this._width / this.texture.orig.width;
            }

            if (this._height) {
                this.scale.y = sign(this.scale.y) * this._height / this.texture.orig.height;
            }
        }

        /**
         * Called when the anchor position updates.
         *
         * @private
         */

    }, {
        key: '_onAnchorUpdate',
        value: function _onAnchorUpdate() {
            this._transformID = -1;
        }

        /**
         * calculates worldTransform * vertices, store it in vertexData
         */

    }, {
        key: 'calculateVertices',
        value: function calculateVertices() {
            if (this._transformID === this.transform._worldID && this._textureID === this._texture._updateID) {
                return;
            }

            this._transformID = this.transform._worldID;
            this._textureID = this._texture._updateID;

            // set the vertex data

            var texture = this._texture;
            var wt = this.transform.worldTransform;
            var a = wt.a;
            var b = wt.b;
            var c = wt.c;
            var d = wt.d;
            var tx = wt.tx;
            var ty = wt.ty;
            var vertexData = this.vertexData;
            var trim = texture.trim;
            var orig = texture.orig;
            var anchor = this._anchor;

            var w0 = 0;
            var w1 = 0;
            var h0 = 0;
            var h1 = 0;

            if (trim) {
                // if the sprite is trimmed and is not a tilingsprite then we need to add the extra
                // space before transforming the sprite coords.
                w1 = trim.x - anchor._x * orig.width;
                w0 = w1 + trim.width;

                h1 = trim.y - anchor._y * orig.height;
                h0 = h1 + trim.height;
            } else {
                w0 = orig.width * (1 - anchor._x);
                w1 = orig.width * -anchor._x;

                h0 = orig.height * (1 - anchor._y);
                h1 = orig.height * -anchor._y;
            }

            // xy
            vertexData[0] = a * w1 + c * h1 + tx;
            vertexData[1] = d * h1 + b * w1 + ty;

            // xy
            vertexData[2] = a * w0 + c * h1 + tx;
            vertexData[3] = d * h1 + b * w0 + ty;

            // xy
            vertexData[4] = a * w0 + c * h0 + tx;
            vertexData[5] = d * h0 + b * w0 + ty;

            // xy
            vertexData[6] = a * w1 + c * h0 + tx;
            vertexData[7] = d * h0 + b * w1 + ty;
        }

        /**
         * calculates worldTransform * vertices for a non texture with a trim. store it in vertexTrimmedData
         * This is used to ensure that the true width and height of a trimmed texture is respected
         */

    }, {
        key: 'calculateTrimmedVertices',
        value: function calculateTrimmedVertices() {
            if (!this.vertexTrimmedData) {
                this.vertexTrimmedData = new Float32Array(8);
            }

            // lets do some special trim code!
            var texture = this._texture;
            var vertexData = this.vertexTrimmedData;
            var orig = texture.orig;
            var anchor = this._anchor;

            // lets calculate the new untrimmed bounds..
            var wt = this.transform.worldTransform;
            var a = wt.a;
            var b = wt.b;
            var c = wt.c;
            var d = wt.d;
            var tx = wt.tx;
            var ty = wt.ty;

            var w0 = orig.width * (1 - anchor._x);
            var w1 = orig.width * -anchor._x;

            var h0 = orig.height * (1 - anchor._y);
            var h1 = orig.height * -anchor._y;

            // xy
            vertexData[0] = a * w1 + c * h1 + tx;
            vertexData[1] = d * h1 + b * w1 + ty;

            // xy
            vertexData[2] = a * w0 + c * h1 + tx;
            vertexData[3] = d * h1 + b * w0 + ty;

            // xy
            vertexData[4] = a * w0 + c * h0 + tx;
            vertexData[5] = d * h0 + b * w0 + ty;

            // xy
            vertexData[6] = a * w1 + c * h0 + tx;
            vertexData[7] = d * h0 + b * w1 + ty;
        }

        /**
        *
        * Renders the object using the WebGL renderer
        *
        * @private
        * @param {PIXI.WebGLRenderer} renderer - The webgl renderer to use.
        */

    }, {
        key: '_renderWebGL',
        value: function _renderWebGL(renderer) {
            this.calculateVertices();

            renderer.setObjectRenderer(renderer.plugins.sprite);
            renderer.plugins.sprite.render(this);
        }

        /**
        * Renders the object using the Canvas renderer
        *
        * @private
        * @param {PIXI.CanvasRenderer} renderer - The renderer
        */

    }, {
        key: '_renderCanvas',
        value: function _renderCanvas(renderer) {
            renderer.plugins.sprite.render(this);
        }

        /**
         * Updates the bounds of the sprite.
         *
         * @private
         */

    }, {
        key: '_calculateBounds',
        value: function _calculateBounds() {
            var trim = this._texture.trim;
            var orig = this._texture.orig;

            // First lets check to see if the current texture has a trim..
            if (!trim || trim.width === orig.width && trim.height === orig.height) {
                // no trim! lets use the usual calculations..
                this.calculateVertices();
                this._bounds.addQuad(this.vertexData);
            } else {
                // lets calculate a special trimmed bounds...
                this.calculateTrimmedVertices();
                this._bounds.addQuad(this.vertexTrimmedData);
            }
        }

        /**
         * Gets the local bounds of the sprite object.
         *
         * @param {Rectangle} rect - The output rectangle.
         * @return {Rectangle} The bounds.
         */

    }, {
        key: 'getLocalBounds',
        value: function getLocalBounds(rect) {
            // we can do a fast local bounds if the sprite has no children!
            if (this.children.length === 0) {
                this._bounds.minX = this._texture.orig.width * -this._anchor._x;
                this._bounds.minY = this._texture.orig.height * -this._anchor._y;
                this._bounds.maxX = this._texture.orig.width * (1 - this._anchor._x);
                this._bounds.maxY = this._texture.orig.height * (1 - this._anchor._x);

                if (!rect) {
                    if (!this._localBoundsRect) {
                        this._localBoundsRect = new Rectangle();
                    }

                    rect = this._localBoundsRect;
                }

                return this._bounds.getRectangle(rect);
            }

            return get$1(Sprite.prototype.__proto__ || Object.getPrototypeOf(Sprite.prototype), 'getLocalBounds', this).call(this, rect);
        }

        /**
         * Tests if a point is inside this sprite
         *
         * @param {PIXI.Point} point - the point to test
         * @return {boolean} the result of the test
         */

    }, {
        key: 'containsPoint',
        value: function containsPoint(point) {
            this.worldTransform.applyInverse(point, tempPoint);

            var width = this._texture.orig.width;
            var height = this._texture.orig.height;
            var x1 = -width * this.anchor.x;
            var y1 = 0;

            if (tempPoint.x > x1 && tempPoint.x < x1 + width) {
                y1 = -height * this.anchor.y;

                if (tempPoint.y > y1 && tempPoint.y < y1 + height) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Destroys this sprite and optionally its texture and children
         *
         * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
         *  have been set to that value
         * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
         *      method called as well. 'options' will be passed on to those calls.
         * @param {boolean} [options.texture=false] - Should it destroy the current texture of the sprite as well
         * @param {boolean} [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
         */

    }, {
        key: 'destroy',
        value: function destroy(options) {
            get$1(Sprite.prototype.__proto__ || Object.getPrototypeOf(Sprite.prototype), 'destroy', this).call(this, options);

            this._anchor = null;

            var destroyTexture = typeof options === 'boolean' ? options : options && options.texture;

            if (destroyTexture) {
                var destroyBaseTexture = typeof options === 'boolean' ? options : options && options.baseTexture;

                this._texture.destroy(!!destroyBaseTexture);
            }

            this._texture = null;
            this.shader = null;
        }

        // some helper functions..

        /**
         * Helper function that creates a new sprite based on the source you provide.
         * The source can be - frame id, image url, video url, canvas element, video element, base texture
         *
         * @static
         * @param {number|string|PIXI.BaseTexture|HTMLCanvasElement|HTMLVideoElement} source Source to create texture from
         * @return {PIXI.Texture} The newly created texture
         */

    }, {
        key: 'width',


        /**
         * The width of the sprite, setting this will actually modify the scale to achieve the value set
         *
         * @member {number}
         * @memberof PIXI.Sprite#
         */
        get: function get() {
            return Math.abs(this.scale.x) * this.texture.orig.width;
        }

        /**
         * Sets the width of the sprite by modifying the scale.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            var s = sign(this.scale.x) || 1;

            this.scale.x = s * value / this.texture.orig.width;
            this._width = value;
        }

        /**
         * The height of the sprite, setting this will actually modify the scale to achieve the value set
         *
         * @member {number}
         * @memberof PIXI.Sprite#
         */

    }, {
        key: 'height',
        get: function get() {
            return Math.abs(this.scale.y) * this.texture.orig.height;
        }

        /**
         * Sets the height of the sprite by modifying the scale.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            var s = sign(this.scale.y) || 1;

            this.scale.y = s * value / this.texture.orig.height;
            this._height = value;
        }

        /**
         * The anchor sets the origin point of the texture.
         * The default is 0,0 this means the texture's origin is the top left
         * Setting the anchor to 0.5,0.5 means the texture's origin is centered
         * Setting the anchor to 1,1 would mean the texture's origin point will be the bottom right corner
         *
         * @member {PIXI.ObservablePoint}
         * @memberof PIXI.Sprite#
         */

    }, {
        key: 'anchor',
        get: function get() {
            return this._anchor;
        }

        /**
         * Copies the anchor to the sprite.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this._anchor.copy(value);
        }

        /**
         * The tint applied to the sprite. This is a hex value. A value of
         * 0xFFFFFF will remove any tint effect.
         *
         * @member {number}
         * @memberof PIXI.Sprite#
         * @default 0xFFFFFF
         */

    }, {
        key: 'tint',
        get: function get() {
            return this._tint;
        }

        /**
         * Sets the tint of the sprite.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this._tint = value;
            this._tintRGB = (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
        }

        /**
         * The texture that the sprite is using
         *
         * @member {PIXI.Texture}
         * @memberof PIXI.Sprite#
         */

    }, {
        key: 'texture',
        get: function get() {
            return this._texture;
        }

        /**
         * Sets the texture of the sprite.
         *
         * @param {PIXI.Texture} value - The value to set to.
         */
        ,
        set: function set(value) {
            if (this._texture === value) {
                return;
            }

            this._texture = value;
            this.cachedTint = 0xFFFFFF;

            this._textureID = -1;

            if (value) {
                // wait for the texture to load
                if (value.baseTexture.hasLoaded) {
                    this._onTextureUpdate();
                } else {
                    value.once('update', this._onTextureUpdate, this);
                }
            }
        }
    }], [{
        key: 'from',
        value: function from(source) {
            return new Sprite(Texture.from(source));
        }

        /**
         * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
         * The frame ids are created when a Texture packer file has been loaded
         *
         * @static
         * @param {string} frameId - The frame Id of the texture in the cache
         * @return {PIXI.Sprite} A new Sprite using a texture from the texture cache matching the frameId
         */

    }, {
        key: 'fromFrame',
        value: function fromFrame(frameId) {
            var texture = TextureCache[frameId];

            if (!texture) {
                throw new Error('The frameId "' + frameId + '" does not exist in the texture cache');
            }

            return new Sprite(texture);
        }

        /**
         * Helper function that creates a sprite that will contain a texture based on an image url
         * If the image is not in the texture cache it will be loaded
         *
         * @static
         * @param {string} imageId - The image url of the texture
         * @param {boolean} [crossorigin=(auto)] - if you want to specify the cross-origin parameter
         * @param {number} [scaleMode=PIXI.settings.SCALE_MODE] - if you want to specify the scale mode,
         *  see {@link PIXI.SCALE_MODES} for possible values
         * @return {PIXI.Sprite} A new Sprite using a texture from the texture cache matching the image id
         */

    }, {
        key: 'fromImage',
        value: function fromImage(imageId, crossorigin, scaleMode) {
            return new Sprite(Texture.fromImage(imageId, crossorigin, scaleMode));
        }
    }]);
    return Sprite;
}(Container);

/**
 * Utility methods for Sprite/Texture tinting.
 *
 * @namespace PIXI.CanvasTinter
 */
var CanvasTinter = {
    /**
     * Basically this method just needs a sprite and a color and tints the sprite with the given color.
     *
     * @memberof PIXI.CanvasTinter
     * @param {PIXI.Sprite} sprite - the sprite to tint
     * @param {number} color - the color to use to tint the sprite with
     * @return {HTMLCanvasElement} The tinted canvas
     */
    getTintedTexture: function getTintedTexture(sprite, color) {
        var texture = sprite.texture;

        color = CanvasTinter.roundColor(color);

        var stringColor = '#' + ('00000' + (color | 0).toString(16)).substr(-6);

        texture.tintCache = texture.tintCache || {};

        if (texture.tintCache[stringColor]) {
            return texture.tintCache[stringColor];
        }

        // clone texture..
        var canvas = CanvasTinter.canvas || document.createElement('canvas');

        // CanvasTinter.tintWithPerPixel(texture, stringColor, canvas);
        CanvasTinter.tintMethod(texture, color, canvas);

        if (CanvasTinter.convertTintToImage) {
            // is this better?
            var tintImage = new Image();

            tintImage.src = canvas.toDataURL();

            texture.tintCache[stringColor] = tintImage;
        } else {
            texture.tintCache[stringColor] = canvas;
            // if we are not converting the texture to an image then we need to lose the reference to the canvas
            CanvasTinter.canvas = null;
        }

        return canvas;
    },

    /**
     * Tint a texture using the 'multiply' operation.
     *
     * @memberof PIXI.CanvasTinter
     * @param {PIXI.Texture} texture - the texture to tint
     * @param {number} color - the color to use to tint the sprite with
     * @param {HTMLCanvasElement} canvas - the current canvas
     */
    tintWithMultiply: function tintWithMultiply(texture, color, canvas) {
        var context = canvas.getContext('2d');
        var crop = texture._frame.clone();
        var resolution = texture.baseTexture.resolution;

        crop.x *= resolution;
        crop.y *= resolution;
        crop.width *= resolution;
        crop.height *= resolution;

        canvas.width = crop.width;
        canvas.height = crop.height;

        context.fillStyle = '#' + ('00000' + (color | 0).toString(16)).substr(-6);

        context.fillRect(0, 0, crop.width, crop.height);

        context.globalCompositeOperation = 'multiply';

        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

        context.globalCompositeOperation = 'destination-atop';

        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
    },

    /**
     * Tint a texture using the 'overlay' operation.
     *
     * @memberof PIXI.CanvasTinter
     * @param {PIXI.Texture} texture - the texture to tint
     * @param {number} color - the color to use to tint the sprite with
     * @param {HTMLCanvasElement} canvas - the current canvas
     */
    tintWithOverlay: function tintWithOverlay(texture, color, canvas) {
        var context = canvas.getContext('2d');
        var crop = texture._frame.clone();
        var resolution = texture.baseTexture.resolution;

        crop.x *= resolution;
        crop.y *= resolution;
        crop.width *= resolution;
        crop.height *= resolution;

        canvas.width = crop.width;
        canvas.height = crop.height;

        context.globalCompositeOperation = 'copy';
        context.fillStyle = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
        context.fillRect(0, 0, crop.width, crop.height);

        context.globalCompositeOperation = 'destination-atop';
        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

        // context.globalCompositeOperation = 'copy';
    },


    /**
     * Tint a texture pixel per pixel.
     *
     * @memberof PIXI.CanvasTinter
     * @param {PIXI.Texture} texture - the texture to tint
     * @param {number} color - the color to use to tint the sprite with
     * @param {HTMLCanvasElement} canvas - the current canvas
     */
    tintWithPerPixel: function tintWithPerPixel(texture, color, canvas) {
        var context = canvas.getContext('2d');
        var crop = texture._frame.clone();
        var resolution = texture.baseTexture.resolution;

        crop.x *= resolution;
        crop.y *= resolution;
        crop.width *= resolution;
        crop.height *= resolution;

        canvas.width = crop.width;
        canvas.height = crop.height;

        context.globalCompositeOperation = 'copy';
        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

        var rgbValues = hex2rgb(color);
        var r = rgbValues[0];
        var g = rgbValues[1];
        var b = rgbValues[2];

        var pixelData = context.getImageData(0, 0, crop.width, crop.height);

        var pixels = pixelData.data;

        for (var i = 0; i < pixels.length; i += 4) {
            pixels[i + 0] *= r;
            pixels[i + 1] *= g;
            pixels[i + 2] *= b;
        }

        context.putImageData(pixelData, 0, 0);
    },

    /**
     * Rounds the specified color according to the CanvasTinter.cacheStepsPerColorChannel.
     *
     * @memberof PIXI.CanvasTinter
     * @param {number} color - the color to round, should be a hex color
     * @return {number} The rounded color.
     */
    roundColor: function roundColor(color) {
        var step = CanvasTinter.cacheStepsPerColorChannel;

        var rgbValues = hex2rgb(color);

        rgbValues[0] = Math.min(255, rgbValues[0] / step * step);
        rgbValues[1] = Math.min(255, rgbValues[1] / step * step);
        rgbValues[2] = Math.min(255, rgbValues[2] / step * step);

        return rgb2hex(rgbValues);
    },

    /**
     * Number of steps which will be used as a cap when rounding colors.
     *
     * @memberof PIXI.CanvasTinter
     * @type {number}
     */
    cacheStepsPerColorChannel: 8,

    /**
     * Tint cache boolean flag.
     *
     * @memberof PIXI.CanvasTinter
     * @type {boolean}
     */
    convertTintToImage: false,

    /**
     * Whether or not the Canvas BlendModes are supported, consequently the ability to tint using the multiply method.
     *
     * @memberof PIXI.CanvasTinter
     * @type {boolean}
     */
    canUseMultiply: canUseNewCanvasBlendModes(),

    /**
     * The tinting method that will be used.
     *
     * @memberof PIXI.CanvasTinter
     * @type {tintMethodFunctionType}
     */
    tintMethod: 0
};

CanvasTinter.tintMethod = CanvasTinter.canUseMultiply ? CanvasTinter.tintWithMultiply : CanvasTinter.tintWithPerPixel;

var canvasRenderWorldTransform = new Matrix();

/**
 * @author Mat Groves
 *
 * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * for creating the original pixi version!
 * Also a thanks to https://github.com/bchevalier for tweaking the tint and alpha so that they now
 * share 4 bytes on the vertex buffer
 *
 * Heavily inspired by LibGDX's CanvasSpriteRenderer:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/CanvasSpriteRenderer.java
 */

/**
 * Renderer dedicated to drawing and batching sprites.
 *
 * @class
 * @private
 * @memberof PIXI
 */

var CanvasSpriteRenderer = function () {
    /**
     * @param {PIXI.WebGLRenderer} renderer -The renderer sprite this batch works for.
     */
    function CanvasSpriteRenderer(renderer) {
        classCallCheck(this, CanvasSpriteRenderer);

        this.renderer = renderer;
    }

    /**
     * Renders the sprite object.
     *
     * @param {PIXI.Sprite} sprite - the sprite to render when using this spritebatch
     */


    createClass(CanvasSpriteRenderer, [{
        key: 'render',
        value: function render(sprite) {
            var texture = sprite._texture;
            var renderer = this.renderer;

            var width = texture._frame.width;
            var height = texture._frame.height;

            var wt = sprite.transform.worldTransform;
            var dx = 0;
            var dy = 0;

            if (texture.orig.width <= 0 || texture.orig.height <= 0 || !texture.baseTexture.source) {
                return;
            }

            renderer.setBlendMode(sprite.blendMode);

            //  Ignore null sources
            if (texture.valid) {
                renderer.context.globalAlpha = sprite.worldAlpha;

                // If smoothingEnabled is supported and we need to change the smoothing property for sprite texture
                var smoothingEnabled = texture.baseTexture.scaleMode === SCALE_MODES.LINEAR;

                if (renderer.smoothProperty && renderer.context[renderer.smoothProperty] !== smoothingEnabled) {
                    renderer.context[renderer.smoothProperty] = smoothingEnabled;
                }

                if (texture.trim) {
                    dx = texture.trim.width / 2 + texture.trim.x - sprite.anchor.x * texture.orig.width;
                    dy = texture.trim.height / 2 + texture.trim.y - sprite.anchor.y * texture.orig.height;
                } else {
                    dx = (0.5 - sprite.anchor.x) * texture.orig.width;
                    dy = (0.5 - sprite.anchor.y) * texture.orig.height;
                }

                if (texture.rotate) {
                    wt.copy(canvasRenderWorldTransform);
                    wt = canvasRenderWorldTransform;
                    GroupD8.matrixAppendRotationInv(wt, texture.rotate, dx, dy);
                    // the anchor has already been applied above, so lets set it to zero
                    dx = 0;
                    dy = 0;
                }

                dx -= width / 2;
                dy -= height / 2;

                // Allow for pixel rounding
                if (renderer.roundPixels) {
                    renderer.context.setTransform(wt.a, wt.b, wt.c, wt.d, wt.tx * renderer.resolution | 0, wt.ty * renderer.resolution | 0);

                    dx = dx | 0;
                    dy = dy | 0;
                } else {
                    renderer.context.setTransform(wt.a, wt.b, wt.c, wt.d, wt.tx * renderer.resolution, wt.ty * renderer.resolution);
                }

                var resolution = texture.baseTexture.resolution;

                if (sprite.tint !== 0xFFFFFF) {
                    if (sprite.cachedTint !== sprite.tint) {
                        sprite.cachedTint = sprite.tint;

                        // TODO clean up caching - how to clean up the caches?
                        sprite.tintedTexture = CanvasTinter.getTintedTexture(sprite, sprite.tint);
                    }

                    renderer.context.drawImage(sprite.tintedTexture, 0, 0, width * resolution, height * resolution, dx * renderer.resolution, dy * renderer.resolution, width * renderer.resolution, height * renderer.resolution);
                } else {
                    renderer.context.drawImage(texture.baseTexture.source, texture._frame.x * resolution, texture._frame.y * resolution, width * resolution, height * resolution, dx * renderer.resolution, dy * renderer.resolution, width * renderer.resolution, height * renderer.resolution);
                }
            }
        }

        /**
         * destroy the sprite object.
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.renderer = null;
        }
    }]);
    return CanvasSpriteRenderer;
}();

CanvasRenderer.registerPlugin('sprite', CanvasSpriteRenderer);

var fragTemplate = ['varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'varying float vTextureId;', 'uniform sampler2D uSamplers[%count%];', 'void main(void){', 'vec4 color;', 'float textureId = floor(vTextureId+0.5);', '%forloop%', 'gl_FragColor = color * vColor;', '}'].join('\n');

function generateMultiTextureShader(gl, maxTextures) {
    var vertexSrc = fs.readFileSync(path.join(__dirname, './texture.vert'), 'utf8');
    var fragmentSrc = fragTemplate;

    fragmentSrc = fragmentSrc.replace(/%count%/gi, maxTextures);
    fragmentSrc = fragmentSrc.replace(/%forloop%/gi, generateSampleSrc(maxTextures));

    var shader = new Shader(gl, vertexSrc, fragmentSrc);

    var sampleValues = [];

    for (var i = 0; i < maxTextures; i++) {
        sampleValues[i] = i;
    }

    shader.bind();
    shader.uniforms.uSamplers = sampleValues;

    return shader;
}

function generateSampleSrc(maxTextures) {
    var src = '';

    src += '\n';
    src += '\n';

    for (var i = 0; i < maxTextures; i++) {
        if (i > 0) {
            src += '\nelse ';
        }

        if (i < maxTextures - 1) {
            src += 'if(textureId == ' + i + '.0)';
        }

        src += '\n{';
        src += '\n\tcolor = texture2D(uSamplers[' + i + '], vTextureCoord);';
        src += '\n}';
    }

    src += '\n';
    src += '\n';

    return src;
}

var fragTemplate$1 = ['precision mediump float;', 'void main(void){', 'float test = 0.1;', '%forloop%', 'gl_FragColor = vec4(0.0);', '}'].join('\n');

function checkMaxIfStatmentsInShader(maxIfs, gl) {
    var createTempContext = !gl;

    // @if DEBUG
    if (maxIfs === 0) {
        throw new Error('Invalid value of `0` passed to `checkMaxIfStatementsInShader`');
    }
    // @endif

    if (createTempContext) {
        var tinyCanvas = document.createElement('canvas');

        tinyCanvas.width = 1;
        tinyCanvas.height = 1;

        gl = glCore__default.createContext(tinyCanvas);
    }

    var shader = gl.createShader(gl.FRAGMENT_SHADER);

    while (true) // eslint-disable-line no-constant-condition
    {
        var fragmentSrc = fragTemplate$1.replace(/%forloop%/gi, generateIfTestSrc(maxIfs));

        gl.shaderSource(shader, fragmentSrc);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            maxIfs = maxIfs / 2 | 0;
        } else {
            // valid!
            break;
        }
    }

    if (createTempContext) {
        // get rid of context
        if (gl.getExtension('WEBGL_lose_context')) {
            gl.getExtension('WEBGL_lose_context').loseContext();
        }
    }

    return maxIfs;
}

function generateIfTestSrc(maxIfs) {
    var src = '';

    for (var i = 0; i < maxIfs; ++i) {
        if (i > 0) {
            src += '\nelse ';
        }

        if (i < maxIfs - 1) {
            src += 'if(test == ' + i + '.0){}';
        }
    }

    return src;
}

/**
 * @class
 */
var Buffer = function () {
  /**
   * @param {number} size - The size of the buffer in bytes.
   */
  function Buffer(size) {
    classCallCheck(this, Buffer);

    this.vertices = new ArrayBuffer(size);

    /**
     * View on the vertices as a Float32Array for positions
     *
     * @member {Float32Array}
     */
    this.float32View = new Float32Array(this.vertices);

    /**
     * View on the vertices as a Uint32Array for uvs
     *
     * @member {Float32Array}
     */
    this.uint32View = new Uint32Array(this.vertices);
  }

  /**
   * Destroys the buffer.
   *
   */


  createClass(Buffer, [{
    key: "destroy",
    value: function destroy() {
      this.vertices = null;
      this.positions = null;
      this.uvs = null;
      this.colors = null;
    }
  }]);
  return Buffer;
}();

var SPRITE_BATCH_SIZE = settings.SPRITE_BATCH_SIZE;
var SPRITE_MAX_TEXTURES = settings.SPRITE_MAX_TEXTURES;


var TICK$1 = 0;
var TEXTURE_TICK = 0;

/**
 * Renderer dedicated to drawing and batching sprites.
 *
 * @class
 * @private
 * @memberof PIXI
 * @extends PIXI.ObjectRenderer
 */

var SpriteRenderer = function (_ObjectRenderer) {
    inherits(SpriteRenderer, _ObjectRenderer);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this sprite batch works for.
     */
    function SpriteRenderer(renderer) {
        classCallCheck(this, SpriteRenderer);

        /**
         * Number of values sent in the vertex buffer.
         * positionX, positionY, colorR, colorG, colorB = 5
         *
         * @member {number}
         */
        var _this = possibleConstructorReturn(this, (SpriteRenderer.__proto__ || Object.getPrototypeOf(SpriteRenderer)).call(this, renderer));

        _this.vertSize = 5;

        /**
         * The size of the vertex information in bytes.
         *
         * @member {number}
         */
        _this.vertByteSize = _this.vertSize * 4;

        /**
         * The number of images in the SpriteBatch before it flushes.
         *
         * @member {number}
         */
        _this.size = SPRITE_BATCH_SIZE; // 2000 is a nice balance between mobile / desktop

        // the total number of bytes in our batch
        // let numVerts = this.size * 4 * this.vertByteSize;

        _this.buffers = [];
        for (var i = 1; i <= twiddle.nextPow2(_this.size); i *= 2) {
            _this.buffers.push(new Buffer(i * 4 * _this.vertByteSize));
        }

        /**
         * Holds the indices of the geometry (quads) to draw
         *
         * @member {Uint16Array}
         */
        _this.indices = createIndicesForQuads(_this.size);

        /**
         * The default shaders that is used if a sprite doesn't have a more specific one.
         * there is a shader for each number of textures that can be rendererd.
         * These shaders will also be generated on the fly as required.
         * @member {PIXI.Shader[]}
         */
        _this.shader = null;

        _this.currentIndex = 0;
        TICK$1 = 0;
        _this.groups = [];

        for (var k = 0; k < _this.size; k++) {
            _this.groups[k] = { textures: [], textureCount: 0, ids: [], size: 0, start: 0, blend: 0 };
        }

        _this.sprites = [];

        _this.vertexBuffers = [];
        _this.vaos = [];

        _this.vaoMax = 2;
        _this.vertexCount = 0;

        _this.renderer.on('prerender', _this.onPrerender, _this);
        return _this;
    }

    /**
     * Sets up the renderer context and necessary buffers.
     *
     * @private
     */


    createClass(SpriteRenderer, [{
        key: 'onContextChange',
        value: function onContextChange() {
            var gl = this.renderer.gl;

            // step 1: first check max textures the GPU can handle.
            this.MAX_TEXTURES = Math.min(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), SPRITE_MAX_TEXTURES);

            // step 2: check the maximum number of if statements the shader can have too..
            this.MAX_TEXTURES = checkMaxIfStatmentsInShader(this.MAX_TEXTURES, gl);

            var shader = this.shader = generateMultiTextureShader(gl, this.MAX_TEXTURES);

            // create a couple of buffers
            this.indexBuffer = glCore__default.GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);

            // we use the second shader as the first one depending on your browser may omit aTextureId
            // as it is not used by the shader so is optimized out.

            this.renderer.bindVao(null);

            for (var i = 0; i < this.vaoMax; i++) {
                this.vertexBuffers[i] = glCore__default.GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);

                /* eslint-disable max-len */

                // build the vao object that will render..
                this.vaos[i] = this.renderer.createVao().addIndex(this.indexBuffer).addAttribute(this.vertexBuffers[i], shader.attributes.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0).addAttribute(this.vertexBuffers[i], shader.attributes.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 2 * 4).addAttribute(this.vertexBuffers[i], shader.attributes.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 3 * 4).addAttribute(this.vertexBuffers[i], shader.attributes.aTextureId, gl.FLOAT, false, this.vertByteSize, 4 * 4);

                /* eslint-disable max-len */
            }

            this.vao = this.vaos[0];
            this.currentBlendMode = 99999;

            this.boundTextures = new Array(this.MAX_TEXTURES);
        }

        /**
         * Called before the renderer starts rendering.
         *
         */

    }, {
        key: 'onPrerender',
        value: function onPrerender() {
            this.vertexCount = 0;
        }

        /**
         * Renders the sprite object.
         *
         * @param {PIXI.Sprite} sprite - the sprite to render when using this spritebatch
         */

    }, {
        key: 'render',
        value: function render(sprite) {
            // TODO set blend modes..
            // check texture..
            if (this.currentIndex >= this.size) {
                this.flush();
            }

            // get the uvs for the texture

            // if the uvs have not updated then no point rendering just yet!
            if (!sprite.texture._uvs) {
                return;
            }

            // push a texture.
            // increment the batchsize
            this.sprites[this.currentIndex++] = sprite;
        }

        /**
         * Renders the content and empties the current batch.
         *
         */

    }, {
        key: 'flush',
        value: function flush() {
            if (this.currentIndex === 0) {
                return;
            }

            var gl = this.renderer.gl;
            var MAX_TEXTURES = this.MAX_TEXTURES;

            var np2 = twiddle.nextPow2(this.currentIndex);
            var log2$$1 = twiddle.log2(np2);
            var buffer = this.buffers[log2$$1];

            var sprites = this.sprites;
            var groups = this.groups;

            var float32View = buffer.float32View;
            var uint32View = buffer.uint32View;

            var boundTextures = this.boundTextures;
            var rendererBoundTextures = this.renderer.boundTextures;
            var touch = this.renderer.textureGC.count;

            var index = 0;
            var nextTexture = void 0;
            var currentTexture = void 0;
            var groupCount = 1;
            var textureCount = 0;
            var currentGroup = groups[0];
            var vertexData = void 0;
            var uvs = void 0;
            var blendMode = sprites[0].blendMode;

            currentGroup.textureCount = 0;
            currentGroup.start = 0;
            currentGroup.blend = blendMode;

            TICK$1++;

            var i = void 0;

            // copy textures..
            for (i = 0; i < MAX_TEXTURES; ++i) {
                boundTextures[i] = rendererBoundTextures[i];
                boundTextures[i]._virtalBoundId = i;
            }

            for (i = 0; i < this.currentIndex; ++i) {
                // upload the sprite elemetns...
                // they have all ready been calculated so we just need to push them into the buffer.
                var sprite = sprites[i];

                nextTexture = sprite._texture.baseTexture;

                if (blendMode !== sprite.blendMode) {
                    // finish a group..
                    blendMode = sprite.blendMode;

                    // force the batch to break!
                    currentTexture = null;
                    textureCount = MAX_TEXTURES;
                    TICK$1++;
                }

                if (currentTexture !== nextTexture) {
                    currentTexture = nextTexture;

                    if (nextTexture._enabled !== TICK$1) {
                        if (textureCount === MAX_TEXTURES) {
                            TICK$1++;

                            currentGroup.size = i - currentGroup.start;

                            textureCount = 0;

                            currentGroup = groups[groupCount++];
                            currentGroup.blend = blendMode;
                            currentGroup.textureCount = 0;
                            currentGroup.start = i;
                        }

                        nextTexture.touched = touch;

                        if (nextTexture._virtalBoundId === -1) {
                            for (var j = 0; j < MAX_TEXTURES; ++j) {
                                var tIndex = (j + TEXTURE_TICK) % MAX_TEXTURES;

                                var t = boundTextures[tIndex];

                                if (t._enabled !== TICK$1) {
                                    TEXTURE_TICK++;

                                    t._virtalBoundId = -1;

                                    nextTexture._virtalBoundId = tIndex;

                                    boundTextures[tIndex] = nextTexture;
                                    break;
                                }
                            }
                        }

                        nextTexture._enabled = TICK$1;

                        currentGroup.textureCount++;
                        currentGroup.ids[textureCount] = nextTexture._virtalBoundId;
                        currentGroup.textures[textureCount++] = nextTexture;
                    }
                }

                vertexData = sprite.vertexData;

                // TODO this sum does not need to be set each frame..
                uvs = sprite._texture._uvs.uvsUint32;

                if (this.renderer.roundPixels) {
                    var resolution = this.renderer.resolution;

                    // xy
                    float32View[index] = (vertexData[0] * resolution | 0) / resolution;
                    float32View[index + 1] = (vertexData[1] * resolution | 0) / resolution;

                    // xy
                    float32View[index + 5] = (vertexData[2] * resolution | 0) / resolution;
                    float32View[index + 6] = (vertexData[3] * resolution | 0) / resolution;

                    // xy
                    float32View[index + 10] = (vertexData[4] * resolution | 0) / resolution;
                    float32View[index + 11] = (vertexData[5] * resolution | 0) / resolution;

                    // xy
                    float32View[index + 15] = (vertexData[6] * resolution | 0) / resolution;
                    float32View[index + 16] = (vertexData[7] * resolution | 0) / resolution;
                } else {
                    // xy
                    float32View[index] = vertexData[0];
                    float32View[index + 1] = vertexData[1];

                    // xy
                    float32View[index + 5] = vertexData[2];
                    float32View[index + 6] = vertexData[3];

                    // xy
                    float32View[index + 10] = vertexData[4];
                    float32View[index + 11] = vertexData[5];

                    // xy
                    float32View[index + 15] = vertexData[6];
                    float32View[index + 16] = vertexData[7];
                }

                uint32View[index + 2] = uvs[0];
                uint32View[index + 7] = uvs[1];
                uint32View[index + 12] = uvs[2];
                uint32View[index + 17] = uvs[3];

                uint32View[index + 3] = uint32View[index + 8] = uint32View[index + 13] = uint32View[index + 18] = sprite._tintRGB + (sprite.worldAlpha * 255 << 24);

                float32View[index + 4] = float32View[index + 9] = float32View[index + 14] = float32View[index + 19] = nextTexture._virtalBoundId;

                index += 20;
            }

            currentGroup.size = i - currentGroup.start;

            if (!CAN_UPLOAD_SAME_BUFFER) {
                // this is still needed for IOS performance..
                // it realy doe not like uploading to  the same bufffer in a single frame!
                if (this.vaoMax <= this.vertexCount) {
                    this.vaoMax++;
                    this.vertexBuffers[this.vertexCount] = glCore__default.GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);

                    // build the vao object that will render..
                    this.vaos[this.vertexCount] = this.renderer.createVao().addIndex(this.indexBuffer).addAttribute(this.vertexBuffers[this.vertexCount], this.shader.attributes.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0).addAttribute(this.vertexBuffers[this.vertexCount], this.shader.attributes.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 2 * 4).addAttribute(this.vertexBuffers[this.vertexCount], this.shader.attributes.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 3 * 4).addAttribute(this.vertexBuffers[this.vertexCount], this.shader.attributes.aTextureId, gl.FLOAT, false, this.vertByteSize, 4 * 4);
                }

                this.renderer.bindVao(this.vaos[this.vertexCount]);

                this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, false);

                this.vertexCount++;
            } else {
                // lets use the faster option..
                this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, true);
            }

            for (i = 0; i < MAX_TEXTURES; ++i) {
                rendererBoundTextures[i]._virtalBoundId = -1;
            }

            // render the groups..
            for (i = 0; i < groupCount; ++i) {
                var group = groups[i];
                var groupTextureCount = group.textureCount;

                for (var _j = 0; _j < groupTextureCount; _j++) {
                    currentTexture = group.textures[_j];

                    // reset virtual ids..
                    // lets do a quick check..
                    if (rendererBoundTextures[group.ids[_j]] !== currentTexture) {
                        this.renderer.bindTexture(currentTexture, group.ids[_j], true);
                    }

                    // reset the virtualId..
                    currentTexture._virtalBoundId = -1;
                }

                // set the blend mode..
                this.renderer.state.setBlendMode(group.blend);

                gl.drawElements(gl.TRIANGLES, group.size * 6, gl.UNSIGNED_SHORT, group.start * 6 * 2);
            }

            // reset elements for the next flush
            this.currentIndex = 0;
        }

        /**
         * Starts a new sprite batch.
         */

    }, {
        key: 'start',
        value: function start() {
            this.renderer.bindShader(this.shader);

            this.renderer.bindVao(this.vaos[this.vertexCount]);

            this.vertexBuffers[this.vertexCount].bind();
        }

        /**
         * Stops and flushes the current batch.
         *
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.flush();
        }

        /**
         * Destroys the SpriteBatch.
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            for (var i = 0; i < this.vaoMax; i++) {
                if (this.vertexBuffers[i]) {
                    this.vertexBuffers[i].destroy();
                }
                if (this.vaos[i]) {
                    this.vaos[i].destroy();
                }
            }

            if (this.indexBuffer) {
                this.indexBuffer.destroy();
            }

            this.renderer.off('prerender', this.onPrerender, this);

            get$1(SpriteRenderer.prototype.__proto__ || Object.getPrototypeOf(SpriteRenderer.prototype), 'destroy', this).call(this);

            if (this.shader) {
                this.shader.destroy();
                this.shader = null;
            }

            this.vertexBuffers = null;
            this.vaos = null;
            this.indexBuffer = null;
            this.indices = null;

            this.sprites = null;

            for (var _i = 0; _i < this.buffers.length; ++_i) {
                this.buffers[_i].destroy();
            }
        }
    }]);
    return SpriteRenderer;
}(ObjectRenderer);

WebGLRenderer.registerPlugin('sprite', SpriteRenderer);

// disabling eslint for now, going to rewrite this in v5
/* eslint-disable */

var defaultStyle = {
    align: 'left',
    breakWords: false,
    dropShadow: false,
    dropShadowAngle: Math.PI / 6,
    dropShadowBlur: 0,
    dropShadowColor: '#000000',
    dropShadowDistance: 5,
    fill: 'black',
    fillGradientType: TEXT_GRADIENT.LINEAR_VERTICAL,
    fontFamily: 'Arial',
    fontSize: 26,
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',
    letterSpacing: 0,
    lineHeight: 0,
    lineJoin: 'miter',
    miterLimit: 10,
    padding: 0,
    stroke: 'black',
    strokeThickness: 0,
    textBaseline: 'alphabetic',
    wordWrap: false,
    wordWrapWidth: 100
};

/**
 * A TextStyle Object decorates a Text Object. It can be shared between
 * multiple Text objects. Changing the style will update all text objects using it.
 *
 * @class
 * @memberof PIXI
 */

var TextStyle = function () {
    /**
     * @param {object} [style] - The style parameters
     * @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center' or 'right'),
     *  does not affect single line text
     * @param {boolean} [style.breakWords=false] - Indicates if lines can be wrapped within words, it
     *  needs wordWrap to be set to true
     * @param {boolean} [style.dropShadow=false] - Set a drop shadow for the text
     * @param {number} [style.dropShadowAngle=Math.PI/6] - Set a angle of the drop shadow
     * @param {number} [style.dropShadowBlur=0] - Set a shadow blur radius
     * @param {string} [style.dropShadowColor='#000000'] - A fill style to be used on the dropshadow e.g 'red', '#00FF00'
     * @param {number} [style.dropShadowDistance=5] - Set a distance of the drop shadow
     * @param {string|string[]|number|number[]|CanvasGradient|CanvasPattern} [style.fill='black'] - A canvas
     *  fillstyle that will be used on the text e.g 'red', '#00FF00'. Can be an array to create a gradient
     *  eg ['#000000','#FFFFFF']
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
     * @param {number} [style.fillGradientType=PIXI.TEXT_GRADIENT.LINEAR_VERTICAL] - If fills styles are
     *  supplied, this can change the type/direction of the gradient. See {@link PIXI.TEXT_GRADIENT} for possible values
     * @param {string} [style.fontFamily='Arial'] - The font family
     * @param {number|string} [style.fontSize=26] - The font size (as a number it converts to px, but as a string,
     *  equivalents are '26px','20pt','160%' or '1.6em')
     * @param {string} [style.fontStyle='normal'] - The font style ('normal', 'italic' or 'oblique')
     * @param {string} [style.fontVariant='normal'] - The font variant ('normal' or 'small-caps')
     * @param {string} [style.fontWeight='normal'] - The font weight ('normal', 'bold', 'bolder', 'lighter' and '100',
     *  '200', '300', '400', '500', '600', '700', 800' or '900')
     * @param {number} [style.letterSpacing=0] - The amount of spacing between letters, default is 0
     * @param {number} [style.lineHeight] - The line height, a number that represents the vertical space that a letter uses
     * @param {string} [style.lineJoin='miter'] - The lineJoin property sets the type of corner created, it can resolve
     *      spiked text issues. Default is 'miter' (creates a sharp corner).
     * @param {number} [style.miterLimit=10] - The miter limit to use when using the 'miter' lineJoin mode. This can reduce
     *      or increase the spikiness of rendered text.
     * @param {number} [style.padding=0] - Occasionally some fonts are cropped. Adding some padding will prevent this from
     *     happening by adding padding to all sides of the text.
     * @param {string|number} [style.stroke='black'] - A canvas fillstyle that will be used on the text stroke
     *  e.g 'blue', '#FCFF00'
     * @param {number} [style.strokeThickness=0] - A number that represents the thickness of the stroke.
     *  Default is 0 (no stroke)
     * @param {string} [style.textBaseline='alphabetic'] - The baseline of the text that is rendered.
     * @param {boolean} [style.wordWrap=false] - Indicates if word wrap should be used
     * @param {number} [style.wordWrapWidth=100] - The width at which text will wrap, it needs wordWrap to be set to true
     */
    function TextStyle(style) {
        classCallCheck(this, TextStyle);

        this.styleID = 0;

        Object.assign(this, defaultStyle, style);
    }

    /**
     * Creates a new TextStyle object with the same values as this one.
     * Note that the only the properties of the object are cloned.
     *
     * @return {PIXI.TextStyle} New cloned TextStyle object
     */


    createClass(TextStyle, [{
        key: 'clone',
        value: function clone() {
            var clonedProperties = {};

            for (var key in this._defaults) {
                clonedProperties[key] = this[key];
            }

            return new TextStyle(clonedProperties);
        }

        /**
         * Resets all properties to the defaults specified in TextStyle.prototype._default
         */

    }, {
        key: 'reset',
        value: function reset() {
            Object.assign(this, this._defaults);
        }
    }, {
        key: 'align',
        get: function get() {
            return this._align;
        },
        set: function set(align) {
            if (this._align !== align) {
                this._align = align;
                this.styleID++;
            }
        }
    }, {
        key: 'breakWords',
        get: function get() {
            return this._breakWords;
        },
        set: function set(breakWords) {
            if (this._breakWords !== breakWords) {
                this._breakWords = breakWords;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadow',
        get: function get() {
            return this._dropShadow;
        },
        set: function set(dropShadow) {
            if (this._dropShadow !== dropShadow) {
                this._dropShadow = dropShadow;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowAngle',
        get: function get() {
            return this._dropShadowAngle;
        },
        set: function set(dropShadowAngle) {
            if (this._dropShadowAngle !== dropShadowAngle) {
                this._dropShadowAngle = dropShadowAngle;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowBlur',
        get: function get() {
            return this._dropShadowBlur;
        },
        set: function set(dropShadowBlur) {
            if (this._dropShadowBlur !== dropShadowBlur) {
                this._dropShadowBlur = dropShadowBlur;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowColor',
        get: function get() {
            return this._dropShadowColor;
        },
        set: function set(dropShadowColor) {
            var outputColor = getColor(dropShadowColor);
            if (this._dropShadowColor !== outputColor) {
                this._dropShadowColor = outputColor;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowDistance',
        get: function get() {
            return this._dropShadowDistance;
        },
        set: function set(dropShadowDistance) {
            if (this._dropShadowDistance !== dropShadowDistance) {
                this._dropShadowDistance = dropShadowDistance;
                this.styleID++;
            }
        }
    }, {
        key: 'fill',
        get: function get() {
            return this._fill;
        },
        set: function set(fill) {
            var outputColor = getColor(fill);
            if (this._fill !== outputColor) {
                this._fill = outputColor;
                this.styleID++;
            }
        }
    }, {
        key: 'fillGradientType',
        get: function get() {
            return this._fillGradientType;
        },
        set: function set(fillGradientType) {
            if (this._fillGradientType !== fillGradientType) {
                this._fillGradientType = fillGradientType;
                this.styleID++;
            }
        }
    }, {
        key: 'fontFamily',
        get: function get() {
            return this._fontFamily;
        },
        set: function set(fontFamily) {
            if (this.fontFamily !== fontFamily) {
                this._fontFamily = fontFamily;
                this.styleID++;
            }
        }
    }, {
        key: 'fontSize',
        get: function get() {
            return this._fontSize;
        },
        set: function set(fontSize) {
            if (this._fontSize !== fontSize) {
                this._fontSize = fontSize;
                this.styleID++;
            }
        }
    }, {
        key: 'fontStyle',
        get: function get() {
            return this._fontStyle;
        },
        set: function set(fontStyle) {
            if (this._fontStyle !== fontStyle) {
                this._fontStyle = fontStyle;
                this.styleID++;
            }
        }
    }, {
        key: 'fontVariant',
        get: function get() {
            return this._fontVariant;
        },
        set: function set(fontVariant) {
            if (this._fontVariant !== fontVariant) {
                this._fontVariant = fontVariant;
                this.styleID++;
            }
        }
    }, {
        key: 'fontWeight',
        get: function get() {
            return this._fontWeight;
        },
        set: function set(fontWeight) {
            if (this._fontWeight !== fontWeight) {
                this._fontWeight = fontWeight;
                this.styleID++;
            }
        }
    }, {
        key: 'letterSpacing',
        get: function get() {
            return this._letterSpacing;
        },
        set: function set(letterSpacing) {
            if (this._letterSpacing !== letterSpacing) {
                this._letterSpacing = letterSpacing;
                this.styleID++;
            }
        }
    }, {
        key: 'lineHeight',
        get: function get() {
            return this._lineHeight;
        },
        set: function set(lineHeight) {
            if (this._lineHeight !== lineHeight) {
                this._lineHeight = lineHeight;
                this.styleID++;
            }
        }
    }, {
        key: 'lineJoin',
        get: function get() {
            return this._lineJoin;
        },
        set: function set(lineJoin) {
            if (this._lineJoin !== lineJoin) {
                this._lineJoin = lineJoin;
                this.styleID++;
            }
        }
    }, {
        key: 'miterLimit',
        get: function get() {
            return this._miterLimit;
        },
        set: function set(miterLimit) {
            if (this._miterLimit !== miterLimit) {
                this._miterLimit = miterLimit;
                this.styleID++;
            }
        }
    }, {
        key: 'padding',
        get: function get() {
            return this._padding;
        },
        set: function set(padding) {
            if (this._padding !== padding) {
                this._padding = padding;
                this.styleID++;
            }
        }
    }, {
        key: 'stroke',
        get: function get() {
            return this._stroke;
        },
        set: function set(stroke) {
            var outputColor = getColor(stroke);
            if (this._stroke !== outputColor) {
                this._stroke = outputColor;
                this.styleID++;
            }
        }
    }, {
        key: 'strokeThickness',
        get: function get() {
            return this._strokeThickness;
        },
        set: function set(strokeThickness) {
            if (this._strokeThickness !== strokeThickness) {
                this._strokeThickness = strokeThickness;
                this.styleID++;
            }
        }
    }, {
        key: 'textBaseline',
        get: function get() {
            return this._textBaseline;
        },
        set: function set(textBaseline) {
            if (this._textBaseline !== textBaseline) {
                this._textBaseline = textBaseline;
                this.styleID++;
            }
        }
    }, {
        key: 'wordWrap',
        get: function get() {
            return this._wordWrap;
        },
        set: function set(wordWrap) {
            if (this._wordWrap !== wordWrap) {
                this._wordWrap = wordWrap;
                this.styleID++;
            }
        }
    }, {
        key: 'wordWrapWidth',
        get: function get() {
            return this._wordWrapWidth;
        },
        set: function set(wordWrapWidth) {
            if (this._wordWrapWidth !== wordWrapWidth) {
                this._wordWrapWidth = wordWrapWidth;
                this.styleID++;
            }
        }
    }]);
    return TextStyle;
}();

function getColor(color) {
    if (typeof color === 'number') {
        return hex2string(color);
    } else if (Array.isArray(color)) {
        for (var i = 0; i < color.length; ++i) {
            if (typeof color[i] === 'number') {
                color[i] = hex2string(color[i]);
            }
        }
    }

    return color;
}

/* eslint max-depth: [2, 8] */
var RESOLUTION$5 = settings.RESOLUTION;


var defaultDestroyOptions = {
    texture: true,
    children: false,
    baseTexture: true
};

/**
 * A Text Object will create a line or multiple lines of text. To split a line you can use '\n' in your text string,
 * or add a wordWrap property set to true and and wordWrapWidth property with a value in the style object.
 *
 * A Text can be created directly from a string and a style object
 *
 * ```js
 * let text = new PIXI.Text('This is a pixi text',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
 * ```
 *
 * @class
 * @extends PIXI.Sprite
 * @memberof PIXI
 */

var Text = function (_Sprite) {
    inherits(Text, _Sprite);

    /**
     * @param {string} text - The string that you would like the text to display
     * @param {object|PIXI.TextStyle} [style] - The style parameters
     */
    function Text(text, style) {
        classCallCheck(this, Text);

        var canvas = document.createElement('canvas');

        canvas.width = 3;
        canvas.height = 3;

        var texture = Texture.fromCanvas(canvas);

        texture.orig = new Rectangle();
        texture.trim = new Rectangle();

        /**
         * The canvas element that everything is drawn to
         *
         * @member {HTMLCanvasElement}
         */
        var _this = possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, texture));

        _this.canvas = canvas;

        /**
         * The canvas 2d context that everything is drawn with
         * @member {HTMLCanvasElement}
         */
        _this.context = _this.canvas.getContext('2d');

        /**
         * The resolution / device pixel ratio of the canvas. This is set automatically by the renderer.
         * @member {number}
         * @default 1
         */
        _this.resolution = RESOLUTION$5;

        /**
         * Private tracker for the current text.
         *
         * @member {string}
         * @private
         */
        _this._text = null;

        /**
         * Private tracker for the current style.
         *
         * @member {object}
         * @private
         */
        _this._style = null;
        /**
         * Private listener to track style changes.
         *
         * @member {Function}
         * @private
         */
        _this._styleListener = null;

        /**
         * Private tracker for the current font.
         *
         * @member {string}
         * @private
         */
        _this._font = '';

        _this.text = text;
        _this.style = style;

        _this.localStyleID = -1;
        return _this;
    }

    /**
     * Renders text and updates it when needed.
     *
     * @private
     * @param {boolean} respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
     */


    createClass(Text, [{
        key: 'updateText',
        value: function updateText(respectDirty) {
            var style = this._style;

            // check if style has changed..
            if (this.localStyleID !== style.styleID) {
                this.dirty = true;
                this.localStyleID = style.styleID;
            }

            if (!this.dirty && respectDirty) {
                return;
            }

            this._font = Text.getFontStyle(style);

            this.context.font = this._font;

            // word wrap
            // preserve original text
            var outputText = style.wordWrap ? this.wordWrap(this._text) : this._text;

            // split text into lines
            var lines = outputText.split(/(?:\r\n|\r|\n)/);

            // calculate text width
            var lineWidths = new Array(lines.length);
            var maxLineWidth = 0;
            var fontProperties = Text.calculateFontProperties(this._font);

            for (var i = 0; i < lines.length; i++) {
                var lineWidth = this.context.measureText(lines[i]).width + (lines[i].length - 1) * style.letterSpacing;

                lineWidths[i] = lineWidth;
                maxLineWidth = Math.max(maxLineWidth, lineWidth);
            }

            var width = maxLineWidth + style.strokeThickness;

            if (style.dropShadow) {
                width += style.dropShadowDistance;
            }

            width += style.padding * 2;

            this.canvas.width = Math.ceil((width + this.context.lineWidth) * this.resolution);

            // calculate text height
            var lineHeight = this.style.lineHeight || fontProperties.fontSize + style.strokeThickness;

            var height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness) + (lines.length - 1) * lineHeight;

            if (style.dropShadow) {
                height += style.dropShadowDistance;
            }

            this.canvas.height = Math.ceil((height + this._style.padding * 2) * this.resolution);

            this.context.scale(this.resolution, this.resolution);

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.context.font = this._font;
            this.context.strokeStyle = style.stroke;
            this.context.lineWidth = style.strokeThickness;
            this.context.textBaseline = style.textBaseline;
            this.context.lineJoin = style.lineJoin;
            this.context.miterLimit = style.miterLimit;

            var linePositionX = void 0;
            var linePositionY = void 0;

            if (style.dropShadow) {
                if (style.dropShadowBlur > 0) {
                    this.context.shadowColor = style.dropShadowColor;
                    this.context.shadowBlur = style.dropShadowBlur;
                } else {
                    this.context.fillStyle = style.dropShadowColor;
                }

                var xShadowOffset = Math.cos(style.dropShadowAngle) * style.dropShadowDistance;
                var yShadowOffset = Math.sin(style.dropShadowAngle) * style.dropShadowDistance;

                for (var _i = 0; _i < lines.length; _i++) {
                    linePositionX = style.strokeThickness / 2;
                    linePositionY = style.strokeThickness / 2 + _i * lineHeight + fontProperties.ascent;

                    if (style.align === 'right') {
                        linePositionX += maxLineWidth - lineWidths[_i];
                    } else if (style.align === 'center') {
                        linePositionX += (maxLineWidth - lineWidths[_i]) / 2;
                    }

                    if (style.fill) {
                        this.drawLetterSpacing(lines[_i], linePositionX + xShadowOffset + style.padding, linePositionY + yShadowOffset + style.padding);

                        if (style.stroke && style.strokeThickness) {
                            this.context.strokeStyle = style.dropShadowColor;
                            this.drawLetterSpacing(lines[_i], linePositionX + xShadowOffset + style.padding, linePositionY + yShadowOffset + style.padding, true);
                            this.context.strokeStyle = style.stroke;
                        }
                    }
                }
            }

            // set canvas text styles
            this.context.fillStyle = this._generateFillStyle(style, lines);

            // draw lines line by line
            for (var _i2 = 0; _i2 < lines.length; _i2++) {
                linePositionX = style.strokeThickness / 2;
                linePositionY = style.strokeThickness / 2 + _i2 * lineHeight + fontProperties.ascent;

                if (style.align === 'right') {
                    linePositionX += maxLineWidth - lineWidths[_i2];
                } else if (style.align === 'center') {
                    linePositionX += (maxLineWidth - lineWidths[_i2]) / 2;
                }

                if (style.stroke && style.strokeThickness) {
                    this.drawLetterSpacing(lines[_i2], linePositionX + style.padding, linePositionY + style.padding, true);
                }

                if (style.fill) {
                    this.drawLetterSpacing(lines[_i2], linePositionX + style.padding, linePositionY + style.padding);
                }
            }

            this.updateTexture();
        }

        /**
         * Render the text with letter-spacing.
         * @param {string} text - The text to draw
         * @param {number} x - Horizontal position to draw the text
         * @param {number} y - Vertical position to draw the text
         * @param {boolean} [isStroke=false] - Is this drawing for the outside stroke of the
         *  text? If not, it's for the inside fill
         * @private
         */

    }, {
        key: 'drawLetterSpacing',
        value: function drawLetterSpacing(text, x, y) {
            var isStroke = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var style = this._style;

            // letterSpacing of 0 means normal
            var letterSpacing = style.letterSpacing;

            if (letterSpacing === 0) {
                if (isStroke) {
                    this.context.strokeText(text, x, y);
                } else {
                    this.context.fillText(text, x, y);
                }

                return;
            }

            var characters = String.prototype.split.call(text, '');
            var currentPosition = x;
            var index = 0;
            var current = '';

            while (index < text.length) {
                current = characters[index++];
                if (isStroke) {
                    this.context.strokeText(current, currentPosition, y);
                } else {
                    this.context.fillText(current, currentPosition, y);
                }
                currentPosition += this.context.measureText(current).width + letterSpacing;
            }
        }

        /**
         * Updates texture size based on canvas size
         *
         * @private
         */

    }, {
        key: 'updateTexture',
        value: function updateTexture() {
            var texture = this._texture;
            var style = this._style;

            texture.baseTexture.hasLoaded = true;
            texture.baseTexture.resolution = this.resolution;

            texture.baseTexture.realWidth = this.canvas.width;
            texture.baseTexture.realHeight = this.canvas.height;
            texture.baseTexture.width = this.canvas.width / this.resolution;
            texture.baseTexture.height = this.canvas.height / this.resolution;
            texture.trim.width = texture._frame.width = this.canvas.width / this.resolution;
            texture.trim.height = texture._frame.height = this.canvas.height / this.resolution;

            texture.trim.x = -style.padding;
            texture.trim.y = -style.padding;

            texture.orig.width = texture._frame.width - style.padding * 2;
            texture.orig.height = texture._frame.height - style.padding * 2;

            // call sprite onTextureUpdate to update scale if _width or _height were set
            this._onTextureUpdate();

            texture.baseTexture.emit('update', texture.baseTexture);

            this.dirty = false;
        }

        /**
         * Renders the object using the WebGL renderer
         *
         * @param {PIXI.WebGLRenderer} renderer - The renderer
         */

    }, {
        key: 'renderWebGL',
        value: function renderWebGL(renderer) {
            if (this.resolution !== renderer.resolution) {
                this.resolution = renderer.resolution;
                this.dirty = true;
            }

            this.updateText(true);

            get$1(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), 'renderWebGL', this).call(this, renderer);
        }

        /**
         * Renders the object using the Canvas renderer
         *
         * @private
         * @param {PIXI.CanvasRenderer} renderer - The renderer
         */

    }, {
        key: '_renderCanvas',
        value: function _renderCanvas(renderer) {
            if (this.resolution !== renderer.resolution) {
                this.resolution = renderer.resolution;
                this.dirty = true;
            }

            this.updateText(true);

            get$1(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), '_renderCanvas', this).call(this, renderer);
        }

        /**
         * Applies newlines to a string to have it optimally fit into the horizontal
         * bounds set by the Text object's wordWrapWidth property.
         *
         * @private
         * @param {string} text - String to apply word wrapping to
         * @return {string} New string with new lines applied where required
         */

    }, {
        key: 'wordWrap',
        value: function wordWrap(text) {
            // Greedy wrapping algorithm that will wrap words as the line grows longer
            // than its horizontal bounds.
            var result = '';
            var lines = text.split('\n');
            var wordWrapWidth = this._style.wordWrapWidth;

            for (var i = 0; i < lines.length; i++) {
                var spaceLeft = wordWrapWidth;
                var words = lines[i].split(' ');

                for (var j = 0; j < words.length; j++) {
                    var wordWidth = this.context.measureText(words[j]).width;

                    if (this._style.breakWords && wordWidth > wordWrapWidth) {
                        // Word should be split in the middle
                        var characters = words[j].split('');

                        for (var c = 0; c < characters.length; c++) {
                            var characterWidth = this.context.measureText(characters[c]).width;

                            if (characterWidth > spaceLeft) {
                                result += '\n' + characters[c];
                                spaceLeft = wordWrapWidth - characterWidth;
                            } else {
                                if (c === 0) {
                                    result += ' ';
                                }

                                result += characters[c];
                                spaceLeft -= characterWidth;
                            }
                        }
                    } else {
                        var wordWidthWithSpace = wordWidth + this.context.measureText(' ').width;

                        if (j === 0 || wordWidthWithSpace > spaceLeft) {
                            // Skip printing the newline if it's the first word of the line that is
                            // greater than the word wrap width.
                            if (j > 0) {
                                result += '\n';
                            }
                            result += words[j];
                            spaceLeft = wordWrapWidth - wordWidth;
                        } else {
                            spaceLeft -= wordWidthWithSpace;
                            result += ' ' + words[j];
                        }
                    }
                }

                if (i < lines.length - 1) {
                    result += '\n';
                }
            }

            return result;
        }

        /**
         * calculates the bounds of the Text as a rectangle. The bounds calculation takes the worldTransform into account.
         */

    }, {
        key: '_calculateBounds',
        value: function _calculateBounds() {
            this.updateText(true);
            this.calculateVertices();
            // if we have already done this on THIS frame.
            this._bounds.addQuad(this.vertexData);
        }

        /**
         * Method to be called upon a TextStyle change.
         * @private
         */

    }, {
        key: '_onStyleChange',
        value: function _onStyleChange() {
            this.dirty = true;
        }

        /**
         * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
         *
         * @private
         * @param {object} style - The style.
         * @param {string} lines - The lines of text.
         * @return {string|number|CanvasGradient} The fill style
         */

    }, {
        key: '_generateFillStyle',
        value: function _generateFillStyle(style, lines) {
            if (!Array.isArray(style.fill)) {
                return style.fill;
            }

            // cocoon on canvas+ cannot generate textures, so use the first colour instead
            if (navigator.isCocoonJS) {
                return style.fill[0];
            }

            // the gradient will be evenly spaced out according to how large the array is.
            // ['#FF0000', '#00FF00', '#0000FF'] would created stops at 0.25, 0.5 and 0.75
            var gradient = void 0;
            var totalIterations = void 0;
            var currentIteration = void 0;
            var stop = void 0;

            var width = this.canvas.width / this.resolution;
            var height = this.canvas.height / this.resolution;

            if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
                // start the gradient at the top center of the canvas, and end at the bottom middle of the canvas
                gradient = this.context.createLinearGradient(width / 2, 0, width / 2, height);

                // we need to repeat the gradient so that each individual line of text has the same vertical gradient effect
                // ['#FF0000', '#00FF00', '#0000FF'] over 2 lines would create stops at 0.125, 0.25, 0.375, 0.625, 0.75, 0.875
                totalIterations = (style.fill.length + 1) * lines.length;
                currentIteration = 0;
                for (var i = 0; i < lines.length; i++) {
                    currentIteration += 1;
                    for (var j = 0; j < style.fill.length; j++) {
                        stop = currentIteration / totalIterations;
                        gradient.addColorStop(stop, style.fill[j]);
                        currentIteration++;
                    }
                }
            } else {
                // start the gradient at the center left of the canvas, and end at the center right of the canvas
                gradient = this.context.createLinearGradient(0, height / 2, width, height / 2);

                // can just evenly space out the gradients in this case, as multiple lines makes no difference
                // to an even left to right gradient
                totalIterations = style.fill.length + 1;
                currentIteration = 1;

                for (var _i3 = 0; _i3 < style.fill.length; _i3++) {
                    stop = currentIteration / totalIterations;
                    gradient.addColorStop(stop, style.fill[_i3]);
                    currentIteration++;
                }
            }

            return gradient;
        }

        /**
         * Destroys this text object.
         * Note* Unlike a Sprite, a Text object will automatically destroy its baseTexture and texture as
         * the majorety of the time the texture will not be shared with any other Sprites.
         *
         * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
         *  have been set to that value
         * @param {boolean} [options.children=false] - if set to true, all the children will have their
         *  destroy method called as well. 'options' will be passed on to those calls.
         * @param {boolean} [options.texture=true] - Should it destroy the current texture of the sprite as well
         * @param {boolean} [options.baseTexture=true] - Should it destroy the base texture of the sprite as well
         */

    }, {
        key: 'destroy',
        value: function destroy(options) {
            if (typeof options === 'boolean') {
                options = { children: options };
            }

            options = Object.assign({}, defaultDestroyOptions, options);

            get$1(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), 'destroy', this).call(this, options);

            // make sure to reset the the context and canvas.. dont want this hanging around in memory!
            this.context = null;
            this.canvas = null;

            this._style = null;
        }

        /**
         * The width of the Text, setting this will actually modify the scale to achieve the value set
         *
         * @member {number}
         * @memberof PIXI.Text#
         */

    }, {
        key: 'width',
        get: function get() {
            this.updateText(true);

            return Math.abs(this.scale.x) * this.texture.orig.width;
        }

        /**
         * Sets the width of the text.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.updateText(true);

            var s = sign(this.scale.x) || 1;

            this.scale.x = s * value / this.texture.orig.width;
            this._width = value;
        }

        /**
         * The height of the Text, setting this will actually modify the scale to achieve the value set
         *
         * @member {number}
         * @memberof PIXI.Text#
         */

    }, {
        key: 'height',
        get: function get() {
            this.updateText(true);

            return Math.abs(this.scale.y) * this._texture.orig.height;
        }

        /**
         * Sets the height of the text.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.updateText(true);

            var s = sign(this.scale.y) || 1;

            this.scale.y = s * value / this.texture.orig.height;
            this._height = value;
        }

        /**
         * Set the style of the text. Set up an event listener to listen for changes on the style
         * object and mark the text as dirty.
         *
         * @member {object|PIXI.TextStyle}
         * @memberof PIXI.Text#
         */

    }, {
        key: 'style',
        get: function get() {
            return this._style;
        }

        /**
         * Sets the style of the text.
         *
         * @param {object} style - The value to set to.
         */
        ,
        set: function set(style) {
            style = style || {};

            if (style instanceof TextStyle) {
                this._style = style;
            } else {
                this._style = new TextStyle(style);
            }

            this.localStyleID = -1;
            this.dirty = true;
        }

        /**
         * Set the copy for the text object. To split a line you can use '\n'.
         *
         * @member {string}
         * @memberof PIXI.Text#
         */

    }, {
        key: 'text',
        get: function get() {
            return this._text;
        }

        /**
         * Sets the text.
         *
         * @param {string} text - The value to set to.
         */
        ,
        set: function set(text) {
            text = text || ' ';
            text = text.toString();

            if (this._text === text) {
                return;
            }
            this._text = text;
            this.dirty = true;
        }

        /**
         * Generates a font style string to use for Text.calculateFontProperties(). Takes the same parameter
         * as Text.style.
         *
         * @static
         * @param {object|TextStyle} style - String representing the style of the font
         * @return {string} Font style string, for passing to Text.calculateFontProperties()
         */

    }], [{
        key: 'getFontStyle',
        value: function getFontStyle(style) {
            style = style || {};

            if (!(style instanceof TextStyle)) {
                style = new TextStyle(style);
            }

            // build canvas api font setting from individual components. Convert a numeric style.fontSize to px
            var fontSizeString = typeof style.fontSize === 'number' ? style.fontSize + 'px' : style.fontSize;

            return style.fontStyle + ' ' + style.fontVariant + ' ' + style.fontWeight + ' ' + fontSizeString + ' ' + style.fontFamily;
        }

        /**
         * Calculates the ascent, descent and fontSize of a given fontStyle
         *
         * @static
         * @param {string} fontStyle - String representing the style of the font
         * @return {Object} Font properties object
         */

    }, {
        key: 'calculateFontProperties',
        value: function calculateFontProperties(fontStyle) {
            // as this method is used for preparing assets, don't recalculate things if we don't need to
            if (Text.fontPropertiesCache[fontStyle]) {
                return Text.fontPropertiesCache[fontStyle];
            }

            var properties = {};

            var canvas = Text.fontPropertiesCanvas;
            var context = Text.fontPropertiesContext;

            context.font = fontStyle;

            var width = Math.ceil(context.measureText('|MÉq').width);
            var baseline = Math.ceil(context.measureText('M').width);
            var height = 2 * baseline;

            baseline = baseline * 1.4 | 0;

            canvas.width = width;
            canvas.height = height;

            context.fillStyle = '#f00';
            context.fillRect(0, 0, width, height);

            context.font = fontStyle;

            context.textBaseline = 'alphabetic';
            context.fillStyle = '#000';
            context.fillText('|MÉq', 0, baseline);

            var imagedata = context.getImageData(0, 0, width, height).data;
            var pixels = imagedata.length;
            var line = width * 4;

            var i = 0;
            var idx = 0;
            var stop = false;

            // ascent. scan from top to bottom until we find a non red pixel
            for (i = 0; i < baseline; ++i) {
                for (var j = 0; j < line; j += 4) {
                    if (imagedata[idx + j] !== 255) {
                        stop = true;
                        break;
                    }
                }
                if (!stop) {
                    idx += line;
                } else {
                    break;
                }
            }

            properties.ascent = baseline - i;

            idx = pixels - line;
            stop = false;

            // descent. scan from bottom to top until we find a non red pixel
            for (i = height; i > baseline; --i) {
                for (var _j = 0; _j < line; _j += 4) {
                    if (imagedata[idx + _j] !== 255) {
                        stop = true;
                        break;
                    }
                }

                if (!stop) {
                    idx -= line;
                } else {
                    break;
                }
            }

            properties.descent = i - baseline;
            properties.fontSize = properties.ascent + properties.descent;

            Text.fontPropertiesCache[fontStyle] = properties;

            return properties;
        }
    }]);
    return Text;
}(Sprite);

Text.fontPropertiesCache = {};
Text.fontPropertiesCanvas = document.createElement('canvas');
Text.fontPropertiesContext = Text.fontPropertiesCanvas.getContext('2d');

/**
 * A GraphicsData object.
 *
 * @class
 * @memberof PIXI
 */
var GraphicsData = function () {
  /**
   *
   * @param {number} lineWidth - the width of the line to draw
   * @param {number} lineColor - the color of the line to draw
   * @param {number} lineAlpha - the alpha of the line to draw
   * @param {number} fillColor - the color of the fill
   * @param {number} fillAlpha - the alpha of the fill
   * @param {boolean} fill - whether or not the shape is filled with a colour
   * @param {PIXI.Circle|PIXI.Rectangle|PIXI.Ellipse|PIXI.Polygon} shape - The shape object to draw.
   */
  function GraphicsData(lineWidth, lineColor, lineAlpha, fillColor, fillAlpha, fill, shape) {
    classCallCheck(this, GraphicsData);

    /**
     * @member {number} the width of the line to draw
     */
    this.lineWidth = lineWidth;

    /**
     * @member {number} the color of the line to draw
     */
    this.lineColor = lineColor;

    /**
     * @member {number} the alpha of the line to draw
     */
    this.lineAlpha = lineAlpha;

    /**
     * @member {number} cached tint of the line to draw
     */
    this._lineTint = lineColor;

    /**
     * @member {number} the color of the fill
     */
    this.fillColor = fillColor;

    /**
     * @member {number} the alpha of the fill
     */
    this.fillAlpha = fillAlpha;

    /**
     * @member {number} cached tint of the fill
     */
    this._fillTint = fillColor;

    /**
     * @member {boolean} whether or not the shape is filled with a colour
     */
    this.fill = fill;

    this.holes = [];

    /**
     * @member {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} The shape object to draw.
     */
    this.shape = shape;

    /**
     * @member {number} The type of the shape, see the Const.Shapes file for all the existing types,
     */
    this.type = shape.type;
  }

  /**
   * Creates a new GraphicsData object with the same values as this one.
   *
   * @return {PIXI.GraphicsData} Cloned GraphicsData object
   */


  createClass(GraphicsData, [{
    key: "clone",
    value: function clone() {
      return new GraphicsData(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.fill, this.shape);
    }

    /**
     * Adds a hole to the shape.
     *
     * @param {PIXI.Rectangle|PIXI.Circle} shape - The shape of the hole.
     */

  }, {
    key: "addHole",
    value: function addHole(shape) {
      this.holes.push(shape);
    }

    /**
     * Destroys the Graphics data.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.shape = null;
      this.holes = null;
    }
  }]);
  return GraphicsData;
}();

/**
 * Calculate the points for a bezier curve and then draws it.
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @param {number} fromX - Starting point x
 * @param {number} fromY - Starting point y
 * @param {number} cpX - Control point x
 * @param {number} cpY - Control point y
 * @param {number} cpX2 - Second Control point x
 * @param {number} cpY2 - Second Control point y
 * @param {number} toX - Destination point x
 * @param {number} toY - Destination point y
 * @param {number[]} [path=[]] - Path array to push points into
 * @return {number[]} Array of points of the curve
 */
function bezierCurveTo$1(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY) {
    var path$$1 = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];

    var n = 20;
    var dt = 0;
    var dt2 = 0;
    var dt3 = 0;
    var t2 = 0;
    var t3 = 0;

    path$$1.push(fromX, fromY);

    for (var i = 1, j = 0; i <= n; ++i) {
        j = i / n;

        dt = 1 - j;
        dt2 = dt * dt;
        dt3 = dt2 * dt;

        t2 = j * j;
        t3 = t2 * j;

        path$$1.push(dt3 * fromX + 3 * dt2 * j * cpX + 3 * dt * t2 * cpX2 + t3 * toX, dt3 * fromY + 3 * dt2 * j * cpY + 3 * dt * t2 * cpY2 + t3 * toY);
    }

    return path$$1;
}

var canvasRenderer = void 0;
var tempMatrix$1 = new Matrix();
var tempPoint$1 = new Point();
var tempColor1 = new Float32Array(4);
var tempColor2 = new Float32Array(4);

/**
 * The Graphics class contains methods used to draw primitive shapes such as lines, circles and
 * rectangles to the display, and to color and fill them.
 *
 * @class
 * @extends PIXI.Container
 * @memberof PIXI
 */

var Graphics = function (_Container) {
    inherits(Graphics, _Container);

    /**
     *
     */
    function Graphics() {
        classCallCheck(this, Graphics);

        /**
         * The alpha value used when filling the Graphics object.
         *
         * @member {number}
         * @default 1
         */
        var _this = possibleConstructorReturn(this, (Graphics.__proto__ || Object.getPrototypeOf(Graphics)).call(this));

        _this.fillAlpha = 1;

        /**
         * The width (thickness) of any lines drawn.
         *
         * @member {number}
         * @default 0
         */
        _this.lineWidth = 0;

        /**
         * The color of any lines drawn.
         *
         * @member {string}
         * @default 0
         */
        _this.lineColor = 0;

        /**
         * Graphics data
         *
         * @member {PIXI.GraphicsData[]}
         * @private
         */
        _this.graphicsData = [];

        /**
         * The tint applied to the graphic shape. This is a hex value. Apply a value of 0xFFFFFF to
         * reset the tint.
         *
         * @member {number}
         * @default 0xFFFFFF
         */
        _this.tint = 0xFFFFFF;

        /**
         * The previous tint applied to the graphic shape. Used to compare to the current tint and
         * check if theres change.
         *
         * @member {number}
         * @private
         * @default 0xFFFFFF
         */
        _this._prevTint = 0xFFFFFF;

        /**
         * The blend mode to be applied to the graphic shape. Apply a value of
         * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
         *
         * @member {number}
         * @default PIXI.BLEND_MODES.NORMAL;
         * @see PIXI.BLEND_MODES
         */
        _this.blendMode = BLEND_MODES.NORMAL;

        /**
         * Current path
         *
         * @member {PIXI.GraphicsData}
         * @private
         */
        _this.currentPath = null;

        /**
         * Array containing some WebGL-related properties used by the WebGL renderer.
         *
         * @member {object<number, object>}
         * @private
         */
        // TODO - _webgl should use a prototype object, not a random undocumented object...
        _this._webGL = {};

        /**
         * Whether this shape is being used as a mask.
         *
         * @member {boolean}
         */
        _this.isMask = false;

        /**
         * The bounds' padding used for bounds calculation.
         *
         * @member {number}
         */
        _this.boundsPadding = 0;

        /**
         * A cache of the local bounds to prevent recalculation.
         *
         * @member {PIXI.Rectangle}
         * @private
         */
        _this._localBounds = new Bounds();

        /**
         * Used to detect if the graphics object has changed. If this is set to true then the graphics
         * object will be recalculated.
         *
         * @member {boolean}
         * @private
         */
        _this.dirty = 0;

        /**
         * Used to detect if we need to do a fast rect check using the id compare method
         * @type {Number}
         */
        _this.fastRectDirty = -1;

        /**
         * Used to detect if we clear the graphics webGL data
         * @type {Number}
         */
        _this.clearDirty = 0;

        /**
         * Used to detect if we we need to recalculate local bounds
         * @type {Number}
         */
        _this.boundsDirty = -1;

        /**
         * Used to detect if the cached sprite object needs to be updated.
         *
         * @member {boolean}
         * @private
         */
        _this.cachedSpriteDirty = false;

        _this._spriteRect = null;
        _this._fastRect = false;

        /**
         * When cacheAsBitmap is set to true the graphics object will be rendered as if it was a sprite.
         * This is useful if your graphics element does not change often, as it will speed up the rendering
         * of the object in exchange for taking up texture memory. It is also useful if you need the graphics
         * object to be anti-aliased, because it will be rendered using canvas. This is not recommended if
         * you are constantly redrawing the graphics element.
         *
         * @name cacheAsBitmap
         * @member {boolean}
         * @memberof PIXI.Graphics#
         * @default false
         */
        return _this;
    }

    /**
     * Creates a new Graphics object with the same values as this one.
     * Note that the only the properties of the object are cloned, not its transform (position,scale,etc)
     *
     * @return {PIXI.Graphics} A clone of the graphics object
     */


    createClass(Graphics, [{
        key: 'clone',
        value: function clone() {
            var clone = new Graphics();

            clone.renderable = this.renderable;
            clone.fillAlpha = this.fillAlpha;
            clone.lineWidth = this.lineWidth;
            clone.lineColor = this.lineColor;
            clone.tint = this.tint;
            clone.blendMode = this.blendMode;
            clone.isMask = this.isMask;
            clone.boundsPadding = this.boundsPadding;
            clone.dirty = 0;
            clone.cachedSpriteDirty = this.cachedSpriteDirty;

            // copy graphics data
            for (var i = 0; i < this.graphicsData.length; ++i) {
                clone.graphicsData.push(this.graphicsData[i].clone());
            }

            clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];

            clone.updateLocalBounds();

            return clone;
        }

        /**
         * Specifies the line style used for subsequent calls to Graphics methods such as the lineTo()
         * method or the drawCircle() method.
         *
         * @param {number} [lineWidth=0] - width of the line to draw, will update the objects stored style
         * @param {number} [color=0] - color of the line to draw, will update the objects stored style
         * @param {number} [alpha=1] - alpha of the line to draw, will update the objects stored style
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'lineStyle',
        value: function lineStyle() {
            var lineWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            this.lineWidth = lineWidth;
            this.lineColor = color;
            this.lineAlpha = alpha;

            if (this.currentPath) {
                if (this.currentPath.shape.points.length) {
                    // halfway through a line? start a new one!
                    var shape = new Polygon(this.currentPath.shape.points.slice(-2));

                    shape.closed = false;

                    this.drawShape(shape);
                } else {
                    // otherwise its empty so lets just set the line properties
                    this.currentPath.lineWidth = this.lineWidth;
                    this.currentPath.lineColor = this.lineColor;
                    this.currentPath.lineAlpha = this.lineAlpha;
                }
            }

            return this;
        }

        /**
         * Moves the current drawing position to x, y.
         *
         * @param {number} x - the X coordinate to move to
         * @param {number} y - the Y coordinate to move to
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'moveTo',
        value: function moveTo(x, y) {
            var shape = new Polygon([x, y]);

            shape.closed = false;
            this.drawShape(shape);

            return this;
        }

        /**
         * Draws a line using the current line style from the current drawing position to (x, y);
         * The current drawing position is then set to (x, y).
         *
         * @param {number} x - the X coordinate to draw to
         * @param {number} y - the Y coordinate to draw to
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'lineTo',
        value: function lineTo(x, y) {
            this.currentPath.shape.points.push(x, y);
            this.dirty++;

            return this;
        }

        /**
         * Calculate the points for a quadratic bezier curve and then draws it.
         * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
         *
         * @param {number} cpX - Control point x
         * @param {number} cpY - Control point y
         * @param {number} toX - Destination point x
         * @param {number} toY - Destination point y
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'quadraticCurveTo',
        value: function quadraticCurveTo(cpX, cpY, toX, toY) {
            if (this.currentPath) {
                if (this.currentPath.shape.points.length === 0) {
                    this.currentPath.shape.points = [0, 0];
                }
            } else {
                this.moveTo(0, 0);
            }

            var n = 20;
            var points = this.currentPath.shape.points;
            var xa = 0;
            var ya = 0;

            if (points.length === 0) {
                this.moveTo(0, 0);
            }

            var fromX = points[points.length - 2];
            var fromY = points[points.length - 1];

            for (var i = 1; i <= n; ++i) {
                var j = i / n;

                xa = fromX + (cpX - fromX) * j;
                ya = fromY + (cpY - fromY) * j;

                points.push(xa + (cpX + (toX - cpX) * j - xa) * j, ya + (cpY + (toY - cpY) * j - ya) * j);
            }

            this.dirty++;

            return this;
        }

        /**
         * Calculate the points for a bezier curve and then draws it.
         *
         * @param {number} cpX - Control point x
         * @param {number} cpY - Control point y
         * @param {number} cpX2 - Second Control point x
         * @param {number} cpY2 - Second Control point y
         * @param {number} toX - Destination point x
         * @param {number} toY - Destination point y
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'bezierCurveTo',
        value: function bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY) {
            if (this.currentPath) {
                if (this.currentPath.shape.points.length === 0) {
                    this.currentPath.shape.points = [0, 0];
                }
            } else {
                this.moveTo(0, 0);
            }

            var points = this.currentPath.shape.points;

            var fromX = points[points.length - 2];
            var fromY = points[points.length - 1];

            points.length -= 2;

            bezierCurveTo$1(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, points);

            this.dirty++;

            return this;
        }

        /**
         * The arcTo() method creates an arc/curve between two tangents on the canvas.
         *
         * "borrowed" from https://code.google.com/p/fxcanvas/ - thanks google!
         *
         * @param {number} x1 - The x-coordinate of the beginning of the arc
         * @param {number} y1 - The y-coordinate of the beginning of the arc
         * @param {number} x2 - The x-coordinate of the end of the arc
         * @param {number} y2 - The y-coordinate of the end of the arc
         * @param {number} radius - The radius of the arc
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'arcTo',
        value: function arcTo(x1, y1, x2, y2, radius) {
            if (this.currentPath) {
                if (this.currentPath.shape.points.length === 0) {
                    this.currentPath.shape.points.push(x1, y1);
                }
            } else {
                this.moveTo(x1, y1);
            }

            var points = this.currentPath.shape.points;
            var fromX = points[points.length - 2];
            var fromY = points[points.length - 1];
            var a1 = fromY - y1;
            var b1 = fromX - x1;
            var a2 = y2 - y1;
            var b2 = x2 - x1;
            var mm = Math.abs(a1 * b2 - b1 * a2);

            if (mm < 1.0e-8 || radius === 0) {
                if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) {
                    points.push(x1, y1);
                }
            } else {
                var dd = a1 * a1 + b1 * b1;
                var cc = a2 * a2 + b2 * b2;
                var tt = a1 * a2 + b1 * b2;
                var k1 = radius * Math.sqrt(dd) / mm;
                var k2 = radius * Math.sqrt(cc) / mm;
                var j1 = k1 * tt / dd;
                var j2 = k2 * tt / cc;
                var cx = k1 * b2 + k2 * b1;
                var cy = k1 * a2 + k2 * a1;
                var px = b1 * (k2 + j1);
                var py = a1 * (k2 + j1);
                var qx = b2 * (k1 + j2);
                var qy = a2 * (k1 + j2);
                var startAngle = Math.atan2(py - cy, px - cx);
                var endAngle = Math.atan2(qy - cy, qx - cx);

                this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
            }

            this.dirty++;

            return this;
        }

        /**
         * The arc method creates an arc/curve (used to create circles, or parts of circles).
         *
         * @param {number} cx - The x-coordinate of the center of the circle
         * @param {number} cy - The y-coordinate of the center of the circle
         * @param {number} radius - The radius of the circle
         * @param {number} startAngle - The starting angle, in radians (0 is at the 3 o'clock position
         *  of the arc's circle)
         * @param {number} endAngle - The ending angle, in radians
         * @param {boolean} [anticlockwise=false] - Specifies whether the drawing should be
         *  counter-clockwise or clockwise. False is default, and indicates clockwise, while true
         *  indicates counter-clockwise.
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'arc',
        value: function arc(cx, cy, radius, startAngle, endAngle) {
            var anticlockwise = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

            if (startAngle === endAngle) {
                return this;
            }

            if (!anticlockwise && endAngle <= startAngle) {
                endAngle += Math.PI * 2;
            } else if (anticlockwise && startAngle <= endAngle) {
                startAngle += Math.PI * 2;
            }

            var sweep = endAngle - startAngle;
            var segs = Math.ceil(Math.abs(sweep) / (Math.PI * 2)) * 40;

            if (sweep === 0) {
                return this;
            }

            var startX = cx + Math.cos(startAngle) * radius;
            var startY = cy + Math.sin(startAngle) * radius;

            var points = this.currentPath.shape.points;

            if (this.currentPath) {
                if (points[points.length - 2] !== startX || points[points.length - 1] !== startY) {
                    points.push(startX, startY);
                }
            } else {
                this.moveTo(startX, startY);
            }

            var theta = sweep / (segs * 2);
            var theta2 = theta * 2;

            var cTheta = Math.cos(theta);
            var sTheta = Math.sin(theta);

            var segMinus = segs - 1;

            var remainder = segMinus % 1 / segMinus;

            for (var i = 0; i <= segMinus; ++i) {
                var real = i + remainder * i;

                var angle = theta + startAngle + theta2 * real;

                var c = Math.cos(angle);
                var s = -Math.sin(angle);

                points.push((cTheta * c + sTheta * s) * radius + cx, (cTheta * -s + sTheta * c) * radius + cy);
            }

            this.dirty++;

            return this;
        }

        /**
         * Specifies a simple one-color fill that subsequent calls to other Graphics methods
         * (such as lineTo() or drawCircle()) use when drawing.
         *
         * @param {number} [color=0] - the color of the fill
         * @param {number} [alpha=1] - the alpha of the fill
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'beginFill',
        value: function beginFill() {
            var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            this.filling = true;
            this.fillColor = color;
            this.fillAlpha = alpha;

            if (this.currentPath) {
                if (this.currentPath.shape.points.length <= 2) {
                    this.currentPath.fill = this.filling;
                    this.currentPath.fillColor = this.fillColor;
                    this.currentPath.fillAlpha = this.fillAlpha;
                }
            }

            return this;
        }

        /**
         * Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
         *
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'endFill',
        value: function endFill() {
            this.filling = false;
            this.fillColor = null;
            this.fillAlpha = 1;

            return this;
        }

        /**
         *
         * @param {number} x - The X coord of the top-left of the rectangle
         * @param {number} y - The Y coord of the top-left of the rectangle
         * @param {number} width - The width of the rectangle
         * @param {number} height - The height of the rectangle
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'drawRect',
        value: function drawRect(x, y, width, height) {
            this.drawShape(new Rectangle(x, y, width, height));

            return this;
        }

        /**
         *
         * @param {number} x - The X coord of the top-left of the rectangle
         * @param {number} y - The Y coord of the top-left of the rectangle
         * @param {number} width - The width of the rectangle
         * @param {number} height - The height of the rectangle
         * @param {number} radius - Radius of the rectangle corners
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'drawRoundedRect',
        value: function drawRoundedRect(x, y, width, height, radius) {
            this.drawShape(new RoundedRectangle(x, y, width, height, radius));

            return this;
        }

        /**
         * Draws a circle.
         *
         * @param {number} x - The X coordinate of the center of the circle
         * @param {number} y - The Y coordinate of the center of the circle
         * @param {number} radius - The radius of the circle
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'drawCircle',
        value: function drawCircle(x, y, radius) {
            this.drawShape(new Circle(x, y, radius));

            return this;
        }

        /**
         * Draws an ellipse.
         *
         * @param {number} x - The X coordinate of the center of the ellipse
         * @param {number} y - The Y coordinate of the center of the ellipse
         * @param {number} width - The half width of the ellipse
         * @param {number} height - The half height of the ellipse
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'drawEllipse',
        value: function drawEllipse(x, y, width, height) {
            this.drawShape(new Ellipse(x, y, width, height));

            return this;
        }

        /**
         * Draws a polygon using the given path.
         *
         * @param {number[]|PIXI.Point[]} path - The path data used to construct the polygon.
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'drawPolygon',
        value: function drawPolygon(path$$1) {
            // prevents an argument assignment deopt
            // see section 3.1: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            var points = path$$1;

            var closed = true;

            if (points instanceof Polygon) {
                closed = points.closed;
                points = points.points;
            }

            if (!Array.isArray(points)) {
                // prevents an argument leak deopt
                // see section 3.2: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
                points = new Array(arguments.length);

                for (var i = 0; i < points.length; ++i) {
                    points[i] = arguments[i]; // eslint-disable-line prefer-rest-params
                }
            }

            var shape = new Polygon(points);

            shape.closed = closed;

            this.drawShape(shape);

            return this;
        }

        /**
         * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
         *
         * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */

    }, {
        key: 'clear',
        value: function clear() {
            if (this.lineWidth || this.filling || this.graphicsData.length > 0) {
                this.lineWidth = 0;
                this.filling = false;

                this.dirty++;
                this.clearDirty++;
                this.graphicsData.length = 0;
            }

            return this;
        }

        /**
         * True if graphics consists of one rectangle, and thus, can be drawn like a Sprite and
         * masked with gl.scissor.
         *
         * @returns {boolean} True if only 1 rect.
         */

    }, {
        key: 'isFastRect',
        value: function isFastRect() {
            return this.graphicsData.length === 1 && this.graphicsData[0].shape.type === SHAPES.RECT && !this.graphicsData[0].lineWidth;
        }

        /**
         * Renders the object using the WebGL renderer
         *
         * @private
         * @param {PIXI.WebGLRenderer} renderer - The renderer
         */

    }, {
        key: '_renderWebGL',
        value: function _renderWebGL(renderer) {
            // if the sprite is not visible or the alpha is 0 then no need to render this element
            if (this.dirty !== this.fastRectDirty) {
                this.fastRectDirty = this.dirty;
                this._fastRect = this.isFastRect();
            }

            // TODO this check can be moved to dirty?
            if (this._fastRect) {
                this._renderSpriteRect(renderer);
            } else {
                renderer.setObjectRenderer(renderer.plugins.graphics);
                renderer.plugins.graphics.render(this);
            }
        }

        /**
         * Renders a sprite rectangle.
         *
         * @private
         * @param {PIXI.WebGLRenderer} renderer - The renderer
         */

    }, {
        key: '_renderSpriteRect',
        value: function _renderSpriteRect(renderer) {
            var rect = this.graphicsData[0].shape;

            if (!this._spriteRect) {
                if (!Graphics._SPRITE_TEXTURE) {
                    Graphics._SPRITE_TEXTURE = RenderTexture.create(10, 10);

                    var canvas = document.createElement('canvas');

                    canvas.width = 10;
                    canvas.height = 10;

                    var context = canvas.getContext('2d');

                    context.fillStyle = 'white';
                    context.fillRect(0, 0, 10, 10);

                    Graphics._SPRITE_TEXTURE = Texture.fromCanvas(canvas);
                }

                this._spriteRect = new Sprite(Graphics._SPRITE_TEXTURE);
            }
            if (this.tint === 0xffffff) {
                this._spriteRect.tint = this.graphicsData[0].fillColor;
            } else {
                var t1 = tempColor1;
                var t2 = tempColor2;

                hex2rgb(this.graphicsData[0].fillColor, t1);
                hex2rgb(this.tint, t2);

                t1[0] *= t2[0];
                t1[1] *= t2[1];
                t1[2] *= t2[2];

                this._spriteRect.tint = rgb2hex(t1);
            }
            this._spriteRect.alpha = this.graphicsData[0].fillAlpha;
            this._spriteRect.worldAlpha = this.worldAlpha * this._spriteRect.alpha;

            Graphics._SPRITE_TEXTURE._frame.width = rect.width;
            Graphics._SPRITE_TEXTURE._frame.height = rect.height;

            this._spriteRect.transform.worldTransform = this.transform.worldTransform;

            this._spriteRect.anchor.set(-rect.x / rect.width, -rect.y / rect.height);
            this._spriteRect._onAnchorUpdate();

            this._spriteRect._renderWebGL(renderer);
        }

        /**
         * Renders the object using the Canvas renderer
         *
         * @private
         * @param {PIXI.CanvasRenderer} renderer - The renderer
         */

    }, {
        key: '_renderCanvas',
        value: function _renderCanvas(renderer) {
            if (this.isMask === true) {
                return;
            }

            renderer.plugins.graphics.render(this);
        }

        /**
         * Retrieves the bounds of the graphic shape as a rectangle object
         *
         * @private
         */

    }, {
        key: '_calculateBounds',
        value: function _calculateBounds() {
            if (this.boundsDirty !== this.dirty) {
                this.boundsDirty = this.dirty;
                this.updateLocalBounds();

                this.dirty++;
                this.cachedSpriteDirty = true;
            }

            var lb = this._localBounds;

            this._bounds.addFrame(this.transform, lb.minX, lb.minY, lb.maxX, lb.maxY);
        }

        /**
         * Tests if a point is inside this graphics object
         *
         * @param {PIXI.Point} point - the point to test
         * @return {boolean} the result of the test
         */

    }, {
        key: 'containsPoint',
        value: function containsPoint(point) {
            this.worldTransform.applyInverse(point, tempPoint$1);

            var graphicsData = this.graphicsData;

            for (var i = 0; i < graphicsData.length; ++i) {
                var data = graphicsData[i];

                if (!data.fill) {
                    continue;
                }

                // only deal with fills..
                if (data.shape) {
                    if (data.shape.contains(tempPoint$1.x, tempPoint$1.y)) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
         * Update the bounds of the object
         *
         */

    }, {
        key: 'updateLocalBounds',
        value: function updateLocalBounds() {
            var minX = Infinity;
            var maxX = -Infinity;

            var minY = Infinity;
            var maxY = -Infinity;

            if (this.graphicsData.length) {
                var shape = 0;
                var x = 0;
                var y = 0;
                var w = 0;
                var h = 0;

                for (var i = 0; i < this.graphicsData.length; i++) {
                    var data = this.graphicsData[i];
                    var type = data.type;
                    var lineWidth = data.lineWidth;

                    shape = data.shape;

                    if (type === SHAPES.RECT || type === SHAPES.RREC) {
                        x = shape.x - lineWidth / 2;
                        y = shape.y - lineWidth / 2;
                        w = shape.width + lineWidth;
                        h = shape.height + lineWidth;

                        minX = x < minX ? x : minX;
                        maxX = x + w > maxX ? x + w : maxX;

                        minY = y < minY ? y : minY;
                        maxY = y + h > maxY ? y + h : maxY;
                    } else if (type === SHAPES.CIRC) {
                        x = shape.x;
                        y = shape.y;
                        w = shape.radius + lineWidth / 2;
                        h = shape.radius + lineWidth / 2;

                        minX = x - w < minX ? x - w : minX;
                        maxX = x + w > maxX ? x + w : maxX;

                        minY = y - h < minY ? y - h : minY;
                        maxY = y + h > maxY ? y + h : maxY;
                    } else if (type === SHAPES.ELIP) {
                        x = shape.x;
                        y = shape.y;
                        w = shape.width + lineWidth / 2;
                        h = shape.height + lineWidth / 2;

                        minX = x - w < minX ? x - w : minX;
                        maxX = x + w > maxX ? x + w : maxX;

                        minY = y - h < minY ? y - h : minY;
                        maxY = y + h > maxY ? y + h : maxY;
                    } else {
                        // POLY
                        var points = shape.points;
                        var x2 = 0;
                        var y2 = 0;
                        var dx = 0;
                        var dy = 0;
                        var rw = 0;
                        var rh = 0;
                        var cx = 0;
                        var cy = 0;

                        for (var j = 0; j + 2 < points.length; j += 2) {
                            x = points[j];
                            y = points[j + 1];
                            x2 = points[j + 2];
                            y2 = points[j + 3];
                            dx = Math.abs(x2 - x);
                            dy = Math.abs(y2 - y);
                            h = lineWidth;
                            w = Math.sqrt(dx * dx + dy * dy);

                            if (w < 1e-9) {
                                continue;
                            }

                            rw = (h / w * dy + dx) / 2;
                            rh = (h / w * dx + dy) / 2;
                            cx = (x2 + x) / 2;
                            cy = (y2 + y) / 2;

                            minX = cx - rw < minX ? cx - rw : minX;
                            maxX = cx + rw > maxX ? cx + rw : maxX;

                            minY = cy - rh < minY ? cy - rh : minY;
                            maxY = cy + rh > maxY ? cy + rh : maxY;
                        }
                    }
                }
            } else {
                minX = 0;
                maxX = 0;
                minY = 0;
                maxY = 0;
            }

            var padding = this.boundsPadding;

            this._localBounds.minX = minX - padding;
            this._localBounds.maxX = maxX + padding * 2;

            this._localBounds.minY = minY - padding;
            this._localBounds.maxY = maxY + padding * 2;
        }

        /**
         * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
         *
         * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
         * @return {PIXI.GraphicsData} The generated GraphicsData object.
         */

    }, {
        key: 'drawShape',
        value: function drawShape(shape) {
            if (this.currentPath) {
                // check current path!
                if (this.currentPath.shape.points.length <= 2) {
                    this.graphicsData.pop();
                }
            }

            this.currentPath = null;

            var data = new GraphicsData(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.filling, shape);

            this.graphicsData.push(data);

            if (data.type === SHAPES.POLY) {
                data.shape.closed = data.shape.closed || this.filling;
                this.currentPath = data;
            }

            this.dirty++;

            return data;
        }

        /**
         * Generates a canvas texture.
         *
         * @param {number} scaleMode - The scale mode of the texture.
         * @param {number} resolution - The resolution of the texture.
         * @return {PIXI.Texture} The new texture.
         */

    }, {
        key: 'generateCanvasTexture',
        value: function generateCanvasTexture(scaleMode) {
            var resolution = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            var bounds = this.getLocalBounds();

            var canvasBuffer = RenderTexture.create(bounds.width, bounds.height, scaleMode, resolution);

            if (!canvasRenderer) {
                canvasRenderer = new CanvasRenderer();
            }

            tempMatrix$1.tx = -bounds.x;
            tempMatrix$1.ty = -bounds.y;

            canvasRenderer.render(this, canvasBuffer, false, tempMatrix$1);

            var texture = Texture.fromCanvas(canvasBuffer.baseTexture._canvasRenderTarget.canvas, scaleMode);

            texture.baseTexture.resolution = resolution;
            texture.baseTexture.update();

            return texture;
        }

        /**
         * Closes the current path.
         *
         * @return {PIXI.Graphics} Returns itself.
         */

    }, {
        key: 'closePath',
        value: function closePath() {
            // ok so close path assumes next one is a hole!
            var currentPath = this.currentPath;

            if (currentPath && currentPath.shape) {
                currentPath.shape.close();
            }

            return this;
        }

        /**
         * Adds a hole in the current path.
         *
         * @return {PIXI.Graphics} Returns itself.
         */

    }, {
        key: 'addHole',
        value: function addHole() {
            // this is a hole!
            var hole = this.graphicsData.pop();

            this.currentPath = this.graphicsData[this.graphicsData.length - 1];

            this.currentPath.addHole(hole.shape);
            this.currentPath = null;

            return this;
        }

        /**
         * Destroys the Graphics object.
         *
         * @param {object|boolean} [options] - Options parameter. A boolean will act as if all
         *  options have been set to that value
         * @param {boolean} [options.children=false] - if set to true, all the children will have
         *  their destroy method called as well. 'options' will be passed on to those calls.
         */

    }, {
        key: 'destroy',
        value: function destroy(options) {
            get$1(Graphics.prototype.__proto__ || Object.getPrototypeOf(Graphics.prototype), 'destroy', this).call(this, options);

            // destroy each of the GraphicsData objects
            for (var i = 0; i < this.graphicsData.length; ++i) {
                this.graphicsData[i].destroy();
            }

            // for each webgl data entry, destroy the WebGLGraphicsData
            for (var id in this._webgl) {
                for (var j = 0; j < this._webgl[id].data.length; ++j) {
                    this._webgl[id].data[j].destroy();
                }
            }

            if (this._spriteRect) {
                this._spriteRect.destroy();
            }

            this.graphicsData = null;

            this.currentPath = null;
            this._webgl = null;
            this._localBounds = null;
        }
    }]);
    return Graphics;
}(Container);

Graphics._SPRITE_TEXTURE = null;

/**
 * An object containing WebGL specific properties to be used by the WebGL renderer
 *
 * @class
 * @private
 * @memberof PIXI
 */

var WebGLGraphicsData = function () {
  /**
   * @param {WebGLRenderingContext} gl - The current WebGL drawing context
   * @param {PIXI.Shader} shader - The shader
   * @param {object} attribsState - The state for the VAO
   */
  function WebGLGraphicsData(gl, shader, attribsState) {
    classCallCheck(this, WebGLGraphicsData);

    /**
     * The current WebGL drawing context
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    // TODO does this need to be split before uploading??
    /**
     * An array of color components (r,g,b)
     * @member {number[]}
     */
    this.color = [0, 0, 0]; // color split!

    /**
     * An array of points to draw
     * @member {PIXI.Point[]}
     */
    this.points = [];

    /**
     * The indices of the vertices
     * @member {number[]}
     */
    this.indices = [];
    /**
     * The main buffer
     * @member {WebGLBuffer}
     */
    this.buffer = glCore__default.GLBuffer.createVertexBuffer(gl);

    /**
     * The index buffer
     * @member {WebGLBuffer}
     */
    this.indexBuffer = glCore__default.GLBuffer.createIndexBuffer(gl);

    /**
     * Whether this graphics is dirty or not
     * @member {boolean}
     */
    this.dirty = true;

    this.glPoints = null;
    this.glIndices = null;

    /**
     *
     * @member {PIXI.Shader}
     */
    this.shader = shader;

    this.vao = new glCore__default.VertexArrayObject(gl, attribsState).addIndex(this.indexBuffer).addAttribute(this.buffer, shader.attributes.aVertexPosition, gl.FLOAT, false, 4 * 6, 0).addAttribute(this.buffer, shader.attributes.aColor, gl.FLOAT, false, 4 * 6, 2 * 4);
  }

  /**
   * Resets the vertices and the indices
   */


  createClass(WebGLGraphicsData, [{
    key: 'reset',
    value: function reset() {
      this.points.length = 0;
      this.indices.length = 0;
    }

    /**
     * Binds the buffers and uploads the data
     */

  }, {
    key: 'upload',
    value: function upload() {
      this.glPoints = new Float32Array(this.points);
      this.buffer.upload(this.glPoints);

      this.glIndices = new Uint16Array(this.indices);
      this.indexBuffer.upload(this.glIndices);

      this.dirty = false;
    }

    /**
     * Empties all the data
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.color = null;
      this.points = null;
      this.indices = null;

      this.vao.destroy();
      this.buffer.destroy();
      this.indexBuffer.destroy();

      this.gl = null;

      this.buffer = null;
      this.indexBuffer = null;

      this.glPoints = null;
      this.glIndices = null;
    }
  }]);
  return WebGLGraphicsData;
}();

/**
 * This shader is used to draw simple primitive shapes for {@link PIXI.Graphics}.
 *
 * @class
 * @memberof PIXI
 * @extends PIXI.Shader
 */

var PrimitiveShader = function (_Shader) {
    inherits(PrimitiveShader, _Shader);

    /**
     * @param {WebGLRenderingContext} gl - The webgl shader manager this shader works for.
     */
    function PrimitiveShader(gl) {
        classCallCheck(this, PrimitiveShader);
        return possibleConstructorReturn(this, (PrimitiveShader.__proto__ || Object.getPrototypeOf(PrimitiveShader)).call(this, gl,
        // vertex shader
        ['attribute vec2 aVertexPosition;', 'attribute vec4 aColor;', 'uniform mat3 translationMatrix;', 'uniform mat3 projectionMatrix;', 'uniform float alpha;', 'uniform vec3 tint;', 'varying vec4 vColor;', 'void main(void){', '   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);', '   vColor = aColor * vec4(tint * alpha, alpha);', '}'].join('\n'),
        // fragment shader
        ['varying vec4 vColor;', 'void main(void){', '   gl_FragColor = vColor;', '}'].join('\n')));
    }

    return PrimitiveShader;
}(Shader);

/**
 * Builds a line to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
 * @param {object} webGLData - an object containing all the webGL-specific information to create this shape
 */
function buildLine(graphicsData, webGLData) {
    // TODO OPTIMISE!
    var points = graphicsData.points;

    if (points.length === 0) {
        return;
    }
    // if the line width is an odd number add 0.5 to align to a whole pixel
    // commenting this out fixes #711 and #1620
    // if (graphicsData.lineWidth%2)
    // {
    //     for (i = 0; i < points.length; i++)
    //     {
    //         points[i] += 0.5;
    //     }
    // }

    // get first and last point.. figure out the middle!
    var firstPoint = new Point(points[0], points[1]);
    var lastPoint = new Point(points[points.length - 2], points[points.length - 1]);

    // if the first point is the last point - gonna have issues :)
    if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y) {
        // need to clone as we are going to slightly modify the shape..
        points = points.slice();

        points.pop();
        points.pop();

        lastPoint = new Point(points[points.length - 2], points[points.length - 1]);

        var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) * 0.5;
        var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) * 0.5;

        points.unshift(midPointX, midPointY);
        points.push(midPointX, midPointY);
    }

    var verts = webGLData.points;
    var indices = webGLData.indices;
    var length = points.length / 2;
    var indexCount = points.length;
    var indexStart = verts.length / 6;

    // DRAW the Line
    var width = graphicsData.lineWidth / 2;

    // sort color
    var color = hex2rgb(graphicsData.lineColor);
    var alpha = graphicsData.lineAlpha;
    var r = color[0] * alpha;
    var g = color[1] * alpha;
    var b = color[2] * alpha;

    var p1x = points[0];
    var p1y = points[1];
    var p2x = points[2];
    var p2y = points[3];
    var p3x = 0;
    var p3y = 0;

    var perpx = -(p1y - p2y);
    var perpy = p1x - p2x;
    var perp2x = 0;
    var perp2y = 0;
    var perp3x = 0;
    var perp3y = 0;

    var dist = Math.sqrt(perpx * perpx + perpy * perpy);

    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    // start
    verts.push(p1x - perpx, p1y - perpy, r, g, b, alpha);

    verts.push(p1x + perpx, p1y + perpy, r, g, b, alpha);

    for (var i = 1; i < length - 1; ++i) {
        p1x = points[(i - 1) * 2];
        p1y = points[(i - 1) * 2 + 1];

        p2x = points[i * 2];
        p2y = points[i * 2 + 1];

        p3x = points[(i + 1) * 2];
        p3y = points[(i + 1) * 2 + 1];

        perpx = -(p1y - p2y);
        perpy = p1x - p2x;

        dist = Math.sqrt(perpx * perpx + perpy * perpy);
        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        perp2x = -(p2y - p3y);
        perp2y = p2x - p3x;

        dist = Math.sqrt(perp2x * perp2x + perp2y * perp2y);
        perp2x /= dist;
        perp2y /= dist;
        perp2x *= width;
        perp2y *= width;

        var a1 = -perpy + p1y - (-perpy + p2y);
        var b1 = -perpx + p2x - (-perpx + p1x);
        var c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
        var a2 = -perp2y + p3y - (-perp2y + p2y);
        var b2 = -perp2x + p2x - (-perp2x + p3x);
        var c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);

        var denom = a1 * b2 - a2 * b1;

        if (Math.abs(denom) < 0.1) {
            denom += 10.1;
            verts.push(p2x - perpx, p2y - perpy, r, g, b, alpha);

            verts.push(p2x + perpx, p2y + perpy, r, g, b, alpha);

            continue;
        }

        var px = (b1 * c2 - b2 * c1) / denom;
        var py = (a2 * c1 - a1 * c2) / denom;
        var pdist = (px - p2x) * (px - p2x) + (py - p2y) * (py - p2y);

        if (pdist > 196 * width * width) {
            perp3x = perpx - perp2x;
            perp3y = perpy - perp2y;

            dist = Math.sqrt(perp3x * perp3x + perp3y * perp3y);
            perp3x /= dist;
            perp3y /= dist;
            perp3x *= width;
            perp3y *= width;

            verts.push(p2x - perp3x, p2y - perp3y);
            verts.push(r, g, b, alpha);

            verts.push(p2x + perp3x, p2y + perp3y);
            verts.push(r, g, b, alpha);

            verts.push(p2x - perp3x, p2y - perp3y);
            verts.push(r, g, b, alpha);

            indexCount++;
        } else {
            verts.push(px, py);
            verts.push(r, g, b, alpha);

            verts.push(p2x - (px - p2x), p2y - (py - p2y));
            verts.push(r, g, b, alpha);
        }
    }

    p1x = points[(length - 2) * 2];
    p1y = points[(length - 2) * 2 + 1];

    p2x = points[(length - 1) * 2];
    p2y = points[(length - 1) * 2 + 1];

    perpx = -(p1y - p2y);
    perpy = p1x - p2x;

    dist = Math.sqrt(perpx * perpx + perpy * perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    verts.push(p2x - perpx, p2y - perpy);
    verts.push(r, g, b, alpha);

    verts.push(p2x + perpx, p2y + perpy);
    verts.push(r, g, b, alpha);

    indices.push(indexStart);

    for (var _i = 0; _i < indexCount; ++_i) {
        indices.push(indexStart++);
    }

    indices.push(indexStart - 1);
}

var earcut_1 = earcut;

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode) return triangles;

    var minX, minY, maxX, maxY, x, y, size;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and size are later used to transform coords into integers for z-order calculation
        size = Math.max(maxX - minX, maxY - minY);
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, size);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }

    if (last && equals$1(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals$1(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) return null;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, size, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && size) indexCurve(ear, minX, minY, size);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (size ? isEarHashed(ear, minX, minY, size) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            removeNode(ear);

            // skipping the next vertice leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, size, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(ear, triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, size, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, size);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, size) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, size),
        maxZ = zOrder(maxTX, maxTY, minX, minY, size);

    // first look for points inside the triangle in increasing z-order
    var p = ear.nextZ;

    while (p && p.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.nextZ;
    }

    // then look for points in decreasing z-order
    p = ear.prevZ;

    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals$1(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return p;
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, size) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, size);
                earcutLinked(c, triangles, dim, minX, minY, size);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);
        filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m.next;

    while (p !== stop) {
        if (hx >= p.x && p.x >= mx &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    }

    return m;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, size) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, size);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }

            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize === 0) {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                } else if (qSize === 0 || !q) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else if (p.z <= q.z) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and size of the data bounding box
function zOrder(x, y, minX, minY, size) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) / size;
    y = 32767 * (y - minY) / size;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
           locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals$1(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    if ((equals$1(p1, q1) && equals$1(p2, q2)) ||
        (equals$1(p1, q2) && equals$1(p2, q1))) return true;
    return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
           area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertice index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertice nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};

/**
 * Builds a polygon to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
 * @param {object} webGLData - an object containing all the webGL-specific information to create this shape
 */
function buildPoly(graphicsData, webGLData) {
    graphicsData.points = graphicsData.shape.points.slice();

    var points = graphicsData.points;

    if (graphicsData.fill && points.length >= 6) {
        var holeArray = [];
        // Process holes..
        var holes = graphicsData.holes;

        for (var i = 0; i < holes.length; i++) {
            var hole = holes[i];

            holeArray.push(points.length / 2);

            points = points.concat(hole.points);
        }

        // get first and last point.. figure out the middle!
        var verts = webGLData.points;
        var indices = webGLData.indices;

        var length = points.length / 2;

        // sort color
        var color = hex2rgb(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var triangles = earcut_1(points, holeArray, 2);

        if (!triangles) {
            return;
        }

        var vertPos = verts.length / 6;

        for (var _i = 0; _i < triangles.length; _i += 3) {
            indices.push(triangles[_i] + vertPos);
            indices.push(triangles[_i] + vertPos);
            indices.push(triangles[_i + 1] + vertPos);
            indices.push(triangles[_i + 2] + vertPos);
            indices.push(triangles[_i + 2] + vertPos);
        }

        for (var _i2 = 0; _i2 < length; _i2++) {
            verts.push(points[_i2 * 2], points[_i2 * 2 + 1], r, g, b, alpha);
        }
    }

    if (graphicsData.lineWidth > 0) {
        buildLine(graphicsData, webGLData);
    }
}

/**
 * Builds a rectangle to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
 * @param {object} webGLData - an object containing all the webGL-specific information to create this shape
 */
function buildRectangle(graphicsData, webGLData) {
    // --- //
    // need to convert points to a nice regular data
    //
    var rectData = graphicsData.shape;
    var x = rectData.x;
    var y = rectData.y;
    var width = rectData.width;
    var height = rectData.height;

    if (graphicsData.fill) {
        var color = hex2rgb(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vertPos = verts.length / 6;

        // start
        verts.push(x, y);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y);
        verts.push(r, g, b, alpha);

        verts.push(x, y + height);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y + height);
        verts.push(r, g, b, alpha);

        // insert 2 dead triangles..
        indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
    }

    if (graphicsData.lineWidth) {
        var tempPoints = graphicsData.points;

        graphicsData.points = [x, y, x + width, y, x + width, y + height, x, y + height, x, y];

        buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
}

/**
 * Builds a rounded rectangle to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
 * @param {object} webGLData - an object containing all the webGL-specific information to create this shape
 */
function buildRoundedRectangle(graphicsData, webGLData) {
    var rrectData = graphicsData.shape;
    var x = rrectData.x;
    var y = rrectData.y;
    var width = rrectData.width;
    var height = rrectData.height;

    var radius = rrectData.radius;

    var recPoints = [];

    recPoints.push(x, y + radius);
    quadraticBezierCurve(x, y + height - radius, x, y + height, x + radius, y + height, recPoints);
    quadraticBezierCurve(x + width - radius, y + height, x + width, y + height, x + width, y + height - radius, recPoints);
    quadraticBezierCurve(x + width, y + radius, x + width, y, x + width - radius, y, recPoints);
    quadraticBezierCurve(x + radius, y, x, y, x, y + radius + 0.0000000001, recPoints);

    // this tiny number deals with the issue that occurs when points overlap and earcut fails to triangulate the item.
    // TODO - fix this properly, this is not very elegant.. but it works for now.

    if (graphicsData.fill) {
        var color = hex2rgb(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vecPos = verts.length / 6;

        var triangles = earcut_1(recPoints, null, 2);

        for (var i = 0, j = triangles.length; i < j; i += 3) {
            indices.push(triangles[i] + vecPos);
            indices.push(triangles[i] + vecPos);
            indices.push(triangles[i + 1] + vecPos);
            indices.push(triangles[i + 2] + vecPos);
            indices.push(triangles[i + 2] + vecPos);
        }

        for (var _i = 0, _j = recPoints.length; _i < _j; _i++) {
            verts.push(recPoints[_i], recPoints[++_i], r, g, b, alpha);
        }
    }

    if (graphicsData.lineWidth) {
        var tempPoints = graphicsData.points;

        graphicsData.points = recPoints;

        buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
}

/**
 * Calculate the points for a quadratic bezier curve. (helper function..)
 * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {number} fromX - Origin point x
 * @param {number} fromY - Origin point x
 * @param {number} cpX - Control point x
 * @param {number} cpY - Control point y
 * @param {number} toX - Destination point x
 * @param {number} toY - Destination point y
 * @param {number[]} [out=[]] - The output array to add points into. If not passed, a new array is created.
 * @return {number[]} an array of points
 */
function quadraticBezierCurve(fromX, fromY, cpX, cpY, toX, toY) {
    var out = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];

    var n = 20;
    var points = out;

    var xa = 0;
    var ya = 0;
    var xb = 0;
    var yb = 0;
    var x = 0;
    var y = 0;

    function getPt(n1, n2, perc) {
        var diff = n2 - n1;

        return n1 + diff * perc;
    }

    for (var i = 0, j = 0; i <= n; ++i) {
        j = i / n;

        // The Green Line
        xa = getPt(fromX, cpX, j);
        ya = getPt(fromY, cpY, j);
        xb = getPt(cpX, toX, j);
        yb = getPt(cpY, toY, j);

        // The Black Dot
        x = getPt(xa, xb, j);
        y = getPt(ya, yb, j);

        points.push(x, y);
    }

    return points;
}

/**
 * Builds a circle to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object to draw
 * @param {object} webGLData - an object containing all the webGL-specific information to create this shape
 */
function buildCircle(graphicsData, webGLData) {
    // need to convert points to a nice regular data
    var circleData = graphicsData.shape;
    var x = circleData.x;
    var y = circleData.y;
    var width = void 0;
    var height = void 0;

    // TODO - bit hacky??
    if (graphicsData.type === SHAPES.CIRC) {
        width = circleData.radius;
        height = circleData.radius;
    } else {
        width = circleData.width;
        height = circleData.height;
    }

    var totalSegs = Math.floor(30 * Math.sqrt(circleData.radius)) || Math.floor(15 * Math.sqrt(circleData.width + circleData.height));

    var seg = Math.PI * 2 / totalSegs;

    if (graphicsData.fill) {
        var color = hex2rgb(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vecPos = verts.length / 6;

        indices.push(vecPos);

        for (var i = 0; i < totalSegs + 1; i++) {
            verts.push(x, y, r, g, b, alpha);

            verts.push(x + Math.sin(seg * i) * width, y + Math.cos(seg * i) * height, r, g, b, alpha);

            indices.push(vecPos++, vecPos++);
        }

        indices.push(vecPos - 1);
    }

    if (graphicsData.lineWidth) {
        var tempPoints = graphicsData.points;

        graphicsData.points = [];

        for (var _i = 0; _i < totalSegs + 1; _i++) {
            graphicsData.points.push(x + Math.sin(seg * _i) * width, y + Math.cos(seg * _i) * height);
        }

        buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
}

/**
 * Renders the graphics object.
 *
 * @class
 * @memberof PIXI
 * @extends PIXI.ObjectRenderer
 */

var GraphicsRenderer = function (_ObjectRenderer) {
    inherits(GraphicsRenderer, _ObjectRenderer);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this object renderer works for.
     */
    function GraphicsRenderer(renderer) {
        classCallCheck(this, GraphicsRenderer);

        var _this = possibleConstructorReturn(this, (GraphicsRenderer.__proto__ || Object.getPrototypeOf(GraphicsRenderer)).call(this, renderer));

        _this.graphicsDataPool = [];

        _this.primitiveShader = null;

        _this.gl = renderer.gl;

        // easy access!
        _this.CONTEXT_UID = 0;
        return _this;
    }

    /**
     * Called when there is a WebGL context change
     *
     * @private
     *
     */


    createClass(GraphicsRenderer, [{
        key: 'onContextChange',
        value: function onContextChange() {
            this.gl = this.renderer.gl;
            this.CONTEXT_UID = this.renderer.CONTEXT_UID;
            this.primitiveShader = new PrimitiveShader(this.gl);
        }

        /**
         * Destroys this renderer.
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            ObjectRenderer.prototype.destroy.call(this);

            for (var i = 0; i < this.graphicsDataPool.length; ++i) {
                this.graphicsDataPool[i].destroy();
            }

            this.graphicsDataPool = null;
        }

        /**
         * Renders a graphics object.
         *
         * @param {PIXI.Graphics} graphics - The graphics object to render.
         */

    }, {
        key: 'render',
        value: function render(graphics) {
            var renderer = this.renderer;
            var gl = renderer.gl;

            var webGLData = void 0;
            var webGL = graphics._webGL[this.CONTEXT_UID];

            if (!webGL || graphics.dirty !== webGL.dirty) {
                this.updateGraphics(graphics);

                webGL = graphics._webGL[this.CONTEXT_UID];
            }

            // This  could be speeded up for sure!
            var shader = this.primitiveShader;

            renderer.bindShader(shader);
            renderer.state.setBlendMode(graphics.blendMode);

            for (var i = 0, n = webGL.data.length; i < n; i++) {
                webGLData = webGL.data[i];
                var shaderTemp = webGLData.shader;

                renderer.bindShader(shaderTemp);
                shaderTemp.uniforms.translationMatrix = graphics.transform.worldTransform.toArray(true);
                shaderTemp.uniforms.tint = hex2rgb(graphics.tint);
                shaderTemp.uniforms.alpha = graphics.worldAlpha;

                renderer.bindVao(webGLData.vao);
                webGLData.vao.draw(gl.TRIANGLE_STRIP, webGLData.indices.length);
            }
        }

        /**
         * Updates the graphics object
         *
         * @private
         * @param {PIXI.Graphics} graphics - The graphics object to update
         */

    }, {
        key: 'updateGraphics',
        value: function updateGraphics(graphics) {
            var gl = this.renderer.gl;

            // get the contexts graphics object
            var webGL = graphics._webGL[this.CONTEXT_UID];

            // if the graphics object does not exist in the webGL context time to create it!
            if (!webGL) {
                webGL = graphics._webGL[this.CONTEXT_UID] = { lastIndex: 0, data: [], gl: gl, clearDirty: -1, dirty: -1 };
            }

            // flag the graphics as not dirty as we are about to update it...
            webGL.dirty = graphics.dirty;

            // if the user cleared the graphics object we will need to clear every object
            if (graphics.clearDirty !== webGL.clearDirty) {
                webGL.clearDirty = graphics.clearDirty;

                // loop through and return all the webGLDatas to the object pool so than can be reused later on
                for (var i = 0; i < webGL.data.length; i++) {
                    this.graphicsDataPool.push(webGL.data[i]);
                }

                // clear the array and reset the index..
                webGL.data.length = 0;
                webGL.lastIndex = 0;
            }

            var webGLData = void 0;

            // loop through the graphics datas and construct each one..
            // if the object is a complex fill then the new stencil buffer technique will be used
            // other wise graphics objects will be pushed into a batch..
            for (var _i = webGL.lastIndex; _i < graphics.graphicsData.length; _i++) {
                var data = graphics.graphicsData[_i];

                // TODO - this can be simplified
                webGLData = this.getWebGLData(webGL, 0);

                if (data.type === SHAPES.POLY) {
                    buildPoly(data, webGLData);
                }
                if (data.type === SHAPES.RECT) {
                    buildRectangle(data, webGLData);
                } else if (data.type === SHAPES.CIRC || data.type === SHAPES.ELIP) {
                    buildCircle(data, webGLData);
                } else if (data.type === SHAPES.RREC) {
                    buildRoundedRectangle(data, webGLData);
                }

                webGL.lastIndex++;
            }

            this.renderer.bindVao(null);

            // upload all the dirty data...
            for (var _i2 = 0; _i2 < webGL.data.length; _i2++) {
                webGLData = webGL.data[_i2];

                if (webGLData.dirty) {
                    webGLData.upload();
                }
            }
        }

        /**
         *
         * @private
         * @param {WebGLRenderingContext} gl - the current WebGL drawing context
         * @param {number} type - TODO @Alvin
         * @return {*} TODO
         */

    }, {
        key: 'getWebGLData',
        value: function getWebGLData(gl, type) {
            var webGLData = gl.data[gl.data.length - 1];

            if (!webGLData || webGLData.points.length > 320000) {
                webGLData = this.graphicsDataPool.pop() || new WebGLGraphicsData(this.renderer.gl, this.primitiveShader, this.renderer.state.attribsState);

                webGLData.reset(type);
                gl.data.push(webGLData);
            }

            webGLData.dirty = true;

            return webGLData;
        }
    }]);
    return GraphicsRenderer;
}(ObjectRenderer);

WebGLRenderer.registerPlugin('graphics', GraphicsRenderer);

/**
 * @author Mat Groves
 *
 * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * for creating the original pixi version!
 * Also a thanks to https://github.com/bchevalier for tweaking the tint and alpha so that they
 * now share 4 bytes on the vertex buffer
 *
 * Heavily inspired by LibGDX's CanvasGraphicsRenderer:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/CanvasGraphicsRenderer.java
 */

/**
 * Renderer dedicated to drawing and batching graphics objects.
 *
 * @class
 * @private
 * @memberof PIXI
 */

var CanvasGraphicsRenderer = function () {
    /**
     * @param {PIXI.CanvasRenderer} renderer - The current PIXI renderer.
     */
    function CanvasGraphicsRenderer(renderer) {
        classCallCheck(this, CanvasGraphicsRenderer);

        this.renderer = renderer;
    }

    /**
     * Renders a Graphics object to a canvas.
     *
     * @param {PIXI.Graphics} graphics - the actual graphics object to render
     */


    createClass(CanvasGraphicsRenderer, [{
        key: 'render',
        value: function render(graphics) {
            var renderer = this.renderer;
            var context = renderer.context;
            var worldAlpha = graphics.worldAlpha;
            var transform = graphics.transform.worldTransform;
            var resolution = renderer.resolution;

            // if the tint has changed, set the graphics object to dirty.
            if (this._prevTint !== this.tint) {
                this.dirty = true;
            }

            context.setTransform(transform.a * resolution, transform.b * resolution, transform.c * resolution, transform.d * resolution, transform.tx * resolution, transform.ty * resolution);

            if (graphics.dirty) {
                this.updateGraphicsTint(graphics);
                graphics.dirty = false;
            }

            renderer.setBlendMode(graphics.blendMode);

            for (var i = 0; i < graphics.graphicsData.length; i++) {
                var data = graphics.graphicsData[i];
                var shape = data.shape;

                var fillColor = data._fillTint;
                var lineColor = data._lineTint;

                context.lineWidth = data.lineWidth;

                if (data.type === SHAPES.POLY) {
                    context.beginPath();

                    this.renderPolygon(shape.points, shape.closed, context);

                    for (var j = 0; j < data.holes.length; j++) {
                        this.renderPolygon(data.holes[j].points, true, context);
                    }

                    if (data.fill) {
                        context.globalAlpha = data.fillAlpha * worldAlpha;
                        context.fillStyle = '#' + ('00000' + (fillColor | 0).toString(16)).substr(-6);
                        context.fill();
                    }
                    if (data.lineWidth) {
                        context.globalAlpha = data.lineAlpha * worldAlpha;
                        context.strokeStyle = '#' + ('00000' + (lineColor | 0).toString(16)).substr(-6);
                        context.stroke();
                    }
                } else if (data.type === SHAPES.RECT) {
                    if (data.fillColor || data.fillColor === 0) {
                        context.globalAlpha = data.fillAlpha * worldAlpha;
                        context.fillStyle = '#' + ('00000' + (fillColor | 0).toString(16)).substr(-6);
                        context.fillRect(shape.x, shape.y, shape.width, shape.height);
                    }
                    if (data.lineWidth) {
                        context.globalAlpha = data.lineAlpha * worldAlpha;
                        context.strokeStyle = '#' + ('00000' + (lineColor | 0).toString(16)).substr(-6);
                        context.strokeRect(shape.x, shape.y, shape.width, shape.height);
                    }
                } else if (data.type === SHAPES.CIRC) {
                    // TODO - need to be Undefined!
                    context.beginPath();
                    context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                    context.closePath();

                    if (data.fill) {
                        context.globalAlpha = data.fillAlpha * worldAlpha;
                        context.fillStyle = '#' + ('00000' + (fillColor | 0).toString(16)).substr(-6);
                        context.fill();
                    }
                    if (data.lineWidth) {
                        context.globalAlpha = data.lineAlpha * worldAlpha;
                        context.strokeStyle = '#' + ('00000' + (lineColor | 0).toString(16)).substr(-6);
                        context.stroke();
                    }
                } else if (data.type === SHAPES.ELIP) {
                    // ellipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas

                    var w = shape.width * 2;
                    var h = shape.height * 2;

                    var x = shape.x - w / 2;
                    var y = shape.y - h / 2;

                    context.beginPath();

                    var kappa = 0.5522848;
                    var ox = w / 2 * kappa; // control point offset horizontal
                    var oy = h / 2 * kappa; // control point offset vertical
                    var xe = x + w; // x-end
                    var ye = y + h; // y-end
                    var xm = x + w / 2; // x-middle
                    var ym = y + h / 2; // y-middle

                    context.moveTo(x, ym);
                    context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                    context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                    context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                    context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

                    context.closePath();

                    if (data.fill) {
                        context.globalAlpha = data.fillAlpha * worldAlpha;
                        context.fillStyle = '#' + ('00000' + (fillColor | 0).toString(16)).substr(-6);
                        context.fill();
                    }
                    if (data.lineWidth) {
                        context.globalAlpha = data.lineAlpha * worldAlpha;
                        context.strokeStyle = '#' + ('00000' + (lineColor | 0).toString(16)).substr(-6);
                        context.stroke();
                    }
                } else if (data.type === SHAPES.RREC) {
                    var rx = shape.x;
                    var ry = shape.y;
                    var width = shape.width;
                    var height = shape.height;
                    var radius = shape.radius;

                    var maxRadius = Math.min(width, height) / 2 | 0;

                    radius = radius > maxRadius ? maxRadius : radius;

                    context.beginPath();
                    context.moveTo(rx, ry + radius);
                    context.lineTo(rx, ry + height - radius);
                    context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
                    context.lineTo(rx + width - radius, ry + height);
                    context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
                    context.lineTo(rx + width, ry + radius);
                    context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
                    context.lineTo(rx + radius, ry);
                    context.quadraticCurveTo(rx, ry, rx, ry + radius);
                    context.closePath();

                    if (data.fillColor || data.fillColor === 0) {
                        context.globalAlpha = data.fillAlpha * worldAlpha;
                        context.fillStyle = '#' + ('00000' + (fillColor | 0).toString(16)).substr(-6);
                        context.fill();
                    }

                    if (data.lineWidth) {
                        context.globalAlpha = data.lineAlpha * worldAlpha;
                        context.strokeStyle = '#' + ('00000' + (lineColor | 0).toString(16)).substr(-6);
                        context.stroke();
                    }
                }
            }
        }

        /**
         * Updates the tint of a graphics object
         *
         * @private
         * @param {PIXI.Graphics} graphics - the graphics that will have its tint updated
         */

    }, {
        key: 'updateGraphicsTint',
        value: function updateGraphicsTint(graphics) {
            graphics._prevTint = graphics.tint;

            var tintR = (graphics.tint >> 16 & 0xFF) / 255;
            var tintG = (graphics.tint >> 8 & 0xFF) / 255;
            var tintB = (graphics.tint & 0xFF) / 255;

            for (var i = 0; i < graphics.graphicsData.length; ++i) {
                var data = graphics.graphicsData[i];

                var fillColor = data.fillColor | 0;
                var lineColor = data.lineColor | 0;

                // super inline cos im an optimization NAZI :)
                data._fillTint = ((fillColor >> 16 & 0xFF) / 255 * tintR * 255 << 16) + ((fillColor >> 8 & 0xFF) / 255 * tintG * 255 << 8) + (fillColor & 0xFF) / 255 * tintB * 255;

                data._lineTint = ((lineColor >> 16 & 0xFF) / 255 * tintR * 255 << 16) + ((lineColor >> 8 & 0xFF) / 255 * tintG * 255 << 8) + (lineColor & 0xFF) / 255 * tintB * 255;
            }
        }

        /**
         * Renders a polygon.
         *
         * @param {PIXI.Point[]} points - The points to render
         * @param {boolean} close - Should the polygon be closed
         * @param {CanvasRenderingContext2D} context - The rendering context to use
         */

    }, {
        key: 'renderPolygon',
        value: function renderPolygon(points, close, context) {
            context.moveTo(points[0], points[1]);

            for (var j = 1; j < points.length / 2; ++j) {
                context.lineTo(points[j * 2], points[j * 2 + 1]);
            }

            if (close) {
                context.closePath();
            }
        }

        /**
         * destroy graphics object
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.renderer = null;
        }
    }]);
    return CanvasGraphicsRenderer;
}();

CanvasRenderer.registerPlugin('graphics', CanvasGraphicsRenderer);

/**
 * @namespace PIXI
 */
/**
 * This helper function will automatically detect which renderer you should be using.
 * WebGL is the preferred renderer as it is a lot faster. If webGL is not supported by
 * the browser then this function will return a canvas renderer
 *
 * @memberof PIXI
 * @function autoDetectRenderer
 * @param {number} [width=800] - the width of the renderers view
 * @param {number} [height=600] - the height of the renderers view
 * @param {object} [options] - The optional renderer parameters
 * @param {HTMLCanvasElement} [options.view] - the canvas to use as a view, optional
 * @param {boolean} [options.transparent=false] - If the render view is transparent, default false
 * @param {boolean} [options.antialias=false] - sets antialias (only applicable in chrome at the moment)
 * @param {boolean} [options.preserveDrawingBuffer=false] - enables drawing buffer preservation, enable this if you
 *      need to call toDataUrl on the webgl context
 * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer, retina would be 2
 * @param {boolean} [noWebGL=false] - prevents selection of WebGL renderer, even if such is present
 * @return {PIXI.WebGLRenderer|PIXI.CanvasRenderer} Returns WebGL renderer if available, otherwise CanvasRenderer
 */
function autoDetectRenderer() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 600;
  var options = arguments[2];
  var noWebGL = arguments[3];

  if (!noWebGL && isWebGLSupported()) {
    return new WebGLRenderer(width, height, options);
  }

  return new CanvasRenderer(width, height, options);
}

/**
 * Holds all information related to an Interaction event
 *
 * @class
 * @memberof PIXI.interaction
 */

var InteractionData = function () {
  /**
   *
   */
  function InteractionData() {
    classCallCheck(this, InteractionData);

    /**
     * This point stores the global coords of where the touch/mouse event happened
     *
     * @member {PIXI.Point}
     */
    this.global = new Point();

    /**
     * The target Sprite that was interacted with
     *
     * @member {PIXI.Sprite}
     */
    this.target = null;

    /**
     * When passed to an event handler, this will be the original DOM Event that was captured
     *
     * @member {Event}
     */
    this.originalEvent = null;
  }

  /**
   * This will return the local coordinates of the specified displayObject for this InteractionData
   *
   * @param {PIXI.DisplayObject} displayObject - The DisplayObject that you would like the local
   *  coords off
   * @param {PIXI.Point} [point] - A Point object in which to store the value, optional (otherwise
   *  will create a new point)
   * @param {PIXI.Point} [globalPos] - A Point object containing your custom global coords, optional
   *  (otherwise will use the current global coords)
   * @return {PIXI.Point} A point containing the coordinates of the InteractionData position relative
   *  to the DisplayObject
   */


  createClass(InteractionData, [{
    key: 'getLocalPosition',
    value: function getLocalPosition(displayObject, point, globalPos) {
      return displayObject.worldTransform.applyInverse(globalPos || this.global, point);
    }
  }]);
  return InteractionData;
}();

/**
 * Event class that mimics native DOM events.
 *
 * @class
 * @memberof PIXI.interaction
 */
var InteractionEvent = function () {
  /**
   *
   */
  function InteractionEvent() {
    classCallCheck(this, InteractionEvent);

    /**
     * Which this event will continue propagating in the tree
     *
     * @member {boolean}
     */
    this.stopped = false;

    /**
     * The object to which event is dispatched.
     *
     * @member {PIXI.DisplayObject}
     */
    this.target = null;

    /**
     * The object whose event listener’s callback is currently being invoked.
     *
     * @member {PIXI.DisplayObject}
     */
    this.currentTarget = null;

    /*
     * Type of the event
     *
     * @member {string}
     */
    this.type = null;

    /*
     * InteractionData related to this event
     *
     * @member {PIXI.interaction.InteractionData}
     */
    this.data = null;
  }

  /**
   * Prevents event from reaching any objects other than the current object.
   *
   */


  createClass(InteractionEvent, [{
    key: "stopPropagation",
    value: function stopPropagation() {
      this.stopped = true;
    }

    /**
     * Prevents event from reaching any objects other than the current object.
     *
     * @private
     */

  }, {
    key: "_reset",
    value: function _reset() {
      this.stopped = false;
      this.currentTarget = null;
      this.target = null;
    }
  }]);
  return InteractionEvent;
}();

/**
 * Default property values of interactive objects
 * Used by {@link PIXI.interaction.InteractionManager} to automatically give all DisplayObjects these properties
 *
 * @mixin
 * @name interactiveTarget
 * @memberof PIXI.interaction
 * @example
 *      function MyObject() {}
 *
 *      Object.assign(
 *          MyObject.prototype,
 *          PIXI.interaction.interactiveTarget
 *      );
 */
var interactiveTarget = {
  /**
   * Determines if the displayObject be clicked/touched
   *
   * @inner {boolean}
   */
  interactive: false,

  /**
   * Determines if the children to the displayObject can be clicked/touched
   * Setting this to false allows pixi to bypass a recursive hitTest function
   *
   * @inner {boolean}
   */
  interactiveChildren: true,

  /**
   * Interaction shape. Children will be hit first, then this shape will be checked.
   * Setting this will cause this shape to be checked in hit tests rather than the displayObject's bounds.
   *
   * @inner {PIXI.Rectangle|PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.RoundedRectangle}
   */
  hitArea: null,

  /**
   * If enabled, the mouse cursor will change when hovered over the displayObject if it is interactive
   *
   * @inner {boolean}
   */
  buttonMode: false,

  /**
   * If buttonMode is enabled, this defines what CSS cursor property is used when the mouse cursor
   * is hovered over the displayObject
   *
   * @see https://developer.mozilla.org/en/docs/Web/CSS/cursor
   *
   * @inner {string}
   */
  defaultCursor: 'pointer',

  // some internal checks..
  /**
   * Internal check to detect if the mouse cursor is hovered over the displayObject
   *
   * @inner {boolean}
   * @private
   */
  _over: false,

  /**
   * Internal check to detect if the left mouse button is pressed on the displayObject
   *
   * @inner {boolean}
   * @private
   */
  _isLeftDown: false,

  /**
   * Internal check to detect if the right mouse button is pressed on the displayObject
   *
   * @inner {boolean}
   * @private
   */
  _isRightDown: false,

  /**
   * Internal check to detect if the pointer cursor is hovered over the displayObject
   *
   * @inner {boolean}
   * @private
   */
  _pointerOver: false,

  /**
   * Internal check to detect if the pointer is down on the displayObject
   *
   * @inner {boolean}
   * @private
   */
  _pointerDown: false,

  /**
   * Internal check to detect if a user has touched the displayObject
   *
   * @inner {boolean}
   * @private
   */
  _touchDown: false
};

// Mix interactiveTarget into core.DisplayObject.prototype
Object.assign(DisplayObject.prototype, interactiveTarget);

/**
 * The interaction manager deals with mouse and touch events. Any DisplayObject can be interactive
 * if its interactive parameter is set to true
 * This manager also supports multitouch.
 *
 * @class
 * @extends EventEmitter
 * @memberof PIXI.interaction
 */

var InteractionManager = function (_EventEmitter) {
    inherits(InteractionManager, _EventEmitter);

    /**
     * @param {PIXI.CanvasRenderer|PIXI.WebGLRenderer} renderer - A reference to the current renderer
     * @param {object} [options] - The options for the manager.
     * @param {boolean} [options.autoPreventDefault=true] - Should the manager automatically prevent default browser actions.
     * @param {number} [options.interactionFrequency=10] - Frequency increases the interaction events will be checked.
     */
    function InteractionManager(renderer, options) {
        classCallCheck(this, InteractionManager);

        var _this = possibleConstructorReturn(this, (InteractionManager.__proto__ || Object.getPrototypeOf(InteractionManager)).call(this));

        options = options || {};

        /**
         * The renderer this interaction manager works for.
         *
         * @member {PIXI.SystemRenderer}
         */
        _this.renderer = renderer;

        /**
         * Should default browser actions automatically be prevented.
         * Does not apply to pointer events for backwards compatibility
         * preventDefault on pointer events stops mouse events from firing
         * Thus, for every pointer event, there will always be either a mouse of touch event alongside it.
         *
         * @member {boolean}
         * @default true
         */
        _this.autoPreventDefault = options.autoPreventDefault !== undefined ? options.autoPreventDefault : true;

        /**
         * As this frequency increases the interaction events will be checked more often.
         *
         * @member {number}
         * @default 10
         */
        _this.interactionFrequency = options.interactionFrequency || 10;

        /**
         * The mouse data
         *
         * @member {PIXI.interaction.InteractionData}
         */
        _this.mouse = new InteractionData();

        // setting the mouse to start off far off screen will mean that mouse over does
        //  not get called before we even move the mouse.
        _this.mouse.global.set(-999999);

        /**
         * The pointer data
         *
         * @member {PIXI.interaction.InteractionData}
         */
        _this.pointer = new InteractionData();

        // setting the pointer to start off far off screen will mean that pointer over does
        //  not get called before we even move the pointer.
        _this.pointer.global.set(-999999);

        /**
         * An event data object to handle all the event tracking/dispatching
         *
         * @member {object}
         */
        _this.eventData = new InteractionEvent();

        /**
         * Tiny little interactiveData pool !
         *
         * @member {PIXI.interaction.InteractionData[]}
         */
        _this.interactiveDataPool = [];

        /**
         * The DOM element to bind to.
         *
         * @private
         * @member {HTMLElement}
         */
        _this.interactionDOMElement = null;

        /**
         * This property determins if mousemove and touchmove events are fired only when the cursror
         * is over the object.
         * Setting to true will make things work more in line with how the DOM verison works.
         * Setting to false can make things easier for things like dragging
         * It is currently set to false as this is how pixi used to work. This will be set to true in
         * future versions of pixi.
         *
         * @private
         * @member {boolean}
         */
        _this.moveWhenInside = false;

        /**
         * Have events been attached to the dom element?
         *
         * @private
         * @member {boolean}
         */
        _this.eventsAdded = false;

        /**
         * Is the mouse hovering over the renderer?
         *
         * @private
         * @member {boolean}
         */
        _this.mouseOverRenderer = false;

        /**
         * Does the device support touch events
         * https://www.w3.org/TR/touch-events/
         *
         * @readonly
         * @member {boolean}
         */
        _this.supportsTouchEvents = 'ontouchstart' in window;

        /**
         * Does the device support pointer events
         * https://www.w3.org/Submission/pointer-events/
         *
         * @readonly
         * @member {boolean}
         */
        _this.supportsPointerEvents = !!window.PointerEvent;

        /**
         * Are touch events being 'normalized' and converted into pointer events if pointer events are not supported
         * For example, on a touch screen mobile device, a touchstart would also be emitted as a pointerdown
         *
         * @private
         * @readonly
         * @member {boolean}
         */
        _this.normalizeTouchEvents = !_this.supportsPointerEvents && _this.supportsTouchEvents;

        /**
         * Are mouse events being 'normalized' and converted into pointer events if pointer events are not supported
         * For example, on a desktop pc, a mousedown would also be emitted as a pointerdown
         *
         * @private
         * @readonly
         * @member {boolean}
         */
        _this.normalizeMouseEvents = !_this.supportsPointerEvents && !isMobile.any;

        // this will make it so that you don't have to call bind all the time

        /**
         * @private
         * @member {Function}
         */
        _this.onMouseUp = _this.onMouseUp.bind(_this);
        _this.processMouseUp = _this.processMouseUp.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onMouseDown = _this.onMouseDown.bind(_this);
        _this.processMouseDown = _this.processMouseDown.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onMouseMove = _this.onMouseMove.bind(_this);
        _this.processMouseMove = _this.processMouseMove.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onMouseOut = _this.onMouseOut.bind(_this);
        _this.processMouseOverOut = _this.processMouseOverOut.bind(_this);

        /**
        * @private
        * @member {Function}
        */
        _this.onMouseOver = _this.onMouseOver.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onPointerUp = _this.onPointerUp.bind(_this);
        _this.processPointerUp = _this.processPointerUp.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onPointerDown = _this.onPointerDown.bind(_this);
        _this.processPointerDown = _this.processPointerDown.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onPointerMove = _this.onPointerMove.bind(_this);
        _this.processPointerMove = _this.processPointerMove.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onPointerOut = _this.onPointerOut.bind(_this);
        _this.processPointerOverOut = _this.processPointerOverOut.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onPointerOver = _this.onPointerOver.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onTouchStart = _this.onTouchStart.bind(_this);
        _this.processTouchStart = _this.processTouchStart.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onTouchEnd = _this.onTouchEnd.bind(_this);
        _this.processTouchEnd = _this.processTouchEnd.bind(_this);

        /**
         * @private
         * @member {Function}
         */
        _this.onTouchMove = _this.onTouchMove.bind(_this);
        _this.processTouchMove = _this.processTouchMove.bind(_this);

        /**
         * Every update cursor will be reset to this value, if some element wont override it in
         * its hitTest.
         *
         * @member {string}
         * @default 'inherit'
         */
        _this.defaultCursorStyle = 'inherit';

        /**
         * The css style of the cursor that is being used.
         *
         * @member {string}
         */
        _this.currentCursorStyle = 'inherit';

        /**
         * Internal cached let.
         *
         * @private
         * @member {PIXI.Point}
         */
        _this._tempPoint = new Point();

        /**
         * The current resolution / device pixel ratio.
         *
         * @member {number}
         * @default 1
         */
        _this.resolution = 1;

        _this.setTargetElement(_this.renderer.view, _this.renderer.resolution);

        /**
         * Fired when a pointer device button (usually a mouse button) is pressed on the display
         * object.
         *
         * @event mousedown
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
         * on the display object.
         *
         * @event rightdown
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device button (usually a mouse button) is released over the display
         * object.
         *
         * @event mouseup
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is released
         * over the display object.
         *
         * @event rightup
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device button (usually a mouse button) is pressed and released on
         * the display object.
         *
         * @event click
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
         * and released on the display object.
         *
         * @event rightclick
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device button (usually a mouse button) is released outside the
         * display object that initially registered a
         * [mousedown]{@link PIXI.interaction.InteractionManager#event:mousedown}.
         *
         * @event mouseupoutside
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device secondary button (usually a mouse right-button) is released
         * outside the display object that initially registered a
         * [rightdown]{@link PIXI.interaction.InteractionManager#event:rightdown}.
         *
         * @event rightupoutside
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device (usually a mouse) is moved while over the display object
         *
         * @event mousemove
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device (usually a mouse) is moved onto the display object
         *
         * @event mouseover
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device (usually a mouse) is moved off the display object
         *
         * @event mouseout
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device button is pressed on the display object.
         *
         * @event pointerdown
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device button is released over the display object.
         *
         * @event pointerup
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device button is pressed and released on the display object.
         *
         * @event pointertap
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device button is released outside the display object that initially
         * registered a [pointerdown]{@link PIXI.interaction.InteractionManager#event:pointerdown}.
         *
         * @event pointerupoutside
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device is moved while over the display object
         *
         * @event pointermove
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device is moved onto the display object
         *
         * @event pointerover
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a pointer device is moved off the display object
         *
         * @event pointerout
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a touch point is placed on the display object.
         *
         * @event touchstart
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a touch point is removed from the display object.
         *
         * @event touchend
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a touch point is placed and removed from the display object.
         *
         * @event tap
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a touch point is removed outside of the display object that initially
         * registered a [touchstart]{@link PIXI.interaction.InteractionManager#event:touchstart}.
         *
         * @event touchendoutside
         * @memberof PIXI.interaction.InteractionManager#
         */

        /**
         * Fired when a touch point is moved along the display object.
         *
         * @event touchmove
         * @memberof PIXI.interaction.InteractionManager#
         */
        return _this;
    }

    /**
     * Sets the DOM element which will receive mouse/touch events. This is useful for when you have
     * other DOM elements on top of the renderers Canvas element. With this you'll be bale to deletegate
     * another DOM element to receive those events.
     *
     * @param {HTMLCanvasElement} element - the DOM element which will receive mouse and touch events.
     * @param {number} [resolution=1] - The resolution / device pixel ratio of the new element (relative to the canvas).
     * @private
     */


    createClass(InteractionManager, [{
        key: 'setTargetElement',
        value: function setTargetElement(element) {
            var resolution = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            this.removeEvents();

            this.interactionDOMElement = element;

            this.resolution = resolution;

            this.addEvents();
        }

        /**
         * Registers all the DOM events
         *
         * @private
         */

    }, {
        key: 'addEvents',
        value: function addEvents() {
            if (!this.interactionDOMElement) {
                return;
            }

            shared.add(this.update, this);

            if (window.navigator.msPointerEnabled) {
                this.interactionDOMElement.style['-ms-content-zooming'] = 'none';
                this.interactionDOMElement.style['-ms-touch-action'] = 'none';
            } else if (this.supportsPointerEvents) {
                this.interactionDOMElement.style['touch-action'] = 'none';
            }

            /**
             * These events are added first, so that if pointer events are normalised, they are fired
             * in the same order as non-normalised events. ie. pointer event 1st, mouse / touch 2nd
             */
            if (this.supportsPointerEvents) {
                window.document.addEventListener('pointermove', this.onPointerMove, true);
                this.interactionDOMElement.addEventListener('pointerdown', this.onPointerDown, true);
                this.interactionDOMElement.addEventListener('pointerout', this.onPointerOut, true);
                this.interactionDOMElement.addEventListener('pointerover', this.onPointerOver, true);
                window.addEventListener('pointerup', this.onPointerUp, true);
            } else {
                /**
                 * If pointer events aren't available on a device, this will turn either the touch or
                 * mouse events into pointer events. This allows a developer to just listen for emitted
                 * pointer events on interactive sprites
                 */
                if (this.normalizeTouchEvents) {
                    this.interactionDOMElement.addEventListener('touchstart', this.onPointerDown, true);
                    this.interactionDOMElement.addEventListener('touchend', this.onPointerUp, true);
                    this.interactionDOMElement.addEventListener('touchmove', this.onPointerMove, true);
                }

                if (this.normalizeMouseEvents) {
                    window.document.addEventListener('mousemove', this.onPointerMove, true);
                    this.interactionDOMElement.addEventListener('mousedown', this.onPointerDown, true);
                    this.interactionDOMElement.addEventListener('mouseout', this.onPointerOut, true);
                    this.interactionDOMElement.addEventListener('mouseover', this.onPointerOver, true);
                    window.addEventListener('mouseup', this.onPointerUp, true);
                }
            }

            window.document.addEventListener('mousemove', this.onMouseMove, true);
            this.interactionDOMElement.addEventListener('mousedown', this.onMouseDown, true);
            this.interactionDOMElement.addEventListener('mouseout', this.onMouseOut, true);
            this.interactionDOMElement.addEventListener('mouseover', this.onMouseOver, true);
            window.addEventListener('mouseup', this.onMouseUp, true);

            if (this.supportsTouchEvents) {
                this.interactionDOMElement.addEventListener('touchstart', this.onTouchStart, true);
                this.interactionDOMElement.addEventListener('touchend', this.onTouchEnd, true);
                this.interactionDOMElement.addEventListener('touchmove', this.onTouchMove, true);
            }

            this.eventsAdded = true;
        }

        /**
         * Removes all the DOM events that were previously registered
         *
         * @private
         */

    }, {
        key: 'removeEvents',
        value: function removeEvents() {
            if (!this.interactionDOMElement) {
                return;
            }

            shared.remove(this.update, this);

            if (window.navigator.msPointerEnabled) {
                this.interactionDOMElement.style['-ms-content-zooming'] = '';
                this.interactionDOMElement.style['-ms-touch-action'] = '';
            } else if (this.supportsPointerEvents) {
                this.interactionDOMElement.style['touch-action'] = '';
            }

            if (this.supportsPointerEvents) {
                window.document.removeEventListener('pointermove', this.onPointerMove, true);
                this.interactionDOMElement.removeEventListener('pointerdown', this.onPointerDown, true);
                this.interactionDOMElement.removeEventListener('pointerout', this.onPointerOut, true);
                this.interactionDOMElement.removeEventListener('pointerover', this.onPointerOver, true);
                window.removeEventListener('pointerup', this.onPointerUp, true);
            } else {
                /**
                 * If pointer events aren't available on a device, this will turn either the touch or
                 * mouse events into pointer events. This allows a developer to just listen for emitted
                 * pointer events on interactive sprites
                 */
                if (this.normalizeTouchEvents) {
                    this.interactionDOMElement.removeEventListener('touchstart', this.onPointerDown, true);
                    this.interactionDOMElement.removeEventListener('touchend', this.onPointerUp, true);
                    this.interactionDOMElement.removeEventListener('touchmove', this.onPointerMove, true);
                }

                if (this.normalizeMouseEvents) {
                    window.document.removeEventListener('mousemove', this.onPointerMove, true);
                    this.interactionDOMElement.removeEventListener('mousedown', this.onPointerDown, true);
                    this.interactionDOMElement.removeEventListener('mouseout', this.onPointerOut, true);
                    this.interactionDOMElement.removeEventListener('mouseover', this.onPointerOver, true);
                    window.removeEventListener('mouseup', this.onPointerUp, true);
                }
            }

            window.document.removeEventListener('mousemove', this.onMouseMove, true);
            this.interactionDOMElement.removeEventListener('mousedown', this.onMouseDown, true);
            this.interactionDOMElement.removeEventListener('mouseout', this.onMouseOut, true);
            this.interactionDOMElement.removeEventListener('mouseover', this.onMouseOver, true);
            window.removeEventListener('mouseup', this.onMouseUp, true);

            if (this.supportsTouchEvents) {
                this.interactionDOMElement.removeEventListener('touchstart', this.onTouchStart, true);
                this.interactionDOMElement.removeEventListener('touchend', this.onTouchEnd, true);
                this.interactionDOMElement.removeEventListener('touchmove', this.onTouchMove, true);
            }

            this.interactionDOMElement = null;

            this.eventsAdded = false;
        }

        /**
         * Updates the state of interactive objects.
         * Invoked by a throttled ticker update from {@link PIXI.ticker.shared}.
         *
         * @param {number} deltaTime - time delta since last tick
         */

    }, {
        key: 'update',
        value: function update(deltaTime) {
            this._deltaTime += deltaTime;

            if (this._deltaTime < this.interactionFrequency) {
                return;
            }

            this._deltaTime = 0;

            if (!this.interactionDOMElement) {
                return;
            }

            // if the user move the mouse this check has already been dfone using the mouse move!
            if (this.didMove) {
                this.didMove = false;

                return;
            }

            this.cursor = this.defaultCursorStyle;

            // Resets the flag as set by a stopPropagation call. This flag is usually reset by a user interaction of any kind,
            // but there was a scenario of a display object moving under a static mouse cursor.
            // In this case, mouseover and mouseevents would not pass the flag test in dispatchEvent function
            this.eventData._reset();

            this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseOverOut, true);

            if (this.currentCursorStyle !== this.cursor) {
                this.currentCursorStyle = this.cursor;
                this.interactionDOMElement.style.cursor = this.cursor;
            }

            // TODO
        }

        /**
         * Dispatches an event on the display object that was interacted with
         *
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - the display object in question
         * @param {string} eventString - the name of the event (e.g, mousedown)
         * @param {object} eventData - the event data object
         * @private
         */

    }, {
        key: 'dispatchEvent',
        value: function dispatchEvent(displayObject, eventString, eventData) {
            if (!eventData.stopped) {
                eventData.currentTarget = displayObject;
                eventData.type = eventString;

                displayObject.emit(eventString, eventData);

                if (displayObject[eventString]) {
                    displayObject[eventString](eventData);
                }
            }
        }

        /**
         * Maps x and y coords from a DOM object and maps them correctly to the pixi view. The
         * resulting value is stored in the point. This takes into account the fact that the DOM
         * element could be scaled and positioned anywhere on the screen.
         *
         * @param  {PIXI.Point} point - the point that the result will be stored in
         * @param  {number} x - the x coord of the position to map
         * @param  {number} y - the y coord of the position to map
         */

    }, {
        key: 'mapPositionToPoint',
        value: function mapPositionToPoint(point, x, y) {
            var rect = void 0;

            // IE 11 fix
            if (!this.interactionDOMElement.parentElement) {
                rect = { x: 0, y: 0, width: 0, height: 0 };
            } else {
                rect = this.interactionDOMElement.getBoundingClientRect();
            }

            point.x = (x - rect.left) * (this.interactionDOMElement.width / rect.width) / this.resolution;
            point.y = (y - rect.top) * (this.interactionDOMElement.height / rect.height) / this.resolution;
        }

        /**
         * This function is provides a neat way of crawling through the scene graph and running a
         * specified function on all interactive objects it finds. It will also take care of hit
         * testing the interactive objects and passes the hit across in the function.
         *
         * @param {PIXI.Point} point - the point that is tested for collision
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - the displayObject
         *  that will be hit test (recursively crawls its children)
         * @param {Function} [func] - the function that will be called on each interactive object. The
         *  displayObject and hit will be passed to the function
         * @param {boolean} [hitTest] - this indicates if the objects inside should be hit test against the point
         * @param {boolean} [interactive] - Whether the displayObject is interactive
         * @return {boolean} returns true if the displayObject hit the point
         */

    }, {
        key: 'processInteractive',
        value: function processInteractive(point, displayObject, func, hitTest, interactive) {
            if (!displayObject || !displayObject.visible) {
                return false;
            }

            // Took a little while to rework this function correctly! But now it is done and nice and optimised. ^_^
            //
            // This function will now loop through all objects and then only hit test the objects it HAS
            // to, not all of them. MUCH faster..
            // An object will be hit test if the following is true:
            //
            // 1: It is interactive.
            // 2: It belongs to a parent that is interactive AND one of the parents children have not already been hit.
            //
            // As another little optimisation once an interactive object has been hit we can carry on
            // through the scenegraph, but we know that there will be no more hits! So we can avoid extra hit tests
            // A final optimisation is that an object is not hit test directly if a child has already been hit.

            interactive = displayObject.interactive || interactive;

            var hit = false;
            var interactiveParent = interactive;

            // if the displayobject has a hitArea, then it does not need to hitTest children.
            if (displayObject.hitArea) {
                interactiveParent = false;
            }

            // it has a mask! Then lets hit test that before continuing..
            if (hitTest && displayObject._mask) {
                if (!displayObject._mask.containsPoint(point)) {
                    hitTest = false;
                }
            }

            // it has a filterArea! Same as mask but easier, its a rectangle
            if (hitTest && displayObject.filterArea) {
                if (!displayObject.filterArea.contains(point.x, point.y)) {
                    hitTest = false;
                }
            }

            // ** FREE TIP **! If an object is not interactive or has no buttons in it
            // (such as a game scene!) set interactiveChildren to false for that displayObject.
            // This will allow pixi to completely ignore and bypass checking the displayObjects children.
            if (displayObject.interactiveChildren && displayObject.children) {
                var children = displayObject.children;

                for (var i = children.length - 1; i >= 0; i--) {
                    var child = children[i];

                    // time to get recursive.. if this function will return if something is hit..
                    if (this.processInteractive(point, child, func, hitTest, interactiveParent)) {
                        // its a good idea to check if a child has lost its parent.
                        // this means it has been removed whilst looping so its best
                        if (!child.parent) {
                            continue;
                        }

                        hit = true;

                        // we no longer need to hit test any more objects in this container as we we
                        // now know the parent has been hit
                        interactiveParent = false;

                        // If the child is interactive , that means that the object hit was actually
                        // interactive and not just the child of an interactive object.
                        // This means we no longer need to hit test anything else. We still need to run
                        // through all objects, but we don't need to perform any hit tests.

                        // {
                        hitTest = false;
                        // }

                        // we can break now as we have hit an object.
                    }
                }
            }

            // no point running this if the item is not interactive or does not have an interactive parent.
            if (interactive) {
                // if we are hit testing (as in we have no hit any objects yet)
                // We also don't need to worry about hit testing if once of the displayObjects children
                // has already been hit!
                if (hitTest && !hit) {
                    if (displayObject.hitArea) {
                        displayObject.worldTransform.applyInverse(point, this._tempPoint);
                        hit = displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y);
                    } else if (displayObject.containsPoint) {
                        hit = displayObject.containsPoint(point);
                    }
                }

                if (displayObject.interactive) {
                    if (hit && !this.eventData.target) {
                        this.eventData.target = displayObject;
                        this.mouse.target = displayObject;
                        this.pointer.target = displayObject;
                    }

                    func(displayObject, hit);
                }
            }

            return hit;
        }

        /**
         * Is called when the mouse button is pressed down on the renderer element
         *
         * @private
         * @param {MouseEvent} event - The DOM event of a mouse button being pressed down
         */

    }, {
        key: 'onMouseDown',
        value: function onMouseDown(event) {
            this.mouse.originalEvent = event;
            this.eventData.data = this.mouse;
            this.eventData._reset();

            // Update internal mouse reference
            this.mapPositionToPoint(this.mouse.global, event.clientX, event.clientY);

            if (this.autoPreventDefault) {
                this.mouse.originalEvent.preventDefault();
            }

            this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseDown, true);

            var isRightButton = event.button === 2 || event.which === 3;

            this.emit(isRightButton ? 'rightdown' : 'mousedown', this.eventData);
        }

        /**
         * Processes the result of the mouse down check and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processMouseDown',
        value: function processMouseDown(displayObject, hit) {
            var e = this.mouse.originalEvent;

            var isRightButton = e.button === 2 || e.which === 3;

            if (hit) {
                displayObject[isRightButton ? '_isRightDown' : '_isLeftDown'] = true;
                this.dispatchEvent(displayObject, isRightButton ? 'rightdown' : 'mousedown', this.eventData);
            }
        }

        /**
         * Is called when the mouse button is released on the renderer element
         *
         * @private
         * @param {MouseEvent} event - The DOM event of a mouse button being released
         */

    }, {
        key: 'onMouseUp',
        value: function onMouseUp(event) {
            this.mouse.originalEvent = event;
            this.eventData.data = this.mouse;
            this.eventData._reset();

            // Update internal mouse reference
            this.mapPositionToPoint(this.mouse.global, event.clientX, event.clientY);

            this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseUp, true);

            var isRightButton = event.button === 2 || event.which === 3;

            this.emit(isRightButton ? 'rightup' : 'mouseup', this.eventData);
        }

        /**
         * Processes the result of the mouse up check and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processMouseUp',
        value: function processMouseUp(displayObject, hit) {
            var e = this.mouse.originalEvent;

            var isRightButton = e.button === 2 || e.which === 3;
            var isDown = isRightButton ? '_isRightDown' : '_isLeftDown';

            if (hit) {
                this.dispatchEvent(displayObject, isRightButton ? 'rightup' : 'mouseup', this.eventData);

                if (displayObject[isDown]) {
                    displayObject[isDown] = false;
                    this.dispatchEvent(displayObject, isRightButton ? 'rightclick' : 'click', this.eventData);
                }
            } else if (displayObject[isDown]) {
                displayObject[isDown] = false;
                this.dispatchEvent(displayObject, isRightButton ? 'rightupoutside' : 'mouseupoutside', this.eventData);
            }
        }

        /**
         * Is called when the mouse moves across the renderer element
         *
         * @private
         * @param {MouseEvent} event - The DOM event of the mouse moving
         */

    }, {
        key: 'onMouseMove',
        value: function onMouseMove(event) {
            this.mouse.originalEvent = event;
            this.eventData.data = this.mouse;
            this.eventData._reset();

            this.mapPositionToPoint(this.mouse.global, event.clientX, event.clientY);

            this.didMove = true;

            this.cursor = this.defaultCursorStyle;

            this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseMove, true);

            this.emit('mousemove', this.eventData);

            if (this.currentCursorStyle !== this.cursor) {
                this.currentCursorStyle = this.cursor;
                this.interactionDOMElement.style.cursor = this.cursor;
            }

            // TODO BUG for parents interactive object (border order issue)
        }

        /**
         * Processes the result of the mouse move check and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processMouseMove',
        value: function processMouseMove(displayObject, hit) {
            this.processMouseOverOut(displayObject, hit);

            // only display on mouse over
            if (!this.moveWhenInside || hit) {
                this.dispatchEvent(displayObject, 'mousemove', this.eventData);
            }
        }

        /**
         * Is called when the mouse is moved out of the renderer element
         *
         * @private
         * @param {MouseEvent} event - The DOM event of the mouse being moved out
         */

    }, {
        key: 'onMouseOut',
        value: function onMouseOut(event) {
            this.mouseOverRenderer = false;

            this.mouse.originalEvent = event;
            this.eventData.data = this.mouse;
            this.eventData._reset();

            // Update internal mouse reference
            this.mapPositionToPoint(this.mouse.global, event.clientX, event.clientY);

            this.interactionDOMElement.style.cursor = this.defaultCursorStyle;

            // TODO optimize by not check EVERY TIME! maybe half as often? //
            this.mapPositionToPoint(this.mouse.global, event.clientX, event.clientY);

            this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseOverOut, false);

            this.emit('mouseout', this.eventData);
        }

        /**
         * Processes the result of the mouse over/out check and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processMouseOverOut',
        value: function processMouseOverOut(displayObject, hit) {
            if (hit && this.mouseOverRenderer) {
                if (!displayObject._mouseOver) {
                    displayObject._mouseOver = true;
                    this.dispatchEvent(displayObject, 'mouseover', this.eventData);
                }

                if (displayObject.buttonMode) {
                    this.cursor = displayObject.defaultCursor;
                }
            } else if (displayObject._mouseOver) {
                displayObject._mouseOver = false;
                this.dispatchEvent(displayObject, 'mouseout', this.eventData);
            }
        }

        /**
         * Is called when the mouse enters the renderer element area
         *
         * @private
         * @param {MouseEvent} event - The DOM event of the mouse moving into the renderer view
         */

    }, {
        key: 'onMouseOver',
        value: function onMouseOver(event) {
            this.mouseOverRenderer = true;

            this.mouse.originalEvent = event;
            this.eventData.data = this.mouse;
            this.eventData._reset();

            this.emit('mouseover', this.eventData);
        }

        /**
         * Is called when the pointer button is pressed down on the renderer element
         *
         * @private
         * @param {PointerEvent} event - The DOM event of a pointer button being pressed down
         */

    }, {
        key: 'onPointerDown',
        value: function onPointerDown(event) {
            this.normalizeToPointerData(event);
            this.pointer.originalEvent = event;
            this.eventData.data = this.pointer;
            this.eventData._reset();

            // Update internal pointer reference
            this.mapPositionToPoint(this.pointer.global, event.clientX, event.clientY);

            /**
             * No need to prevent default on natural pointer events, as there are no side effects
             * Normalized events, however, may have the double mousedown/touchstart issue on the native android browser,
             * so still need to be prevented.
             */
            if (this.autoPreventDefault && (this.normalizeMouseEvents || this.normalizeTouchEvents)) {
                this.pointer.originalEvent.preventDefault();
            }

            this.processInteractive(this.pointer.global, this.renderer._lastObjectRendered, this.processPointerDown, true);

            this.emit('pointerdown', this.eventData);
        }

        /**
         * Processes the result of the pointer down check and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processPointerDown',
        value: function processPointerDown(displayObject, hit) {
            if (hit) {
                displayObject._pointerDown = true;
                this.dispatchEvent(displayObject, 'pointerdown', this.eventData);
            }
        }

        /**
         * Is called when the pointer button is released on the renderer element
         *
         * @private
         * @param {PointerEvent} event - The DOM event of a pointer button being released
         */

    }, {
        key: 'onPointerUp',
        value: function onPointerUp(event) {
            this.normalizeToPointerData(event);
            this.pointer.originalEvent = event;
            this.eventData.data = this.pointer;
            this.eventData._reset();

            // Update internal pointer reference
            this.mapPositionToPoint(this.pointer.global, event.clientX, event.clientY);

            this.processInteractive(this.pointer.global, this.renderer._lastObjectRendered, this.processPointerUp, true);

            this.emit('pointerup', this.eventData);
        }

        /**
         * Processes the result of the pointer up check and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processPointerUp',
        value: function processPointerUp(displayObject, hit) {
            if (hit) {
                this.dispatchEvent(displayObject, 'pointerup', this.eventData);

                if (displayObject._pointerDown) {
                    displayObject._pointerDown = false;
                    this.dispatchEvent(displayObject, 'pointertap', this.eventData);
                }
            } else if (displayObject._pointerDown) {
                displayObject._pointerDown = false;
                this.dispatchEvent(displayObject, 'pointerupoutside', this.eventData);
            }
        }

        /**
         * Is called when the pointer moves across the renderer element
         *
         * @private
         * @param {PointerEvent} event - The DOM event of a pointer moving
         */

    }, {
        key: 'onPointerMove',
        value: function onPointerMove(event) {
            this.normalizeToPointerData(event);
            this.pointer.originalEvent = event;
            this.eventData.data = this.pointer;
            this.eventData._reset();

            this.mapPositionToPoint(this.pointer.global, event.clientX, event.clientY);

            this.processInteractive(this.pointer.global, this.renderer._lastObjectRendered, this.processPointerMove, true);

            this.emit('pointermove', this.eventData);
        }

        /**
         * Processes the result of the pointer move check and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processPointerMove',
        value: function processPointerMove(displayObject, hit) {
            if (!this.pointer.originalEvent.changedTouches) {
                this.processPointerOverOut(displayObject, hit);
            }

            if (!this.moveWhenInside || hit) {
                this.dispatchEvent(displayObject, 'pointermove', this.eventData);
            }
        }

        /**
         * Is called when the pointer is moved out of the renderer element
         *
         * @private
         * @param {PointerEvent} event - The DOM event of a pointer being moved out
         */

    }, {
        key: 'onPointerOut',
        value: function onPointerOut(event) {
            this.normalizeToPointerData(event);
            this.pointer.originalEvent = event;
            this.eventData.data = this.pointer;
            this.eventData._reset();

            // Update internal pointer reference
            this.mapPositionToPoint(this.pointer.global, event.clientX, event.clientY);

            this.processInteractive(this.pointer.global, this.renderer._lastObjectRendered, this.processPointerOverOut, false);

            this.emit('pointerout', this.eventData);
        }

        /**
         * Processes the result of the pointer over/out check and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processPointerOverOut',
        value: function processPointerOverOut(displayObject, hit) {
            if (hit && this.mouseOverRenderer) {
                if (!displayObject._pointerOver) {
                    displayObject._pointerOver = true;
                    this.dispatchEvent(displayObject, 'pointerover', this.eventData);
                }
            } else if (displayObject._pointerOver) {
                displayObject._pointerOver = false;
                this.dispatchEvent(displayObject, 'pointerout', this.eventData);
            }
        }

        /**
         * Is called when the pointer is moved into the renderer element
         *
         * @private
         * @param {PointerEvent} event - The DOM event of a pointer button being moved into the renderer view
         */

    }, {
        key: 'onPointerOver',
        value: function onPointerOver(event) {
            this.pointer.originalEvent = event;
            this.eventData.data = this.pointer;
            this.eventData._reset();

            this.emit('pointerover', this.eventData);
        }

        /**
         * Is called when a touch is started on the renderer element
         *
         * @private
         * @param {TouchEvent} event - The DOM event of a touch starting on the renderer view
         */

    }, {
        key: 'onTouchStart',
        value: function onTouchStart(event) {
            if (this.autoPreventDefault) {
                event.preventDefault();
            }

            var changedTouches = event.changedTouches;
            var cLength = changedTouches.length;

            for (var i = 0; i < cLength; i++) {
                var touch = changedTouches[i];
                var touchData = this.getTouchData(touch);

                touchData.originalEvent = event;

                this.eventData.data = touchData;
                this.eventData._reset();

                this.processInteractive(touchData.global, this.renderer._lastObjectRendered, this.processTouchStart, true);

                this.emit('touchstart', this.eventData);

                this.returnTouchData(touchData);
            }
        }

        /**
         * Processes the result of a touch check and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processTouchStart',
        value: function processTouchStart(displayObject, hit) {
            if (hit) {
                displayObject._touchDown = true;
                this.dispatchEvent(displayObject, 'touchstart', this.eventData);
            }
        }

        /**
         * Is called when a touch ends on the renderer element
         *
         * @private
         * @param {TouchEvent} event - The DOM event of a touch ending on the renderer view
         */

    }, {
        key: 'onTouchEnd',
        value: function onTouchEnd(event) {
            if (this.autoPreventDefault) {
                event.preventDefault();
            }

            var changedTouches = event.changedTouches;
            var cLength = changedTouches.length;

            for (var i = 0; i < cLength; i++) {
                var touchEvent = changedTouches[i];

                var touchData = this.getTouchData(touchEvent);

                touchData.originalEvent = event;

                // TODO this should be passed along.. no set
                this.eventData.data = touchData;
                this.eventData._reset();

                this.processInteractive(touchData.global, this.renderer._lastObjectRendered, this.processTouchEnd, true);

                this.emit('touchend', this.eventData);

                this.returnTouchData(touchData);
            }
        }

        /**
         * Processes the result of the end of a touch and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processTouchEnd',
        value: function processTouchEnd(displayObject, hit) {
            if (hit) {
                this.dispatchEvent(displayObject, 'touchend', this.eventData);

                if (displayObject._touchDown) {
                    displayObject._touchDown = false;
                    this.dispatchEvent(displayObject, 'tap', this.eventData);
                }
            } else if (displayObject._touchDown) {
                displayObject._touchDown = false;
                this.dispatchEvent(displayObject, 'touchendoutside', this.eventData);
            }
        }

        /**
         * Is called when a touch is moved across the renderer element
         *
         * @private
         * @param {TouchEvent} event - The DOM event of a touch moving accross the renderer view
         */

    }, {
        key: 'onTouchMove',
        value: function onTouchMove(event) {
            if (this.autoPreventDefault) {
                event.preventDefault();
            }

            var changedTouches = event.changedTouches;
            var cLength = changedTouches.length;

            for (var i = 0; i < cLength; i++) {
                var touchEvent = changedTouches[i];

                var touchData = this.getTouchData(touchEvent);

                touchData.originalEvent = event;

                this.eventData.data = touchData;
                this.eventData._reset();

                this.processInteractive(touchData.global, this.renderer._lastObjectRendered, this.processTouchMove, this.moveWhenInside);

                this.emit('touchmove', this.eventData);

                this.returnTouchData(touchData);
            }
        }

        /**
         * Processes the result of a touch move check and dispatches the event if need be
         *
         * @private
         * @param {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} displayObject - The display object that was tested
         * @param {boolean} hit - the result of the hit test on the display object
         */

    }, {
        key: 'processTouchMove',
        value: function processTouchMove(displayObject, hit) {
            if (!this.moveWhenInside || hit) {
                this.dispatchEvent(displayObject, 'touchmove', this.eventData);
            }
        }

        /**
         * Grabs an interaction data object from the internal pool
         *
         * @private
         * @param {Touch} touch - The touch data we need to pair with an interactionData object
         * @return {PIXI.interaction.InteractionData} The built data object.
         */

    }, {
        key: 'getTouchData',
        value: function getTouchData(touch) {
            var touchData = this.interactiveDataPool.pop() || new InteractionData();

            touchData.identifier = touch.identifier;
            this.mapPositionToPoint(touchData.global, touch.clientX, touch.clientY);

            if (navigator.isCocoonJS) {
                touchData.global.x = touchData.global.x / this.resolution;
                touchData.global.y = touchData.global.y / this.resolution;
            }

            touch.globalX = touchData.global.x;
            touch.globalY = touchData.global.y;

            return touchData;
        }

        /**
         * Returns an interaction data object to the internal pool
         *
         * @private
         * @param {PIXI.interaction.InteractionData} touchData - The touch data object we want to return to the pool
         */

    }, {
        key: 'returnTouchData',
        value: function returnTouchData(touchData) {
            this.interactiveDataPool.push(touchData);
        }

        /**
         * Ensures that the original event object contains all data that a regular pointer event would have
         *
         * @private
         * @param {TouchEvent|MouseEvent} event - The original event data from a touch or mouse event
         */

    }, {
        key: 'normalizeToPointerData',
        value: function normalizeToPointerData(event) {
            if (this.normalizeTouchEvents && event.changedTouches) {
                if (typeof event.button === 'undefined') event.button = event.touches.length ? 1 : 0;
                if (typeof event.buttons === 'undefined') event.buttons = event.touches.length ? 1 : 0;
                if (typeof event.isPrimary === 'undefined') event.isPrimary = event.touches.length === 1;
                if (typeof event.width === 'undefined') event.width = event.changedTouches[0].radiusX || 1;
                if (typeof event.height === 'undefined') event.height = event.changedTouches[0].radiusY || 1;
                if (typeof event.tiltX === 'undefined') event.tiltX = 0;
                if (typeof event.tiltY === 'undefined') event.tiltY = 0;
                if (typeof event.pointerType === 'undefined') event.pointerType = 'touch';
                if (typeof event.pointerId === 'undefined') event.pointerId = event.changedTouches[0].identifier || 0;
                if (typeof event.pressure === 'undefined') event.pressure = event.changedTouches[0].force || 0.5;
                if (typeof event.rotation === 'undefined') event.rotation = event.changedTouches[0].rotationAngle || 0;

                if (typeof event.clientX === 'undefined') event.clientX = event.changedTouches[0].clientX;
                if (typeof event.clientY === 'undefined') event.clientY = event.changedTouches[0].clientY;
                if (typeof event.pageX === 'undefined') event.pageX = event.changedTouches[0].pageX;
                if (typeof event.pageY === 'undefined') event.pageY = event.changedTouches[0].pageY;
                if (typeof event.screenX === 'undefined') event.screenX = event.changedTouches[0].screenX;
                if (typeof event.screenY === 'undefined') event.screenY = event.changedTouches[0].screenY;
                if (typeof event.layerX === 'undefined') event.layerX = event.offsetX = event.clientX;
                if (typeof event.layerY === 'undefined') event.layerY = event.offsetY = event.clientY;
            } else if (this.normalizeMouseEvents) {
                if (typeof event.isPrimary === 'undefined') event.isPrimary = true;
                if (typeof event.width === 'undefined') event.width = 1;
                if (typeof event.height === 'undefined') event.height = 1;
                if (typeof event.tiltX === 'undefined') event.tiltX = 0;
                if (typeof event.tiltY === 'undefined') event.tiltY = 0;
                if (typeof event.pointerType === 'undefined') event.pointerType = 'mouse';
                if (typeof event.pointerId === 'undefined') event.pointerId = 1;
                if (typeof event.pressure === 'undefined') event.pressure = 0.5;
                if (typeof event.rotation === 'undefined') event.rotation = 0;
            }
        }

        /**
         * Destroys the interaction manager
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.removeEvents();

            this.removeAllListeners();

            this.renderer = null;

            this.mouse = null;

            this.eventData = null;

            this.interactiveDataPool = null;

            this.interactionDOMElement = null;

            this.onMouseDown = null;
            this.processMouseDown = null;

            this.onMouseUp = null;
            this.processMouseUp = null;

            this.onMouseMove = null;
            this.processMouseMove = null;

            this.onMouseOut = null;
            this.processMouseOverOut = null;

            this.onMouseOver = null;

            this.onPointerDown = null;
            this.processPointerDown = null;

            this.onPointerUp = null;
            this.processPointerUp = null;

            this.onPointerMove = null;
            this.processPointerMove = null;

            this.onPointerOut = null;
            this.processPointerOverOut = null;

            this.onPointerOver = null;

            this.onTouchStart = null;
            this.processTouchStart = null;

            this.onTouchEnd = null;
            this.processTouchEnd = null;

            this.onTouchMove = null;
            this.processTouchMove = null;

            this._tempPoint = null;
        }
    }]);
    return InteractionManager;
}(index$2);

WebGLRenderer.registerPlugin('interaction', InteractionManager);
CanvasRenderer.registerPlugin('interaction', InteractionManager);

/**
 * @namespace PIXI.interaction
 */


var index$4 = Object.freeze({
	InteractionData: InteractionData,
	InteractionManager: InteractionManager,
	interactiveTarget: interactiveTarget
});

/**
 * The ParticleContainer class is a really fast version of the Container built solely for speed,
 * so use when you need a lot of sprites or particles. The tradeoff of the ParticleContainer is that advanced
 * functionality will not work. ParticleContainer implements only the basic object transform (position, scale, rotation).
 * Any other functionality like tinting, masking, etc will not work on sprites in this batch.
 *
 * It's extremely easy to use :
 *
 * ```js
 * let container = new ParticleContainer();
 *
 * for (let i = 0; i < 100; ++i)
 * {
 *     let sprite = new PIXI.Sprite.fromImage("myImage.png");
 *     container.addChild(sprite);
 * }
 * ```
 *
 * And here you have a hundred sprites that will be renderer at the speed of light.
 *
 * @class
 * @extends PIXI.Container
 * @memberof PIXI.particles
 */

var ParticleContainer = function (_core$Container) {
    inherits(ParticleContainer, _core$Container);

    /**
     * @param {number} [maxSize=15000] - The maximum number of particles that can be renderer by the container.
     * @param {object} [properties] - The properties of children that should be uploaded to the gpu and applied.
     * @param {boolean} [properties.scale=false] - When true, scale be uploaded and applied.
     * @param {boolean} [properties.position=true] - When true, position be uploaded and applied.
     * @param {boolean} [properties.rotation=false] - When true, rotation be uploaded and applied.
     * @param {boolean} [properties.uvs=false] - When true, uvs be uploaded and applied.
     * @param {boolean} [properties.alpha=false] - When true, alpha be uploaded and applied.
     * @param {number} [batchSize=15000] - Number of particles per batch.
     */
    function ParticleContainer() {
        var maxSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1500;
        var properties = arguments[1];
        var batchSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16384;
        classCallCheck(this, ParticleContainer);

        // Making sure the batch size is valid
        // 65535 is max vertex index in the index buffer (see ParticleRenderer)
        // so max number of particles is 65536 / 4 = 16384
        var _this = possibleConstructorReturn(this, (ParticleContainer.__proto__ || Object.getPrototypeOf(ParticleContainer)).call(this));

        var maxBatchSize = 16384;

        if (batchSize > maxBatchSize) {
            batchSize = maxBatchSize;
        }

        if (batchSize > maxSize) {
            batchSize = maxSize;
        }

        /**
         * Set properties to be dynamic (true) / static (false)
         *
         * @member {boolean[]}
         * @private
         */
        _this._properties = [false, true, false, false, false];

        /**
         * @member {number}
         * @private
         */
        _this._maxSize = maxSize;

        /**
         * @member {number}
         * @private
         */
        _this._batchSize = batchSize;

        /**
         * @member {object<number, WebGLBuffer>}
         * @private
         */
        _this._glBuffers = {};

        /**
         * @member {number}
         * @private
         */
        _this._bufferToUpdate = 0;

        /**
         * @member {boolean}
         *
         */
        _this.interactiveChildren = false;

        /**
         * The blend mode to be applied to the sprite. Apply a value of `PIXI.BLEND_MODES.NORMAL`
         * to reset the blend mode.
         *
         * @member {number}
         * @default PIXI.BLEND_MODES.NORMAL
         * @see PIXI.BLEND_MODES
         */
        _this.blendMode = BLEND_MODES.NORMAL;

        /**
         * Used for canvas renderering. If true then the elements will be positioned at the
         * nearest pixel. This provides a nice speed boost.
         *
         * @member {boolean}
         * @default true;
         */
        _this.roundPixels = true;

        /**
         * The texture used to render the children.
         *
         * @readonly
         * @member {BaseTexture}
         */
        _this.baseTexture = null;

        _this.setProperties(properties);
        return _this;
    }

    /**
     * Sets the private properties array to dynamic / static based on the passed properties object
     *
     * @param {object} properties - The properties to be uploaded
     */


    createClass(ParticleContainer, [{
        key: 'setProperties',
        value: function setProperties(properties) {
            if (properties) {
                this._properties[0] = 'scale' in properties ? !!properties.scale : this._properties[0];
                this._properties[1] = 'position' in properties ? !!properties.position : this._properties[1];
                this._properties[2] = 'rotation' in properties ? !!properties.rotation : this._properties[2];
                this._properties[3] = 'uvs' in properties ? !!properties.uvs : this._properties[3];
                this._properties[4] = 'alpha' in properties ? !!properties.alpha : this._properties[4];
            }
        }

        /**
         * Updates the object transform for rendering
         *
         * @private
         */

    }, {
        key: 'updateTransform',
        value: function updateTransform() {
            // TODO don't need to!
            this.displayObjectUpdateTransform();
            //  PIXI.Container.prototype.updateTransform.call( this );
        }

        /**
         * Renders the container using the WebGL renderer
         *
         * @private
         * @param {PIXI.WebGLRenderer} renderer - The webgl renderer
         */

    }, {
        key: 'renderWebGL',
        value: function renderWebGL(renderer) {
            var _this2 = this;

            if (!this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable) {
                return;
            }

            if (!this.baseTexture) {
                this.baseTexture = this.children[0]._texture.baseTexture;
                if (!this.baseTexture.hasLoaded) {
                    this.baseTexture.once('update', function () {
                        return _this2.onChildrenChange(0);
                    });
                }
            }

            renderer.setObjectRenderer(renderer.plugins.particle);
            renderer.plugins.particle.render(this);
        }

        /**
         * Set the flag that static data should be updated to true
         *
         * @private
         * @param {number} smallestChildIndex - The smallest child index
         */

    }, {
        key: 'onChildrenChange',
        value: function onChildrenChange(smallestChildIndex) {
            var bufferIndex = Math.floor(smallestChildIndex / this._batchSize);

            if (bufferIndex < this._bufferToUpdate) {
                this._bufferToUpdate = bufferIndex;
            }
        }

        /**
         * Renders the object using the Canvas renderer
         *
         * @private
         * @param {PIXI.CanvasRenderer} renderer - The canvas renderer
         */

    }, {
        key: 'renderCanvas',
        value: function renderCanvas(renderer) {
            if (!this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable) {
                return;
            }

            var context = renderer.context;
            var transform = this.worldTransform;
            var isRotated = true;

            var positionX = 0;
            var positionY = 0;

            var finalWidth = 0;
            var finalHeight = 0;

            var compositeOperation = renderer.blendModes[this.blendMode];

            if (compositeOperation !== context.globalCompositeOperation) {
                context.globalCompositeOperation = compositeOperation;
            }

            context.globalAlpha = this.worldAlpha;

            this.displayObjectUpdateTransform();

            for (var i = 0; i < this.children.length; ++i) {
                var child = this.children[i];

                if (!child.visible) {
                    continue;
                }

                var frame = child.texture.frame;

                context.globalAlpha = this.worldAlpha * child.alpha;

                if (child.rotation % (Math.PI * 2) === 0) {
                    // this is the fastest  way to optimise! - if rotation is 0 then we can avoid any kind of setTransform call
                    if (isRotated) {
                        context.setTransform(transform.a, transform.b, transform.c, transform.d, transform.tx * renderer.resolution, transform.ty * renderer.resolution);

                        isRotated = false;
                    }

                    positionX = child.anchor.x * (-frame.width * child.scale.x) + child.position.x + 0.5;
                    positionY = child.anchor.y * (-frame.height * child.scale.y) + child.position.y + 0.5;

                    finalWidth = frame.width * child.scale.x;
                    finalHeight = frame.height * child.scale.y;
                } else {
                    if (!isRotated) {
                        isRotated = true;
                    }

                    child.displayObjectUpdateTransform();

                    var childTransform = child.worldTransform;

                    if (renderer.roundPixels) {
                        context.setTransform(childTransform.a, childTransform.b, childTransform.c, childTransform.d, childTransform.tx * renderer.resolution | 0, childTransform.ty * renderer.resolution | 0);
                    } else {
                        context.setTransform(childTransform.a, childTransform.b, childTransform.c, childTransform.d, childTransform.tx * renderer.resolution, childTransform.ty * renderer.resolution);
                    }

                    positionX = child.anchor.x * -frame.width + 0.5;
                    positionY = child.anchor.y * -frame.height + 0.5;

                    finalWidth = frame.width;
                    finalHeight = frame.height;
                }

                var resolution = child.texture.baseTexture.resolution;

                context.drawImage(child.texture.baseTexture.source, frame.x * resolution, frame.y * resolution, frame.width * resolution, frame.height * resolution, positionX * resolution, positionY * resolution, finalWidth * resolution, finalHeight * resolution);
            }
        }

        /**
         * Destroys the container
         *
         * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
         *  have been set to that value
         * @param {boolean} [options.children=false] - if set to true, all the children will have their
         *  destroy method called as well. 'options' will be passed on to those calls.
         */

    }, {
        key: 'destroy',
        value: function destroy(options) {
            get$1(ParticleContainer.prototype.__proto__ || Object.getPrototypeOf(ParticleContainer.prototype), 'destroy', this).call(this, options);

            if (this._buffers) {
                for (var i = 0; i < this._buffers.length; ++i) {
                    this._buffers[i].destroy();
                }
            }

            this._properties = null;
            this._buffers = null;
        }
    }]);
    return ParticleContainer;
}(Container);

/**
 * @class
 * @extends PIXI.Shader
 * @memberof PIXI
 */

var ParticleShader = function (_Shader) {
    inherits(ParticleShader, _Shader);

    /**
     * @param {PIXI.Shader} gl - The webgl shader manager this shader works for.
     */
    function ParticleShader(gl) {
        classCallCheck(this, ParticleShader);
        return possibleConstructorReturn(this, (ParticleShader.__proto__ || Object.getPrototypeOf(ParticleShader)).call(this, gl,
        // vertex shader
        ['attribute vec2 aVertexPosition;', 'attribute vec2 aTextureCoord;', 'attribute float aColor;', 'attribute vec2 aPositionCoord;', 'attribute vec2 aScale;', 'attribute float aRotation;', 'uniform mat3 projectionMatrix;', 'varying vec2 vTextureCoord;', 'varying float vColor;', 'void main(void){', '   vec2 v = aVertexPosition;', '   v.x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);', '   v.y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);', '   v = v + aPositionCoord;', '   gl_Position = vec4((projectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);', '   vTextureCoord = aTextureCoord;', '   vColor = aColor;', '}'].join('\n'),
        // hello
        ['varying vec2 vTextureCoord;', 'varying float vColor;', 'uniform sampler2D uSampler;', 'uniform float uAlpha;', 'void main(void){', '  vec4 color = texture2D(uSampler, vTextureCoord) * vColor * uAlpha;', '  if (color.a == 0.0) discard;', '  gl_FragColor = color;', '}'].join('\n')));
    }

    return ParticleShader;
}(Shader);

/**
 * @author Mat Groves
 *
 * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * for creating the original pixi version!
 * Also a thanks to https://github.com/bchevalier for tweaking the tint and alpha so that
 * they now share 4 bytes on the vertex buffer
 *
 * Heavily inspired by LibGDX's ParticleBuffer:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/ParticleBuffer.java
 */

/**
 * The particle buffer manages the static and dynamic buffers for a particle container.
 *
 * @class
 * @private
 * @memberof PIXI
 */

var ParticleBuffer = function () {
    /**
     * @param {WebGLRenderingContext} gl - The rendering context.
     * @param {object} properties - The properties to upload.
     * @param {boolean[]} dynamicPropertyFlags - Flags for which properties are dynamic.
     * @param {number} size - The size of the batch.
     */
    function ParticleBuffer(gl, properties, dynamicPropertyFlags, size) {
        classCallCheck(this, ParticleBuffer);

        /**
         * The current WebGL drawing context.
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * Size of a single vertex.
         *
         * @member {number}
         */
        this.vertSize = 2;

        /**
         * Size of a single vertex in bytes.
         *
         * @member {number}
         */
        this.vertByteSize = this.vertSize * 4;

        /**
         * The number of particles the buffer can hold
         *
         * @member {number}
         */
        this.size = size;

        /**
         * A list of the properties that are dynamic.
         *
         * @member {object[]}
         */
        this.dynamicProperties = [];

        /**
         * A list of the properties that are static.
         *
         * @member {object[]}
         */
        this.staticProperties = [];

        for (var i = 0; i < properties.length; ++i) {
            var property = properties[i];

            // Make copy of properties object so that when we edit the offset it doesn't
            // change all other instances of the object literal
            property = {
                attribute: property.attribute,
                size: property.size,
                uploadFunction: property.uploadFunction,
                offset: property.offset
            };

            if (dynamicPropertyFlags[i]) {
                this.dynamicProperties.push(property);
            } else {
                this.staticProperties.push(property);
            }
        }

        this.staticStride = 0;
        this.staticBuffer = null;
        this.staticData = null;

        this.dynamicStride = 0;
        this.dynamicBuffer = null;
        this.dynamicData = null;

        this.initBuffers();
    }

    /**
     * Sets up the renderer context and necessary buffers.
     *
     * @private
     */


    createClass(ParticleBuffer, [{
        key: 'initBuffers',
        value: function initBuffers() {
            var gl = this.gl;
            var dynamicOffset = 0;

            /**
             * Holds the indices of the geometry (quads) to draw
             *
             * @member {Uint16Array}
             */
            this.indices = createIndicesForQuads(this.size);
            this.indexBuffer = glCore__default.GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);

            this.dynamicStride = 0;

            for (var i = 0; i < this.dynamicProperties.length; ++i) {
                var property = this.dynamicProperties[i];

                property.offset = dynamicOffset;
                dynamicOffset += property.size;
                this.dynamicStride += property.size;
            }

            this.dynamicData = new Float32Array(this.size * this.dynamicStride * 4);
            this.dynamicBuffer = glCore__default.GLBuffer.createVertexBuffer(gl, this.dynamicData, gl.STREAM_DRAW);

            // static //
            var staticOffset = 0;

            this.staticStride = 0;

            for (var _i = 0; _i < this.staticProperties.length; ++_i) {
                var _property = this.staticProperties[_i];

                _property.offset = staticOffset;
                staticOffset += _property.size;
                this.staticStride += _property.size;
            }

            this.staticData = new Float32Array(this.size * this.staticStride * 4);
            this.staticBuffer = glCore__default.GLBuffer.createVertexBuffer(gl, this.staticData, gl.STATIC_DRAW);

            this.vao = new glCore__default.VertexArrayObject(gl).addIndex(this.indexBuffer);

            for (var _i2 = 0; _i2 < this.dynamicProperties.length; ++_i2) {
                var _property2 = this.dynamicProperties[_i2];

                this.vao.addAttribute(this.dynamicBuffer, _property2.attribute, gl.FLOAT, false, this.dynamicStride * 4, _property2.offset * 4);
            }

            for (var _i3 = 0; _i3 < this.staticProperties.length; ++_i3) {
                var _property3 = this.staticProperties[_i3];

                this.vao.addAttribute(this.staticBuffer, _property3.attribute, gl.FLOAT, false, this.staticStride * 4, _property3.offset * 4);
            }
        }

        /**
         * Uploads the dynamic properties.
         *
         * @param {PIXI.DisplayObject[]} children - The children to upload.
         * @param {number} startIndex - The index to start at.
         * @param {number} amount - The number to upload.
         */

    }, {
        key: 'uploadDynamic',
        value: function uploadDynamic(children, startIndex, amount) {
            for (var i = 0; i < this.dynamicProperties.length; i++) {
                var property = this.dynamicProperties[i];

                property.uploadFunction(children, startIndex, amount, this.dynamicData, this.dynamicStride, property.offset);
            }

            this.dynamicBuffer.upload();
        }

        /**
         * Uploads the static properties.
         *
         * @param {PIXI.DisplayObject[]} children - The children to upload.
         * @param {number} startIndex - The index to start at.
         * @param {number} amount - The number to upload.
         */

    }, {
        key: 'uploadStatic',
        value: function uploadStatic(children, startIndex, amount) {
            for (var i = 0; i < this.staticProperties.length; i++) {
                var property = this.staticProperties[i];

                property.uploadFunction(children, startIndex, amount, this.staticData, this.staticStride, property.offset);
            }

            this.staticBuffer.upload();
        }

        /**
         * Destroys the ParticleBuffer.
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.dynamicProperties = null;
            this.dynamicData = null;
            this.dynamicBuffer.destroy();

            this.staticProperties = null;
            this.staticData = null;
            this.staticBuffer.destroy();
        }
    }]);
    return ParticleBuffer;
}();

/**
 * @author Mat Groves
 *
 * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * for creating the original pixi version!
 * Also a thanks to https://github.com/bchevalier for tweaking the tint and alpha so that they now
 * share 4 bytes on the vertex buffer
 *
 * Heavily inspired by LibGDX's ParticleRenderer:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/ParticleRenderer.java
 */

/**
 *
 * @class
 * @private
 * @memberof PIXI
 */

var ParticleRenderer = function (_core$ObjectRenderer) {
    inherits(ParticleRenderer, _core$ObjectRenderer);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this sprite batch works for.
     */
    function ParticleRenderer(renderer) {
        classCallCheck(this, ParticleRenderer);

        // 65535 is max vertex index in the index buffer (see ParticleRenderer)
        // so max number of particles is 65536 / 4 = 16384
        // and max number of element in the index buffer is 16384 * 6 = 98304
        // Creating a full index buffer, overhead is 98304 * 2 = 196Ko
        // let numIndices = 98304;

        /**
         * The default shader that is used if a sprite doesn't have a more specific one.
         *
         * @member {PIXI.Shader}
         */
        var _this = possibleConstructorReturn(this, (ParticleRenderer.__proto__ || Object.getPrototypeOf(ParticleRenderer)).call(this, renderer));

        _this.shader = null;

        _this.indexBuffer = null;

        _this.properties = null;

        _this.tempMatrix = new Matrix();

        _this.CONTEXT_UID = 0;
        return _this;
    }

    /**
     * When there is a WebGL context change
     *
     * @private
     */


    createClass(ParticleRenderer, [{
        key: 'onContextChange',
        value: function onContextChange() {
            var gl = this.renderer.gl;

            this.CONTEXT_UID = this.renderer.CONTEXT_UID;

            // setup default shader
            this.shader = new ParticleShader(gl);

            this.properties = [
            // verticesData
            {
                attribute: this.shader.attributes.aVertexPosition,
                size: 2,
                uploadFunction: this.uploadVertices,
                offset: 0
            },
            // positionData
            {
                attribute: this.shader.attributes.aPositionCoord,
                size: 2,
                uploadFunction: this.uploadPosition,
                offset: 0
            },
            // rotationData
            {
                attribute: this.shader.attributes.aRotation,
                size: 1,
                uploadFunction: this.uploadRotation,
                offset: 0
            },
            // uvsData
            {
                attribute: this.shader.attributes.aTextureCoord,
                size: 2,
                uploadFunction: this.uploadUvs,
                offset: 0
            },
            // alphaData
            {
                attribute: this.shader.attributes.aColor,
                size: 1,
                uploadFunction: this.uploadAlpha,
                offset: 0
            }];
        }

        /**
         * Starts a new particle batch.
         *
         */

    }, {
        key: 'start',
        value: function start() {
            this.renderer.bindShader(this.shader);
        }

        /**
         * Renders the particle container object.
         *
         * @param {PIXI.ParticleContainer} container - The container to render using this ParticleRenderer
         */

    }, {
        key: 'render',
        value: function render(container) {
            var children = container.children;
            var maxSize = container._maxSize;
            var batchSize = container._batchSize;
            var renderer = this.renderer;
            var totalChildren = children.length;

            if (totalChildren === 0) {
                return;
            } else if (totalChildren > maxSize) {
                totalChildren = maxSize;
            }

            var buffers = container._glBuffers[renderer.CONTEXT_UID];

            if (!buffers) {
                buffers = container._glBuffers[renderer.CONTEXT_UID] = this.generateBuffers(container);
            }

            // if the uvs have not updated then no point rendering just yet!
            this.renderer.setBlendMode(container.blendMode);

            var gl = renderer.gl;

            var m = container.worldTransform.copy(this.tempMatrix);

            m.prepend(renderer._activeRenderTarget.projectionMatrix);

            this.shader.uniforms.projectionMatrix = m.toArray(true);
            this.shader.uniforms.uAlpha = container.worldAlpha;

            // make sure the texture is bound..
            var baseTexture = children[0]._texture.baseTexture;

            this.shader.uniforms.uSampler = renderer.bindTexture(baseTexture);

            // now lets upload and render the buffers..
            for (var i = 0, j = 0; i < totalChildren; i += batchSize, j += 1) {
                var amount = totalChildren - i;

                if (amount > batchSize) {
                    amount = batchSize;
                }

                var buffer = buffers[j];

                // we always upload the dynamic
                buffer.uploadDynamic(children, i, amount);

                // we only upload the static content when we have to!
                if (container._bufferToUpdate === j) {
                    buffer.uploadStatic(children, i, amount);
                    container._bufferToUpdate = j + 1;
                }

                // bind the buffer
                renderer.bindVao(buffer.vao);
                buffer.vao.draw(gl.TRIANGLES, amount * 6);
            }
        }

        /**
         * Creates one particle buffer for each child in the container we want to render and updates internal properties
         *
         * @param {PIXI.ParticleContainer} container - The container to render using this ParticleRenderer
         * @return {PIXI.ParticleBuffer[]} The buffers
         */

    }, {
        key: 'generateBuffers',
        value: function generateBuffers(container) {
            var gl = this.renderer.gl;
            var buffers = [];
            var size = container._maxSize;
            var batchSize = container._batchSize;
            var dynamicPropertyFlags = container._properties;

            for (var i = 0; i < size; i += batchSize) {
                buffers.push(new ParticleBuffer(gl, this.properties, dynamicPropertyFlags, batchSize));
            }

            return buffers;
        }

        /**
         * Uploads the verticies.
         *
         * @param {PIXI.DisplayObject[]} children - the array of display objects to render
         * @param {number} startIndex - the index to start from in the children array
         * @param {number} amount - the amount of children that will have their vertices uploaded
         * @param {number[]} array - The vertices to upload.
         * @param {number} stride - Stride to use for iteration.
         * @param {number} offset - Offset to start at.
         */

    }, {
        key: 'uploadVertices',
        value: function uploadVertices(children, startIndex, amount, array, stride, offset) {
            var w0 = 0;
            var w1 = 0;
            var h0 = 0;
            var h1 = 0;

            for (var i = 0; i < amount; ++i) {
                var sprite = children[startIndex + i];
                var texture = sprite._texture;
                var sx = sprite.scale.x;
                var sy = sprite.scale.y;
                var trim = texture.trim;
                var orig = texture.orig;

                if (trim) {
                    // if the sprite is trimmed and is not a tilingsprite then we need to add the
                    // extra space before transforming the sprite coords..
                    w1 = trim.x - sprite.anchor.x * orig.width;
                    w0 = w1 + trim.width;

                    h1 = trim.y - sprite.anchor.y * orig.height;
                    h0 = h1 + trim.height;
                } else {
                    w0 = orig.width * (1 - sprite.anchor.x);
                    w1 = orig.width * -sprite.anchor.x;

                    h0 = orig.height * (1 - sprite.anchor.y);
                    h1 = orig.height * -sprite.anchor.y;
                }

                array[offset] = w1 * sx;
                array[offset + 1] = h1 * sy;

                array[offset + stride] = w0 * sx;
                array[offset + stride + 1] = h1 * sy;

                array[offset + stride * 2] = w0 * sx;
                array[offset + stride * 2 + 1] = h0 * sy;

                array[offset + stride * 3] = w1 * sx;
                array[offset + stride * 3 + 1] = h0 * sy;

                offset += stride * 4;
            }
        }

        /**
         *
         * @param {PIXI.DisplayObject[]} children - the array of display objects to render
         * @param {number} startIndex - the index to start from in the children array
         * @param {number} amount - the amount of children that will have their positions uploaded
         * @param {number[]} array - The vertices to upload.
         * @param {number} stride - Stride to use for iteration.
         * @param {number} offset - Offset to start at.
         */

    }, {
        key: 'uploadPosition',
        value: function uploadPosition(children, startIndex, amount, array, stride, offset) {
            for (var i = 0; i < amount; i++) {
                var spritePosition = children[startIndex + i].position;

                array[offset] = spritePosition.x;
                array[offset + 1] = spritePosition.y;

                array[offset + stride] = spritePosition.x;
                array[offset + stride + 1] = spritePosition.y;

                array[offset + stride * 2] = spritePosition.x;
                array[offset + stride * 2 + 1] = spritePosition.y;

                array[offset + stride * 3] = spritePosition.x;
                array[offset + stride * 3 + 1] = spritePosition.y;

                offset += stride * 4;
            }
        }

        /**
         *
         * @param {PIXI.DisplayObject[]} children - the array of display objects to render
         * @param {number} startIndex - the index to start from in the children array
         * @param {number} amount - the amount of children that will have their rotation uploaded
         * @param {number[]} array - The vertices to upload.
         * @param {number} stride - Stride to use for iteration.
         * @param {number} offset - Offset to start at.
         */

    }, {
        key: 'uploadRotation',
        value: function uploadRotation(children, startIndex, amount, array, stride, offset) {
            for (var i = 0; i < amount; i++) {
                var spriteRotation = children[startIndex + i].rotation;

                array[offset] = spriteRotation;
                array[offset + stride] = spriteRotation;
                array[offset + stride * 2] = spriteRotation;
                array[offset + stride * 3] = spriteRotation;

                offset += stride * 4;
            }
        }

        /**
         *
         * @param {PIXI.DisplayObject[]} children - the array of display objects to render
         * @param {number} startIndex - the index to start from in the children array
         * @param {number} amount - the amount of children that will have their rotation uploaded
         * @param {number[]} array - The vertices to upload.
         * @param {number} stride - Stride to use for iteration.
         * @param {number} offset - Offset to start at.
         */

    }, {
        key: 'uploadUvs',
        value: function uploadUvs(children, startIndex, amount, array, stride, offset) {
            for (var i = 0; i < amount; ++i) {
                var textureUvs = children[startIndex + i]._texture._uvs;

                if (textureUvs) {
                    array[offset] = textureUvs.x0;
                    array[offset + 1] = textureUvs.y0;

                    array[offset + stride] = textureUvs.x1;
                    array[offset + stride + 1] = textureUvs.y1;

                    array[offset + stride * 2] = textureUvs.x2;
                    array[offset + stride * 2 + 1] = textureUvs.y2;

                    array[offset + stride * 3] = textureUvs.x3;
                    array[offset + stride * 3 + 1] = textureUvs.y3;

                    offset += stride * 4;
                } else {
                    // TODO you know this can be easier!
                    array[offset] = 0;
                    array[offset + 1] = 0;

                    array[offset + stride] = 0;
                    array[offset + stride + 1] = 0;

                    array[offset + stride * 2] = 0;
                    array[offset + stride * 2 + 1] = 0;

                    array[offset + stride * 3] = 0;
                    array[offset + stride * 3 + 1] = 0;

                    offset += stride * 4;
                }
            }
        }

        /**
         *
         * @param {PIXI.DisplayObject[]} children - the array of display objects to render
         * @param {number} startIndex - the index to start from in the children array
         * @param {number} amount - the amount of children that will have their rotation uploaded
         * @param {number[]} array - The vertices to upload.
         * @param {number} stride - Stride to use for iteration.
         * @param {number} offset - Offset to start at.
         */

    }, {
        key: 'uploadAlpha',
        value: function uploadAlpha(children, startIndex, amount, array, stride, offset) {
            for (var i = 0; i < amount; i++) {
                var spriteAlpha = children[startIndex + i].alpha;

                array[offset] = spriteAlpha;
                array[offset + stride] = spriteAlpha;
                array[offset + stride * 2] = spriteAlpha;
                array[offset + stride * 3] = spriteAlpha;

                offset += stride * 4;
            }
        }

        /**
         * Destroys the ParticleRenderer.
         *
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.renderer.gl) {
                this.renderer.gl.deleteBuffer(this.indexBuffer);
            }

            get$1(ParticleRenderer.prototype.__proto__ || Object.getPrototypeOf(ParticleRenderer.prototype), 'destroy', this).call(this);

            this.shader.destroy();

            this.indices = null;
            this.tempMatrix = null;
        }
    }]);
    return ParticleRenderer;
}(ObjectRenderer);

WebGLRenderer.registerPlugin('particle', ParticleRenderer);

/**
 * @namespace PIXI.particles
 */


var index$5 = Object.freeze({
	ParticleContainer: ParticleContainer,
	ParticleRenderer: ParticleRenderer
});

// import polyfills
// export libs
// import * as accessibility from './accessibility';
//import * as extract from './extract';
// import * as extras from './extras';
// import * as filters from './filters';
// import * as loaders from './loaders';
// import * as mesh from './mesh';


/**
 * A premade instance of the loader that can be used to load resources.
 *
 * @name loader
 * @memberof PIXI
 * @property {PIXI.loaders.Loader}
 */
// const loader = loaders && loaders.Loader ? new loaders.Loader() : null; // check is there in case user excludes loader lib

// export { loader };

// Always export pixi globally.
// global.PIXI = exports; // eslint-disable-line

exports.interaction = index$4;
exports.particles = index$5;
exports.settings = settings;
exports.utils = index$1;
exports.ticker = index$3;
exports.CanvasRenderer = CanvasRenderer;
exports.WebGLRenderer = WebGLRenderer;
exports.autoDetectRenderer = autoDetectRenderer;
exports.glCore = glCore__default;
exports.DisplayObject = DisplayObject;
exports.Container = Container;
exports.Transform = Transform;
exports.TransformStatic = TransformStatic;
exports.TransformBase = TransformBase;
exports.Sprite = Sprite;
exports.CanvasSpriteRenderer = CanvasSpriteRenderer;
exports.CanvasTinter = CanvasTinter;
exports.SpriteRenderer = SpriteRenderer;
exports.Text = Text;
exports.TextStyle = TextStyle;
exports.Graphics = Graphics;
exports.GraphicsData = GraphicsData;
exports.GraphicsRenderer = GraphicsRenderer;
exports.CanvasGraphicsRenderer = CanvasGraphicsRenderer;
exports.Texture = Texture;
exports.BaseTexture = BaseTexture;
exports.RenderTexture = RenderTexture;
exports.BaseRenderTexture = BaseRenderTexture;
exports.VideoBaseTexture = VideoBaseTexture;
exports.TextureUvs = TextureUvs;
exports.CanvasRenderTarget = CanvasRenderTarget;
exports.Shader = Shader;
exports.WebGLManager = WebGLManager;
exports.ObjectRenderer = ObjectRenderer;
exports.RenderTarget = RenderTarget;
exports.Quad = Quad;
exports.SpriteMaskFilter = SpriteMaskFilter;
exports.Filter = Filter;
exports.VERSION = VERSION;
exports.PI_2 = PI_2;
exports.RAD_TO_DEG = RAD_TO_DEG;
exports.DEG_TO_RAD = DEG_TO_RAD;
exports.RENDERER_TYPE = RENDERER_TYPE;
exports.BLEND_MODES = BLEND_MODES;
exports.DRAW_MODES = DRAW_MODES;
exports.SCALE_MODES = SCALE_MODES;
exports.WRAP_MODES = WRAP_MODES;
exports.GC_MODES = GC_MODES;
exports.URL_FILE_EXTENSION = URL_FILE_EXTENSION;
exports.DATA_URI = DATA_URI;
exports.SVG_SIZE = SVG_SIZE;
exports.SHAPES = SHAPES;
exports.PRECISION = PRECISION;
exports.TRANSFORM_MODE = TRANSFORM_MODE;
exports.TEXT_GRADIENT = TEXT_GRADIENT;
exports.CAN_UPLOAD_SAME_BUFFER = CAN_UPLOAD_SAME_BUFFER;
exports.Point = Point;
exports.ObservablePoint = ObservablePoint;
exports.Matrix = Matrix;
exports.GroupD8 = GroupD8;
exports.Circle = Circle;
exports.Ellipse = Ellipse;
exports.Polygon = Polygon;
exports.Rectangle = Rectangle;
exports.RoundedRectangle = RoundedRectangle;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pixi.js.map
