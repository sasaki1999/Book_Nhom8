package com.poly.controller;

import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.poly.dao.AccountDAO;
import com.poly.dao.AuthorityDAO;
import com.poly.dao.CartDAO;
import com.poly.dao.RoleDAO;
import com.poly.entity.Account;
import com.poly.entity.Authority;
import com.poly.service.SessionService;
import com.poly.store.service.impl.MailerServiceImpl;

@Controller
public class SignupController {

	@Autowired
	MailerServiceImpl mailer;
	@Autowired
	AccountDAO dao;
	@Autowired
	SessionService session;
	@Autowired
	CartDAO cartdao;
	@Autowired
	RoleDAO rdao;
	@Autowired
	AuthorityDAO audao;
	double mxn = Math.round(Math.random() * 999999) + 111122;

	@RequestMapping("signup")
	public String index(Model model) {
		model.addAttribute("account", new Account());
		return "User/signup";
	}

	@RequestMapping("create")
	public String create(Account account, @RequestParam("email") String email, Model model,
			@RequestParam("phone") String phone, @RequestParam("fullname") String fullname,
			@RequestParam("password") String password, @RequestParam("confirm") String confirm,
			@RequestParam("username") String username) throws IllegalStateException, IOException {



		//Bat loi loi dang ki
		List<Account> all=dao.findAll();
		for (Account account2 : all) {
			if (account2.getUsername().equals(username)) {
				model.addAttribute("account", account);
				model.addAttribute("message", "Tên đăng nhập đã được sử dụng ");
				return "User/signup";
			}
			if (account2.getEmail().equals(email)) {
				model.addAttribute("account", account);
				model.addAttribute("message", "Email đã được sử dụng ");
				return "User/signup";
			}

		}
		if (fullname.isEmpty()) {
			model.addAttribute("account", account);
			model.addAttribute("message", "Vui lòng không bỏ trống Họ Và Tên");
			return "User/signup";
		}
		if (username.isEmpty()) {
			model.addAttribute("account", account);
			model.addAttribute("message", "Vui lòng không bỏ trống Tên Đăng Nhập");
			return "User/signup";
		}
		if (email.isEmpty()) {
			model.addAttribute("account", account);
			model.addAttribute("message", "Vui lòng không bỏ trống Email");
			return "User/signup";
		}
		if (phone.isEmpty()) {
			model.addAttribute("account", account);
			model.addAttribute("message", "Vui lòng không bỏ trống Số Điện Thoại");
			return "User/signup";
		}
		if (password.isEmpty()) {
			model.addAttribute("account", account);
			model.addAttribute("message", "Vui lòng không bỏ trống Mật Khẩu ");
			return "User/signup";
		}
		// Bắt lỗi định dạng email
		String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
		Pattern pattern = Pattern.compile(emailRegex);
		Matcher matcher = pattern.matcher(email);
		if (!matcher.matches()) {
			model.addAttribute("account", account);
			model.addAttribute("message", "Định dạng email không hợp lệ");
			return "User/signup";
		}

		// Bắt lỗi định dạng số điện thoại
		String phoneRegex = "^(\\+84|0)(\\d{9,10})$";
		pattern = Pattern.compile(phoneRegex);
		matcher = pattern.matcher(phone);
		if (!matcher.matches()) {
			model.addAttribute("account", account);
			model.addAttribute("message", "Định dạng số điện thoại không hợp lệ");
			return "User/signup";
		}

		Integer ma = (int) mxn;

		String thongBao = "Chào bạn,\r\n<br>" +
				"\r\n" +
				"Cảm ơn bạn đã đăng ký tài khoản với chúng tôi. Dưới đây là mã OTP (One Time Password) để hoàn tất quá trình đăng ký:\r\n"
				+
				"\r\n" +
				ma + "\r\n" +
				"\r\n <br>" +
				"Vui lòng không chia sẻ mã này với bất kỳ ai khác. Điều này giúp đảm bảo an toàn cho tài khoản của bạn. Mã OTP sẽ hết hiệu lực trong vòng 5 phút.\r\n <br>"
				+
				"\r\n" +
				"Nếu bạn không thực hiện bất kỳ yêu cầu nào, vui lòng liên hệ với chúng tôi ngay lập tức.\r\n <br>" +
				"\r\n" +
				"Trân trọng,\r\n" +
				"RinzBook";

		if (confirm.equals(password)) {
			mailer.send(email, "YÊU CẦU MÃ XÁC NHẬN TỪ NGƯỜI DÙNG!", thongBao);

			session.set("mxn", ma);
			session.set("account", account);

			return "User/confirm";
		} else {
			model.addAttribute("account", account);
			model.addAttribute("message", "Xác nhận mật khẩu không chính xác");
			return "User/signup";
		}
//

	}

	@RequestMapping("confirm")
	public String Confirm(Model model, @RequestParam(value = "confirm", required = false) Integer confirm) {
		Integer ma = session.get("mxn");
		if (confirm == null) {
			model.addAttribute("error", "Vui Lòng Không Để Trống Mã Xác Nhận!");
			return "User/confirm";
		} else {
			if (!confirm.equals(ma)) {
				model.addAttribute("error", "Mã Xác Nhận Không Chính Xác!");
				return "User/confirm";
			} else {
				Account item = session.get("account");
				// item.setCreatedate(new Date());
				model.addAttribute("item", item);
				dao.save(item);
				Authority au = new Authority();
				au.setAccount(item);
				au.setRole(rdao.findById("USER").get());
				audao.save(au);
			}
		}
		return "/security/login";
	}

	@RequestMapping("signin")
	public String signin() {
		return "redirect:/security/login/form";
	}
}
