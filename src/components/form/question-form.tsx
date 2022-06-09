import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '~/components/button';
import { useLeaveConfirm } from '~/lib/form';
import { ButtonLink } from '~/components/button-link';
import { Textarea } from '~/components/textarea';
import { TextField } from '~/components/textfield';

type FormData = {
  title: string;
  content: string;
};

type PostFormProps = {
  defaultValues?: FormData;
  isSubmitting?: boolean;
  backTo: string;
  onSubmit: SubmitHandler<FormData>;
};

export default function QuestionForm({
  defaultValues,
  isSubmitting,
  backTo,
  onSubmit,
}: PostFormProps) {
  const { register, formState, getValues, reset, handleSubmit } =
    useForm<FormData>({
      defaultValues,
    });

  useLeaveConfirm({ formState });

  const { isSubmitSuccessful } = formState;

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset(getValues());
    }
  }, [isSubmitSuccessful, reset, getValues]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-full">
              <TextField
                {...register('title', { required: true })}
                label="Title"
                helperText="Be specific and imagine you're asking a question to
                another person"
                autoFocus
                required
              />
            </div>
          </div>

          <div>
            <Textarea
              {...register('content', { required: true })}
              label="Body"
              helperText="Include all the information someone would need to answer your question"
              rows={12}
              required
            />
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <div className="flex flex-row-reverse gap-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingChildren={`${defaultValues ? 'Saving' : 'Publishing'}`}
            >
              {defaultValues?.title ? 'Save' : 'Publish'} your question
            </Button>
            <ButtonLink href={backTo} variant="secondary">
              Cancel
            </ButtonLink>
          </div>
        </div>
      </div>
    </form>
  );
}
