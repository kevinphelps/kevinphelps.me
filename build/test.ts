import { execute } from './helpers/shell.helpers';
import { bailIf, parseFlags } from './helpers/utility.helpers';

interface Options {
  coverage: boolean;
  sourcemaps: boolean;
  watch: boolean;
  e2e: boolean;
}

const defaultOptionsFn = (args: Options) => ({
  coverage: false,
  sourcemaps: args.coverage,
  watch: false,
  e2e: !args.watch
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

bailIf(options.watch && options.e2e, '--watch and --e2e are mutually exclusive');

(async () => {
  await execute(getUnitTestCommand());

  if (options.e2e) {
    await execute('ng e2e');
  }
})();

function getUnitTestCommand() {
  const watch = options.watch ? '--watch' : '--no-watch';
  const coverage = options.coverage ? '--code-coverage' : '--no-code-coverage';
  const sourcemaps = options.sourcemaps ? '--source-map' : '--no-source-map';

  return `ng test ${watch} ${coverage} ${sourcemaps}`;
}
