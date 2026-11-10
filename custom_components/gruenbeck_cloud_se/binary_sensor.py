"""Support for Grünbeck Cloud SE binary sensors."""
from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .coordinator import SALT_REFILL_HISTORY_SIZE, GruenbeckDataUpdateCoordinator
from .entity import GruenbeckEntity
from .sensor import _latest_error


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Grünbeck Cloud SE binary sensors."""
    coordinator: GruenbeckDataUpdateCoordinator = hass.data[DOMAIN][
        config_entry.entry_id
    ]

    entities: list[BinarySensorEntity] = [
        GruenbeckErrorBinarySensor(coordinator),
        GruenbeckRegenerationRunningBinarySensor(coordinator),
        GruenbeckNoDataChangeBinarySensor(coordinator),
    ]
    # The softliQ SE18 has no salt level sensor
    if coordinator.features.salt_sensor:
        entities.append(GruenbeckSaltWarningBinarySensor(coordinator))

    async_add_entities(entities)


class GruenbeckErrorBinarySensor(GruenbeckEntity, BinarySensorEntity):
    """Binary sensor for Grünbeck device error state."""

    _attr_device_class = BinarySensorDeviceClass.PROBLEM

    def __init__(self, coordinator: GruenbeckDataUpdateCoordinator) -> None:
        """Initialize the error sensor."""
        super().__init__(coordinator, "has_error")

    @property
    def is_on(self) -> bool | None:
        """Return true if the device is in an error state."""
        return self.coordinator.data.get("hasError")

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return the text of the last error, e.g. for notifications."""
        attributes = super().extra_state_attributes or {}
        info = (self.coordinator.data or {}).get("_info")
        return {**attributes, "last_error": _latest_error(info)}


class GruenbeckSaltWarningBinarySensor(
    GruenbeckEntity, RestoreEntity, BinarySensorEntity
):
    """Binary sensor for Grünbeck salt range warning.

    The warning going away means that salt was refilled; the coordinator
    keeps those times (also entered with the button) and the sensor shows
    them in the refills attribute.
    """

    _attr_device_class = BinarySensorDeviceClass.PROBLEM

    def __init__(self, coordinator: GruenbeckDataUpdateCoordinator) -> None:
        """Initialize the salt warning sensor."""
        super().__init__(coordinator, "salt_warning")
        self._was_on: bool | None = None

    async def async_added_to_hass(self) -> None:
        """Restore the refill times of earlier versions and the last state."""
        await super().async_added_to_hass()
        if (state := await self.async_get_last_state()) is not None:
            refills = state.attributes.get("refills")
            if isinstance(refills, list) and not self.coordinator.salt_refills:
                self.coordinator.salt_refills = [str(r) for r in refills][
                    -SALT_REFILL_HISTORY_SIZE:
                ]
            if state.state in ("on", "off"):
                self._was_on = state.state == "on"
        self._track()

    def _track(self) -> None:
        """Record the time when the warning goes away."""
        on = self.is_on
        if on is None:
            return
        if self._was_on and not on:
            self.coordinator.record_salt_refill()
        self._was_on = on

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        self._track()
        super()._handle_coordinator_update()

    @property
    def is_on(self) -> bool | None:
        """Return true if there is a salt range issue."""
        val = self.coordinator.data.get("msaltrange")
        if val is None:
            return None
        # If it is a boolean, True usually means OK. So problem (is_on) = not OK.
        if isinstance(val, bool):
            return not val
        return False

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return the description and the refill times."""
        return {
            **(super().extra_state_attributes or {}),
            "refills": list(self.coordinator.salt_refills),
        }


class GruenbeckRegenerationRunningBinarySensor(GruenbeckEntity, BinarySensorEntity):
    """Binary sensor showing a running regeneration (at polling resolution)."""

    _attr_device_class = BinarySensorDeviceClass.RUNNING

    def __init__(self, coordinator: GruenbeckDataUpdateCoordinator) -> None:
        """Initialize the regeneration sensor."""
        super().__init__(coordinator, "regeneration_running")

    @property
    def is_on(self) -> bool | None:
        """Return true if a regeneration step is active."""
        val = self.coordinator.data.get("mregstatus")
        if val is None:
            return None
        try:
            return int(val) != 0
        except (TypeError, ValueError):
            return None


# A household uses water at least once a day, so unchanged data means
# either nobody is home or the cloud stopped delivering (device error,
# rate limiting)
NO_CHANGE_AFTER = timedelta(hours=24)
# Only judge while polls succeed, otherwise the cloud is simply unreachable
POLL_MAX_AGE = timedelta(hours=1)


class GruenbeckNoDataChangeBinarySensor(GruenbeckEntity, BinarySensorEntity):
    """On if polls succeed but the device data has not changed for a day."""

    # No problem class: it can also just mean that nobody is home
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: GruenbeckDataUpdateCoordinator) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator, "no_data_change")

    @property
    def is_on(self) -> bool | None:
        """Return true if no device value changed recently."""
        last_change = self.coordinator.last_data_change
        last_poll = self.coordinator.last_poll
        if last_change is None or last_poll is None:
            return None
        now = dt_util.utcnow()
        return now - last_poll < POLL_MAX_AGE and now - last_change > NO_CHANGE_AFTER

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return the description and the time of the last data change."""
        attributes = super().extra_state_attributes or {}
        return {**attributes, "since": self.coordinator.last_data_change}
