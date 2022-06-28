package com.automation.service

import com.automation.controller.TaskRequest
import com.automation.domain.State
import com.automation.domain.Task
import com.automation.repository.TaskRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    private val idGeneratorService: IdGeneratorService,
    private val deviceService: DeviceService,
) {
    fun getAllTask(): Flux<Task> {
        return taskRepository.findAll()
    }

    fun getTask(taskId: String): Mono<Task> {
        return taskRepository.findByTaskId(taskId)
    }

    fun addTask(taskRequest: TaskRequest): Mono<Task> {
        return idGeneratorService.generateId(IdType.TASK_ID).flatMap { taskId ->
            val task = Task.from(taskId, taskRequest)
            taskRepository.save(task)
        }
    }

    fun updateTask(taskId: String, taskRequest: TaskRequest): Mono<Task> {
        return getTask(taskId).flatMap {
            it.update(taskRequest)
            taskRepository.save(it)
        }
    }

    fun deleteTask(taskId: String): Mono<Task> {
        return taskRepository.deleteByTaskId(taskId)
    }

    fun performTasks(): Flux<Task> {
        return getAllTask().flatMap { task ->
            val now = LocalDateTime.now()
            val isDeviceOn = isBetweenDate(now.toLocalDate(), task) && isBetweenTime(now.toLocalTime(), task)
            deviceService.updateState(task.deviceId, State.getState(isDeviceOn))
                .map { task }
        }
    }

    private fun isBetweenTime(now: LocalTime, it: Task) = it.startTime <= now && now < it.endTime
    private fun isBetweenDate(now: LocalDate, it: Task) = it.startDate <= now && now < it.endDate
}
