CREATE TABLE [dbo].[Carritos] (
    [CarritoID]           INT             IDENTITY (1, 1) NOT NULL,
    [UsuarioID]           INT             NULL,
    [SessionID]           VARCHAR (100)   NULL,
    [SubTotal]            DECIMAL (10, 2) DEFAULT ((0)) NULL,
    [ImpuestosTotal]      DECIMAL (10, 2) DEFAULT ((0)) NULL,
    [DescuentoTotal]      DECIMAL (10, 2) DEFAULT ((0)) NULL,
    [Total]               DECIMAL (10, 2) DEFAULT ((0)) NULL,
    [CuponAplicado]       VARCHAR (50)    NULL,
    [FechaCreacion]       DATETIME        DEFAULT (getdate()) NULL,
    [UltimaActualizacion] DATETIME        NULL,
    [Estado]              VARCHAR (20)    DEFAULT ('ACTIVO') NULL,
    PRIMARY KEY CLUSTERED ([CarritoID] ASC),
    FOREIGN KEY ([UsuarioID]) REFERENCES [dbo].[Usuarios] ([UsuarioID])
);


GO

