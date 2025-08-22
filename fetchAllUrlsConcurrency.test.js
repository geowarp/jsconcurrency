import { fetchAllUrlsConcurrency } from "./fetchAllUrlsConcurrency.js";
import { jest, describe, test, expect } from '@jest/globals';

function makeFetchMock(delaysMs) {
  let inFlight = 0;
  let peak = 0;

  const mock = jest.fn((url) => {
    const i = Number(String(url).split("-").pop());
    inFlight++;
    peak = Math.max(peak, inFlight);

    return new Promise((resolve) => {
      setTimeout(() => {
        inFlight--;
        resolve(`res-${i}`);
      }, delaysMs[i] ?? 0);
    });
  });

  return { mock, getPeak: () => peak, getInFlight: () => inFlight };
}

describe("fetchAllUrlsConcurrency (Jest)", () => {
  test("returns results in the same order as URLs", async () => {
    const urls = ["url-0", "url-1", "url-2", "url-3", "url-4"];
    const delays = [50, 10, 10, 10, 10];
    const { mock } = makeFetchMock(delays);

    const out = await fetchAllUrlsConcurrency(urls, 2, mock);
    expect(out).toEqual(["res-0", "res-1", "res-2", "res-3", "res-4"]);
    expect(mock).toHaveBeenCalledTimes(urls.length);
  });

  test("does not exceed MAX_CONCURRENCY", async () => {
    const urls = ["url-0", "url-1", "url-2", "url-3", "url-4", "url-5"];
    const delays = [40, 5, 5, 10, 10, 10];
    const { mock, getPeak } = makeFetchMock(delays);

    await fetchAllUrlsConcurrency(urls, 2, mock);
    expect(getPeak()).toBeLessThanOrEqual(2);
    expect(mock).toHaveBeenCalledTimes(urls.length);
  });

  test("handles maxConcurrency >= urls.length", async () => {
    const urls = ["url-0", "url-1", "url-2"];
    const delays = [5, 5, 5];
    const { mock, getPeak } = makeFetchMock(delays);

    const out = await fetchAllUrlsConcurrency(urls, 10, mock);
    expect(out).toEqual(["res-0", "res-1", "res-2"]);
    expect(getPeak()).toBeLessThanOrEqual(urls.length);
  });

  test("handles empty input", async () => {
    const out = await fetchAllUrlsConcurrency([], 3, jest.fn());
    expect(out).toEqual([]);
  });

  test("throws on non-array input", async () => {
    // @ts-expect-error – intentional
    await expect(fetchAllUrlsConcurrency(null, 2, jest.fn())).rejects.toThrow(
      /urls must be an array/i
    );
  });

  test("treats maxConcurrency <= 0 as 1", async () => {
    const urls = ["url-0", "url-1", "url-2"];
    const delays = [1, 1, 1];
    const { mock, getPeak } = makeFetchMock(delays);

    const out = await fetchAllUrlsConcurrency(urls, 0, mock);
    expect(out).toEqual(["res-0", "res-1", "res-2"]);
    expect(getPeak()).toBeLessThanOrEqual(1);
  });
});
