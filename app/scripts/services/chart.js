'use strict';
angular.module('dashboardApp').service('Chart', [function () {

    function plotLineChart($scope, id, data) {
        $scope.points = data;
        var padding = 30;

        var x = d3.scale.linear().rangeRound([(padding * 2) + 5, $scope.lineGraph.width]);
        var y = d3.scale.linear().rangeRound([$scope.lineGraph.height, 0]);

        x.domain(d3.extent(data, function (d) {
            return d.x + 1
        }));

        y.domain(d3.extent(data, function (d) {
            return d.y + 1
        }));

        $scope.line = d3.svg.line()
            .x(function (d) {
                return x(d.x);
            })
            .y(function (d) {
                return y(d.y);
            });

        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(15)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5);

        var xAxisGroup = d3.select("#svg_line")
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(-35," + ($scope.lineGraph.height) + ")")
            .call(xAxis);


        var yAxisGroup = d3.select("#svg_line")
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis)
    }


    //============================================================
    function plotPieChart(data, id) {
        var pieWidth = 320,
            pieHeight = 240,
            pieRadius = 100,
            pieColor = d3.scale.category20c();

        var pieChart = d3.select(id)
            .append("svg:svg")
            .data([data])
            .attr("width", pieWidth)
            .attr("height", pieHeight)
            .append("svg:g")
            .attr("transform", "translate(" + pieRadius + "," + pieRadius + ")")

        var arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(pieRadius);

        var pie = d3.layout.pie()
            .value(function (d) {
                return d.value;
            });

        var arcs = pieChart.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice");


        arcs.append("svg:path")
            .attr("fill", function (d, i) {
                return pieColor(i);
            })
            .attr("d", arc);

        arcs.append("svg:text")
            .attr("transform", function (d) {
                d.innerRadius = 0;
                d.outerRadius = pieRadius;
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .attr("class", "graph-label")
            .text(function (d, i) {
                return data[i].label;
            });

    }

    //============================================================
    var api = {
        plotPieChart: plotPieChart,
        plotLineChart: plotLineChart
    }
    return api;

}]);