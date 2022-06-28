package com.automation.repository

import com.automation.domain.Device
import com.automation.domain.DeviceId
import com.automation.domain.Task
import com.automation.domain.TaskId
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface TaskRepository : ReactiveCrudRepository<Task, TaskId> {
    fun findByTaskId(taskId: TaskId): Mono<Task>
    fun deleteByTaskId(taskId: TaskId): Mono<Task>
}
