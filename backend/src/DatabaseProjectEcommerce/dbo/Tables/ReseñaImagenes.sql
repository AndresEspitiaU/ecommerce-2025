CREATE TABLE [dbo].[ReseñaImagenes] (
    [ImagenID]           INT           IDENTITY (1, 1) NOT NULL,
    [ReseñaID]           INT           NOT NULL,
    [ImagenURL]          VARCHAR (255) NOT NULL,
    [OrdenVisualizacion] INT           DEFAULT ((0)) NULL,
    [Activa]             BIT           DEFAULT ((1)) NULL,
    [FechaCreacion]      DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([ImagenID] ASC),
    FOREIGN KEY ([ReseñaID]) REFERENCES [dbo].[Reseñas] ([ReseñaID])
);


GO

