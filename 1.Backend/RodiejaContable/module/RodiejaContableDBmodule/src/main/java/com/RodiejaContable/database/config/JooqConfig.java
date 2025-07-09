package com.RodiejaContable.database.config;

import javax.sql.DataSource;

import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;

@Configuration
public class JooqConfig {
    
    @Autowired
    private DataSource dataSource;
    
    @Bean
    public DSLContext dsl() {
        return DSL.using(
            new TransactionAwareDataSourceProxy(dataSource),
            SQLDialect.MYSQL
        );
    }
}
