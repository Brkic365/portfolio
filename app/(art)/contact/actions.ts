'use server';

import { Resend } from 'resend';
import ContactFormEmail from '@/components/emails/ContactFormEmail';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactState {
  ok?: boolean;
  error?: string;
  /**
   * Echoed back on failure. React 19 resets an uncontrolled form once its
   * action resolves, so without this a validation error would throw away
   * whatever the person had typed.
   */
  values?: { name: string; fromEmail: string; subject: string; message: string };
  /** Bumped per submission so the inputs remount and pick up `values`. */
  attempt?: number;
}

/**
 * Server action behind the contact form. Runs on the server only, so the
 * Resend key never reaches the browser and there is no public POST endpoint
 * for bots to find.
 */
export async function sendMessage(
  prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const read = (k: string) => {
    const v = formData.get(k);
    return typeof v === 'string' ? v.trim() : '';
  };

  const name = read('name');
  const fromEmail = read('fromEmail');
  const subject = read('subject');
  const message = read('message');
  // Honeypot. Real people never see this field, let alone fill it.
  const honeypot = read('company');

  const attempt = (prev.attempt ?? 0) + 1;
  const values = { name, fromEmail, subject, message };
  const fail = (error: string): ContactState => ({ error, values, attempt });

  // Accept bot submissions silently so they don't retry, but send nothing.
  if (honeypot) return { ok: true };

  if (!name || name.length > 100) {
    return fail('Please enter your name.');
  }
  if (!fromEmail || !EMAIL_REGEX.test(fromEmail) || fromEmail.length > 254) {
    return fail('Please enter a valid email address.');
  }
  if (!subject || subject.length > 200) {
    return fail('Please enter a subject.');
  }
  if (!message || message.length > 5000) {
    return fail('Please enter a message, under 5000 characters.');
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('Contact form: RESEND_API_KEY is not set.');
    return fail('Mail is not configured right now. Please email me directly.');
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await resend.emails.send({
      from: 'Portfolio Contact <info@antoniobrkic.com>',
      to: ['contact@antoniobrkic.com'],
      replyTo: fromEmail,
      subject: `[Portfolio] ${subject}`,
      react: ContactFormEmail({ name, fromEmail, subject, message }),
    });

    if (data.error) {
      console.error('Resend error:', data.error);
      return fail('Sending failed. Please email me directly.');
    }

    return { ok: true };
  } catch (error) {
    console.error('Contact action error:', error);
    return fail('Sending failed. Please email me directly.');
  }
}
