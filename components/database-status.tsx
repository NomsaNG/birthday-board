"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState("")

  const checkConnection = async () => {
    setStatus("checking")
    try {
      const { data, error } = await supabase.from("staff_members").select("count", { count: "exact", head: true })

      if (error) {
        setStatus("error")
        setErrorMessage(error.message)
      } else {
        setStatus("connected")
        setErrorMessage("")
      }
    } catch (err) {
      setStatus("error")
      setErrorMessage("Unable to connect to database")
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (status === "checking") {
    return (
      <Alert>
        <RefreshCw className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking Database Connection</AlertTitle>
        <AlertDescription>Verifying database setup...</AlertDescription>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database Setup Required</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-2">{errorMessage}</p>
          <p className="mb-3">
            Please run the SQL script to set up the database tables. You can find it in the scripts folder.
          </p>
          <Button onClick={checkConnection} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Database Connected</AlertTitle>
      <AlertDescription className="text-green-700">All systems ready!</AlertDescription>
    </Alert>
  )
}
