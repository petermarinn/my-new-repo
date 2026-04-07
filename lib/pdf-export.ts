import { Fixture } from "./types";

/**
 * Opens a print-friendly window with the submittal binder summary and
 * triggers the browser print dialog so the user can save as PDF.
 */
export function printBinderPDF(
  projectTitle: string,
  clientName: string,
  projectDate: string,
  fixtures: Fixture[]
) {
  const displayDate = projectDate
    ? new Date(projectDate + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const tableRows = fixtures
    .map(
      (f) => `
    <tr>
      <td>${esc(f.tag)}</td>
      <td>${esc(f.manufacturer)}</td>
      <td>${esc(f.model)}</td>
      <td>${esc(f.description)}</td>
      <td>${esc(f.lumens)}</td>
      <td>${esc(f.wattage)}</td>
      <td>${esc(f.cct)}</td>
      <td>${esc(f.voltage)}</td>
      <td>${esc(f.mounting)}</td>
      <td>${f.quantity ?? ""}</td>
      <td>${esc(f.notes)}</td>
    </tr>`
    )
    .join("");

  const clientLine = clientName ? `<p class="meta">Client: ${esc(clientName)}</p>` : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Submittal Binder - ${esc(projectTitle)}</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 2rem; color: #111; }
  h1 { margin-bottom: 0.25rem; }
  .meta { color: #555; margin-bottom: 0.25rem; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 1rem; }
  th, td { border: 1px solid #ccc; padding: 4px 6px; text-align: left; }
  th { background: #f3f4f6; }
  @media print {
    body { margin: 0.5in; }
    button { display: none; }
  }
</style>
</head>
<body>
  <h1>${esc(projectTitle || "Submittal Binder")}</h1>
  ${clientLine}
  <p class="meta">${displayDate} &mdash; ${fixtures.length} fixture(s)</p>
  <table>
    <thead>
      <tr>
        <th>Tag</th><th>Manufacturer</th><th>Model</th><th>Description</th>
        <th>Lumens</th><th>Wattage</th><th>CCT</th><th>Voltage</th>
        <th>Mounting</th><th>Qty</th><th>Notes</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup blocked. Please allow popups for this site to export PDF.");
    return;
  }
  w.document.write(html);
  w.document.close();
  // Give the browser a moment to render before printing
  setTimeout(() => w.print(), 400);
}

function esc(val?: string): string {
  if (!val) return "";
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
