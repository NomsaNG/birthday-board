"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function SimpleMessageTest() {
  const [staffId, setStaffId] = useState("")
  const [senderName, setSenderName] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("=== SIMPLE TEST SUBMISSION ===")
    console.log("Staff ID:", staffId)
    console.log("Sender:", senderName)
    console.log("Message:", message)

    if (!staffId || !senderName.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("birthday_messages")
        .insert([
          {
            staff_member_id: Number.parseInt(staffId),
            sender_name: senderName.trim(),
            message: message.trim(),
          },
        ])
        .select()

      console.log("Result:", { data, error })

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success!",
          description: "Message added successfully",
        })
        setStaffId("")
        setSenderName("")
        setMessage("")
      }
    } catch (err) {
      console.error("Error:", err)
      toast({
        title: "Error",
        description: "Failed to add message",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Simple Message Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Staff ID (try 5 for Kaele)</label>
            <Input
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="Enter staff ID number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <Input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows={3}
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding..." : "Add Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
