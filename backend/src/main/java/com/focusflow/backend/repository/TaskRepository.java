package com.focusflow.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.focusflow.backend.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
