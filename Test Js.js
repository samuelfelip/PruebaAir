/* TEST JS */
/*
    1. Problem 1 - (A)
    Create an Object with a "hello" method that writes "Hello <name> in the console"
*/

/*
    2. Problem 1 - (B)
    How would you make name inmutable?
    (Can write or just describe)
*/

/*
    3. Problem 2
    Write a funtion that logs the 5 cities that occur the most in the array below in
    order from the most number of occurrences to least.
*/

// ===== Test Answers =====

// --- Problem 1-A Function ---
// in this implementation i use a Factory Pattern
function createGreeter(defaultName = 'Guest') {
    if (typeof defaultName !== 'string') {
        throw new TypeError('Name must be a string');
    }
    return {
        hello(name = defaultName) {
            if (typeof name !== 'string') {
                throw new TypeError('Name must be a string');
            }
            console.log(`Hello ${name}`);
        }
    };
}

// --- Problem 1-B Function ---
class Person {
    #name;
    constructor(name) {
        this.#name = name;
    }
    hello() {
        console.log(`Hello ${this.#name}`);
        return this;
    }
    get name() {
        return this.#name;
    }
}

// --- Problem 2 Functions ---
function findTopCities(cities, count = 5, options = {}) {
    // Default logResults changed back to true for simpler demo if called
    const { caseSensitive = false, logResults = true } = options;

    if (!Array.isArray(cities)) {
        throw new TypeError('Cities must be an array');
    }
    if (typeof count !== 'number' || count < 1) {
        throw new RangeError('Count must be a positive number');
    }
    if (cities.length === 0) {
        return [];
    }

    const cityFrequency = new Map();
    cities.forEach(city => {
        if (typeof city !== 'string') return;
        const normalizedCity = caseSensitive ? city : city.toLowerCase();
        cityFrequency.set(normalizedCity, (cityFrequency.get(normalizedCity) || 0) + 1);
    });

    const sortedCities = Array.from(cityFrequency.entries())
        .sort((a, b) => {
            const countDiff = b[1] - a[1];
            if (countDiff !== 0) return countDiff;
            return a[0].localeCompare(b[0]);
        })
        .slice(0, count)
        .map(([city, count]) => ({ city, count }));

    if (logResults === true) {
        console.log("Top cities by occurrence:");
        sortedCities.forEach((item, index) => {
            console.log(`${index + 1}. ${item.city} (${item.count} occurrences)`);
        });
    }
    return sortedCities;
}


// ===== Simplified Test Solutions Structure =====

const TestSolutions = {
    problem1A: {
        title: "Problem 1-A: Object with hello method",
        execute: () => {

            console.log("=== Executing Problem 1-A ===");
            // Create the greeter
            const greeter = createGreeter("Default User");

            // Demo the functionality
            console.log("Calling greeter.hello('John'):");
            greeter.hello("John");

            console.log("\nCalling greeter.hello() with default name:");
            greeter.hello();

            return greeter;
        }
    },

    // Problem 1-B: Immutable name approaches
    problem1B: {
        title: "Problem 1-B: Immutable name approaches",
        execute: () => {
            console.log("=== Executing Problem 1-B ===");
            console.log("\n1. Using Private Class Fields (#):");
            const person1 = new Person("John");
            person1.hello();

            try {
                console.log("Trying to access private field directly (will fail):");
                console.log("Trying to change the name from John to Sam");
                person1.name = "Sam";
                console.log("Print again Jhon because it's inmutable");
                person1.hello();
            } catch (e) {
                console.log("Error: ", e.message);
            }
            console.log("\nAccessing through getter:");
            console.log(`Name via getter: ${person1.name}`);
            return { person1};
        }
    },
    problem2: {
        title: "Problem 2: Find Top Cities", // Title simplified
        execute: () => {
            console.log("\n=== Executing Problem 2 ===");
            console.log("Demonstration for findTopCities would run here.");

            const citiesList = [
                "nasville", "nasville", "los angeles", "nasville", "Madrid", "memphis", 
                "barcelona", "los angeles", "sevilla", "Madrid", "canary islands", "barcelona", 
                "Madrid", "Madrid", "nasville", "barcelona", "london", "berlin", "Madrid", 
                "nasville", "london", "Madrid", "Madrid",
            ];

            findTopCities(citiesList, 3);
        }
    }
};

// ===== Node.js Menu System Implementation (No Colors) =====

// Required for Node.js interactive input
const readline = require('readline');

// Main menu function (No Colors)
function showMenu() {
    if (typeof console.clear === 'function') {
      console.clear();
    }
    console.log("==============================");
    console.log("   JAVASCRIPT TEST MENU   ");
    console.log("==============================\n");

    console.log("Select a test to run:");
    console.log(`1. ${TestSolutions.problem1A.title}`);
    console.log(`2. ${TestSolutions.problem1B.title}`);
    console.log(`3. ${TestSolutions.problem2.title}`);
    console.log(`4. Run all tests`);
    console.log(`0. Exit\n`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(`Enter your choice (0-4): `, choice => {
        rl.close();
        processMenuChoice(choice);
    });
}

// Process the menu selection (Node.js only, No Colors)
function processMenuChoice(choice) {
    if (typeof console.clear === 'function') {
        console.clear();
    }

    switch (choice) {
        case '1':
            TestSolutions.problem1A.execute();
            break;
        case '2':
            TestSolutions.problem1B.execute();
            break;
        case '3':
            TestSolutions.problem2.execute();
            break;
        case '4':
            console.log("\n=== RUNNING ALL TESTS ===\n");
            Object.values(TestSolutions).forEach((solution, index) => {
                 console.log(`\n--- Running Test #${index + 1}: ${solution.title} ---`);
                solution.execute();
                // Add a small visual separator
                console.log("-------------------------------------\n");
            });
            console.log("=== ALL TESTS EXECUTION FINISHED ===");
            break;
        case '0':
            console.log("\nExiting program. Goodbye!");
            process.exit(); // Exit Node.js process
            // No return needed
        default:
            console.log("\nInvalid choice. Please try again.");
    }

    // Prompt to return to menu (Node.js only)
    // Ensure readline is required again if not globally available
    const rlReturn = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log(`\nPress Enter to return to the menu...`);
    rlReturn.question('', () => { // Wait for Enter press
        rlReturn.close();
        showMenu(); // Show menu again
    });
}

// ===== Start the Menu =====
console.log("Starting Node.js Test Menu...");
showMenu();