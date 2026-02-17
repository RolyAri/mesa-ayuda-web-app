# 📦 Mesa de Ayuda Interna

Sistema web compuesto por:

-   🖥 **Frontend:** Angular 20\
-   ⚙ **Backend:** Spring Boot\
-   🗄 **Base de Datos:** SQL Server
  
Listado de Solicitudes
<img width="1454" height="843" alt="image" src="https://github.com/user-attachments/assets/00422f92-a635-4a77-bf7a-859e318c0da8" />
Detalle de Solicitud
<img width="1193" height="531" alt="image" src="https://github.com/user-attachments/assets/176fc177-9f76-41f6-b21d-4056f0587074" />
Editar Solicitud
<img width="1447" height="845" alt="image" src="https://github.com/user-attachments/assets/fece597e-4696-441c-97ee-22cb64a1b271" />
Crear Solicitud
<img width="1488" height="864" alt="image" src="https://github.com/user-attachments/assets/89a36625-29c6-473f-a73d-af1e485363ec" />

<img width="1657" height="631" alt="image" src="https://github.com/user-attachments/assets/c3fa61fb-0dc3-4d12-8ca1-29f600b57caa" />


------------------------------------------------------------------------

# 📁 Estructura del Proyecto

    root/
    │
    ├── frontend/     → Aplicación Angular 20
    ├── backend/      → API REST Spring Boot
    └── database/     → Scripts SQL (creación de BD, tablas, datos iniciales)

------------------------------------------------------------------------

# 🚀 Requisitos Previos

## 🔹 Generales

-   Node.js (v18 o superior recomendado)
-   npm
-   Angular CLI
-   Java JDK 17 o superior
-   Maven o Gradle
-   SQL Server
-   Git

------------------------------------------------------------------------

# 🗄 Configuración de Base de Datos

1.  Abrir SQL Server Management Studio.
2.  Ejecutar los scripts ubicados en:

```{=html}
<!-- -->
```
    /database

### Ejemplo de configuración esperada

-   Host: `localhost`
-   Puerto: `1433`
-   Base de datos: `nombre_bd`
-   Usuario: `sa`
-   Password: `tu_password`

------------------------------------------------------------------------

# ⚙ Backend - Spring Boot

Ir a la carpeta:

    cd backend

## 🔹 Configurar conexión a base de datos

Editar:

    src/main/resources/application.properties

Ejemplo:

``` properties
spring.datasource.url=jdbc:sqlserver://localhost:puerto_bd;databaseName=nombre_bd;encrypt=true;trustServerCertificate=true
spring.datasource.username=tu_user
spring.datasource.password=tu_password
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

## 🔹 Ejecutar backend

### Maven

    mvn clean install
    mvn spring-boot:run

Backend disponible en:

    http://localhost:8080

------------------------------------------------------------------------

# 🖥 Frontend - Angular 20

Ir a:

    cd frontend

## 🔹 Instalar dependencias

    npm install

## 🔹 Configurar API

Editar:

    src/environments/environment.ts

Ejemplo:

``` ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080'
};
```

## 🔹 Ejecutar frontend

    ng serve

Disponible en:

    http://localhost:4200

------------------------------------------------------------------------

# 🔄 Flujo Completo

1.  Levantar SQL Server\
2.  Ejecutar scripts en `/database`\
3.  Iniciar backend\
4.  Iniciar frontend

# ☁️ Despliegue en Azure

Este sistema se encuentra desplegado utilizando servicios PaaS de Microsoft Azure para garantizar escalabilidad y bajo mantenimiento.

## 1. 🗄️ Base de Datos: Azure SQL
1.  **Instancia:** Se creó un servidor lógico de Azure SQL y una base de datos SQL.
2.  **Seguridad:** Se configuró una regla de firewall en el servidor para permitir el acceso desde la dirección IP local.
3.  **Provisionamiento:** El esquema inicial se cargó mediante **SQL Server Management Studio (SSMS)** ejecutando los scripts ubicados en `/database`.

## 2. 🖥️ Frontend: Azure Static Web Apps (SWA)
El despliegue del frontend se realiza mediante la CLI de Azure SWA:
1.  **Build:** Generar los archivos de producción:
    ```bash
    ng build
    ```
2.  **Instalación de herramientas:**
    ```bash
    npm install -g @azure/static-web-apps-cli
    ```
3.  **Despliegue:** Utilizando el token de implementación obtenido desde el portal de Azure:
    ```bash
    swa deploy ./dist/frontend/browser --deployment-token <TU_TOKEN> --env production
    ```

## 3. ⚙️ Backend: Azure App Service (Spring Boot)
El backend se despliega directamente mediante el plugin de Maven para Azure.

### Configuración de CORS
Se actualiza la clase `CorsConfig.java` para permitir las peticiones desde la URL de la Static Web App:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfiguration() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") 
                        .allowedOrigins("[https://tu-app-frontend.azurestaticapps.net/](https://tu-app-frontend.azurestaticapps.net/)")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") 
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```
### Despliegue con Maven
1.  Plugin en pom.xml: Se añadió el plugin de Azure Web App:
```
<plugin>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-webapp-maven-plugin</artifactId>
    <version>2.9.0</version>
</plugin>
```
2.  Configuración y Deployment:
```
# Configurar parámetros (Nombre de app, Grupo de recursos, Región, etc.)
mvn azure-webapp:config

# Ejecutar el despliegue
mvn azure-webapp:deploy
```
