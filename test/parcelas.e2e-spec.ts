import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { crearAppDePrueba } from './test-helper.js';

/**
 * @description Pruebas E2E para el endpoint de Parcelas utilizando Supertest.
 */
describe('ParcelasController (e2e - Supertest)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await crearAppDePrueba();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/parcelas - Debe retornar la estructura paginada de parcelas (200 OK)', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/parcelas?pagina=1&limite=10')
      .expect(200);

    expect(respuesta.body).toHaveProperty('items');
    expect(respuesta.body).toHaveProperty('total');
    expect(respuesta.body).toHaveProperty('pagina', 1);
    expect(respuesta.body).toHaveProperty('limite', 10);
    expect(respuesta.body).toHaveProperty('totalPaginas');
    expect(Array.isArray(respuesta.body.items)).toBe(true);
  });

  it('GET /api/v1/parcelas/:id - Debe retornar 404 cuando la parcela no existe', async () => {
    const idInexistente = '0192a6c0-0000-7000-8000-000000000999';
    await request(app.getHttpServer())
      .get(`/api/v1/parcelas/${idInexistente}`)
      .expect(404);
  });

  it('POST /api/v1/parcelas - Debe retornar 400 Bad Request si faltan campos obligatorios', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/parcelas')
      .send({
        nombre: '',
      })
      .expect(400);

    expect(respuesta.body).toHaveProperty('message');
    expect(Array.isArray(respuesta.body.message)).toBe(true);
  });
});
