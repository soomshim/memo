import { createClient } from "@supabase/supabase-js";

// 접속 주소와 공개 키는 .env.local에 둔다. 교육용이라 로그인 없이 쓴다.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false } },
);
