CREATE TABLE [dbo].[PedidoDetalles] (
    [PedidoDetalleID] INT             IDENTITY (1, 1) NOT NULL,
    [PedidoID]        INT             NOT NULL,
    [ProductoID]      INT             NOT NULL,
    [VarianteID]      INT             NOT NULL,
    [Cantidad]        INT             NOT NULL,
    [PrecioUnitario]  DECIMAL (10, 2) NOT NULL,
    [SubTotal]        DECIMAL (10, 2) NOT NULL,
    [Descuento]       DECIMAL (10, 2) DEFAULT ((0)) NULL,
    [Total]           DECIMAL (10, 2) NOT NULL,
    [Estado]          VARCHAR (50)    DEFAULT ('PENDIENTE') NULL,
    PRIMARY KEY CLUSTERED ([PedidoDetalleID] ASC),
    FOREIGN KEY ([PedidoID]) REFERENCES [dbo].[Pedidos] ([PedidoID]),
    FOREIGN KEY ([ProductoID]) REFERENCES [dbo].[Productos] ([ProductoID]),
    FOREIGN KEY ([VarianteID]) REFERENCES [dbo].[ProductoVariantes] ([VarianteID])
);


GO

