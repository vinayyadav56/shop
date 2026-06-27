'use client';
import React from 'react';
import { useSubscription } from '@/framework/settings';

export function NewsletterSocial() {
  const [email, setEmail] = React.useState('');
  // Wire the form to the REAL newsletter endpoint — previously it just flipped a local
  // "you're on the list" flag and silently discarded the email (a trust/functional bug).
  const { mutate: subscribe, isLoading, isSubscribed } = useSubscription();

  return (
    <section className="relative overflow-hidden bg-[#16301A] text-[#E7EEE2]">
      <div className="relative z-[1] mx-auto flex max-w-7xl flex-col items-start justify-between gap-9 border-b border-[rgba(231,238,226,0.12)] px-6 py-10 sm:px-8 md:flex-row md:items-center md:gap-[56px] md:px-[64px] md:py-[50px]">
        {/* left text block */}
        <div className="min-w-0 flex-1">
          <span className="font-jost text-[12px] font-medium uppercase tracking-[0.28em] text-[#DCC07A]">
            Join the plant club
          </span>
          <h2 className="mt-[10px] font-pahserif text-[40px] font-medium leading-[1.02] tracking-[0.01em] text-[#FCFBF6]">
            Grow with us.
          </h2>
          <p className="mt-[9px] max-w-[440px] font-hanken text-[14.5px] leading-[1.5] text-[rgba(231,238,226,0.66)]">
            Plant care tips, new arrivals, and members-only offers — thoughtfully sent, never spammy.
          </p>
        </div>

        {/* right form block */}
        <div className="w-full shrink-0 md:w-[430px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim() && !isLoading) subscribe({ email: email.trim() });
            }}
            className="flex items-center gap-[10px] rounded-[14px] border border-[rgba(231,238,226,0.18)] bg-[rgba(255,255,255,0.07)] py-[6px] pl-[18px] pr-[6px]"
          >
            <i className="fa-solid fa-envelope text-[17px] text-[#B3C9A8]" aria-hidden style={{ fontSize: '17px', color: '#B3C9A8' }} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="min-w-0 flex-1 border-none bg-transparent px-0 py-[13px] font-hanken text-[15px] text-white outline-none placeholder:text-[rgba(255,255,255,0.55)]"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              disabled={isLoading}
              className="inline-flex shrink-0 items-center gap-[8px] whitespace-nowrap rounded-[10px] border-none bg-[#4E8244] px-[24px] py-[13px] font-hanken text-[14px] font-bold text-white transition hover:bg-[#3A6B33] active:scale-[0.97] disabled:opacity-60"
            >
              Subscribe
              <i className="fa-solid fa-arrow-right" aria-hidden style={{ fontSize: '12px' }} />
            </button>
          </form>
          {isSubscribed ? (
            <div className="mt-[11px] flex items-center gap-[7px] text-[12px] font-medium text-[#8FAE80]">
              <i className="fa-solid fa-check" aria-hidden style={{ fontSize: '11px' }} />
              Thanks — you’re on the list 🌿
            </div>
          ) : (
            <div className="mt-[11px] flex items-center gap-[7px] text-[12px] text-[rgba(231,238,226,0.5)]">
              <i className="fa-solid fa-lock" aria-hidden style={{ fontSize: '11px' }} />
              We respect your inbox. Unsubscribe anytime.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default NewsletterSocial;
