CREATE TABLE [dbo].[ReseñaVotos] (
    [ReseñaID]  INT      NOT NULL,
    [UsuarioID] INT      NOT NULL,
    [TipoVoto]  BIT      NULL,
    [FechaVoto] DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([ReseñaID] ASC, [UsuarioID] ASC),
    FOREIGN KEY ([ReseñaID]) REFERENCES [dbo].[Reseñas] ([ReseñaID]),
    FOREIGN KEY ([UsuarioID]) REFERENCES [dbo].[Usuarios] ([UsuarioID])
);


GO

