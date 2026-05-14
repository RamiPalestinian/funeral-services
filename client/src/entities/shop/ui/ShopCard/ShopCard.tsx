import "./ShopCard.css";
import { ShopType } from "../../model";

type ShopCardProps = {
  shop: ShopType;
};

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <div>
      <img src={shop.image} alt={shop.name} />
      <p>{shop.status}</p>
      <h2>{shop.name}</h2>
      <p>{shop.description}</p>
      <p>Цена: {shop.price} руб.</p>
      <button>Заказать</button>
      <button>Подробнее</button>
    </div>
  );
}
