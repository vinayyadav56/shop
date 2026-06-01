import { FadeUp } from '../motion';
import { Icon } from '../icons';
import type { PromiseItem } from '../verticals';

export function PromiseBand({ items }: { items: PromiseItem[] }) {
  return (
    <section className="bg-forest py-14 text-white sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-3">
        {items.map((b, i) => {
          const I = Icon[b.icon];
          return (
            <FadeUp key={b.t} delay={i * 0.08}>
              <div className="flex flex-col gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-goldlight">
                  <I className="h-7 w-7" />
                </span>
                <h3 className="font-heading text-xl font-bold">{b.t}</h3>
                <p className="text-sm leading-6 text-white/70">{b.d}</p>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </section>
  );
}
