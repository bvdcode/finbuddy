"use client";

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ViewHeader } from "@/components/common/ViewHeader";
import { formatMoney, formatMonth } from "@/lib/client/format";
import type { MonthSummary } from "@/lib/client/finance-model";
import { ExpenseCell } from "./ExpenseCell";

interface DataViewProps {
  months: MonthSummary[];
}

export function DataView({ months }: DataViewProps) {
  const { t } = useTranslation();
  const categories = new Map<string, string>();
  months.forEach((month) => {
    month.categories.forEach((category) => {
      categories.set(category.categoryKey, category.categoryLabel);
    });
  });
  const rows = [...categories.entries()].sort((left, right) =>
    left[1].localeCompare(right[1], "ru"),
  );

  return (
    <>
      <ViewHeader
        eyebrow={t("data.eyebrow")}
        title={t("data.title")}
        description={t("data.description")}
      />
      <Card>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <TableContainer>
            <Table
              size="small"
              aria-label={t("data.tableLabel")}
              sx={{ minWidth: Math.max(760, months.length * 150) }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      bgcolor: "background.paper",
                    }}
                  >
                    {t("data.category")}
                  </TableCell>
                  {months.map((month) => (
                    <TableCell align="right" key={month.periodMonth}>
                      {formatMonth(month.periodMonth, "short")}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(([categoryKey, categoryLabel]) => (
                  <TableRow key={categoryKey} hover>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        position: "sticky",
                        left: 0,
                        zIndex: 1,
                        bgcolor: "background.paper",
                        fontWeight: 650,
                      }}
                    >
                      {categoryLabel}
                    </TableCell>
                    {months.map((month) => {
                      const category = month.categories.find(
                        (item) => item.categoryKey === categoryKey,
                      );
                      return (
                        <TableCell align="right" key={month.periodMonth}>
                          {category ? (
                            <ExpenseCell
                              key={
                                category.expense.id +
                                ":" +
                                category.expense.amountMinor
                              }
                              expense={category.expense}
                              label={t("data.editLabel", {
                                category: categoryLabel,
                                month: formatMonth(month.periodMonth),
                              })}
                            />
                          ) : (
                            <Typography color="text.secondary">
                              {t("data.notSet")}
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      bgcolor: "background.paper",
                      fontWeight: 750,
                    }}
                  >
                    {t("data.total")}
                  </TableCell>
                  {months.map((month) => (
                    <TableCell
                      align="right"
                      key={month.periodMonth}
                      sx={{ fontWeight: 750 }}
                    >
                      {formatMoney(month.expenseMinor)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}
