export interface Cupon {
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
    LimiteUso?: number;
    LimiteUsuario?: number;
    UsosActuales?: number;
    RequiereUsuarioRegistrado?: boolean;
    AplicaCategorias?: string; // IDs separados por comas
    AplicaProductos?: string; // IDs separados por comas
    ExcluyeCategorias?: string; // IDs excluidos
    ExcluyeProductos?: string; // IDs excluidos
    Activo?: boolean;
  }
  