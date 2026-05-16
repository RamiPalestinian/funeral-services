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
          'https://images.unsplash.com/photo-1556795786-55954805c0b6?auto=format&fit=crop&w=1200&q=80',
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
          'https://islamdag.ru/sites/default/files/styles/large/public/img/2022/fatava/islamreligiya2201.jpg?itok=TmoJXWkO',
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
          'https://images.unsplash.com/photo-1594970484212-523a969e091e?auto=format&fit=crop&w=1200&q=80',
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
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
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
          'https://musulmanin.com/wp-content/uploads/2014/02/prinyala-islam.jpg',
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
          'https://images.unsplash.com/photo-1575293924982-20b9240aa155?auto=format&fit=crop&w=1200&q=80',
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
          'https://images.unsplash.com/photo-1655555828192-63a403ad69db?auto=format&fit=crop&w=1200&q=80',
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
          'https://images.unsplash.com/photo-1707327314218-d8cc8ad4b574?auto=format&fit=crop&w=1200&q=80',
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
