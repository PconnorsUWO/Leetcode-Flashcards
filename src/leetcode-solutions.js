"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var leetcode_query_1 = require("leetcode-query");
var fs = require("fs/promises"); // Use the promise-based API for better async handling
var dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var sessionCookie, credential, leetcode, submissions, acceptedSubmissions, mostRecentSubmissionsMap_1, mostRecentSubmissions, outputData, outputFilePath, resultString, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    sessionCookie = process.env.LEETCODE_SESSION_COOKIE;
                    if (!sessionCookie) {
                        throw new Error("LeetCode session cookie not found in .env file.");
                    }
                    credential = new leetcode_query_1.Credential();
                    return [4 /*yield*/, credential.init(sessionCookie)];
                case 1:
                    _a.sent();
                    leetcode = new leetcode_query_1.LeetCode(credential);
                    return [4 /*yield*/, leetcode.submissions({ limit: 2000, offset: 0 })];
                case 2:
                    submissions = _a.sent();
                    console.log("Total submissions fetched:", submissions.length);
                    acceptedSubmissions = submissions.filter(function (submission) { return submission.statusDisplay === "Accepted"; });
                    console.log("Total accepted submissions:", acceptedSubmissions.length);
                    mostRecentSubmissionsMap_1 = new Map();
                    acceptedSubmissions.forEach(function (submission) {
                        var titleSlug = submission.titleSlug, timestamp = submission.timestamp;
                        var existingSubmission = mostRecentSubmissionsMap_1.get(titleSlug);
                        if (!existingSubmission || timestamp > existingSubmission.timestamp) {
                            mostRecentSubmissionsMap_1.set(titleSlug, submission);
                        }
                    });
                    mostRecentSubmissions = Array.from(mostRecentSubmissionsMap_1.values());
                    console.log("Most recent accepted submissions per problem:", mostRecentSubmissions.length);
                    outputData = {
                        summary: {
                            total_submissions_fetched: submissions.length,
                            total_accepted_submissions: acceptedSubmissions.length,
                            total_unique_solved_problems: mostRecentSubmissions.length,
                            generated_at: new Date().toISOString(), // Timestamp of when the data was generated
                        },
                        most_recent_accepted_submissions: mostRecentSubmissions.map(function (submission) { return ({
                            title: submission.title,
                            titleSlug: submission.titleSlug,
                            timestamp: submission.timestamp,
                            language: submission.lang,
                            url: submission.url,
                            // Add any other relevant fields you wish to include
                        }); }),
                    };
                    outputFilePath = "solved_problems.json";
                    resultString = JSON.stringify(outputData, null, 2);
                    // Save the result to a JSON file asynchronously
                    return [4 /*yield*/, fs.writeFile(outputFilePath, resultString, "utf8")];
                case 3:
                    // Save the result to a JSON file asynchronously
                    _a.sent();
                    console.log("Most recent accepted submissions saved to ".concat(outputFilePath));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error running the script:", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
