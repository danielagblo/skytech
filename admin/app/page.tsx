import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect root to public site
  redirect('/site');
}
