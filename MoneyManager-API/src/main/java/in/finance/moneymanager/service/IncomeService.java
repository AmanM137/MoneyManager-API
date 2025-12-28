package in.finance.moneymanager.service;

import in.finance.moneymanager.dto.IncomeDTO;
import in.finance.moneymanager.entity.CategoryEntity;
import in.finance.moneymanager.entity.IncomeEntity;
import in.finance.moneymanager.entity.ProfileEntity;
import in.finance.moneymanager.repository.CategoryRepository;
import in.finance.moneymanager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final CategoryRepository categoryRepository;
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;

    //Retrieves all incomes for current month/based on the start and end date
    public List<IncomeDTO> getCurrentMonthIncomesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return list.stream().map(this::toDTO).toList();
    }

    //Add new income to the database
    public IncomeDTO addIncome(IncomeDTO incomeDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(incomeDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        IncomeEntity newIncome = toEntity(incomeDTO, profile, category);
        newIncome = incomeRepository.save(newIncome);
        return toDTO(newIncome);
    }

    // ✅ Update existing income
    public IncomeDTO updateIncome(Long id, IncomeDTO incomeDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity existing = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!existing.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized to update this income");
        }

        // Update fields if provided
        if (incomeDTO.getName() != null && !incomeDTO.getName().isBlank()) {
            existing.setName(incomeDTO.getName());
        }
        if (incomeDTO.getAmount() != null && incomeDTO.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            existing.setAmount(incomeDTO.getAmount());
        }
        if (incomeDTO.getDate() != null) {
            existing.setDate(incomeDTO.getDate());
        }
        if (incomeDTO.getIcon() != null && !incomeDTO.getIcon().isBlank()) {
            existing.setIcon(incomeDTO.getIcon());
        }
        if (incomeDTO.getCategoryId() != null) {
            CategoryEntity category = categoryRepository.findById(incomeDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existing.setCategory(category);
        }

        IncomeEntity updated = incomeRepository.save(existing);
        return toDTO(updated);
    }

    //delete income by id for current user
    public void deleteIncome(Long incomeId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity entity = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));
        if (!entity.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized to delete this income");
        }
        incomeRepository.delete(entity);
    }

    //Get latest 5 incomes for current user
    public List<IncomeDTO> getLatest5IncomesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDTO).toList();
    }

    //get total income for current user
    public BigDecimal getTotalIncomeForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal totalIncome = incomeRepository.findTotalIncomeByProfileId(profile.getId());
        return totalIncome != null ? totalIncome : BigDecimal.ZERO;
    }

    //filter income
    public List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> filteredIncomes = incomeRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
                profile.getId(), startDate, endDate, keyword, sort);
        return filteredIncomes.stream().map(this::toDTO).toList();
    }

    //helper methods
    private IncomeEntity toEntity(IncomeDTO incomeDTO, ProfileEntity profile, CategoryEntity category) {
        return IncomeEntity.builder()
                .name(incomeDTO.getName())
                .icon(incomeDTO.getIcon())
                .amount(incomeDTO.getAmount())
                .date(incomeDTO.getDate())
                .profile(profile)
                .category(category)
                .build();
    }

    private IncomeDTO toDTO(IncomeEntity incomeEntity) {
        return IncomeDTO.builder()
                .id(incomeEntity.getId())
                .name(incomeEntity.getName())
                .icon(incomeEntity.getIcon())
                .categoryId(incomeEntity.getCategory() != null ? incomeEntity.getCategory().getId() : null)
                .categoryName(incomeEntity.getCategory() != null ? incomeEntity.getCategory().getName() : "N/A")
                .amount(incomeEntity.getAmount())
                .date(incomeEntity.getDate())
                .createdAt(incomeEntity.getCreatedAt())
                .updatedAt(incomeEntity.getUpdatedAt())
                .build();
    }
}
