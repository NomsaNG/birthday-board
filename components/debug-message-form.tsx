"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface DebugMessageFormProps {
  staffMembers: Array<{ id: number; name: string }>
}

export function DebugMessageForm({ staffMembers }: DebugMessageFormProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null)
  const [senderName, setSenderName] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStaffId || !senderName.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
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
            staff_member_id: selectedStaffId,
            sender_name: senderName.trim(),
            message: message.trim(),
          },
        ])
        .select()

      console.log("Insert result:", { data, error })

      if (error) {
        toast({
          title: "Database Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success!",
          description: "Message added successfully",
        })
        setSenderName("")
        setMessage("")
        setSelectedStaffId(null)
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

  if (staffMembers.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-red-600">No staff members loaded. Please check database setup.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Debug: Add Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Staff Member</label>
            <select
              value={selectedStaffId || ""}
              onChange={(e) => setSelectedStaffId(Number(e.target.value) || null)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select staff member</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
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
