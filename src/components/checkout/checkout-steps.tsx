import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import {
  customerContactAtom,
  billingAddressAtom,
  shippingAddressAtom,
  deliveryTimeAtom,
  verifiedResponseAtom,
} from '@/store/checkout';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * Top progress stepper for checkout. Purely presentational — derives
 * done/active state from the existing checkout atoms (no logic changes).
 */
export default function CheckoutSteps() {
  const [contact] = useAtom(customerContactAtom);
  const [billing] = useAtom(billingAddressAtom);
  const [shipping] = useAtom(shippingAddressAtom);
  const [deliveryTime] = useAtom(deliveryTimeAtom);
  const [verified] = useAtom(verifiedResponseAtom);

  const steps = [
    { label: 'Contact', done: !!contact },
    { label: 'Address', done: !!billing && !!shipping },
    { label: 'Schedule', done: !!deliveryTime },
    { label: 'Verify', done: !isEmpty(verified) },
    { label: 'Payment', done: false },
  ];

  // current = first not-done step
  const currentIndex = steps.findIndex((s) => !s.done);
  const activeIndex = currentIndex === -1 ? steps.length - 1 : currentIndex;
  const doneCount = steps.filter((s) => s.done).length;
  const progress = Math.min(100, (doneCount / (steps.length - 1)) * 100);

  return (
    <div className="pa-steps" aria-label="Checkout progress">
      <div className="pa-steps-track" aria-hidden>
        <div className="pa-steps-fill" style={{ width: `${progress}%` }} />
      </div>
      {steps.map((s, i) => {
        const state = s.done ? 'done' : i === activeIndex ? 'active' : 'upcoming';
        return (
          <div className={`pa-step pa-step--${state}`} key={s.label}>
            <span className="pa-step-dot">
              {s.done ? <CheckIcon /> : <span>{i + 1}</span>}
            </span>
            <span className="pa-step-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
