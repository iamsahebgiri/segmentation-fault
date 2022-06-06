import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

const IndexPage = () => {
  const questionsQuery = trpc.useQuery(['question.feed']);
  const { data: session } = useSession();

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <>
      <h1>Welcome to your Segmentation Fault!</h1>
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
    </>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
