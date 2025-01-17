CREATE TABLE [dbo].[PedidoHistorial] (
    [HistorialID]   INT      IDENTITY (1, 1) NOT NULL,
    [PedidoID]      INT      NOT NULL,
    [EstadoID]      INT      NOT NULL,
    [Comentario]    TEXT     NULL,
    [CreadoPor]     INT      NULL,
    [FechaCreacion] DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([HistorialID] ASC),
    FOREIGN KEY ([CreadoPor]) REFERENCES [dbo].[Usuarios] ([UsuarioID]),
    FOREIGN KEY ([EstadoID]) REFERENCES [dbo].[EstadosPedido] ([EstadoID]),
    FOREIGN KEY ([PedidoID]) REFERENCES [dbo].[Pedidos] ([PedidoID])
);


GO

