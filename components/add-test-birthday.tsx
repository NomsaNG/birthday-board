"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Cake, Plus } from "lucide-react"

export function AddTestBirthday() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const addTestBirthdayPerson = async () => {
    setIsLoading(true)

    try {
      const today = new Date()
      const currentMonth = today.getMonth() + 1
      const currentDay = today.getDate()

      // Check if test person already exists for today
      const { data: existing } = await supabase
        .from("staff_members")
        .select("id")
        .eq("name", "Test Birthday Person")
        .eq("birthday_month", currentMonth)
        .eq("birthday_day", currentDay)

      if (existing && existing.length > 0) {
        toast({
          title: "Test Person Already Exists",
          description: "There's already a test birthday person for today!",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Add test staff member
      const { data: staffData, error: staffError } = await supabase
        .from("staff_members")
        .insert([
          {
            name: "Test Birthday Person",
            birthday_month: currentMonth,
            birthday_day: currentDay,
          },
        ])
        .select()

      if (staffError) {
        throw staffError
      }

      const testStaff = staffData[0]

      // Add sample messages
      const sampleMessages = [
        {
          staff_member_id: testStaff.id,
          sender_name: "Welcome Team",
          message:
            "Happy Birthday! 🎉 This is a test message to show how the birthday board works. Hope you have an amazing day filled with joy and celebration! 🎂🎈",
        },
        {
          staff_member_id: testStaff.id,
          sender_name: "Birthday Bot",
          message:
            "Wishing you all the best on your special day! May this year bring you happiness, success, and lots of cake! 🍰✨",
        },
        {
          staff_member_id: testStaff.id,
          sender_name: "Demo User",
          message:
            "Another birthday wish! These messages appear as colorful sticky notes. You can add your own messages too! 🎊",
        },
      ]

      const { error: messagesError } = await supabase.from("birthday_messages").insert(sampleMessages)

      if (messagesError) {
        throw messagesError
      }

      toast({
        title: "Success! 🎉",
        description: `Test birthday person added for today (${currentMonth}/${currentDay}) with sample messages!`,
      })

      // Refresh the page to show the new birthday person
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      console.error("Error adding test birthday person:", err)
      toast({
        title: "Error",
        description: "Failed to add test birthday person",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const removeTestBirthdayPerson = async () => {
    setIsLoading(true)

    try {
      const today = new Date()
      const currentMonth = today.getMonth() + 1
      const currentDay = today.getDate()

      // Delete test person and their messages (cascade will handle messages)
      const { error } = await supabase
        .from("staff_members")
        .delete()
        .eq("name", "Test Birthday Person")
        .eq("birthday_month", currentMonth)
        .eq("birthday_day", currentDay)

      if (error) {
        throw error
      }

      toast({
        title: "Removed",
        description: "Test birthday person removed",
      })

      // Refresh the page
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      console.error("Error removing test birthday person:", err)
      toast({
        title: "Error",
        description: "Failed to remove test birthday person",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cake className="h-5 w-5 text-pink-500" />
          Test Birthday Feature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Add a test person with today's birthday to see the special birthday display and sticky notes in action!
        </p>
        <div className="flex gap-2">
          <Button onClick={addTestBirthdayPerson} disabled={isLoading} className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? "Adding..." : "Add Test Birthday"}
          </Button>
          <Button onClick={removeTestBirthdayPerson} disabled={isLoading} variant="outline" className="flex-1">
            {isLoading ? "Removing..." : "Remove Test"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
