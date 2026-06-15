import { getEnv } from '@/config/get-env';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';

// LinkedIn ("Sign In with LinkedIn using OpenID Connect"). Optional — only registered
// when its credentials are present, so deploys without LinkedIn don't break auth.
const providers: any[] = [
  GoogleProvider({
    clientId: getEnv('GOOGLE_CLIENT_ID'),
    clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
  }),
];
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  providers.push(
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      client: { token_endpoint_auth_method: 'client_secret_post' },
      issuer: 'https://www.linkedin.com/oauth',
      wellKnown: 'https://www.linkedin.com/oauth/.well-known/openid-configuration',
      authorization: { params: { scope: 'openid profile email' } },
      profile(profile: any) {
        return { id: profile.sub, name: profile.name, email: profile.email, image: profile.picture };
      },
    }),
  );
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers,

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: getEnv('SECRET'),

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The Routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn({ account, profile, user}) {
    // 	if (account.provider === "google") {
    //     return profile.email_verified && profile?.email?.endsWith("@gmail.com")
    //   }
    //   return true // Return true to allow sign in
    // },
    async jwt({ token, account }) {
      if (account) {
        const { access_token, provider } = account;
        token.provider = provider;
        // reform the `token` object from the access token we appended to the `user` object
        token.access_token = access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      const { access_token, provider } = token;
      //@ts-ignore
      session.provider = provider;
      //@ts-ignore
      session.access_token = access_token;
      return session;
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // Enable debug messages in the console if you are having problems
  // debug: getEnv('NODE_ENV') === 'development',
});
