import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import yargsParser from 'yargs-parser';
import {tryCatch} from 'try-catch';
import {getHelp} from './help.js';
import {
    parseDirectoryList,
    readPackageWorkspaces,
} from './workspaces.js';
import info from '../package.json' with {
    type: 'json',
};

const noop = () => {};

export const madfork = async (argv, overrides = {}) => {
    const {
        execSync = noop,
        log = noop,
        logError = noop,
        readWorkspaces = readPackageWorkspaces,
    } = overrides;
    
    const {
        _,
        pattern,
        version,
        help,
    } = yargsParser(argv, {
        default: {
            pattern: '*',
        },
        boolean: ['version', 'help'],
        string: ['pattern'],
        alias: {
            p: 'pattern',
            v: 'version',
            h: 'help',
        },
    });
    
    if (version)
        return log(`v${info.version}`);
    
    if (help)
        return log(getHelp());
    
    const [command] = _;
    
    if (!command)
        return log('🏝️nothing to do, exit');
    
    const [dir, workspaces] = await readWorkspaces();
    const dirs = await parseDirectoryList(pattern, dir, workspaces);
    
    const redrunBin = await getRedrunBin();
    
    for (const dir of dirs) {
        const [e] = tryCatch(execSync, `${redrunBin} ${command}`, {
            stdio: [
                0,
                1,
                2,
                'pipe',
            ],
            cwd: dir,
        });
        
        if (e) {
            logError(e.message);
            log(`🦀 ${dir}`);
            continue;
        }
        
        log(`🌿 ${dir}`);
    }
};

export async function getRedrunBin() {
    const redrunPath = await import.meta.resolve('redrun');
    return fileURLToPath(join(redrunPath, '..', '..', 'bin', 'redrun.js'));
}
