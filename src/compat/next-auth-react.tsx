'use client';

/**
 * next-auth/react compat no-op (next-auth v4 is incompatible with Next 16 /
 * React 19). Social login is keep-visual/wire-later: the Google button renders
 * but the session machinery is inert. Email/password + OTP + guest flows are
 * fully functional through the marvel API.
 */
import * as React from 'react';

export const useSession = () => ({ data: null as any, status: 'unauthenticated' as const });
export const signIn = async (_provider?: string, _opts?: any) => undefined as any;
export const signOut = async (_opts?: any) => undefined as any;
export const getSession = async () => null as any;
export function SessionProvider({ children }: { children: React.ReactNode; session?: any }) {
  return <>{children}</>;
}
