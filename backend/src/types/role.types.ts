// src/types/role.types.ts
export interface IRole {
    RolID: number;
    Nombre: string;
    Descripcion?: string;
    FechaCreacion: Date;
    FechaActualizacion?: Date;
    Activo: boolean;
  }
  
  export interface IPermiso {
    PermisoID: number;
    Nombre: string;
    Codigo: string;
    Descripcion?: string;
    Modulo: string;
    FechaCreacion: Date;
    Activo: boolean;
  }
  
  export interface IRolPermiso {
    RolID: number;
    PermisoID: number;
    FechaAsignacion: Date;
    AsignadoPor: number;
  }
  
  export interface IUsuarioRol {
    UsuarioID: number;
    RolID: number;
    FechaAsignacion: Date;
    AsignadoPor: number;
    FechaExpiracion?: Date;
    Activo: boolean;
  }