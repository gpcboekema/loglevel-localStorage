/**
 * Created by Gbo on 7/14/2016.
 */
import {expect} from 'chai';
import sinon from 'sinon';
import debuglog from "loglevel";
import loglevelLocalStorage from '../loglevel-localStorage.js';

debuglog.setLevel(1);

loglevelLocalStorage(debuglog,{url:'https://example.com/app/log',prefix: function(logSev,message) {
    return '[' + new Date().toISOString() + '] ' + logSev + ': ' + message + '\n'
}, callOriginal: true});

describe('#logelevelLocalStorage', function() {

    let mock;

    it('should log info', function() {
        mock = sinon.mock(console);
        mock.expects('info').withExactArgs('info').once();

        debuglog.info('info');

        mock.restore();
        mock.verify();
    });
});