import help from '../help.json' with {
    type: 'json',
};

const {entries} = Object;

export const getHelp = () => {
    const result = [
        'Usage: madfork [options] [command]',
        'Options:',
    ];
    
    for (const [name, description] of entries(help)) {
        result.push(`  ${name} ${description}`);
    }
    
    return result.join('\n');
};
