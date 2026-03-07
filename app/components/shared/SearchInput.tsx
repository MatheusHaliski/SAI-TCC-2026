interface SearchInputProps {
  placeholder: string;
}

export default function SearchInput({ placeholder }: SearchInputProps) {
  return (
    <div className="bg-white flex w-full items-center gap-2 rounded-xl border border-white/25 px-3 py-2 text-sm text-white/80 shadow-inner">
      <span aria-hidden className="text-black">
        ⌕
      </span>
      <input
        type="search"
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-black placeholder:text-black focus:outline-none"
      />
    </div>
  );
}
