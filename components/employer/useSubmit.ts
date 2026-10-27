'use client'

import { startTransition, type FormEvent } from 'react'

/**
 * React 19 resets uncontrolled fields after a <form action> runs, even when the
 * action returns a validation error. Submitting through onSubmit keeps what the
 * employer typed, and passes the clicked button (name="intent") along.
 */
export function useSubmit(action: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null
    const fd = new FormData(e.currentTarget, submitter)
    startTransition(() => action(fd))
  }
}
