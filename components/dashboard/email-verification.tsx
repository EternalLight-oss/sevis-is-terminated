"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { verifyEmail } from "@/app/actions/dashboard-actions"

const emailSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine((email) => email.toLowerCase().endsWith(".edu"), {
      message: "Please enter a valid .edu email address",
    }),
})

type EmailFormValues = z.infer<typeof emailSchema>

interface EmailVerificationProps {
  onVerificationSuccess: () => void
}

export function EmailVerification({ onVerificationSuccess }: EmailVerificationProps) {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: EmailFormValues) {
    setIsVerifying(true)
    setVerificationError(null)

    try {
      const result = await verifyEmail(data.email)

      if (result.exists) {
        // Store verification in session storage to persist across page refreshes
        sessionStorage.setItem("dashboardVerified", "true")
        sessionStorage.setItem("verifiedEmail", data.email)
        onVerificationSuccess()
      } else {
        setVerificationError("No submission found with this email. Please submit your data first.")
      }
    } catch (error) {
      console.error("Error verifying email:", error)
      setVerificationError("An error occurred while verifying your email. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Dashboard Access</CardTitle>
          <CardDescription>
            Please verify your email to access the dashboard. You must have previously submitted data to view the
            dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>{verificationError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@university.edu" {...field} />
                    </FormControl>
                    <FormDescription>Enter the .edu email you used when submitting your data.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={form.handleSubmit(onSubmit)} disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/form")}>
            Submit Data First
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
