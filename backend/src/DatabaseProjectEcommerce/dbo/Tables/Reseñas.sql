CREATE TABLE [dbo].[Reseñas] (
    [ReseñaID]            INT           IDENTITY (1, 1) NOT NULL,
    [ProductoID]          INT           NOT NULL,
    [UsuarioID]           INT           NOT NULL,
    [PedidoID]            INT           NULL,
    [Calificacion]        INT           NULL,
    [Titulo]              VARCHAR (100) NULL,
    [Comentario]          TEXT          NULL,
    [Recomendado]         BIT           DEFAULT ((1)) NULL,
    [CalificacionTalla]   INT           NULL,
    [CalificacionCalidad] INT           NULL,
    [ComentarioTalla]     VARCHAR (50)  NULL,
    [TallaComprada]       VARCHAR (20)  NULL,
    [Estado]              VARCHAR (20)  DEFAULT ('PENDIENTE') NULL,
    [Verificada]          BIT           DEFAULT ((0)) NULL,
    [Reportada]           BIT           DEFAULT ((0)) NULL,
    [MotivoRechazo]       VARCHAR (255) NULL,
    [MeGusta]             INT           DEFAULT ((0)) NULL,
    [NoMeGusta]           INT           DEFAULT ((0)) NULL,
    [FechaCreacion]       DATETIME      DEFAULT (getdate()) NULL,
    [FechaModeracion]     DATETIME      NULL,
    [FechaActualizacion]  DATETIME      NULL,
    PRIMARY KEY CLUSTERED ([ReseñaID] ASC),
    CHECK ([Calificacion]>=(1) AND [Calificacion]<=(5)),
    CHECK ([CalificacionCalidad]>=(1) AND [CalificacionCalidad]<=(5)),
    CHECK ([CalificacionTalla]>=(1) AND [CalificacionTalla]<=(5)),
    FOREIGN KEY ([PedidoID]) REFERENCES [dbo].[Pedidos] ([PedidoID]),
    FOREIGN KEY ([ProductoID]) REFERENCES [dbo].[Productos] ([ProductoID]),
    FOREIGN KEY ([UsuarioID]) REFERENCES [dbo].[Usuarios] ([UsuarioID])
);


GO

