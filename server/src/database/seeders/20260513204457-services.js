'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('services', [
      {
        name: 'Венок из белых лилий',
        description:
          'Сдержанный траурный венок из белых лилий, зелени и атласной ленты для церемонии прощания.',
        price: 8900,
        image:
          'https://i3.storeland.net/2/820/108196381/afacdb/traurnyj-venok-110-sm.png',
        category: 'flowers',
        userId: 1,
      },
      {
        name: 'Траурная композиция Память',
        description:
          'Настольная цветочная композиция в спокойной гамме для зала прощания или мемориального места.',
        price: 6400,
        image:
          'https://avatars.mds.yandex.net/get-mpic/17962538/2a0000019c75376242dbeb7cd378b04d26ec/orig',
        category: 'flowers',
        userId: 1,
      },
      {
        name: 'Лакированный гроб Классик',
        description:
          'Классическая модель из массива с мягкой внутренней отделкой и аккуратной фурнитурой.',
        price: 42000,
        image:
          'https://poxoronim.ru/wp-content/uploads/2018/10/klassik.jpg',
        category: 'coffins',
        userId: 1,
      },
      {
        name: 'Урна из керамики Тишина',
        description:
          'Минималистичная керамическая урна с матовым покрытием для бережного хранения праха.',
        price: 12500,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6X0K8qdipWbb67VsnixiIBLrKrE5gRIDDnw&s',
        category: 'urns',
        userId: 1,
      },
      {
        name: 'Комплект ритуального текстиля',
        description:
          'Комплект покрывала, подушки и внутренней отделки в нейтральном светлом цвете.',
        price: 7800,
        image:
          'https://ritual-78.ru/wp-content/uploads/2022/08/img_qsiv6r1sa40ypvgcscugdzhnknqawc3deqkw.jpeg',
        category: 'textile',
        userId: 1,
      },
      {
        name: 'Памятная табличка из бронзы',
        description:
          'Аккуратная бронзовая табличка с гравировкой имени, дат и короткой памятной надписи.',
        price: 9600,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM6C9hSSy6bAK2fsnPj-UGS81bIytgwmdTmA&s',
        category: 'memorial',
        userId: 1,
      },
      {
        name: 'Набор свечей Прощание',
        description:
          'Набор белых мемориальных свечей для церемонии, домашнего поминовения или траурного стола.',
        price: 2400,
        image:
          'https://postament.ru/upload/medialibrary/830/09_10_17_2.jpg',
        category: 'ceremony',
        userId: 1,
      },
      {
        name: 'Корзина живых цветов Светлая память',
        description:
          'Объемная корзина из свежих цветов в мягких оттенках для возложения и зала прощания.',
        price: 11200,
        image:
          'https://zakazvenkov.com/wp-content/uploads/2020/12/img-20201215-wa0053.jpg',
        category: 'flowers',
        userId: 1,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('services', null, {});
  },
};
