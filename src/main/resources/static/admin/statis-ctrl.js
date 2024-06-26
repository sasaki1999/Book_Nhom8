app.controller("statis-ctrl", function ($scope, $http) {

	$scope.initialize = function () {
		$http.get("/rest/products/demslsp").then(resp => {
			$scope.slsp = resp.data;
		});
		$http.get("/rest/products/demslkh").then(resp => {
			$scope.slkh = resp.data;
		});
		$http.get("/rest/products/demsldh").then(resp => {
			$scope.sldh = resp.data;
		});
		$http.get("/rest/products/demslcd").then(resp => {
			$scope.slcd = resp.data;
		});
		$http.get("/rest/products/ddhanghna").then(resp => {
			 // Lấy dữ liệu trả về từ phản hồi
			 // Sử dụng dữ liệu
			

			var filteredData = resp.data.filter(item => item.orderstatus != 'Đã giao hàng' && item.orderstatus != 'Đã hủy đơn');
			  for (var i = 0; i < filteredData.length; i++) {
				var item = resp.data[i];	
				console.log("Trạng thái đơn hàng:", item.orderstatus);
			}
			$scope.ddhanghna = filteredData;
		});
		$http.get("/rest/products/tongtienhomnay").then(resp => {
			$scope.tongtienhomnay = resp.data;
		});
		$http.get("/rest/products/tongthunhap").then(resp => {
			$scope.tongthunhap = resp.data;
		});

	}

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


	$scope.initialize();
});