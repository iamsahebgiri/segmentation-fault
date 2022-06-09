import React from 'react';
import { DefaultLayout } from '~/components/default-layout';

export default function NewQuestionPage() {
  return <div>NewQuestion</div>;
}

NewQuestionPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
