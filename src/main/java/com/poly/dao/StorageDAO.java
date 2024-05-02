package com.poly.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.poly.entity.Book;
import com.poly.entity.Storage;

public interface StorageDAO extends JpaRepository<Storage, Integer>{

	Storage findByBook(Book book);
}
