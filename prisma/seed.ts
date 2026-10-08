import { PrismaClient, RolUsuario } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * @description Script de inicialización de datos base para Agro Vision.
 */
async function main() {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('1234', saltRounds);

  const adminEmail = 'admin@santaelena.pe';

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { correo: adminEmail },
  });

  if (!usuarioExistente) {
    await prisma.usuario.create({
      data: {
        nombres: 'Administrador',
        apellidos: 'Santa Elena',
        correo: adminEmail,
        telefono: '+51 987654321',
        passwordHash,
        rol: RolUsuario.ADMINISTRADOR,
        direccion: 'Fundo Santa Elena Km 45',
        departamento: 'Ica',
        provincia: 'Ica',
        activo: true,
      },
    });
    console.log(`Usuario administrador creado con éxito: ${adminEmail}`);
  } else {
    console.log(`El usuario administrador ya existe: ${adminEmail}`);
  }

  // Catálogo inicial de cultivos
  const cultivosIniciales = [
    {
      nombre: 'Palto',
      nombreCientifico: 'Persea americana',
      variedadesDefault: ['Hass', 'Fuerte', 'Zutano', 'Maluma'],
      colorHex: '#15803d',
    },
    {
      nombre: 'Arándano',
      nombreCientifico: 'Vaccinium corymbosum',
      variedadesDefault: ['Biloxi', 'Ventura', 'Emerald', 'Rocío'],
      colorHex: '#3b82f6',
    },
    {
      nombre: 'Vid (Uva de mesa)',
      nombreCientifico: 'Vitis vinifera',
      variedadesDefault: ['Red Globe', 'Sweet Globe', 'Autumn Crisp', 'Crimson'],
      colorHex: '#8b5cf6',
    },
    {
      nombre: 'Espárrago',
      nombreCientifico: 'Asparagus officinalis',
      variedadesDefault: ['UC-157', 'Verde', 'Blanco'],
      colorHex: '#16a34a',
    },
    {
      nombre: 'Mandarina / Cítricos',
      nombreCientifico: 'Citrus reticulata',
      variedadesDefault: ['W. Murcott', 'Tango', 'Satsuma'],
      colorHex: '#f97316',
    },
    {
      nombre: 'Maíz Amarillo Duro',
      nombreCientifico: 'Zea mays',
      variedadesDefault: ['DK-7088', 'Marginal 28', 'Pioneer'],
      colorHex: '#eab308',
    },
  ];

  for (const c of cultivosIniciales) {
    const existeCultivo = await prisma.cultivo.findFirst({
      where: { nombre: { equals: c.nombre, mode: 'insensitive' } },
    });
    if (!existeCultivo) {
      await prisma.cultivo.create({
        data: {
          nombre: c.nombre,
          nombreCientifico: c.nombreCientifico,
          variedadesDefault: c.variedadesDefault,
          colorHex: c.colorHex,
          activo: true,
        },
      });
      console.log(`Cultivo inicial creado: ${c.nombre}`);
    }
  }

  // Operadores de campo para cuadrillas
  const operariosIniciales = [
    { nombres: 'Carlos', apellidos: 'Mendoza Quispe', correo: 'cmendoza@santaelena.pe', telefono: '+51 981112233' },
    { nombres: 'Juan', apellidos: 'Huamán Flores', correo: 'jhuaman@santaelena.pe', telefono: '+51 982223344' },
    { nombres: 'María', apellidos: 'Rojas Torres', correo: 'mrojas@santaelena.pe', telefono: '+51 983334455' },
    { nombres: 'Roberto', apellidos: 'Silva Paucar', correo: 'rsilva@santaelena.pe', telefono: '+51 984445566' },
    { nombres: 'Pedro', apellidos: 'Castillo Gómez', correo: 'pcastillo@santaelena.pe', telefono: '+51 985556677' },
  ];

  for (const op of operariosIniciales) {
    const existe = await prisma.usuario.findUnique({ where: { correo: op.correo } });
    if (!existe) {
      await prisma.usuario.create({
        data: {
          nombres: op.nombres,
          apellidos: op.apellidos,
          correo: op.correo,
          telefono: op.telefono,
          passwordHash,
          rol: RolUsuario.OPERADOR,
          activo: true,
        },
      });
      console.log(`Operador de campo creado: ${op.nombres} ${op.apellidos}`);
    }
  }

  // Catálogo base de insumos y equipos agrícolas
  const insumosIniciales = [
    { codigo: 'INS-001', nombre: 'Urea 46% N', categoria: 'FERTILIZANTE' as const, unidadMedida: 'Saco 50kg' },
    { codigo: 'INS-002', nombre: 'Fosfato Diamónico (DAP)', categoria: 'FERTILIZANTE' as const, unidadMedida: 'Saco 50kg' },
    { codigo: 'INS-003', nombre: 'Sulfato de Potasio Soluble', categoria: 'FERTILIZANTE' as const, unidadMedida: 'Saco 25kg' },
    { codigo: 'INS-004', nombre: 'Abamectina 1.8% EC (Acaricida)', categoria: 'FITOSANITARIO' as const, unidadMedida: 'Litro' },
    { codigo: 'INS-005', nombre: 'Sulfato de Cobre Pentahidratado', categoria: 'FITOSANITARIO' as const, unidadMedida: 'Kilogramo' },
    { codigo: 'INS-006', nombre: 'Mochila Fumigadora 20L Manual', categoria: 'MAQUINARIA_EQUIPO' as const, unidadMedida: 'Unidad' },
    { codigo: 'INS-007', nombre: 'Atomizadora Motorizada Stihl', categoria: 'MAQUINARIA_EQUIPO' as const, unidadMedida: 'Unidad' },
    { codigo: 'INS-008', nombre: 'Tijeras de Poda Profesional', categoria: 'HERRAMIENTA' as const, unidadMedida: 'Unidad' },
  ];

  for (const ins of insumosIniciales) {
    const existe = await prisma.insumo.findUnique({ where: { codigo: ins.codigo } });
    if (!existe) {
      await prisma.insumo.create({
        data: {
          codigo: ins.codigo,
          nombre: ins.nombre,
          categoria: ins.categoria,
          unidadMedida: ins.unidadMedida,
          activo: true,
        },
      });
      console.log(`Insumo/Recurso creado: ${ins.nombre}`);
    }
  }
}

main()
  .catch((e) => {
    console.error('Error al ejecutar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
