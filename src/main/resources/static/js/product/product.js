let host = "http://localhost:8080/rest";
const app = angular.module("app", []);
app.controller("ctrl", function($scope, $http, $interval) {
	$scope.cartdetails = []
	$scope.billGHN = [];
	$scope.products = []
	$scope.products2 = []
	$scope.username = []
	$scope.cartid = 0
	$scope.selected = []
	$scope.total = 0
	$scope.favorites = [];
	$scope.myOrder = [];
	$scope.status = [];
	$scope.form = {};
	$scope.ttcs = 0;
	$scope.storage = [];
	$scope.book = [];
	$scope.discounts = [];
	$scope.myvoucher = [];
	$scope.giamgia = 0;
	$scope.lead_time = "";
	localStorage.setItem("ttcs", 0);
	localStorage.setItem("ship", 0);
	localStorage.setItem("discount", 0);
	localStorage.setItem("vcid", "");
	$scope.username = $("#username").text();

	$scope.getUser = function() {
		$http.get(`/rest/accounts/${$scope.username}`).then(resp => {
			$scope.user = resp.data;
		}).catch(error => {
			console.log("Error", error);
		});
	}

	$scope.order = function() {
		$http.get(`/rest/order/${$scope.username}`).then(resp => {
			$scope.myOrder = resp.data;
			console.log($scope.myOrder)
		}).catch(error => {
			console.log("Error", error);
		});
	}

	//start load products

	$scope.tinh = function() {
		$.ajax({
			type: "GET",
			url: "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
			headers: {
				token: "0f9ab5f8-89c2-11ee-b1d4-92b443b7a897"
			},
			success: function(data) {
				let row = '<option value="">Vui lòng chọn Tỉnh/Thành Phố</option>';
				data.data.forEach(element => {
					row += `<option value="${element.ProvinceID}">${element.ProvinceName}</option>`;
				});
				document.querySelector("#province").innerHTML = row;
			},
			error: function(error) {
				alert("Đã xảy ra lỗi: " + error.responseText);
			}
		})
	}

	$scope.huyen = function(provinceid) {
		$.ajax({
			type: "GET",
			url: "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
			headers: {
				token: "0f9ab5f8-89c2-11ee-b1d4-92b443b7a897"
			},
			data: {
				province_id: provinceid
			},
			success: function(data) {
				let row = '<option value="">Vui lòng chọn Quận/Huyện</option>';
				data.data.forEach(element => {
					row += `<option value="${element.DistrictID}">${element.DistrictName}</option>`;
				});
				document.querySelector("#district").innerHTML = row;
			},
			error: function(error) {
				alert("Đã xảy ra lỗi: " + error.responseText);
			}
		})
	}

	$scope.phuong = function(districtid) {
		$.ajax({
			type: "GET",
			url: "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
			headers: {
				"token": "0f9ab5f8-89c2-11ee-b1d4-92b443b7a897"
			},
			data: {
				district_id: districtid
			},
			success: function(data) {
				let row = '<option value="">Vui lòng chọn Phường/Xã</option>';
				data.data.forEach(element => {
					row += `<option value="${element.WardCode}">${element.WardName}</option>`;
				});
				document.querySelector("#ward").innerHTML = row;
			},
			error: function(error) {
				alert("Đã xảy ra lỗi: " + error.responseText);
			}
		})
	}

	$scope.fee = function() {
		if ($scope.selected == null) {
			var message = "Bạn chưa chọn sản phẩm cần mua!";
			$scope.showNotification(message);
		} else {
			if ($scope.validate() === false) {
				var message = "Bạn vui lòng điền đủ thông tin nhận hàng!";
				$scope.warning(message);
				F
			} else {
				var district = document.getElementById("district").value;
				var wardcode = document.getElementById("ward").value;
				var phone = document.getElementById("phone").value;
				var address = localStorage.getItem("address");
				var total = localStorage.getItem("ttcs");
				var note = note = document.getElementById("note").value;
				var headers = {
					"ShopId": "190382",
					"Token": "0f9ab5f8-89c2-11ee-b1d4-92b443b7a897"
				};
				var config = {
					headers: headers
				};
				var items = [];
				for (var i = 0; i < $scope.selected.length; i++) {
					var item = {
						"name": $scope.selected[i].book.name,
						"quantity": $scope.selected[i].quantity,
						"price": $scope.selected[i].price,
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
				var data = {
					"payment_type_id": 2,
					"note": note,
					"required_note": "KHONGCHOXEMHANG",
					"from_ward_code": "550108",
					"return_phone": "0969434926",
					"return_address": "Ninh Kiều - Cần Thơ",
					"return_district_id": 1442,
					"return_ward_code": "20109",
					"to_name": $scope.user.fullname,
					"to_phone": phone,
					"to_address": address.toString(),
					"to_ward_code": wardcode,
					"to_district_id": district,
					"cod_amount": parseFloat(total),
					"weight": 200,
					"length": 3,
					"width": 18,
					"height": 19,
					"cod_failed_amount": 2000,
					"pick_station_id": 1442,
					"insurance_value": parseInt(total),
					"service_id": 0,
					"service_type_id": 2,
					"coupon": null,
					"items": items
				}
				var url = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/preview";
				$http.post(url, data, config).then(resp => {
					$scope.ship = resp.data.data.total_fee;
					var discount = 0;
					if (localStorage.getItem("discount") != null) {
						discount = localStorage.getItem("discount");
					}
					localStorage.setItem("ship", $scope.ship);
					localStorage.setItem("shipvnp", $scope.ship);
					const formatship = $scope.ship.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
					var total = localStorage.getItem("ttcs");
					var ttt = parseFloat(total) + $scope.ship - parseFloat(discount);
					localStorage.setItem("billtotal", ttt);
					const formatttt = ttt.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
					document.getElementById('ship').innerHTML = formatship + " VNĐ";
					document.getElementById('total').innerHTML = formatttt + " VNĐ";
					console.log(resp.data)
				}).catch(error => {
					console.log(error)
				})
			}
		}
	}

	$scope.cancelOrder = function() {
		var id = document.getElementById("billid").innerText;
		$http.get(`/rest/order/cancel/${id}`).then(resp => {
			var message = "Đã hủy đơn hàng";
			$scope.error(message);
			window.location.href = `/bill-details/${id}`;
		}).catch(error => {
			console.log(error)
		})
	}

	// tính thời gian giao hàng
	$scope.leadtime = function() {
		var headers = {
			"Content-Type": "application/json",
			"ShopId": "190382",
			"Token": "0f9ab5f8-89c2-11ee-b1d4-92b443b7a897"
		};
		var config = {
			headers: headers
		};
		var district = document.getElementById("district").value;
		var wardcode = document.getElementById("ward").value;
		console.log(wardcode, district)
		var data = {
			"from_district_id": 1572,
			"from_ward_code": "550108",
			"to_ward_code": wardcode.toString(),
			"to_district_id": parseInt(district),
			"service_id": 53320
		}
		var url = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime";
		$http.post(url, data, config).then(resp => {
			$scope.lead_time = resp.data.data.leadtime;
			console.log($scope.lead_time)
		}).catch(error => {
			console.log(error)
		})
	}

	var tinh = document.getElementById('province') !== null;
	if (tinh) {
		$scope.tinh();
	} else {
		console.log(tinh)
	}

	// Xử lý sự kiện thay đổi tỉnh
	$("#province").change(() => {
		var e = document.getElementById("province");
		var value = e.value;
		$scope.huyen(value)
		printResult();
	});

	// Xử lý sự kiện thay đổi huyện
	$("#district").change(() => {
		var e = document.getElementById("district");
		var value = e.value;
		$scope.phuong(value)
		printResult();
	});

	// Xử lý sự kiện thay đổi phường
	$("#ward").change(() => {
		// lay id huyen tu select
		var district = document.getElementById("district");
		var dtid = district.value;
		// lay wardcode tu select
		var ward = document.getElementById("ward");
		var wardcode = ward.value;
		printResult();
		$scope.fee();
		$scope.leadtime();
	});

	// Hàm hiển thị kết quả khi tất cả các lựa chọn đã được chọn
	var printResult = () => {
		if ($("#district").val() != "" && $("#province").val() != "" &&
			$("#ward").val() != "") {
			let result = $("#ward option:selected").text() +
				", " + $("#district option:selected").text() + ", " +
				$("#province option:selected").text();
			$("#result").val(result);
			if (localStorage.getItem("address") != null) {
				localStorage.removeItem("address");
			}
			localStorage.setItem("address", result);
		}
	}

	$scope.modalbook = function(book) {
		var qty = document.getElementById('qty');
		var addcartmodal = document.getElementById('addcartmodal');
		var buynow = document.getElementById('buynow');
		addcartmodal.disabled = false;
		buynow.disabled = false;
		qty.value = "1";
		$http.get(`/rest/storage/${book.id}`).then(resp => {
			if (resp.data.length <= 0 && resp.data === "") {
				addcartmodal.disabled = true;
				buynow.disabled = true;
			} else {
				if (resp.data.quantity < 1) {
					addcartmodal.disabled = true;
					buynow.disabled = true;
				}
				//				else {
				//					addcartmodal.disabled = false;
				//					buynow.disabled = false;
				//				}
			}
		});
		$http.get(`/rest/products/${book.id}`).then(resp => {
			$scope.book = resp.data;
			$http.get(`/rest/evaluate/book/${book.id}`).then(resp => {
				$scope.review = resp.data;
			})
		}).catch(error => {
			console.log(error)
		})
	}

	$scope.addCartModal = function(book) {
		$scope.username = $("#username").text();
		var addcartmodal = document.getElementById('addcartmodal');
		var buynow = document.getElementById('buynow');
		if ($scope.username == "") {
			location.href = "/security/login/form";
		}
		var qty = document.getElementById('qty').value;
		$http.get(`/rest/storage/${book.id}`).then(resp => {
			if (resp.data.length <= 0) {
				addcartmodal.disabled = true;
				buynow.disabled = true;
			} else {
				if (qty > resp.data.quantity) {
					addcartmodal.disabled = true;
					buynow.disabled = true;
				} else {
					addcartmodal.disabled = false;
					buynow.disabled = false;
					var url = `${host}/cart/addcart`;
					$scope.data = {
						price: book.price,
						quantity: qty,
						book: {
							id: book.id
						},
						cart: {
							id: $scope.cartid
						}
					}
					$http.post(url, $scope.data).then(resp => {
						var message = "Đã thêm sản phẩm vào giỏ!"
						$scope.success(message);
						//Swal.fire("Success", "Đã thêm vào giỏ hàng!", "success");
						$scope.getcartdetails();
						$scope.getTotalItem();
					}).catch(error => {
						console.log(error)
					})
				}
			}
		}).catch(error => {
			alert(error)
		})
	}

	$scope.product = function() {
		var url = `${host}/products`;
		$http.get(url).then(resp => {
			$scope.products = resp.data;
		});
	}

	$scope.product2 = function() {
		var url = `${host}/products`;
		$http.get(url).then(resp => {
			$scope.products2 = resp.data;
			$scope.limitedProducts = $scope.products2.slice(0, 8);
			$scope.limitedProducts2 = $scope.products2.slice(8, 16);
			$scope.limitedProducts3 = $scope.products2.slice(16, 24);
		});
	}

	//Sản phẩm theo loại
	$scope.productcategory = function(id) {
		var url = `/rest/categories/product/${id}`;
		$http.get(url).then(resp => {
			$scope.products = resp.data;
			$scope.pager.first();
		});
	}

	// ANIME
	$scope.productAnime = function(id) {
		var url = `/rest/categories/product/${id}`;
		$http.get(url).then(resp => {
			$scope.productCate1 = resp.data;
			$scope.productAnime = $scope.productCate1.slice(0, 6);
			$scope.productAnime2 = $scope.productCate1.slice(6, 12);
			$scope.productAnime3 = $scope.productCate1.slice(12, 18);
		});
	}



	// KNS
	$scope.productKns = function(id) {
		var url = `/rest/categories/product/${id}`;
		$http.get(url).then(resp => {
			$scope.productCate2 = resp.data;
			$scope.productKns = $scope.productCate2.slice(0, 6);
			$scope.productKns2 = $scope.productCate2.slice(6, 12);
			$scope.productKns3 = $scope.productCate2.slice(12, 18);
		});
	}

	$scope.changePanel = function() {
		var url = `/rest/products/changepanels`;
		$http.get(url).then(resp => {
			$scope.changePanels = resp.data;
			$scope.nav = $scope.changePanels[0] || null;
			$scope.qc1 = $scope.changePanels[1] || null;
			$scope.qc2 = $scope.changePanels[2] || null;
			$scope.bn1 = $scope.changePanels[3] || null;
			$scope.bn2 = $scope.changePanels[4] || null;
			$scope.productAnime($scope.bn1.changecate.id);
			$scope.productKns($scope.bn2.changecate.id);
		});
	}

	//Tìm kiếm theo ký tự
  $scope.searchKeyword = "";
  $scope.submitForm = function () {
    // Không cần submitForm nữa vì chúng ta sẽ theo dõi sự thay đổi ngay khi nhập

    $scope.$watch("searchKeyword", function (newVal, oldVal) {
      if (newVal !== oldVal) {
        // Sử dụng $http để tìm kiếm ngay khi có sự thay đổi trong ô tìm kiếm
        $http
          .get("/rest/products/search/", {
            params: {
              keyword: newVal,
            },
          })
          .then(function (response) {
            $scope.products = response.data;
            $scope.pager.first();
          })
          .catch((error) => {
            console.log("Lỗi", error);
          });
      }
    });
  };

	//Loại sản phẩm
	$scope.category = function() {
		$http.get("/rest/categories").then(resp => {
			$scope.categories = resp.data;
		}).catch(error => {
			console.log("Lỗi", error);
		})
	}

	$scope.product();
	$scope.product2();
	$scope.category();
	$scope.changePanel();
	// end load products

	//	-------------------------------------------------------------------------------------------------------------------

	// start handle cart

	//Lọc theo giá cao - thấp
	$scope.selectedSortOption = "lowToHigh";
	$scope.sortProducts = function() {
		if ($scope.selectedSortOption === "lowToHigh") {
			// Sắp xếp theo giá thấp đến cao
			$scope.products.sort(function(a, b) {
				return a.price - b.price;
			});
		} else if ($scope.selectedSortOption === "highToLow") {
			// Sắp xếp theo giá cao đến thấp
			$scope.products.sort(function(a, b) {
				return b.price - a.price;
			});
		}

		// Cập nhật phần phân trang nếu cần
		$scope.pager.first();
	};

	// load cart data
	$scope.getcartid = function() {
		$scope.username = $("#username").text();
		var url = `${host}/cart/` + $scope.username;
		$http.get(url).then(resp => {
			$scope.cart = resp.data;
			$scope.cartid = resp.data.id;
		}).catch(error => {
			console.log("Lỗi", error)
		})
	}

	// lấy toàn bộ dữ liệu từ giỏ hàng chi tiết
	$scope.getcartdetails = function() {
		$scope.username = $("#username").text();
		var url = `${host}/cart/cartdetails/` + $scope.username; //+ $scope.cart;
		$http.get(url).then(resp => {
			$scope.cartdetails = resp.data;
		}).catch(error => {
			console.log("Lỗi", error)
		})
	}

	// thêm sản phẩm vào giỏ hàng
	$scope.addcart = function(p) {
		var url = `${host}/cart/addcart`;
		$scope.username = $("#username").text();
		console.log($scope.username)
		if ($scope.username == "") {
			location.href = "/security/login/form";
		} else {
			$scope.data = {
				price: p.price,
				quantity: 1,
				book: {
					id: p.id
				},
				cart: {
					id: $scope.cartid
				}
			}
			$http.post(url, $scope.data).then(resp => {
				console.log("Success", resp);
				Swal.fire("Thành công", "Đã thêm vào giỏ hàng!", "success");
				$scope.getcartdetails();
				$scope.getTotalItem()
			}).catch(error => {
				console.log(error)
			})
		}
	}

	$scope.addcartbestseller = function(p, discount, endate) {
		console.log(endate);
		if (endate == "Đã kết thúc") {
			Swal.fire("Lỗi", "Sản phẩm đã hết thời gian giảm giá!", "error");

		} else {
			var a = parseFloat(discount);
			var url = `${host}/cart/addcart`;
			$scope.data = {
				price: discount,
				quantity: 1,
				book: {
					id: p.book.id
				},
				cart: {
					id: $scope.cartid
				}
			}
			console.log($scope.data);
			$http.post(url, $scope.data).then(resp => {
				console.log("Success", resp);
				Swal.fire("Thành công", "Thêm giỏ hàng thành công!", "success");
				$scope.getcartdetails();
				$scope.getTotalItem()
			}).catch(error => {
				Swal.fire("Lỗi", "Thêm giỏ hàng thất bại!", "error");
				console.log(error)
			})

		}
	}

	// xóa sản phẩm khỏi giỏ hàng
	$scope.deleteid = function(id) {
		var url = `${host}/cart/delete/${id}`;
		$http.delete(url).then(resp => {
			console.log("Success", resp);
			$scope.selected = [];
			$scope.sumtotal($scope.selected)
			$scope.total = 0
			$scope.ttcs = localStorage.setItem("ttcs", 0);
			$scope.getcartdetails();
		}).catch(error => {
			Swal.fire("Lỗi", "Xóa sản phẩm thất bại!", "error");
			console.log("Error", error);
		})
	}

	// Giảm số lượng sản phẩm
	$scope.updateminusqty = function(cd) {
		$scope.selected = $scope.selected.filter(item => item !== cd);
		$scope.ttcs = localStorage.getItem("ttcs");
		if (isNaN(cd.quantity)) {
			Swal.fire("Error", "Số lượng không phải số!", "error");
			cd.quantity = 1;
		}
		if (cd.quantity > 1) {
			var url = `${host}/cart/updateqty`;
			cd.quantity--;
			$http.put(url, cd).then(resp => {
				$scope.selected.push(cd);
				$scope.total = $scope.sumtotal($scope.selected)
				$scope.ttcs = localStorage.getItem("ttcs");
				const ttt = $scope.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
				document.getElementById('total').innerHTML = ttt + " VNĐ";
				localStorage.setItem("billtotal", $scope.total);
				console.log("Success", resp)
			}).catch(error => {
				console.log("Error", error);
			})
		}
	}

	// Tăng số lượng sản phẩm
	$scope.updateplusqty = function(cd) {
		$scope.selected = $scope.selected.filter(item => item !== cd);
		if (isNaN(cd.quantity) || cd.quantity < 0) {
			Swal.fire("Error", "Số lượng không phải số!", "error");
			cd.quantity = 1;
		}
		if (cd.quantity >= 10) {
			Swal.fire("Cảnh báo", "Vượt quá số lượng!", "waring");
		} else {
			var qty = document.getElementById('qty').value;
			$http.get(`/rest/storage/${cd.book.id}`).then(resp => {
				if (resp.data.length <= 0) {
					Swal.fire("Thông báo", "Sản phẩm đã hết hàng", "info");
				} else {
					if (qty > resp.data.quantity) {
						Swal.fire("Thông báo", "Rất tiếc, sản phẩm không còn đủ số lượng!", "info", false);
					} else {
						var url = `${host}/cart/updateqty`;
						cd.quantity++;
						$http.put(url, cd).then(resp => {
							$scope.selected.push(cd);
							$scope.total = $scope.sumtotal($scope.selected)
							localStorage.setItem("billtotal", $scope.total);
							const ttt = $scope.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							document.getElementById('total').innerHTML = ttt + " VNĐ";
							console.log("Success", resp)
						}).catch(error => {
							Swal.fire("Error", "thất bại!", "error");
							console.log("Error", error);
						})
					}
				}
			}).catch(error => {
				console.log(error)
			})
		}
	}

	//tổng item
	$scope.getTotalItem = function() {
		var totalQuantity = $scope.cartdetails.length;
		return totalQuantity;
	}

	// ------------------------------------------------

	$scope.kiemtrakho = function(book) {
		$scope.username = $("#username").text();
		var addcartmodal = document.getElementById('addcartmodal');
		var buynow = document.getElementById('buynow');
		if ($scope.username == "") {
			location.href = "/security/login/form";
		}
		var qty = document.getElementById('qty').value;
		$http.get(`/rest/storage/${book.id}`).then(resp => {
			if (resp.data.length <= 0) {
				addcartmodal.disabled = true;
				buynow.disabled = true;
			} else {
				if (qty > resp.data.quantity) {
					addcartmodal.disabled = true;
					buynow.disabled = true;
				} else {
					addcartmodal.disabled = false;
					buynow.disabled = false;
				}
			}
		}).catch(error => {
			console.log(error)
		})
	}

	$scope.checkVoucher = function() {
		var id = document.getElementById("voucher").value;
		if (id === "0") {
			var message = "Bạn hãy chọn mã giảm giá của mình!";
			$scope.warning(message);
			localStorage.setItem("billtotal", parseFloat(localStorage.getItem("billtotal")) + parseFloat(localStorage.getItem("discount")))
			localStorage.setItem("discount", 0)
			var total = parseFloat(localStorage.getItem("billtotal"))
			const formatttt = total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			document.getElementById('total').innerHTML = formatttt + " VNĐ";
			document.getElementById('giamgia').innerHTML = 0 + " VNĐ";
		} else {
			if (id === localStorage.getItem("vcid")) {
				var message = "Bạn đã áp dụng mã này rồi!";
				$scope.warning(message);
			} else {
				$http.get(`/rest/vouchers/${id}`).then(resp => {
					var startDate = new Date(resp.data.startdate);
					var endDate = new Date(resp.data.enddate);
					var currentDate = new Date();
					var discount = resp.data.discount;
					if (currentDate >= startDate && currentDate <= endDate) {
						const formatgiamgia = discount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						var message = "Áp dụng thành công! Bạn được giảm " + formatgiamgia + " VNĐ cho đơn hàng!";
						$scope.success(message);
						localStorage.setItem("vcid", id);
						document.getElementById('giamgia').innerHTML = formatgiamgia + " VNĐ";
						var total = localStorage.getItem("billtotal") - discount;
						$scope.sumtotal($scope.selected);
						localStorage.setItem("billtotal", total);
						localStorage.setItem("discount", discount);
						const formatttt = total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
						document.getElementById('total').innerHTML = formatttt + " VNĐ";
					} else {
						var message = "Mã giảm giá không đủ điều kiện!";
						console.log(message)
						$scope.error(message);
						if (localStorage.getItem("discount") > 0) {
							localStorage.setItem("billtotal", parseFloat(localStorage.getItem("billtotal")) + parseFloat(localStorage.getItem("discount")))
						}
						document.getElementById('giamgia').innerHTML = 0 + " VNĐ";
						var total = parseInt(localStorage.getItem("billtotal"));
						$scope.sumtotal($scope.selected);
						localStorage.setItem("billtotal", total);
						localStorage.setItem("discount", 0);
						const formatttt = total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
						document.getElementById('total').innerHTML = formatttt + " VNĐ";
					}
				});
			}
		}
	}

	$scope.error = function(message) {
		Swal.fire({
			imageUrl: "https://cdn-icons-png.flaticon.com/128/8316/8316597.png?ga=GA1.1.1291416675.1687413689&semt=ais",
			text: message,
			showConfirmButton: false,
			timer: 5000,
		});
	}

	$scope.warning = function(message) {
		Swal.fire({
			imageUrl: "https://cdn-icons-png.flaticon.com/128/8316/8316593.png?ga=GA1.1.1291416675.1687413689&semt=ais",
			text: message,
			showConfirmButton: false,
			timer: 5000,
		});
	}

	$scope.success = function(message) {
		Swal.fire({
			imageUrl: "https://cdn-icons-png.flaticon.com/128/8316/8316594.png?ga=GA1.1.1291416675.1687413689&semt=ais",
			text: message,
			showConfirmButton: false,
			timer: 5000,
		});
	}

	$scope.checkStorage = function(selected) {
		var an = document.getElementById('address');
		var promises = [];
		var kt = 0;
		for (var i = 0; i < selected.length; i++) {
			var qty = selected[i].quantity;
			var id = selected[i].book.id;
			var name = selected[i].book.name;
			var promise = $http.get(`/rest/storage/${id}`).then(resp => {
				if (resp.data.length <= 0) {
					kt++;
				} else {
					if (resp.data.quantity < qty) {
						kt++;
					} else {
						kt--;
					}
				}
			});
			promises.push(promise);
		}
		Promise.all(promises).then(() => {
			if (kt >= 0) {
				console.log(kt)
				var message = "Có 1 vài sản phẩm bạn chọn đã hết hàng!";
				$scope.error(message);
				an.style.display = 'none';
			} else {
				an.style.display = 'block';
			}
		});
	}

	$scope.updateorderstatus = function(ordercode) {
		var headers = {
			"Content-Type": "application/json",
			"Token": "0f9ab5f8-89c2-11ee-b1d4-92b443b7a897"
		};
		var config = {
			headers: headers
		};
		var data = {
			"order_code": ordercode
		}
		var url = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail";
		$http.post(url, data, config).then(resp => {
			var order_code = resp.data.data.order_code;
			var status = resp.data.data.status;
			var body = {
				orderstatus: status
			}
			$http.put(`/rest/order/${order_code}`, body).then(resp => {
				console.log("kh loi");
			})
		}).catch(error => {
			console.log(error)
		})
	}

	$scope.updateOrder = function() {
		var user = $scope.username;
		$http.get(`/rest/order/status/${user}`).then(resp => {
			if (resp.data.length > 0) {
				$scope.orderStatus = resp.data;
				for (var i = 0; i < $scope.orderStatus.length; i++) {
					var ordercode = $scope.orderStatus[i].ordercode;
					$scope.updateorderstatus(ordercode);
				}
			}
		})
	}

	var intervalPromise = $interval(function() {
		$scope.updateOrder();
	}, 60000);

	$scope.exist = function(cd) {
		return $scope.selected.indexOf(cd) > -1;
	}

	$scope.toggleSelection = function(cd) {
		var an = document.getElementById('address');
		$scope.total = 0;
		var idx = $scope.selected.indexOf(cd);
		if (idx > -1) {
			$scope.selected.splice(idx, 1);
			if ($scope.selected.length > 0) {
				$scope.checkStorage($scope.selected);
			} else {
				an.style.display = 'none';
			}
			$scope.total = $scope.sumtotal($scope.selected);
			const ttt = $scope.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			localStorage.setItem("billtotal", $scope.total)
			document.getElementById('total').innerHTML = ttt + " VNĐ";
		} else {
			$scope.selected.push(cd);
			if ($scope.selected.length > 0) {
				$scope.checkStorage($scope.selected);
			}
			$scope.total = $scope.sumtotal($scope.selected);
			localStorage.setItem("billtotal", $scope.total);
			const ttt = $scope.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			document.getElementById('total').innerHTML = ttt + " VNĐ";
		}
	}

	// tính tổng tiền 
	$scope.sumtotal = function(select) {
		let discount = 0;
		let ship = 0;
		$scope.ttcs = 0;
		var total = 0;
		if (localStorage.getItem("ship") != null) {
			ship = localStorage.getItem("ship");
		}
		if (localStorage.getItem("discount") != null) {
			discount = localStorage.getItem("discount");
		}
		if (select.length < 1) {
			$scope.ttcs = 0;
			localStorage.setItem("ttcs", $scope.ttcs);
			total = 0;
			return total;
		}
		for (var i = 0; i < select.length; i++) {
			$scope.ttcs += select[i].price * select[i].quantity;
			total += select[i].price * select[i].quantity;
		}
		localStorage.setItem("ttcs", $scope.ttcs);
		return total + parseFloat(ship) - parseFloat(discount);
	}

	$scope.cbthanhtoan = function() {
		var check = $('input[name="payment"]:checked').val();
		if (check >= 1) {
			//$scope.UpBill();
			if ($scope.validate() === false) {
				var message = "Bạn vui lòng điền đủ thông tin nhận hàng!";
				$scope.warning(message);
			} else {
				$scope.thanhtoan();
			}
		} else {
			if ($scope.validate() === false) {
				var message = "Bạn vui lòng điền đủ thông tin nhận hàng!";
				$scope.warning(message);
			} else {
				$scope.payment();
				//$scope.infoOrder();
				$scope.total = localStorage.getItem("billtotal");
				$scope.generatePayment();
			}
		}
	}

	$scope.generatePayment = function() {
		var params = {
			bankCode: "NCB",
			amount: localStorage.getItem("billtotal")
		};
		console.log('Request Params:', params)
		$http.get(`/api/vnpay/create-payment`, {
			params: params
		})
			.then(function(response) {
				$scope.payment = response.data;
				window.location.href = $scope.payment;
			})
			.catch(function(error) {
				console.error('Error:', error);
			});
	};

	//// vouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervoucher
	$scope.loadAllVoucher = function() {
		$http.get("/rest/myvoucher").then(resp => {
			$scope.allvouchers = resp.data;
			$scope.allvouchers.splice(0, 1);
		}).catch(error => {
			console.log("Error", error)
		})
	}

	$scope.myvoucher = function() {
		$scope.username = $("#username").text();
		var url = `${host}/myvoucher/` + $scope.username;
		$http.get(url).then(resp => {
			$scope.myvoucher = resp.data;
		}).catch(error => {
			console.log("Error", error)
		})
	}

	$scope.addUsvoucher = function(id) {
		var data = {
			account: {
				username: $scope.username = $("#username").text()
			},
			voucher: {
				voucherid: id
			}
		}
		$http.post("/rest/myvoucher", data).then(resp => {
			console.log(resp.data)
			Swal.fire("Thành công", "Thêm voucher thành công!", "success");
		}).catch(error => {
			console.log("Error", error)
		})
	}

	$scope.myvoucher()
	$scope.loadAllVoucher()
	$scope.deletevoucherid = function(id) {
		$http.delete(`/rest/myvoucher/${id}`).then(resp => {
			console.log("success", resp);
		}).catch(error => {
			console.log("Error", error)
		})
	}
	//// vouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervouchervoucher
	$scope.showOrder = function() {
		Swal.fire({
			title: 'Đặt hàng thành công!',
			text: "Xem chi tiết đơn hàng?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#4EEE94',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Xem ngay',
			cancelButtonText: 'Hủy'
		}).then((result) => {
			if (result.isConfirmed) {

			}
		});
	};

	$scope.showConfirm = function(cd) {
		Swal.fire({
			title: 'Bạn có chắc chắn xóa truyện này?',
			text: "Bạn sẽ không thể hoàn nguyên hành động này!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#4EEE94',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Xóa',
			cancelButtonText: 'Hủy'
		}).then((result) => {
			if (result.isConfirmed) {
				$scope.deleteid(cd.id);
				Swal.fire(
					'Xác nhận xóa truyện khỏi giỏ hàng!',
					'Hành động đã được thực hiện.',
					'success'
				);
			}
		});
	};

	$scope.showNotification = function(message) {
		var notification = document.getElementById("notification");
		notification.innerHTML = message;
		notification.style.display = "block";
		void notification.offsetWidth;
		notification.style.opacity = "1";
		notification.style.fontSize = "18px";
		setTimeout(function() {
			notification.style.opacity = "0";
			notification.style.fontSize = "12px";
			setTimeout(function() {
				notification.style.display = "none";
				notification.style.opacity = "1";
				notification.style.fontSize = "24px";
			}, 1000);
		}, 3000);
	}

	$scope.getEvaluateBook = function() {
		var id = document.getElementById('bookid') !== null;
		if (id) {
			var id = document.getElementById('bookid').value;
			$http.get(`/rest/evaluate/book/${id}`).then(resp => {
				$scope.evaluates = resp.data;
				console.log($scope.evaluates)
			})
		} else {
			console.log(id)
		}
	}

	$scope.getEvaluateBook()

	// evaluate
	$scope.Postevaluate = function() {
		var id = document.getElementById('bookid').value;
		const selectedRadio = document.querySelector('input[name="star"]:checked');
		var star = selectedRadio.value;
		var comment = document.getElementById('comment').value;
		if (comment === "") {
			comment = "tốt"
		}
		$scope.evaluate = {
			account: {
				username: $("#username").text()
			},
			book: {
				id: id
			},
			star: star,
			comment: comment,
			commentdate: new Date()
		}
		$http.get(`/rest/evaluate/${id}`).then(resp => {
			if (resp.data === "") {
				$http.post("/rest/evaluate", $scope.evaluate).then(resp => {
					console.log(resp.data);
					$scope.getEvaluateBook()
					var message = "Đánh giá sản phẩm thành công";
					$scope.showNotification(message);
				})
			} else {
				var message = "Bạn đã đánh giá sản phẩm này!";
				$scope.showNotification(message);
			}
		})
	}

	// thanh toán
	$scope.thanhtoan = function() {
		var voucher = document.getElementById("voucher").value;
		var phone = document.getElementById("phone").value;
		var district = document.getElementById("district").value;
		var wardcode = document.getElementById("ward").value;
		var item = $scope.myvoucher.find(item => item.voucher.voucherid == voucher);
		var leadtime = $scope.lead_time;
		console.log(leadtime)
		var note = "không ghi chú";
		if (document.getElementById("note").value !== "") {
			note = document.getElementById("note").value;
		}
		$scope.bill = {
			createDate: new Date(),
			ordercode: null,
			phone: phone,
			address: localStorage.getItem("address"),
			billtotal: localStorage.getItem("billtotal"),
			ship: localStorage.getItem("shipvnp"),
			account: {
				username: $("#username").text()
			},
			voucher: {
				voucherid: voucher
			},
			status: false,
			orderstatus: "Chờ xác nhận",
			note: note,
			leadtime: leadtime,
			ward: wardcode,
			district: district,
			get billdetails() {
				return $scope.selected.map(item => {
					return {
						book: {
							id: item.book.id
						},
						price: item.price,
						quantity: item.quantity
					}
				});
			},
			purchase() {
				var bill = angular.copy(this);
				$http.post("/rest/order", bill).then(resp => {
					for (var i = 0; i < $scope.selected.length; i++) {
						var id = $scope.selected[i].book.id;
						var qty = $scope.selected[i].quantity;
						$http.get(`/rest/storage/${id}`).then(resp => {
							$scope.bookstorage = resp.data;
							var data = {
								id: $scope.bookstorage.id,
								book: {
									id: $scope.bookstorage.book.id
								},
								quantity: $scope.bookstorage.quantity - qty
							}
							console.log(data)
							var bookid = $scope.bookstorage.book.id;
							$http.put(`/rest/storage/${bookid}`, data).then(resp => {
								console.log(resp.data)
							})
						})
						$scope.deleteid($scope.selected[i].id)
					}
					if (item != null) {
						$scope.deletevoucherid(item.id);
					}
					
					var message = "Đặt hàng thành công";
					$scope.success(message);
				}).catch(error => {
					console.log(error)
				})
			}
		}
		$scope.bill.purchase();
		//var message = "Đặt hàng thành công";
		//		$scope.showNotification(message);
		//		setTimeout(function() {
		//			window.location.href = "/bill-details/" + ordercode;
		//		}, 5000);
	}

	$scope.giamqtystorage = function(id) {
		$http.get(`/rest/storage/${id}`).then(resp => {
			$scope.bookstorage = resp.data;

		})
	}

	$scope.validate = function() {
		var district = document.getElementById("district").value;
		var wardcode = document.getElementById("ward").value;
		var phone = document.getElementById("phone").value;
		//var address = localStorage.getItem("address");
		//var total = localStorage.getItem("ttcs");
		//var note = document.getElementById("note").value;
		var result = document.getElementById("result").value;
		if (!district || !wardcode || !phone || !result) {
			return false;
		}
		var vietnamPhoneNumberRegex = /^(0[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/;
		if (!vietnamPhoneNumberRegex.test(phone)) {
			return false;
		}
		return true;
	}

	// $scope.UpBill = function () {
	// 	if ($scope.validate() === false) {
	// 		var message = "Bạn vui lòng điền đủ thông tin nhận hàng!";
	// 		$scope.warning(message);
	// 	} else {
	// var district = document.getElementById("district").value;
	// var wardcode = document.getElementById("ward").value;
	// 		var phone = document.getElementById("phone").value;
	// 		var address = localStorage.getItem("address");
	// 		var total = localStorage.getItem("ttcs");
	// 		var note = "không ghi chú";
	// 		if (document.getElementById("note").value !== "") {
	// 			note = document.getElementById("note").value;
	// 		}
	// 		var headers = {
	// 			"ShopId": "190382",
	// 			"Token": "0f9ab5f8-89c2-11ee-b1d4-92b443b7a897"
	// 		};
	// 		var config = {
	// 			headers: headers
	// 		};
	// 		var items = [];
	// 		for (var i = 0; i < $scope.selected.length; i++) {
	// 			var item = {
	// 				"name": $scope.selected[i].book.name,
	// 				"quantity": $scope.selected[i].quantity,
	// 				"price": $scope.selected[i].price,
	// 				"length": 3,
	// 				"width": 8,
	// 				"weight": 100,
	// 				"height": 12,
	// 				"category": {
	// 					"level1": "Sách"
	// 				}
	// 			}
	// 			items.push(item);
	// 		}
	// 		var data = {
	// 			"payment_type_id": 2,
	// 			"note": note,
	// 			"required_note": "KHONGCHOXEMHANG",
	// 			"from_ward_code": "550108",
	// 			"return_phone": "0969434926",
	// 			"return_address": "Ninh Kiều - Cần Thơ",
	// 			"return_district_id": 1442,
	// 			"return_ward_code": "20109",
	// 			"to_name": $scope.user.fullname,
	// 			"to_phone": phone,
	// 			"to_address": address.toString(),
	// 			"to_ward_code": wardcode,
	// 			"to_district_id": district,
	// 			"cod_amount": parseInt(total),
	// 			"weight": 200,
	// 			"length": 3,
	// 			"width": 18,
	// 			"height": 19,
	// 			"cod_failed_amount": 2000,
	// 			"pick_station_id": 1442,
	// 			"insurance_value": parseInt(total),
	// 			"service_id": 0,
	// 			"service_type_id": 2,
	// 			"coupon": null,
	// 			"items": items
	// 		}
	// 		var url = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create";
	// 		$http.post(url, data, config).then(resp => {
	// 			console.log(resp.data)
	// 			localStorage.setItem("ordercode", resp.data.data.order_code);
	// 			$scope.ordercode = resp.data.data.order_code;
	// 			$scope.thanhtoan($scope.ordercode);
	// 		}).catch(error => {
	// 			console.log(error)
	// 		})
	// 	}
	// }

	$scope.billDetails = function(id) {
		$http.get(`/rest/order/bill/${id}`).then(resp => {
			$scope.billDetails = resp.data;
		}).catch(error => {
			alert("Đơn hàng không tồn tại trong hệ thống!");
			console.log(error)
		})
	}

	$scope.infoOrder = function() {
		var district = document.getElementById("district").value;
		var wardcode = document.getElementById("ward").value;
		var phone = document.getElementById("phone").value;
		var address = localStorage.getItem("address");
		var note = "không ghi chú";
		if (document.getElementById("note").value !== "") {
			note = document.getElementById("note").value;
		}
		var total = localStorage.getItem("ttcs");
		var items = [];
		for (var i = 0; i < $scope.selected.length; i++) {
			var item = {
				"name": $scope.selected[i].book.name,
				"quantity": $scope.selected[i].quantity,
				"price": $scope.selected[i].price,
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

		$scope.infoOrder = {
			total: total,
			to_phone: phone,
			to_address: address.toString(),
			wardcode: wardcode,
			note: note,
			district: district,
			items: items,
			purchase() {
				var infoOrder = angular.copy(this);
				$http.post("/rest/order/info-order", infoOrder).then(resp => {
					console.log(resp.data);
				}).catch(error => {
					console.log(error)
				})
			}
		}
		$scope.infoOrder.purchase();
	}

	$scope.payment = function() {
		var voucher = document.getElementById("voucher").value;
		var phone = document.getElementById("phone").value;
		var district = document.getElementById("district").value;
		var wardcode = document.getElementById("ward").value;
		var item = $scope.myvoucher.find(item => item.voucher.voucherid == voucher);
		var leadtime = $scope.lead_time;
		console.log(leadtime)
		var note = "không ghi chú";
		if (document.getElementById("note").value !== "") {
			note = document.getElementById("note").value;
		}
		$scope.bill = {
			createDate: new Date(),
			ordercode: null,
			phone: phone,
			address: localStorage.getItem("address"),
			billtotal: localStorage.getItem("billtotal"),
			ship: localStorage.getItem("shipvnp"),
			account: {
				username: $("#username").text()
			},
			voucher: {
				voucherid: voucher
			},
			status: true,
			orderstatus: "Chờ xác nhận",
			note: note,
			leadtime: leadtime,
			ward: wardcode,
			district: district,
			get billdetails() {
				return $scope.selected.map(item => {
					return {
						book: {
							id: item.book.id
						},
						price: item.price,
						quantity: item.quantity
					}
				});
			},
			purchase() {
				var bill = angular.copy(this);
				// thuc hien dat hang
				$http.post("/rest/order/payment", bill).then(resp => {
					console.log(resp.data);
				}).catch(error => {
					console.log(error)
				})
			}
		}
		$scope.bill.purchase();
	}

	$scope.pager = {
		page: 0,
		size: 12,
		get products() {
			var start = this.page * this.size;
			return $scope.products.slice(start, start + this.size);

		},
		get count() {
			return Math.ceil(1.0 * $scope.products.length / this.size);
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

	$scope.changeStatus = function(orderId, newStatusId) {
		$http.put("/rest/order/" + orderId + "/status?newStatusId=" + newStatusId)
			.then(function(response) {
				$scope.items.push(response.data); // Sửa lại thành response.data
				// Update interface after successful status change
				for (var i = 0; i < $scope.items.length; i++) {
					if ($scope.items[i].id === orderId) {
						$scope.items[i].status.id = newStatusId;
						break;
					}
				}
			}).catch(function(error) {
				$scope.initialize();
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Hủy đơn hàng thành công',
					confirmButtonText: 'OK'
				});
			});
	};

	$scope.getfavorite = function() {
		$scope.username = $("#username").text();
		$http.get(`/rest/favorites/` + $scope.username).then(resp => {
			$scope.favorites = resp.data;
		}).catch(error => {
			console.log("Error", error)
		})
	}

	if ($scope.username !== "") {
		$scope.getUser();
		$scope.order();
		$scope.myvoucher();
		$scope.getcartid()
		$scope.getcartdetails();
		$scope.getfavorite();
	}

	$scope.addfavorite = function(id) {
		$scope.data = {
			account: {
				username: $("#username").text()
			},
			book: {
				id: id
			},
			Likedate: new Date().toISOString().slice(0, 10)
		}

		$http.post("/rest/favorites", $scope.data).then(resp => {
			Swal.fire({
				type: 'success',
				title: 'Đã yêu thích truyện tranh này',
				/*text: 'Đã yêu thích sản phẩm',*/
				icon: "success",
				showConfirmButton: false,
				timer: 2000
			})
			$scope.getfavorite()
			console.log($scope.data)
		}).catch(error => {
			Swal.fire({
				type: 'error',
				title: 'Yêu thích',
				text: 'Không thể yêu thích truyện tranh này',
				icon: "error",
				showConfirmButton: false,
				timer: 2000
			})
			console.log("Error", error);
		})

	}

	$scope.removefavorite = function(id) {
		$http.delete(`/rest/favorites/${id}`).then(resp => {
			Swal.fire({
				type: 'success',
				title: 'Đã hủy yêu thích truyện tranh này',
				/*text: 'Đã hủy yêu thích',*/
				icon: "success",
				showConfirmButton: false,
				timer: 2000
			})
			$scope.getfavorite();
		}).catch(error => {
			Swal.fire({
				type: 'error',
				title: 'Không thể hủy yêu thích sản phẩm',
				/*text: 'Không thể hủy yêu thích sản phẩm',*/
				icon: "error",
				showConfirmButton: false,
				timer: 2000
			})
			console.log(error)
		})
	}


	$scope.checkAddOrRemove = function(id) {
		$http.get(`/rest/favorites/check/${id}`).then(resp => {
			$scope.favorite = resp.data.length;
			if ($scope.favorite == 0) {
				$scope.addfavorite(id);
				$scope.proid = id;
			} else {
				$scope.removefavorite(id);
				$scope.defaul = 0;
			}
		}).catch(error => {
			location.href = "/favorite/error";
			console.log("Error", error)
		})
	}

	$scope.pagerfavorite = {
		page: 0,
		size: 10,
		get favorites() {
			var start = this.page * this.size;
			return $scope.favorites.slice(start, start + this.size);

		},
		get count() {
			return Math.ceil(1.0 * $scope.favorites.length / this.size);
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

	//Chia sẽ fb
	$scope.shareOnFacebook = function() {
		// Replace with the URL and other information of your product
		var productUrl = 'https://example.com/product';

		FB.ui({
			method: 'share',
			href: productUrl
		}, function(response) {
			if (response && !response.error_code) {
				console.log('Chia sẻ thành công !');
			} else {
				console.log('Chia sẻ thất bại !');
			}
		});
	};
	//Chia sẽ fb


	//prodfile edit
	$scope.getAccountByUsername = function() {
		$scope.username = $("#username").text(); // Lấy giá trị tên người dùng từ biến username trong $scope
		let url = `${host}/accounts/${$scope.username}`;
		$http.get(url).then(function(response) {
			$scope.form = response.data; // Gán dữ liệu vào biến form để hiển thị trên form
		}).catch(function(error) {
			console.log("Error", error);
		});
	};

	// Gọi hàm để lấy thông tin người dùng khi trang web được tải
	$scope.getAccountByUsername();

	// Hàm cập nhật thông tin người dùngHàm cập nhật thông tin người dùngHàm cập nhật thông tin người dùngHàm cập nhật thông tin người dùngHàm cập nhật thông tin người dùngHàm cập nhật thông tin người dùng
	$scope.updateAccount = function() {
		let url = `${host}/accounts/${$scope.form.username}`;

		$http.put(url, $scope.form).then(function(response) {
			// Xử lý phản hồi sau khi cập nhật thành công
			Swal.fire({
				type: 'success',
				title: 'Cập nhật thành công',
				text: 'Thông tin người dùng đã được cập nhật',
				icon: "success",
				showConfirmButton: false,
				timer: 2000
			})
		}).catch(function(error) {
			// Xử lý lỗi nếu cập nhật không thành công
			Swal.fire({
				type: 'error',
				title: 'Lỗi cập nhật thông tin người dùng',
				text: error,
				icon: "error",
				showConfirmButton: false,
				timer: 2000
			})
			console.log("Erorr", err);
		});
	};
	// Hàm cập nhật thông tin người dùngHàm cập nhật thông tin người dùngHàm cập nhật thông tin người dùngHàm cập nhật thông tin người dùngHàm cập nhật thông tin người dùngHàm cập nhật thông tin người dùng




	//Đổi mật khẩuĐổi mật khẩuĐổi mật khẩuĐổi mật khẩuĐổi mật khẩuĐổi mật khẩuĐổi mật khẩu
	$scope.updatematkhau = function() {

		let url = `${host}/accounts/a/${$scope.form.username}`;


		let pwold = $scope.form.password;


		let pwoldnl = document.getElementById("pwold").value;
		let pw = document.getElementById("pawword").value;
		let pwcf = document.getElementById("cfpw").value;

		if (pwold == pwoldnl) {
			if (pw == pwcf) {
				$http.put(url, pw).then(function(response) {
					// Xử lý phản hồi sau khi cập nhật thành công
					Swal.fire({
						type: 'success',
						title: 'Cập nhật thành công',
						text: 'Thông tin người dùng đã được cập nhật',
						icon: "success",
						showConfirmButton: false,
						timer: 2000
					})
				}).catch(function(error) {
					// Xử lý lỗi nếu cập nhật không thành công
					Swal.fire({
						type: 'error',
						title: 'Lỗi cập nhật thông tin người dùng',
						text: error,
						icon: "error",
						showConfirmButton: false,
						timer: 2000
					})
					console.log("Erorr", err);
				});

			} else {
				Swal.fire("Lỗi", "Xác nhận mật khẩu không chính xác!", "error");
			}

		} else {
			Swal.fire("Lỗi", "Mật khẩu cũ không chính xác!", "error");

		}



	};
	//Đổi mật khẩuĐổi mật khẩuĐổi mật khẩuĐổi mật khẩuĐổi mật khẩuĐổi mật khẩuĐổi mật khẩu




	//bestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestseler


	$scope.getbestsl = function() {
		$http.get("/rest/bestseller/").then(resp => {
			$scope.bestseller = resp.data;
		}).catch(error => {
			console.log("Error", error)
		})
	}

	$scope.calculateRemainingTime = function(endDate) {
		const currentTime = new Date();
		const endTime = new Date(endDate);

		if (currentTime > endTime) {
			return 'Đã kết thúc';
		}

		const remainingMilliseconds = endTime - currentTime;
		const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
		const hours = Math.floor(remainingSeconds / 3600);
		const minutes = Math.floor((remainingSeconds % 3600) / 60);
		const seconds = remainingSeconds % 60;

		return `${hours} giờ ${minutes} phút ${seconds} giây`;
	};

	$scope.removeExpiredProducts = function() {
		const currentTime = new Date();

		$scope.bestseller = $scope.products.filter(product => {
			const discount = $scope.discounts.find(discount => discount.book.id === book.id);
			return !discount || currentTime < new Date(discount.endDate);
		});
	};

	// Fetch data every minute
	const fetchInterval = $interval($scope.getbestsl, 20000);

	// Call the function to remove expired products immediately
	$scope.removeExpiredProducts();
	//	// Cancel the interval when the controller is destroyed
	$scope.$on('$destroy', function() {
		$interval.cancel(fetchInterval);
	});


	$scope.getbestsl();

	//bestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestselerbestseler
})