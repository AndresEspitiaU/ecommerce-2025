CREATE TABLE [dbo].[Productos] (
    [ProductoID]          INT             IDENTITY (1, 1) NOT NULL,
    [CategoriaID]         INT             NOT NULL,
    [SubcategoriaID]      INT             NOT NULL,
    [MarcaID]             INT             NULL,
    [Codigo]              VARCHAR (50)    NOT NULL,
    [Nombre]              VARCHAR (200)   NOT NULL,
    [Descripcion]         TEXT            NULL,
    [Slug]                VARCHAR (255)   NOT NULL,
    [PrecioRegular]       DECIMAL (10, 2) NOT NULL,
    [PrecioDescuento]     DECIMAL (10, 2) NULL,
    [PorcentajeDescuento] DECIMAL (5, 2)  NULL,
    [Genero]              VARCHAR (20)    NULL,
    [Material]            VARCHAR (100)   NULL,
    [PaisOrigen]          VARCHAR (100)   NULL,
    [Peso]                DECIMAL (6, 2)  NULL,
    [MetaTitle]           VARCHAR (100)   NULL,
    [MetaDescription]     VARCHAR (255)   NULL,
    [Destacado]           BIT             DEFAULT ((0)) NULL,
    [FechaCreacion]       DATETIME        DEFAULT (getdate()) NULL,
    [FechaActualizacion]  DATETIME        NULL,
    [CreadoPor]           INT             NULL,
    [Activo]              BIT             DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([ProductoID] ASC),
    FOREIGN KEY ([CategoriaID]) REFERENCES [dbo].[Categorias] ([CategoriaID]),
    FOREIGN KEY ([MarcaID]) REFERENCES [dbo].[Marcas] ([MarcaID]),
    FOREIGN KEY ([SubcategoriaID]) REFERENCES [dbo].[Subcategorias] ([SubcategoriaID]),
    UNIQUE NONCLUSTERED ([Codigo] ASC),
    UNIQUE NONCLUSTERED ([Slug] ASC)
);


GO

