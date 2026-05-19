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
          'https://orgritual.ru/_mod_files/ce_images/img-20241102-wa0001.jpg',
        category: 'Базовые пакеты',
        userId: 1,
      },
      {
        name: 'Кремация без прощания',
        description:
          'Деликатный формат без зала: сопровождение координатора, перевозка, кремация и выдача урны — когда семье важна тишина и минимум формальностей.',
        price: 19900,
        image:
          'https://ritual-plus24.ru/images/articles/zal-1.jpg',
        category: 'Базовые пакеты',
        userId: 1,
      },
      {
        name: 'Прощание в зале (2 часа)',
        description:
          'Зал для близких на два часа, координатор церемонии, музыкальное сопровождение и помощь в организации прощания перед кремацией.',
        price: 46500,
        image:
          'https://openagent.ru/redesign/imgs/articles/proshhalnye-zaly-v-arendu1.jpg',
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
          'https://www.horonim.ru/wp-content/uploads/2020/06/candle-500x328.jpg',
        category: 'Премиум',
        userId: 1,
      },
      {
        name: 'Прощание с онлайн-трансляцией',
        description:
          'Зал прощания и прямая трансляция для родственников из других городов; запись церемонии хранится 30 дней для семьи.',
        price: 54200,
        image:
          'https://static.tildacdn.com/tild3364-3936-4634-a162-613861326465/ChatGPT_Image_23__20.png',
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
          'https://autoproject-spb.ru/images/2018/Mikroavtobus_na_Pohoroni_SPb_Autoproject.jpg',
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
          'https://admin29.solinepro.ru/ritualusl2//upload/user/%D0%A4%D0%BE%D1%82%D0%BE%20%D0%BA%D1%80%D0%B5%D0%BC%D0%B0%D1%82%D0%BE%D1%80%D0%B8%D0%B9/%D0%BC%D0%B0%D0%BB%D1%8B%D0%B9.jpg',
        category: 'С церемонией',
        userId: 1,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('cremations', null, {});
  },
};
