'use client';
import React from 'react';
import { Icon } from '../icons';

const STEPS: { icon: keyof typeof Icon; title: string; sub: string }[] = [
  { icon: 'search', title: 'Choose', sub: 'Curated premium products' },
  { icon: 'bag', title: 'We Pack', sub: 'With care & secure packaging' },
  { icon: 'truckFast', title: 'We Deliver', sub: 'Safe, fast & reliable' },
  { icon: 'sprout', title: 'You Grow', sub: 'Happy plants, happy you' },
];

export function HowEffortless(props: any) {
  return (
    <section className="bg-[#F2EFE5] py-12 lg:py-16">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[0.7fr_2fr]">
          {/* Left stacked label */}
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#12281A]">
              How We
            </p>
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#C9A24B]">
              Make Green
            </p>
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#12281A]">
              Effortless
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {STEPS.map((step) => {
              const StepIcon = Icon[step.icon];
              return (
              <div key={step.title} className="min-w-0">
                <div className="grid h-12 w-12 place-items-center rounded-lg border border-[#C9A24B]/40 text-[#C9A24B]">
                  <StepIcon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-[13px] font-bold text-[#12281A]">{step.title}</p>
                <p className="mt-1 text-[11px] text-stone-500">{step.sub}</p>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowEffortless;
