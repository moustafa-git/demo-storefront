"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

export default function ContactSupportPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [customerEmail] = useState<string>("")

  // Honeypot
  const honeypotRef = useRef<HTMLInputElement | null>(null)

  // We intentionally avoid server calls here; email can be entered manually

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (honeypotRef.current?.value) {
      // Bot detected
      return
    }

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      priority: String(formData.get("priority") || "normal"),
      orderNumber: String(formData.get("orderNumber") || "").trim(),
    }

    // Basic client-side validation
    if (!payload.subject || !payload.message) {
      setError("Please provide a subject and message.")
      return
    }
    if (!customerEmail && !payload.email) {
      setError("Please provide your email so we can reach you back.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit support request")
      }

      setSuccess("Your request has been sent. We’ll get back to you shortly.")
      e.currentTarget.reset()
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="content-container py-12 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Contact customer support</h1>
      <p className="text-ui-fg-subtle mt-2">
        Reach out with your question and we’ll respond via email.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        {/* Honeypot field */}
        <input
          ref={honeypotRef}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="txt-small-plus text-ui-fg-subtle">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full mt-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#C10007]"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="txt-small-plus text-ui-fg-subtle">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={customerEmail}
                className="w-full mt-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#C10007]"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="orderNumber" className="txt-small-plus text-ui-fg-subtle">
              Order number (optional)
            </label>
            <input
              id="orderNumber"
              name="orderNumber"
              type="text"
              className="w-full mt-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#C10007]"
              placeholder="#12345"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="subject" className="txt-small-plus text-ui-fg-subtle">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="w-full mt-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#C10007]"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label htmlFor="priority" className="txt-small-plus text-ui-fg-subtle">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="w-full mt-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#C10007]"
                defaultValue="normal"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="txt-small-plus text-ui-fg-subtle">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full mt-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#C10007]"
              placeholder="Provide details to help us assist you faster"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm" role="status">
            {success}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-md bg-[#212121] px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send message"}
          </button>
        </div>
      </form>
    </div>
  )
}


