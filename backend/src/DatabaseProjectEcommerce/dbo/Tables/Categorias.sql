CREATE TABLE [dbo].[Categorias] (
    [CategoriaID]        INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]             VARCHAR (100) NOT NULL,
    [Descripcion]        TEXT          NULL,
    [Slug]               VARCHAR (100) NOT NULL,
    [ImagenURL]          VARCHAR (255) NULL,
    [IconoURL]           VARCHAR (255) NULL,
    [MetaTitle]          VARCHAR (100) NULL,
    [MetaDescription]    VARCHAR (255) NULL,
    [OrdenVisualizacion] INT           DEFAULT ((0)) NULL,
    [FechaCreacion]      DATETIME      DEFAULT (getdate()) NULL,
    [FechaActualizacion] DATETIME      NULL,
    [CreadoPor]          INT           NULL,
    [Activo]             BIT           DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([CategoriaID] ASC),
    UNIQUE NONCLUSTERED ([Slug] ASC)
);


GO

CREATE NONCLUSTERED INDEX [IX_Categorias_Slug]
    ON [dbo].[Categorias]([Slug] ASC);


GO

