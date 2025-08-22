// index.js
import { fetchAllUrlsConcurrency } from "./fetchAllUrlsConcurrency.js";
// If Node < v18, uncomment this:
// import fetch from "node-fetch";

async function run() {
  const urls = [
    "https://jsonplaceholder.typicode.com/todos/1",
    "https://jsonplaceholder.typicode.com/todos/2",
    "https://jsonplaceholder.typicode.com/todos/3",
    "https://jsonplaceholder.typicode.com/todos/4",
    "https://jsonplaceholder.typicode.com/todos/5",
  ];

  // If Node >=18, just call:
  const responses = await fetchAllUrlsConcurrency(urls, 5);
  // If Node <18, pass fetch explicitly:
  // const responses = await fetchAllUrlsConcurrency(urls, 2, fetch);

  // Converting the Response objects into JSON
  const data = await Promise.all(responses.map((r) => r.json()));
  console.log(data);
}

run().catch(console.error);
