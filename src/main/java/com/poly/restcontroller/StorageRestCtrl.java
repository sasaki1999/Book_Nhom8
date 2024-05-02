package com.poly.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dao.BookDAO;
import com.poly.dao.StorageDAO;
import com.poly.entity.Storage;

@RestController
@RequestMapping("/rest/storage")
public class StorageRestCtrl {
	
	@Autowired
	StorageDAO stdao;
	
	@Autowired
	BookDAO bookdao;
	
	@GetMapping("{id}")
	public Storage getBookStorage(@PathVariable("id") Integer id) {
		return stdao.findByBook(bookdao.findById(id).get());
	}
	
	@PutMapping("{id}")
	public Storage putBook(@PathVariable("id") Integer id, @RequestBody Storage storage) {
		return stdao.save(storage);
	}
}
