'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('services', [
      {
        name: 'Венок из белых лилий',
        description:
          'Сдержанный траурный венок из белых лилий, зелени и атласной ленты для церемонии прощания.',
        price: 8900,
        image:
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
        category: 'flowers',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Траурная композиция Память',
        description:
          'Настольная цветочная композиция в спокойной гамме для зала прощания или мемориального места.',
        price: 6400,
        image:
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
        category: 'flowers',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Лакированный гроб Классик',
        description:
          'Классическая модель из массива с мягкой внутренней отделкой и аккуратной фурнитурой.',
        price: 42000,
        image:
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        category: 'coffins',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Урна из керамики Тишина',
        description:
          'Минималистичная керамическая урна с матовым покрытием для бережного хранения праха.',
        price: 12500,
        image:
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
        category: 'urns',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Комплект ритуального текстиля',
        description:
          'Комплект покрывала, подушки и внутренней отделки в нейтральном светлом цвете.',
        price: 7800,
        image:
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
        category: 'textile',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Памятная табличка из бронзы',
        description:
          'Аккуратная бронзовая табличка с гравировкой имени, дат и короткой памятной надписи.',
        price: 9600,
        image:
          'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80',
        category: 'memorial',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Набор свечей Прощание',
        description:
          'Набор белых мемориальных свечей для церемонии, домашнего поминовения или траурного стола.',
        price: 2400,
        image:
          'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1200&q=80',
        category: 'ceremony',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Корзина живых цветов Светлая память',
        description:
          'Объемная корзина из свежих цветов в мягких оттенках для возложения и зала прощания.',
        price: 11200,
        image:
          'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1200&q=80',
        category: 'flowers',
        status: 'available',
        userId: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('services', null, {});
  },
};
