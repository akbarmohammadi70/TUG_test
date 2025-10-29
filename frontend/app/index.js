'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  const API_BASE_URL = "http://nginx/api";

  useEffect(() => {
    fetch(`${API_BASE_URL}/data`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(console.error);
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Next.js Frontend</h1>
      <p>Response from backend:</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
