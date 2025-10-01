// utils/resetUsers.ts
import clientPromise from "../../lib/mongodb.ts";
export async function resetAllUsers() {
    try {
        const client = await clientPromise;
        const db = client.db("EPL2025");
        const updateResult = await db.collection("users").updateMany({}, // match all users
        {
            $set: {
                score: 0,
                correctScores: 0,
                correctOutcomes: 0,
                position: 0,
                previousPosition: 0,
            },
        });
        console.log(`Reset ${updateResult.modifiedCount} users.`);
        return updateResult.modifiedCount;
    }
    catch (error) {
        console.error("Error resetting users:", error);
        throw error;
    }
}
// npx ts-node scripts/resetUsers.ts
// node scripts/resetUsers.mts
