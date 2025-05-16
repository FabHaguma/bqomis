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

}