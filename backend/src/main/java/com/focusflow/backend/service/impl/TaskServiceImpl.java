package com.focusflow.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.focusflow.backend.model.Task;
import com.focusflow.backend.repository.TaskRepository;
import com.focusflow.backend.service.TaskService;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
