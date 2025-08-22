/**
 * Fetch all URLs with max concurrency limit.
 * Returns an array of responses in the same order as the input URLs.
 *
 * @param {string[]} urls
 * @param {number} maxConcurrency - positive integer
 * @param {(input: RequestInfo, init?: RequestInit) => Promise<any>} fetchImpl - optional (default: global fetch)
 * @returns {Promise<any[]>}
 */
export async function fetchAllUrlsConcurrency(
  urls,
  maxConcurrency,
  fetchImpl = fetch
) {
  if (!Array.isArray(urls)) throw new TypeError("urls must be an array");
  const n = Math.max(1, Math.floor(maxConcurrency || 1));
  if (urls.length === 0) return [];

  const results = new Array(urls.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const i = nextIndex++;
      if (i >= urls.length) return;
      const res = await fetchImpl(urls[i]);
      results[i] = res;
    }
  }

  const workers = Array.from({ length: Math.min(n, urls.length) }, () =>
    worker()
  );
  await Promise.all(workers);
  return results;
}
