package in.finanace.moneymanager.controller;

import in.finanace.moneymanager.dto.ExpenseDTO;
import in.finanace.moneymanager.dto.FilterDTO;
import in.finanace.moneymanager.dto.IncomeDTO;
import in.finanace.moneymanager.service.ExpenseService;
import in.finanace.moneymanager.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<?> filterTransactions(@RequestBody FilterDTO filter) {
        LocalDate startDate = filter.getStartDate() != null ? filter.getStartDate() : LocalDate.MIN;
        LocalDate endDate = filter.getEndDate() != null ? filter.getEndDate() : LocalDate.now();
        String keyword = filter.getKeyword() != null ? filter.getKeyword() : "";
        String sortField = filter.getSortField() != null ? filter.getSortField() : "date";
        Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortOrder()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortField);
        if("income".equalsIgnoreCase(filter.getType())) {
            List<IncomeDTO> incomes =  incomeService.filterIncomes(startDate, endDate, keyword, sort);
            return ResponseEntity.status(HttpStatus.OK).body(incomes);
        }else if("expense".equalsIgnoreCase(filter.getType())) {
            List<ExpenseDTO> expenses =  expenseService.filterExpenses(startDate, endDate, keyword, sort);
            return ResponseEntity.status(HttpStatus.OK).body(expenses);
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid type. Must be 'income' or 'expense'");
        }
    }
}
