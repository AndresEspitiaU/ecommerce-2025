import { db } from '@/config/database';

interface Cupon {
  CuponID?: number;
  TipoCuponID: number;
  Codigo: string;
  Nombre: string;
  Descripcion?: string;
  TipoDescuento: 'PORCENTAJE' | 'FIJO';
  ValorDescuento: number;
  MontoMinimo?: number;
  MontoMaxDescuento?: number;
  FechaInicio: Date;
  FechaFin: Date;
  LimiteUso: number;
  LimiteUsuario?: number;
  RequiereUsuarioRegistrado: boolean;
  AplicaCategorias?: string;
  AplicaProductos?: string;
  ExcluyeCategorias?: string;
  ExcluyeProductos?: string;
  FechaCreacion?: Date;
  Activo?: boolean;
}

// Obtener todos los cupones activos
export const getAllCupones = async (): Promise<Cupon[]> => {
  const query = 'SELECT * FROM Cupones WHERE Activo = 1';
  return await db.query<Cupon>(query);
};

// Obtener un cupón por ID
export const getCuponById = async (id: number): Promise<Cupon | null> => {
  const query = 'SELECT * FROM Cupones WHERE CuponID = @id AND Activo = 1';
  const result = await db.query<Cupon>(query, { id });
  return result.length > 0 ? result[0] : null;
};

// Crear un nuevo cupón
export const createCupon = async (cupon: Cupon): Promise<Cupon> => {
  const query = `
    INSERT INTO Cupones (
      TipoCuponID, Codigo, Nombre, Descripcion, TipoDescuento, ValorDescuento, MontoMinimo, 
      MontoMaxDescuento, FechaInicio, FechaFin, LimiteUso, LimiteUsuario, 
      RequiereUsuarioRegistrado, AplicaCategorias, AplicaProductos, ExcluyeCategorias, ExcluyeProductos, Activo
    )
    OUTPUT INSERTED.*
    VALUES (
      @TipoCuponID, @Codigo, @Nombre, @Descripcion, @TipoDescuento, @ValorDescuento, @MontoMinimo, 
      @MontoMaxDescuento, @FechaInicio, @FechaFin, @LimiteUso, @LimiteUsuario, 
      @RequiereUsuarioRegistrado, @AplicaCategorias, @AplicaProductos, @ExcluyeCategorias, @ExcluyeProductos, 1
    )
  `;

  const result = await db.query<Cupon>(query, {
    TipoCuponID: cupon.TipoCuponID,
    Codigo: cupon.Codigo,
    Nombre: cupon.Nombre,
    Descripcion: cupon.Descripcion || null,
    TipoDescuento: cupon.TipoDescuento,
    ValorDescuento: cupon.ValorDescuento,
    MontoMinimo: cupon.MontoMinimo || null,
    MontoMaxDescuento: cupon.MontoMaxDescuento || null,
    FechaInicio: cupon.FechaInicio,
    FechaFin: cupon.FechaFin,
    LimiteUso: cupon.LimiteUso,
    LimiteUsuario: cupon.LimiteUsuario || null,
    RequiereUsuarioRegistrado: cupon.RequiereUsuarioRegistrado,
    AplicaCategorias: cupon.AplicaCategorias || null,
    AplicaProductos: cupon.AplicaProductos || null,
    ExcluyeCategorias: cupon.ExcluyeCategorias || null,
    ExcluyeProductos: cupon.ExcluyeProductos || null,
  });

  return result[0];
};

// Actualizar un cupón existente
export const updateCupon = async (id: number, cupon: Cupon): Promise<boolean> => {
  const query = `
    UPDATE Cupones
    SET 
      TipoCuponID = @TipoCuponID, Codigo = @Codigo, Nombre = @Nombre, Descripcion = @Descripcion, 
      TipoDescuento = @TipoDescuento, ValorDescuento = @ValorDescuento, MontoMinimo = @MontoMinimo, 
      MontoMaxDescuento = @MontoMaxDescuento, FechaInicio = @FechaInicio, FechaFin = @FechaFin, 
      LimiteUso = @LimiteUso, LimiteUsuario = @LimiteUsuario, RequiereUsuarioRegistrado = @RequiereUsuarioRegistrado, 
      AplicaCategorias = @AplicaCategorias, AplicaProductos = @AplicaProductos, 
      ExcluyeCategorias = @ExcluyeCategorias, ExcluyeProductos = @ExcluyeProductos
    WHERE CuponID = @id AND Activo = 1
  `;

  const result = await db.query(query, {
    id,
    TipoCuponID: cupon.TipoCuponID,
    Codigo: cupon.Codigo,
    Nombre: cupon.Nombre,
    Descripcion: cupon.Descripcion || null,
    TipoDescuento: cupon.TipoDescuento,
    ValorDescuento: cupon.ValorDescuento,
    MontoMinimo: cupon.MontoMinimo || null,
    MontoMaxDescuento: cupon.MontoMaxDescuento || null,
    FechaInicio: cupon.FechaInicio,
    FechaFin: cupon.FechaFin,
    LimiteUso: cupon.LimiteUso,
    LimiteUsuario: cupon.LimiteUsuario || null,
    RequiereUsuarioRegistrado: cupon.RequiereUsuarioRegistrado,
    AplicaCategorias: cupon.AplicaCategorias || null,
    AplicaProductos: cupon.AplicaProductos || null,
    ExcluyeCategorias: cupon.ExcluyeCategorias || null,
    ExcluyeProductos: cupon.ExcluyeProductos || null,
  });

  return result.length > 0;
};

// Eliminar (desactivar) un cupón
export const deleteCupon = async (id: number): Promise<boolean> => {
  const query = `
    UPDATE Cupones
    SET Activo = 0
    WHERE CuponID = @id
  `;
  const result = await db.query(query, { id });
  return result.length > 0;
};

// Eliminar permanentemente un cupón
export const deleteCuponPermanentemente = async (id: number): Promise<boolean> => {
  try {
    const query = `
      DELETE FROM Cupones
      WHERE CuponID = @id
    `;

    // Usamos el método executeQuery para manejar operaciones sin recordset
    const pool = await db.getConnection();
    const request = pool.request();
    request.input('id', id);

    const result = await request.query(query);

    // Verificar filas afectadas
    const rowsAffected = result.rowsAffected ? result.rowsAffected[0] : 0;
    console.log(`Filas afectadas: ${rowsAffected}`);

    return rowsAffected > 0;
  } catch (error) {
    console.error('Error al eliminar el cupón permanentemente:', error);
    throw new Error('Error al eliminar el cupón permanentemente');
  }
};

