import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

// 접속 주소와 공개 키는 .env.local에 둔다. 교육용이라 로그인 없이 쓴다.
// 서버에서 그릴 때는 쓰지 않으므로 브라우저에서 처음 부를 때 만든다.
export function getSupabase() {
  client ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
  return client;
}
