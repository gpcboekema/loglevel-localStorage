var _ = require('lodash');

/**
 * @description
 * Extend loglevel with new plugin which will send log information to the log-sever
 *
 * @param {object} logger loglevel instance to be extended
 * @param {object} options
 * @param {string} [options.storeKey='loglevelLocalStorage'] Name for the store in localStorage.
 * @param {number} [options.maxLogStackSize=100] Max stack size to store.
 * @param {boolean} [options.callOriginal=false] If set to true - original loglevel method for logging would be called
 * @param {string|Function} [options.prefix=null] Prefix for all log messages. Either string or function wich should return string and accept log severity and message as parameters
 * @param {string|number} [options.level=logger.levels.WARN] Log level. Either string or number, {@see logger.setLevel}.
 * @example
 * loglevelLocalStorage(log,{level:'info',prefix: function(logSev,message) {
 *     return '[' + new Date().toISOString() + '] ' + logSev + ': ' + message;
 * }})
 */

var loglevelLocalStorage = function loglevelLocalStorage(logger, options) {
    if (!logger || !logger.methodFactory) throw new Error('loglevel instance has to be specified in order to be extended');

    var _logger = logger,
        _storeKey = options && options.storeKey || 'loglevelLocalStorage',
        _maxLogStackSize = options && options.maxLogStackSize || 100,
        _callOriginal = options && options.callOriginal || false,
        _prefix = options && options.prefix,
        _level = options && options.level || _logger.levels.WARN,
        _originalFactory = _logger.methodFactory,
        _logStack = [],
        _logStackLocalStorage = [];

    _logger.methodFactory = function (methodName, logLevel) {
        var rawMethod = _originalFactory(methodName, logLevel);

        return function (/* ...message */) {
            var args = Array.prototype.slice.call(arguments, 0);

            var message;
            if (typeof _prefix === 'string') {
                message = _prefix + args.join(' ');
            }
            else if (typeof _prefix === 'function') {
                message = _prefix.apply(null, Array.prototype.concat.apply([methodName], args));
            }
            else {
                message = methodName + ': ' + args.join(' ');
            }

            if (_callOriginal) {
                rawMethod.apply(null, arguments);
            }

            // Push to stack
            _logStack.push(message);

            // Always store a max of {_maxLogStackSize} logs
            _logStackLocalStorage = _logStack.slice(-_maxLogStackSize);

            //store to localStorage.
            _store();
        };
    };

    // Set severity level.
    _logger.setLevel(_level);

    var _storeLogStack = function _storeLogStack() {
        if (!_logStackLocalStorage.length) return;

        localStorage.setItem(_storeKey, JSON.stringify(_logStackLocalStorage));
    };

    // Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since the last time the debounced function was invoked;
    var _store = _.debounce(_storeLogStack, 250);
};

module.exports = loglevelLocalStorage;