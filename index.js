import { fetchAllUrlsConcurrency } from "./fetchAllUrlsConcurrency.js";

async function run() {
  const urls = [
    "https://jsonplaceholder.typicode.com/todos/1",
    "https://jsonplaceholder.typicode.com/todos/2",
    "https://jsonplaceholder.typicode.com/todos/3",
    "https://jsonplaceholder.typicode.com/todos/4",
    "https://jsonplaceholder.typicode.com/todos/5",
  ];

  const responses = await fetchAllUrlsConcurrency(urls, 5);

  // Converting the Response objects into JSON
  const data = await Promise.all(responses.map((r) => r.json()));
  console.log(data);
}

run().catch(console.error);
