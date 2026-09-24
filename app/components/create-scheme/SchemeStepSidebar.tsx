interface SchemeStepSidebarProps {
  steps: string[];
  currentStep: string;
  completedSteps: string[];
  onSelect: (step: string) => void;
}

export default function SchemeStepSidebar({ steps, currentStep, completedSteps, onSelect }: SchemeStepSidebarProps) {
  const progress = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <aside className="sa-surface-context w-full rounded-2xl border border-white/20 p-4 backdrop-blur-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-lg font-semibold" style={{ color: '#ffffff' }}>Create my Outfit Card</p>
          <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Progress {progress}%</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20 lg:max-w-[280px]">
          <div className="h-full bg-gradient-to-r from-emerald-300 to-amber-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {steps.map((step, index) => {
          const active = currentStep === step;
          const done = completedSteps.includes(step);
          return (
            <li key={step}>
              <button
                type="button"
                onClick={() => onSelect(step)}
                className="flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm"
                style={{
                  borderColor: active ? 'rgba(167,243,208,0.7)' : 'rgba(255,255,255,0.25)',
                  background: active ? '#ffffff' : 'rgba(255,255,255,0.1)',
                  color: active ? '#0f172a' : '#ffffff',
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span style={{ color: active ? '#0f172a' : '#ffffff' }}>
                  {index + 1}. {step}
                </span>
                {done ? <span style={{ color: active ? '#0f172a' : '#ffffff' }}>✓</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}