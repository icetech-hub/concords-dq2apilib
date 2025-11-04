/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const base = $root.base = (() => {

    /**
     * Namespace base.
     * @exports base
     * @namespace
     */
    const base = {};

    base.BaseData = (function() {

        /**
         * Properties of a BaseData.
         * @memberof base
         * @interface IBaseData
         * @property {number|null} [code] BaseData code
         * @property {string|null} [msg] BaseData msg
         * @property {string|null} [type] BaseData type
         * @property {string|null} [recognize] BaseData recognize
         */

        /**
         * Constructs a new BaseData.
         * @memberof base
         * @classdesc Represents a BaseData.
         * @implements IBaseData
         * @constructor
         * @param {base.IBaseData=} [properties] Properties to set
         */
        function BaseData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BaseData code.
         * @member {number} code
         * @memberof base.BaseData
         * @instance
         */
        BaseData.prototype.code = 0;

        /**
         * BaseData msg.
         * @member {string|null|undefined} msg
         * @memberof base.BaseData
         * @instance
         */
        BaseData.prototype.msg = null;

        /**
         * BaseData type.
         * @member {string} type
         * @memberof base.BaseData
         * @instance
         */
        BaseData.prototype.type = "";

        /**
         * BaseData recognize.
         * @member {string} recognize
         * @memberof base.BaseData
         * @instance
         */
        BaseData.prototype.recognize = "";

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * BaseData _msg.
         * @member {"msg"|undefined} _msg
         * @memberof base.BaseData
         * @instance
         */
        Object.defineProperty(BaseData.prototype, "_msg", {
            get: $util.oneOfGetter($oneOfFields = ["msg"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new BaseData instance using the specified properties.
         * @function create
         * @memberof base.BaseData
         * @static
         * @param {base.IBaseData=} [properties] Properties to set
         * @returns {base.BaseData} BaseData instance
         */
        BaseData.create = function create(properties) {
            return new BaseData(properties);
        };

        /**
         * Encodes the specified BaseData message. Does not implicitly {@link base.BaseData.verify|verify} messages.
         * @function encode
         * @memberof base.BaseData
         * @static
         * @param {base.IBaseData} message BaseData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BaseData.encode = function encode(message, writer) {
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
            return writer;
        };

        /**
         * Encodes the specified BaseData message, length delimited. Does not implicitly {@link base.BaseData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof base.BaseData
         * @static
         * @param {base.IBaseData} message BaseData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BaseData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BaseData message from the specified reader or buffer.
         * @function decode
         * @memberof base.BaseData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {base.BaseData} BaseData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BaseData.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.base.BaseData();
            while (reader.pos < end) {
                let tag = reader.uint32();
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
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BaseData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof base.BaseData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {base.BaseData} BaseData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BaseData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BaseData message.
         * @function verify
         * @memberof base.BaseData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BaseData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg")) {
                properties._msg = 1;
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            }
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.recognize != null && message.hasOwnProperty("recognize"))
                if (!$util.isString(message.recognize))
                    return "recognize: string expected";
            return null;
        };

        /**
         * Creates a BaseData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof base.BaseData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {base.BaseData} BaseData
         */
        BaseData.fromObject = function fromObject(object) {
            if (object instanceof $root.base.BaseData)
                return object;
            let message = new $root.base.BaseData();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.type != null)
                message.type = String(object.type);
            if (object.recognize != null)
                message.recognize = String(object.recognize);
            return message;
        };

        /**
         * Creates a plain object from a BaseData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof base.BaseData
         * @static
         * @param {base.BaseData} message BaseData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BaseData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.type = "";
                object.recognize = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg")) {
                object.msg = message.msg;
                if (options.oneofs)
                    object._msg = "msg";
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.recognize != null && message.hasOwnProperty("recognize"))
                object.recognize = message.recognize;
            return object;
        };

        /**
         * Converts this BaseData to JSON.
         * @function toJSON
         * @memberof base.BaseData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BaseData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BaseData
         * @function getTypeUrl
         * @memberof base.BaseData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BaseData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/base.BaseData";
        };

        return BaseData;
    })();

    return base;
})();

export { $root as default };
