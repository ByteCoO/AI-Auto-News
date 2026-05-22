const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://mnlqkidkabxgxwlfuyph.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubHFraWRrYWJ4Z3h3bGZ1eXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2Mjc4NTgsImV4cCI6MjA5MTIwMzg1OH0.FBhDeOFZ8DIg7LddGlxbPzdKttF-KK3re8sila5nSo0"
);

async function run() {
  const { data, error } = await supabase
    .from('v5_opportunities')
    .select('*')
    .or('final_decision.eq.STRONG BUILD,title.eq.N/A');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

run();