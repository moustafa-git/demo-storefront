import { NextRequest, NextResponse } from 'next/server'
import { retrieveCustomer } from '@lib/data/customer'
import nodemailer from 'nodemailer'

// Simple in-memory rate limiter per IP
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 5
const rateMap: Map<string, { count: number; resetAt: number }> = new Map()

function isRateLimited(ip: string | null | undefined): boolean {
  const key = ip || 'unknown'
  const now = Date.now()
  const entry = rateMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count += 1
  if (entry.count > RATE_LIMIT_MAX) {
    return true
  }
  return false
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.ip
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Auth is optional: allow guests if they provide an email
    const customer = await retrieveCustomer().catch(() => null)

    const body = await request.json()
    const subject = String(body?.subject || '').trim()
    const message = String(body?.message || '').trim()
    const priority = String(body?.priority || 'normal')
    const orderNumber = String(body?.orderNumber || '').trim()
    const email = String(body?.email || customer?.email || '').trim()
    const name = String(body?.name || '').trim()
    const honeypot = String(body?.company || '').trim()

    if (honeypot) {
      // bot detected
      return NextResponse.json({ success: true })
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      )
    }
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification to your support team
    // 3. Send confirmation email to customer
    
    const recipients = [
      'saralilly78@hotmail.com',
      'sasal@mednauts.com',
      'sasal@spaceaids.com',
      'mednautsaid@gmail.com',
    ]

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    })

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;line-height:1.6;color:#111">
        <h2 style="margin:0 0 12px">New support request</h2>
        <p style="margin:0 0 8px"><strong>From:</strong> ${name ? `${name} &lt;${email}&gt;` : email}</p>
        ${orderNumber ? `<p style="margin:0 0 8px"><strong>Order #:</strong> ${orderNumber}</p>` : ''}
        <p style="margin:0 0 8px"><strong>Priority:</strong> ${priority}</p>
        <p style="margin:16px 0 8px"><strong>Subject:</strong> ${subject}</p>
        <div style="white-space:pre-wrap;border:1px solid #eee;padding:12px;border-radius:8px">${message}</div>
      </div>
    `

    await transporter.sendMail({
      from: process.env.SMTP_FROM || email,
      replyTo: email,
      to: recipients.join(', '),
      subject: `[Support] ${subject}`,
      html,
    })

    return NextResponse.json({
      success: true,
      message: 'Support request submitted successfully'
    })

  } catch (error) {
    console.error('Support request error:', error)
    return NextResponse.json(
      { error: 'Failed to submit support request' },
      { status: 500 }
    )
  }
}
