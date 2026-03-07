interface ContextSectionItemProps {
  label: string;
  isActive?: boolean;
}

export default function ContextSectionItem({ label, isActive }: ContextSectionItemProps) {
  return (
    <li className="list-none">
      <button
        type="button"
        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
          isActive
            ? 'bg-white text-black shadow'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        {label}
      </button>
    </li>
  );
}
