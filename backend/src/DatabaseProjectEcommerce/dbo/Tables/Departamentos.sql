CREATE TABLE [dbo].[Departamentos] (
    [DepartamentoID] INT          IDENTITY (1, 1) NOT NULL,
    [Nombre]         VARCHAR (50) NOT NULL,
    [Codigo]         VARCHAR (5)  NOT NULL,
    [Activo]         BIT          DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([DepartamentoID] ASC)
);


GO

