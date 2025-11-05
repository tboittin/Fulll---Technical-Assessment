import { useEffect, useState } from "react";

/**
 * @description
 * A generic custom hook that delays updating a value until a specified time
 * has passed without the value changing.
 * 
 * This is primarily used to prevent expensive operations (like API calls in a
 * search input) from firing on every keystroke.
 *
 * @template T The generic type of the value being debounced (e.g., string, number).
 *
 * @param {T} value The value to debounce.
 * @param {number} delay The delay in milliseconds (ms) to wait before updating
 *                       the debounced value.
 *
 * @returns {T} The debounced value, which will only update after the `delay`
 *              has passed since the last change to `value`.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value]);
    return debouncedValue;
};