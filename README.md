# PruebaAir
Technical Test for Airtech BPO.

# Retos de Código y Conceptos en JavaScript

Este repositorio contiene soluciones a varios problemas de codificación en JavaScript, demostrando diversos patrones de programación, técnicas de optimización y buenas prácticas.

## Problemas Resueltos

1.  **Problema 1-A:** Crear un objeto con un método `hello(name)` que imprima "Hello <nombre>" en la consola.
2.  **Problema 1-B:** Implementar formas de hacer que una propiedad `name` sea inmutable.
3.  **Problema 2:** Escribir una función que encuentre y muestre las 5 ciudades más frecuentes en un array, ordenadas por frecuencia (de mayor a menor), implementando tanto una versión estándar como una optimizada con memoización.

## Implementación y Conceptos Clave

A continuación, se detallan las soluciones y los conceptos aplicados en cada problema:

### Problema 1-A: `createGreeter`

* **Patrón:** Se utiliza un **Patrón Fábrica (Factory Pattern)**. La función `createGreeter` actúa como una fábrica que produce objetos "greeter" sin necesidad de usar la palabra clave `new`. Esto encapsula la lógica de creación del objeto.
* **Buenas Prácticas:**
    * **Parámetros por Defecto (Default Parameters):** Se usan valores por defecto (`defaultName = 'Guest'`, `name = defaultName`) para hacer la función más robusta y fácil de usar, evitando errores si no se proporcionan nombres.
    * **Encadenamiento de Métodos (Method Chaining):** El método `hello` retorna `this`, permitiendo llamadas consecutivas como `greeter.hello('Alice').hello('Bob');`, lo que ofrece una API más fluida.
    * **Validación de Tipos:** Se verifica que los nombres sean strings (`typeof name !== 'string'`) para prevenir errores inesperados y lanzar `TypeError` descriptivos, mejorando la robustez.

### Problema 1-B: `Person` (Inmutabilidad)

* **Concepto:** **Inmutabilidad**. Se busca que el estado interno del objeto (la propiedad `name`) no pueda ser modificado después de su creación. La inmutabilidad facilita el razonamiento sobre el estado, previene efectos secundarios inesperados y es fundamental en patrones como la programación funcional o la gestión de estado en frameworks modernos.
* **Implementación:** **Campos Privados de Clase (`#name`)**. Se utiliza la sintaxis de campos privados (`#`) de ESNext/ES2022 para asegurar que la propiedad `name` sea verdaderamente privada y no accesible ni modificable desde fuera de la clase.
* **Buenas Prácticas:**
    * **Encapsulamiento:** El campo `#name` está encapsulado dentro de la clase.
    * **Control de Acceso:** Se proporciona un método `get name()` (getter) para permitir el acceso de *lectura* al nombre, pero no se define un `set name()` (setter), reforzando así la inmutabilidad de la propiedad desde el exterior.

### Problema 2: `findTopCities` y `memorizedFindTopCities`

#### `findTopCities` (Versión Estándar)

* **Algoritmo Central:**
    * **Conteo de Frecuencia:** Se usa un `Map` para almacenar la frecuencia de cada ciudad. `Map` es ideal aquí por su eficiencia en búsquedas, inserciones y eliminaciones de claves (nombres de ciudades).
    * **Normalización:** Se convierte cada ciudad a minúsculas (`toLowerCase()`) antes de contarla (configurable con `caseSensitive`) para asegurar que "Madrid" y "madrid" se traten como la misma ciudad si así se desea.
    * **Ordenación (Sorting):** Se realiza una ordenación de dos niveles:
        1.  Por frecuencia (descendente): `b[1] - a[1]`.
        2.  Por nombre de ciudad (alfabético ascendente) en caso de empate en frecuencia: `a[0].localeCompare(b[0])`. Esto asegura un **resultado determinista** (el mismo input siempre da el mismo orden de salida).
* **Buenas Prácticas:**
    * **Objeto de Opciones:** Se utiliza un objeto `options` con desestructuración y valores por defecto (`const { caseSensitive = false, logResults = false } = options;`) para pasar parámetros opcionales de forma flexible y legible.
    * **Manejo de Errores:** Se incluyen validaciones para los tipos de entrada (`Array.isArray`, `typeof count`) y rangos (`count < 1`), lanzando errores específicos (`TypeError`, `RangeError`) para indicar claramente el problema.
    * **Claridad:** La lógica está separada en pasos claros: validación, conteo, ordenación, formateo/corte (`slice`, `map`).

#### `memorizedFindTopCities` (Optimización)

* **Concepto/Patrón:** **Memoización**. Es una técnica de optimización que consiste en almacenar en caché los resultados de llamadas a funciones costosas y devolver el resultado cacheado cuando se repiten las mismas entradas. Es especialmente útil cuando una función es llamada múltiples veces con los mismos argumentos.
* **Implementación:**
    * **IIFE (Immediately Invoked Function Expression) + Clausura (Closure):** Se usa una IIFE `(() => { ... })()` para crear un ámbito privado donde se inicializa la `cache` (`const cache = new WeakMap();`). La función interna retornada por la IIFE forma una clausura, "recordando" y manteniendo acceso a esta `cache` privada entre llamadas, sin exponerla globalmente.
    * **Estructura de Caché (`WeakMap` y `Map`):**
        * Se usa un `WeakMap` como caché principal. Las claves del `WeakMap` son los *arrays* de ciudades (`cities`). Esto es crucial porque si el array original deja de ser referenciado en otras partes del programa, el recolector de basura puede eliminarlo junto con su entrada en el `WeakMap`, **previniendo fugas de memoria**.
        * El valor asociado a cada array en el `WeakMap` es un `Map` normal. Este `Map` interno usa una `cacheKey` (basada en `count` y `options`) como clave y el array de resultados (`result`) como valor.
    * **Clave de Caché (`cacheKey`):** Se genera una clave única usando `JSON.stringify` sobre un objeto que contiene todos los parámetros que afectan al resultado (`count` y `options`). Esto asegura que diferentes combinaciones de parámetros tengan entradas de caché distintas.
* **Optimización:** Reduce drásticamente el tiempo de ejecución para llamadas repetidas con los mismos argumentos (`cities`, `count`, `options`), ya que evita recalcular todo el proceso (conteo, ordenación) y devuelve directamente el resultado cacheado.

#### Pruebas de Rendimiento (Concepto)

* **Propósito:** Comparar objetivamente el rendimiento de la versión estándar vs. la memorizada.
* **Metodología:**
    * Usar `performance.now()` para mediciones de tiempo precisas en milisegundos.
    * Ejecutar ambas funciones múltiples veces con los mismos datos.
    * Medir la 1ª ejecución de la versión memorizada ("cache miss") y la 2ª ejecución ("cache hit").
    * Probar con diferentes tamaños de datos (pequeños y grandes) para observar el impacto de la optimización.
    * Calcular la diferencia de tiempo y el factor de mejora (speedup).

## Resumen de Buenas Prácticas y Optimizaciones

* **Encapsulamiento:** Uso de IIFE+Closures y Clases con campos privados para proteger el estado interno.
* **Inmutabilidad:** Garantizar que el estado no cambie inesperadamente (Problema 1-B).
* **Patrones de Diseño:** Factory Pattern, Memoization.
* **Características Modernas de JS:** `Map`, `WeakMap`, Funciones Flecha, Desestructuración, Parámetros por Defecto, Campos Privados.
* **Robustez:** Manejo de errores explícito y validación de tipos/rangos.
* **Legibilidad:** Nombres claros para variables y funciones, código estructurado.
* **Rendimiento:** Optimización mediante memoización y elección adecuada de estructuras de datos (`Map`, `WeakMap`).
* **Determinismo:** Asegurar salidas consistentes mediante ordenación secundaria en caso de empates.

## Cómo Ejecutar (Ejemplo para Node.js)

1.  Clona este repositorio (si aplica).
2.  Navega al directorio del proyecto en tu terminal.
3.  Ejecuta el script principal que contiene el menú interactivo:
    ```bash
    node nombre_del_script.js 
    ```
4.  Sigue las instrucciones del menú en la consola.
