import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { crearAppDePrueba } from './test-helper.js';

/**
 * @description Pruebas E2E para el endpoint de Cultivos utilizando Supertest.
 */
describe('CultivosController (e2e - Supertest)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await crearAppDePrueba();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/cultivos - Debe retornar la lista de cultivos activos (200 OK)', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/cultivos')
      .expect(200);

    expect(Array.isArray(respuesta.body)).toBe(true);
    expect(respuesta.body.length).toBeGreaterThanOrEqual(1);

    const primerCultivo = respuesta.body[0];
    expect(primerCultivo).toHaveProperty('id');
    expect(primerCultivo).toHaveProperty('nombre');
    expect(primerCultivo).toHaveProperty('variedadesDefault');
    expect(primerCultivo).toHaveProperty('activo', true);
  });

  it('POST /api/v1/cultivos - Debe fallar con 400 Bad Request si el nombre viene vacío', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/cultivos')
      .send({
        nombre: '',
      })
      .expect(400);

    expect(respuesta.body).toHaveProperty('message');
  });
});
