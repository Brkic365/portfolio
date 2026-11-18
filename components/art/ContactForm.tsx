'use client';

import { useActionState } from 'react';
import { sendMessage, type ContactState } from '@/app/(art)/contact/actions';

/**
 * The contact form. A contact form is the place where inline errors and a
 * pending state are worth the client bundle; everything else on the page is
 * a server component.
 */
export default function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendMessage,
    {},
  );

  if (state.ok) {
    return (
      <div className="sent" role="status">
        Thanks, that reached me. I usually reply within a day or two.
      </div>
    );
  }

  const v = state.values;

  return (
    // Keyed on the attempt so the inputs remount and re-apply defaultValue
    // after React resets the form on a failed submission.
    <form key={state.attempt ?? 0} action={formAction} className="form">
      {/* Honeypot. Hidden from people, catches bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
      />

      <div className="two">
        <div>
          <label htmlFor="name" className="small">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            defaultValue={v?.name}
          />
        </div>
        <div>
          <label htmlFor="fromEmail" className="small">
            Your email
          </label>
          <input
            id="fromEmail"
            name="fromEmail"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            defaultValue={v?.fromEmail}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="small">
          Subject
        </label>
        <input id="subject" name="subject" type="text" required maxLength={200} defaultValue={v?.subject} />
      </div>

      <div>
        <label htmlFor="message" className="small">
          Message
        </label>
        <textarea id="message" name="message" required maxLength={5000} rows={6} defaultValue={v?.message} />
      </div>

      {state.error && (
        <p role="alert" className="err small">
          {state.error}
        </p>
      )}

      <div className="send">
        <button type="submit" disabled={pending}>
          {pending ? 'Sending' : 'Send message'}
        </button>
        <span className="alt small">or contact@antoniobrkic.com</span>
      </div>
    </form>
  );
}
