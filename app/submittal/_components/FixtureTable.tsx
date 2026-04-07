"use client";

import { Fixture } from "@/lib/types";

interface FixtureTableProps {
  fixtures: Fixture[];
  onChange: (updated: Fixture[]) => void;
}

const COLUMNS: { key: keyof Fixture; label: string; width?: string }[] = [
  { key: "tag", label: "Tag", width: "60px" },
  { key: "manufacturer", label: "Manufacturer", width: "140px" },
  { key: "model", label: "Model", width: "140px" },
  { key: "description", label: "Description", width: "180px" },
  { key: "lumens", label: "Lumens", width: "80px" },
  { key: "wattage", label: "Wattage", width: "80px" },
  { key: "cct", label: "CCT", width: "70px" },
  { key: "voltage", label: "Voltage", width: "70px" },
  { key: "mounting", label: "Mounting", width: "100px" },
  { key: "quantity", label: "Qty", width: "50px" },
  { key: "notes", label: "Notes", width: "160px" },
];

export default function FixtureTable({ fixtures, onChange }: FixtureTableProps) {
  function handleCellChange(
    index: number,
    key: keyof Fixture,
    value: string
  ) {
    const updated = [...fixtures];
    const row = { ...updated[index] };

    if (key === "quantity") {
      const num = parseInt(value, 10);
      row.quantity = isNaN(num) ? undefined : num;
    } else if (key === "id") {
      // id is not editable
      return;
    } else {
      // All other fields are string | undefined
      (row as Record<string, unknown>)[key] = value || undefined;
    }

    updated[index] = row;
    onChange(updated);
  }

  function handleDelete(index: number) {
    const updated = fixtures.filter((_, i) => i !== index);
    onChange(updated);
  }

  function handleAddRow() {
    const newFixture: Fixture = {
      id: crypto.randomUUID(),
      manufacturer: "",
      model: "",
    };
    onChange([...fixtures, newFixture]);
  }

  if (fixtures.length === 0) {
    return (
      <p style={{ color: "#6b7280", fontStyle: "italic" }}>
        No fixtures loaded yet. Upload a lighting schedule PDF above.
      </p>
    );
  }

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            fontSize: "0.85rem",
          }}
        >
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{
                    border: "1px solid #d1d5db",
                    padding: "6px 8px",
                    background: "#f3f4f6",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    width: col.width,
                  }}
                >
                  {col.label}
                </th>
              ))}
              <th
                style={{
                  border: "1px solid #d1d5db",
                  padding: "6px 8px",
                  background: "#f3f4f6",
                  width: "40px",
                }}
              />
            </tr>
          </thead>
          <tbody>
            {fixtures.map((fixture, rowIdx) => (
              <tr key={fixture.id}>
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      border: "1px solid #e5e7eb",
                      padding: "2px",
                    }}
                  >
                    <input
                      type={col.key === "quantity" ? "number" : "text"}
                      value={String(fixture[col.key] ?? "")}
                      onChange={(e) =>
                        handleCellChange(rowIdx, col.key, e.target.value)
                      }
                      style={{
                        width: "100%",
                        border: "none",
                        padding: "4px 6px",
                        fontSize: "0.85rem",
                        background: "transparent",
                        boxSizing: "border-box",
                      }}
                    />
                  </td>
                ))}
                <td
                  style={{
                    border: "1px solid #e5e7eb",
                    padding: "2px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => handleDelete(rowIdx)}
                    title="Delete row"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#dc2626",
                      fontSize: "1rem",
                    }}
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleAddRow}
        style={{
          marginTop: "0.5rem",
          padding: "0.4rem 1rem",
          fontSize: "0.85rem",
          cursor: "pointer",
          background: "#f3f4f6",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
        }}
      >
        + Add Row
      </button>
    </div>
  );
}
