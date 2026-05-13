import "./CremationCard.css";
import { CremationType } from "../model";

type CremationCardProps = {
  cremation: CremationType;
};

export default function CremationCard({ cremation }: CremationCardProps) {
  return (
    <div>
      <img src={cremation.image} alt={cremation.name} />
      <h2>{cremation.name}</h2>
      <p>{cremation.description}</p>
      <p>{cremation.price}</p>
      <button>Заказать</button>
      <button>Подробнее</button>
    </div>
  );
}
