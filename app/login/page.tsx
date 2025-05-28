import AuthButton from '../components/AuthButton';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-6">Place Login User</h1>
      <h1 className="text-2xl font-bold mb-6">Free News</h1>
      <AuthButton />
    </div>
  );
}