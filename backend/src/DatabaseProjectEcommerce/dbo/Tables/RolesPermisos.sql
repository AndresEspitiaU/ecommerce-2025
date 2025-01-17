CREATE TABLE [dbo].[RolesPermisos] (
    [RolID]           INT      NOT NULL,
    [PermisoID]       INT      NOT NULL,
    [FechaAsignacion] DATETIME DEFAULT (getdate()) NULL,
    [AsignadoPor]     INT      NULL,
    PRIMARY KEY CLUSTERED ([RolID] ASC, [PermisoID] ASC),
    FOREIGN KEY ([AsignadoPor]) REFERENCES [dbo].[Usuarios] ([UsuarioID]),
    FOREIGN KEY ([PermisoID]) REFERENCES [dbo].[Permisos] ([PermisoID]),
    FOREIGN KEY ([RolID]) REFERENCES [dbo].[Roles] ([RolID])
);


GO

