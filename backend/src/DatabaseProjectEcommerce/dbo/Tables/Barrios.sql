CREATE TABLE [dbo].[Barrios] (
    [BarrioID]     INT           IDENTITY (1, 1) NOT NULL,
    [CiudadID]     INT           NOT NULL,
    [Nombre]       VARCHAR (100) NOT NULL,
    [CodigoPostal] VARCHAR (10)  NULL,
    [Activo]       BIT           DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([BarrioID] ASC),
    FOREIGN KEY ([CiudadID]) REFERENCES [dbo].[Ciudades] ([CiudadID])
);


GO

