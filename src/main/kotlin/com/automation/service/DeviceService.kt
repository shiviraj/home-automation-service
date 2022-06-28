package com.automation.service

import com.automation.domain.Device
import com.automation.domain.DeviceId
import com.automation.domain.State
import com.automation.repository.DeviceRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class DeviceService(private val deviceRepository: DeviceRepository) {
    fun updateState(deviceId: String, state: State): Mono<Device> {
        return deviceRepository.findByDeviceId(deviceId).flatMap {
            it.updateState(state)
            deviceRepository.save(it)
        }
    }

    fun updateSensorValue(sensorId: DeviceId, sensorValue: Int): Mono<Device> {
        return deviceRepository.findByDeviceId(sensorId).flatMap {
            it.updateSensorValue(sensorValue)
            deviceRepository.save(it)
        }
    }

}
