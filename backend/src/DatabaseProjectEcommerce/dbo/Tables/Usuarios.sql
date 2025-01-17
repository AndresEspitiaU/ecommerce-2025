CREATE TABLE [dbo].[Usuarios] (
    [UsuarioID]               INT           IDENTITY (1, 1) NOT NULL,
    [Email]                   VARCHAR (100) NOT NULL,
    [Contraseña]              VARCHAR (255) NOT NULL,
    [SaltContraseña]          VARCHAR (255) NOT NULL,
    [Nombres]                 VARCHAR (50)  NOT NULL,
    [Apellidos]               VARCHAR (50)  NOT NULL,
    [NombreUsuario]           VARCHAR (50)  NOT NULL,
    [Telefono]                VARCHAR (20)  NULL,
    [FechaNacimiento]         DATE          NULL,
    [Genero]                  VARCHAR (20)  NULL,
    [FechaCreacion]           DATETIME      DEFAULT (getdate()) NULL,
    [FechaActualizacion]      DATETIME      NULL,
    [UltimoAcceso]            DATETIME      NULL,
    [UltimoCambioContraseña]  DATETIME      NULL,
    [IntentosFallidos]        INT           DEFAULT ((0)) NULL,
    [BloqueoHasta]            DATETIME      NULL,
    [EmailConfirmado]         BIT           DEFAULT ((0)) NULL,
    [TelefonoConfirmado]      BIT           DEFAULT ((0)) NULL,
    [DosFactoresHabilitado]   BIT           DEFAULT ((0)) NULL,
    [Activo]                  BIT           DEFAULT ((1)) NULL,
    [Estado]                  VARCHAR (20)  DEFAULT ('PENDIENTE') NULL,
    [IdiomaPreferido]         VARCHAR (10)  DEFAULT ('es') NULL,
    [ZonaHoraria]             VARCHAR (50)  DEFAULT ('America/Bogota') NULL,
    [TokenVerificacion]       VARCHAR (100) NULL,
    [TokenRecuperacion]       VARCHAR (100) NULL,
    [VenceTokenRecuperacion]  DATETIME      NULL,
    [AceptoTerminos]          BIT           DEFAULT ((0)) NULL,
    [FechaAceptacionTerminos] DATETIME      NULL,
    [FechaEliminacion]        DATETIME      NULL,
    [Eliminado]               BIT           DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([UsuarioID] ASC),
    UNIQUE NONCLUSTERED ([Email] ASC),
    UNIQUE NONCLUSTERED ([NombreUsuario] ASC)
);


GO

