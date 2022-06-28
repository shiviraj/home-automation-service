package com.automation.service

import com.automation.domain.Device
import com.automation.domain.State
import com.automation.repository.DeviceRepository
import com.automation.testUtils.assertNextWith
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import reactor.core.publisher.Mono

class DeviceServiceTest {
    private val deviceRepository = mockk<DeviceRepository>()
    private val deviceService = DeviceService(deviceRepository)

    @Test
    fun `should update the state of device state`() {
        val device = Device(deviceId = "001", deviceName = "LED_BULB", state = State.OFF)
        every { deviceRepository.findByDeviceId(any()) } returns Mono.just(device)
        every { deviceRepository.save(any()) } returns Mono.just(device)

        val result = deviceService.updateState("001", State.ON)
        assertNextWith(result) {
            it.getState() shouldBe State.ON
            verify(exactly = 1) {
                deviceRepository.findByDeviceId("001")
                deviceRepository.save(device)
            }
        }
    }
}
