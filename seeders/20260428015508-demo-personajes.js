const { faker } = require('@faker-js/faker');
 
module.exports = {
  async up(queryInterface) {
    const personajes = Array.from({ length: 10 }).map(() => ({
      nombre: faker.word.adjective() + ' ' + faker.person.firstName(),
      descripcion: faker.lorem.sentence(),
      ataque: faker.number.int({min: 10, max: 100}),
      defensa: faker.number.int({min: 10, max: 100}),
      estamina: faker.number.int({min: 10, max: 100}),
      perfilId: faker.number.int({min: 1, max: 10}),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Personajes', personajes);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Personajes', null, {});
  },
};
