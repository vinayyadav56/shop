'use client';
import React from 'react';

export function NewsletterStrip(props: any) {
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState(false);

  return (
    <section className="border-t border-[#C9A24B]/15 bg-[#0C1F13] py-6">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            aria-label="Email address"
            className="h-11 w-full rounded-md bg-[#F2EFE5] px-4 text-[13px] text-[#12281A] outline-none placeholder:text-stone-500 sm:w-[340px]"
          />
          <button
            type="submit"
            className="h-11 w-full rounded-md bg-[#C9A24B] px-6 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#12281A] transition hover:bg-[#D9BC7A] sm:w-auto"
          >
            Get My Discount
          </button>
        </form>
        {done && (
          <p className="mt-3 text-center text-[12px] font-medium text-[#C9A24B]">
            Thanks — your discount is on its way to your inbox.
          </p>
        )}
      </div>
    </section>
  );
}

export default NewsletterStrip;
