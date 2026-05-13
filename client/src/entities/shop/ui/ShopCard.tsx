import "./ShopCard.css";

export default function ShopCard() {
  return (
    <div>
      <div>
        <img
          src="https://avatars.mds.yandex.net/get-altay/5265775/2a0000017b7a1aef616c879ca44248a793df/L_height"
          alt="Услуга 1"
        />
        <h2>Услуга 1</h2>
        <p>Описание услуги 1</p>
        <p>Цена: 1000 руб.</p>
        <button>Заказать</button>
        <button>Подробнее</button>
      </div>

      <div>
        <img
          src="https://avatars.mds.yandex.net/get-altay/5265775/2a0000017b7a1aef616c879ca44248a793df/L_height"
          alt="Услуга 1"
        />
        <h2>Услуга 2</h2>
        <p>Описание услуги 2</p>
        <p>Цена: 1500 руб.</p>
        <button>Заказать</button>
        <button>Подробнее</button>
      </div>

      <div>
        <img
          src="https://avatars.mds.yandex.net/get-altay/5265775/2a0000017b7a1aef616c879ca44248a793df/L_height"
          alt="Услуга 1"
        />
        <h2>Услуга 3</h2>
        <p>Описание услуги 3</p>
        <p>Цена: 2000 руб.</p>
        <button>Заказать</button>
        <button>Подробнее</button>
      </div>
    </div>
  );
}
