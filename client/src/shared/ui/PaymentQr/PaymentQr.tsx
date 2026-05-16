"use client";

import "./PaymentQr.css";

export const PAYMENT_QR_URL = "https://www.youtube.com/watch?v=ndehneGCeos";

function getQrImageUrl(data: string, size = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(data)}`;
}

type PaymentQrProps = {
  title?: string;
  hint?: string;
};

export function PaymentQr({
  title = "Оплата по QR",
  hint = "Отсканируйте код — откроется ссылка",
}: PaymentQrProps) {
  const qrSrc = getQrImageUrl(PAYMENT_QR_URL, 200);

  return (
    <div className="payment-qr">
      <p className="payment-qr__title">{title}</p>
      <div className="payment-qr__frame">
        <span
          className="payment-qr__corner payment-qr__corner--tl"
          aria-hidden
        />
        <span
          className="payment-qr__corner payment-qr__corner--tr"
          aria-hidden
        />
        <span
          className="payment-qr__corner payment-qr__corner--bl"
          aria-hidden
        />
        <span
          className="payment-qr__corner payment-qr__corner--br"
          aria-hidden
        />
        <span className="payment-qr__scan-line" aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt="QR-код"
          className="payment-qr__img"
          width={180}
          height={180}
        />
      </div>
      <p className="payment-qr__hint">{hint}</p>
    </div>
  );
}
