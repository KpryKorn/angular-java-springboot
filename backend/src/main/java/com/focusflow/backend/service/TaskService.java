package com.focusflow.backend.service;

import java.util.List;

import com.focusflow.backend.model.Task;

public interface TaskService {
    List<Task> getAllTasks();

    Task createTask(Task task);

    Task getTaskById(Long id);

    Task updateTask(Long id, Task task);

    Task patchTask(Long id, Task task);

    void deleteTask(Long id);
}
