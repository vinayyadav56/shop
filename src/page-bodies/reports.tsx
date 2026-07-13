'use client';

import PrivateRoute from '@/lib/private-route';
import Card from '@/components/ui/cards/card';
import Seo from '@/components/seo/seo';
import DashboardLayout from '@/layouts/_dashboard';
import MyReports from '@/components/reports/report-view';

const MyReportsPage = () => {
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <Card className="w-full self-stretch shadow-none sm:shadow">
        <MyReports />
      </Card>
    </>
  );
};

MyReportsPage.authenticationRequired = true;

MyReportsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyReportsPage;


/* ── App Router body wrapper (added by port; V1 _app.tsx getLayout semantics) ── */

export function PageBody(props: any) {
  const page = <MyReportsPage {...props} />;
  const withLayout = (MyReportsPage as any).getLayout ? (MyReportsPage as any).getLayout(page) : page;
  return <PrivateRoute>{withLayout}</PrivateRoute>;
}
