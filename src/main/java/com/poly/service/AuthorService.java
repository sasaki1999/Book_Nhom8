package com.poly.service;

import java.util.List;

import com.poly.entity.Author;

public interface AuthorService {
	
	List<Author> findAll();

	Author create(Author author);

	Author update(Author author);

	void delete(Integer id);

	Author findById(Integer id);
}
