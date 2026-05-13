'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('cremations', [
      {
        name: 'Кремация Стандарт',
        description:
          'Базовый пакет кремации с оформлением документов, транспортировкой и выдачей урны.',
        price: 28500,
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        category: 'standard',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Кремация с залом прощания',
        description:
          'Организация кремации с арендой малого зала, музыкальным сопровождением и координацией церемонии.',
        price: 46800,
        image:
          'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
        category: 'ceremony',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Кремация Премиум',
        description:
          'Расширенный пакет с персональным координатором, залом прощания, цветочным оформлением и урной на выбор.',
        price: 78500,
        image:
          'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80',
        category: 'premium',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Кремация без церемонии',
        description:
          'Спокойный практичный формат без зала прощания: оформление, перевозка, кремация и передача урны семье.',
        price: 21900,
        image:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        category: 'basic',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Кремация с онлайн-трансляцией',
        description:
          'Церемония для родственников из разных городов: зал прощания, видеотрансляция и запись.',
        price: 54200,
        image:
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
        category: 'online',
        status: 'available',
        userId: 1,
      },
      {
        name: 'Семейная церемония кремации',
        description:
          'Камерная церемония для близких с отдельной комнатой ожидания, координатором и мягким музыкальным фоном.',
        price: 61200,
        image:
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
        category: 'family',
        status: 'available',
        userId: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cremations', null, {});
  },
};
