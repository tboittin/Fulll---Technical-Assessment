/**
 * interface representing a rule for the fizzbuzz algorithm
 */
interface FizzBuzzRule {
    divisor: number;
    word: string;
}

/**
 * fizzbuzz algorithm implementation
 * @param limit the limit of the fizzbuzz algorithm. Default is 100.
 * @param rules which divisor should trigger the corresponding word. Default is [{ divisor: 3, word: "Fizz" }, { divisor: 5, word: "Buzz" }].
 * @returns an array of strings representing the fizzbuzz algorithm, ie. a list of numbers from 1 to limit, where each number is replaced by the corresponding word if it's a multiple of the divisor.
 */
const fizzBuzz = ({
    limit = 100,
    rules = [
        { divisor: 3, word: "Fizz" },
        { divisor: 5, word: "Buzz" },
    ] as FizzBuzzRule[]
}): string[] => {
    const result : string[] = []
    for (let i = 1; i <= limit; i++) {
        let output = ""
        rules.forEach(rule => {
            if (i % rule.divisor === 0) {
                output += rule.word
            }
        })
        result.push(output || i.toString())
    }
    return result
}

console.log(fizzBuzz({}))
export default fizzBuzz
