CREATE TABLE [dbo].[Ciudades] (
    [CiudadID]       INT          IDENTITY (1, 1) NOT NULL,
    [DepartamentoID] INT          NOT NULL,
    [Nombre]         VARCHAR (50) NOT NULL,
    [Codigo]         VARCHAR (5)  NOT NULL,
    [TieneEnvio]     BIT          DEFAULT ((1)) NULL,
    [Activo]         BIT          DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([CiudadID] ASC),
    FOREIGN KEY ([DepartamentoID]) REFERENCES [dbo].[Departamentos] ([DepartamentoID])
);


GO

