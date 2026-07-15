import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import ContactFormEmail from '@/components/emails/ContactFormEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const fromEmail = typeof body.fromEmail === 'string' ? body.fromEmail.trim() : '';
        const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
        const message = typeof body.message === 'string' ? body.message.trim() : '';
        // Honeypot: real users never fill this hidden field.
        const honeypot = typeof body.company === 'string' ? body.company.trim() : '';

        // Silently accept bot submissions so they don't retry, but send nothing.
        if (honeypot) {
            return NextResponse.json({ ok: true });
        }

        // Validation
        if (!name || name.length > 100) {
            return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
        }
        if (!fromEmail || !EMAIL_REGEX.test(fromEmail) || fromEmail.length > 254) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
        }
        if (!subject || subject.length > 200) {
            return NextResponse.json({ error: 'Please enter a subject.' }, { status: 400 });
        }
        if (!message || message.length > 5000) {
            return NextResponse.json({ error: 'Please enter a message (under 5000 characters).' }, { status: 400 });
        }

        const data = await resend.emails.send({
            from: 'Portfolio Contact <info@antoniobrkic.com>',
            to: ['contact@antoniobrkic.com'],
            replyTo: fromEmail,
            subject: `[Portfolio] ${subject}`,
            react: ContactFormEmail({ name, fromEmail, subject, message }),
        });

        if (data.error) {
            console.error('Resend error:', data.error);
            return NextResponse.json({ error: 'Failed to send message.' }, { status: 502 });
        }

        return NextResponse.json({ ok: true, id: data.data?.id });
    } catch (error) {
        console.error('Contact route error:', error);
        return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
    }
}
