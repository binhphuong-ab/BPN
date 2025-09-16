'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import BookForm from '@/components/admin/BookForm';

function NewBookContent() {
  return <BookForm mode="create" />;
}

export default function NewBookPage() {
  return (
    <AdminLayout>
      <NewBookContent />
    </AdminLayout>
  );
}
