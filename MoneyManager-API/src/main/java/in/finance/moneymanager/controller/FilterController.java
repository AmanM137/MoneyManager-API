package in.finance.moneymanager.controller;

import in.finance.moneymanager.dto.ExpenseDTO;
import in.finance.moneymanager.dto.FilterDTO;
import in.finance.moneymanager.dto.IncomeDTO;
import in.finance.moneymanager.service.ExpenseService;
import in.finance.moneymanager.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    // Apply filters to fetch income or expense transactions.
    @PostMapping
    public ResponseEntity<?> filterTransactions(@RequestBody FilterDTO filter) {
        try {
            // Safely handle empty or blank dates (avoid parsing errors)
            LocalDate startDate = (filter.getStartDate() == null)
                    ? LocalDate.of(1970, 1, 1)
                    : filter.getStartDate();

            LocalDate endDate = (filter.getEndDate() == null)
                    ? LocalDate.now()
                    : filter.getEndDate();

            // Handle optional keyword and sorting
            String keyword = (filter.getKeyword() != null) ? filter.getKeyword().trim() : "";
            String sortField = (filter.getSortField() != null && !filter.getSortField().isBlank())
                    ? filter.getSortField()
                    : "date";
            Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortOrder())
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            Sort sort = Sort.by(direction, sortField);

            // Route to respective services based on type
            if ("income".equalsIgnoreCase(filter.getType())) {
                List<IncomeDTO> incomes = incomeService.filterIncomes(startDate, endDate, keyword, sort);
                return ResponseEntity.ok(incomes);

            } else if ("expense".equalsIgnoreCase(filter.getType())) {
                List<ExpenseDTO> expenses = expenseService.filterExpenses(startDate, endDate, keyword, sort);
                return ResponseEntity.ok(expenses);

            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid type. Must be 'income' or 'expense'.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while filtering transactions: " + e.getMessage());
        }
    }
}
