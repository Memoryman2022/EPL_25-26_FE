import "dotenv/config";
import { resetAllUsers } from "../src/app/utils/reset-users.ts";
async function main() {
    const count = await resetAllUsers();
    console.log(`${count} users have been reset.`);
    process.exit(0);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
