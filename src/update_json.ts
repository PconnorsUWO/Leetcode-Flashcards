/**
 * Script to add submissionCode to the most_recent_accepted_submissions in the JSON.
 */

import { promises as fs } from 'fs';
import { openAndParseLeetCodeSubmission } from './problem_details'; // adjust path as needed

// This is just a helper function to extract the submissionId from the URL.
// Example URL: "/submissions/detail/1507423345/"
// The regex captures digits after "detail/" until the next "/".
function extractSubmissionId(url: string): string {
  const match = url.match(/detail\/(\d+)\//);
  if (!match) {
    throw new Error(`Could not extract submissionId from URL: ${url}`);
  }
  return match[1];
}

// Main function to read the JSON, update it, and (optionally) write it back to a file.
async function addSubmissionCodesToJson(filePath: string): Promise<void> {
  // 1. Read the JSON file
  const rawData = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(rawData);

  // 2. Iterate over most_recent_accepted_submissions
  for (const submission of data.most_recent_accepted_submissions) {
    // 3. Extract submissionId
    const submissionId = extractSubmissionId(submission.url);

    // 4. Call openAndParseLeetCodeSubmission(submissionId)
    const submissionCode = await openAndParseLeetCodeSubmission(submissionId);

    // 5. Add submissionCode to the current submission object
    submission.submissionCode = submissionCode;
  }

  // 6. (Optional) Write the updated JSON back to the same file or a new file
  // You can skip writing to file if you only need the updated object in memory.
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

  // 7. If you need the updated JSON in code, you can just return it instead:
  // return data;
}

// Example usage:
(async () => {
  try {
    await addSubmissionCodesToJson('solved_problems.json');
    console.log('Updated JSON successfully!');
  } catch (error) {
    console.error('Error updating JSON:', error);
  }
})();
