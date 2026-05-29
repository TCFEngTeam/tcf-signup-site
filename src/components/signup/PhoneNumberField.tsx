"use client"

import React, { useRef } from 'react'
import {
  formatNationalPhoneDisplay,
  getCursorAfterDigitIndex,
} from '@/lib/signup/format-fields'
import { getDialCodeFromIso } from '@/lib/phone/country-codes'
import PhoneCountrySelect from './PhoneCountrySelect'

type PhoneNumberFieldProps = {
  countryIso: string
  nationalDigits: string
  onCountryIsoChange: (isoCode: string) => void
  onNationalDigitsChange: (digits: string) => void
  onBlur?: () => void
  hasError?: boolean
}

export default function PhoneNumberField({
  countryIso,
  nationalDigits,
  onCountryIsoChange,
  onNationalDigitsChange,
  onBlur,
  hasError = false,
}: PhoneNumberFieldProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialCode = getDialCodeFromIso(countryIso)
  const usesUsFormatting = dialCode === '1'
  const displayValue = formatNationalPhoneDisplay(nationalDigits, countryIso)
  const maxDigits = usesUsFormatting ? 10 : 15

  function updateDigits(nextDigits: string, cursorDigitIndex?: number) {
    onNationalDigitsChange(nextDigits)

    if (cursorDigitIndex !== undefined && inputRef.current) {
      const formatted = formatNationalPhoneDisplay(nextDigits, countryIso)
      const nextCursor = getCursorAfterDigitIndex(formatted, cursorDigitIndex)
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(nextCursor, nextCursor)
      })
    }
  }

  function handleCountryIsoChange(nextIso: string) {
    onCountryIsoChange(nextIso)
    const nextDialCode = getDialCodeFromIso(nextIso)
    const nextMax = nextDialCode === '1' ? 10 : 15
    if (nationalDigits.length > nextMax) {
      onNationalDigitsChange(nationalDigits.slice(0, nextMax))
    }
  }

  function handleRowBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!rowRef.current?.contains(e.relatedTarget as Node)) {
      onBlur?.()
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nextDigits = e.target.value.replace(/\D/g, '').slice(0, maxDigits)
    updateDigits(nextDigits)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!usesUsFormatting) return
    if (e.key !== 'Backspace' && e.key !== 'Delete') return

    const input = e.currentTarget
    const cursor = input.selectionStart ?? 0
    const selectionEnd = input.selectionEnd ?? cursor
    if (selectionEnd !== cursor) return

    const charTarget =
      e.key === 'Backspace'
        ? displayValue[cursor - 1]
        : displayValue[cursor]

    if (!charTarget || /\d/.test(charTarget)) return

    e.preventDefault()

    const digitsBeforeCursor = displayValue.slice(0, cursor).replace(/\D/g, '').length

    if (e.key === 'Backspace') {
      if (digitsBeforeCursor === 0) return
      const nextDigits =
        nationalDigits.slice(0, digitsBeforeCursor - 1) +
        nationalDigits.slice(digitsBeforeCursor)
      updateDigits(nextDigits, digitsBeforeCursor - 1)
      return
    }

    if (digitsBeforeCursor >= nationalDigits.length) return
    const nextDigits =
      nationalDigits.slice(0, digitsBeforeCursor) +
      nationalDigits.slice(digitsBeforeCursor + 1)
    updateDigits(nextDigits, digitsBeforeCursor)
  }

  return (
    <div
      ref={rowRef}
      className={`phone-field-row ${hasError ? 'phone-field-row-error' : ''}`}
      onBlur={handleRowBlur}
    >
      <PhoneCountrySelect
        countryIso={countryIso}
        onCountryIsoChange={handleCountryIsoChange}
        hasError={hasError}
      />

      <input
        ref={inputRef}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="phone-national-input"
        placeholder={usesUsFormatting ? '(571) 482-0864' : 'Phone number'}
      />
    </div>
  )
}
