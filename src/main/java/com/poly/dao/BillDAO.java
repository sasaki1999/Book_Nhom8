package com.poly.dao;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.poly.entity.Account;
import com.poly.entity.Bill;
import com.poly.entity.Report;
import com.poly.entity.Revenuestatistics;

import java.math.BigDecimal;

public interface BillDAO extends JpaRepository<Bill, Long> {

	@Query("SELECT o FROM Bill o Where o.account.username = ?1 ORDER BY createdate DESC")
	List<Bill> findUsername(String username);

	List<Bill> findByAccount(Account account);

	@Query("SELECT COUNT(o) FROM Bill o")
	Integer countBill();

	@Query("SELECT COUNT(o) FROM Bill o WHERE o.status.id = ?1")
	long countOrdersWithStatus(Integer id);

	@Query("SELECT o FROM Bill o WHERE o.status.id = ?1 OR o.status.id = ?2")
	List<Bill> stautus12(Integer id, Integer id2);

	@Query("SELECT b FROM Bill b WHERE CAST(b.createDate AS date) = CAST(GETDATE() AS date)")
	List<Bill> findBillsCreatedToday();

	@Query("SELECT SUM(b.billtotal) FROM Bill b WHERE CAST(b.createDate AS date) = CAST(GETDATE() AS date)")
	BigDecimal getTotalAmountOfOrdersPlacedToday();

	@Query("SELECT SUM(o.billtotal) FROM Bill o WHERE o.status = true AND YEAR(o.createDate) = YEAR(GETDATE())")
	Double calculateTotalAmountForAllOrders();

	@Query("SELECT c FROM Bill c WHERE c.createDate < GETDATE() ORDER BY c.createDate DESC")
	List<Bill> getProductsSortedByDate();
	
	@Query("SELECT b FROM Bill b ORDER BY b.createDate DESC")
	List<Bill> findAllOrderByCreateDateDesc();

	@Query("SELECT NEW Report(b.createDate, a.fullname, COUNT(*), SUM(b.billtotal)) " + "FROM Bill b "
			+ "JOIN Account a ON b.account.username = a.username " + "WHERE b.createDate >= ?1 AND b.createDate <= ?2 "
			+ "GROUP BY b.createDate, a.fullname " + "ORDER BY SUM(b.billtotal) DESC")
	List<Report> getReportData(Date startDate, Date endDate);

	Bill findByOrdercode(String ordercode);

	@Query(value = "SELECT * FROM Bills b WHERE b.userid = ?1 AND b.orderstatus NOT IN (N'Đã hủy đơn', N'Chờ xác nhận', N'Đã giao hàng')", nativeQuery = true)
	List<Bill> findByStatus(String username);

	@Query("SELECT MONTH(b.createDate) as month, COUNT(b.id) as totalOrders " + "FROM Bill b "
			+ "WHERE YEAR(b.createDate) = :year " + "GROUP BY MONTH(b.createDate) " + "ORDER BY month ASC")
	List<Object[]> countTotalOrdersByMonth(@Param("year") int year);

	@Query("SELECT MONTH(b.createDate) as month, YEAR(b.createDate) as year, COALESCE(SUM(b.billtotal), 0) as totalAmount "
			+ "FROM Bill b " + "WHERE YEAR(b.createDate) = :year "
			+ "GROUP BY MONTH(b.createDate), YEAR(b.createDate) " + "ORDER BY YEAR(b.createDate), MONTH(b.createDate)")
	List<Object[]> getTotalAmountByMonthAndYear(@Param("year") int year);
	
	@Query("SELECT COUNT(b) FROM Bill b WHERE b.orderstatus = :orderStatus")
	Long countByOrderStatus(@Param("orderStatus") String orderStatus);
	
	@Query("SELECT b FROM Bill b WHERE b.orderstatus = :orderStatus")
	List<Bill> getByOrderStatus(@Param("orderStatus") String orderStatus);
	
	@Query("SELECT NEW Revenuestatistics(YEAR(o.createDate), SUM(o.billtotal)) FROM Bill o WHERE o.status = true GROUP BY YEAR(o.createDate)")
	List<Revenuestatistics> getYearRevenue();
	
	@Query("SELECT NEW Revenuestatistics(MONTH(o.createDate), SUM(o.billtotal)) FROM Bill o WHERE o.status = true AND YEAR(o.createDate) = :year GROUP BY MONTH(o.createDate)")
	List<Revenuestatistics> getMonthRevenue(@Param("year") int year);

}
