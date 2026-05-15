import "./CardDateMeta.css";
import { formatCardDate } from "@/shared/lib/formatCardDate";

type CardDateMetaProps = {
  createdAt?: string | null;
};

export function CardDateMeta({ createdAt }: CardDateMetaProps) {
  const formatted = formatCardDate(createdAt);

  return (
    <div className="card-date-meta" role="group" aria-label="Дата добавления">
      <span className="card-date-meta__label">Добавлено</span>
      <time className="card-date-meta__date" dateTime={createdAt ?? undefined}>
        {formatted}
      </time>
    </div>
  );
}
