import { trpc } from '~/utils/trpc';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '~/components/button';
import { DefaultLayout } from '~/components/default-layout';

const HomePage = () => {
  const questionsQuery = trpc.useQuery(['question.feed']);
  const { data: session } = useSession();

  return (
    <>
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
    </>
  );
};

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default HomePage;
