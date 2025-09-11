import PostEditor from '@/components/PostEditor';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return <PostEditor mode="edit" postId={params.id} />;
}
