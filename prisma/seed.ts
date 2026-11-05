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
        codigoEmpleado: 'AD-001',
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

  // Personal técnico y supervisión
  const personalTecnicoInicial = [
    { nombres: 'Ricardo', apellidos: 'Palma Mendoza', correo: 'rpalma@santaelena.pe', telefono: '+51 980112233', rol: RolUsuario.AGRONOMO, codigoEmpleado: 'AG-001' },
    { nombres: 'Lucía', apellidos: 'Morales Soto', correo: 'lmorales@santaelena.pe', telefono: '+51 980223344', rol: RolUsuario.SUPERVISOR, codigoEmpleado: 'SU-001' },
  ];

  for (const tec of personalTecnicoInicial) {
    const existe = await prisma.usuario.findUnique({ where: { correo: tec.correo } });
    if (!existe) {
      await prisma.usuario.create({
        data: {
          nombres: tec.nombres,
          apellidos: tec.apellidos,
          correo: tec.correo,
          telefono: tec.telefono,
          passwordHash,
          rol: tec.rol,
          codigoEmpleado: tec.codigoEmpleado,
          activo: true,
        },
      });
      console.log(`Personal técnico creado: ${tec.nombres} ${tec.apellidos} (${tec.rol})`);
    }
  }

  // Operadores de campo para cuadrillas
  const operariosIniciales = [
    {
      nombres: 'Carlos',
      apellidos: 'Mendoza Quispe',
      correo: 'cmendoza@santaelena.pe',
      telefono: '+51 981112233',
      codigoEmpleado: 'OP-001',
      numeroDocumento: '71001122',
      especialidad: 'PODADOR' as const,
      cuadrilla: 'Cuadrilla 1 - Poda',
    },
    {
      nombres: 'Juan',
      apellidos: 'Huamán Flores',
      correo: 'jhuaman@santaelena.pe',
      telefono: '+51 982223344',
      codigoEmpleado: 'OP-002',
      numeroDocumento: '72002233',
      especialidad: 'FUMIGADOR_APLICADOR' as const,
      cuadrilla: 'Cuadrilla Fitosanitaria',
    },
    {
      nombres: 'María',
      apellidos: 'Rojas Torres',
      correo: 'mrojas@santaelena.pe',
      telefono: '+51 983334455',
      codigoEmpleado: 'OP-003',
      numeroDocumento: '73003344',
      especialidad: 'REGADOR' as const,
      cuadrilla: 'Cuadrilla Riego Sur',
    },
    {
      nombres: 'Roberto',
      apellidos: 'Silva Paucar',
      correo: 'rsilva@santaelena.pe',
      telefono: '+51 984445566',
      codigoEmpleado: 'OP-004',
      numeroDocumento: '74004455',
      especialidad: 'TRACTORISTA_MAQUINISTA' as const,
      cuadrilla: 'Cuadrilla Maquinaria',
    },
    {
      nombres: 'Pedro',
      apellidos: 'Castillo Gómez',
      correo: 'pcastillo@santaelena.pe',
      telefono: '+51 985556677',
      codigoEmpleado: 'OP-005',
      numeroDocumento: '75005566',
      especialidad: 'COSECHADOR' as const,
      cuadrilla: 'Cuadrilla 2 - Cosecha',
    },
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
          ...({
            codigoEmpleado: op.codigoEmpleado,
            numeroDocumento: op.numeroDocumento,
            especialidad: op.especialidad,
            cuadrilla: op.cuadrilla,
          } as any),
        },
      });
      console.log(`Operador de campo creado: ${op.nombres} ${op.apellidos} [${op.codigoEmpleado}] (${op.especialidad})`);
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

  // Parcelas y Sectores base para pruebas de campo y geocercas
  const admin = await prisma.usuario.findFirst({
    where: { rol: RolUsuario.ADMINISTRADOR },
  });
  const agronomo = await prisma.usuario.findFirst({
    where: { rol: RolUsuario.AGRONOMO },
  });

  const cultivoPalto = await prisma.cultivo.findFirst({ where: { nombre: { contains: 'Palto', mode: 'insensitive' } } });
  const cultivoArandano = await prisma.cultivo.findFirst({ where: { nombre: { contains: 'Arándano', mode: 'insensitive' } } });
  const cultivoVid = await prisma.cultivo.findFirst({ where: { nombre: { contains: 'Vid', mode: 'insensitive' } } });

  const parcelasIniciales = [
    {
      codigo: 'P-001',
      nombre: 'Lote Norte - Palto Hass',
      areaHectareas: 5.5,
      colorHex: '#15803D',
      cultivoId: cultivoPalto?.id,
      variedad: 'Hass',
      usuarioResponsableId: agronomo?.id || admin?.id,
      ubicacion: 'Fundo Santa Elena Km 45',
      departamento: 'Ica',
      provincia: 'Ica',
      distrito: 'Salas',
      latitudCentro: -11.947138,
      longitudCentro: -76.975346,
      delimitacionGeoJson: [
        { latitude: -11.9455, longitude: -76.9770 },
        { latitude: -11.9455, longitude: -76.9735 },
        { latitude: -11.9488, longitude: -76.9735 },
        { latitude: -11.9488, longitude: -76.9770 },
      ],
      sectores: [
        {
          codigo: 'SEC-001',
          nombre: 'Sector A - Palto Floración',
          areaHectareas: 2.8,
          colorHex: '#15803D',
          cultivoId: cultivoPalto?.id,
          variedad: 'Hass',
          latitudCentro: -11.9465,
          longitudCentro: -76.9752,
          delimitacionGeoJson: [
            { latitude: -11.9455, longitude: -76.9770 },
            { latitude: -11.9455, longitude: -76.9735 },
            { latitude: -11.9471, longitude: -76.9735 },
            { latitude: -11.9471, longitude: -76.9770 },
          ],
        },
      ],
    },
    {
      codigo: 'P-002',
      nombre: 'Lote Central - Arándano Biloxi',
      areaHectareas: 4.2,
      colorHex: '#3B82F6',
      cultivoId: cultivoArandano?.id,
      variedad: 'Biloxi',
      usuarioResponsableId: agronomo?.id || admin?.id,
      ubicacion: 'Fundo Santa Elena Km 45',
      departamento: 'Ica',
      provincia: 'Ica',
      distrito: 'Salas',
      latitudCentro: -11.951200,
      longitudCentro: -76.978500,
      delimitacionGeoJson: [
        { latitude: -11.9495, longitude: -76.9805 },
        { latitude: -11.9495, longitude: -76.9765 },
        { latitude: -11.9529, longitude: -76.9765 },
        { latitude: -11.9529, longitude: -76.9805 },
      ],
      sectores: [
        {
          codigo: 'SEC-001',
          nombre: 'Sector A - Arándano Crecimiento',
          areaHectareas: 4.2,
          colorHex: '#3B82F6',
          cultivoId: cultivoArandano?.id,
          variedad: 'Biloxi',
          latitudCentro: -11.9512,
          longitudCentro: -76.9785,
          delimitacionGeoJson: [
            { latitude: -11.9495, longitude: -76.9805 },
            { latitude: -11.9495, longitude: -76.9765 },
            { latitude: -11.9529, longitude: -76.9765 },
            { latitude: -11.9529, longitude: -76.9805 },
          ],
        },
      ],
    },
    {
      codigo: 'P-003',
      nombre: 'Lote Sur - Vid Red Globe',
      areaHectareas: 6.8,
      colorHex: '#8B5CF6',
      cultivoId: cultivoVid?.id,
      variedad: 'Red Globe',
      usuarioResponsableId: agronomo?.id || admin?.id,
      ubicacion: 'Fundo Santa Elena Km 45',
      departamento: 'Ica',
      provincia: 'Ica',
      distrito: 'Salas',
      latitudCentro: -11.954200,
      longitudCentro: -76.972100,
      delimitacionGeoJson: [
        { latitude: -11.9525, longitude: -76.9740 },
        { latitude: -11.9525, longitude: -76.9702 },
        { latitude: -11.9559, longitude: -76.9702 },
        { latitude: -11.9559, longitude: -76.9740 },
      ],
      sectores: [
        {
          codigo: 'SEC-001',
          nombre: 'Sector A - Vid Parra',
          areaHectareas: 6.8,
          colorHex: '#8B5CF6',
          cultivoId: cultivoVid?.id,
          variedad: 'Red Globe',
          latitudCentro: -11.9542,
          longitudCentro: -76.9721,
          delimitacionGeoJson: [
            { latitude: -11.9525, longitude: -76.9740 },
            { latitude: -11.9525, longitude: -76.9702 },
            { latitude: -11.9559, longitude: -76.9702 },
            { latitude: -11.9559, longitude: -76.9740 },
          ],
        },
      ],
    },
  ];

  for (const p of parcelasIniciales) {
    const existe = await prisma.parcela.findUnique({ where: { codigo: p.codigo } });
    if (!existe) {
      const creada = await prisma.parcela.create({
        data: {
          codigo: p.codigo,
          nombre: p.nombre,
          areaHectareas: p.areaHectareas,
          colorHex: p.colorHex,
          cultivoId: p.cultivoId,
          variedad: p.variedad,
          usuarioResponsableId: p.usuarioResponsableId,
          ubicacion: p.ubicacion,
          departamento: p.departamento,
          provincia: p.provincia,
          distrito: p.distrito,
          latitudCentro: p.latitudCentro,
          longitudCentro: p.longitudCentro,
          delimitacionGeoJson: p.delimitacionGeoJson,
        },
      });
      console.log(`Parcela inicial creada: ${p.nombre} [${p.codigo}]`);

      for (const s of p.sectores) {
        if (s.cultivoId) {
          await prisma.sectorParcela.create({
            data: {
              codigo: s.codigo,
              nombre: s.nombre,
              areaHectareas: s.areaHectareas,
              colorHex: s.colorHex,
              parcelaId: creada.id,
              cultivoId: s.cultivoId,
              variedad: s.variedad,
              latitudCentro: s.latitudCentro,
              longitudCentro: s.longitudCentro,
              delimitacionGeoJson: s.delimitacionGeoJson,
            },
          });
          console.log(`  -> Sector creado: ${s.nombre} [${s.codigo}]`);
        }
      }
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
