import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { crearAppDePrueba } from './test-helper.js';

/**
 * @description Pruebas E2E para Actividades e Insumos utilizando Supertest.
 */
describe('ActividadesController e Insumos (e2e - Supertest)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await crearAppDePrueba();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/actividades - Debe retornar la estructura paginada de actividades (200 OK)', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/actividades?pagina=1&limite=10')
      .expect(200);

    expect(respuesta.body).toHaveProperty('items');
    expect(respuesta.body).toHaveProperty('total');
    expect(respuesta.body).toHaveProperty('pagina', 1);
    expect(respuesta.body).toHaveProperty('limite', 10);
    expect(respuesta.body).toHaveProperty('totalPaginas');
    expect(Array.isArray(respuesta.body.items)).toBe(true);
  });

  it('GET /api/v1/insumos - Debe retornar el catálogo de insumos agrícolas (200 OK)', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/insumos')
      .expect(200);

    expect(Array.isArray(respuesta.body)).toBe(true);
    if (respuesta.body.length > 0) {
      const insumo = respuesta.body[0];
      expect(insumo).toHaveProperty('codigo');
      expect(insumo).toHaveProperty('nombre');
      expect(insumo).toHaveProperty('categoria');
      expect(insumo).toHaveProperty('unidadMedida');
    }
  });

  it('POST /api/v1/actividades - Debe fallar con 400 Bad Request si no se envían datos requeridos', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/actividades')
      .send({})
      .expect(400);

    expect(respuesta.body).toHaveProperty('message');
  });
});
