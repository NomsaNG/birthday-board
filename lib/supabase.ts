import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type StaffMember = {
  id: number
  name: string
  birthday_month: number
  birthday_day: number
  created_at: string
}

export type BirthdayMessage = {
  id: number
  staff_member_id: number
  sender_name: string
  message: string
  created_at: string
}
