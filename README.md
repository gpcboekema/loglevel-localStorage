NPM plugin for JS logger [loglevel](https://github.com/pimterry/loglevel) which will log all messages to localStorage

# Features
- Messages put on a stack, stack is stored entirely.
- Max stack size for logs to be stored can be set.
- You can specify prefix function which would dynamically add prefix for all log messages (app name, current user, etc.).

# Installation
- Using npm = `npm install loglevel-local-storage`

# Configuration
import `loglevel` and `loglevel-localStorage` scripts to your file first. Then configure the plugin:

##loglevelLocalStorage(logger, options)
Extend loglevel with new plugin which will send log information to the log-sever

| Param | Type | Description |
| ----- | ---- | ----------- |
| logger | <code>object</code> | loglevel instance to be extended |
| options | <code>object</code> |  |
| \[options.storeKey=<code>'loglevelLocalStorage'</code>\] | <code>string</code> | Name for the store in localStorage. |
| \[options.maxLogStackSize=<code>100</code>\] | <code>number</code> | Max stack size to store. |
| \[options.callOriginal=<code>false</code>\] | <code>Bool</code> | If set to true - original loglevel method for logging would be called |
| \[options.prefix=<code>null</code>\] | <code>string</code> \| <code>function</code> | Prefix for all log messages. Either string or function wich should return string and accept log severity and message as parameters |
| \[options.level=<code>logger.levels.WARN</code>\] | <code>string</code> \| <code>number</code> | Log level. Either string or number, See [loglevel](https://github.com/pimterry/loglevel).setLevel. |
| \[options.persistentLog=<code>false</code>\] | <code>Bool</code> | If set to true - persist log entries between instantiations of the same log stack. |

**Example**
```js
                                                
var debuglog = require('loglevel'); // import debuglog from 'loglevel';
var loglevelLocalStorage = require('../loglevel-localStorage.js'); // import loglevelLocalStorage from 'loglevel-local-storage';
 
debuglog.setLevel(1);
 
loglevelLocalStorage(debuglog, {
    level: 'info',
    prefix: function (logSev /* , ...message */) {
        var message = Array.prototype.slice.call(arguments, 1);
        return '[' + new Date().toISOString() + '] ' + logSev + ': ' + message.join(' ');
    },
    callOriginal: true,
    maxLogStackSize: 10
});
 
var foo = function () {
    var test = "123";
    debuglog.info("test", test);
};
 
foo();
 
// output console (callOriginal = true):  
// test 123
// output localStorage (see prefix function above):
// [2016-07-19T15:39:18.110Z] info: test 123
 
// ES6 example:
import debuglog from 'loglevel';
import loglevelLocalStorage from 'loglevel-local-storage';

debuglog.setLevel("DEBUG");
loglevelLocalStorage(debuglog, {
    level: 'info',
    prefix(logSev, ...args) {
        // Stringify for storage in localStorage
        const newArgs = args.map(arg => ((typeof arg === 'object' && !(arg instanceof Date)) ? JSON.stringify(arg) : arg));
        return `[${new Date().toISOString()}] ${logSev}: ${newArgs.join(' ')}`;
    },
    callOriginal: true,
    maxLogStackSize: 10,
});
 
```

**Another Prefix Example**

You may keep the log in a JSON format to be able to parse later
```js
    ...
    prefix: function (logLevel) {
        var message = Array.prototype.slice.call(arguments, 1);
        return [new Date(), logLevel, message];
    }
    ...
```
