import fizzBuzz from './fizzbuzz'
import { describe, expect, test } from '@jest/globals'

/**
 * test the fizzBuzz function nominal case
 */
describe('fizzBuzz', () => {
  test('generate the 100 first elements and the expected replacements - nominal case', () => {
    const res = fizzBuzz({})
    expect(res).toHaveLength(100)
    expect(res[0]).toBe('1')
    expect(res[2]).toBe('Fizz')
    expect(res[4]).toBe('Buzz')
    expect(res[14]).toBe('FizzBuzz')
    expect(res[99]).toBe('Buzz')
  })

  test('generate the 100 first elements and the expected replacements with custom rules', () => {
    const res = fizzBuzz({
      limit: 100,
      rules: [
        { divisor: 3, word: 'Fizz' },
        { divisor: 5, word: 'Rizz' },
        { divisor: 4, word: 'Wizz' },
      ],
    })
    expect(res).toHaveLength(100)
    expect(res[0]).toBe('1')
    expect(res[2]).toBe('Fizz')
    expect(res[4]).toBe('Rizz')
    expect(res[4]).not.toBe('Buzz')
    expect(res[11]).toBe('FizzWizz')
    expect(res[11]).not.toBe('Fizz')
    expect(res[14]).toBe('FizzRizz')
    expect(res[14]).not.toBe('FizzBuzz')
    expect(res[59]).toBe('FizzRizzWizz')
    expect(res[99]).toBe('RizzWizz')
    expect(res[99]).not.toBe('Buzz')
  })

  test('generate the array with a custom limit', () => {
    const res = fizzBuzz({ limit: 5 })
    expect(res).toHaveLength(5)
    expect(res[0]).toBe('1')
    expect(res[2]).toBe('Fizz')
    expect(res[4]).toBe('Buzz')
    expect(res[14]).not.toBe('FizzBuzz')
    expect(res[99]).not.toBe('Buzz')
  })

  test('generate the array with a negative limit', () => {
    const res = fizzBuzz({ limit: -1 })
    expect(res).toHaveLength(0)
  })

  test('generate the array with a limit equal to 0', () => {
    const res = fizzBuzz({ limit: 0 })
    expect(res).toHaveLength(0)
  })
})
