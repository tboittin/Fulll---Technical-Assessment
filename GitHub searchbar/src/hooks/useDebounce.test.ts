import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {

    beforeEach(() => {
        vi.useFakeTimers();
    });
    
    afterEach(() => {
        vi.useRealTimers();
    });
    
    it("should return the initial value immediately", () => {
        const initialValue = "initial";
        const delay = 500;
        
        const { result } = renderHook(() => useDebounce(initialValue, delay));
        
        expect(result.current).toBe(initialValue);
    });

    it("should update the debounced value only after the specified delay", () => {
        const delay = 500;
        const initialValue = "a";
        const newValue = "ab";

        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: initialValue, delay },
        });

        act(() => {
            rerender({ value: newValue, delay });
        });
        expect(result.current).toBe(initialValue);

        act(() => {
            vi.advanceTimersByTime(delay - 1);
        });
        
        expect(result.current).toBe(initialValue);

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(result.current).toBe(newValue);
    });

    it("should cancel the previous pending call if value changes before the delay", () => {
        const delay = 500;
        const initialValue = "a";
        const intermediateValue = "ab";
        const finalValue = "abc";

        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: initialValue, delay },
        });

        act(() => {
            rerender({ value: intermediateValue, delay });
            vi.advanceTimersByTime(delay / 2);
        });
        expect(result.current).toBe(initialValue);

        act(() => {
            rerender({ value: finalValue, delay });
            vi.advanceTimersByTime(delay / 2);
        });
        expect(result.current).toBe(initialValue);

        act(() => {
            vi.advanceTimersByTime(delay);
        });

        expect(result.current).toBe(finalValue);
    });
});