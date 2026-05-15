'use client';

import { useState } from 'react';

export default function DangerZoneCard() {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="rounded-2xl border border-rose-300/40 bg-rose-500/10 p-4">
      <h4 className="text-sm font-semibold text-rose-100">Danger Zone</h4>
      <p className="mt-1 text-xs text-rose-100/80">Deleting your account is permanent and removes profile, schemes, and saved export records.</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setConfirmingDelete(true)} className="rounded-lg border border-rose-300/60 px-3 py-1.5 text-xs text-rose-100">
          Delete account
        </button>
      </div>

      {confirmingDelete ? (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/70 p-4" role="presentation" onClick={() => setConfirmingDelete(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="delete-account-title" aria-describedby="delete-account-description" className="w-full max-w-sm rounded-2xl border border-white/20 bg-slate-900 p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <p id="delete-account-title" className="text-sm font-semibold text-white">Are you sure you want to delete your account?</p>
            <p id="delete-account-description" className="mt-1 text-xs text-white/80">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-lg border border-white/30 px-3 py-1 text-xs text-white hover:bg-white/10">Cancel</button>
              <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-lg border border-rose-300/60 bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700">Confirm delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
