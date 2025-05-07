# Guía de Desarrollo de Calc-8

Esta guía está dirigida a desarrolladores que desean contribuir al proyecto Calc-8, una calculadora web implementada con WebAssembly y Go.

## Entorno de Desarrollo

### Requisitos Previos

1. **Go** (v1.16 o superior)
   - Descargar desde [golang.org](https://golang.org/dl/)
   - Verificar instalación: `go version`

2. **Editor/IDE recomendado**
   - Visual Studio Code con extensiones para Go
   - GoLand
   - Cualquier editor con soporte para Go y JavaScript

3. **Navegador con soporte WebAssembly**
   - Chrome 57+
   - Firefox 52+
   - Safari 11+
   - Edge 16+

### Configuración del Entorno

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/DavidDevGt/calc-8-wasm.git
   cd calc-8-wasm
   ```

2. **Instalar dependencias Go**
   ```bash
   go mod download
   ```

## Estructura del Código

La aplicación sigue una estructura clara para facilitar la colaboración:

```
└── wasm-test/
    ├── cmd/web/             # Código Go para WebAssembly
    ├── docs/                # Documentación
    └── web/                 # Frontend
        ├── index.html       # Estructura HTML
        ├── styles.css       # Estilos CSS
        ├── main.js          # Lógica JavaScript
        ├── wasm_exec.js     # Runtime WebAssembly
        └── main.wasm        # Binario compilado
```

## Ciclo de Desarrollo

### 1. Compilación de WebAssembly

Cada vez que modifiques el código Go, necesitarás recompilarlo a WebAssembly:

```bash
GOOS=js GOARCH=wasm go build -o web/main.wasm ./cmd/web
```

En Windows PowerShell:
```powershell
$env:GOOS="js"; $env:GOARCH="wasm"; go build -o web/main.wasm ./cmd/web
```

### 2. Servir la Aplicación

Para probar localmente:

```bash
cd web
python -m http.server 8080
```

Luego visita [http://localhost:8080](http://localhost:8080) en tu navegador.

### 3. Depuración

#### Depuración de JavaScript
- Utiliza las herramientas de desarrollo del navegador (F12)
- Examina la consola para posibles errores
- Usa puntos de interrupción para seguir el flujo de ejecución

#### Depuración de WebAssembly/Go
- Imprime mensajes de depuración en la consola:
  ```go
  js.Global().Get("console").Call("log", "Mensaje de depuración desde Go")
  ```
- Examina los valores pasados a las funciones Go:
  ```go
  func add(this js.Value, args []js.Value) interface{} {
    js.Global().Get("console").Call("log", "Argumento 1:", args[0].Float())
    js.Global().Get("console").Call("log", "Argumento 2:", args[1].Float())
    // ... resto del código
  }
  ```

## Guía de Estilo

### Go

- Sigue la guía de estilo oficial de Go: [Effective Go](https://golang.org/doc/effective_go)
- Usa `gofmt` para formatear el código
- Documenta las funciones exportadas con comentarios en formato GoDoc

### JavaScript

- Sigue el estándar ES6+
- Mantén el código modular y fácil de entender
- Usa nombres de variables descriptivos
- Comenta las secciones complejas del código

### CSS

- Utiliza las variables CSS existentes en `:root`
- Mantén la consistencia con el diseño retro/pixel art
- Asegúrate de que los cambios sean responsivos

## Pruebas

### Pruebas Manuales

Antes de enviar un pull request, asegúrate de probar manualmente la aplicación verificando que:

1. Todas las operaciones básicas funcionen correctamente
2. La interfaz se muestre correctamente en diferentes tamaños de pantalla
3. El manejo de errores (como división por cero) funcione adecuadamente
4. Las animaciones y efectos visuales no presenten problemas

### Pruebas Automatizadas (Futuro)

Estamos planeando implementar:
- Pruebas unitarias para código Go
- Pruebas de integración para la comunicación JavaScript-WebAssembly
- Pruebas E2E para la interfaz de usuario

## Proceso de Contribución

1. **Crea una rama para tu característica o corrección**
   ```bash
   git checkout -b feature/nueva-caracteristica
   ```

2. **Realiza tus cambios y asegúrate de que la aplicación sigue funcionando**

3. **Haz commit de tus cambios con mensajes descriptivos**
   ```bash
   git commit -m "Añade nueva característica: calculadora científica"
   ```

4. **Envía tus cambios al repositorio**
   ```bash
   git push origin feature/nueva-caracteristica
   ```

5. **Crea un Pull Request** detallando:
   - Qué cambios has realizado
   - Por qué son necesarios
   - Cómo se pueden probar
   - Cualquier dependencia nueva

6. **Participa en la revisión del código** respondiendo a preguntas o comentarios

## Roadmap

Estamos planeando añadir estas características en el futuro:

1. Funciones de calculadora científica (seno, coseno, etc.)
2. Historial de operaciones
3. Temas adicionales de interfaz
4. Persistencia de configuración

Si quieres trabajar en alguna de estas características, por favor comenta en los issues existentes o crea uno nuevo para discutir la implementación antes de comenzar el desarrollo.

## Recursos Útiles

- [Documentación de WebAssembly](https://webassembly.org/)
- [Go WebAssembly Wiki](https://github.com/golang/go/wiki/WebAssembly)
- [syscall/js Package Documentation](https://pkg.go.dev/syscall/js)
- [MDN Web Docs: WebAssembly](https://developer.mozilla.org/es/docs/WebAssembly)

## Obtener Ayuda

Si tienes problemas o preguntas, puedes:
- Abrir un issue en el repositorio
- Contactar a los mantenedores por correo electrónico
- Unirte a nuestro canal de Discord (próximamente)
