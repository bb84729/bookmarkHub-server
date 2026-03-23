import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BookmarkHub API',
      version: '1.0.0',
      description: 'BookmarkHub API 文件'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // 去哪裡找 API 註解
  apis: ['./src/routes/*.ts']
}

export const swaggerSpec = swaggerJsdoc(options)
