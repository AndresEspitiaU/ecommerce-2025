CREATE TABLE [dbo].[Cupones] (
    [CuponID]                   INT             IDENTITY (1, 1) NOT NULL,
    [TipoCuponID]               INT             NULL,
    [Codigo]                    VARCHAR (50)    NOT NULL,
    [Nombre]                    VARCHAR (100)   NOT NULL,
    [Descripcion]               TEXT            NULL,
    [TipoDescuento]             VARCHAR (20)    NOT NULL,
    [ValorDescuento]            DECIMAL (10, 2) NOT NULL,
    [MontoMinimo]               DECIMAL (10, 2) NULL,
    [MontoMaxDescuento]         DECIMAL (10, 2) NULL,
    [FechaInicio]               DATETIME        NOT NULL,
    [FechaFin]                  DATETIME        NOT NULL,
    [LimiteUso]                 INT             NULL,
    [LimiteUsuario]             INT             DEFAULT ((1)) NULL,
    [UsosActuales]              INT             DEFAULT ((0)) NULL,
    [RequiereUsuarioRegistrado] BIT             DEFAULT ((1)) NULL,
    [AplicaCategorias]          VARCHAR (MAX)   NULL,
    [AplicaProductos]           VARCHAR (MAX)   NULL,
    [ExcluyeCategorias]         VARCHAR (MAX)   NULL,
    [ExcluyeProductos]          VARCHAR (MAX)   NULL,
    [FechaCreacion]             DATETIME        DEFAULT (getdate()) NULL,
    [CreadoPor]                 INT             NULL,
    [Activo]                    BIT             DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([CuponID] ASC),
    FOREIGN KEY ([CreadoPor]) REFERENCES [dbo].[Usuarios] ([UsuarioID]),
    FOREIGN KEY ([TipoCuponID]) REFERENCES [dbo].[TiposCupon] ([TipoCuponID]),
    UNIQUE NONCLUSTERED ([Codigo] ASC)
);


GO

