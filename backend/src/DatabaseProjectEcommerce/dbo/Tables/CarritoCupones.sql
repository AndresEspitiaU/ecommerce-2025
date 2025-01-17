CREATE TABLE [dbo].[CarritoCupones] (
    [CarritoID]      INT             NOT NULL,
    [CuponID]        INT             NOT NULL,
    [MontoDescuento] DECIMAL (10, 2) NULL,
    [FechaAplicado]  DATETIME        DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([CarritoID] ASC, [CuponID] ASC),
    FOREIGN KEY ([CarritoID]) REFERENCES [dbo].[Carritos] ([CarritoID]),
    FOREIGN KEY ([CuponID]) REFERENCES [dbo].[Cupones] ([CuponID])
);


GO

