import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      // Supabase handles token in URL (#access_token=...)
      await supabase.auth.getSession();
      navigate("/"); // Redirect to home once session is stored
    }

    handleCallback();
  }, [navigate]);

  return (
    <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
      Completing sign-in...
    </div>
  );
}
