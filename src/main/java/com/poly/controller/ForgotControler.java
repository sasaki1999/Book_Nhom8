package com.poly.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.poly.dao.AccountDAO;
import com.poly.entity.Account;
import com.poly.service.AccountService;
import com.poly.service.SessionService;
import com.poly.store.service.impl.MailerServiceImpl;




@Controller
public class ForgotControler {
	
	
	@Autowired
	MailerServiceImpl mailer;
	
	@Autowired
	AccountService accservice;

	@Autowired
	AccountDAO dao;

	@Autowired
	public JavaMailSender emailSender;
	
	@Autowired
	SessionService session;
	
	double mxn = Math.round(Math.random() * 999999) + 1111;
	
	@RequestMapping("/home/forgot")
	public String Login(Model model) {
		return "User/Forgot/Mail";
	}
	
	
	@PostMapping("send")
		public String confirmmk(Model model, @RequestParam("name") String name, @RequestParam("email") String email) {

			String username = name.trim();
			Account acc = accservice.findById(username);
			try {
				if (email.equals(acc.getEmail())) {
					Integer ma = (int) mxn;
					SimpleMailMessage message = new SimpleMailMessage();
					
					message.setTo(email);
					message.setSubject("YÊU CẦU MÃ XÁC NHẬN TỪ NGƯỜI DÙNG!");
					message.setText("MÃ XÁC NHẬN CỦA BẠN LÀ: " + ma + " \nVUI LÒNG KHÔNG CHIA SẺ MÃ NÀY CHO NGƯỜI KHÁC! \nXIN CẢM ƠN!");

					// Send Message!
					this.emailSender.send(message);
					session.set("email", email);

					model.addAttribute("message", "Gửi email thành công");
					return "User/Forgot/ConfirmMxn";
				} else {
					model.addAttribute("message", "Email không khớp với email đã đăng kí ");
					return "User/Forgot/Mail";
				}
			} catch (Exception e) {
				return e.getMessage();
			}
	}
	
	@RequestMapping("confirmM")
	public String ConfirmM(Model model, @RequestParam("confirmM") Integer confirmM) {
		Integer ma = (int) mxn;
		if (confirmM == null) {
			model.addAttribute("error", "Mã Xác Nhận Không Chính Xác!");
		} else {
			if (!confirmM.equals(ma)) {
				model.addAttribute("error", "Mã Xác Nhận Không Chính Xác!");
			} else {
				return "User/Forgot/forgotPW";
			}
		}
		return "User/Forgot/ConfirmMxn";
	}
	
	@RequestMapping("update")
	public String update(Model model, Account item, @RequestParam("newPW") String newpw, @RequestParam("newPWCF") String newpwcf)
			throws IllegalStateException, IOException {
		if(!newpw.equals(newpwcf)) {
			model.addAttribute("error", "Xác Nhận Mật Khẩu Không Chính Xác!");
		} else {
			item = dao.findByEmail(session.get("email"));
			if(item==null) {model.addAttribute("error", "Email của bạn không tồn tại!");
			} else {
				item.setPassword(newpw);
				dao.save(item);
				model.addAttribute("error", "Đổi mật khẩu thành công!");
			}
		}
		return "User/Forgot/forgotPW";
	}
}