import React from 'react';

/** Shared DogmaDesk mark, kept as a single vector asset for the site and favicon. */
export const BrandMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <img
    src="/dogmadesk-mark.svg"
    alt=""
    aria-hidden="true"
    className={`h-9 w-9 shrink-0 ${className}`}
  />
);

export const BrandLockup: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <BrandMark />
    <span className="flex flex-col items-start">
      <span className="font-sans text-[17px] font-extrabold leading-none tracking-[-0.055em] text-[#0F172A]">
        Dogma<span className="text-[#D95D29]">Desk</span>
      </span>
      <span className="mt-1 text-[9px] font-bold uppercase leading-none tracking-[0.12em] text-slate-500">
        From sequence to insight
      </span>
    </span>
  </span>
);
