import { LeetCode, Credential } from "leetcode-query";
import * as fs from "fs/promises"; // Use the promise-based API for better async handling
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    try {
        // Retrieve the LeetCode session cookie from environment variables
        const sessionCookie = process.env.LEETCODE_SESSION_COOKIE;
        if (!sessionCookie) {
          throw new Error("LeetCode session cookie not found in .env file.");
        }
    
        // Initialize credentials
        const credential = new Credential();
        await credential.init(sessionCookie);
    
        // Initialize LeetCode client
        const leetcode = new LeetCode(credential);

        const problem = await leetcode.problem("two-sum");
        console.log("Problem details:", problem);
    }

    catch (error) {
        console.error("Error running the script:", error);
      }
}