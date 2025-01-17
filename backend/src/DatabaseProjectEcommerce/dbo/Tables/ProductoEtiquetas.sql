CREATE TABLE [dbo].[ProductoEtiquetas] (
    [ProductoID] INT          NOT NULL,
    [Etiqueta]   VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([ProductoID] ASC, [Etiqueta] ASC),
    FOREIGN KEY ([ProductoID]) REFERENCES [dbo].[Productos] ([ProductoID])
);


GO

