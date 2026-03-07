interface SearchInputProps {
  placeholder: string;
}

export default function SearchInput({ placeholder }: SearchInputProps) {
  return (
    <div className="sa-premium-gradient-surface-soft flex w-full items-center gap-2 rounded-xl border border-white/25 px-3 py-2 text-sm text-white/80 shadow-inner">
      <span aria-hidden className="text-base">
        ⌕
      </span>
      <input
        type="search"
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
      />
    </div>
  );
}
