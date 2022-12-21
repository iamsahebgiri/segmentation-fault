import { useRouter } from 'next/router';
import { AuthorWithDate } from '~/components/author-with-date';
import { Banner } from '~/components/banner';
import { Button } from '~/components/button';
import { ButtonLink } from '~/components/button-link';
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '~/components/dialog';
import { HtmlView } from '~/components/html-view';
import { IconButton } from '~/components/icon-button';
import {
  DotsIcon,
  EditIcon,
  EyeClosedIcon,
  EyeIcon,
  MessageIcon,
  TrashIcon,
} from '~/components/icons';
// import { LikeButton } from '~/components/like-button';
// import { MarkdownEditor } from '~/components/markdown-editor';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import * as React from 'react';
import toast from 'react-hot-toast';
import { MainLayout } from '~/components/layouts/main-layout';
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItemsContent,
} from '~/components/menu';
import { trpc } from '~/utils/trpc';

// const QuestionViewPage = () => {
//   const id = useRouter().query.id as string;
//   const questionQuery = trpc.useQuery(['question.detail', { id: Number(id) }]);

//   if (questionQuery.error) {
//     return (
//       <NextError
//         title={questionQuery.error.message}
//         statusCode={questionQuery.error.data?.httpStatus ?? 500}
//       />
//     );
//   }

//   if (questionQuery.status !== 'success') {
//     return <>Loading...</>;
//   }
//   const { data } = questionQuery;
//   return (
//     <>
//       <div className="col-span-8">
//         <h1>{data.title}</h1>
//         <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

//         <p>{data.content}</p>

//         <h2>Raw data:</h2>
//         <pre>{JSON.stringify(data, null, 4)}</pre>
//       </div>
//       <div className="col-span-4">
//         <h1>{data.title}</h1>
//         <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

//         <p>{data.content}</p>
//       </div>
//     </>
//   );
// };

// QuestionViewPage.getLayout = function getLayout(page: React.ReactElement) {
//   return <DefaultLayout>{page}</DefaultLayout>;
// };

// export default QuestionViewPage;

const QuestionPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const utils = trpc.useContext();
  const postQuery = trpc.question.detail.useQuery({
    id: Number(router.query.id),
  });

  const likeMutation = trpc.question.like.useMutation({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
  const unlikeMutation = trpc.question.unlike.useMutation({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false);
  const [isConfirmHideDialogOpen, setIsConfirmHideDialogOpen] =
    React.useState(false);
  const [isConfirmUnhideDialogOpen, setIsConfirmUnhideDialogOpen] =
    React.useState(false);

  function handleHide() {
    setIsConfirmHideDialogOpen(true);
  }

  function handleUnhide() {
    setIsConfirmUnhideDialogOpen(true);
  }

  function handleEdit() {
    router.push(`/q/${postQuery.data?.id}/edit`);
  }

  function handleDelete() {
    setIsConfirmDeleteDialogOpen(true);
  }

  if (postQuery.data) {
    const isUserAdmin = session!.user.role === 'ADMIN';
    const postBelongsToUser = postQuery.data.author.id === session!.user.id;

    return (
      <>
        <Head>
          <title>{postQuery.data.title} - Segmentation Fault</title>
        </Head>

        <div className="col-span-8 space-y-12">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {postQuery.data.hidden && (
                <Banner className="mb-6">
                  This post has been hidden and is only visible to
                  administrators.
                </Banner>
              )}
              <div className="mb-6">
                <AuthorWithDate
                  author={postQuery.data.author}
                  date={postQuery.data.createdAt}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
                  {postQuery.data.title}
                </h1>
                {(postBelongsToUser || isUserAdmin) && (
                  <>
                    <div className="flex md:hidden">
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          variant="secondary"
                          title="More"
                        >
                          <DotsIcon className="w-4 h-4" />
                        </MenuButton>

                        <MenuItems className="w-28">
                          <MenuItemsContent>
                            {isUserAdmin &&
                              (postQuery.data.hidden ? (
                                <MenuItemButton onClick={handleUnhide}>
                                  Unhide
                                </MenuItemButton>
                              ) : (
                                <MenuItemButton onClick={handleHide}>
                                  Hide
                                </MenuItemButton>
                              ))}
                            {postBelongsToUser && (
                              <>
                                <MenuItemButton onClick={handleEdit}>
                                  Edit
                                </MenuItemButton>
                                <MenuItemButton
                                  className="!text-red"
                                  onClick={handleDelete}
                                >
                                  Delete
                                </MenuItemButton>
                              </>
                            )}
                          </MenuItemsContent>
                        </MenuItems>
                      </Menu>
                    </div>
                    <div className="hidden md:flex md:gap-4">
                      {isUserAdmin &&
                        (postQuery.data.hidden ? (
                          <IconButton
                            variant="secondary"
                            title="Unhide"
                            onClick={handleUnhide}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </IconButton>
                        ) : (
                          <IconButton
                            variant="secondary"
                            title="Hide"
                            onClick={handleHide}
                          >
                            <EyeClosedIcon className="w-4 h-4" />
                          </IconButton>
                        ))}
                      {postBelongsToUser && (
                        <>
                          <IconButton
                            variant="secondary"
                            title="Edit"
                            onClick={handleEdit}
                          >
                            <EditIcon className="w-4 h-4" />
                          </IconButton>
                          <IconButton
                            variant="secondary"
                            title="Delete"
                            onClick={handleDelete}
                          >
                            <TrashIcon className="w-4 h-4 text-red" />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
              <HtmlView html={postQuery.data.contentHtml} className="mt-8" />
              <div className="flex gap-4 mt-6 clear-both">
                {/* <LikeButton
                likedBy={postQuery.data.upvotedBy}
                onLike={() => {
                  likeMutation.mutate(postQuery.data.id);
                }}
                onUnlike={() => {
                  unlikeMutation.mutate(postQuery.data.id);
                }}
              /> */}
                <ButtonLink
                  href={`/q/${postQuery.data.id}#comments`}
                  variant="secondary"
                >
                  <MessageIcon className="w-4 h-4 text-secondary" />
                  <span className="ml-1.5">
                    {postQuery.data.comments.length}
                  </span>
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="relative" id="comments">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-start">
              <span className="pr-2 bg-gray-100 text-sm text-gray-500">
                Answers
              </span>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {Array.from({ length: 10 }, (_, i) => i).map((i) => (
                <div key={i}>
                  <div className="px-4 py-5 sm:p-6">
                    {postQuery.data.hidden && (
                      <Banner className="mb-6">
                        This post has been hidden and is only visible to
                        administrators.
                      </Banner>
                    )}
                    <AuthorWithDate
                      author={postQuery.data.author}
                      date={postQuery.data.createdAt}
                    />
                    <HtmlView
                      html={postQuery.data.contentHtml}
                      className="mt-8"
                    />
                  </div>
                </div>
              ))}
            </ul>
          </div>
          <div className="space-y-4"></div>
        </div>

        <ConfirmDeleteDialog
          postId={postQuery.data.id}
          isOpen={isConfirmDeleteDialogOpen}
          onClose={() => {
            setIsConfirmDeleteDialogOpen(false);
          }}
        />

        {/* <ConfirmHideDialog
          postId={postQuery.data.id}
          isOpen={isConfirmHideDialogOpen}
          onClose={() => {
            setIsConfirmHideDialogOpen(false);
          }}
        />

        <ConfirmUnhideDialog
          postId={postQuery.data.id}
          isOpen={isConfirmUnhideDialogOpen}
          onClose={() => {
            setIsConfirmUnhideDialogOpen(false);
          }}
        /> */}
      </>
    );
  }

  if (postQuery.isError) {
    return <div>Error: {postQuery.error.message}</div>;
  }

  return (
    <div className="col-span-8">
      <div className="animate-pulse">
        <div className="w-3/4 bg-gray-200 rounded h-9 dark:bg-gray-700" />
        <div className="flex items-center gap-4 mt-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700" />
          <div className="flex-1">
            <div className="w-24 h-4 bg-gray-200 rounded dark:bg-gray-700" />
            <div className="w-32 h-3 mt-2 bg-gray-200 rounded dark:bg-gray-700" />
          </div>
        </div>
        <div className="space-y-3 mt-7">
          {[...Array(3)].map((_, idx) => (
            <React.Fragment key={idx}>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-5 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
                <div className="h-5 col-span-1 bg-gray-200 rounded dark:bg-gray-700" />
              </div>
              <div className="w-1/2 h-5 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-5 col-span-1 bg-gray-200 rounded dark:bg-gray-700" />
                <div className="h-5 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
              </div>
              <div className="w-3/5 h-5 bg-gray-200 rounded dark:bg-gray-700" />
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-4 mt-6">
          <div className="w-16 border rounded-full h-button border-secondary" />
          <div className="w-16 border rounded-full h-button border-secondary" />
        </div>
      </div>
    </div>
  );
};

QuestionPage.auth = true;

QuestionPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

// function Comment({
//   postId,
//   comment,
// }: {
//   postId: number;
//   comment: InferQueryOutput<'question.detail'>['comments'][number];
// }) {
//   const { data: session } = useSession();
//   const [isEditing, setIsEditing] = React.useState(false);
//   const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
//     React.useState(false);

//   const commentBelongsToUser = comment.author.id === session!.user.id;

//   if (isEditing) {
//     return (
//       <div className="flex items-start gap-4">
//         <Avatar name={comment.author.name!} src={comment.author.image} />
//         <EditCommentForm
//           postId={postId}
//           comment={comment}
//           onDone={() => {
//             setIsEditing(false);
//           }}
//         />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between gap-4">
//         {/* <AuthorWithDate author={comment.author} date={comment.createdAt} /> */}
//         {commentBelongsToUser && (
//           <Menu>
//             <MenuButton as={IconButton} variant="secondary" title="More">
//               <DotsIcon className="w-4 h-4" />
//             </MenuButton>

//             <MenuItems className="w-28">
//               <MenuItemsContent>
//                 <MenuItemButton
//                   onClick={() => {
//                     setIsEditing(true);
//                   }}
//                 >
//                   Edit
//                 </MenuItemButton>
//                 <MenuItemButton
//                   className="!text-red"
//                   onClick={() => {
//                     setIsConfirmDeleteDialogOpen(true);
//                   }}
//                 >
//                   Delete
//                 </MenuItemButton>
//               </MenuItemsContent>
//             </MenuItems>
//           </Menu>
//         )}
//       </div>

//       <div className="mt-4 pl-11 sm:pl-16">
//         <HtmlView html={comment.contentHtml} />
//       </div>

//       <ConfirmDeleteCommentDialog
//         postId={postId}
//         commentId={comment.id}
//         isOpen={isConfirmDeleteDialogOpen}
//         onClose={() => {
//           setIsConfirmDeleteDialogOpen(false);
//         }}
//       />
//     </div>
//   );
// }

// type CommentFormData = {
//   content: string;
// };

// function AddCommentForm({ postId }: { postId: number }) {
//   const [markdownEditorKey, setMarkdownEditorKey] = React.useState(0);
//   const utils = trpc.useContext();
//   const addCommentMutation = trpc.useMutation('comment.add', {
//     onSuccess: () => {
//       return utils.invalidateQueries(getPostQueryPathAndInput(postId));
//     },
//     onError: (error) => {
//       toast.error(`Something went wrong: ${error.message}`);
//     },
//   });
//   const { control, handleSubmit, reset } = useForm<CommentFormData>();

//   const onSubmit: SubmitHandler<CommentFormData> = (data) => {
//     addCommentMutation.mutate(
//       {
//         postId,
//         content: data.content,
//       },
//       {
//         onSuccess: () => {
//           reset({ content: '' });
//           setMarkdownEditorKey((markdownEditorKey) => markdownEditorKey + 1);
//         },
//       },
//     );
//   };

//   return (
//     <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
//       <Controller
//         name="content"
//         control={control}
//         rules={{ required: true }}
//         render={({ field }) => (
//           <MarkdownEditor
//             key={markdownEditorKey}
//             value={field.value}
//             onChange={field.onChange}
//             onTriggerSubmit={handleSubmit(onSubmit)}
//             required
//             placeholder="Comment"
//             minRows={4}
//           />
//         )}
//       />
//       <div className="mt-4">
//         <Button
//           type="submit"
//           isLoading={addCommentMutation.isLoading}
//           loadingChildren="Adding comment"
//         >
//           Add comment
//         </Button>
//       </div>
//     </form>
//   );
// }

// function EditCommentForm({
//   postId,
//   comment,
//   onDone,
// }: {
//   postId: number;
//   comment: InferQueryOutput<'question.detail'>['comments'][number];
//   onDone: () => void;
// }) {
//   const utils = trpc.useContext();
//   const editCommentMutation = trpc.useMutation('comment.edit', {
//     onSuccess: () => {
//       return utils.invalidateQueries(getPostQueryPathAndInput(postId));
//     },
//     onError: (error) => {
//       toast.error(`Something went wrong: ${error.message}`);
//     },
//   });
//   const { control, handleSubmit } = useForm<CommentFormData>({
//     defaultValues: {
//       content: comment.content,
//     },
//   });

//   const onSubmit: SubmitHandler<CommentFormData> = (data) => {
//     editCommentMutation.mutate(
//       {
//         id: comment.id,
//         data: {
//           content: data.content,
//         },
//       },
//       {
//         onSuccess: () => onDone(),
//       },
//     );
//   };

//   return (
//     <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
//       <Controller
//         name="content"
//         control={control}
//         rules={{ required: true }}
//         render={({ field }) => (
//           <MarkdownEditor
//             value={field.value}
//             onChange={field.onChange}
//             onTriggerSubmit={handleSubmit(onSubmit)}
//             required
//             placeholder="Comment"
//             minRows={4}
//             autoFocus
//           />
//         )}
//       />
//       <div className="flex gap-4 mt-4">
//         <Button
//           type="submit"
//           isLoading={editCommentMutation.isLoading}
//           loadingChildren="Updating comment"
//         >
//           Update comment
//         </Button>
//         <Button variant="secondary" onClick={onDone}>
//           Cancel
//         </Button>
//       </div>
//     </form>
//   );
// }

// function ConfirmDeleteCommentDialog({
//   postId,
//   commentId,
//   isOpen,
//   onClose,
// }: {
//   postId: number;
//   commentId: number;
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const cancelRef = React.useRef<HTMLButtonElement>(null);
//   const utils = trpc.useContext();
//   const deleteCommentMutation = trpc.useMutation('comment.delete', {
//     onSuccess: () => {
//       return utils.invalidateQueries(getPostQueryPathAndInput(postId));
//     },
//     onError: (error) => {
//       toast.error(`Something went wrong: ${error.message}`);
//     },
//   });

//   return (
//     <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
//       <DialogContent>
//         <DialogTitle>Delete comment</DialogTitle>
//         <DialogDescription className="mt-6">
//           Are you sure you want to delete this comment?
//         </DialogDescription>
//         <DialogCloseButton onClick={onClose} />
//       </DialogContent>
//       <DialogActions>
//         <Button
//           variant="secondary"
//           className="!text-red"
//           isLoading={deleteCommentMutation.isLoading}
//           loadingChildren="Deleting comment"
//           onClick={() => {
//             deleteCommentMutation.mutate(commentId, {
//               onSuccess: () => onClose(),
//             });
//           }}
//         >
//           Delete comment
//         </Button>
//         <Button variant="secondary" onClick={onClose} ref={cancelRef}>
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

function ConfirmDeleteDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const deletePostMutation = trpc.question.delete.useMutation({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Delete post</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this post?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          className="!text-red"
          isLoading={deletePostMutation.isLoading}
          loadingChildren="Deleting post"
          onClick={() => {
            deletePostMutation.mutate(postId, {
              onSuccess: () => router.push('/'),
            });
          }}
        >
          Delete post
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// function ConfirmHideDialog({
//   postId,
//   isOpen,
//   onClose,
// }: {
//   postId: number;
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const cancelRef = React.useRef<HTMLButtonElement>(null);
//   const utils = trpc.useContext();
//   const hidePostMutation = trpc.useMutation('question.hide', {
//     onSuccess: () => {
//       return utils.invalidateQueries(getPostQueryPathAndInput(postId));
//     },
//     onError: (error) => {
//       toast.error(`Something went wrong: ${error.message}`);
//     },
//   });

//   return (
//     <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
//       <DialogContent>
//         <DialogTitle>Hide post</DialogTitle>
//         <DialogDescription className="mt-6">
//           Are you sure you want to hide this post?
//         </DialogDescription>
//         <DialogCloseButton onClick={onClose} />
//       </DialogContent>
//       <DialogActions>
//         <Button
//           variant="secondary"
//           isLoading={hidePostMutation.isLoading}
//           loadingChildren="Hiding post"
//           onClick={() => {
//             hidePostMutation.mutate(postId, {
//               onSuccess: () => {
//                 toast.success('Post hidden');
//                 onClose();
//               },
//             });
//           }}
//         >
//           Hide post
//         </Button>
//         <Button variant="secondary" onClick={onClose} ref={cancelRef}>
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// function ConfirmUnhideDialog({
//   postId,
//   isOpen,
//   onClose,
// }: {
//   postId: number;
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const cancelRef = React.useRef<HTMLButtonElement>(null);
//   const utils = trpc.useContext();
//   const unhidePostMutation = trpc.useMutation('question.unhide', {
//     onSuccess: () => {
//       return utils.invalidateQueries(getPostQueryPathAndInput(postId));
//     },
//     onError: (error) => {
//       toast.error(`Something went wrong: ${error.message}`);
//     },
//   });

//   return (
//     <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
//       <DialogContent>
//         <DialogTitle>Unhide post</DialogTitle>
//         <DialogDescription className="mt-6">
//           Are you sure you want to unhide this post?
//         </DialogDescription>
//         <DialogCloseButton onClick={onClose} />
//       </DialogContent>
//       <DialogActions>
//         <Button
//           variant="secondary"
//           isLoading={unhidePostMutation.isLoading}
//           loadingChildren="Unhiding post"
//           onClick={() => {
//             unhidePostMutation.mutate(postId, {
//               onSuccess: () => {
//                 toast.success('Post unhidden');
//                 onClose();
//               },
//             });
//           }}
//         >
//           Unhide post
//         </Button>
//         <Button variant="secondary" onClick={onClose} ref={cancelRef}>
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

export default QuestionPage;
