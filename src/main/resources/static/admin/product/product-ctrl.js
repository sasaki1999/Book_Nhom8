app.controller("product-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.cates = [];
	$scope.form = {};
	$scope.image = {};
	$scope.proofreads = {};


	$scope.initialize = function() {
		//load product
		$http.get("/rest/products").then(resp => {
			$scope.items = resp.data;
			$scope.items.forEach(item => {
				item.createDate = new Date(item.createDate)
			})
		});

		//load categories
		$http.get("/rest/categories").then(resp => {
			$scope.cates = resp.data;
		});

		//load auth
		$http.get("/rest/authors").then(resp => {
			$scope.auth = resp.data;
		});

	}

	//Khởi đầu
	$scope.initialize();

	//Xóa form
	$scope.reset = function() {
		$scope.form = {}
		$scope.image = {}
	}

	//Hiển thị lên form
	$scope.edit = function(item) {
		$scope.isDisabled = true;
		$scope.imgaedefault = false;
		$scope.form = angular.copy(item)
		$(".nav-tabs a:eq(0)").tab('show')
	}

	//Thêm sản phẩm mới
	$scope.create = function() {
		var item = angular.copy($scope.form);
		console.log(item);
		$http.post(`/rest/products`, item).then(resp => {
			resp.data.createDate = new Date(resp.data.createDate)
			$scope.items.push(resp.data);
			$scope.initialize();
			$scope.reset();
			Swal.fire("Thành công", "Thêm sản phẩm mới thành công !", "success");
		}).catch(error => {
			Swal.fire("Lỗi", "Thêm sản phẩm mới thất bại !", "error");
			console.log("Lỗi", error);
		})
	}

	//Cập nhật sản phẩm
	$scope.update = function() {
		var item = angular.copy($scope.form);
		$http.put(`/rest/products/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			$scope.initialize();
			Swal.fire("Thành công", "Cập nhật sản phẩm thành công !", "success");
		}).catch(error => {
			Swal.fire("Lỗi", "Cập nhật sản phẩm thất bại !", "error");
			console.log("Lỗi", error);
		})
	}

	//Xóa sản phẩm
	$scope.delete = function(item) {
		$http.delete(`/rest/products/${item.id}`).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items.splice(index, 1);
			$scope.reset();
			Swal.fire("Thành công", "Xóa sản phẩm thành công !", "success");
		}).catch(error => {
			Swal.fire("Lỗi", "Xóa sản phẩm thất bại !", "error");
			console.log("Lỗi", error);
		})
	}


/*	$scope.imageChanged = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/book', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.image = resp.data.name;
			if (files && files.length > 0) {
				$scope.form.imageName = files[0].name;
			} else {
				$scope.form.imageName = null;
			}
		}).catch(error => {
			Swal.fire("Lỗi", "Lỗi upload hình ảnh !", "error");
			console.log("Lỗi", error);
		})
	}*/
	
	$scope.imgaedefault = true;
	$scope.imageChanged = function(files) {
		$scope.imgaedefault = false;
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/book', data, {
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined
			}
		}).then(resp => {
			$scope.form.image = resp.data.name;
			/*Swal.fire({
				type: 'success',
				title: 'Thêm ảnh thành công',
				text: '',
				icon: "success",
				showConfirmButton: false,
				timer: 2000
			})*/
		}).catch(error => {
			Swal.fire({
				type: 'error',
				title: 'Lỗi thêm ảnh',
				text: "Lỗi",
				icon: "error",
				showConfirmButton: false,
				timer: 2000
			})
			console.log("Lỗi", error);
		})
	}
	

	//addnhieuanhsanpham
	$scope.editanh = function(item) {
		$http.get(`/rest/images/${item}`).then(resp => {
			$scope.itemsimages = resp.data;
			console.log(resp.data)

			$(".nav-tabs a:eq(2)").tab('show')

		});

	}

	$scope.editanhphu = function(item) {
		$scope.image = angular.copy(item)
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	$scope.createimage = function() {
		var image = angular.copy($scope.image);
		console.log(image);
		$http.post(`/rest/images`, image).then(resp => {
			$scope.reset();
			$scope.editanh(image.book.id)
			Swal.fire("Thành công", "Thêm ảnh hình thành công !", "success");
		}).catch(error => {
			Swal.fire("Lỗi", "Thêm ảnh hình thất bại !", "error");
			console.log("Lỗi", error);
		})
	}

	$scope.updateimage = function() {
		var item = angular.copy($scope.image);
		$http.put(`/rest/images/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			$scope.editanh(item.book.id)
			Swal.fire("Thành công", "Cập nhật hình thành công !", "success");
		}).catch(error => {
			Swal.fire("Lỗi", "Cập nhật hình thất bại !", "error");
			console.log("Lỗi", error);
		})
	}


	//Xóa hình
	$scope.deleteimage = function(item) {
		$http.delete(`/rest/images/${item.id}`).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items.splice(index, 1);
			$scope.editanh(item.book.id)
			$scope.reset();
			Swal.fire("Thành công", "Xóa hình thành công !", "success");
			//alert("Xóa hình thành công")
		}).catch(error => {
			//alert("Lỗi xóa sản phẩm");
			Swal.fire("Lỗi", "Xóa hình thất bại !", "error");
			console.log("Lỗi", error);
		})
	}

	var url = `/rest/products/changepanels`;
		$http.get(url).then(resp => {
			$scope.changePanels = resp.data;
			$scope.nav = $scope.changePanels[0]||null;
			$scope.qc1 = $scope.changePanels[1]||null;
			$scope.qc2 = $scope.changePanels[2]||null;
			$scope.bn1 = $scope.changePanels[3]||null;
			$scope.bn2 = $scope.changePanels[4]||null;
			console.log($scope.changePanels);
		});
	
	//Upload hình ảnh
	$scope.imageChangedadd = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/bookdec', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.image.link = resp.data.name;
		}).catch(error => {
			Swal.fire("Lỗi", "Lỗi tải hình lên thất bại !", "error");
			//alert("Lỗi upload hình ảnh");
			console.log("Lỗi", error);
		})
	}
	
	//ảnh đọc thử

	$scope.editproofreads = function(item) {
		$http.get(`/rest/proofread/${item}`).then(resp => {
			$scope.itemsproofreads = resp.data;
			console.log(resp.data)

			$(".nav-tabs a:eq(3)").tab('show')

		});

	}



	$scope.editfreads = function(item) {
		$scope.proofreads = angular.copy(item)
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	$scope.imageChangedproofreads = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/upload/proofread', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.proofreads.images = resp.data.name;
		}).catch(error => {
			Swal.fire("Lỗi", "Lỗi tải hình lên thất bại !", "error");
			//alert("Lỗi upload hình ảnh");
			console.log("Lỗi", error);
		})
	}

	$scope.createproofreads = function() {
		var proofreads = angular.copy($scope.proofreads);
		$http.post(`/rest/proofread`, proofreads).then(resp => {
			$scope.reset();
			$scope.editproofreads(proofreads.book.id)
			Swal.fire("Thành công", "Thêm hình đọc thử thành công !", "success");
		}).catch(error => {
			Swal.fire("Lỗi", "Thêm hình đọc thử thất bại !", "error");
			console.log("Lỗi", error);
		})
	}

	$scope.deleteproofreads = function(item) {
		$http.delete(`/rest/proofread/${item.id}`).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items.splice(index, 1);
			$scope.editproofreads(item.book.id);
			$scope.reset();
			Swal.fire("Thành công", "Xóa hình đọc thử thành công !", "success");
			//alert("Xóa sản phẩm thành công")
		}).catch(error => {
			Swal.fire("Lỗi", "Xóa hình đọc thử thất bại !", "error");
			//alert("Lỗi xóa sản phẩm");
			console.log("Lỗi", error);
		})
	}

	$scope.updateproofreads = function() {
		var item = angular.copy($scope.proofreads);
		$http.put(`/rest/proofread/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			$scope.editproofreads(item.book.id);
			Swal.fire("Thành công", "Cập nhật hình đọc thử thành công !", "success");
		}).catch(error => {
			Swal.fire("Lỗi", "Cập nhật hình đọc thử thất bại !", "error");
			console.log("Lỗi", error);
		})
	}

	//sap xep 
	$scope.initialize = function () {
        // Load authors and sort them by ID in ascending order
        $http.get(url).then(resp => {
            $scope.items = resp.data.sort((a, b) => a.id - b.id);
        });
    }
    
	//phân trang
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
});