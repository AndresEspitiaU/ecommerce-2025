CREATE TABLE [dbo].[Permisos] (
    [PermisoID]     INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]        VARCHAR (100) NOT NULL,
    [Codigo]        VARCHAR (50)  NOT NULL,
    [Descripcion]   VARCHAR (255) NULL,
    [Modulo]        VARCHAR (50)  NOT NULL,
    [FechaCreacion] DATETIME      DEFAULT (getdate()) NULL,
    [Activo]        BIT           DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([PermisoID] ASC),
    UNIQUE NONCLUSTERED ([Codigo] ASC),
    UNIQUE NONCLUSTERED ([Nombre] ASC)
);


GO

