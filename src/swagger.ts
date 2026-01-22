import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Internal Tools',
      version: '1.0.0',
      description: 'Documentation de l\'API de gestion des outils internes',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./src/controllers/*.ts', './server.ts'], 
};

export const swaggerSpec = swaggerJsdoc(options);