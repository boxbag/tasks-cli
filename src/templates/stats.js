'use strict';

module.exports = (diffPoints, wordCloud) => {
    return `
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/taucharts/latest/tauCharts.min.css">
                <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">

                <script src="https://d3js.org/d3.v3.min.js" charset="utf-8" type="text/javascript"></script>
                <script src="https://cdn.jsdelivr.net/taucharts/latest/tauCharts.min.js" type="text/javascript"></script>
            </head>

            <body>
                <div id="line" style="height:50%"></div>
                <div id="scatter" style="height: 50%"></div>

                <script>
                    var diffPointsData = ${JSON.stringify(diffPoints)};

                    var lineChart = new tauCharts.Chart({
                        data: diffPointsData,
                        type: 'stacked-bar',
                        x: 'completed_date',
                        y: 'score',
                        color: 'responsibility_name',
                        plugins:  [
    tauCharts.api.plugins.get('tooltip')(),
    tauCharts.api.plugins.get('legend')()
    ]
                    });

                    lineChart.renderTo('#line');

                    var scatterChart = new tauCharts.Chart({
                        data: diffPointsData,
                        type: 'stacked-bar',
                        x: 'completed_date',
                        y: 'actual_duration',
                        color: 'responsibility_name',
                        plugins:  [
    tauCharts.api.plugins.get('tooltip')(),
    tauCharts.api.plugins.get('legend')()
    ]
                    });

                    scatterChart.renderTo('#scatter');
                </script>
            </body>
        </html>
    `
};