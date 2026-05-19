'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('islamic', [
      {
        name: 'Исламские похороны Стандарт',
        description:
          'Базовое сопровождение мусульманского захоронения: документы, транспорт, подготовка тела и координация кладбища.',
        price: 32000,
        image:
          'https://image.venokshop24.ru/files/1/1104/17859664/original/mceclip1-1634458309680.png',
        category: 'Стандарт',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Полное исламское сопровождение',
        description:
          'Комплексная организация: омовение, саван, перевозка, место захоронения, имам и сопровождение семьи в день похорон.',
        price: 68000,
        image:
          'https://www.interfax.ru/ftproot/textphotos/2015/09/23/mosque700.jpg',
        category: 'Комплекс',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Омовение и саван',
        description:
          'Организация ритуального омовения, подготовка кафана и бережная передача тела для дальнейшего захоронения.',
        price: 18000,
        image:
          'https://goodmonument.ru/images/muslim/m-pohorony/dzhanazy-pohorony-musul_man.jpg',
        category: 'Подготовка',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Мусульманский ритуальный транспорт',
        description:
          'Катафалк и транспорт для близких с учетом быстрого маршрута до мечети, морга или кладбища.',
        price: 14000,
        image:
          'https://ritual-profi.ru/transport/photoes/1.jpg',
        category: 'Транспорт',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Подготовка места захоронения',
        description:
          'Согласование участка, подготовка могилы и контроль ориентации захоронения по мусульманской традиции.',
        price: 24000,
        image:
          'https://medinaschool.org/files/images/2020/08/07a1b653e82229292b561957492d5ef8.jpg',
        category: 'Захоронение',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Сопровождение имама',
        description:
          'Помощь с приглашением имама, согласованием времени и поддержкой семьи во время молитвы и погребения.',
        price: 9000,
        image:
          'https://muslim.ru/upload/iblock/fbc/wijfqch49kvcdbrw256ckihwlei7u0au.JPG',
        category: 'Обряд',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Оформление документов',
        description:
          'Получение и подача необходимых справок, свидетельства о смерти и кладбищенских документов.',
        price: 7500,
        image:
          'https://spb.ritual.ru/upload/iblock/fcd/gerbovoe_svidetelstvo_1_.png',
        category: 'Документы',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Семейная исламская церемония',
        description:
          'Камерный формат для близких: координатор, транспорт, подготовка тела, сопровождение обряда и связь с кладбищем.',
        price: 52000,
        image:
          'https://islamdag.ru/sites/default/files/styles/large/public/img/2022/fatava/islamreligiya2201.jpg?itok=TmoJXWkO',
        category: 'Семейный',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('islamic', null, {});
  },
};
