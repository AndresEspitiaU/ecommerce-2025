## Progreso Actual ✅

|**Funcionalidad**|**Estado**|**Descripción**|
|---|---|---|
|🔑 **Login/Register**|✅ Completado|Sistema de autenticación con JWT funcionando.|
|🛡️ **Middleware**|✅ Completado|Verificación de tokens y protección de rutas.|
|👥 **Roles y Permisos**|✅ Completado|Gestión básica de roles y permisos.|

---

## **1. Backend: Funcionalidades Principales**

|**Paso**|**Tarea**|**Descripción**|
|---|---|---|
|⚙️ Configuración|Crear proyecto con Bun|Inicializa el proyecto: `bun init ecommerce-backend`.|
|🌐 Conexión DB|Configurar conexión a SQL Server|Configura la conexión con **Prisma** o **Sequelize**.|
|📦 Dependencias|Instalar dependencias necesarias|`bun add express cors dotenv jsonwebtoken bcrypt body-parser`.|
|🔐 Variables|Configurar `.env`|Agrega claves como `DATABASE_URL`, `JWT_SECRET`, y `PORT`.|

---

## **2. Sistema de Autenticación**

|**Paso**|**Endpoint**|**Descripción**|
|---|---|---|
|📝 Registro|`POST /api/auth/register`|Crea usuarios con validación de roles.|
|🔑 Login|`POST /api/auth/login`|Autenticación y generación de tokens JWT.|
|🔒 Middleware|`verifyToken`|Middleware para proteger rutas con JWT.|
|👥 Roles|`checkRole(role)`|Middleware para verificar roles específicos (e.g., Admin).|

---

## **3. Gestión de Roles y Permisos**

|**Paso**|**Endpoint**|**Descripción**|
|---|---|---|
|➕ Crear Rol|`POST /api/roles`|Endpoint para agregar un nuevo rol.|
|📝 Asignar Rol|`POST /api/users/:id/roles`|Asignar roles a usuarios específicos.|
|🔍 Validar Permisos|`checkPermissions(role)`|Middleware para validar permisos en rutas protegidas.|

---

## **4. Próximos Pasos**

|**Área**|**Tareas**|**Icono**|**Descripción**|
|---|---|---|---|
|**Gestión de Usuarios**|Crear CRUD usuarios|👥|Listar, editar y eliminar usuarios existentes.|
|**Gestión de Productos**|Crear CRUD productos y variantes|🛍️|Implementar categorías, variantes y carga de imágenes.|
|**Carrito de Compras**|Crear CRUD carrito|🛒|Agregar, actualizar y eliminar productos en el carrito de compras.|
|**Pedidos**|Crear flujo de pedidos|📦|Implementar estados de pedido (Pendiente, Pagado, Enviado, Entregado).|
|**Cupones**|Crear sistema de cupones|🎟️|Validar descuentos y aplicarlos en el carrito.|

---

## **5. Testing y Debugging**

|**Herramienta**|**Tarea**|**Icono**|**Descripción**|
|---|---|---|---|
|**Postman/Insomnia**|Probar endpoints|🛠️|Verificar que las rutas devuelvan los datos esperados.|
|**Jest/Mocha**|Implementar pruebas unitarias|✅|Crear pruebas para lógica crítica como roles, permisos y JWT.|
|**Logs**|Verificar errores y solicitudes|📋|Implementar logs básicos con consola o herramientas como Winston.|

---

## **6. Referencias**

|**Recurso**|**Descripción**|
|---|---|
|📄 [Documentación de Express](https://expressjs.com/)|Guía oficial para el framework Express.|
|📄 JWT|Introducción a JSON Web Tokens.|
|📄 [Prisma ORM](https://www.prisma.io/)|Documentación para configurar bases de datos con Prisma.|