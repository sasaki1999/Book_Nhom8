app.controller("account-ctrl", function($scope, $http) {

	$scope.items = [];
	$scope.form = {};
	$scope.roles = {};

	$scope.initialize = function() {
		$http.get('/rest/accounts').then(function(response) {
			$scope.items = response.data;
		});
	}

	$scope.edit = function(item) {
		$scope.isDisabled = true;
		$scope.imgaedefault = false;
		$scope.form = angular.copy(item);
		$scope.index = -1;
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	$scope.reset = function() {
		$scope.form = {};
		$scope.index = 0;
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
	$scope.imgaedefault = true;
	$scope.imageChanged = function(files) {
		$scope.imgaedefault = false;
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/user', data, {
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined
			}
		}).then(resp => {
			$scope.form.photo = resp.data.name;
			console.log($scope.form.photo)
			/*Swal.fire({
				type: 'success',
				title: 'Thêm ảnh thành công',
				text: 'Thành công',
				icon: "success",
				showConfirmButton: false,
				timer: 3000
			})*/
		}).catch(error => {
			Swal.fire({
				type: 'error',
				title: 'Lỗi thêm ảnh',
				text: "Lỗi",
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			console.log("Error", error);
		})
	}

	$scope.reset_smooth_table = function() {
		$scope.form = {};
		window.scrollTo({
			top: 1000,
			behavior: 'smooth'
		});
	}

	//Tìm kiếm người dùng
	$scope.searchKeyword = '';
	$scope.submitFormAccount = function() {
		$http.get('/rest/accounts/search/', {
			params: {
				name: $scope.searchKeyword
			}
		}).then(function(response) {
			$scope.items = response.data;
			$scope.pager.first();
		}).catch(error => {
			console.log("Error", error);
		});
	}

	//tạo 
	$scope.create = function() {
		var item = angular.copy($scope.form);
		var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (item.username == null) {
			Swal.fire({
				type: 'error',
				title: 'Vui lòng nhập tên đăng nhập !',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			return;
		}
		if (item.fullname == null) {
			Swal.fire({
				type: 'error',
				title: 'Vui lòng nhập họ và tên !',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			return;
		}

		if (item.password == null) {
			Swal.fire({
				type: 'error',
				title: 'Vui lòng nhập mật khẩu !',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			return;
		}
		
		if (filter.test(item.email) == false) {
			Swal.fire({
				type: 'error',
				title: 'Email chưa đúng định dạng !',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			console.log("Error", error);
			return;
		}
		if (item.address == null) {
			Swal.fire({
				type: 'error',
				title: 'Vui lòng nhập địa chỉ !',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			return;
		}
		if (vnf_regex.test(item.phone) == false) {
			Swal.fire({
				type: 'error',
				title: 'Số điện thoại chưa đúng định dạng !',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			console.log("Error", error);
			return;
		}
		for (var i = 0; i < $scope.items.length; i++) {
			if (item.email === $scope.items[i].email) {
				Swal.fire({
					type: 'error',
					title: 'Email đã được sử dụng!',
					icon: "error",
					showConfirmButton: false,
					timer: 3000
				})
				console.log("Error", error);
				return;
			}
			if (item.phone === $scope.items[i].phone) {
				Swal.fire({
					type: 'error',
					title: 'Số điện thoại đã được sử dụng!',
					icon: "error",
					showConfirmButton: false,
					timer: 3000
				})
				return;
			}
		}
		
		var item = angular.copy($scope.form);
		$http.post(`/rest/accounts`, item).then(resp => {
			$scope.initialize();
			Swal.fire({
				type: 'success',
				title: 'Thêm người dung thành công',
				text: 'Người dùng được sắp xếp theo tên !',
				icon: "success",
				showConfirmButton: false,
				timer: 2000
			  })
			$scope.reset_smooth_table();
		}).catch(error => {			
			Swal.fire({
				type: 'error',
				title: 'Lỗi thêm người dùng',
				text: "Vui lòng nhập đầy đủ thông tin",
				icon: "error",
				showConfirmButton: false,
				timer: 2000
			  })
			console.log("Error", error);
		})
		//} else {
		//			Swal.fire({
		//				type: 'error',
		//				title: 'Không được để trống mật khẩu !',
		//				icon: "error",
		//				showConfirmButton: false,
		//				timer: 2000
		//			})
		//		}

	}

	// Cập nhật
	$scope.update = function() {
		var item = angular.copy($scope.form);

		var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (filter.test(item.email) == false) {
			Swal.fire({
				type: 'error',
				title: 'Email chưa đúng định dạng !',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			console.log("Error", error);
			return;
		}
		if (vnf_regex.test(item.phone) == false) {
			Swal.fire({
				type: 'error',
				title: 'Số điện thoại chưa đúng định dạng !',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			console.log("Error", error);
			return;
		}
		for (var i = 0; i < $scope.items.length; i++) {
			if (item.email === $scope.items[i].email && item.username !== $scope.items[i].username) {
				Swal.fire({
					type: 'error',
					title: 'Email đã được sử dụng!',
					icon: "error",
					showConfirmButton: false,
					timer: 3000
				})
				console.log("Error", error);
				return;
			}
			if (item.phone === $scope.items[i].phone && item.username !== $scope.items[i].username) {
				Swal.fire({
					type: 'error',
					title: 'Số điện thoại đã được sử dụng!',
					icon: "error",
					showConfirmButton: false,
					timer: 3000
				})
				return;
			}
		}

		$http.put(`/rest/accounts/${item.username}`, item).then(function(response) {
			var index = $scope.items.findIndex(p => p.username == item.username);
			$scope.items[index] = item;
			$scope.initialize();
			Swal.fire({
				type: 'success',
				title: 'Cập nhật người dùng thành công !',
				text: 'Thông tin người dùng đã được cập nhật !',
				icon: "success",
				showConfirmButton: false,
				timer: 3000
			})
			$scope.reset_smooth_table();
		}).catch(function(error) {
			Swal.fire({
				type: 'error',
				title: 'Lỗi cập nhật thông tin người dùng',
				text: "Vui lòng chọn người dùng để cập nhật !",
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			console.log("Erorr", err);
		})
	}

	// Xóa
	$scope.delete = function(item) {
		// Show a confirmation dialog
		Swal.fire({
			title: 'Xóa người dùng!',
			text: "Bạn chắc chắn muốn xóa người dùng này chứ ?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Hủy',
			confirmButtonText: 'Vâng, Tôi đồng ý !'
		}).then(function(result) {
			if (result.isConfirmed) {
				// If user confirms deletion, send delete request
				$http.delete(`/rest/accounts/${item.username}`).then(function(response) {
					// Remove the item from the items array
					var index = $scope.items.findIndex(p => p.username == item.username);
					$scope.items.splice(index, 1);
					$scope.reset();
					$scope.initialize();
					// Show success message
					Swal.fire(
						'Xóa!',
						'Đã xóa thành công',
						'success'
					);
				}).catch(function(err) {
					// Show error message if deletion fails
					Swal.fire({
						type: 'error',
						title: 'Lỗi xóa người dùng',
						text: 'Người dùng đang ở trạng thái hoạt động!',
						icon: "error",
						showConfirmButton: false,
						timer: 3000
					});
					console.log("Error", err);
				});
			}
		});
	};


	//phan tran
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