from datetime import date, timedelta
from types import SimpleNamespace
from custom_components.gruenbeck_cloud_se.sensor import GruenbeckSaltTotalSensor
from custom_components.gruenbeck_cloud_se.coordinator import (
    GruenbeckDataUpdateCoordinator,
)


def daily(c, kind):
    return GruenbeckDataUpdateCoordinator.daily_values(c, kind)


def make(entries, days=None):
    s = GruenbeckSaltTotalSensor.__new__(GruenbeckSaltTotalSensor)
    s.coordinator = SimpleNamespace(data={"_salt": entries}, salt_days={})
    s._total = 0.0
    s._days = dict(days or {})
    s._store = None
    s._loaded = True
    return s


def test_counting():
    d = lambda i: (date.today() - timedelta(days=i)).isoformat()
    s = make([{"date": d(2) + "T00:00:00", "value": 400}, {"date": d(1), "value": 0}])
    s._count_new_days()
    assert s._total == 400 and s.native_value == 0.4
    # same data again: no double counting
    s._count_new_days()
    assert s._total == 400
    # cloud drops old day, adds a new one, revises yesterday upward
    s.coordinator.data = {
        "_salt": [{"date": d(1), "value": 100}, {"date": d(0), "value": 300}]
    }
    s._count_new_days()
    assert s._total == 800
    # remembered days survive when the cloud drops them
    s.coordinator.salt_days = s._days
    s.coordinator.data = {"_salt": []}
    entries = daily(s.coordinator, "salt")
    assert len(entries) == 3


def test_lime_total():
    from custom_components.gruenbeck_cloud_se.sensor import GruenbeckLimeTotalSensor

    d = lambda i: (date.today() - timedelta(days=i)).isoformat()
    s = GruenbeckLimeTotalSensor.__new__(GruenbeckLimeTotalSensor)
    s.coordinator = SimpleNamespace(
        data={
            "_water": [
                {"date": d(2), "value": 140, "limeRetained": 37.5},
                {"date": d(1), "value": 120, "limeRetained": 32.5},
            ]
        },
        lime_days={},
    )
    s._total = 0.0
    s._days = {}
    s._store = None
    s._loaded = True
    s._count_new_days()
    assert s.native_value == 0.07
    s.coordinator.lime_days = s._days
    assert {e["date"]: e["value"] for e in daily(s.coordinator, "lime")} == {
        d(2): 37.5,
        d(1): 32.5,
    }
