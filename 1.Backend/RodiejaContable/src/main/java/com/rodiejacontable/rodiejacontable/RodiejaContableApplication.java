package com.rodiejacontable.rodiejacontable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"com.rodiejacontable"})
public class RodiejaContableApplication {

	public static void main(String[] args) {
		SpringApplication.run(RodiejaContableApplication.class, args);
	}

}
