package com.bqomis.repository;

import com.bqomis.model.Appointment;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
        // Additional query methods can be defined here if needed

        @Query("SELECT a FROM Appointment a WHERE a.date = :anyDate AND a.branchServiceId IN :branchServiceIds")
        List<Appointment> findAppointmentsByDateAndBranchServiceIds(
                        @Param("anyDate") LocalDate anyDate,
                        @Param("branchServiceIds") List<Long> branchServiceIds);

        @Query("SELECT a FROM Appointment a WHERE a.date = :anyDate")
        List<Appointment> findAppointmentsByDate(@Param("anyDate") LocalDate anyDate);

        @Query("SELECT a FROM Appointment a WHERE a.date = :anyDate AND a.branchServiceId = :branchServiceId")
        List<Appointment> findAppointmentsByDateAndBranchServiceId(
                        @Param("anyDate") LocalDate anyDate,
                        @Param("branchServiceId") Long branchServiceId);

        @Query("SELECT a FROM Appointment a WHERE a.userId = :userId")
        List<Appointment> findAppointmentsByUserId(@Param("userId") Long userId);

        @Query("SELECT a FROM Appointment a WHERE a.date BETWEEN :startDate AND :endDate")
        List<Appointment> findAppointmentsByPeriod(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT a FROM Appointment a WHERE a.date BETWEEN :startDate AND :endDate AND a.branchServiceId IN :branchServiceIds")
        List<Appointment> findAppointmentsByPeriodAndBranchServiceIds(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate, @Param("branchServiceIds") List<Long> branchServiceIds);

        @Query("SELECT a FROM Appointment a WHERE a.date <= :beforeOrEqualDate")
        List<Appointment> findAppointmentsBeforeOrEqualDate(@Param("beforeOrEqualDate") LocalDate beforeOrEqualDate);

        @Query("SELECT a FROM Appointment a WHERE a.date >= :afterOrEqualDate")
        List<Appointment> findAppointmentsAfterOrEqualDate(@Param("afterOrEqualDate") LocalDate afterOrEqualDate);

        @Query("SELECT a FROM Appointment a WHERE a.date >= :afterDate AND  a.branchServiceId IN :branchServiceIds")
        List<Appointment> findAppointmentsByDateAfterAndBranchServiceIds(
                        @Param("afterDate") LocalDate afterDate,
                        @Param("branchServiceIds") List<Long> branchServiceIds);

        @Query("SELECT a FROM Appointment a WHERE a.date <= :beforeDate AND  a.branchServiceId IN :branchServiceIds")
        List<Appointment> findAppointmentsByDateBeforeAndBranchServiceIds(
                        @Param("beforeDate") LocalDate beforeDate,
                        @Param("branchServiceIds") List<Long> branchServiceIds);

        @Query("SELECT a FROM Appointment a WHERE a.date >= :startDate AND a.date <= :endDate")
        List<Appointment> findAppointmentsByDateRange(
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);
}