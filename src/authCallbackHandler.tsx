import { useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function AuthCallbackHandler() {
  useEffect(() => {
    async function handleLogin() {
      // Supabase parses the token from URL fragment (#access_token=...)
      await supabase.auth.getSession();

      // After session is saved, return to main UI
      window.location.href = "/";
    }

    handleLogin();
  }, []);

  return (
    <div style={{ color: "white", paddingTop: "100px", textAlign: "center" }}>
      Completing login...
    </div>
  );
}
