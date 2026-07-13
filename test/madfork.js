import test, {stub} from 'supertape';
import {tryToCatch} from 'try-to-catch';
import {madfork} from '../lib/madfork.js';
import info from '../package.json' with {
    type: 'json',
};

const {version} = info;

test('madfork: version', async (t) => {
    const log = stub();
    const argv = ['-v'];
    
    await madfork(argv, {
        log,
    });
    
    t.calledWith(log, [`v${version}`]);
    t.end();
});

test('madfork: execSync', async (t) => {
    const readWorkspaces = stub().returns([
        '/',
        ['lib'],
    ]);
    
    const argv = ['build'];
    const execSync = stub();
    
    await madfork(argv, {
        execSync,
        readWorkspaces,
    });
    
    const expected = ['redrun build', {
        stdio: [
            0,
            1,
            2,
            'pipe',
        ],
        cwd: '/workspaces.spec.js',
    }];
    
    t.calledWith(execSync, expected);
    t.end();
});

test('madfork: execSync: pattern: not match', async (t) => {
    const readdirSync = stub().returns(['dir']);
    const cwd = stub().returns('/home/abc');
    
    const argv = [
        'ls',
        '-p',
        'hello*',
    ];
    
    const execSync = stub();
    
    await madfork(argv, {
        readdirSync,
        cwd,
    });
    
    t.notCalled(execSync, 'should not call execSync');
    t.end();
});

test('madfork: execSync: pattern', async (t) => {
    const readWorkspaces = stub().returns([
        '/home',
        ['lib'],
    ]);
    
    const execSync = stub();
    
    const argv = [
        'build',
        '-p',
        'work*',
    ];
    
    await madfork(argv, {
        execSync,
        readWorkspaces,
    });
    
    const expected = ['redrun build', {
        stdio: [
            0,
            1,
            2,
            'pipe',
        ],
        cwd: '/home/workspaces.spec.js',
    }];
    
    t.calledWith(execSync, expected);
    t.end();
});

test('madfork: execSync: error', async (t) => {
    const readWorkspaces = stub().returns([
        '/home',
        ['lib'],
    ]);
    
    const execSync = stub().throws(Error('hello'));
    const logError = stub();
    
    const argv = ['ls'];
    
    await madfork(argv, {
        execSync,
        logError,
        readWorkspaces,
    });
    
    t.calledWith(logError, ['hello']);
    t.end();
});

test('madfork: console.log', async (t) => {
    const readWorkspaces = stub().returns([
        '/home',
        ['lib'],
    ]);
    
    const log = stub();
    
    const argv = ['ls'];
    
    await madfork(argv, {
        log,
        readWorkspaces,
    });
    
    const dir = '/home/workspaces.spec.js';
    
    t.calledWith(log, [dir]);
    t.end();
});

test('madfork: workspaces: no', async (t) => {
    const cwd = stub().returns('/home/abc');
    const log = stub();
    
    const readWorkspaces = stub().returns([
        '',
        [],
    ]);
    
    const argv = ['ls'];
    
    await madfork(argv, {
        log,
        cwd,
        readWorkspaces,
    });
    
    t.notCalled(log);
    t.end();
});

test('madfork: workspaces', async (t) => {
    const cwd = stub().returns('/home/abc');
    const log = stub();
    
    const readWorkspaces = stub().returns([
        '/',
        ['packages'],
    ]);
    
    const argv = ['ls'];
    
    const [error] = await tryToCatch(madfork, argv, {
        log,
        cwd,
        readWorkspaces,
    });
    
    t.equal(error.code, 'ENOENT');
    t.end();
});

test('madfork: no command', async (t) => {
    const log = stub();
    const readWorkspaces = stub().returns([
        '/',
        ['packages'],
    ]);
    
    await madfork([], {
        log,
        readWorkspaces,
    });
    
    t.calledWith(log, ['nothing to do, exit']);
    t.end();
});

test('madfork: --help', async (t) => {
    const log = stub();
    
    await madfork(['--help'], {
        log,
    });
    
    const [result] = log.args[0];
    
    t.match(result, 'Usage: madfork');
    t.end();
});
