"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        marginTop: "24px",
        padding: "12px 32px",
        background: "#1a2e1a",
        color: "#faf9f6",
        fontFamily: "'Outfit', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        letterSpacing: "0.05em",
      }}
      className="print-btn"
    >
      Print Postcard
    </button>
  );
}
