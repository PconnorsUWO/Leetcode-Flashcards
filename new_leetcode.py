#!/usr/bin/env python3
import genanki
import json
import random

def create_leetcode_deck(problems, deck_name="LeetCode Deck"):
    """
    Creates an Anki deck (.apkg) for LeetCode-style problems using the genanki library.

    :param problems: A list of dictionaries, where each dict must contain:
                     {
                       "question": str,
                       "difficulty": str,
                       "topics": str,
                       "examples": str,  # New field for examples
                       "code": str
                     }
    :param deck_name: The name of the Anki deck.
    :return: None (generates a .apkg file).
    """

    # 1) Initialize the deck
    #    Use a unique deck_id; generate one randomly to ensure uniqueness.
    leetcode_deck = genanki.Deck(
        deck_id=random.randrange(1 << 30, 1 << 31),
        name=deck_name
    )

    # 2) Define the Model (Note Type)
    #    The fields must match the data we want to store in each card.
    #    We'll show the question and examples on the front, and the difficulty, topics, and code on the back.
    leetcode_model = genanki.Model(
        1607392321,  # A unique Model ID (ensure it's unique to avoid conflicts)
        "LeetCodeModel_Dark_With_Examples_Front",
        fields=[
            {"name": "Question"},
            {"name": "Examples"},   # New field
            {"name": "Difficulty"},
            {"name": "Topics"},
            {"name": "Code"},
        ],
        templates=[
            {
                "name": "LeetCode Card",
                "qfmt": """
                <div style="font-family: Arial; font-size: 14px; color: #FFFFFF;">
                    <h3>{{Question}}</h3>
                    <h4>Examples:</h4>
                    <pre>{{Examples}}</pre>
                </div>
                """,
                "afmt": """
                {{FrontSide}}
                <hr id="answer">
                <div style="font-family: Arial; font-size: 14px; color: #FFFFFF;">
                    <p><strong>Difficulty:</strong> {{Difficulty}}</p>
                    <p><strong>Topics:</strong> {{Topics}}</p>
                    <h4>Solution Code:</h4>
                    <pre>{{Code}}</pre>
                </div>
                """
            }
        ],
        css="""
        .card {
          /* Dark mode styles */
          background-color: #1e1e1e;
          color: #FFFFFF;
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.5;
        }

        h3, h4 {
          color: #FFFFFF; /* Headings in white */
        }

        pre {
          background-color: #2e2e2e; /* Darker background for code and examples */
          color: #CCCCCC; /* Light gray text */
          padding: 10px;
          border-radius: 5px;
          overflow-x: auto;
          font-family: Consolas, "Courier New", monospace;
          font-size: 13px;
        }

        /* Optional Enhancements */
        .card {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adds depth */
        }

        a {
          color: #61dafb; /* Light blue for links, if used */
        }
        """
    )

    # 3) Add a Note for each problem
    #    We pass in the data as a list of dicts and convert each dict into a genanki.Note.
    for p in problems:
        # Fields must appear in the same order as declared in the model
        note_fields = [
            p.get("question", ""),
            p.get("examples", ""),   # New field
            p.get("difficulty", ""),
            p.get("topics", ""),
            p.get("code", ""),
        ]

        note = genanki.Note(
            model=leetcode_model,
            fields=note_fields
        )
        leetcode_deck.add_note(note)

    # 4) Generate a .apkg file
    #    Name the deck file appropriately
    deck_filename = f"{deck_name.replace(' ', '')}.apkg"
    genanki.Package(leetcode_deck).write_to_file(deck_filename)
    print(f"Deck generated: {deck_filename}")


if __name__ == "__main__":
    # Example usage:
    # Define a few sample problems to turn into flashcards.
    example_problems = [
        {
            "question": "Two Sum: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            "difficulty": "Easy",
            "topics": "Array, Hash Table",
            "examples": """Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]
""",
            "code": """def twoSum(nums, target):
    lookup = {}
    for i, num in enumerate(nums):
        if target - num in lookup:
            return [lookup[target - num], i]
        lookup[num] = i
"""
        },
        {
            "question": "Add Two Numbers: You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
            "difficulty": "Medium",
            "topics": "Linked List, Math",
            "examples": """Example 1:
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.

Example 2:
Input: l1 = [0], l2 = [0]
Output: [0]
""",
            "code": """class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def addTwoNumbers(l1, l2):
    carry = 0
    dummy = ListNode()
    current = dummy
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        total = val1 + val2 + carry
        carry = total // 10
        current.next = ListNode(total % 10)
        current = current.next
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    return dummy.next
"""
        }
    ]

    # Create the deck
    create_leetcode_deck(example_problems, deck_name="LeetCode Deck")
