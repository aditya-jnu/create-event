export default function Home() {
  const REDIRECT_URI = 'http://localhost:5000/auth/google';

  const handleLogin = () => {
    console.log("Handle Login")
    window.location.href = REDIRECT_URI;
  };

  return (
    <div className='h-screen flex justify-center items-center text-white'>
      <button onClick={handleLogin} className='bg-primary-blue p-4 rounded-lg'>
        Sign in with Google
      </button>
    </div>
  );
}
