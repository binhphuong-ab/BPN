'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import BookForm from '@/components/admin/BookForm';

interface EditBookPageProps {
  params: {
    id: string;
  };
}

function EditBookContent({ bookId }: { bookId: string }) {
  return <BookForm mode="edit" bookId={bookId} />;
}

export default function EditBookPage({ params }: EditBookPageProps) {
  return (
    <AdminLayout>
      <EditBookContent bookId={params.id} />
    </AdminLayout>
  );
}
