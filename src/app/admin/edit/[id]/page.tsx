'use client';

import PostEditor from '@/components/PostEditor';
import AdminLayout from '@/components/admin/AdminLayout';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

function EditPostContent({ postId }: { postId: string }) {
  return <PostEditor mode="edit" postId={postId} />;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <AdminLayout>
      <EditPostContent postId={params.id} />
    </AdminLayout>
  );
}
