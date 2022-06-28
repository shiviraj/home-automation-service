package com.automation.controller

import com.automation.domain.DeviceId
import com.automation.domain.Task
import com.automation.service.DeviceService
import com.automation.service.TaskService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalTime

@RestController
@RequestMapping("/tasks")
class TaskController(private val taskService: TaskService) {
    @GetMapping
    fun getAllTasks(): Flux<Task> {
        return taskService.getAllTask()
    }

    @GetMapping("/{taskId}")
    fun getTask(@PathVariable taskId: String): Mono<Task> {
        return taskService.getTask(taskId)
    }

    @PostMapping
    fun addTask(@RequestBody taskRequest: TaskRequest): Mono<Task> {
        return taskService.addTask(taskRequest)
    }

    @PutMapping("/{taskId}")
    fun updateTask(@PathVariable taskId: String, @RequestBody taskRequest: TaskRequest): Mono<Task> {
        return taskService.updateTask(taskId, taskRequest)
    }

    @DeleteMapping("/{taskId}")
    fun deleteTask(@PathVariable taskId: String): Mono<Task> {
        return taskService.deleteTask(taskId)
    }
}

data class TaskRequest(
    val deviceId: DeviceId,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val startTime: LocalTime,
    val endTime: LocalTime,
    val recurring: List<DayOfWeek>,
)
