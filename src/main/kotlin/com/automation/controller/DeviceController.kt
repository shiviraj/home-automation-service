package com.automation.controller

import com.automation.domain.Device
import com.automation.domain.DeviceId
import com.automation.domain.State
import com.automation.service.DeviceService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import java.awt.Taskbar
import java.util.*

@RestController
@RequestMapping("/devices")
class DeviceController(@Autowired private val deviceService: DeviceService) {
    @PostMapping("/{deviceId}/{state}")
    fun controlDevice(@PathVariable deviceId: String, @PathVariable state: String): Mono<Device> {
        return deviceService.updateState(deviceId, State.valueOf(state.uppercase(Locale.getDefault())))
    }

    @PutMapping("/sensor/{sensorId}/{value}")
    fun updateSensorValue(@PathVariable sensorId: DeviceId, @PathVariable value: Int): Mono<Device> {
        return deviceService.updateSensorValue(sensorId, value)
    }
}
