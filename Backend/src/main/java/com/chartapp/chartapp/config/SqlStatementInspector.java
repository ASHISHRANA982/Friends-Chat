package com.chartapp.chartapp.config;

import org.hibernate.resource.jdbc.spi.StatementInspector;

public class SqlStatementInspector implements StatementInspector {

    @Override
    public String inspect(String sql) {

        String query = sql.trim().toLowerCase();

        if (query.startsWith("insert")
                || query.startsWith("update")
                || query.startsWith("delete")) {

            System.out.println("SQL: " + sql);
        }

        return sql;
    }
}