package com.poly.entity;


import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;

@SuppressWarnings("serial")
@Data
@Entity
@Table(name = "Import")
public class Import implements Serializable{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;
	@ManyToOne
	@JoinColumn(name = "Bookid")
	Book book;
	Integer quantity;
	@Temporal(TemporalType.TIMESTAMP)
	Date adddate = new Date();
	
}
