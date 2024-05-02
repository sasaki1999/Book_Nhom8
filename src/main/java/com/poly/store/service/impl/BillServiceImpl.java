package com.poly.store.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.poly.dao.BillDAO;
import com.poly.dao.BillDetailDAO;
import com.poly.entity.Account;
import com.poly.entity.Bill;
import com.poly.entity.BillDetail;
import com.poly.entity.OrderGHN;
import com.poly.entity.OrderStatistic;
import com.poly.service.BillService;
import com.poly.service.SessionService;

@Service
public class BillServiceImpl implements BillService {
	@Autowired
	BillDAO billdao;
	@Autowired
	BillDetailDAO detaildao;
	@Autowired
	SessionService session;

	@Override
	public List<Bill> findAll() {
		return billdao.findAll();
	}

	@Override
	public Bill update(Bill bill) {

		return billdao.save(bill);
	}

	@Override
	public Bill getOne(Long orderId) {
		return billdao.getOne(orderId);
	}

	@Override
	public void save(Bill bill) {
		billdao.save(bill);
	}

	@Override
	public List<Bill> findByAccount(Account account) {

		return billdao.findByAccount(account);
	}

	@Override
	public Bill create(JsonNode orderData) {
		ObjectMapper mapper = new ObjectMapper();

		Bill bill = mapper.convertValue(orderData, Bill.class);

		billdao.save(bill);

		TypeReference<List<BillDetail>> type = new TypeReference<List<BillDetail>>() {
		};
		List<BillDetail> details = mapper.convertValue(orderData.get("billdetails"), type).stream()
				.peek(d -> d.setBill(bill)).collect(Collectors.toList());
		detaildao.saveAll(details);

		return bill;
	}

	@Override
	public Bill createPayment(JsonNode orderData) {
		ObjectMapper mapper = new ObjectMapper();

		Bill bill = mapper.convertValue(orderData, Bill.class);
		TypeReference<List<BillDetail>> type = new TypeReference<List<BillDetail>>() {
		};
		List<BillDetail> details = mapper.convertValue(orderData.get("billdetails"), type).stream()
				.peek(d -> d.setBill(bill)).collect(Collectors.toList());
		session.set("billPayment", bill);
		session.set("detailsPayment", details);
		return bill;
	}

	@Override
	public Bill findById(Long id) {
		return billdao.findById(id).get();
	}

	@Override
	public List<BillDetail> findByBill(Long id) {
		return detaildao.findByBill(billdao.findById(id).get());
	}

	@Override
	public OrderGHN infoOrder(JsonNode data) {
		ObjectMapper mapper = new ObjectMapper();
		OrderGHN orderghn = mapper.convertValue(data, OrderGHN.class);
		session.set("order", orderghn);
		return orderghn;
	}

	@Override
	public List<Bill> findUsername(String id) {
		return billdao.findUsername(id);
	}

	@Override
	public List<OrderStatistic> countTotalOrdersByMonth(int year) {
		List<Object[]> results = billdao.countTotalOrdersByMonth(year);

		List<OrderStatistic> statistics = new ArrayList<>();
		int currentMonth = 1;

		for (Object[] result : results) {
			int month = (int) result[0];
			long totalOrders = (long) result[1];

			while (currentMonth <= 12) {
				if (currentMonth == month) {
					statistics.add(new OrderStatistic(month, totalOrders));
					currentMonth++;
					break;
				} else {
					statistics.add(new OrderStatistic(currentMonth, 0));
					currentMonth++;
				}
			}
		}
		return statistics;
	}
}
