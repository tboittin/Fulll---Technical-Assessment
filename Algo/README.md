# Advanced FizzBuzz Generator

This project is a TypeScript implementation of the famous "FizzBuzz" algorithm, but with extended functionality.

In addition to the classic logic (replacing multiples of 3 with "Fizz" and 5 with "Buzz"), this script allows you to define **custom rules** (e.g., "Bizz" for multiples of 7) and **write the result** to an output file.

---

## 🚀 Features

*   **Classic FizzBuzz:** Runs the standard FizzBuzz logic from 1 to 100.
*   **Configurable:** Allows the user to provide a custom set of rules (divisors and words) to replace the default logic.
*   **Statically Typed:** Fully written in TypeScript for robustness and code clarity.

---

## 🛠️ Tech Stack

*   **Language:** TypeScript
*   **Environment:** Node.js
*   **Runtime:** `ts-node` (for running TypeScript directly)
*   **Dev Dependencies:** `@types/node`

---

## 📦 Installation

To use this project, you must have Node.js and npm installed.

1.  **Clone the repository** (or copy the files into a new directory)
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd [YOUR_DIRECTORY_NAME]
    ```

2.  **Initialize a Node.js project** (if not already done)
    ```bash
    npm init -y
    ```

3.  **Install dependencies**
    ```bash
    npm install --save-dev typescript ts-node @types/node
    ```

4.  **Configure TypeScript** (if not already done)
    ```bash
    npx tsc --init
    ```
    (Ensure your `tsconfig.json` is configured, e.g., with `"module": "CommonJS"`).

---

## ⚡️ Usage

The main script `fizzbuzz.ts` contains the execution logic.

### 1. Standard Execution (Classic FizzBuzz)

To run the standard FizzBuzz (rules 3="Fizz" and 5="Buzz") from 1 to 100:

```bash
npx ts-node fizzbuzz.ts
```

The script will print the result to the console.

### 2. Custom Execution

To use custom rules, **modify the `fizzbuzz.ts` file** before running it.

For example, to replace the logic with "Bizz" (for 7) and "Fuzz" (for 11):

```typescript
// In fizzbuzz.ts

import { generateFizzBuzz, saveToFile, type FizzBuzzRule } from './fizzbuzz'; // Ensure you import your functions

// 1. Define your custom rules
const customRules: FizzBuzzRule[] = [
  { divisor: 7, word: 'Bizz' },
  { divisor: 11, word: 'Fuzz' },
  { divisor: 2, word: 'Even' },
];

// 2. Define the range (e.g., 1 to 200)
const maxNumber = 200;

// 3. Call the generation function with these rules
const output = fizbuzz({ rules: customRules, limit: maxNumber });

// 4. Display the result
console.log(output);
```

Then, run the script:

```bash
npx ts-node fizzbuzz.ts
```

---

## 📁 Project Structure (Example)

```
/
├── index.ts     # Main script (entry point)
├── fizzbuzz.ts  # Contains the logic (generateFizzBuzz, saveToFile)
├── package.json
└── tsconfig.json
```