"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTestGroq() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/groq-test");
      const data: { message: string } = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Fetch failed";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Flux Lighting AI</h1>
      <p>Click the button below to test the Groq integration.</p>

      <p style={{ marginTop: "0.5rem" }}>
        <Link href="/submittal" style={{ color: "#2563eb", textDecoration: "underline" }}>
          Go to Submittal Binder AI
        </Link>
      </p>

      <button
        onClick={handleTestGroq}
        disabled={loading}
        style={{
          padding: "0.6rem 1.2rem",
          fontSize: "1rem",
          cursor: loading ? "wait" : "pointer",
          marginTop: "1rem",
        }}
      >
        {loading ? "Calling Groq..." : "Test Groq"}
      </button>

      {message && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: "8px",
          }}
        >
          <strong>Response:</strong>
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
          }}
        >
          <strong>Error:</strong>
          <p>{error}</p>
        </div>
      )}
    </main>
  );
}
