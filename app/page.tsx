"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { supabase, type StaffMember, type BirthdayMessage } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Send, RefreshCw, Cake } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StickyNote } from "@/components/sticky-note"
import { UpcomingBirthdaysCalendar } from "@/components/upcoming-birthdays-calendar"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const STICKY_COLORS = [
  "bg-yellow-200 border-yellow-300",
  "bg-pink-200 border-pink-300",
  "bg-blue-200 border-blue-300",
  "bg-green-200 border-green-300",
  "bg-purple-200 border-purple-300",
  "bg-orange-200 border-orange-300",
]

// Updated positions to reduce overlap
const STICKY_POSITIONS = [
  // Top row
  { top: "0%", left: "0%", rotation: "-rotate-3" },
  { top: "0%", left: "15%", rotation: "rotate-2" },
  { top: "0%", right: "15%", rotation: "-rotate-2" },
  { top: "0%", right: "0%", rotation: "rotate-4" },

  // Middle-high row
  { top: "25%", left: "0%", rotation: "rotate-3" },
  { top: "25%", right: "0%", rotation: "-rotate-1" },

  // Middle-low row
  { top: "25%", left: "15%", rotation: "-rotate-4" },
  { top: "25%", right: "15%", rotation: "rotate-2" },

  // Bottom row
  { bottom: "22%", left: "0%", rotation: "rotate-2" },
  { bottom: "1%", left: "32%", rotation: "-rotate-3" },
  { bottom: "22%", right: "15%", rotation: "rotate-4" },
  { bottom: "22%", right: "0%", rotation: "-rotate-2" },

  // Filler positions for more notes
  { top: "74%", left: "50%", rotation: "rotate-1" },
  { top: "50%", left: "15%", rotation: "-rotate-2" },
  { top: "75%", left: "0%", rotation: "rotate-3" },
  { top: "75%", right: "0%", rotation: "-rotate-1" },
  { top: "76%", right: "69%", rotation: "rotate-2" },
  { top: "75%", right: "15%", rotation: "-rotate-3" },

  // Additional positions for new sticky notes
  { top: "10%", left: "10%", rotation: "rotate-1" },
  { top: "10%", right: "10%", rotation: "-rotate-1" },
  { bottom: "10%", left: "10%", rotation: "rotate-2" },
  { bottom: "10%", right: "10%", rotation: "-rotate-2" },
]

const MAX_MESSAGE_LENGTH = 250

export default function BirthdayBoard() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [messages, setMessages] = useState<BirthdayMessage[]>([])
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [senderName, setSenderName] = useState("")
  const [messageText, setMessageText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showUpcomingBirthdays, setShowUpcomingBirthdays] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStaffMembers()
    fetchMessages()

    // Set up real-time subscription
    const messagesSubscription = supabase
      .channel("birthday_messages_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "birthday_messages",
        },
        () => {
          fetchMessages()
        },
      )
      .subscribe()

    return () => {
      messagesSubscription.unsubscribe()
    }
  }, [])

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("staff_members")
        .select("*")
        .order("birthday_month", { ascending: true })
        .order("birthday_day", { ascending: true })

      if (error) {
        console.error("Error fetching staff members:", error)
      } else {
        setStaffMembers(data || [])
      }
    } catch (err) {
      console.error("Unexpected error:", err)
    }
  }

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("birthday_messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching messages:", error)
      } else {
        setMessages(data || [])
      }
    } catch (err) {
      console.error("Unexpected error fetching messages:", err)
    }
  }

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStaff) {
      toast({
        title: "Error",
        description: "No staff member selected",
        variant: "destructive",
      })
      return
    }

    if (!senderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    if (!messageText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
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
            staff_member_id: selectedStaff.id,
            sender_name: senderName.trim(),
            message: messageText.trim(),
          },
        ])
        .select()

      if (error) {
        toast({
          title: "Error",
          description: `Failed to send message: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success! 🎉",
          description: `Birthday note added for ${selectedStaff.name}!`,
        })
        setSenderName("")
        setMessageText("")
        setDialogOpen(false)
        setSelectedStaff(null)
        fetchMessages()
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  const getMessagesForStaff = (staffId: number) => {
    return messages.filter((msg) => msg.staff_member_id === staffId)
  }

  const formatDate = (month: number, day: number) => {
    return `${MONTHS[month - 1]} ${day}`
  }

  // const isTodaysBirthday = (month: number, day: number) => {
  //   const today = new Date();
  //   const currentMonth = today.getMonth() + 1; // Months are zero-based
  //   const currentDay = today.getDate();

  //   return month === currentMonth && day === currentDay;
  // }


  const isTodaysBirthday = (month: number, day: number) => {
    // Hardcoded test date: September 20
    const currentMonth = 9;
    const currentDay = 20;
  
    return month === currentMonth && day === currentDay;
  };
  // Get today's birthday people
  const todaysBirthdays = staffMembers.filter((staff) => isTodaysBirthday(staff.birthday_month, staff.birthday_day))

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{ backgroundImage: "url('/images/background.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-2">
          <img src="/images/logo.png" alt="Birthday Board Logo" className="h-16 " />
          <h1 className="text-4xl font-bold text-gray-900"></h1>
        </div>

        {/* Toggle Section */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setShowUpcomingBirthdays(!showUpcomingBirthdays)}
            className="bg-gradient-to-r  from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700  text-white font-bold py-2 px-4 rounded-full shadow-lg"
          >
            {showUpcomingBirthdays ? "Back to Messages" : "Upcoming Birthdays"}
          </Button>
        </div>

        {/* Conditional Rendering Based on Toggle */}
        <div className="relative bg-black bg-opacity-50 rounded-3xl border-4 border-dashed border-purple-300 p-8 min-h-[80vh] overflow-hidden">
          {showUpcomingBirthdays ? (
            <UpcomingBirthdaysCalendar staffMembers={staffMembers} />
          ) : (
            <>
              {todaysBirthdays.length === 0 && (
                <div className="text-center mt-20 text-yellow-400 text-5xl">
                  No birthdays today!
                </div>
              )}
              {todaysBirthdays.map((staff) => {
                const staffMessages = getMessagesForStaff(staff.id);

                return (
                  <div key={staff.id} className="mb-16">
                    {/* Scattered Sticky Notes */}
                    {staffMessages.map((msg, index) => {
                      const position = STICKY_POSITIONS[index % STICKY_POSITIONS.length];
                      const colorClass = STICKY_COLORS[index % STICKY_COLORS.length];

                      return (
                        <div
                          key={msg.id}
                          className={`absolute z-10 hover:z-50 focus:z-50`} // Adjust z-index on hover or focus
                          style={{
                            top: position.top,
                            left: position.left,
                            right: position.right,
                            bottom: position.bottom,
                          }}
                        >
                          <div className={`${position.rotation} max-w-[200px]`}>
                            <StickyNote
                              message={msg.message}
                              senderName={msg.sender_name}
                              createdAt={msg.created_at}
                              colorClass={colorClass}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Center Content */}
                    <div className="relative z-20 text-center flex flex-col items-center justify-center h-full">
                      <div className="mb-8">
                        <h3 className="text-4xl font-bold text-yellow-400 mb-4">
                          Happy Birthday {staff.name}!
                        </h3>
                        <p className="text-2xl text-yellow-400">
                          {formatDate(staff.birthday_month, staff.birthday_day)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-center gap-4 mb-8">
                        <Dialog
                          open={selectedStaff?.id === staff.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setSelectedStaff(staff);
                            } else {
                              setSelectedStaff(null);
                              setSenderName("");
                              setMessageText("");
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="lg"
                              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg text-lg"
                            >
                              <Send className="h-5 w-5 mr-2" />
                              Add Birthday Note
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-center text-2xl">
                                Birthday Note for {staff.name}
                              </DialogTitle>
                              <DialogDescription className="text-center">
                                Add your special birthday message!
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmitMessage} className="space-y-4">
                              <div>
                                <Label htmlFor="sender">Your Name</Label>
                                <Input
                                  id="sender"
                                  value={senderName}
                                  onChange={(e) => setSenderName(e.target.value)}
                                  placeholder="Enter your name"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="message">Birthday Message</Label>
                                <Textarea
                                  id="message"
                                  value={messageText}
                                  onChange={(e) => setMessageText(e.target.value)}
                                  placeholder="Write your birthday message..."
                                  rows={4}
                                  required
                                  maxLength={MAX_MESSAGE_LENGTH}
                                />
                                <div className="text-right text-xs text-muted-foreground mt-1">
                                  {messageText.length} / {MAX_MESSAGE_LENGTH}
                                </div>
                              </div>
                              <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Adding Note..." : "Add Birthday Note"}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {staffMessages.length === 0 && (
                        <p className="text-lg text-yellow-400">
                          Be the first to add a birthday note!
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
