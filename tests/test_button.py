from datetime import date
from custom_components.gruenbeck_cloud_se.button import GruenbeckServiceDoneButton


class FakeCoordinator:
    def __init__(self):
        self.service_dates = {
            "maintenance": date(2026, 1, 1),
            "inspection": date(2026, 1, 1),
        }

    async def async_set_service_date(self, kind, value):
        self.service_dates[kind] = value


def make(kind):
    b = GruenbeckServiceDoneButton.__new__(GruenbeckServiceDoneButton)
    b.coordinator = FakeCoordinator()
    b._kind = kind
    return b


async def test_maintenance_resets_inspection():
    b = make("maintenance")
    await b.async_press()
    today = date.today()
    assert b.coordinator.service_dates == {"maintenance": today, "inspection": today}


async def test_inspection_alone_keeps_maintenance():
    b = make("inspection")
    await b.async_press()
    assert b.coordinator.service_dates == {
        "maintenance": date(2026, 1, 1),
        "inspection": date.today(),
    }
