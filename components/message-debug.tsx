"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MessageDebugProps {
  messages: Array<{
    id: number
    staff_member_id: number
    sender_name: string
    message: string
    created_at: string
  }>
  staffMembers: Array<{
    id: number
    name: string
    birthday_month: number
    birthday_day: number
  }>
}

export function MessageDebug({ messages, staffMembers }: MessageDebugProps) {
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()

  const todaysBirthdays = staffMembers.filter(
    (staff) => staff.birthday_month === currentMonth && staff.birthday_day === currentDay,
  )

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Debug: Messages & Today's Birthdays</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">
            Today's Date: {currentMonth}/{currentDay}
          </h4>
          <div className="space-y-1">
            {todaysBirthdays.length === 0 ? (
              <p className="text-gray-500">No birthdays today</p>
            ) : (
              todaysBirthdays.map((staff) => (
                <div key={staff.id} className="flex items-center gap-2">
                  <Badge>ID: {staff.id}</Badge>
                  <span>{staff.name}</span>
                  <span className="text-sm text-gray-500">
                    ({staff.birthday_month}/{staff.birthday_day})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">All Messages ({messages.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages found</p>
            ) : (
              messages.map((msg) => {
                const staff = staffMembers.find((s) => s.id === msg.staff_member_id)
                return (
                  <div key={msg.id} className="text-sm border p-2 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">ID: {msg.id}</Badge>
                      <Badge>Staff: {msg.staff_member_id}</Badge>
                      <span className="font-medium">{staff?.name || "Unknown"}</span>
                    </div>
                    <div className="text-gray-600">
                      <strong>{msg.sender_name}:</strong> {msg.message}
                    </div>
                    <div className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Messages for Today's Birthday People</h4>
          {todaysBirthdays.map((staff) => {
            const staffMessages = messages.filter((msg) => msg.staff_member_id === staff.id)
            return (
              <div key={staff.id} className="border p-2 rounded">
                <div className="font-medium">
                  {staff.name} (ID: {staff.id}) - {staffMessages.length} messages
                </div>
                {staffMessages.map((msg) => (
                  <div key={msg.id} className="text-sm text-gray-600 ml-4">
                    • {msg.sender_name}: {msg.message}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
