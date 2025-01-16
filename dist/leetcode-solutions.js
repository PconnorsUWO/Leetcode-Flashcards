"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const leetcode_query_1 = require("leetcode-query");
const fs = __importStar(require("fs/promises")); // Use the promise-based API for better async handling
const dotenv = __importStar(require("dotenv"));
// Load environment variables from .env file
dotenv.config();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Retrieve the LeetCode session cookie from environment variables
            const sessionCookie = process.env.LEETCODE_SESSION_COOKIE;
            if (!sessionCookie) {
                throw new Error("LeetCode session cookie not found in .env file.");
            }
            // Initialize credentials
            const credential = new leetcode_query_1.Credential();
            yield credential.init(sessionCookie);
            // Initialize LeetCode client
            const leetcode = new leetcode_query_1.LeetCode(credential);
            // Fetch submissions with pagination parameters as needed
            const submissions = yield leetcode.submissions({ limit: 2000, offset: 0 });
            console.log("Total submissions fetched:", submissions.length);
            // Filter for accepted submissions
            const acceptedSubmissions = submissions.filter((submission) => submission.statusDisplay === "Accepted");
            console.log("Total accepted submissions:", acceptedSubmissions.length);
            // Create a map to store the most recent submission for each problem
            const mostRecentSubmissionsMap = new Map();
            acceptedSubmissions.forEach((submission) => {
                const { titleSlug, timestamp } = submission;
                const existingSubmission = mostRecentSubmissionsMap.get(titleSlug);
                if (!existingSubmission || timestamp > existingSubmission.timestamp) {
                    mostRecentSubmissionsMap.set(titleSlug, submission);
                }
            });
            // Convert the map to an array
            const mostRecentSubmissions = Array.from(mostRecentSubmissionsMap.values());
            console.log("Most recent accepted submissions per problem:", mostRecentSubmissions.length);
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
            yield fs.writeFile(outputFilePath, resultString, "utf8");
            console.log(`Most recent accepted submissions saved to ${outputFilePath}`);
            // Optionally, you can print a summary or specific details instead of the entire JSON
            // console.log(JSON.stringify(outputData, null, 2));
        }
        catch (error) {
            console.error("Error running the script:", error);
        }
    });
}
main();
