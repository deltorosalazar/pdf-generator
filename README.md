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

Para generar un reporte, es necesario enviar un identificador único

| Reporte | Identificador del Reporte |
|---------|---------------------------|
|         |REPORTE_MENTAL_ADN
|         |REPORTE_FISICO_ADN
|         |REPORTE_MEDS_ADN
|         |REPORTE_METODO_MAIKA
|         |REPORTE_TOTAL_CON_ADN

- Enviar una petición POST de la siguiente manera

```
curl \
  -d '{"id": "<id_del_paciente>", "report": "<id_del_reporte>"}' \
  -H "Content-Type: application/json" \
  -X POST http://localhost:4000
```
**id_del_paciente:** Es la cédula del paciente.

**id_del_reporte:** Es la id del paciente.

Por ejemplo

```
curl \
  -d '{"id": "2050820455", "report": "REPORTE_FISICO_ADN"}' \
  -H "Content-Type: application/json" \
  -X POST http://localhost:4000
```

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

docker stop maika-pdf && \
docker container rm maika-pdf && \
docker build --tag maika-pdf-image-ubuntu-1604 . && \
docker run --publish 4000:4000 --name maika-pdf maika-pdf-image-ubuntu-1604