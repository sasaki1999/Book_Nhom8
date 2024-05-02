app.controller("revenue-ctrl", function($scope, $http) {
	
	$scope.chartline = function() {
    var years = document.getElementById("year").value;
    var year = parseInt(years);
    console.log(year);

    var canvasId = 'lineChart';
    var lineChart = document.getElementById(canvasId);

    if (lineChart === null) {
        lineChart = document.createElement('canvas');
        lineChart.id = canvasId;
        document.getElementById('chartContainer').appendChild(lineChart);
    } else {
        // Biểu đồ đã tồn tại, hủy nó đi trước khi tạo mới
        var parent = lineChart.parentNode;
        parent.removeChild(lineChart);
        lineChart = document.createElement('canvas');
        lineChart.id = canvasId;
        parent.appendChild(lineChart);
    }

    var myLineChart = new Chart(lineChart, {
        type: 'line',
        data: {
            labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
            datasets: [{
                label: "Doanh thu: ",
                borderColor: "#1d7af3",
                pointBorderColor: "#FFF",
                pointBackgroundColor: "#1d7af3",
                pointBorderWidth: 2,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 1,
                pointRadius: 4,
                backgroundColor: 'transparent',
                fill: true,
                borderWidth: 2,
                data: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom',
                labels: {
                    padding: 10,
                    fontColor: '#1d7af3',
                }
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
                        var value = formatCurrency(tooltipItem.yLabel);
                        return label + ': ' + value;
                    }
                },
                bodySpacing: 4,
                mode: "nearest",
                intersect: 0,
                position: "nearest",
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10
            },
            layout: {
                padding: {
                    left: 15,
                    right: 15,
                    top: 15,
                    bottom: 15
                }
            }
        }
    });

    $scope.getMonthRevenue = function(year) {
        $http.get("/rest/order/getMonthRevenue", { params: { year: year } }).then(resp => {
            $scope.revenuestatistics = resp.data;
            $scope.calendar = "tháng"
            var totalRevenueData = $scope.revenuestatistics.map(item => item.totalRevenue);
            var calendar = $scope.revenuestatistics.map(item => item.calendar);
            myLineChart.data.datasets[0].data = totalRevenueData;
            myLineChart.data.labels = calendar;
            myLineChart.update();
        });
    }

    $scope.getMonthRevenue(year);
}
	$scope.chartline();
	
	$("#year").change(() => {
		$scope.chartline();
	});
	
	$scope.initialize = function () {
//		$http.get("/rest/products/demslsp").then(resp => {
//			$scope.slsp = resp.data;
//		});
//		$http.get("/rest/products/demslkh").then(resp => {
//			$scope.slkh = resp.data;
//		});
//		$http.get("/rest/products/demsldh").then(resp => {
//			$scope.sldh = resp.data;
//		});
//		$http.get("/rest/products/demslcd").then(resp => {
//			$scope.slcd = resp.data;
//		});
//		$http.get("/rest/products/ddhanghna").then(resp => {
//			$scope.ddhanghna = resp.data;
//		});
		$http.get("/rest/products/tongtienhomnay").then(resp => {
			$scope.tongtienhomnay = resp.data;
		});
		$http.get("/rest/products/tongthunhap").then(resp => {
			$scope.tongthunhap = resp.data;
		});
	}
	$scope.initialize();
	
});