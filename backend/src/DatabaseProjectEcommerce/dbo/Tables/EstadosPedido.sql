CREATE TABLE [dbo].[EstadosPedido] (
    [EstadoID]           INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]             VARCHAR (50)  NOT NULL,
    [Descripcion]        VARCHAR (255) NULL,
    [ColorHex]           VARCHAR (7)   NULL,
    [OrdenVisualizacion] INT           NULL,
    PRIMARY KEY CLUSTERED ([EstadoID] ASC)
);


GO

