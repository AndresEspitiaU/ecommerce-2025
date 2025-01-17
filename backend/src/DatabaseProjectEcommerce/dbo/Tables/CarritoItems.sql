CREATE TABLE [dbo].[CarritoItems] (
    [CarritoItemID]  INT             IDENTITY (1, 1) NOT NULL,
    [CarritoID]      INT             NOT NULL,
    [ProductoID]     INT             NOT NULL,
    [VarianteID]     INT             NOT NULL,
    [Cantidad]       INT             NOT NULL,
    [PrecioUnitario] DECIMAL (10, 2) NOT NULL,
    [SubTotal]       DECIMAL (10, 2) NOT NULL,
    [Descuento]      DECIMAL (10, 2) DEFAULT ((0)) NULL,
    [Total]          DECIMAL (10, 2) NOT NULL,
    [FechaAgregado]  DATETIME        DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([CarritoItemID] ASC),
    FOREIGN KEY ([CarritoID]) REFERENCES [dbo].[Carritos] ([CarritoID]),
    FOREIGN KEY ([ProductoID]) REFERENCES [dbo].[Productos] ([ProductoID]),
    FOREIGN KEY ([VarianteID]) REFERENCES [dbo].[ProductoVariantes] ([VarianteID])
);


GO

