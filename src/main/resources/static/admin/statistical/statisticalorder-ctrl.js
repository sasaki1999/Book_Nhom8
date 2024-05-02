app.controller("statisticalorder-ctrl", function ($scope, $http) {

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

	$scope.modalbill = function (item) {
		$http.get(`/rest/order/bill/${item.id}`).then(resp => {
			$scope.order = resp.data;
			console.log(resp.data)
			$http.get(`/rest/order/bill-details/${item.id}`).then(resp => {
				$scope.orderdetails = resp.data;console.log(resp.data)
				$('#orderDetailModal').modal('show');
			}).catch(error => {
				console.log(error)
			})
		}).catch(error => {
			console.log(error)
		})
	}

	$scope.trangthai = function (value) {
		var url = `/rest/order/trangthai/${value}`;
		$http.get(url).then(resp => {
			$scope.items = resp.data;
		});
	}


	$scope.UpBill = function (item) {
		var payment = 2;
		if(item.status === true) {
			payment = 1;
		}
		$scope.bill = item;
		var headers = {
			"ShopId": "190382",
			"Token": "0f9ab5f8-89c2-11ee-b1d4-92b443b7a897"
		};
		var config = {
			headers: headers
		};
		var items = [];
		$http.get(`/rest/order/bill/${item.id}`).then(resp => {
			$scope.details = resp.data;
			for (var i = 0; i < $scope.details.length; i++) {
				var item = {
					"name": $scope.details[i].book.name,
					"quantity": $scope.details[i].quantity,
					"price": $scope.details[i].price,
					"length": 3,
					"width": 8,
					"weight": 100,
					"height": 12,
					"category": {
						"level1": "Sách"
					}
				}
				items.push(item);
			}
			console.log(items)
			var data = {
				"payment_type_id": payment,
				"note": $scope.bill.note,
				"required_note": "KHONGCHOXEMHANG",
				"from_ward_code": "550108",
				"return_phone": "0969434926",
				"return_address": "Ninh Kiều - Cần Thơ",
				"return_district_id": 1442,
				"return_ward_code": "20109",
				"to_name": $scope.bill.account.fullname,
				"to_phone": $scope.bill.phone,
				"to_address": $scope.bill.address,
				"to_ward_code": $scope.bill.ward,
				"to_district_id": $scope.bill.district,
				"cod_amount": parseInt($scope.bill.billtotal),
				"weight": 200,
				"length": 3,
				"width": 18,
				"height": 19,
				"cod_failed_amount": 2000,
				"pick_station_id": 1442,
				"insurance_value": parseInt($scope.bill.billtotal),
				"service_id": 0,
				"service_type_id": 2,
				"coupon": null,
				"items": items
			}
			var url = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create";
			$http.post(url, data, config).then(resp => {
				console.log(resp.data.data)
				var ordercode = resp.data.data.order_code;
				$http.get(`/rest/order/${$scope.bill.id}/${ordercode}`).then(resp => {
					console.log(resp.data);
				})
			}).catch(error => {
				console.log(error)
			})
		})
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

	$scope.cancel = function (item) {
		$http.get(`/rest/order/cancel/${item.id}`).then(resp => {
			console.log(resp.data);
			$scope.initialize();
		}).catch(error => {
			console.log(error);
		})
	}

	// $scope.showdonhangdanggiao = function () {
	// 	$http.get("/rest/order/dhdg")
	// 		.then(function (response) {
	// 			$scope.dhdg = response.data;
	// 			$('#donhangdanggiao').modal('show'); // Hiển thị modal chứa danh sách sản phẩm
	// 		})
	// 		.catch(function (error) {
	// 			console.error("Error fetching order details:", error);
	// 		});
	// };
	// $scope.closeModal = function () {
	// 	$("#donhangdanggiao").modal("hide");
	// };

	// $scope.showdagiao = function () {
	// 	$http.get("/rest/order/dg")
	// 		.then(function (response) {
	// 			$scope.dg = response.data;
	// 			$('#dagiao').modal('show'); // Hiển thị modal chứa danh sách sản phẩm
	// 		})
	// 		.catch(function (error) {
	// 			console.error("Error fetching order details:", error);
	// 		});
	// };
	// $scope.closeModal = function () {
	// 	$("#dagiao").modal("hide");
	// };
	// $scope.showdahuy = function () {
	// 	$http.get("/rest/order/huy")
	// 		.then(function (response) {
	// 			$scope.huy = response.data;
	// 			$('#dahuy').modal('show'); // Hiển thị modal chứa danh sách sản phẩm
	// 		})
	// 		.catch(function (error) {
	// 			console.error("Error fetching order details:", error);
	// 		});
	// };
	$scope.closeModal = function () {
		$("#dahuy").modal("hide");
	};

	$scope.pager = {
		page: 0,
		size: 10,
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
	$scope.initialize();
});