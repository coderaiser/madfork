import test, {stub} from 'supertape';
import {madfork} from '../lib/madfork.js';
import info from '../package.json' with {
    type: 'json',
};

const {version} = info;

test('madfork: version', (t) => {
    const log = stub();
    const argv = ['-v'];
    
    madfork(argv, {
        log,
    });
    
    t.calledWith(log, [`v${version}`]);
    t.end();
});

test('madfork: readdirSync', (t) => {
    const readdirSync = stub().returns([]);
    
    const argv = ['ls'];
    
    madfork(argv, {
        readdirSync,
    });
    
    t.calledWith(readdirSync, ['.']);
    t.end();
});

test('madfork: execSync', (t) => {
    const readdirSync = stub().returns(['dir']);
    const cwd = stub().returns('/home/abc');
    const argv = ['ls'];
    
    const execSync = stub();
    
    madfork(argv, {
        execSync,
        readdirSync,
        cwd,
    });
    
    const expected = ['ls', {
        stdio: [
            0,
            1,
            2,
            'pipe',
        ],
        cwd: '/home/abc/dir',
    }];
    
    t.calledWith(execSync, expected);
    t.end();
});

test('madfork: execSync: pattern: not match', (t) => {
    const readdirSync = stub().returns(['dir']);
    const cwd = stub().returns('/home/abc');
    
    const argv = [
        'ls',
        '-p',
        'hello*',
    ];
    
    const execSync = stub();
    
    madfork(argv, {
        readdirSync,
        cwd,
    });
    
    t.notCalled(execSync, 'should not call execSync');
    t.end();
});

test('madfork: execSync: pattern', (t) => {
    const readdirSync = stub().returns(['hello-world']);
    const cwd = stub().returns('/home/abc');
    const execSync = stub();
    
    const argv = [
        'ls',
        '-p',
        'hello*',
    ];
    
    madfork(argv, {
        readdirSync,
        execSync,
        cwd,
    });
    
    const expected = ['ls', {
        stdio: [
            0,
            1,
            2,
            'pipe',
        ],
        cwd: '/home/abc/hello-world',
    }];
    
    t.calledWith(execSync, expected);
    t.end();
});

test('madfork: execSync: error', (t) => {
    const readdirSync = stub().returns(['dir']);
    const execSync = stub().throws(Error('hello'));
    const cwd = stub().returns('/home/abc');
    const logError = stub();
    
    const argv = ['ls'];
    
    madfork(argv, {
        readdirSync,
        execSync,
        cwd,
        logError,
    });
    
    t.calledWith(logError, ['hello']);
    t.end();
});

test('madfork: console.log', (t) => {
    const readdirSync = stub().returns(['dir']);
    const cwd = stub().returns('/home/abc');
    const log = stub();
    
    const argv = ['ls'];
    
    madfork(argv, {
        log,
        readdirSync,
        cwd,
    });
    
    const dir = '/home/abc/dir';
    
    t.calledWith(log, [dir]);
    t.end();
});

test('madfork: no command', (t) => {
    const readdirSync = stub().returns(['dir']);
    const cwd = stub().returns('/home/abc');
    const log = stub();
    
    madfork([], {
        log,
        readdirSync,
        cwd,
    });
    
    t.calledWith(log, ['nothing to do, exit']);
    t.end();
});

test('madfork: --help', (t) => {
    const log = stub();
    
    madfork(['--help'], {
        log,
    });
    
    const [result] = log.args[0];
    
    t.match(result, 'Usage: madfork');
    t.end();
});
