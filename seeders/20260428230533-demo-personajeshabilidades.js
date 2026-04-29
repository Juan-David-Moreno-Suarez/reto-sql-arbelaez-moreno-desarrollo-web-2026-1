const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const personajes = await queryInterface.sequelize.query(
      'SELECT id FROM Personajes',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const habilidades = await queryInterface.sequelize.query(
      'SELECT id FROM Habilidads',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const personajeHabilidades = personajes.flatMap((personaje) => {
      const cantidad = faker.number.int({ min: 1, max: 3 }); // entre 1 y 3 habilidades por personaje

      return Array.from({ length: cantidad }).map(() => ({
        personajeId: personaje.id,
        habilidadId: faker.helpers.arrayElement(habilidades).id,
        nivel: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });

    await queryInterface.bulkInsert('PersonajeHabilidads', personajeHabilidades);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('PersonajeHabilidads', null, {});
  },
};
