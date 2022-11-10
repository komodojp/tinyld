const chartistSvg = require('chartist-svg')

module.exports = (data) => {
  const length = Object.keys(data.tinyld.size)
  var graph = {
    title: 'NodeJS Language Detection - Execution Time',
    subtitle: 'in milliseconds (lower is better)',
    labels: length,
    series: ['tinyld', 'langdetect', 'cld', 'franc'].map((lib) => {
      return length.map((len) => {
        return data[lib].size[len].execution_time
      })
    })
  }

  var options = {
    options: {
      low: 0,
      seriesBarDistance: 16,
      onlyInteger: true,
      // reverseData: true,
      // horizontalBars: true,
      width: 1200,
      height: 600
    },
    css: `
svg { background: #FFF; }

.ct-series-a .ct-bar, .ct-series-a .ct-line, .ct-series-a .ct-point, .ct-series-a .ct-slice-donut {
    stroke: #468966;
    stroke-width: 16px !important;
}
.ct-series-b .ct-bar, .ct-series-b .ct-line, .ct-series-b .ct-point, .ct-series-b .ct-slice-donut {
    stroke: #98BAE7;
    stroke-width: 8px !important;
}
.ct-series-c .ct-bar, .ct-series-c .ct-line, .ct-series-c .ct-point, .ct-series-c .ct-slice-donut {
    stroke: #FEC771;
    stroke-width: 8px !important;
}
.ct-series-d .ct-bar, .ct-series-d .ct-line, .ct-series-d .ct-point, .ct-series-d .ct-slice-donut {
    stroke: #F38181;
    stroke-width: 8px !important;
}
.ct-series-e .ct-bar, .ct-series-e .ct-line, .ct-series-e .ct-point, .ct-series-e .ct-slice-donut {
    stroke: #D47AE8;
    stroke-width: 8px !important;
}
`
  }

  return chartistSvg('line', graph, options)
}
