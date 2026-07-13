'use client';

/**
 * P1 STUB — only the little-state-machine helpers that framework/rest/user.ts
 * imports. P5 replaces this file with the full V1 forgot-password component
 * (these exports are verbatim from V1, so the overwrite is drop-in).
 */
import { createStore } from 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    step: 'Email' | 'Token' | 'Password';
    email: string;
    password: string;
    token: string;
  }
}

type GlobalState = {
  step: 'Email' | 'Token' | 'Password';
  email: string;
  password: string;
  token: string;
};

export const initialState: GlobalState = {
  step: 'Email',
  email: '',
  password: '',
  token: '',
};
//@ts-ignore
createStore(initialState);

export const updateFormState = (
  state: typeof initialState,
  payload: {
    step: 'Email' | 'Token' | 'Password';
    [key: string]: string;
  },
) => {
  return {
    ...state,
    ...payload,
  };
};

export default function ForgotUserPassword() {
  return null; // full component lands in P5
}
