package com.poly.restcontroller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.dao.BillDAO;
import com.poly.entity.Bill;
import com.poly.entity.BillDetail;
import com.poly.entity.OrderStatistic;
import com.poly.entity.Revenuestatistics;
import com.poly.service.AccountService;
import com.poly.service.BillService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/order")
public class OrderRestController {
	@Autowired
	BillService billservice;

	@Autowired
	BillDAO billDao;

	@Autowired
	AccountService accountService;
	
	@GetMapping("/index")
	public List<Long> index(Model model) {
		long choXacNhan = billDao.countByOrderStatus("Chờ xác nhận");
		long dangGiaoHang = billDao.countByOrderStatus("Đang giao hàng");
		long daNhanHang = billDao.countByOrderStatus("Đã giao hàng");
		long huyDonHang = billDao.countByOrderStatus("Đã hủy đơn");
		long tienhanhgiaohang = billDao.countByOrderStatus("Tiến hành giao hàng");
		long cholayhang = billDao.countByOrderStatus("Chờ lấy hàng");
		List<Long> list = new ArrayList<>();
		list.add(choXacNhan);
		list.add(dangGiaoHang);
		list.add(daNhanHang);
		list.add(huyDonHang);
		list.add(tienhanhgiaohang);
		list.add(cholayhang);
		return list;
	}

	@GetMapping()
	public List<Bill> getAll() {
		return billDao.findAllOrderByCreateDateDesc();
	}

//	@GetMapping("dhdg")
//	public List<Bill> getDHDG() {
//		List<Bill> listoder2 = billDao.stautus(2);
//		return listoder2;
//
//	}

//	@GetMapping("dg")
//	public List<Bill> getDG() {
//		List<Bill> listoder3 = billDao.stautus(3);
//		return listoder3;
//
//	}

//	@GetMapping("huy")
//	public List<Bill> gethuy() {
//		List<Bill> listoder4 = billDao.stautus(4);
//		return listoder4;
//
//	}

	@GetMapping("trangthai/{va}")
	public List<Bill> getTrangThaiDH(@PathVariable("va") Integer va) {
		String st = "";
		if(va == 1) {
			st = "Chờ xác nhận";
		} else if(va == 2) {
			st = "Đang giao hàng";
		} else if(va == 3) {
			st = "Đã giao hàng";
		} else if(va == 4) {
			st = "Chờ lấy hàng";
		} else if(va == 5) {
			st = "Tiến hành giao hàng";
		} else if(va == 6) {
			st = "Đã hủy đơn";
		}
		List<Bill> listoder = billDao.getByOrderStatus(st);
		return listoder;
	}

	@PostMapping()
	public Bill create(@RequestBody JsonNode orderData) {
		return billservice.create(orderData);
	}
	
	@PostMapping("payment")
	public Bill createPayment(@RequestBody JsonNode orderData) {
		return billservice.createPayment(orderData);
	}
	
//	@PostMapping("info-order")
//	public OrderGHN infoOrder(@RequestBody JsonNode Data) {
//		return billservice.infoOrder(Data);
//	}

	@PutMapping("/{orderCode}")
	public ResponseEntity<String> updateOrderStatus(@PathVariable String orderCode,
			@RequestBody Map<String, Object> requestBody) {
		Bill bill = billDao.findByOrdercode(orderCode);
		String orderstatus = (String) requestBody.get("orderstatus");
		if (orderstatus.equals("ready_to_pick")) {
			bill.setOrderstatus("chờ lấy hàng");
		} else if (orderstatus.equals("storing")) {
			bill.setOrderstatus("Đã lấy hàng");
		} else if (orderstatus.equals("delivering")) {
			bill.setOrderstatus("Tiến hành giao hàng");
		} else if (orderstatus.equals("delivered")) {
			bill.setOrderstatus("Đã giao hàng");
			bill.setStatus(true);
		} else if (orderstatus.equals("cancel")) {
			bill.setOrderstatus("Đã hủy đơn hàng!");
		}
		billDao.save(bill);
		return null;
	}
	
	@GetMapping("{id}/{ordercode}")
	public Bill updateordercode(@PathVariable("id") Long id, @PathVariable("ordercode") String ordercode) {
		Bill bill = billDao.findById(id).get();
		bill.setOrdercode(ordercode);
		bill.setOrderstatus("Chờ lấy hàng");
		return billDao.save(bill);
	}
	
	@GetMapping("/cancel/{id}")
	public Bill cancel(@PathVariable("id") Long id) {
		Bill bill = billDao.findById(id).get();
		bill.setOrderstatus("Đã hủy đơn");
		return billDao.save(bill);
	}
	
	@GetMapping("status/{username}")
	public List<Bill> findbystatus(@PathVariable("username") String username) {
		return billDao.findByStatus(username);
	}
	
	@GetMapping("{id}")
	public List<Bill> getbillid(@PathVariable("id") String id) {
		return billservice.findUsername(id);
	}
	
	@GetMapping("bill/{id}")
	public Bill getBill(@PathVariable("id") Long id) {
		return billDao.findById(id).get();
	}
	
	@GetMapping("/bill-details/{id}")
	public List<BillDetail> getBillDetails (@PathVariable("id") Long id) {
		return billservice.findByBill(id);
	}
	
	@GetMapping("/thongkeorder")
	public List<OrderStatistic> getTotalOrder(@RequestParam int year) {
		return billservice.countTotalOrdersByMonth(year);
	}
	
	@GetMapping("/getYearRevenue")
	public List<Revenuestatistics> getYearRevenue() {
		return billDao.getYearRevenue();
	}
	
	@GetMapping("/getMonthRevenue")
	public List<Revenuestatistics> getMonthRevenue(@RequestParam("year") int year) {
        List<Revenuestatistics> allMonths = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            allMonths.add(new Revenuestatistics(i, (double) 0));
        }

        List<Revenuestatistics> result = billDao.getMonthRevenue(year);

        Map<Integer, Revenuestatistics> monthMap = new HashMap<>();
        for (Revenuestatistics revenueStatistics : result) {
            monthMap.put(revenueStatistics.getCalendar(), revenueStatistics);
        }

        for (Revenuestatistics month : allMonths) {
            int monthNumber = month.getCalendar();
            if (monthMap.containsKey(monthNumber)) {
                month.setTotalRevenue(monthMap.get(monthNumber).getTotalRevenue());
            }
        }

        return allMonths;
    }
}
