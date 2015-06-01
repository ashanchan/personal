'use strict';
var app = angular.module('dashboardApp');
app.controller('MainCtrl', ['$scope', 'Chart', function ($scope, Chart)
    {
        var dataObj = null;
        $scope.segment = [];
        $scope.device = [];
        $scope.activity = [];
        $scope.activeButton = [{
                label: 'Today',
                value: "0"
            },
            {
                label: '3 Days',
                value: "3"
            },
            {
                label: '7 Days',
                value: "7"
            },
            {
                label: '14 Days',
                value: "14"
            }];
        $scope.lineGraph = {
            'width': 550,
            'height': 200
        }
        $scope.pieGraph = {
            'width': 320,
            'height': 240
        }

        //============================================================
        function init() {
            d3.csv('./modal/graph-data.csv', function (error, data) {
                dataObj = data;
                processData()
            })
        }

        //============================================================
        function processData() {
            //=== summing up activity date-wise
            var data = d3.nest()
                .key(function (d) {
                    return d.Date;
                })
                .rollup(function (d) {
                    return d3.sum(d, function (g) {
                        return g.Activity;
                    });
                }).entries(dataObj);

            //=== sorting data on date ascending
            data.sort(function (a, b) {
                return new Date(a.key) - new Date(b.key);
            });

            data.forEach(function (d, i) {
                $scope.activity.push({
                    x: i,
                    y: d.values,
                    z: new Date(d.key)
                })
            });

            //=== summing up for pie chart
            var totalMale = 0,
                totalFemale = 0,
                totalTablet = 0,
                totalMobile = 0,
                totalDesktop = 0;

            var sum = d3.sum(dataObj, function (d) {
                if (d.Gender === 'male') {
                    totalMale++;
                } else if (d.Gender === 'female') {
                    totalFemale++
                }

                if (d.Device === 'tablet') {
                    totalTablet++;
                } else if (d.Device === 'mobile') {
                    totalMobile++
                } else if (d.Device === 'desktop') {
                    totalDesktop++
                }

            });

            //=== creating data for pie chart
            $scope.totalSegment = totalMale + totalFemale;
            $scope.totalDevice = totalTablet + totalMobile + totalDesktop;

            $scope.segment.push({
                label: "Males",
                value: totalMale
            })
            $scope.segment.push({
                label: "Females",
                value: totalFemale
            })

            $scope.device.push({
                label: "Mobile",
                value: totalMobile
            })
            $scope.device.push({
                label: "Tablet",
                value: totalTablet
            })
            $scope.device.push({
                label: "Desktop",
                value: totalDesktop
            })

            Chart.plotPieChart($scope.segment, '#svg_segment');
            Chart.plotPieChart($scope.device, '#svg_device');
            Chart.plotLineChart($scope, '#svg_line', $scope.activity);
            //testcase run start
            $scope.showMaxSum("-1, -2, -3, 4, 6, 7", 17);
            $scope.showMaxSum("-2, 1, -3, 4, -1, 2, 1, -5, 4", 6);
            $scope.showMaxSum("4, -1, 2, -2, -1, -3", 5)
            $scope.showMaxSum("5, 7, -13, 10, 5", 15)
            $scope.showMaxSum("0", 0)
            $scope.showMaxSum("9999999", 9999999)
            $scope.showMaxSum("-40, 1, 40, -50, 1, 50, -20, 1, 20, 0, 0", 52)
            $scope.showMaxSum("2, -2, 5, -5, 6, -6", 6)
                //testcase end
            $scope.maxSumAnswer = '';
        }

        //============================================================
        $scope.showTrend = function (id) {
            alert('Not implemented ' + id);
        }

        //============================================================
        $scope.showMaxSum = function (testString, ans) {
            var testArray = testString.trim().split(",");
            console.log(testArray)
            var max_so_far = 0,
                max_ending_here = 0;

            for (var i = 0; i < testArray.length; i++) {
                max_ending_here = Math.max(0, max_ending_here + Number(testArray[i]))
                max_so_far = Math.max(max_so_far, max_ending_here)
            }
            $scope.maxSumAnswer = max_so_far;
            console.log(max_so_far + " :: " + ans);
        }

        //============================================================

        init();
    }
])