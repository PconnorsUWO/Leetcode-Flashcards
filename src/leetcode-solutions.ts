import { LeetCode, Credential } from "leetcode-query";
import * as fs from "fs/promises"; // Use the promise-based API for better async handling
import * as dotenv from "dotenv";

// Load environment variables from .env file
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

    // Fetch submissions with pagination parameters as needed
    const submissions = await leetcode.submissions({ limit: 2000, offset: 0 });
    console.log("Total submissions fetched:", submissions.length);

    // Filter for accepted submissions
    const acceptedSubmissions = submissions.filter(
      (submission) => submission.statusDisplay === "Accepted"
    );
    console.log("Total accepted submissions:", acceptedSubmissions.length);

    // Create a map to store the most recent submission for each problem
    const mostRecentSubmissionsMap = new Map<string, typeof submissions[0]>();

    acceptedSubmissions.forEach((submission) => {
      const { titleSlug, timestamp } = submission;
      const existingSubmission = mostRecentSubmissionsMap.get(titleSlug);

      if (!existingSubmission || timestamp > existingSubmission.timestamp) {
        mostRecentSubmissionsMap.set(titleSlug, submission);
      }
    });

    // Convert the map to an array
    const mostRecentSubmissions = Array.from(mostRecentSubmissionsMap.values());
    console.log(
      "Most recent accepted submissions per problem:",
      mostRecentSubmissions.length
    );

    // Define the output JSON structure with a summary at the top
    const outputData = {
      summary: {
        total_submissions_fetched: submissions.length,
        total_accepted_submissions: acceptedSubmissions.length,
        total_unique_solved_problems: mostRecentSubmissions.length,
        generated_at: new Date().toISOString(), // Timestamp of when the data was generated
      },
      most_recent_accepted_submissions: mostRecentSubmissions.map((submission) => ({
        title: submission.title,
        titleSlug: submission.titleSlug,
        timestamp: submission.timestamp,
        language: submission.lang,
        url: submission.url,
        // Add any other relevant fields you wish to include
      })),
    };

    // Define the output file path
    const outputFilePath = "solved_problems.json";

    // Convert the result to a JSON string with pretty formatting
    const resultString = JSON.stringify(outputData, null, 2);

    // Save the result to a JSON file asynchronously
    await fs.writeFile(outputFilePath, resultString, "utf8");

    console.log(`Most recent accepted submissions saved to ${outputFilePath}`);
    // Optionally, you can print a summary or specific details instead of the entire JSON
    // console.log(JSON.stringify(outputData, null, 2));
  } catch (error) {
    console.error("Error running the script:", error);
  }
}

main();
