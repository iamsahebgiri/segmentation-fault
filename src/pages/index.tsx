import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '~/components/button';
import { DefaultLayout } from '~/components/default-layout';
import { classNames } from '~/lib/classnames';
import Question from '~/components/question';
import Navigation from '~/components/sidebar/navigation';
import Trendings from '~/components/sidebar/trendings';

const tabs = [
  { name: 'Recent', href: '#', current: true },
  { name: 'Most Liked', href: '#', current: false },
  { name: 'Most Answers', href: '#', current: false },
];
const questions = [
  {
    id: '81614',
    likes: '29',
    replies: '11',
    views: '2.7k',
    author: {
      name: 'Dries Vincent',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      href: '#',
    },
    date: 'December 9 at 11:43 AM',
    datetime: '2020-12-09T11:43:00',
    href: '#',
    title:
      'How can I run command which has it own options in node child process exec?',
    body: `
      <p>Jurassic Park was an incredible idea and a magnificent feat of engineering, but poor protocols and a disregard for human safety killed what could have otherwise been one of the best businesses of our generation.</p>
      <p>Ultimately, I think that if you wanted to run the park successfully and keep visitors safe, the most important thing to prioritize would be&hellip;</p>
    `,
  },
  // More questions...
];

const HomePage = () => {
  const questionsQuery = trpc.useQuery(['question.feed']);
  const { data: session } = useSession();

  return (
    <>
      <Navigation />
      <main className="lg:col-span-9 xl:col-span-6">
        <div className="px-4 sm:px-0">
          <div className="sm:hidden">
            <label htmlFor="question-tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="question-tabs"
              className="block w-full rounded-md border-gray-300 text-base font-medium text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
              defaultValue={tabs.find((tab) => tab.current)?.name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
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
                      tab.current ? 'bg-red-500' : 'bg-transparent',
                      'absolute inset-x-0 bottom-0 h-0.5',
                    )}
                  />
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="sr-only">Recent questions</h1>
          <h1>Welcome to your Segmentation Fault!</h1>
          <Button variant="primary">Hello</Button>
          {session ? (
            <>
              Signed in as {session?.user?.email} <br />
              <button onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <>
              Not signed in <br />
              <button onClick={() => signIn()}>Sign in</button>
            </>
          )}
          <h1 className="text-3xl font-bold underline">Hello world!</h1>
          <h2>
            Questions
            {questionsQuery.status === 'loading' && '(loading)'}
          </h2>
          {questionsQuery.data?.questions.map((item) => (
            <article key={item.id}>
              <h3>{item.title}</h3>
              <Link href={`/q/${item.id}`}>
                <a>View more</a>
              </Link>
            </article>
          ))}

          <hr />
          <ul role="list" className="space-y-4">
            {questions.map((question) => (
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
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default HomePage;
