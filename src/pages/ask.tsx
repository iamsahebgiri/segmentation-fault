import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import toast from 'react-hot-toast';
import QuestionForm from '~/components/form/question-form';
import { MainLayout } from '~/components/layouts/main-layout';
import { trpc } from '~/utils/trpc';

export default function AskQuestionPage() {
  const router = useRouter();
  const addQuestionMutation = trpc.useMutation('question.add', {
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <>
      <Head>
        <title>Ask a public question - Segmentation Fault</title>
      </Head>

      <div className="col-span-8">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">
          Ask a public question
        </h3>
        <div className="mt-6">
          <QuestionForm
            isSubmitting={addQuestionMutation.isLoading}
            defaultValues={{
              title: '',
              content: '',
            }}
            backTo="/"
            onSubmit={(values) => {
              addQuestionMutation.mutate(
                { title: values.title, content: values.content },
                {
                  onSuccess: (data) => router.push(`/q/${data.id}`),
                },
              );
            }}
          />
        </div>
      </div>
      <div className="col-span-4">Tips</div>
    </>
  );
}

AskQuestionPage.auth = true;

AskQuestionPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
