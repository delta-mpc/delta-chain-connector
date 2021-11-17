import { run } from "./service";
import { config } from "./config";

if (require.main === module) {
  run(config.host, config.port);
}
