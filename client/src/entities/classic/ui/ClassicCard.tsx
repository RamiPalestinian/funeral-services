import "./ClassicCard.css"

export default function ClassicCard() {
  return (
    <div>
      <div>
        <img
          src="https://cdn-icons-png.flaticon.com/256/10323/10323153.png"
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
          src="https://cdn-icons-png.flaticon.com/256/10323/10323153.png"
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
          src="https://cdn-icons-png.flaticon.com/256/10323/10323153.png"
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
