import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D1117]">
      <div className="bg-[#161B22] p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Sign In to Hook.ai
        </h2>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
