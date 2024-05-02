app.controller("author-ctrl", function ($scope, $http) {
    var url = "/rest/authors";
    $scope.items = [];
    $scope.form = {};

/*    var sweetalert = function (text) {
        Swal.fire({
            icon: "success",
            title: text,
            showConfirmButton: false,
            timer: 2000,
        });
    }
*/
    $scope.initialize = function () {
        //load account
        $http.get(url).then(resp => {
            $scope.items = resp.data;
        });
    }

    //khoi dau
    $scope.initialize();

    //xoa form
    $scope.reset = function () {
        $scope.form = {};
    }

    //hien thi len form
    $scope.edit = function (item) {
        $scope.form = angular.copy(item);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    //them tac gia
    $scope.create = function () {
        var item = angular.copy($scope.form);
        if (item.name == null) {
			Swal.fire({
				type: 'error',
				title: 'Vui lòng nhập tên tác giả !',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			return;
		}
        $http.post(`${url}`, item).then(resp => {
            $scope.items.push(resp.data);
            $scope.reset();
            Swal.fire("Thành công", "Thêm mới tác giả thành công !", "success");
        }).catch(error => {
            Swal.fire("Lỗi", "Thêm tác giả thất bại !", "error");
			console.log("Lỗi", error);
        });
    }

    //cap nhat tac gia
    $scope.update = function () {
        var item = angular.copy($scope.form);
        if (item.name == null) {
			Swal.fire({
				type: 'error',
				title: 'Vui lòng nhập tên tác giả !',
				icon: "error",
				showConfirmButton: false,
				timer: 3000
			})
			return;
		}
        $http.put(`${url}/${item.id}`, item).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items[index] = item;
            $scope.reset();
            Swal.fire("Thành công", "Cập nhật tác giả thành công !", "success");
        }).catch(error => {
			Swal.fire("Lỗi", "Cập nhật tác giả thất bại !", "error");
            console.log("Lỗi", error);
        });
    }

    //xoa tac gia
    $scope.delete = function (item) {
        $http.delete(`${url}/${item.id}`).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items.splice(index, 1);
            $scope.reset();
            Swal.fire("Thành công", "Xóa tác giả thành công !", "success");
        }).catch(error => {
			Swal.fire("Lỗi", "Xóa tác giả thất bại !", "error");
            console.log("Lỗi", error);
        });
    }
    
    //sap xep
    $scope.initialize = function () {
        // Load authors and sort them by ID in ascending order
        $http.get(url).then(resp => {
            $scope.items = resp.data.sort((a, b) => a.id - b.id);
        });
    }

    //phan trang
        $scope.pager = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.items.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.items.length / this.size)
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