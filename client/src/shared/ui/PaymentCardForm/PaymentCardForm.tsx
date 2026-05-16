"use client";

import "./PaymentCardForm.css";
import { useEffect, useState } from "react";

type PaymentCardFormProps = {
  onValidityChange?: (valid: boolean) => void;
};

const digitsOnly = (value: string, max: number) =>
  value.replace(/\D/g, "").slice(0, max);

export function PaymentCardForm({ onValidityChange }: PaymentCardFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const cardDigits = digitsOnly(cardNumber, 16);
  const expiryDigits = digitsOnly(expiry, 4);
  const cvvDigits = digitsOnly(cvv, 4);
  const month = Number(expiryDigits.slice(0, 2));

  const valid =
    cardDigits.length === 16 &&
    expiryDigits.length === 4 &&
    month >= 1 &&
    month <= 12 &&
    cvvDigits.length >= 3;

  useEffect(() => {
    onValidityChange?.(valid);
  }, [valid, onValidityChange]);

  return (
    <form
      className="payment-card-form"
      onSubmit={(event) => event.preventDefault()}
    >
      <p className="payment-card-form__title">Данные карты</p>

      <div className="payment-card-form__field">
        <label className="payment-card-form__label" htmlFor="card-number">
          Номер карты
        </label>
        <input
          id="card-number"
          className="payment-card-form__input"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChange={(event) => {
            const digits = digitsOnly(event.target.value, 16);
            setCardNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim());
          }}
        />
      </div>

      <div className="payment-card-form__row">
        <div className="payment-card-form__field">
          <label className="payment-card-form__label" htmlFor="card-expiry">
            Срок действия
          </label>
          <input
            id="card-expiry"
            className="payment-card-form__input"
            inputMode="numeric"
            placeholder="ММ/ГГ"
            value={expiry}
            onChange={(event) => {
              const digits = digitsOnly(event.target.value, 4);
              setExpiry(
                digits.length > 2
                  ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                  : digits,
              );
            }}
          />
        </div>

        <div className="payment-card-form__field">
          <label className="payment-card-form__label" htmlFor="card-cvv">
            CVV
          </label>
          <input
            id="card-cvv"
            className="payment-card-form__input"
            type="password"
            inputMode="numeric"
            placeholder="000"
            maxLength={4}
            value={cvv}
            onChange={(event) => setCvv(digitsOnly(event.target.value, 4))}
          />
        </div>
      </div>

      <p className="payment-card-form__hint">
        Демо-режим: данные не отправляются на сервер
      </p>
    </form>
  );
}
