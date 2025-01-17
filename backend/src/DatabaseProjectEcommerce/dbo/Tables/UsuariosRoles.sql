CREATE TABLE [dbo].[UsuariosRoles] (
    [UsuarioID]       INT      NOT NULL,
    [RolID]           INT      NOT NULL,
    [FechaAsignacion] DATETIME DEFAULT (getdate()) NULL,
    [AsignadoPor]     INT      NULL,
    [FechaExpiracion] DATETIME NULL,
    [Activo]          BIT      DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([UsuarioID] ASC, [RolID] ASC),
    FOREIGN KEY ([AsignadoPor]) REFERENCES [dbo].[Usuarios] ([UsuarioID]),
    FOREIGN KEY ([RolID]) REFERENCES [dbo].[Roles] ([RolID]),
    FOREIGN KEY ([UsuarioID]) REFERENCES [dbo].[Usuarios] ([UsuarioID])
);


GO

