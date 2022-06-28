package com.automation.repository

import com.automation.domain.Device
import com.automation.domain.DeviceId
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface DeviceRepository : ReactiveCrudRepository<Device, DeviceId> {
    fun findByDeviceId(deviceId: DeviceId): Mono<Device>
}
