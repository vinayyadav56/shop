'use client';
import Link from '@/components/ui/link';
import { siteSettings } from '@/config/site';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useLogout } from '@/framework/user';
import { useSettings } from '@/framework/settings';
import { Routes } from '@/config/routes';
import { isStripeAvailable } from '@/lib/is-stripe-available';

type Props = { className?: string };

/** Responsive dashboard nav — horizontal scroll tabs on mobile, a vertical card on
 *  desktop. (Wallet points moved to the account header.) */
const DashboardSidebar: React.FC<Props> = ({ className }) => {
  const { mutate: logout } = useLogout();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { pathname } = useRouter();

  const navItems = (siteSettings.dashboardSidebarMenu ?? [])
    .slice(0, -1)
    .filter((item: any) => {
      if (item?.href === Routes.cards && !isStripeAvailable(settings)) return false;
      if (item?.href === Routes.notifyLogs && !settings?.enableEmailForDigitalProduct) return false;
      return true;
    });

  return (
    <aside className={className}>
      {/* mobile: horizontal scroll tabs */}
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item: any, i: number) => (
            <Link
              key={i}
              href={item.href}
              className={classNames(
                'shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-semibold transition',
                pathname === item.href
                  ? 'border-transparent bg-ds-accent text-white'
                  : 'border-forest-900/10 bg-white text-forest-900 hover:bg-[var(--ds-accent-soft)]',
              )}
            >
              {t(item.label)}
            </Link>
          ))}
          <button
            onClick={() => logout()}
            className="shrink-0 whitespace-nowrap rounded-full border border-red-200 bg-white px-4 py-2 text-[13px] font-semibold text-red-500 transition hover:bg-red-50"
          >
            {t('profile-sidebar-logout')}
          </button>
        </div>
      </div>

      {/* desktop: vertical nav card */}
      <div className="hidden overflow-hidden rounded-2xl border border-forest-900/10 bg-white lg:block">
        <ul className="p-2.5">
          {navItems.map((item: any, i: number) => (
            <li key={i}>
              <Link
                href={item.href}
                className={classNames(
                  'flex items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition',
                  pathname === item.href
                    ? 'bg-ds-accent text-white'
                    : 'text-forest-900 hover:bg-[var(--ds-accent-soft)]',
                )}
              >
                {t(item.label)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-forest-900/10 p-2.5">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-red-500 transition hover:bg-red-50"
          >
            {t('profile-sidebar-logout')}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
