'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('cremations', [
      {
        name: 'Кремация «Спокойный путь»',
        description:
          'Базовый пакет для семьи: оформление необходимых документов, ритуальный транспорт в крематорий, кремация и передача урны с прахом.',
        price: 23800,
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        category: 'Базовые пакеты',
        userId: 1,
      },
      {
        name: 'Кремация без прощания',
        description:
          'Деликатный формат без зала: сопровождение координатора, перевозка, кремация и выдача урны — когда семье важна тишина и минимум формальностей.',
        price: 19900,
        image:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        category: 'Базовые пакеты',
        userId: 1,
      },
      {
        name: 'Прощание в зале (2 часа)',
        description:
          'Зал для близких на два часа, координатор церемонии, музыкальное сопровождение и помощь в организации прощания перед кремацией.',
        price: 46500,
        image:
          'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
        category: 'С церемонией',
        userId: 1,
      },
      {
        name: 'Камерное прощание для семьи',
        description:
          'Небольшой зал только для родственников и друзей: мягкое освещение, отдельная комната ожидания, сопровождение персонала на каждом этапе.',
        price: 58900,
        image:
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
        category: 'С церемонией',
        userId: 1,
      },
      {
        name: 'Кремация «Достойная память»',
        description:
          'Расширенный пакет: зал прощания, цветочное оформление, урна на выбор, персональный координатор и сопровождение семьи до завершения церемонии.',
        price: 78500,
        image:
          'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80',
        category: 'Премиум',
        userId: 1,
      },
      {
        name: 'Прощание с онлайн-трансляцией',
        description:
          'Зал прощания и прямая трансляция для родственников из других городов; запись церемонии хранится 30 дней для семьи.',
        price: 54200,
        image:
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
        category: 'С церемонией',
        userId: 1,
      },
      {
        name: 'Оформление документов для кремации',
        description:
          'Помощь в получении свидетельства о смерти, согласование даты и времени кремации, подготовка справок для крематория и захоронения праха.',
        price: 9500,
        image:
          'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
        category: 'Документы и сопровождение',
        userId: 1,
      },
      {
        name: 'Ритуальный транспорт в крематорий',
        description:
          'Перевозка из морга, больницы или дома до крематория на специализированном транспорте с сопровождением координатора.',
        price: 11800,
        image:
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
        category: 'Документы и сопровождение',
        userId: 1,
      },
      {
        name: 'Кремация с урной и доставкой',
        description:
          'Полный цикл кремации, керамическая урна в комплекте и бережная доставка урны по адресу, который укажет семья.',
        price: 32900,
        image:
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
        category: 'Комплекты',
        userId: 1,
      },
      {
        name: 'Малый зал прощания (1 час)',
        description:
          'Аренда зала на один час для короткой церемонии прощания, базовое цветочное оформление и помощь администратора зала.',
        price: 17400,
        image:
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
        category: 'С церемонией',
        userId: 1,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('cremations', null, {});
  },
};
