CREATE TABLE [dbo].[Tallas] (
    [TallaID]            INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]             VARCHAR (20)  NOT NULL,
    [Descripcion]        VARCHAR (100) NULL,
    [OrdenVisualizacion] INT           NULL,
    [Activo]             BIT           DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([TallaID] ASC)
);


GO

