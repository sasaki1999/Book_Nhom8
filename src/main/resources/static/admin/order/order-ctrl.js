app.controller("order-ctrl", function ($scope, $http) {

	$scope.items = [];
	$scope.status = [];
	$scope.form = {};

	$scope.initialize = function () {
		$http.get("/rest/order").then(resp => {
			$scope.items = resp.data;
			$scope.items.forEach(item => {
				item.date = new Date(item.createDate)
			})
		});
		// $http.get("/rest/status").then(resp => {
		// 	$scope.status = resp.data;
		// });
		$http.get("/rest/order/index").then(resp => {
			$scope.list = resp.data;
			console.log(resp.data);
		});
	}

	$scope.trangthai = function (id) {
		var url = `/rest/order/trangthai/${id}`;
		$http.get(url).then(resp => {
			$scope.items = resp.data;
		});
	}


	$scope.changeStatus = function (orderId, newStatusId) {
		$http.put("/rest/order/" + orderId + "/status?newStatusId=" + newStatusId)
			.then(function (response) {
				$scope.items.push(response.data); // Sửa lại thành response.data
				// Update interface after successful status change
				for (var i = 0; i < $scope.items.length; i++) {
					if ($scope.items[i].id === orderId) {
						$scope.items[i].status.id = newStatusId;
						break;
					}
				}
			}).catch(function (error) {
				$scope.trangthai(newStatusId);
				$scope.initialize();
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Order status updated successfully',
					confirmButtonText: 'OK'
				});
			});
	};



	$scope.showOrderDetail = function (orderId) {
		$http.get("/rest/orderDetails/" + orderId)
			.then(function (response) {
				$("#donhangdanggiao").modal("hide");
				$("#dagiao").modal("hide");
				$("#dahuy").modal("hide");
				$scope.selectedOrderDetails = response.data;
				$('#orderDetailModal').modal('show'); // Hiển thị modal chứa danh sách sản phẩm
			})
			.catch(function (error) {
				console.error("Error fetching order details:", error);
			});
	};
	$scope.closeModal = function () {
		$("#orderDetailModal").modal("hide");
	};



//	$scope.showdonhangdanggiao = function () {
//		$http.get("/rest/order/dhdg")
//			.then(function (response) {
//				$scope.dhdg = response.data;
//				$('#donhangdanggiao').modal('show'); // Hiển thị modal chứa danh sách sản phẩm
//			})
//			.catch(function (error) {
//				console.error("Error fetching order details:", error);
//			});
//	};
//	$scope.closeModal = function () {
//		$("#donhangdanggiao").modal("hide");
//	};
//
//	$scope.showdagiao = function () {
//		$http.get("/rest/order/dg")
//			.then(function (response) {
//				$scope.dg = response.data;
//				$('#dagiao').modal('show'); // Hiển thị modal chứa danh sách sản phẩm
//			})
//			.catch(function (error) {
//				console.error("Error fetching order details:", error);
//			});
//	};

	$scope.closeModal = function () {
		$("#dagiao").modal("hide");
	};


//	$scope.showdahuy = function () {
//		$http.get("/rest/order/huy")
//			.then(function (response) {
//				$scope.huy = response.data;
//				$('#dahuy').modal('show'); // Hiển thị modal chứa danh sách sản phẩm
//			})
//			.catch(function (error) {
//				console.error("Error fetching order details:", error);
//			});
//	};
	
	$scope.closeModal = function () {
		$("#dahuy").modal("hide");
	};

	$scope.getOrdersByMonth = function () {
		var years = document.getElementById("year").value;
		var year = parseInt(years)
		console.log(years)
		console.log(year)
		return new Promise(function (resolve, reject) {
			var order = [];
			$http.get('/rest/order/thongkeorder', {
				params: {
					year: year
				}
			}).then(function (resp) {
				var rep = resp.data;
				for (var i = 0; i < rep.length; i++) {
					order.push(rep[i].totalOrders);
				}
				resolve(order);
			}, function (error) {
				reject(error);
			});
		});
	};

	$scope.chart = function () {
		$scope.getOrdersByMonth().then(function(order) {
			var canvasId = 'totalIncomeChart';
			var totalIncomeChartCanvas = document.getElementById(canvasId);
	
			if (totalIncomeChartCanvas === null) {
				totalIncomeChartCanvas = document.createElement('canvas');
				totalIncomeChartCanvas.id = canvasId;
				document.getElementById('chartContainer').appendChild(totalIncomeChartCanvas);
			}
	
			if (totalIncomeChartCanvas.chart) {
				totalIncomeChartCanvas.chart.destroy();
			}
	
			totalIncomeChartCanvas.chart = new Chart(totalIncomeChartCanvas, {
				type: 'bar',
				data: {
					labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
						"Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
					],
					datasets: [{
						label: "Đơn hàng/Tháng",
						backgroundColor: '#272eff',
						borderColor: 'rgb(23, 125, 255)',
						data: order,
					}],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false,
					},
					plugins: {
						datalabels: {
							anchor: 'end',
							align: 'end',
							display: true,
							font: {
								weight: 'bold'
							},
							color: '#000',
							formatter: function (value, context) {
								return "Biểu đồ cột thể hiện đơn hàng theo tháng trong năm";
							}
						}
					}
				}
			});
		}).catch(function(error) {
			console.error('Error:', error);
		});
	};

	$("#year").change(() => {
		$scope.chart();
	});

	$scope.pager = {
		page: 0,
		size: 5,
		get items() {
			var start = this.page * this.size;
			return $scope.items.slice(start, start + this.size);

		},
		get count() {
			return Math.ceil(1.0 * $scope.items.length / this.size);
		},
		first() {
			this.page = 0;
		},
		prev() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}


	}
	//$scope.getOrdersByMonth(2023);
	$scope.chart();
	$scope.initialize();
});