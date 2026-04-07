import { Fixture } from "./types";

const COLUMNS: { key: keyof Fixture; label: string }[] = [
  { key: "tag", label: "Tag" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "model", label: "Model" },
  { key: "description", label: "Description" },
  { key: "lumens", label: "Lumens" },
  { key: "wattage", label: "Wattage" },
  { key: "cct", label: "CCT" },
  { key: "voltage", label: "Voltage" },
  { key: "mounting", label: "Mounting" },
  { key: "quantity", label: "Qty" },
  { key: "notes", label: "Notes" },
];

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function fixturesToCSV(fixtures: Fixture[]): string {
  const header = COLUMNS.map((c) => c.label).join(",");
  const rows = fixtures.map((f) =>
    COLUMNS.map((c) => escapeCSV(String(f[c.key] ?? ""))).join(",")
  );
  return [header, ...rows].join("\n");
}

export function downloadCSV(fixtures: Fixture[], filename = "submittal-binder.csv") {
  const csv = fixturesToCSV(fixtures);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
