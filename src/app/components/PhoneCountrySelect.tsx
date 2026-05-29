"use client"

import React, { useEffect, useId, useRef, useState } from 'react'
import {
  DEFAULT_PHONE_COUNTRY_ISO,
  PHONE_COUNTRIES,
  getDialCodeFromIso,
  getPhoneCountryByIso,
} from '@/lib/phoneCountryCodes'

type PhoneCountrySelectProps = {
  countryIso: string
  onCountryIsoChange: (isoCode: string) => void
  hasError?: boolean
}

export default function PhoneCountrySelect({
  countryIso,
  onCountryIsoChange,
  hasError = false,
}: PhoneCountrySelectProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selectedIso = countryIso || DEFAULT_PHONE_COUNTRY_ISO
  const selectedCountry = getPhoneCountryByIso(selectedIso)
  const dialCode = selectedCountry?.dialCode ?? '1'

  function selectCountry(isoCode: string) {
    onCountryIsoChange(isoCode)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className={`phone-country-picker ${open ? 'is-open' : ''} ${hasError ? 'phone-country-picker-error' : ''}`}
    >
      <button
        type="button"
        className="phone-country-trigger"
        aria-label={`Country code +${dialCode}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
      >
        <span>+{dialCode}</span>
      </button>

      {open && (
        <ul id={listboxId} className="phone-country-menu" role="listbox" aria-label="Country codes">
          {PHONE_COUNTRIES.map((country) => {
            const isSelected = country.isoCode === selectedIso
            return (
              <li key={country.isoCode} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`phone-country-option ${isSelected ? 'is-selected' : ''}`}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    selectCountry(country.isoCode)
                  }}
                >
                  {country.name} (+{country.dialCode})
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
