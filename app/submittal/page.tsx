"use client";

import { useState } from "react";
import { Fixture } from "@/lib/types";
import { downloadCSV } from "@/lib/csv-export";
import { printBinderPDF } from "@/lib/pdf-export";
import UploadPanel from "./_components/UploadPanel";
import FixtureTable from "./_components/FixtureTable";

export default function SubmittalPage() {
  const [projectTitle, setProjectTitle] = useState("");
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>Submittal Binder AI</h1>
      <p style={{ color: "#6b7280", marginTop: 0, marginBottom: "1.5rem" }}>
        Upload a lighting schedule PDF to extract fixtures, review them, and export your submittal binder.
      </p>

      <div style={{ marginBottom: "1.5rem" }}>
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
            maxWidth: "400px",
            padding: "0.5rem 0.75rem",
            fontSize: "1rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            boxSizing: "border-box",
          }}
        />
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
            onClick={() => printBinderPDF(projectTitle, fixtures)}
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
