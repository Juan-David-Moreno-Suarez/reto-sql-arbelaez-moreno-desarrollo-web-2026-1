const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const usuarios = Array.from({ length: 10 }).map(() => ({
      nombre: faker.internet.username(),
      correo: faker.internet.email(),
      contrasena: faker.internet.password(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Usuarios', usuarios);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Usuarios', null, {});
  },
};
