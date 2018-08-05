'use strict';

module.exports = (diffPoints) => {
    return `
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="css/tauCharts.min.css">
                <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">

                <script src="js/d3.min.js" charset="utf-8" type="text/javascript"></script>
                <script src="js/tauCharts.min.js" type="text/javascript"></script>
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