const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const habilidades = Array.from({ length: 10 }).map(() => ({
      nombre: faker.word.adjective() + ' ' + faker.word.noun(),
      descripcion: faker.lorem.sentence(),
      incremento_ataque: faker.number.int({min: -10, max: 20}),
      incremento_defensa: faker.number.int({min: -10, max: 20}),
      incremento_estamina: faker.number.int({min: -10, max: 20}),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Habilidads', habilidades);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Habilidads', null, {});
  },
};
