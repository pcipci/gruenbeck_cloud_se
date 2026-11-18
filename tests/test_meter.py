import asyncio
from types import SimpleNamespace

import pytest
from homeassistant.exceptions import ServiceValidationError

from custom_components.gruenbeck_cloud_se.coordinator import (
    WATER_METER_HISTORY_SIZE,
    GruenbeckDataUpdateCoordinator as C,
)


class FakeStore:
    def __init__(self):
        self.saved = None

    async def async_save(self, data):
        self.saved = data

    async def async_load(self):
        return self.saved


def make(calculated=4721.0):
    c = SimpleNamespace(
        calculated_water_l=calculated,
        meter_offset_l=None,
        meter_adjustments=[],
        _meter_store=FakeStore(),
        async_update_listeners=lambda: None,
    )
    c.water_meter_reading = lambda: C.water_meter_reading(c)
    return c


def adjust(c, value):
    asyncio.run(C.async_adjust_water_meter(c, value))


def test_unknown_until_adjusted():
    c = make()
    assert C.water_meter_reading(c) is None


def test_first_adjust_and_follow_up():
    c = make(4721.0)
    adjust(c, 124.88)
    assert C.water_meter_reading(c) == 124.88
    assert "deviation_m3" not in c.meter_adjustments[0]
    # 500 L consumed, real meter shows 25 L more than the sensor
    c.calculated_water_l = 5221.0
    assert C.water_meter_reading(c) == 125.38
    adjust(c, 125.405)
    last = c.meter_adjustments[0]
    assert last["deviation_m3"] == 0.025
    assert last["consumed_m3"] == 0.5
    assert last["deviation_percent"] == 5.0
    assert len(c.meter_adjustments) == 2
    assert c.meter_adjustments[1]["entered_m3"] == 124.88  # newest first
    assert c._meter_store.saved["offset_l"] == pytest.approx(125405 - 5221)


def test_meter_exchange_and_limit():
    c = make(1000.0)
    adjust(c, 0.0)  # new meter starts at 0
    assert C.water_meter_reading(c) == 0.0
    c.calculated_water_l = 1100.0
    assert C.water_meter_reading(c) == 0.1
    for i in range(WATER_METER_HISTORY_SIZE + 5):
        adjust(c, float(i))
    assert len(c.meter_adjustments) == WATER_METER_HISTORY_SIZE


def test_adjust_needs_calculated_value():
    c = make(None)
    with pytest.raises(ServiceValidationError):
        adjust(c, 1.0)
    assert c.meter_adjustments == []


def test_load():
    c = make()
    c._meter_store.saved = {"offset_l": 120000, "adjustments": [{"time": "x"}, 5]}
    asyncio.run(C.async_load_water_meter(c))
    assert c.meter_offset_l == 120000 and c.meter_adjustments == [{"time": "x"}]
    c._meter_store.saved = {"offset_l": "bad"}
    asyncio.run(C.async_load_water_meter(c))
    assert c.meter_offset_l is None and c.meter_adjustments == []
