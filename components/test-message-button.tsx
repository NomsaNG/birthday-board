"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function TestMessageButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const testDatabaseConnection = async () => {
    setIsLoading(true)

    try {
      // Test reading from staff_members
      const { data: staffData, error: staffError } = await supabase.from("staff_members").select("id, name").limit(1)

      if (staffError) {
        toast({
          title: "Database Error",
          description: `Cannot read staff members: ${staffError.message}`,
          variant: "destructive",
        })
        return
      }

      if (!staffData || staffData.length === 0) {
        toast({
          title: "No Data",
          description: "No staff members found in database",
          variant: "destructive",
        })
        return
      }

      // Test inserting a message
      const testStaff = staffData[0]
      const { data: messageData, error: messageError } = await supabase
        .from("birthday_messages")
        .insert([
          {
            staff_member_id: testStaff.id,
            sender_name: "Test User",
            message: "This is a test message - you can delete this!",
          },
        ])
        .select()

      if (messageError) {
        toast({
          title: "Insert Error",
          description: `Cannot insert message: ${messageError.message}`,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success! ✅",
        description: `Test message added for ${testStaff.name}`,
      })
    } catch (err) {
      console.error("Test error:", err)
      toast({
        title: "Connection Error",
        description: "Failed to connect to database",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <Button onClick={testDatabaseConnection} disabled={isLoading} variant="outline" size="sm">
      {isLoading ? "Testing..." : "Test Database"}
    </Button>
  )
}
