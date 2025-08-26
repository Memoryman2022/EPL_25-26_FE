import "dotenv/config";
import { resetAllPredictions } from "../src/app/utils/reset-predictions.ts";

async function main() {
  const count = await resetAllPredictions();
  console.log(`${count} users have been reset.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
