from custom_components.gruenbeck_cloud_se.models import device_features
from types import SimpleNamespace
from custom_components.gruenbeck_cloud_se.binary_sensor import (
    GruenbeckSaltWarningBinarySensor,
)
from custom_components.gruenbeck_cloud_se.sensor import GruenbeckLastRegenerationSensor


class FakeCoordinator:
    def __init__(self, data):
        self.data = data
        self.salt_refills = []

    def record_salt_refill(self, when=None):
        self.salt_refills.append("t")


def salt(data):
    s = GruenbeckSaltWarningBinarySensor.__new__(GruenbeckSaltWarningBinarySensor)
    s.coordinator = FakeCoordinator(data)
    s._was_on = None
    return s


def test_refill_recorded_when_warning_clears():
    s = salt({"msaltrange": False})  # False = not OK -> warning on
    s._track()
    assert s._was_on is True and s.coordinator.salt_refills == []
    s.coordinator.data = {"msaltrange": True}
    s._track()
    assert len(s.coordinator.salt_refills) == 1
    s._track()  # unchanged: no second entry
    assert len(s.coordinator.salt_refills) == 1


def test_no_refill_at_start_without_warning():
    s = salt({"msaltrange": True})
    s._track()
    assert s.coordinator.salt_refills == []


def regen():
    r = GruenbeckLastRegenerationSensor.__new__(GruenbeckLastRegenerationSensor)
    r._steps = []
    r._was_regenerating = False
    r._value = None
    r._last_count = 5
    r._last_capacity = (40, 700)
    r._history = []
    return r


def test_regeneration_steps_in_history():
    r = regen()
    for code in (10, 20, 20, 30, 40, 60):
        r.coordinator = SimpleNamespace(data={"mregstatus": code, "mcountreg": 5})
        r._check_counter()
    assert [s["phase"] for s in r._steps] == [
        "fill_salt_tank",
        "salting",
        "displacement",
        "backwashing",
        "washing_out",
    ]
    r.coordinator = SimpleNamespace(data={"mregstatus": 0, "mcountreg": 6})
    r._check_counter()
    assert len(r._history) == 1
    assert [s["phase"] for s in r._history[0]["steps"]][:2] == [
        "fill_salt_tank",
        "salting",
    ]
    assert r._steps == []


async def test_error_attribute_has_last_error(hass):
    from unittest.mock import MagicMock
    from custom_components.gruenbeck_cloud_se.binary_sensor import (
        GruenbeckErrorBinarySensor,
    )

    coordinator = MagicMock()
    coordinator.device_id = "x"
    coordinator.features = device_features(
        {"series": "softliQ.SE", "type": 121, "_info": {}}
    )
    coordinator.hass = hass
    coordinator.data = {
        "hasError": True,
        "_info": {
            "errors": [
                {
                    "date": "2026-11-01T10:00:00",
                    "isResolved": False,
                    "message": "Fehler 12: Motor Steuerventil",
                }
            ]
        },
    }
    entity = GruenbeckErrorBinarySensor(coordinator)
    entity.hass = hass
    attrs = entity.extra_state_attributes
    assert attrs["last_error"] == "Fehler 12: Motor Steuerventil"
    print(attrs)
