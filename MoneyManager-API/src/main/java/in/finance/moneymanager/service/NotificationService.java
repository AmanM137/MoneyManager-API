package in.finance.moneymanager.service;

import in.finance.moneymanager.dto.ExpenseDTO;
import in.finance.moneymanager.entity.ProfileEntity;
import in.finance.moneymanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;

    @Scheduled(cron = "0 0 22 * * *", zone = "IST")
    //@Scheduled(cron = "0 * * * * *", zone = "IST")
    public void sendDailyIncomeExpenseReminder() {
        log.info("Sending Daily Income Expense Reminder");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for (ProfileEntity profile : profiles) {
            String body = "Hi " + profile.getFullName() + ",<br><br>"
                    + "THis is a friendly reminder to add your income and expenses for today in Money Manager.<br><br>"
                    + "<a href="+frontendUrl+" style='display:inline-block;padding:10px 20px;background-color:#4CAF50;color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;'>Go to Money Manager</a>"
                    + "<br><br>Best regards,<br>Money Manager Team";

            emailService.sendEmail(profile.getEmail(),"Daily reminder: Add your income and expenses", body);
        }
        log.info("Daily Income Expense Reminder has been sent");
    }

    @Scheduled(cron = "0 0 23 * * *", zone = "IST")
    public void sendDailyExpenseSummary() {
        log.info("Sending Daily Expense Summary");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for (ProfileEntity profile : profiles) {
            List<ExpenseDTO> todaysExpenses = expenseService.getExpensesForUserOnDate(profile.getId(), LocalDate.now(ZoneId.of("Asia/Kolkata")));
            if (!todaysExpenses.isEmpty()) {
                StringBuilder table = new StringBuilder();
                table.append("<table style='border-collapse:collapse;width:100%;'>");
                table.append("<tr style='background-color:#f2f2f2;'><th style='border:1px solid #add;padding:8px;'>Sl.No</th><th style='border:1px solid #add;padding:8px;'>Name</th><th style='border:1px solid #add;padding:8px;'>Amount</th><th style='border:1px solid #add;padding:8px;'>Category</th></tr>");
                int i = 1;
                for (ExpenseDTO expense : todaysExpenses) {
                    table.append("<tr>");
                    table.append("<td style='border:1px solid #add;padding:8px;'>").append(i++).append("</td>");
                    table.append("<td style='border:1px solid #add;padding:8px;'>").append(expense.getName()).append("</td>");
                    table.append("<td style='border:1px solid #add;padding:8px;'>'").append(expense.getAmount()).append("</td>");
                    table.append("<td style='border:1px solid #add;padding:8px;'>'").append(expense.getCategoryId() != null ? expense.getCategoryName() : "N/A").append("</td>");
                    table.append("</tr>");
                }
                table.append("</table>");
                String body = "Hi "+profile.getFullName()+",<br/><br/> Here is a summary of your expenses for today:<br/><br/>"+table+"<br/><br/>Best regards,<br/>Money Manager Team";
                emailService.sendEmail(profile.getEmail(),"Your daily Expense Summary", body);
            }
        }
        log.info("Daily Expense Summary has been sent");
    }
}
