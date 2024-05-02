app.controller("category-ctrl", function ($scope, $http) {
    var url = "/rest/categories";
    $scope.items = [];
    $scope.form = {};

/*    var sweetalert = function (text) {
        Swal.fire({
            icon: "success",
            title: text,
            showConfirmButton: false,
            timer: 2000,
        });
    }*/

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

    //them sp moi
    $scope.create = function () {
        var item = angular.copy($scope.form);
        $http.post(`${url}`, item).then(resp => {
            $scope.items.push(resp.data);
            $scope.reset();
            //sweetalert("Thêm mới thành công!");
            Swal.fire("Thành công", "Thêm mới danh mục thành công !", "success");
        }).catch(error => {
			Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin !", "error");
            //sweetalert("Lỗi thêm mới danh mục !");
            console.log("Lỗi", error);
        });
    }

    //cap nhat sp
    $scope.update = function () {
        var item = angular.copy($scope.form);
        $http.put(`${url}/${item.id}`, item).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items[index] = item;
            $scope.reset();
            //sweetalert("Cập nhật danh mục thành công!");
            Swal.fire("Thành công", "Cập nhật danh mục thành công !", "success");
        }).catch(error => {
            //sweetalert("Lỗi cập nhật danh mục!");
            Swal.fire("Lỗi", "Cập nhật danh mục thất bại !", "error");
            console.log("Lỗi", error);
        });
    }

    //xoa sp
    $scope.delete = function (item) {
        $http.delete(`${url}/${item.id}`).then(resp => {
            var index = $scope.items.findIndex(p => p.id == item.id);
            $scope.items.splice(index, 1);
            $scope.reset();
            Swal.fire("Thành công", "Xóa danh mục thành công !", "success");
        }).catch(error => {
            Swal.fire("Lỗi", "Xóa danh mục thất bại !", "error");
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