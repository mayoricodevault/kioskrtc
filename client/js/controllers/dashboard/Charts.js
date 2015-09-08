'use strict';
xively.controller('Charts', function ($scope) {
  $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  $scope.series = ['Series A', 'Series B'];

  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
});

window.onload = function () {
        CanvasJS.addColorSet("greenShades",
                [//colorSet Array

                "#2F4F4F",
                "#008080",
                "#2E8B57",
                "#3CB371",
                "#90EE90"                
                ]);

        var chart = new CanvasJS.Chart("chartContainer",
        {
            colorSet: "greenShades",

            title:{
                text: "Custom Color Set"
            },
            data: [
            {        
                type: "column",
                dataPoints: [

                { x: 10, y: 71 },
                { x: 20, y: 55},
                { x: 30, y: 50 },
                { x: 40, y: 65 },
                { x: 50, y: 95 },
                { x: 60, y: 68 },
                { x: 70, y: 28 },
                { x: 80, y: 34 },
                { x: 90, y: 14}

                ]
            }
            ]
        });

        chart.render();
    }