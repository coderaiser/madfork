# Madfork [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/madfork.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/madfork/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/madfork/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/madfork "npm"
[BuildStatusURL]: https://travis-ci.com/coderaiser/madfork "Build Status"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/madfork?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/madfork/badge.svg?branch=master&service=github

CLI tool to run [redrun](https://github.com/coderaiser/redrun) in multiple subdirectories.

## Install

```
npm i madfork -g
```

# Usage

```
Usage: madfork [options] [command]
Options:
  -p, --pattern           apply directory pattern, defaults to '*'
  -h, --help              display this help and exit
  -v, --version           output version information and exit
```

You can, for example, run the command `ls -lha` in all directories that located in current `pwd`:

```
madfork 'ls -lha'
```

## Pattern

When you need to filter directories, you can use `-p`, `--pattern` argument:

```
madfork 'ls -lha' -p plugin-*
```

Will show content of all subdirectories.

## Related

- [redrun](https://github.com/coderaiser/redrun) - CLI tool to run multiple npm-scripts fast;
- [madrun](https://github.com/coderaiser/madrun) - CLI tool to run multiple npm-scripts in a madly comfortable way

## License

MIT
