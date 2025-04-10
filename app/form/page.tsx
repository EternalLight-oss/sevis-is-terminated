"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { checkEmailExists, submitFormData } from "@/app/actions/form-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Define the form schema with Zod
const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine((email) => email.toLowerCase().endsWith(".edu"), {
      message: "Please enter a valid .edu email address",
    }),
  university: z.string().min(1, "Please select your university"),
  other_university: z.string().optional(),
  sevis_terminated: z.enum(["Yes", "No", "Unsure"], {
    required_error: "Please select an option",
  }),
  sevis_termination_date: z.date().optional().nullable(),
  sevis_notification_method: z.string().optional(),
  visa_revoked: z.enum(["Yes", "No", "Unsure"], {
    required_error: "Please select an option",
  }),
  visa_revocation_date: z.date().optional().nullable(),
  status_at_incident: z.enum(
    ["F-1 Student (Academic Program)", "F-1 Student (On Post-Completion OPT)", "F-1 Student (On STEM OPT Extension)"],
    {
      required_error: "Please select your status",
    },
  ),
  academic_level: z.string().optional(),
  termination_reason: z.array(z.string()).optional(),
  termination_reason_other: z.string().optional(),
  linked_to_law_enforcement: z.enum(["Yes", "No", "Unsure", "Prefer not to say"]).optional(),
  incident_type: z.string().optional(),
  was_arrested: z.enum(["Yes", "No", "Unsure"]).optional(),
  was_fingerprinted: z.enum(["Yes", "No", "Unsure"]).optional(),
  legal_case_status: z.string().optional(),
  h1b_status: z.string().optional(),
  legal_consultation: z.enum(["Yes", "No", "Planning To"]).optional(),
  immediate_plans: z.array(z.string()).optional(),
  consent_to_share: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

// Updated universities list with the provided universities
const universities = [
  { value: "Arizona State University", label: "Arizona State University" },
  { value: "Berkelee College of Music", label: "Berkelee College of Music" },
  { value: "Boston University", label: "Boston University" },
  { value: "California Institute of Technology", label: "California Institute of Technology" },
  { value: "Carnegie Mellon University", label: "Carnegie Mellon University" },
  { value: "Central Michigan University", label: "Central Michigan University" },
  { value: "Colorado State University", label: "Colorado State University" },
  { value: "Columbia University", label: "Columbia University" },
  { value: "Cornell University", label: "Cornell University" },
  { value: "Embry - Riddle International University", label: "Embry - Riddle International University" },
  { value: "Florida International University", label: "Florida International University" },
  { value: "Georgia Institute of Technology", label: "Georgia Institute of Technology" },
  { value: "Georgia Tech", label: "Georgia Tech" },
  { value: "Harvard University", label: "Harvard University" },
  { value: "Kent State University", label: "Kent State University" },
  { value: "Massachusetts Institute of Technology", label: "Massachusetts Institute of Technology" },
  { value: "Metropolitan State University", label: "Metropolitan State University" },
  { value: "Minnesota State University, Mankato", label: "Minnesota State University, Mankato" },
  { value: "New York University", label: "New York University" },
  { value: "North Carolina State University", label: "North Carolina State University" },
  { value: "Northeastern University", label: "Northeastern University" },
  { value: "Ohio State University", label: "Ohio State University" },
  { value: "Penn State", label: "Penn State" },
  { value: "Princeton University", label: "Princeton University" },
  { value: "Purdue University", label: "Purdue University" },
  { value: "Rutgers University", label: "Rutgers University" },
  { value: "South Dakota State University", label: "South Dakota State University" },
  { value: "St Cloud State University", label: "St Cloud State University" },
  { value: "Stanford University", label: "Stanford University" },
  { value: "Temple University", label: "Temple University" },
  { value: "Texas A&M", label: "Texas A&M" },
  { value: "Trine University", label: "Trine University" },
  { value: "Tufts University", label: "Tufts University" },
  { value: "UCLA", label: "UCLA" },
  { value: "University of Akron", label: "University of Akron" },
  { value: "University of Arkansas", label: "University of Arkansas" },
  { value: "University of California Berkeley", label: "University of California Berkeley" },
  { value: "University of California, Berkeley", label: "University of California, Berkeley" },
  { value: "University of California, Irvine", label: "University of California, Irvine" },
  { value: "University of California, Los Angeles", label: "University of California, Los Angeles" },
  { value: "University of California San Diego", label: "University of California San Diego" },
  { value: "University of Cincinnati", label: "University of Cincinnati" },
  { value: "University of Colorado", label: "University of Colorado" },
  { value: "University of Delaware", label: "University of Delaware" },
  { value: "University of Georgia", label: "University of Georgia" },
  { value: "University of Illinois Urbana-Champaign", label: "University of Illinois Urbana-Champaign" },
  { value: "University of Massachusetts", label: "University of Massachusetts" },
  { value: "University of Michigan", label: "University of Michigan" },
  { value: "University of Minnesota", label: "University of Minnesota" },
  { value: "University of Oregon", label: "University of Oregon" },
  { value: "University of Pennsylvania", label: "University of Pennsylvania" },
  { value: "University of South Carolina", label: "University of South Carolina" },
  { value: "University of Tampa", label: "University of Tampa" },
  { value: "University of Tennessee", label: "University of Tennessee" },
  { value: "University of Texas Arlington", label: "University of Texas Arlington" },
  { value: "University of Texas at Arlington", label: "University of Texas at Arlington" },
  { value: "University of Texas at Austin", label: "University of Texas at Austin" },
  { value: "University of Utah", label: "University of Utah" },
  { value: "University of Virginia", label: "University of Virginia" },
  { value: "University of Washington", label: "University of Washington" },
  { value: "University of Wisconsin-Madison", label: "University of Wisconsin-Madison" },
  { value: "University of Wisconsin Madison", label: "University of Wisconsin Madison" },
  { value: "Washington University St. Louis", label: "Washington University St. Louis" },
  { value: "Yale University", label: "Yale University" },
  { value: "Other", label: "Other" },
]

const terminationReasons = [
  { id: "ina-237-a-1-c-i", label: "INA 237(a)(1)(C)(i) (Failure to maintain status/comply with conditions)" },
  { id: "ina-237-a-4-c-i", label: "INA 237(a)(4)(C)(i) (Serious adverse foreign policy consequences)" },
  { id: "criminal-records-check", label: "Criminal Records Check (General mention)" },
  { id: "specific-criminal-activity", label: "Specific Criminal Activity Cited (e.g., DUI, Theft, Assault)" },
  { id: "protest-speech-activity", label: "Protest/Speech Activity Cited" },
  { id: "opt-cpt-violation", label: "OPT/CPT Violation Cited" },
  { id: "reason-unclear", label: "Reason Unclear / Not Provided by ICE/DSO" },
  { id: "other", label: "Other" },
  { id: "no-termination", label: "No Termination Yet (but received visa revocation)" },
]

const immediatePlans = [
  { id: "reinstatement", label: "Applying for SEVIS Reinstatement (Form I-539)" },
  { id: "litigation", label: "Exploring Litigation Options with Attorney" },
  { id: "depart", label: "Planning to Depart the U.S." },
  { id: "transfer", label: "Seeking Transfer to Another School (if applicable/possible)" },
  { id: "other-visa", label: "Exploring Other Visa Options" },
  { id: "waiting", label: "Waiting / Undecided / Gathering Information" },
  { id: "contacting-university", label: "Contacting University DSO/Officials" },
]

export default function FormPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      university: "",
      other_university: "",
      sevis_terminated: "No",
      visa_revoked: "No",
      status_at_incident: "F-1 Student (Academic Program)",
      termination_reason: [],
      immediate_plans: [],
      consent_to_share: true,
    },
  })

  const watchSevisTerminated = form.watch("sevis_terminated")
  const watchVisaRevoked = form.watch("visa_revoked")
  const watchStatusAtIncident = form.watch("status_at_incident")
  const watchLinkedToLawEnforcement = form.watch("linked_to_law_enforcement")
  const watchUniversity = form.watch("university")

  // Update the onSubmit function to handle the form data correctly

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(data.email)

      if (emailExists && !showDuplicateDialog) {
        setShowDuplicateDialog(true)
        setIsSubmitting(false)
        return
      }

      // Prepare the data for submission
      const finalData = {
        ...data,
        sevis_termination_date: data.sevis_termination_date ? data.sevis_termination_date.toISOString() : null,
        visa_revocation_date: data.visa_revocation_date ? data.visa_revocation_date.toISOString() : null,
      }

      await submitFormData(finalData, showDuplicateDialog)
      setSubmitSuccess(true)
      setShowDuplicateDialog(false)

      // Reset form after successful submission
      form.reset()

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError("There was an error submitting your data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Thank You for Your Submission</CardTitle>
            <CardDescription>
              Your information has been recorded anonymously and will help build a clearer picture of the current
              situation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-50">
              <AlertTitle>Submission Successful</AlertTitle>
              <AlertDescription>
                You will be redirected to the dashboard shortly to view aggregated data.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              View Dashboard Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">F-1 Student Data Collection Form</h1>
          <p className="text-muted-foreground">
            Please provide information about your experience with SEVIS termination or F-1 visa revocation. All
            submissions are anonymous and will only be used for aggregated data analysis.
          </p>
        </div>

        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Please provide your .edu email address. This helps us prevent duplicate submissions and will not be
                  shared.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (.edu required)</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@university.edu" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your email is only used to prevent duplicate submissions and will not be shared.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>University Information</CardTitle>
                <CardDescription>Please select your university or institution.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>University/Institution</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between"
                            >
                              {field.value
                                ? universities.find((university) => university.value === field.value)?.label
                                : "Select university..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search university..." />
                            <CommandList>
                              <CommandEmpty>No university found.</CommandEmpty>
                              <CommandGroup className="max-h-[300px] overflow-y-auto">
                                {universities.map((university) => (
                                  <CommandItem
                                    key={university.value}
                                    value={university.value}
                                    onSelect={() => {
                                      form.setValue("university", university.value)
                                      setOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === university.value ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {university.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchUniversity === "Other" && (
                  <FormField
                    control={form.control}
                    name="other_university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify your university</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your university name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEVIS Status</CardTitle>
                <CardDescription>Information about your SEVIS record status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="sevis_terminated"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Has your SEVIS record been terminated?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="No" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Unsure" />
                            </FormControl>
                            <FormLabel className="font-normal">Unsure</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(watchSevisTerminated === "Yes" || watchSevisTerminated === "Unsure") && (
                  <>
                    <FormField
                      control={form.control}
                      name="sevis_termination_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Approximate Date of SEVIS Termination</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("2025-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Month/Year required, Day optional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sevis_notification_method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How were you notified of the SEVIS termination?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select notification method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Email from DSO">Email from DSO</SelectItem>
                              <SelectItem value="Checked SEVP Portal">Checked SEVP Portal</SelectItem>
                              <SelectItem value="Notified by Attorney">Notified by Attorney</SelectItem>
                              <SelectItem value="Not yet confirmed, but suspect issue">
                                Not yet confirmed, but suspect issue
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visa Status</CardTitle>
                <CardDescription>Information about your F-1 visa status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="visa_revoked"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Did you receive notification that your F-1 visa was revoked by the Dept. of State?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="No" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Unsure" />
                            </FormControl>
                            <FormLabel className="font-normal">Unsure</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchVisaRevoked === "Yes" && (
                  <FormField
                    control={form.control}
                    name="visa_revocation_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Approximate Date of Visa Revocation Notification</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("2025-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>Month/Year required, Day optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status at Time of Incident</CardTitle>
                <CardDescription>Your F-1 status when the termination or revocation occurred.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status_at_incident"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Status at Time of Incident</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="F-1 Student (Academic Program)" />
                            </FormControl>
                            <FormLabel className="font-normal">F-1 Student (Academic Program)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="F-1 Student (On Post-Completion OPT)" />
                            </FormControl>
                            <FormLabel className="font-normal">F-1 Student (On Post-Completion OPT)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="F-1 Student (On STEM OPT Extension)" />
                            </FormControl>
                            <FormLabel className="font-normal">F-1 Student (On STEM OPT Extension)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchStatusAtIncident === "F-1 Student (Academic Program)" && (
                  <FormField
                    control={form.control}
                    name="academic_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select academic level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Undergraduate - Year 1">Undergraduate - Year 1</SelectItem>
                            <SelectItem value="Undergraduate - Year 2">Undergraduate - Year 2</SelectItem>
                            <SelectItem value="Undergraduate - Year 3">Undergraduate - Year 3</SelectItem>
                            <SelectItem value="Undergraduate - Year 4+">Undergraduate - Year 4+</SelectItem>
                            <SelectItem value="Master's - Year 1">Master's - Year 1</SelectItem>
                            <SelectItem value="Master's - Year 2+">Master's - Year 2+</SelectItem>
                            <SelectItem value="PhD - Year 1">PhD - Year 1</SelectItem>
                            <SelectItem value="PhD - Year 2">PhD - Year 2</SelectItem>
                            <SelectItem value="PhD - Year 3">PhD - Year 3</SelectItem>
                            <SelectItem value="PhD - Year 4">PhD - Year 4</SelectItem>
                            <SelectItem value="PhD - Year 5+">PhD - Year 5+</SelectItem>
                            <SelectItem value="Language Training">Language Training</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reason for Termination/Revocation</CardTitle>
                <CardDescription>
                  If known, select the reason(s) provided for the termination or revocation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="termination_reason"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">
                          Reason Provided for Termination/Revocation (if known)
                        </FormLabel>
                        <FormDescription>Select all that apply</FormDescription>
                      </div>
                      {terminationReasons.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="termination_reason"
                          render={({ field }) => {
                            return (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termination_reason_other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>If you selected "Other" above, please specify:</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide additional details about the reason for termination/revocation"
                          className="resize-none"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>This information will only be used for aggregation purposes.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Incident Details</CardTitle>
                <CardDescription>Optional information about any related incidents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="linked_to_law_enforcement"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Was the termination/revocation potentially linked to a past interaction with law enforcement?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="No" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Unsure" />
                            </FormControl>
                            <FormLabel className="font-normal">Unsure</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Prefer not to say" />
                            </FormControl>
                            <FormLabel className="font-normal">Prefer not to say</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchLinkedToLawEnforcement === "Yes" && (
                  <>
                    <FormField
                      control={form.control}
                      name="incident_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Incident (Select primary, if known)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select incident type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Traffic Misdemeanor">
                                Traffic Misdemeanor (e.g., reckless driving, &gt;20mph over)
                              </SelectItem>
                              <SelectItem value="DUI/DWI">DUI/DWI</SelectItem>
                              <SelectItem value="Drug-related">Drug-related (e.g., possession)</SelectItem>
                              <SelectItem value="Theft/Shoplifting">Theft/Shoplifting</SelectItem>
                              <SelectItem value="Assault">Assault</SelectItem>
                              <SelectItem value="Trespass">Trespass</SelectItem>
                              <SelectItem value="Domestic Incident">Domestic Incident</SelectItem>
                              <SelectItem value="Public Intoxication">Public Intoxication</SelectItem>
                              <SelectItem value="Protest-related Arrest">Protest-related Arrest</SelectItem>
                              <SelectItem value="Other Minor Offense">Other Minor Offense</SelectItem>
                              <SelectItem value="Other Felony Charge">Other Felony Charge</SelectItem>
                              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="was_arrested"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Were you arrested?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Yes" />
                                </FormControl>
                                <FormLabel className="font-normal">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="No" />
                                </FormControl>
                                <FormLabel className="font-normal">No</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Unsure" />
                                </FormControl>
                                <FormLabel className="font-normal">Unsure</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="was_fingerprinted"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Were you fingerprinted related to this incident?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Yes" />
                                </FormControl>
                                <FormLabel className="font-normal">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="No" />
                                </FormControl>
                                <FormLabel className="font-normal">No</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Unsure" />
                                </FormControl>
                                <FormLabel className="font-normal">Unsure</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="legal_case_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Status of that Legal Case</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select case status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Dismissed">Dismissed</SelectItem>
                              <SelectItem value="Convicted (Misdemeanor)">Convicted (Misdemeanor)</SelectItem>
                              <SelectItem value="Convicted (Felony)">Convicted (Felony)</SelectItem>
                              <SelectItem value="Expunged/Sealed">Expunged/Sealed</SelectItem>
                              <SelectItem value="Deferred Adjudication/Diversion Program">
                                Deferred Adjudication/Diversion Program
                              </SelectItem>
                              <SelectItem value="Resolved (Fine Paid/No Conviction)">
                                Resolved (Fine Paid/No Conviction)
                              </SelectItem>
                              <SelectItem value="Unknown">Unknown</SelectItem>
                              <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>H1B status, legal consultation, and immediate plans.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="h1b_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>H1B Lottery Status (Current Fiscal Year - 2025 Lottery)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select H1B status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Selected in Lottery">Selected in Lottery</SelectItem>
                          <SelectItem value="Not Selected">Not Selected</SelectItem>
                          <SelectItem value="Did Not Apply / Not Eligible">Did Not Apply / Not Eligible</SelectItem>
                          <SelectItem value="Application Filed (Pre-Selection) / Result Pending">
                            Application Filed (Pre-Selection) / Result Pending
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legal_consultation"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Have you consulted with an immigration attorney regarding this issue?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="No" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Planning To" />
                            </FormControl>
                            <FormLabel className="font-normal">Planning To</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="immediate_plans"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Immediate Plans</FormLabel>
                        <FormDescription>Select all that apply</FormDescription>
                      </div>
                      {immediatePlans.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="immediate_plans"
                          render={({ field }) => {
                            return (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consent</CardTitle>
                <CardDescription>Please review and provide consent for data sharing.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="consent_to_share"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I consent to share anonymized, aggregated data trends publicly</FormLabel>
                        <FormDescription>
                          Your individual submission will remain anonymous. Only aggregated trends and statistics will
                          be shared.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>

      {/* Dialog for duplicate email confirmation */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Already Exists</DialogTitle>
            <DialogDescription>
              An entry with this email already exists in our database. Would you like to overwrite the existing data?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDuplicateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => form.handleSubmit(onSubmit)()}>Overwrite Existing Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
