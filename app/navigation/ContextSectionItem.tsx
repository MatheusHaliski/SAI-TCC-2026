interface ContextSectionItemProps {
  label: string;
  isActive?: boolean;
  onSelect?: () => void;
}

export default function ContextSectionItem({ label, isActive, onSelect }: ContextSectionItemProps) {
  return (
    <li style={{ listStyle: "none" }}>
      <button
        type="button"
        onClick={onSelect}
        style={{
          width: "100%",
          borderRadius: "0.625rem",
          padding: "0.5rem 0.75rem",
          textAlign: "left",
          fontSize: "0.875rem",
          border: "none",
          cursor: "pointer",
          transition: "all 0.15s",
          fontWeight: isActive ? 700 : 500,
          background: isActive
            ? "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(219,39,119,0.10))"
            : "transparent",
          color: isActive ? "var(--primary)" : "var(--muted-foreground)",
          borderLeft: isActive ? "3px solid var(--primary)" : "3px solid transparent",
        }}
      >
        {label}
      </button>
    </li>
  );
}
