package com.automation.domain

import com.automation.controller.TaskRequest
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.TypeAlias
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

const val TASK_COLLECTION = "tasks"

@TypeAlias("Task")
@Document(TASK_COLLECTION)
data class Task(
    @Id
    var id: ObjectId? = null,
    @Indexed(unique = true)
    val taskId: String,
    var deviceId: DeviceId,
    var startDate: LocalDate = LocalDate.now(),
    var endDate: LocalDate = LocalDate.now(),
    var startTime: LocalTime = LocalTime.now(),
    var endTime: LocalTime = LocalTime.now(),
    var recurring: List<DayOfWeek> = listOf(LocalDateTime.now().dayOfWeek),
) {
    fun update(taskRequest: TaskRequest) {
        deviceId = taskRequest.deviceId
        startDate = taskRequest.startDate
        endDate = taskRequest.endDate
        startTime = taskRequest.startTime
        endTime = taskRequest.endTime
        recurring = taskRequest.recurring
    }

    companion object {
        fun from(taskId: String, taskRequest: TaskRequest): Task {
            return Task(
                taskId = taskId,
                deviceId = taskRequest.deviceId,
                startDate = taskRequest.startDate,
                endDate = taskRequest.endDate,
                startTime = taskRequest.startTime,
                endTime = taskRequest.endTime,
                recurring = taskRequest.recurring
            )
        }
    }
}

typealias TaskId = String
