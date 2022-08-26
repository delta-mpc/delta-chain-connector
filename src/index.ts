import { Command } from "commander";
import { run } from "./server";
import { config, init } from "./config";

export function main(): void {
  const program = new Command();
  program.version("0.3.0");

  program
    .command("run")
    .description("run delta chain connector")
    .action(() => {
      run(config.host, config.port);
    });

  program
    .command("init")
    .description("init config file")
    .action(() => {
      init();
    });

  program.parse();
}

if (require.main === module) {
  main();
}
