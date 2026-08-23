'use client';

import { useActionState } from 'react';
import { sendMessage, type ContactState } from '@/app/(art)/contact/actions';

const field = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--rule)',
  color: 'var(--ink)',
  padding: '0.75rem 0',
  fontSize: '1.05rem',
  outline: 'none',
} as const;

/**
 * The one interactive island on the site. Everything else is a server
 * component; a contact form is the place where inline errors and a pending
 * state are worth the client bundle.
 */
export default function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendMessage,
    {},
  );

  if (state.ok) {
    return (
      <div
        className="art-serif"
        style={{
          fontSize: '1.3rem',
          lineHeight: 1.5,
          color: 'var(--ink)',
          borderTop: '2px solid var(--accent)',
          paddingTop: '1.5rem',
        }}
      >
        Thanks, that reached me. I usually reply within a day or two.
      </div>
    );
  }

  const v = state.values;

  return (
    // Keyed on the attempt so the inputs remount and re-apply defaultValue
    // after React resets the form on a failed submission.
    <form
      key={state.attempt ?? 0}
      action={formAction}
      className="grid gap-7"
      style={{ maxWidth: '36rem' }}
    >
      {/* Honeypot. Hidden from people, catches bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
      />

      <div className="grid sm:grid-cols-2 gap-7">
        <div>
          <label htmlFor="name" className="art-mono block mb-2" style={{ color: 'var(--ink-3)' }}>
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
            style={field}
          />
        </div>
        <div>
          <label htmlFor="fromEmail" className="art-mono block mb-2" style={{ color: 'var(--ink-3)' }}>
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
            style={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="art-mono block mb-2" style={{ color: 'var(--ink-3)' }}>
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          defaultValue={v?.subject}
          style={field}
        />
      </div>

      <div>
        <label htmlFor="message" className="art-mono block mb-2" style={{ color: 'var(--ink-3)' }}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={6}
          defaultValue={v?.message}
          style={{ ...field, resize: 'vertical' }}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="art-mono"
          style={{ color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0.9rem 1rem' }}
        >
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-6">
        <button
          type="submit"
          disabled={pending}
          className="art-mono"
          style={{
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            padding: '1em 1.8em',
            border: 'none',
            cursor: pending ? 'default' : 'pointer',
            opacity: pending ? 0.7 : 1,
          }}
        >
          {pending ? 'Sending' : 'Send message'}
        </button>
        <span className="art-mono" style={{ color: 'var(--ink-3)' }}>
          or contact@antoniobrkic.com
        </span>
      </div>
    </form>
  );
}
