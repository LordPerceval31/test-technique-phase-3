import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

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
  apis: [
    path.join(__dirname, './controllers/*.ts'),
    path.join(__dirname, './server.ts')
  ]
};

export const swaggerSpec = swaggerJsdoc(options) as any;

// DEBUG : Affiche ce que Swagger a trouvé
console.log('🔍 Swagger paths détectés:', Object.keys(swaggerSpec.paths || {}));
console.log('🔍 Swagger schemas détectés:', Object.keys(swaggerSpec.components?.schemas || {}));