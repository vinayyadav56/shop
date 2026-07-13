'use client';

import PrivateRoute from '@/lib/private-route';
import Card from '@/components/ui/cards/card';
import Seo from '@/components/seo/seo';
import DashboardLayout from '@/layouts/_dashboard';
import MyQuestions from '@/components/questions/my-questions';

const MyQuestionsPage = () => {
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <Card className="w-full shadow-none sm:shadow">
        <MyQuestions />
      </Card>
    </>
  );
};

MyQuestionsPage.authenticationRequired = true;

MyQuestionsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyQuestionsPage;


/* ── App Router body wrapper (added by port; V1 _app.tsx getLayout semantics) ── */

export function PageBody(props: any) {
  const page = <MyQuestionsPage {...props} />;
  const withLayout = (MyQuestionsPage as any).getLayout ? (MyQuestionsPage as any).getLayout(page) : page;
  return <PrivateRoute>{withLayout}</PrivateRoute>;
}
