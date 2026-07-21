import { atom } from 'jotai';

/**
 * Checkout "Delivery Type" state (Shopping-City redesign).
 *  - 'me'           → the shopper's own saved/new address (existing flow)
 *  - 'someone_else' → a gift/recipient delivery: recipient name + phone are
 *                     REQUIRED (server-enforced too) and ride on shipping_address.
 * `saveRecipientAddress` mirrors the "save to my addresses" checkbox.
 */
export type DeliverTo = 'me' | 'someone_else';

export const deliverToAtom = atom<DeliverTo>('me');
export const recipientNameAtom = atom<string>('');
export const recipientPhoneAtom = atom<string>('');
export const saveRecipientAddressAtom = atom<boolean>(false);
