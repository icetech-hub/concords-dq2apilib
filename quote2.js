/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.quote2 = (function() {

    /**
     * Namespace quote2.
     * @exports quote2
     * @namespace
     */
    var quote2 = {};

    quote2.Search = (function() {

        /**
         * Properties of a Search.
         * @memberof quote2
         * @interface ISearch
         * @property {string|null} [symbol] Search symbol
         * @property {string|null} [name] Search name
         */

        /**
         * Constructs a new Search.
         * @memberof quote2
         * @classdesc Represents a Search.
         * @implements ISearch
         * @constructor
         * @param {quote2.ISearch=} [properties] Properties to set
         */
        function Search(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Search symbol.
         * @member {string} symbol
         * @memberof quote2.Search
         * @instance
         */
        Search.prototype.symbol = "";

        /**
         * Search name.
         * @member {string} name
         * @memberof quote2.Search
         * @instance
         */
        Search.prototype.name = "";

        /**
         * Creates a new Search instance using the specified properties.
         * @function create
         * @memberof quote2.Search
         * @static
         * @param {quote2.ISearch=} [properties] Properties to set
         * @returns {quote2.Search} Search instance
         */
        Search.create = function create(properties) {
            return new Search(properties);
        };

        /**
         * Encodes the specified Search message. Does not implicitly {@link quote2.Search.verify|verify} messages.
         * @function encode
         * @memberof quote2.Search
         * @static
         * @param {quote2.ISearch} message Search message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Search.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.symbol != null && Object.hasOwnProperty.call(message, "symbol"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.symbol);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified Search message, length delimited. Does not implicitly {@link quote2.Search.verify|verify} messages.
         * @function encodeDelimited
         * @memberof quote2.Search
         * @static
         * @param {quote2.ISearch} message Search message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Search.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Search message from the specified reader or buffer.
         * @function decode
         * @memberof quote2.Search
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {quote2.Search} Search
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Search.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.quote2.Search();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.symbol = reader.string();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Search message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof quote2.Search
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {quote2.Search} Search
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Search.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Search message.
         * @function verify
         * @memberof quote2.Search
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Search.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.symbol != null && message.hasOwnProperty("symbol"))
                if (!$util.isString(message.symbol))
                    return "symbol: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };

        /**
         * Creates a Search message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof quote2.Search
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {quote2.Search} Search
         */
        Search.fromObject = function fromObject(object) {
            if (object instanceof $root.quote2.Search)
                return object;
            var message = new $root.quote2.Search();
            if (object.symbol != null)
                message.symbol = String(object.symbol);
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };

        /**
         * Creates a plain object from a Search message. Also converts values to other types if specified.
         * @function toObject
         * @memberof quote2.Search
         * @static
         * @param {quote2.Search} message Search
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Search.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.symbol = "";
                object.name = "";
            }
            if (message.symbol != null && message.hasOwnProperty("symbol"))
                object.symbol = message.symbol;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };

        /**
         * Converts this Search to JSON.
         * @function toJSON
         * @memberof quote2.Search
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Search.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Search
         * @function getTypeUrl
         * @memberof quote2.Search
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Search.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/quote2.Search";
        };

        return Search;
    })();

    quote2.Quote2Data = (function() {

        /**
         * Properties of a Quote2Data.
         * @memberof quote2
         * @interface IQuote2Data
         * @property {number|null} [code] Quote2Data code
         * @property {string|null} [msg] Quote2Data msg
         * @property {string|null} [type] Quote2Data type
         * @property {string|null} [recognize] Quote2Data recognize
         * @property {Array.<quote2.ISearch>|null} [searchs] Quote2Data searchs
         */

        /**
         * Constructs a new Quote2Data.
         * @memberof quote2
         * @classdesc Represents a Quote2Data.
         * @implements IQuote2Data
         * @constructor
         * @param {quote2.IQuote2Data=} [properties] Properties to set
         */
        function Quote2Data(properties) {
            this.searchs = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Quote2Data code.
         * @member {number} code
         * @memberof quote2.Quote2Data
         * @instance
         */
        Quote2Data.prototype.code = 0;

        /**
         * Quote2Data msg.
         * @member {string} msg
         * @memberof quote2.Quote2Data
         * @instance
         */
        Quote2Data.prototype.msg = "";

        /**
         * Quote2Data type.
         * @member {string} type
         * @memberof quote2.Quote2Data
         * @instance
         */
        Quote2Data.prototype.type = "";

        /**
         * Quote2Data recognize.
         * @member {string} recognize
         * @memberof quote2.Quote2Data
         * @instance
         */
        Quote2Data.prototype.recognize = "";

        /**
         * Quote2Data searchs.
         * @member {Array.<quote2.ISearch>} searchs
         * @memberof quote2.Quote2Data
         * @instance
         */
        Quote2Data.prototype.searchs = $util.emptyArray;

        /**
         * Creates a new Quote2Data instance using the specified properties.
         * @function create
         * @memberof quote2.Quote2Data
         * @static
         * @param {quote2.IQuote2Data=} [properties] Properties to set
         * @returns {quote2.Quote2Data} Quote2Data instance
         */
        Quote2Data.create = function create(properties) {
            return new Quote2Data(properties);
        };

        /**
         * Encodes the specified Quote2Data message. Does not implicitly {@link quote2.Quote2Data.verify|verify} messages.
         * @function encode
         * @memberof quote2.Quote2Data
         * @static
         * @param {quote2.IQuote2Data} message Quote2Data message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Quote2Data.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.type);
            if (message.recognize != null && Object.hasOwnProperty.call(message, "recognize"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.recognize);
            if (message.searchs != null && message.searchs.length)
                for (var i = 0; i < message.searchs.length; ++i)
                    $root.quote2.Search.encode(message.searchs[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Quote2Data message, length delimited. Does not implicitly {@link quote2.Quote2Data.verify|verify} messages.
         * @function encodeDelimited
         * @memberof quote2.Quote2Data
         * @static
         * @param {quote2.IQuote2Data} message Quote2Data message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Quote2Data.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Quote2Data message from the specified reader or buffer.
         * @function decode
         * @memberof quote2.Quote2Data
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {quote2.Quote2Data} Quote2Data
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Quote2Data.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.quote2.Quote2Data();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        message.type = reader.string();
                        break;
                    }
                case 4: {
                        message.recognize = reader.string();
                        break;
                    }
                case 11: {
                        if (!(message.searchs && message.searchs.length))
                            message.searchs = [];
                        message.searchs.push($root.quote2.Search.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Quote2Data message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof quote2.Quote2Data
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {quote2.Quote2Data} Quote2Data
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Quote2Data.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Quote2Data message.
         * @function verify
         * @memberof quote2.Quote2Data
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Quote2Data.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.recognize != null && message.hasOwnProperty("recognize"))
                if (!$util.isString(message.recognize))
                    return "recognize: string expected";
            if (message.searchs != null && message.hasOwnProperty("searchs")) {
                if (!Array.isArray(message.searchs))
                    return "searchs: array expected";
                for (var i = 0; i < message.searchs.length; ++i) {
                    var error = $root.quote2.Search.verify(message.searchs[i]);
                    if (error)
                        return "searchs." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Quote2Data message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof quote2.Quote2Data
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {quote2.Quote2Data} Quote2Data
         */
        Quote2Data.fromObject = function fromObject(object) {
            if (object instanceof $root.quote2.Quote2Data)
                return object;
            var message = new $root.quote2.Quote2Data();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.type != null)
                message.type = String(object.type);
            if (object.recognize != null)
                message.recognize = String(object.recognize);
            if (object.searchs) {
                if (!Array.isArray(object.searchs))
                    throw TypeError(".quote2.Quote2Data.searchs: array expected");
                message.searchs = [];
                for (var i = 0; i < object.searchs.length; ++i) {
                    if (typeof object.searchs[i] !== "object")
                        throw TypeError(".quote2.Quote2Data.searchs: object expected");
                    message.searchs[i] = $root.quote2.Search.fromObject(object.searchs[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Quote2Data message. Also converts values to other types if specified.
         * @function toObject
         * @memberof quote2.Quote2Data
         * @static
         * @param {quote2.Quote2Data} message Quote2Data
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Quote2Data.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.searchs = [];
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.type = "";
                object.recognize = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.recognize != null && message.hasOwnProperty("recognize"))
                object.recognize = message.recognize;
            if (message.searchs && message.searchs.length) {
                object.searchs = [];
                for (var j = 0; j < message.searchs.length; ++j)
                    object.searchs[j] = $root.quote2.Search.toObject(message.searchs[j], options);
            }
            return object;
        };

        /**
         * Converts this Quote2Data to JSON.
         * @function toJSON
         * @memberof quote2.Quote2Data
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Quote2Data.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Quote2Data
         * @function getTypeUrl
         * @memberof quote2.Quote2Data
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Quote2Data.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/quote2.Quote2Data";
        };

        return Quote2Data;
    })();

    quote2.Pingpong = (function() {

        /**
         * Properties of a Pingpong.
         * @memberof quote2
         * @interface IPingpong
         * @property {string|null} [id] Pingpong id
         * @property {number|Long|null} [pingTime] Pingpong pingTime
         */

        /**
         * Constructs a new Pingpong.
         * @memberof quote2
         * @classdesc Represents a Pingpong.
         * @implements IPingpong
         * @constructor
         * @param {quote2.IPingpong=} [properties] Properties to set
         */
        function Pingpong(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Pingpong id.
         * @member {string} id
         * @memberof quote2.Pingpong
         * @instance
         */
        Pingpong.prototype.id = "";

        /**
         * Pingpong pingTime.
         * @member {number|Long} pingTime
         * @memberof quote2.Pingpong
         * @instance
         */
        Pingpong.prototype.pingTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new Pingpong instance using the specified properties.
         * @function create
         * @memberof quote2.Pingpong
         * @static
         * @param {quote2.IPingpong=} [properties] Properties to set
         * @returns {quote2.Pingpong} Pingpong instance
         */
        Pingpong.create = function create(properties) {
            return new Pingpong(properties);
        };

        /**
         * Encodes the specified Pingpong message. Does not implicitly {@link quote2.Pingpong.verify|verify} messages.
         * @function encode
         * @memberof quote2.Pingpong
         * @static
         * @param {quote2.IPingpong} message Pingpong message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Pingpong.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.pingTime != null && Object.hasOwnProperty.call(message, "pingTime"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.pingTime);
            return writer;
        };

        /**
         * Encodes the specified Pingpong message, length delimited. Does not implicitly {@link quote2.Pingpong.verify|verify} messages.
         * @function encodeDelimited
         * @memberof quote2.Pingpong
         * @static
         * @param {quote2.IPingpong} message Pingpong message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Pingpong.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Pingpong message from the specified reader or buffer.
         * @function decode
         * @memberof quote2.Pingpong
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {quote2.Pingpong} Pingpong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Pingpong.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.quote2.Pingpong();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.pingTime = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Pingpong message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof quote2.Pingpong
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {quote2.Pingpong} Pingpong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Pingpong.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Pingpong message.
         * @function verify
         * @memberof quote2.Pingpong
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Pingpong.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.pingTime != null && message.hasOwnProperty("pingTime"))
                if (!$util.isInteger(message.pingTime) && !(message.pingTime && $util.isInteger(message.pingTime.low) && $util.isInteger(message.pingTime.high)))
                    return "pingTime: integer|Long expected";
            return null;
        };

        /**
         * Creates a Pingpong message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof quote2.Pingpong
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {quote2.Pingpong} Pingpong
         */
        Pingpong.fromObject = function fromObject(object) {
            if (object instanceof $root.quote2.Pingpong)
                return object;
            var message = new $root.quote2.Pingpong();
            if (object.id != null)
                message.id = String(object.id);
            if (object.pingTime != null)
                if ($util.Long)
                    (message.pingTime = $util.Long.fromValue(object.pingTime)).unsigned = false;
                else if (typeof object.pingTime === "string")
                    message.pingTime = parseInt(object.pingTime, 10);
                else if (typeof object.pingTime === "number")
                    message.pingTime = object.pingTime;
                else if (typeof object.pingTime === "object")
                    message.pingTime = new $util.LongBits(object.pingTime.low >>> 0, object.pingTime.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a Pingpong message. Also converts values to other types if specified.
         * @function toObject
         * @memberof quote2.Pingpong
         * @static
         * @param {quote2.Pingpong} message Pingpong
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Pingpong.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.pingTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.pingTime = options.longs === String ? "0" : 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.pingTime != null && message.hasOwnProperty("pingTime"))
                if (typeof message.pingTime === "number")
                    object.pingTime = options.longs === String ? String(message.pingTime) : message.pingTime;
                else
                    object.pingTime = options.longs === String ? $util.Long.prototype.toString.call(message.pingTime) : options.longs === Number ? new $util.LongBits(message.pingTime.low >>> 0, message.pingTime.high >>> 0).toNumber() : message.pingTime;
            return object;
        };

        /**
         * Converts this Pingpong to JSON.
         * @function toJSON
         * @memberof quote2.Pingpong
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Pingpong.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Pingpong
         * @function getTypeUrl
         * @memberof quote2.Pingpong
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Pingpong.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/quote2.Pingpong";
        };

        return Pingpong;
    })();

    return quote2;
})();

module.exports = $root;
