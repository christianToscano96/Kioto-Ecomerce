import { useState } from 'react';

interface ApiKeyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  secret?: boolean;
}

export function ApiKeyInput({ label, value, onChange, secret = false }: ApiKeyInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show || !secret ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={secret ? 'sk_live_...' : 'pk_live_...'}
        className="w-full h-10 px-3 rounded-lg border border-outline bg-white text-sm font-mono
                   focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {secret && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-sm">
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      )}
    </div>
  );
}