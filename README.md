# Generador de PDF

- Instalar dependencias
```
npm install
```

- Iniciar el servidor
```
npm start
```

## Cómo Generar un PDF

Para generar un reporte, es necesario enviar un identificador único

| Reporte | Identificador del Reporte |
|---------|---------------------------|
|         |REPORTE_MENTAL_ADN
|         |REPORTE_FISICO_ADN
|         |REPORTE_MEDS_ADN
|         |REPORTE_MENTAL_ADN
|         |REPORTE_MENTAL_ADN

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

## Ejecutar en producción
```
npm run prod
```