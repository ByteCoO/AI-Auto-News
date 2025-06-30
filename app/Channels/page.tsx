// app/news-client/page.tsx
import NewsClientComponent from '@/app/components/NewsClientComponent';

export default function NewsClientPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">News Client Component</h1>
      <NewsClientComponent />
    </div>
  );
}