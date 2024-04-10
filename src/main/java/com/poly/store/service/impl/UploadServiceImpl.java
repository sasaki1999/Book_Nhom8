package com.poly.store.service.impl;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.poly.service.UploadService;

@Service
public class UploadServiceImpl implements UploadService {
	@Autowired
	HttpServletRequest request;
	@Autowired
	ServletContext app;

	@Override
	public File save(MultipartFile file, String folder) {

		try {
			Resource resource = new ClassPathResource("/static/images/");
			String path = resource.getFile().getAbsolutePath() +"/";
			System.out.println(path);
			File dir = new File(path + folder);
			if (!dir.exists()) {
				dir.mkdirs();
			}
			String s = System.currentTimeMillis() + file.getOriginalFilename();
			String name = Integer.toHexString(s.hashCode()) + s.substring(s.lastIndexOf("."));
			try {
				File savedFile = new File(dir, name);
				file.transferTo(savedFile);
				System.out.println(dir + "dir" + name + "name" + savedFile.getAbsolutePath());
				return savedFile;
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		;
		return null;

	}
}
