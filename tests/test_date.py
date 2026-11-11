from datetime import date, timedelta

import pytest
from homeassistant.exceptions import ServiceValidationError

from custom_components.gruenbeck_cloud_se.date import GruenbeckLastServiceDate


class FakeCoordinator:
    def __init__(self):
        self.service_dates = {}

    async def async_set_service_date(self, kind, value):
        self.service_dates[kind] = value


def make(kind):
    entity = GruenbeckLastServiceDate.__new__(GruenbeckLastServiceDate)
    entity.coordinator = FakeCoordinator()
    entity._kind = kind
    return entity


async def test_past_and_today_are_accepted():
    entity = make("inspection")
    await entity.async_set_value(date.today())
    await entity.async_set_value(date.today() - timedelta(days=100))
    assert entity.coordinator.service_dates["inspection"] == date.today() - timedelta(
        days=100
    )


async def test_future_date_is_rejected():
    entity = make("maintenance")
    with pytest.raises(ServiceValidationError):
        await entity.async_set_value(date.today() + timedelta(days=1))
    assert entity.coordinator.service_dates == {}
