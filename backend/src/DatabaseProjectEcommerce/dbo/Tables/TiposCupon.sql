CREATE TABLE [dbo].[TiposCupon] (
    [TipoCuponID] INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]      VARCHAR (50)  NOT NULL,
    [Descripcion] VARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([TipoCuponID] ASC)
);


GO

