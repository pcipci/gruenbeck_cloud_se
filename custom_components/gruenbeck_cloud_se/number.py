"""Support for Grünbeck Cloud SE numbers."""
from __future__ import annotations

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, EntityCategory, UnitOfVolume
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .coordinator import GruenbeckDataUpdateCoordinator
from .entity import GruenbeckEntity


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Grünbeck Cloud SE numbers."""
    coordinator: GruenbeckDataUpdateCoordinator = hass.data[DOMAIN][
        config_entry.entry_id
    ]
    entities: list[NumberEntity] = [GruenbeckWaterMeterAdjustNumber(coordinator)]
    if (
        coordinator.features.led_ring
        and (coordinator.data.get("_parameters") or {}).get("pledbright") is not None
    ):
        entities.append(GruenbeckLedBrightnessNumber(coordinator))
    async_add_entities(entities)


class GruenbeckWaterMeterAdjustNumber(GruenbeckEntity, NumberEntity):
    """Enter the reading of the real water meter to adjust the water meter."""

    _attr_entity_category = EntityCategory.CONFIG
    _attr_native_min_value = 0
    _attr_native_max_value = 99999999
    _attr_native_step = 0.001
    _attr_native_unit_of_measurement = UnitOfVolume.CUBIC_METERS
    _attr_mode = NumberMode.BOX
    _attr_icon = "mdi:counter"

    def __init__(self, coordinator: GruenbeckDataUpdateCoordinator) -> None:
        """Initialize the number."""
        super().__init__(coordinator, "water_meter_adjust")

    @property
    def native_value(self) -> float | None:
        """Return the reading shown by the water meter sensor."""
        return self.coordinator.water_meter_reading()

    async def async_set_native_value(self, value: float) -> None:
        """Adjust the water meter to the reading entered."""
        await self.coordinator.async_adjust_water_meter(value)


class GruenbeckLedBrightnessNumber(GruenbeckEntity, NumberEntity):
    """Brightness of the illuminated LED ring."""

    _attr_entity_category = EntityCategory.CONFIG
    _attr_native_min_value = 0
    _attr_native_max_value = 100
    _attr_native_step = 10
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_mode = NumberMode.SLIDER
    _attr_icon = "mdi:led-on"

    def __init__(self, coordinator: GruenbeckDataUpdateCoordinator) -> None:
        """Initialize the number."""
        super().__init__(coordinator, "led_brightness")

    @property
    def native_value(self) -> float | None:
        """Return the LED brightness."""
        return (self.coordinator.data.get("_parameters") or {}).get("pledbright")

    async def async_set_native_value(self, value: float) -> None:
        """Set the LED brightness."""
        await self.coordinator.async_set_parameter("pledbright", int(value))
