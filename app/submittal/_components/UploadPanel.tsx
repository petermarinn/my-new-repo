"use client";

import { useRef, useState, DragEvent } from "react";

interface UploadPanelProps {
  onFixturesLoaded: (fixtures: unknown[]) => void;
}

export default function UploadPanel({ onFixturesLoaded }: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setError(null);
    } else {
      setError("Please drop a PDF file.");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setStatus("Extracting text from PDF...");

    try {
      // Step 1: Parse PDF
      const formData = new FormData();
      formData.append("file", file);
      const parseRes = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });
      const parseData = await parseRes.json();

      if (!parseRes.ok) {
        throw new Error(parseData.message || "PDF parsing failed.");
      }

      setStatus("Sending to Groq for fixture extraction...");

      // Step 2: Extract fixtures via Groq
      const groqRes = await fetch("/api/groq-fixtures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: parseData.text }),
      });
      const groqData = await groqRes.json();

      if (!groqRes.ok) {
        throw new Error(groqData.message || "Fixture extraction failed.");
      }

      if (!groqData.fixtures || groqData.fixtures.length === 0) {
        setError("No fixtures were found in the PDF. Try a different file.");
        return;
      }

      setStatus(`Extracted ${groqData.fixtures.length} fixture(s).`);
      onFixturesLoaded(groqData.fixtures);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "#3b82f6" : "#d1d5db"}`,
          borderRadius: "8px",
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "#eff6ff" : "#fafafa",
          transition: "all 0.15s",
        }}
      >
        <p style={{ margin: 0, color: "#6b7280" }}>
          {file
            ? `Selected: ${file.name}`
            : "Drag & drop a PDF here, or click to select"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{
          marginTop: "1rem",
          padding: "0.6rem 1.4rem",
          fontSize: "1rem",
          cursor: !file || loading ? "not-allowed" : "pointer",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          opacity: !file || loading ? 0.6 : 1,
        }}
      >
        {loading ? "Processing..." : "Upload & Extract"}
      </button>

      {status && !error && (
        <p style={{ marginTop: "0.75rem", color: "#4b5563" }}>{status}</p>
      )}

      {error && (
        <p style={{ marginTop: "0.75rem", color: "#dc2626" }}>{error}</p>
      )}
    </div>
  );
}
