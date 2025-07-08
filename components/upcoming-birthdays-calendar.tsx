"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Cake } from "lucide-react"

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

interface StaffMember {
  id: number
  name: string
  birthday_month: number
  birthday_day: number
}

interface UpcomingBirthdaysCalendarProps {
  staffMembers: StaffMember[]
}

export function UpcomingBirthdaysCalendar({ staffMembers }: UpcomingBirthdaysCalendarProps) {
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()

  // Get upcoming birthdays in current month (after today)
  const upcomingThisMonth = staffMembers
    .filter((staff) => staff.birthday_month === currentMonth && staff.birthday_day > currentDay)
    .sort((a, b) => a.birthday_day - b.birthday_day)

  // Get next month's birthdays if current month has few/no upcoming birthdays
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
  const nextMonthBirthdays = staffMembers
    .filter((staff) => staff.birthday_month === nextMonth)
    .sort((a, b) => a.birthday_day - b.birthday_day)

  const showNextMonth = upcomingThisMonth.length < 3

  return (
    <div className="space-y-6">
      {/* Current Month Upcoming */}
      {upcomingThisMonth.length > 0 && (
        <Card className="card bg-black bg-opacity-40">
          <CardHeader>
            <CardTitle className="flex items-center text-white gap-2">
              <Calendar className="h-5 w-5 text-white" />
              Upcoming in {MONTHS[currentMonth - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingThisMonth.map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                  <div>
                    <div className="font-medium text-gray-900">{staff.name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Cake className="h-3 w-3" />
                      {MONTHS[staff.birthday_month - 1]} {staff.birthday_day}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                    {staff.birthday_day - currentDay} day{staff.birthday_day - currentDay !== 1 ? "s" : ""}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Month (if needed) */}
      {showNextMonth && nextMonthBirthdays.length > 0 && (
        <Card className="card bg-black bg-opacity-40">
          <CardHeader>
            <CardTitle className="flex items-center text-white gap-2 ">
              <Calendar className="h-5 w-5 text-white" />
              Coming in {MONTHS[nextMonth - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nextMonthBirthdays.slice(0, 6).map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border">
                  <div>
                    <div className="font-medium text-gray-900">{staff.name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Cake className="h-3 w-3" />
                      {MONTHS[staff.birthday_month - 1]} {staff.birthday_day}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                    Next month
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No upcoming birthdays */}
      {upcomingThisMonth.length === 0 && nextMonthBirthdays.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming birthdays this month</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
