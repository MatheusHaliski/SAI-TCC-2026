interface SearchInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchInput({ placeholder, value = '', onChange }: SearchInputProps) {
  return (
    <div className="bg-white flex w-full items-center gap-2 rounded-xl border border-white/25 px-3 py-2 text-sm text-white/80 shadow-inner">
      <span aria-hidden className="text-black">
        ⌕
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-black placeholder:text-black focus:outline-none"
      />
    </div>
  );
}
