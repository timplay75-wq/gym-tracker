import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('updates value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
  });

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('persisted');
    });

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('persisted'));
  });

  it('loads value from localStorage on init', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('stored');
  });

  it('handles complex objects', () => {
    const complexObject = { name: 'Test', age: 25, active: true };
    const { result } = renderHook(() => useLocalStorage('test-key', complexObject));

    expect(result.current[0]).toEqual(complexObject);

    const updatedObject = { ...complexObject, age: 26 };
    act(() => {
      result.current[1](updatedObject);
    });

    expect(result.current[0]).toEqual(updatedObject);
    expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual(updatedObject);
  });

  it('handles arrays', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', [1, 2, 3]));

    expect(result.current[0]).toEqual([1, 2, 3]);

    act(() => {
      result.current[1]([1, 2, 3, 4]);
    });

    expect(result.current[0]).toEqual([1, 2, 3, 4]);
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json');

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('default');
  });
});
