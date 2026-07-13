import {fileURLToPath} from 'node:url';
import {test, stub} from 'supertape';
import {readPackageWorkspaces} from './workspaces.js';

const packagePath = fileURLToPath(new URL('../package.json', import.meta.url));

test('madfork: workspaces: readPackageWorkspaces', async (t) => {
    const findPackage = stub().returns(packagePath);
    const [, workspaces] = await readPackageWorkspaces({
        findPackage,
    });
    
    const expected = [];
    
    t.deepEqual(workspaces, expected);
    t.end();
});

test('madfork: workspaces: readPackageWorkspaces: dir', async (t) => {
    const findPackage = stub().returns(packagePath);
    const [dir] = await readPackageWorkspaces({
        findPackage,
    });
    
    const expected = fileURLToPath(new URL('..', import.meta.url));
    
    t.deepEqual(dir, expected);
    t.end();
});

test('madfork: workspaces: readPackageWorkspaces: no package.json', async (t) => {
    const findPackage = stub();
    const [, workspaces] = await readPackageWorkspaces({
        findPackage,
    });
    
    const expected = [];
    
    t.deepEqual(workspaces, expected);
    t.end();
});
