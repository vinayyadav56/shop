import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { DS_PREPAINT_SCRIPT } from '@/lib/design-system';

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }
  render() {
    // const { locale } = this.props.__NEXT_DATA__;
    // const dir = getDirection(locale);
    return (
      // <Html dir={dir}>
      <Html>
        <Head>
          {/* Apply persisted Design System theme (font/color/density) before paint. */}
          <script dangerouslySetInnerHTML={{ __html: DS_PREPAINT_SCRIPT }} />
          {/* Google Analytics */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-KTCXX5B35N" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-KTCXX5B35N');
              `,
            }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          {/* Plus Jakarta Sans — modern geometric sans for the revamped storefront (headings + UI) */}
          <link
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          {/* PlantAtHome design-system fonts: Hanken Grotesk (body/headlines) + Jost (lockup/eyebrows) */}
          <link
            href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Jost:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
          {/* Manrope — Design System default BODY font (Luxury Signature pairing) */}
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          {/* Cormorant Garamond — editorial serif for premium product/display headings */}
          <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap"
            rel="stylesheet"
          />
          {/* Playfair Display — luxury display serif for the hero + premium headings */}
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;0,900;1,500;1,600&display=swap"
            rel="stylesheet"
          />
          {/* Poppins (geometric headings) + Caveat (script subtitle) for the product page */}
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Caveat:wght@500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
