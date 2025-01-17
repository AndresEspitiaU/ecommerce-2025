CREATE TABLE [dbo].[ProductoImagenes] (
    [ImagenID]           INT           IDENTITY (1, 1) NOT NULL,
    [ProductoID]         INT           NOT NULL,
    [ColorID]            INT           NULL,
    [URL]                VARCHAR (255) NOT NULL,
    [EsPrincipal]        BIT           DEFAULT ((0)) NULL,
    [OrdenVisualizacion] INT           DEFAULT ((0)) NULL,
    [FechaCreacion]      DATETIME      DEFAULT (getdate()) NULL,
    [Activo]             BIT           DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([ImagenID] ASC),
    FOREIGN KEY ([ColorID]) REFERENCES [dbo].[Colores] ([ColorID]),
    FOREIGN KEY ([ProductoID]) REFERENCES [dbo].[Productos] ([ProductoID])
);


GO

