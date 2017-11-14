---
title: "Visualizacao Boqueirao"
date: 2017-11-14T08:56:47-03:00
draft: true
---

<div id="vis" width=300></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vega/3.0.7/vega.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-lite/2.0.1/vega-lite.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-embed/3.0.0-rc7/vega-embed.js"></script>
<script>
    const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    "data": {
        "url": "https://api.insa.gov.br/reservatorios/12172/monitoramento",
        "format": {
        "type": "json",
        "property": "volumes",
        "parse": {
            "DataInformacao": "utc:'%d/%m/%Y'"
                }
            }
        },

    "width": 500,
    "height": 120,

    "mark": {
        "type": "area",
        "interpolate": "monotone"
    },
    "selection": {
      "brush": {"type": "interval", "encodings": ["x"]}
    },
    "encoding": {
      "x": {
        "timeUnit" : "monthyear",
        "field": "DataInformacao",
        "type": "temporal",
        "axis": {"format": "%Y", "title" : "Volume percentual ao longo dos anos"}
       },
      "y": {
        "field": "VolumePercentual",
        "type": "quantitative",
        "axis": {"tickCount": 30, "grid": false, "title": "Volume percentual"}
         }
       }
     };
  	vegaEmbed('#vis', spec).catch(console.warn);
</script>
