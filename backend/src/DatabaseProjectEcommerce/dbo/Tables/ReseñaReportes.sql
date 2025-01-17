CREATE TABLE [dbo].[ReseñaReportes] (
    [ReporteID]       INT          IDENTITY (1, 1) NOT NULL,
    [ReseñaID]        INT          NOT NULL,
    [UsuarioID]       INT          NOT NULL,
    [MotivoReporte]   VARCHAR (50) NOT NULL,
    [Comentario]      TEXT         NULL,
    [Estado]          VARCHAR (20) DEFAULT ('PENDIENTE') NULL,
    [FechaReporte]    DATETIME     DEFAULT (getdate()) NULL,
    [FechaResolucion] DATETIME     NULL,
    PRIMARY KEY CLUSTERED ([ReporteID] ASC),
    FOREIGN KEY ([ReseñaID]) REFERENCES [dbo].[Reseñas] ([ReseñaID]),
    FOREIGN KEY ([UsuarioID]) REFERENCES [dbo].[Usuarios] ([UsuarioID])
);


GO

