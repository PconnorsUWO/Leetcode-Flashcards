// filename: leetcode.ts

import * as dotenv from 'dotenv';
import { LeetCode, Credential, Problem } from 'leetcode-query';
import { convert } from 'html-to-text';
import * as fs from 'fs';

// Load environment variables from .env file
dotenv.config();

// Retrieve session and CSRF token from environment variables
const sessionCookie = process.env.LEETCODE_SESSION_COOKIE;


// Initialize credentials
const credential = new Credential();
credential.init(sessionCookie);

// Create a new LeetCode client
const leetcode = new LeetCode(credential);

// Define interfaces for structured data
interface FlashCardData {
  title: string;
  difficulty: string;
  content: string;
  exampleTestCases: TestCase[];
  hints: string[];
}

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

/**
 * Parses the example test cases string into structured TestCase objects.
 * Assumes that each test case consists of two lines: input and output.
 * Optionally handles explanations if present.
 * @param rawTestCases The raw exampleTestcases string.
 * @returns An array of TestCase objects.
 */
function parseExampleTestCases(rawTestCases: string): TestCase[] {
  const lines = rawTestCases.split('\n').map(line => line.trim()).filter(line => line !== '');
  const testCases: TestCase[] = [];

  for (let i = 0; i < lines.length; i += 2) {
    const input = lines[i];
    const output = lines[i + 1];
    const testCase: TestCase = { input, output };

    // Optional: If there's an explanation, it might follow the output
    if (lines[i + 2] && lines[i + 2].toLowerCase().includes('explanation')) {
      testCase.explanation = lines[i + 2];
      i += 1; // Skip the explanation line in the next iteration
    }

    testCases.push(testCase);
  }

  return testCases;
}

/**
 * Fetches a problem by its titleSlug and extracts flashcard data.
 * @param titleSlug The slug identifier for the problem (e.g., 'two-sum').
 * @returns A Promise that resolves to FlashCardData.
 */
async function getFlashCardData(titleSlug: string): Promise<FlashCardData | null> {
  try {
    // Fetch the problem data
    const problem: Problem = await leetcode.problem(titleSlug);

    // Extract title
    const title: string = problem.title;

    // Extract difficulty
    const difficulty: string = problem.difficulty;

    // Convert HTML content to plain text
    const content: string = convert(problem.content, {
      wordwrap: 130,
      selectors: [
        { selector: 'pre', options: { preserveNewlines: true } },
        { selector: 'code', format: 'inline' },
      ],
    });

    // Parse example test cases
    const exampleTestCases: TestCase[] = parseExampleTestCases(problem.exampleTestcases);

    // Extract hints
    const hints: string[] = problem.hints;

    // Assemble flashcard data
    const flashCardData: FlashCardData = {
      title,
      difficulty,
      content,
      exampleTestCases,
      hints,
    };

    return flashCardData;
  } catch (error) {
    console.error(`Error fetching or processing problem "${titleSlug}":`, error);
    return null;
  }
}

/**
 * Main function to execute the script.
 */
async function main() {
  const titleSlug = 'two-sum'; // Change this to fetch a different problem

  const flashCardData = await getFlashCardData(titleSlug);

  if (flashCardData) {
    console.log('--- Flash Card Data ---');
    console.log(`Title: ${flashCardData.title}`);
    console.log(`Difficulty: ${flashCardData.difficulty}`);
    console.log('\nContent:\n', flashCardData.content);
    console.log('\nExample Test Cases:');
    flashCardData.exampleTestCases.forEach((tc, index) => {
      console.log(`\nExample ${index + 1}:`);
      console.log(`Input: ${tc.input}`);
      console.log(`Output: ${tc.output}`);
      if (tc.explanation) {
        console.log(`Explanation: ${tc.explanation}`);
      }
    });
    console.log('\nHints:');
    flashCardData.hints.forEach((hint, index) => {
      console.log(`${index + 1}. ${hint}`);
    });

    // Optionally, save the flashcard data to a JSON file
    const outputPath = `flashcards/${titleSlug}-flashcard.json`;
    fs.mkdirSync('flashcards', { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(flashCardData, null, 2), 'utf-8');
    console.log(`\nFlashcard data saved to ${outputPath}`);
  }
}

// Execute the main function
main();
