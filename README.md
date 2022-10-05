# Maika / Generador de PDF

- Instalar dependencias

```
npm install
```

- Si se desea correr localmente y NO usar Docker, instalar las siguientes dependencias:

_Linux_

```
apt-get install imagemagick librsvg2-dev
```

_MacOS_

```
brew install imagemagick librsvg
```

_Windows_

Revisar este repositorio.
https://www.npmjs.com/package/anychart-nodejs

---

Para poder generar los PDF, es necesario usar el binario de wkhtmltopdf específico para cada sistema operativo.

_Linux_

```
cp wkhtmltox/bin/wkhtmltopdf.linux wkhtmltox/bin/wkhtmltopdf
```

_MacOS_

```
cp wkhtmltox/bin/wkhtmltopdf.mac wkhtmltox/bin/wkhtmltopdf
```

- Configurar las variables de entorno

```
cp .env.template .env
```

- Iniciar el servidor

```
npm start
```

## Respuestas de los Formularios

### Paciente

| Reporte                                           | Hoja de Cálculo                               |
| ------------------------------------------------- | --------------------------------------------- |
| Escala de Trastorno de Ansiedad Generalizada (ES) | 1GojPR3gY8fI33PUg17yY19JQlIehetcsLfYIl7Lg4AQ  |
| Escala de Trastorno de Ansiedad Generalizada (EN) | 1LA7UjA5bdRFjzV7mt8yIqBXf1jVkiI1CP4PCJI-pzCI  |
| Escala de Estrés Percibido (ES)                   | 1DiZFEn-iWLmmwi9Kts2hHPhVfpwjEk_euTZJhcHeLGo  |
| Escala de Estrés Percibido (EN)                   | 1vFYRNllTpHGQSQzq49gPB2tKvOYE2zGmY66DVJRTw0E  |
| Salud del Paciente PHQ-9 (ES)                     | 1H0paNaHbzuvXRpvw6NMWLIkIMeoxOmcby7N5DRiAb5g  |
| Salud del Paciente PHQ-9 (EN)                     | 1U24xod6J-\_y8MrbHIjPe23QgxGMkhVQSC039sl6cmzI |
| Síntomas Médicos (ES)                             | 1Z-Dwj_YKzrunsGLW3uDpYBFEHkIZ-eXkS-MFPGVJzxY  |
| Síntomas Médicos (EN)                             | 1xdKeJWjw6mgGBEA0IPQp_BOyiOEfB00o0qXS0b_hGoI  |
| Respuesta a Medicamentos (ES)                     | 1NovIEzZb6Zde7BKSUtR6P2KjgZCiGq-1HyO9Wnn7V18  |

### Médico

| Reporte                | Hoja de Cálculo                              |
| ---------------------- | -------------------------------------------- |
| Filtro ADN Físico (ES) | 1RtyQxNGrrbi4zKKOaKYdg9P0fgj7L9Sve1gKRvrkz5o |
| Filtro ADN Físico (EN) | 1z6rrD7VEbpqXtafhUvquDhfVQRA6_ZTOjd3byT0jekU |
| Filtro ADN Mente (ES)  | 12zWM0PEp9q8Zuol4ZBNU0nOGDLmVD4HSnT3HjPQAHAc |
| Filtro ADN Mente (EN)  | 1rzRAdMiA1pXenPgLFhW5XM3ZYOEo7UnqNVaIGLRLctY |

## Cómo Generar un PDF

Para generar un reporte, es necesario enviar un identificador único dependiendo el reporte que se quiera generar.

| Reporte | Identificador del Reporte |
| ------- | ------------------------- |
|         | REPORTE_MENTAL_ADN        |
|         | REPORTE_FISICO_ADN        |
|         | REPORTE_MEDS_ADN          |
|         | REPORTE_METODO_MAIKA      |
|         | REPORTE_TOTAL_CON_ADN     |
|         | REPORTE_CONSOLIDADO       |

- Enviar una petición POST de la siguiente manera:

```
curl \
  -d '{"id": "<id_del_paciente>", "report": "<id_del_reporte>"}' \
  -H "Content-Type: application/json" \
  -X POST http://localhost:4000/base
```

**id_del_paciente:** Es la cédula del paciente.

**id_del_reporte:** Es la id del paciente.

Por ejemplo:

```
curl \
  -d '{"id": "2050820455", "report": "REPORTE_FISICO_ADN"}' \
  -H "Content-Type: application/json" \
  -X POST http://localhost:4000/base
```

A partir esta peticion se recibe el siguiente objeto:

```
{
  "message": 'ok',
  "file": "<base64_encoded>",
  "metadata:": {
    "date": "10/1/2020",
    "id": "1870820221",
    "report": "REPORTE_FISICO_ADN",
    "patientName": "Nombre del Paciente"
  }
}
```

El Base64 obtenido en llave `file` es el que se usa para generar el archivo PDF en `S3`.

En caso de fallar se pueden recibir los siguientes errores:

- Si se ha excedido la cuota del API de Google:

```
{
  timestamp: 1607717525860,
  code: 'Google API / Quota Exceeded',
  status: 429,
  messages: [
    'Se han excedido el límite de consultas a los resultados. Por favor intente en 1 o 2 minutos.'
  ],
  data: null
}
```

- Si no hay resultados en la spreadsheet:

```
{
  timestamp: 1607717525860,
  status: 503,
  code: 'Maika / No Form Responses',
  messages: [
    `No hay registros en el formulario ${formID}`
  ],
  data: {
    received: formID,
    expected: null
  }
}
```

- Si dentro de los resultados no se encuentra un registro con el ID enviado:

```
{
  timestamp: 1607717525860,
  code: 'Maika / Record Not Found',
  status: 404,
  messages: [
    `No se encontró un registro con ID ${value}`
  ],
  data: {
    received: value,
    expected: null
  }
}
```

**CONSIDERACIONES**

1. Debido a que los datos son guardados en en Hojas de Calculo de Google, no se da garantía si esos datos se encuentran mal escritos, desordenados, mal formateados, entre otros.
2. Es de gran importancia NO cambiar el nombre de los campos que actualmente existen ya que los nombres de estos sirven como llaves para su correcta identificación. El cambio de alguno de estos puede causar una falla en el proceso de generación de los PDF.

### Ejecutar en producción

```
npm run prod
```

## Docker

- Crear la imagen

```
docker build --tag maika-pdf-image-ubuntu-1604 .
```

- Montar el container

```
docker run --publish 4000:4000 --name maika-pdf maika-pdf-image-ubuntu-1604
```

- Iniciar el contenedor

```
docker start maika-pdf
```

- Detener el contenedor

```
docker stop maika-pdf
```

- Entrar al contenedor

```
docker exec -it maika-pdf /bin/bash
```

- Eliminar el container

```
docker container rm maika-pdf
```

- Ver los logs del container

```
docker container logs maika-pdf
```

```
docker stop maika-pdf && \
docker container rm maika-pdf && \
docker build --tag maika-pdf-image-ubuntu-1604 . && \
docker run --publish 4000:4000 --name maika-pdf maika-pdf-image-ubuntu-1604
```

## Generación y Envío de PDF

TBD
