# Generador de PDF

- Instalar dependencias
```
npm install
```

- Si se desea corre localmente y NO usar Docker, instalar las siguientes dependencias:

*Linux*
```
apt-get install imagemagick librsvg2-dev
```

*MacOS*
```
brew install imagemagick librsvg
```

*Windows*
Revisar este repositorio.
https://www.npmjs.com/package/anychart-nodejs

- Iniciar el servidor
```
npm start
```

### Cómo Generar un PDF

Para generar un reporte, es necesario enviar un identificador único dependiendo el reporte que se quiera generar.

| Reporte | Identificador del Reporte |
|---------|---------------------------|
|         |REPORTE_MENTAL_ADN
|         |REPORTE_FISICO_ADN
|         |REPORTE_MEDS_ADN
|         |REPORTE_METODO_MAIKA
|         |REPORTE_TOTAL_CON_ADN

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