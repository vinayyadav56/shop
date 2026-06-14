import Link from '@/components/ui/link';
import { siteSettings } from '@/config/site';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useLogout, useUser } from '@/framework/user';
import { useSettings } from '@/framework/settings';
import { PaymentGateway } from '@/types';
import { Routes } from '@/config/routes';
import { isStripeAvailable } from '@/lib/is-stripe-available';

type DashboardSidebarProps = {
  className?: string;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className }) => {
  const { mutate: logout } = useLogout();
  const { me } = useUser();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { pathname } = useRouter();

  return (
    <aside className={className}>
      <div className="mb-5 overflow-hidden rounded-xl border border-forest-900/10 bg-white px-10 py-8">
        <h3 className="mb-4 border-b border-dashed border-forest-900/10 pb-4 text-base font-semibold text-forest-900">
          {t('text-wallet-points')}
        </h3>

        <div className="grid grid-cols-3">
          <div className="mb-2 flex flex-col items-center justify-center space-y-1 border-r border-dashed border-gray-200 py-2 px-2 text-[13px] font-semibold capitalize text-forest-900">
            <span>{me?.wallet?.total_points ?? 0}</span>
            <span>{t('text-total')}</span>
          </div>
          <div className="mb-2 flex flex-col items-center justify-center space-y-1 border-r border-dashed border-gray-200 py-2 px-2 text-[13px] font-semibold capitalize text-forest-900">
            <span>{me?.wallet?.points_used ?? 0}</span>
            <span>{t('text-used')}</span>
          </div>
          <div className="mb-2 flex flex-col items-center justify-center space-y-1 py-2 px-2 text-[13px] font-semibold capitalize text-forest-900">
            <span>{me?.wallet?.available_points ?? 0}</span>
            <span>{t('text-available')}</span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-forest-900/10 bg-white">
        <ul className="py-7">
          {siteSettings.dashboardSidebarMenu
            ?.slice(0, -1)
            .map((item: any, idx) => {
              const enableMyCardRoute = isStripeAvailable(settings);
              if (item?.href === Routes.cards && enableMyCardRoute === false) {
                return null;
              }
              if (
                item?.href === Routes.notifyLogs &&
                !Boolean(settings?.enableEmailForDigitalProduct)
              ) {
                return null;
              }

              return (
                <li className="py-1" key={idx}>
                  <Link
                    href={item.href}
                    className={classNames(
                      'block border-l-4 border-transparent py-2 px-10 font-semibold text-forest-900 transition-colors hover:text-[#175840] focus:text-[#175840]',
                      {
                        '!border-[#175840] bg-[#EAF6EF] text-[#175840] rounded-md':
                          pathname === item.href,
                      }
                    )}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              );
            })}
        </ul>
        {/* End of top part menu */}

        <ul className="border-t border-forest-900/10 bg-white py-4">
          <li className="block py-2 px-11 ">
            <button
              onClick={() => logout()}
              className={classNames(
                'font-semibold text-forest-900 transition-colors hover:text-[#175840] focus:text-[#175840]'
              )}
            >
              {t('profile-sidebar-logout')}
            </button>
          </li>
        </ul>
        {/* End of bottom part menu */}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
