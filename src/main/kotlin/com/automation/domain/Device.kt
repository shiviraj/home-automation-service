package com.automation.domain

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.TypeAlias
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

const val DEVICE_COLLECTION = "devices"

@TypeAlias("Device")
@Document(DEVICE_COLLECTION)
data class Device(
    @Id
    var id: ObjectId? = null,
    @Indexed(unique = true)
    val deviceId: DeviceId,
    val deviceName: String,
    private var state: State = State.OFF,
    var sensorValue: Int = 0,
) {
    fun updateState(newState: State) {
        state = newState
    }

    fun getState(): State {
        return state
    }

    fun updateSensorValue(sensorValue: Int) {
        this.sensorValue = sensorValue
    }
}

enum class State {
    ON, OFF;

    companion object {
        fun getState(isOn: Boolean): State {
            return if (isOn) ON else OFF
        }
    }
}

typealias DeviceId = String
