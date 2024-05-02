app.controller("discount-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.form = {};
	$scope.roles = {};
	$scope.initialize = function() {
		$http.get('/rest/bestseller').then(function(response) {
			$scope.items = response.data;
			$scope.items.forEach(item => {
				$scope.items.forEach(item => {
					item.startdate = new Date(item.startdate);
					item.enddate = new Date(item.enddate);
				})
			})


		});

		$http.get('/rest/products').then(function(response) {
			$scope.product = response.data;

		});
	}


	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
		$scope.index = -1;
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	$scope.reset = function() {
		$scope.form = {
			startdate: new Date(),
			enddate: Date()
		};
		$scope.index = 0;
	}
	
	$scope.reset_smooth_table = function() {
		$scope.form = {};
		window.scrollTo({
			top: 1000,
			behavior: 'smooth'
		});
	}
	//tạo
	$scope.create = function() {
		//var itema = angular.copy($scope.form);
		//var item = $scope.items.find(item => item.book.id == itema.book.id);
		var item = angular.copy($scope.form);
		console.log(item)
		if (item.startdate == null || item.enddate == null || item.discount == null) {
			Swal.fire({
				type: 'error',
				title: 'Vui lòng không bỏ trống dữ liệu',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			return;
		}
		$http.get(`/rest/bestseller`).then(function(response) {
			$scope.discount = response.data;
			console.log($scope.discount);
			for (var i = 0; i < $scope.discount.length; i++) {
				if ($scope.discount[i].book.id === item.book.id) {
					Swal.fire({
						type: 'error',
						title: 'Lỗi !',
						text: 'Sản phẩm đã được giảm giá !',
						icon: "error",
						showConfirmButton: false,
						timer: 3000
					})
					return;
				}
			}

			if (item.startdate > item.enddate) {
				Swal.fire({
					type: 'error',
					title: 'Lỗi !',
					text: "Ngày kết thúc phải lớn hơn ngày bắt đầu !",
					icon: "error",
					showConfirmButton: false,
					timer: 3000
				})
				return;
			} else {
				$http.post(`/rest/bestseller`, item).then(resp => {
					$scope.initialize();
					resp.data.createDate = new Date(resp.data.createDate);
					$scope.items.push(resp.data);
					$scope.reset();
					Swal.fire({
						type: 'success',
						title: 'Thành công !',
						text: "Thêm sản phẩm giảm giá thành công !",
						icon: "success",
						showConfirmButton: false,
						timer: 3000
					})
					$scope.reset_smooth_table();
				}).catch(error => {
					Swal.fire({
						type: 'error',
						title: 'Lỗi thêm mã !',
						text: "Lỗi",
						icon: "error",
						showConfirmButton: false,
						timer: 3000
					})
					console.log("Lỗi", error);
				})
			}
		});
		/////////////////////////	
		/*		if (item != null) {
					Swal.fire({
						type: 'error',
						title: 'Thêm sản phẩm giảm giá không thành công',
						text: 'Lỗi trùng mã sản phẩm',
						icon: "error",
						showConfirmButton: false,
						timer: 3000
					})
				} else {
					$http.post(`/rest/bestseller`, item).then(resp => {
						$scope.items.push(resp.data);
						$scope.initialize();
						$scope.reset();
						Swal.fire({
							type: 'success',
							title: 'Thêm sản phẩm giảm giá thành công',
							text: '',
							icon: "success",
							showConfirmButton: false,
							timer: 3000
						})
						$scope.reset_smooth_table();
					}).catch(error => {
						Swal.fire({
							type: 'error',
							title: 'Lỗi thêm mã',
							text: "Vui lòng nhập đầy đủ thông tin",
							icon: "error",
							showConfirmButton: false,
							timer: 3000
						})
						console.log("Lỗi", error);
					})
				}*/
		//
	}

	// Cập nhật
	$scope.update = function() {
		var item = angular.copy($scope.form);
		if (item.discount == null) {
			Swal.fire({
				type: 'error',
				title: 'Vui lòng không bỏ trống dữ liệu',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			return;
		}
		if (item.startdate > item.enddate) {
			Swal.fire({
				type: 'error',
				title: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			return;
		} else {
			$http.put(`/rest/bestseller/${item.id}`, item).then(function(response) {
				var index = $scope.items.findIndex(p => p.id == item.id);
				$scope.items[index] = item;
				Swal.fire({
					type: 'success',
					title: 'Cập nhật sản phẩm giảm giá thành công',
					text: 'Thông sản phẩm giảm giá đã được cập nhật',
					icon: "success",
					showConfirmButton: false,
					timer: 3000
				})
				$scope.reset_smooth_table();
			}).catch(function(error) {
				Swal.fire({
					type: 'error',
					title: 'Lỗi cập nhật sản phẩm giảm giá',
					text: "Vui lòng chọn sản phẩm giảm giá !",
					icon: "error",
					showConfirmButton: false,
					timer: 3000
				})
				console.log("Erorr", err);
			})
		}
	}


	// Xóa
	$scope.delete = function(item) {
		Swal.fire({
			/*title: 'Xóa sản phẩm giảm giá!',
			text: 'Bạn chắc chắn muốn xóa sản phẩm giảm giá này chứ ?',
			type: 'warning',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Vâng, Tôi đồng ý!'*/

			title: 'Xóa giảm giá sản phẩm!',
			text: "Bạn chắc chắn muốn xóa giảm giá sản phẩm này chứ?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Hủy',
			confirmButtonText: 'Vâng, Tôi đồng ý!'
		}).then(function(result) {
			if (result.isConfirmed) {
				$http.delete(`/rest/bestseller/${item.id}`).then(function(response) {
					var index = $scope.items.findIndex(p => p.id == item.id);
					$scope.items.splice(index, 1);
					$scope.reset();
					Swal.fire(
						'Xóa!',
						'Đã xóa thành công',
						'success'
					);
				}).catch(function(err) {
					Swal.fire({
						type: 'error',
						title: 'Lỗi xóa ',
						text: 'Sản phẩm giảm giá đang ở trạng thái hoạt động !',
						icon: 'error',
						showConfirmButton: false,
						timer: 3000
					});
					console.log('Error', err);
				});
			}
		});
	};
	

	//sap xep
	/*$scope.initialize = function () {
		// Load authors and sort them by ID in ascending order
		$http.get(url).then(resp => {
			$scope.items = resp.data.sort((a, b) => a.id - b.id);
		});
	}*/
	//phan trang
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

	$scope.initialize();
})