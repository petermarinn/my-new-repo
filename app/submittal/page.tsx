"use client";

import { useState } from "react";
import { Fixture } from "@/lib/types";
import { downloadCSV } from "@/lib/csv-export";
import { printBinderPDF } from "@/lib/pdf-export";
import UploadPanel from "./_components/UploadPanel";
import FixtureTable from "./_components/FixtureTable";

export default function SubmittalPage() {
  const [projectTitle, setProjectTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectDate, setProjectDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Submittal Binder AI</h1>
      <p style={{ color: "#6b7280", marginTop: 0, marginBottom: "1.5rem" }}>
        Upload a lighting schedule PDF to extract fixtures, review them, and export your submittal binder.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <div style={{ flex: "1 1 240px" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Project Title
          </label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="e.g. Main Street Office Renovation"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              fontSize: "1rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Client
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Acme Corp"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              fontSize: "1rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ flex: "0 1 160px" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Date
          </label>
          <input
            type="date"
            value={projectDate}
            onChange={(e) => setProjectDate(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              fontSize: "1rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <UploadPanel onFixturesLoaded={(f) => setFixtures(f as Fixture[])} />

      <h2 style={{ marginTop: "2rem", marginBottom: "0.75rem" }}>Fixtures</h2>
      <FixtureTable fixtures={fixtures} onChange={setFixtures} />

      {fixtures.length > 0 && (
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => downloadCSV(fixtures)}
            style={{
              padding: "0.5rem 1.2rem",
              fontSize: "0.9rem",
              cursor: "pointer",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Export CSV
          </button>
          <button
            onClick={() => printBinderPDF(projectTitle, clientName, projectDate, fixtures)}
            style={{
              padding: "0.5rem 1.2rem",
              fontSize: "0.9rem",
              cursor: "pointer",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Download Binder PDF
          </button>
        </div>
      )}
    </main>
  );
}
