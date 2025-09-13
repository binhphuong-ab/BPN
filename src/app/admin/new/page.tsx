'use client';

import PostEditor from '@/components/PostEditor';
import AdminLayout from '@/components/admin/AdminLayout';

function NewPostContent() {
  return <PostEditor mode="create" />;
}

export default function NewPostPage() {
  return (
    <AdminLayout>
      <NewPostContent />
    </AdminLayout>
  );
}
