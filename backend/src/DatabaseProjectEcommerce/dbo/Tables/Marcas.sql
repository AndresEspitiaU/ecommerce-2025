CREATE TABLE [dbo].[Marcas] (
    [MarcaID]       INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]        VARCHAR (100) NOT NULL,
    [Descripcion]   TEXT          NULL,
    [Logo]          VARCHAR (255) NULL,
    [Slug]          VARCHAR (100) NOT NULL,
    [FechaCreacion] DATETIME      DEFAULT (getdate()) NULL,
    [Activo]        BIT           DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([MarcaID] ASC),
    UNIQUE NONCLUSTERED ([Slug] ASC)
);


GO

