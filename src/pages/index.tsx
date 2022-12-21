import { trpc } from '~/utils/trpc';
import Question from '~/components/question';
import Trendings from '~/components/sidebar/trendings';
import { MainLayout } from '~/components/layouts/main-layout';

const tabs = [
  { name: 'Recent', href: '#', current: true },
  { name: 'Most Liked', href: '#', current: false },
  { name: 'Most Answers', href: '#', current: false },
];

const HomePage = () => {
  const questionsQuery = trpc.question.feed.useQuery();

  return (
    <>
      {/* <Navigation /> */}
      <main className="lg:col-span-9 xl:col-span-8">
        <div className="px-4 sm:px-0">
          <div className="sm:hidden">
            <label htmlFor="question-tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="question-tabs"
              className="block w-full rounded-md border-gray-300 text-base font-medium text-gray-900 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              defaultValue={tabs.find((tab) => tab.current)?.name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          {/* <div className="hidden sm:block">
            <nav
              className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
              aria-label="Tabs"
            >
              {tabs.map((tab, tabIdx) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  aria-current={tab.current ? 'page' : undefined}
                  className={classNames(
                    tab.current
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700',
                    tabIdx === 0 ? 'rounded-l-lg' : '',
                    tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                    'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10',
                  )}
                >
                  <span>{tab.name}</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      tab.current ? 'bg-brand-500' : 'bg-transparent',
                      'absolute inset-x-0 bottom-0 h-0.5',
                    )}
                  />
                </a>
              ))}
            </nav>
          </div> */}
        </div>
        <div className="mt-0">
          <h1 className="sr-only">Recent questions</h1>
          <h2>{questionsQuery.status === 'loading' && '(loading)'}</h2>
          <ul role="list" className="space-y-4">
            {questionsQuery.data?.questions.map((question) => (
              <Question key={question.id} {...question} />
            ))}
          </ul>
        </div>
      </main>
      <Trendings />
    </>
  );
};

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default HomePage;
