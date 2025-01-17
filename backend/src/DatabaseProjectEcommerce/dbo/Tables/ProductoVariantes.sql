CREATE TABLE [dbo].[ProductoVariantes] (
    [VarianteID]      INT             IDENTITY (1, 1) NOT NULL,
    [ProductoID]      INT             NOT NULL,
    [TallaID]         INT             NOT NULL,
    [ColorID]         INT             NOT NULL,
    [SKU]             VARCHAR (50)    NOT NULL,
    [Stock]           INT             DEFAULT ((0)) NULL,
    [StockMinimo]     INT             DEFAULT ((5)) NULL,
    [PrecioAdicional] DECIMAL (10, 2) DEFAULT ((0)) NULL,
    [Estado]          VARCHAR (20)    DEFAULT ('ACTIVO') NULL,
    [FechaCreacion]   DATETIME        DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([VarianteID] ASC),
    FOREIGN KEY ([ColorID]) REFERENCES [dbo].[Colores] ([ColorID]),
    FOREIGN KEY ([ProductoID]) REFERENCES [dbo].[Productos] ([ProductoID]),
    FOREIGN KEY ([TallaID]) REFERENCES [dbo].[Tallas] ([TallaID]),
    UNIQUE NONCLUSTERED ([SKU] ASC)
);


GO

