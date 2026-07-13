import {join, dirname} from 'node:path';
import {readdir} from 'node:fs/promises';
import {findUp} from 'find-up';
import picomatch from 'picomatch';

const one = (f) => (a) => f(a);
const joinCwd = (a) => (b) => join(a, b);

export const readPackageWorkspaces = async (overrides = {}) => {
    const {
        findPackage = findUp,
        readPackage = importJson,
    } = overrides;
    
    const name = await findPackage('package.json');
    
    if (!name)
        return [
            '',
            [],
        ];
    
    const dir = `${dirname(name)}/`;
    const {workspaces = []} = await readPackage(name);
    
    return [dir, workspaces];
};

const importJson = async (name) => {
    return await import(name, {
        with: {
            type: 'json',
        },
    });
};

export async function parseDirectoryList(pattern, dir, workspaces, overrides = {}) {
    const {
        readDirectories = readdir,
    } = overrides;
    
    const dirs = [];
    
    const match = picomatch(pattern, {
        matchBase: true,
    });
    
    for (const workspace of workspaces) {
        const directories = await readDirectories(`./${workspace}`);
        const currentList = directories
            .filter(one(match))
            .map(joinCwd(dir));
        
        dirs.push(...currentList);
    }
    
    return dirs;
}
