import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import DrawerWrapper from '@/components/ui/drawer/drawer-wrapper';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { siteSettings } from '@/config/site';
import Link from '@/components/ui/link';
import { VERTICAL_LIST } from '@/components/storefront/verticals';

export default function MobileMainMenu() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [_, closeSidebar] = useAtom(drawerAtom);
  const { headerLinks } = siteSettings;
  const current = (router.query.pages as string[] | undefined)?.[0];
  const activeKey =
    current === 'tools' || current === 'farmbox' ? current : 'plants';

  // function handleClick(path: string) {
  //   router.push(path);
  //   closeSidebar({ display: false, view: '' });
  // }

  return (
    <DrawerWrapper>
      {/* Vertical switcher — Plants · Tools · FarmBox */}
      <div className="px-5 pt-5 md:px-6">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
          Shop by world
        </p>
        <div className="flex gap-2">
          {VERTICAL_LIST.map((v) => (
            <Link
              key={v.key}
              href={v.isHome ? '/' : v.path}
              onClick={() => closeSidebar({ display: false, view: '' })}
              className={`flex-1 rounded-full py-2 text-center text-sm font-bold transition ${
                activeKey === v.key
                  ? 'bg-leaf text-white'
                  : 'bg-forest/8 text-forest'
              }`}
            >
              {v.label}
            </Link>
          ))}
        </div>
      </div>
      <ul className="grow pt-4">
        {headerLinks?.map(({ href, label }) => (
          <li key={`${href}${label}`}>
            <Link
              href={href}
              className="flex items-center px-5 py-3 text-sm font-semibold capitalize transition duration-200 cursor-pointer text-heading hover:text-accent md:px-6"
              title={t(label)}
              onClick={() => closeSidebar({ display: false, view: '' })}
            >
              {t(label)}
            </Link>
          </li>
        ))}
      </ul>
    </DrawerWrapper>
  );
}
