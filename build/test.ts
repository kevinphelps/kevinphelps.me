import { execute } from './helpers/shell.helpers';
import { parseFlags } from './helpers/utility.helpers';

interface Options {
  coverage: boolean;
  sourcemaps: boolean;
  watch: boolean;
}

const defaultOptionsFn = (args: Options) => ({
  coverage: false,
  sourcemaps: args.coverage,
  watch: false
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

(async () => {
  const unitTestCommand = getUnitTestCommand();

  await execute(unitTestCommand);
})();

function getUnitTestCommand() {
  const watch = options.watch ? '--watch' : '--no-watch';
  const coverage = options.coverage ? '--code-coverage' : '--no-code-coverage';
  const sourcemaps = options.sourcemaps ? '--source-map' : '--no-source-map';

  return `ng test ${watch} ${coverage} ${sourcemaps}`;
}
