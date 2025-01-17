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
exports.openAndParseLeetCodeSubmission = openAndParseLeetCodeSubmission;
var dotenv = require("dotenv");
var playwright_extra_1 = require("playwright-extra");
var stealth = require('puppeteer-extra-plugin-stealth')();
dotenv.config(); // Loads environment variables from .env
playwright_extra_1.chromium.use(stealth);
var BASE_URL = 'https://leetcode.com';
/**
 * Opens the specified LeetCode submission page (using the session cookie from .env)
 * and returns the submission code as a string.
 */
function openAndParseLeetCodeSubmission(submissionId) {
    return __awaiter(this, void 0, void 0, function () {
        var LEETCODE_SESSION, browser, context, page, submissionUrl, htmlContent, pageDataRegex, match, dataString, jsonData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    LEETCODE_SESSION = process.env.LEETCODE_SESSION_COOKIE;
                    if (!LEETCODE_SESSION) {
                        throw new Error('LEETCODE_SESSION_COOKIE is not set in the .env file.');
                    }
                    return [4 /*yield*/, playwright_extra_1.chromium.launch({ headless: true })];
                case 1:
                    browser = _a.sent();
                    context = null;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 8, 10]);
                    return [4 /*yield*/, browser.newContext()];
                case 3:
                    // 2. Create a new context and set the authentication cookie
                    context = _a.sent();
                    return [4 /*yield*/, context.addCookies([
                            {
                                name: 'LEETCODE_SESSION',
                                value: LEETCODE_SESSION,
                                domain: 'leetcode.com',
                                path: '/',
                                httpOnly: true,
                                secure: true,
                                sameSite: 'None',
                            },
                        ])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, context.newPage()];
                case 5:
                    page = _a.sent();
                    submissionUrl = "".concat(BASE_URL, "/submissions/detail/").concat(submissionId, "/");
                    // Use a faster "waitUntil" strategy; adjust if some data isn't loaded in time
                    return [4 /*yield*/, page.goto(submissionUrl, { waitUntil: 'domcontentloaded' })];
                case 6:
                    // Use a faster "waitUntil" strategy; adjust if some data isn't loaded in time
                    _a.sent();
                    return [4 /*yield*/, page.content()];
                case 7:
                    htmlContent = _a.sent();
                    pageDataRegex = /var pageData = (\{[\s\S]*?\});/;
                    match = htmlContent.match(pageDataRegex);
                    if (!match) {
                        throw new Error('Could not find var pageData in the page HTML.');
                    }
                    dataString = match[1];
                    jsonData = new Function("return ".concat(dataString))();
                    if (!jsonData.submissionCode) {
                        throw new Error('No submission code found in page data.');
                    }
                    // 7. Return the code
                    return [2 /*return*/, jsonData.submissionCode];
                case 8: return [4 /*yield*/, browser.close()];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
