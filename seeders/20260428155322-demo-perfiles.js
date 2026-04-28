const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const usuarios = await queryInterface.sequelize.query(
      'SELECT id FROM Usuarios',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const perfiles = usuarios.map((usuario) => ({
      biografia: faker.lorem.paragraph(),
      avatar: faker.image.avatar(),
      usuarioId: usuario.id,       // aquí conectas con el usuario real
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Perfils', perfiles);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Perfils', null, {});
  },
};
