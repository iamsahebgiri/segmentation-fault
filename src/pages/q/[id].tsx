import NextError from 'next/error';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';

const QuestionViewPage = () => {
  const id = useRouter().query.id as string;
  const questionQuery = trpc.useQuery(['question.byId', { id: Number(id) }]);

  if (questionQuery.error) {
    return (
      <NextError
        title={questionQuery.error.message}
        statusCode={questionQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (questionQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = questionQuery;
  return (
    <>
      <h1>{data.title}</h1>
      <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

      <p>{data.content}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </>
  );
};

export default QuestionViewPage;
