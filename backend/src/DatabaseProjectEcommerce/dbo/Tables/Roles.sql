CREATE TABLE [dbo].[Roles] (
    [RolID]              INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]             VARCHAR (50)  NOT NULL,
    [Descripcion]        VARCHAR (255) NULL,
    [FechaCreacion]      DATETIME      DEFAULT (getdate()) NULL,
    [FechaActualizacion] DATETIME      NULL,
    [Activo]             BIT           DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([RolID] ASC),
    UNIQUE NONCLUSTERED ([Nombre] ASC)
);


GO

