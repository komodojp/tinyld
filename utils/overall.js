const chartistSvg = require('chartist-svg')

module.exports = (data) => {
  const libraries = Object.keys(data)

  var graph = {
    title: 'NodeJS Language Detection - Overall Accuracy',
    subtitle: ' (green: Success, orange: Unidentified, red: Error)',
    labels: libraries,
    series: [
      Object.values(data).map((x) => x.stats.success_rate),
      Object.values(data).map((x) => x.stats.unindentified_rate),
      Object.values(data).map((x) => x.stats.error_rate)
    ]
  }

  var options = {
    options: {
      low: 30,
      high: 100,
      onlyInteger: true,
      width: 1200,
      height: 600,
      stackBars: true
    },
    css: `
svg { background: #FFF; }

.ct-series-a .ct-bar, .ct-series-a .ct-line, .ct-series-a .ct-point, .ct-series-a .ct-slice-donut {
    stroke: #468966;
    stroke-width: 40px !important;
}
.ct-series-b .ct-bar, .ct-series-b .ct-line, .ct-series-b .ct-point, .ct-series-b .ct-slice-donut {
    stroke: #FEC771;
    stroke-width: 40px !important;
}
.ct-series-c .ct-bar, .ct-series-c .ct-line, .ct-series-c .ct-point, .ct-series-c .ct-slice-donut {
    stroke: #EB7070;
    stroke-width: 40px !important;
}
`
  }

  return chartistSvg('bar', graph, options)
}
