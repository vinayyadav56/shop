'use client';
import React from 'react';
import { useRouter } from 'next/router';

const SYMPTOMS = ['Yellow leaves', 'Brown spots', 'Drooping'];

export function PlantDoctorCard() {
  const router = useRouter();
  return (
    <div className="px-5">
      <div className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#1f4326,#0d1f11)] p-[18px] text-white shadow-[0_8px_24px_rgba(34,48,26,0.09)]">
        <div className="absolute -left-[30px] -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(134,224,163,0.18),transparent_70%)]" />
        <div className="relative flex items-start gap-3.5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-px w-4 bg-sage-300" />
              <span className="font-hanken text-[9.5px] font-bold uppercase tracking-[0.18em] text-sage-300">Plant Doctor · AI</span>
            </div>
            <h3 className="mb-1.5 font-hanken text-[20px] font-extrabold leading-[1.08]">Why&rsquo;s my plant <span className="text-[#5FE08A]">unhappy?</span></h3>
            <p className="text-[12px] leading-[1.45] text-white/80">Snap a leaf — get an instant diagnosis and a tailored care plan.</p>
          </div>
          <div className="relative grid h-[74px] w-[74px] shrink-0 place-items-center overflow-hidden rounded-full border border-[#86E0A3]/55 bg-[radial-gradient(circle_at_35%_30%,rgba(134,224,163,0.32),rgba(20,38,22,0.45))]">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#86E0A3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V10" /><path d="M12 10c0-3.6 2.6-6.2 7-6.7C18.6 8 15.8 10 12 10Z" /><path d="M12 13c0-3-2.1-5.2-5.6-5.7C6 11.2 8.4 13 12 13Z" /></svg>
            <svg className="absolute right-[13px] top-[11px]" width="11" height="11" viewBox="0 0 24 24" fill="#86E0A3"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6Z" /></svg>
          </div>
        </div>
        <button type="button" onClick={() => router.push('/plant-doctor')} className="relative mt-3.5 inline-flex items-center gap-[7px] rounded-full bg-ds-btn px-[18px] py-[11px] font-hanken text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition hover:bg-ds-btn-hover active:scale-95">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l1.2-1.7A1 1 0 0 1 9 4.9h6a1 1 0 0 1 .8.4L17 7h2.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z" /><circle cx="12" cy="12.4" r="3.1" /></svg>
          Diagnose now
        </button>
        <div className="relative mt-3 flex flex-wrap items-center gap-[7px]">
          <span className="text-[10.5px] text-white/55">Quick check:</span>
          {SYMPTOMS.map((s) => (
            <button key={s} type="button" onClick={() => router.push('/plant-doctor')} className="rounded-full border border-[#86E0A3]/40 bg-white/10 px-[11px] py-1.5 font-hanken text-[11px] font-semibold text-white transition hover:bg-white/20 active:scale-95">{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlantDoctorCard;
