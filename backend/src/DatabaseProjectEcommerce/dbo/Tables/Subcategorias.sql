CREATE TABLE [dbo].[Subcategorias] (
    [SubcategoriaID]     INT           IDENTITY (1, 1) NOT NULL,
    [CategoriaID]        INT           NOT NULL,
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
    PRIMARY KEY CLUSTERED ([SubcategoriaID] ASC),
    FOREIGN KEY ([CategoriaID]) REFERENCES [dbo].[Categorias] ([CategoriaID]),
    UNIQUE NONCLUSTERED ([Slug] ASC)
);


GO

CREATE NONCLUSTERED INDEX [IX_Subcategorias_Slug]
    ON [dbo].[Subcategorias]([Slug] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Subcategorias_CategoriaID]
    ON [dbo].[Subcategorias]([CategoriaID] ASC);


GO

