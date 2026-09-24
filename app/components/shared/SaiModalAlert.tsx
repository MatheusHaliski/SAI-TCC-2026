'use client';

type SaiModalAlertProps = {
  message: string;
  onConfirm: () => void;
};

export default function SaiModalAlert({ message, onConfirm }: SaiModalAlertProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-orange-500 bg-green-100 p-6 text-center shadow-2xl text-black">
        <p className="text-base font-semibold" style={{ color: '#000' }}>{message}</p>
        <button
          onClick={onConfirm}
          className="mt-5 rounded-lg border border-orange-600 bg-orange-500 px-4 py-2 text-sm font-semibold transition hover:bg-orange-400"
          style={{ color: '#000' }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
