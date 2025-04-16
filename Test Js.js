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

// Problem 1-A: 
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
            return this; // Enable method chaining
        }
    };
}

// Problem 1-B: Immutable name implementations

//Using a class with private field for inmutability
class Person {
    #name; 

    // Private field, truly immutable from outside

    constructor(name) {
        this.#name = name;
    }

    hello() {
        console.log(`Hello ${this.#name}`);
        return this;
    }

    // Getter only, no setter to ensure the inmutability of the prop
    get name() {
        return this.#name;
    }
}


// Problem 2: Find top cities implementation
function findTopCities(cities, count = 5, options = {}) {
    // NOTE: Changed default logResults to false for performance tests
    const { caseSensitive = false, logResults = false } = options; 

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
            return a[0].localeCompare(b[0]); // Sort alphabetically if counts are equal
        })
        .slice(0, count)
        .map(([city, count]) => ({ city, count }));

    // Original logging behavior (now conditional)
    if (options.logResults === true) { // Check the passed option explicitly
        console.log("Top cities by occurrence:");
        sortedCities.forEach((item, index) => {
            console.log(`${index + 1}. ${item.city} (${item.count} occurrences)`);
        });
    }

    return sortedCities;
}

//Now i'm going to implement a cache version for improve the performance
const memorizedFindTopCities = (() => {
    const cache = new WeakMap();

    return function(cities, count = 5, options = {}) {
		
        // Ensure options object exists for stringify
        const effectiveOptions = { caseSensitive: false, logResults: false, ...options }; 
        const cacheKey = JSON.stringify({ count, options: effectiveOptions });

        if (!cache.has(cities)) {
            cache.set(cities, new Map());
        }

        const cityCache = cache.get(cities);

        if (cityCache.has(cacheKey)) {
            return cityCache.get(cacheKey);
        }

        const result = findTopCities(cities, count, {...effectiveOptions, logResults: false }); 
        cityCache.set(cacheKey, result);
        return result;
    };
})();

// Store all the test solutions
const TestSolutions = {
    // Problem 1-A: Object with hello method
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

            console.log("\nDemo method chaining:");
            greeter.hello("Alice").hello("Bob");

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

    // Problem 2: Find Top Cities (Including Performance Test)
    problem2: {
        title: "Problem 2: Find Top Cities & Performance Comparison",
        execute: () => {
            console.log("=== Executing Problem 2 ===");

            // --- Start of Integrated Performance Test Code ---

            // Test data - the original list
            const citiesList = [
                "nasville", "nasville", "los angeles", "nasville", "Madrid", "memphis", 
                "barcelona", "los angeles", "sevilla", "Madrid", "canary islands", "barcelona", 
                "Madrid", "Madrid", "nasville", "barcelona", "london", "berlin", "Madrid", 
                "nasville", "london", "Madrid", "Madrid",
            ];

            // Function to measure execution time in milliseconds
            // (Requires performance.now(), available in Node.js and modern browsers)
            function measureExecutionTime(fn, ...args) {
                // Check if performance is available
                 if (typeof performance === 'undefined' || typeof performance.now !== 'function') {
                    console.warn("performance.now() not available. Timing results may be inaccurate or fallback to Date.");
                    const start = Date.now();
                    const result = fn(...args);
                    const end = Date.now();
                     return { result, executionTime: end - start };
                 }
                const start = performance.now();
                const result = fn(...args);
                const end = performance.now();
                return { 
                    result, 
                    executionTime: end - start 
                };
            }

            // Create a larger dataset for more significant tests
            function createLargeDataset(size = 10000) {
                const cities = ["Madrid", "Barcelona", "London", "Paris", "Berlin", "Rome", "Amsterdam", 
                                "Vienna", "Brussels", "Lisbon", "Athens", "Copenhagen", "Dublin", "Oslo",
                                "Stockholm", "Helsinki", "Nasville", "Los Angeles", "New York", "Miami"];
                
                const largeList = [];
                for (let i = 0; i < size; i++) {
                    // Distribute randomly but with some bias to have favorites
                    const index = Math.floor(Math.pow(Math.random(), 2) * cities.length);
                    largeList.push(cities[index]);
                }
                
                return largeList;
            }

            // Run tests (adapted from runPerformanceTests)
            console.log("\n===== PERFORMANCE TEST =====");  
            
            // 1. Test with the original dataset
            console.log("\n>> ORIGINAL DATA (23 elements)");  
            
            // Standard - first run
            const standardResult1 = measureExecutionTime(findTopCities, citiesList, 5, { logResults: false });
            console.log(`Standard method (1st run): ${standardResult1.executionTime.toFixed(3)} ms`);  
            
            // Standard - second run (should be similar to first)
            const standardResult2 = measureExecutionTime(findTopCities, citiesList, 5, { logResults: false });
            console.log(`Standard method (2nd run): ${standardResult2.executionTime.toFixed(3)} ms`);  
            
            // Memorized - first run (includes overhead + actual calculation)
            const memorizedResult1 = measureExecutionTime(memorizedFindTopCities, citiesList, 5, { logResults: false });
            console.log(`Memorized method (1st run): ${memorizedResult1.executionTime.toFixed(3)} ms`);  
            
            // Memorized - second run (should be much faster - cache hit)
            const memorizedResult2 = measureExecutionTime(memorizedFindTopCities, citiesList, 5, { logResults: false });
            console.log(`Memorized method (2nd run): ${memorizedResult2.executionTime.toFixed(3)} ms`);  

            // 2. Test with large dataset
            const largeDataset = createLargeDataset(10000);
            console.log("\n>> LARGE DATASET (10,000 elements)");  
            
            // Standard - first run
            const largeStandardResult1 = measureExecutionTime(findTopCities, largeDataset, 5, { logResults: false });
            console.log(`Standard method (1st run): ${largeStandardResult1.executionTime.toFixed(3)} ms`);  
            
            // Standard - second run
            const largeStandardResult2 = measureExecutionTime(findTopCities, largeDataset, 5, { logResults: false });
            console.log(`Standard method (2nd run): ${largeStandardResult2.executionTime.toFixed(3)} ms`);  
            
            // Memorized - first run
            const largeMemorizedResult1 = measureExecutionTime(memorizedFindTopCities, largeDataset, 5, { logResults: false });
            console.log(`Memorized method (1st run): ${largeMemorizedResult1.executionTime.toFixed(3)} ms`);  
            
            // Memorized - second run
            const largeMemorizedResult2 = measureExecutionTime(memorizedFindTopCities, largeDataset, 5, { logResults: false });
            console.log(`Memorized method (2nd run): ${largeMemorizedResult2.executionTime.toFixed(3)} ms`);  

            // 3. Show comparative results
            console.log("\n>> COMPARATIVE RESULTS");  
            
            // Original data
            const diff1 = memorizedResult1.executionTime - standardResult1.executionTime;
            console.log("Small dataset (23 elements):");  
            // Note: First run of memorized includes calculation + caching overhead
            console.log(`- Difference in 1st run (Memorized - Standard): ${diff1.toFixed(3)} ms`);  
            
            const speedup1 = standardResult2.executionTime / memorizedResult2.executionTime;
             // Check for division by zero or non-finite results
             if (isFinite(speedup1) && memorizedResult2.executionTime > 0) {
                console.log(`- Improvement in 2nd run (Standard / Memorized): ${speedup1.toFixed(1)}x faster`);  
            } else {
                console.log("- Improvement in 2nd run: Cannot calculate (Memorized time was ~0 or non-finite)");  
            }
            
            // Large data
            const diff2 = largeMemorizedResult1.executionTime - largeStandardResult1.executionTime;
            console.log("\nLarge dataset (10,000 elements):");  
            console.log(`- Difference in 1st run (Memorized - Standard): ${diff2.toFixed(3)} ms`);  
            
            const speedup2 = largeStandardResult2.executionTime / largeMemorizedResult2.executionTime;
            if (isFinite(speedup2) && largeMemorizedResult2.executionTime > 0) {
                console.log(`- Improvement in 2nd run (Standard / Memorized): ${speedup2.toFixed(1)}x faster`);  
            } else {
                 console.log("- Improvement in 2nd run: Cannot calculate (Memorized time was ~0 or non-finite)");  
            }

            console.log("\n===== END PERFORMANCE TEST =====");  
             // --- End of Integrated Performance Test Code ---

             // Optionally, also run the original findTopCities with logging enabled for demonstration
             console.log("\n>> Example run findTopCities (logResults=true):");  
             findTopCities(citiesList, 5, { logResults: true }); // Call with logging enabled

        }
    }
};

// ===== Menu System Implementation =====

// Terminal styling helpers (ensure compatibility if running outside Node.js)
const colors = (typeof process !== 'undefined' && process.stdout && process.stdout.isTTY) ? {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    red: "\x1b[31m"
} : { // Basic fallback for non Terminal environments
    reset: "", bright: "", green: "", cyan: "", yellow: "", red: ""
};


// Main menu function
function showMenu() {
    // Use console.clear() if available (Node.js, Browser DevTools)
    if (typeof console.clear === 'function') {
      console.clear();
    }
    console.log(`${colors.bright}${colors.cyan}==============================`);
    console.log(`   JAVASCRIPT TEST MENU   `); // English
    console.log(`==============================${colors.reset}\n`);

    console.log(`${colors.yellow}Select a test to run:${colors.reset}`); // English
    console.log(`${colors.green}1.${colors.reset} ${TestSolutions.problem1A.title}`); // Titles are English
    console.log(`${colors.green}2.${colors.reset} ${TestSolutions.problem1B.title}`);
    console.log(`${colors.green}3.${colors.reset} ${TestSolutions.problem2.title}`);
    console.log(`${colors.green}4.${colors.reset} Run all tests`); // English
    console.log(`${colors.green}0.${colors.reset} Exit\n`); // English

    // Check if running in Node.js environment
    if (typeof process !== 'undefined' && process.stdin && process.stdin.setRawMode) {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question(`${colors.bright}Enter your choice (0-4): ${colors.reset}`, choice => { // English
            readline.close();
            processMenuChoice(choice);
        });
    } else {
        // Basic prompt for browser or non-interactive environments
        // Titles are already English in TestSolutions object
        const choice = prompt(`Enter your choice (0-4):\n1. ${TestSolutions.problem1A.title}\n2. ${TestSolutions.problem1B.title}\n3. ${TestSolutions.problem2.title}\n4. Run all tests\n0. Exit`); // English
        processMenuChoice(choice);
    }
}

// Process the menu selection
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
            console.log(`${colors.bright}${colors.cyan}=== RUNNING ALL TESTS ===\n${colors.reset}`); // English
            Object.values(TestSolutions).forEach((solution, index) => {
                 console.log(`\n--- Running Test #${index + 1}: ${solution.title} ---\n`); // English
                solution.execute();
                console.log("\n");
            });
            break;
        case '0':
            console.log(`${colors.bright}Exiting program. Goodbye!${colors.reset}`); // English
            // In Node.js, explicitly exit
             if (typeof process !== 'undefined' && process.exit) {
                 process.exit();
             }
            return; // In browser, just stop execution here
        default:
            console.log(`${colors.red}Invalid choice. Please try again.${colors.reset}`); // English
    }

    // Prompt to return to the menu (slightly different approach for Node vs Browser)
     if (typeof process !== 'undefined' && process.stdin && process.stdin.setRawMode) {
        console.log(`\n${colors.yellow}Press Enter to return to the menu...${colors.reset}`); // English
         // In Node.js, wait for any key press (specifically Enter)
         const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
         rl.question('', () => { // No prompt text needed here
             rl.close();
             showMenu();
         });
     } else if (typeof window !== 'undefined') {
         // In browser, use a timeout and log message as direct key press wait is harder
         console.log("\nReturning to menu prompt shortly (or manually call showMenu())..."); // English
         setTimeout(showMenu, 3000); // Return after 3 seconds
     } else {
          // Fallback for other environments
          console.log("\nTest complete. Restart script to see menu again."); // English
     }
}


// Start the menu system appropriately
 if (typeof window !== 'undefined') {
     // Browser environment: Make functions globally accessible for console execution
     console.log("Running in Browser environment."); // English
     console.log("Call showMenu() to display the menu."); // English
     console.log("Or execute tests directly, e.g., TestSolutions.problem2.execute()"); // English
     window.TestSolutions = TestSolutions;
     window.showMenu = showMenu;
     // Optionally show menu immediately
     // showMenu(); 
 } else if (typeof process !== 'undefined' && process.versions && process.versions.node) {
     // Node.js environment: Start the interactive menu
     console.log("Running in Node.js environment."); // English
     showMenu();
 } else {
     // Other environment (e.g., basic script runner)
     console.log("Unknown environment. Running all tests by default."); // English
     // Default action: Run all tests if environment is unclear
      Object.values(TestSolutions).forEach((solution, index) => {
         console.log(`\n--- Running Test #${index + 1}: ${solution.title} ---\n`); // English
         solution.execute();
         console.log("\n");
      });
 }