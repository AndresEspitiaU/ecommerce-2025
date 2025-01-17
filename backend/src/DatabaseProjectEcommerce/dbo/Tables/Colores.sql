CREATE TABLE [dbo].[Colores] (
    [ColorID]           INT          IDENTITY (1, 1) NOT NULL,
    [Nombre]            VARCHAR (50) NOT NULL,
    [CodigoHexadecimal] VARCHAR (7)  NULL,
    [Activo]            BIT          DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([ColorID] ASC)
);


GO

