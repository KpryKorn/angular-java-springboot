package com.focusflow.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.focusflow.backend.exception.ResourceNotFoundException;
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
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    @Override
    public Task updateTask(Long id, Task taskDetails) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        existingTask.setDone(taskDetails.getDone());
        return taskRepository.save(existingTask);
    }

    @Override
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    @Override
    public Task patchTask(Long id, Task taskDetails) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        if (taskDetails.getTitle() != null) {
            existingTask.setTitle(taskDetails.getTitle());
        }
        if (taskDetails.getDescription() != null) {
            existingTask.setDescription(taskDetails.getDescription());
        }
        if (taskDetails.getDone() != null) {
            existingTask.setDone(taskDetails.getDone());
        }
        return taskRepository.save(existingTask);
    }
}
