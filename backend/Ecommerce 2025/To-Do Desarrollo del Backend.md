## **1. Autenticación y Usuarios**

| **Funcionalidad**              | **Estado** | **Descripción**                               |
| ------------------------------ | ---------- | --------------------------------------------- |
| 🔑 **Login**                   | ✅          | Endpoint para iniciar sesión con JWT.         |
| 📝 **Registro**                | ✅          | Endpoint para registrar usuarios.             |
| 🔒 **Middleware de Seguridad** | ✅          | Middleware para validar JWT y proteger rutas. |
| 👥 **Gestión de Roles**        | ✅          | CRUD para roles y asignación a usuarios.      |
| 🛡️ **Gestión de Permisos**    | ✅          | CRUD para permisos y asignación a roles.      |

---

## **2. Gestión de Categorías**

| **Funcionalidad**             | **Estado** | **Descripción**                                         |
| ----------------------------- | ---------- | ------------------------------------------------------- |
| 🗂️ **Categorías**            | ❌          | CRUD completo para categorías.                          |
| 🗂️ **Subcategorías**         | ❌          | CRUD completo para subcategorías.                       |
| 🔗 **Relación con Productos** | ❌          | Implementar lógica para enlazar categorías y productos. |

---

## **3. Gestión de Productos**

| **Funcionalidad**                   | **Estado** | **Descripción**                                      |
| ----------------------------------- | ---------- | ---------------------------------------------------- |
| 🛍️ **Productos**                   | ❌          | CRUD completo para productos.                        |
| 🎨 **Variantes (Tallas y Colores)** | ❌          | Crear lógica para manejar variantes de productos.    |
| 📸 **Carga de Imágenes**            | ❌          | Implementar lógica para subir y relacionar imágenes. |
| 🔍 **Filtro por Categorías**        | ❌          | Endpoint para filtrar productos por categoría.       |

---

## **4. Carrito de Compras**

| **Funcionalidad**          | **Estado** | **Descripción**                                          |
| -------------------------- | ---------- | -------------------------------------------------------- |
| 🛒 **Gestión del Carrito** | ❌          | CRUD completo para carritos de compra.                   |
| ➕ **Agregar al Carrito**   | ❌          | Endpoint para añadir productos al carrito.               |
| ➖ **Eliminar del Carrito** | ❌          | Endpoint para remover productos del carrito.             |
| 📈 **Cálculo de Totales**  | ❌          | Lógica para calcular subtotales, impuestos y descuentos. |

---

## **5. Pedidos**

| **Funcionalidad**           | **Estado** | **Descripción**                                  |
| --------------------------- | ---------- | ------------------------------------------------ |
| 📦 **Gestión de Pedidos**   | ❌          | CRUD completo para pedidos.                      |
| 🛠️ **Estados del Pedido**  | ❌          | CRUD para gestionar estados de pedido.           |
| 🔄 **Historial de Estados** | ❌          | Lógica para registrar cambios de estado.         |
| 💳 **Información de Pago**  | ❌          | Lógica para capturar y guardar detalles de pago. |

---

## **6. Cupones y Descuentos**

| **Funcionalidad**                | **Estado** | **Descripción**                                        |
| -------------------------------- | ---------- | ------------------------------------------------------ |
| 🎟️ **Gestión de Cupones**       | ❌          | CRUD completo para cupones.                            |
| 🔍 **Validación de Cupones**     | ❌          | Lógica para validar cupones en el carrito.             |
| 🛍️ **Aplicación de Descuentos** | ❌          | Lógica para aplicar descuentos en totales del carrito. |

---

## **7. Reseñas y Calificaciones**

| **Funcionalidad**          | **Estado** | **Descripción**                                     |
| -------------------------- | ---------- | --------------------------------------------------- |
| ⭐ **Gestión de Reseñas**   | ❌          | CRUD completo para reseñas.                         |
| 📸 **Imágenes en Reseñas** | ❌          | Lógica para cargar imágenes relacionadas a reseñas. |
| 👍 **Votos en Reseñas**    | ❌          | Lógica para votar reseñas (Me gusta/No me gusta).   |