CREATE TABLE [dbo].[Direcciones] (
    [DireccionID]               INT           IDENTITY (1, 1) NOT NULL,
    [UsuarioID]                 INT           NOT NULL,
    [TipoDireccion]             VARCHAR (20)  DEFAULT ('ENVIO') NOT NULL,
    [DepartamentoID]            INT           NOT NULL,
    [CiudadID]                  INT           NOT NULL,
    [BarrioID]                  INT           NULL,
    [DireccionLinea1]           VARCHAR (100) NOT NULL,
    [DireccionLinea2]           VARCHAR (100) NULL,
    [NumeroInterior]            VARCHAR (20)  NULL,
    [Referencia]                VARCHAR (255) NULL,
    [CodigoPostal]              NVARCHAR (10) NULL,
    [NombreContacto]            VARCHAR (100) NOT NULL,
    [TelefonoContacto]          VARCHAR (20)  NOT NULL,
    [TelefonoContacto2]         VARCHAR (20)  NULL,
    [PredeterminadaEnvio]       BIT           DEFAULT ((0)) NULL,
    [PredeterminadaFacturacion] BIT           DEFAULT ((0)) NULL,
    [Verificada]                BIT           DEFAULT ((0)) NULL,
    [FechaCreacion]             DATETIME      DEFAULT (getdate()) NULL,
    [FechaActualizacion]        DATETIME      NULL,
    [UltimoUso]                 DATETIME      NULL,
    [Activa]                    BIT           DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([DireccionID] ASC),
    FOREIGN KEY ([BarrioID]) REFERENCES [dbo].[Barrios] ([BarrioID]),
    FOREIGN KEY ([CiudadID]) REFERENCES [dbo].[Ciudades] ([CiudadID]),
    FOREIGN KEY ([DepartamentoID]) REFERENCES [dbo].[Departamentos] ([DepartamentoID]),
    FOREIGN KEY ([UsuarioID]) REFERENCES [dbo].[Usuarios] ([UsuarioID])
);


GO

