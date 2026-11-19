import { supabase } from '@/lib/supabaseClient';
import FeedbackClient from './FeedbackClient';

interface Feedback {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

async function getInitialFeedbacks(): Promise<Feedback[]> {
  const { data } = await supabase
    .from('site_feedback')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (data as Feedback[]) || [];
}

export default async function FeedbackPage() {
  const feedbacks = await getInitialFeedbacks();

  return <FeedbackClient initialFeedbacks={feedbacks} />;
}
