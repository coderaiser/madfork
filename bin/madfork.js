#!/usr/bin/env node

import {execSync} from 'node:child_process';
import {readdirSync} from 'node:fs';
import process from 'node:process';
import {madfork} from '../lib/madfork.js';

const {
    cwd,
    argv,
    exit,
} = process;

await madfork(argv.slice(2), {
    cwd,
    readdirSync,
    execSync,
    log: console.log,
    logError: console.error,
    exit,
});
