import pathlib
import shutil
from datetime import timedelta

from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    async_fire_time_changed,
    async_mock_service,
)

# The blueprint shipped with the integration
BP = (
    pathlib.Path(__file__).parent.parent
    / "custom_components/gruenbeck_cloud_se/blueprints/gruenbeck_softener_notifications.yaml"
)


async def setup(hass, lang="de", home=False, **inputs):
    d = pathlib.Path(hass.config.path("blueprints/automation/gb"))
    d.mkdir(parents=True, exist_ok=True)
    shutil.copy(BP, d / "n.yaml")
    calls = async_mock_service(hass, "test", "notify")
    base = {
        "language": lang,
        "only_when_home": home,
        "notify": [
            {
                "action": "test.notify",
                "data": {
                    "title": "{{ title }}",
                    "message": "{{ message }}",
                    "event": "{{ event }}",
                },
            }
        ],
    }
    base.update(inputs)
    assert await async_setup_component(
        hass,
        "automation",
        {"automation": {"use_blueprint": {"path": "gb/n.yaml", "input": base}}},
    )
    await hass.async_block_till_done()
    st = hass.states.async_all("automation")
    assert st and st[0].state == "on", st
    return calls


def later_at(hass, when):
    async_fire_time_changed(hass, when)


def later(hass, minutes):
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=minutes))


async def test_error_de(hass):
    hass.states.async_set(
        "binary_sensor.err", "off", {"last_error": "Fehler 12: Motor Steuerventil"}
    )
    calls = await setup(hass, device_error="binary_sensor.err")
    hass.states.async_set(
        "binary_sensor.err", "on", {"last_error": "Fehler 12: Motor Steuerventil"}
    )
    await hass.async_block_till_done()
    assert not calls
    later(hass, 6)
    await hass.async_block_till_done()
    assert len(calls) == 1
    print(calls[0].data)
    assert calls[0].data["message"].startswith("Störung: Fehler 12")
    assert calls[0].data["event"] == "error"


async def test_empty_inputs(hass):
    hass.states.async_set("binary_sensor.salt", "off")
    calls = await setup(hass, lang="en", salt_warning="binary_sensor.salt")
    hass.states.async_set("binary_sensor.salt", "on")
    await hass.async_block_till_done()
    later(hass, 11)
    await hass.async_block_till_done()
    assert [c.data["message"] for c in calls] == [
        "The salt is running low. Please refill salt."
    ]


async def test_no_data(hass):
    hass.states.async_set("binary_sensor.nd", "off")
    calls = await setup(hass, no_data_change="binary_sensor.nd")
    hass.states.async_set(
        "binary_sensor.nd",
        "on",
        {"since": dt_util.parse_datetime("2026-10-28T08:15:00+00:00")},
    )
    await hass.async_block_till_done()
    print(calls[0].data)
    assert calls[0].data["message"].startswith("Keine neuen Daten seit 28.10.")


async def test_maintenance(hass):
    hass.states.async_set("sensor.md", "20")
    calls = await setup(hass, maintenance_days="sensor.md", remind_days=14)
    hass.states.async_set("sensor.md", "13")
    await hass.async_block_till_done()
    hass.states.async_set("sensor.md", "0")
    await hass.async_block_till_done()
    msgs = [c.data["message"] for c in calls]
    print(msgs)
    assert msgs == [
        "Wartung in 13 Tagen fällig.",
        "Wartung ist fällig. Danach „Wartung erledigt“ drücken.",
    ]


async def test_regen_and_flow(hass):
    hass.states.async_set("binary_sensor.rr", "on")
    hass.states.async_set("sensor.flow", "0")
    calls = await setup(
        hass,
        lang="en",
        regeneration_running="binary_sensor.rr",
        flow_rate="sensor.flow",
        flow_minutes=30,
    )
    hass.states.async_set("binary_sensor.rr", "off")
    await hass.async_block_till_done()
    hass.states.async_set("sensor.flow", "3.1")
    await hass.async_block_till_done()
    later(hass, 31)
    await hass.async_block_till_done()
    msgs = [c.data["message"] for c in calls]
    print(msgs)
    assert msgs == [
        "Regeneration finished.",
        "Water has been flowing for 30 minutes without a break. Possible leak?",
    ]


async def test_only_home(hass):
    hass.states.async_set("zone.home", "0")
    hass.states.async_set("binary_sensor.salt", "off")
    calls = await setup(hass, home=True, salt_warning="binary_sensor.salt")
    hass.states.async_set("binary_sensor.salt", "on")
    await hass.async_block_till_done()
    later(hass, 11)
    await hass.async_block_till_done()
    assert not calls
    hass.states.async_set("zone.home", "1")
    await hass.async_block_till_done()
    later(hass, 45)
    await hass.async_block_till_done()
    msgs = [c.data["message"] for c in calls]
    print(msgs)
    assert msgs == ["Weiterhin aktiv: Salz nachfüllen"]


async def test_no_poll(hass, freezer):
    start = dt_util.utcnow()
    freezer.move_to(start)
    hass.states.async_set("sensor.lp", start.isoformat())
    calls = await setup(hass, lang="en", last_poll="sensor.lp", poll_hours=6)
    freezer.move_to(start + timedelta(hours=1))
    later_at(hass, start + timedelta(hours=1))
    await hass.async_block_till_done()
    assert not calls
    freezer.move_to(start + timedelta(hours=7))
    later_at(hass, start + timedelta(hours=7))
    await hass.async_block_till_done()
    assert [c.data["event"] for c in calls] == ["no_poll"], calls
    assert "6 hours" in calls[0].data["message"]


async def test_repeat(hass, freezer):
    start = dt_util.now().replace(hour=8, minute=0, second=0, microsecond=0)
    freezer.move_to(start)
    hass.states.async_set("binary_sensor.salt", "off")
    hass.states.async_set("sensor.md", "100")
    calls = await setup(
        hass,
        lang="de",
        salt_warning="binary_sensor.salt",
        maintenance_days="sensor.md",
        repeat_days=2,
    )
    hass.states.async_set("binary_sensor.salt", "on")
    await hass.async_block_till_done()
    freezer.move_to(start + timedelta(minutes=11))
    later_at(hass, start + timedelta(minutes=11))
    await hass.async_block_till_done()
    assert [c.data["event"] for c in calls] == ["salt"]
    # day 1 09:00: too early, day 2 09:00: age = 2 days -> repeat
    for d, expect in [(1, 1), (2, 2)]:
        t = (start + timedelta(days=d)).replace(hour=9)
        freezer.move_to(t)
        later_at(hass, t)
        await hass.async_block_till_done()
        assert len(calls) == expect, (d, [c.data for c in calls])
    assert calls[-1].data["event"] == "repeat"
    assert calls[-1].data["message"] == "Weiterhin aktiv: Salz nachfüllen"


async def test_repeat_off_by_default(hass, freezer):
    start = dt_util.now().replace(hour=8, minute=0, second=0, microsecond=0)
    freezer.move_to(start)
    hass.states.async_set("binary_sensor.salt", "off")
    calls = await setup(hass, lang="de", salt_warning="binary_sensor.salt")
    hass.states.async_set("binary_sensor.salt", "on")
    await hass.async_block_till_done()
    t = (start + timedelta(days=3)).replace(hour=9)
    freezer.move_to(t)
    later_at(hass, t)
    await hass.async_block_till_done()
    assert "repeat" not in [c.data["event"] for c in calls]


async def test_repeat_overdue_maintenance(hass, freezer):
    start = dt_util.now().replace(hour=8, minute=0, second=0, microsecond=0)
    freezer.move_to(start)
    hass.states.async_set("sensor.md", "-4")
    calls = await setup(hass, lang="en", maintenance_days="sensor.md", repeat_days=2)
    t = start.replace(hour=9)
    freezer.move_to(t)
    later_at(hass, t)
    await hass.async_block_till_done()
    assert [c.data["message"] for c in calls if c.data["event"] == "repeat"] == [
        "Still active: maintenance due"
    ]


async def test_routine_every_second_month(hass, freezer):
    tz = dt_util.DEFAULT_TIME_ZONE
    from datetime import datetime

    calls = None
    for month, expect in [(11, 1), (12, 1), (1, 2)]:
        year = 2026 if month > 6 else 2027
        t = datetime(year, month, 1, 10, 0, tzinfo=tz)
        freezer.move_to(t - timedelta(hours=1))
        if calls is None:
            calls = await setup(hass, lang="de", routine_months=2)
        freezer.move_to(t)
        later_at(hass, t)
        await hass.async_block_till_done()
        assert len([c for c in calls if c.data["event"] == "routine"]) == expect, month
    assert "alle 2 Monate" in calls[0].data["message"]


async def test_unreachable_via_last_poll(hass):
    hass.states.async_set("sensor.lp", dt_util.utcnow().isoformat())
    calls = await setup(hass, lang="en", last_poll="sensor.lp", unreachable_minutes=30)
    hass.states.async_set("sensor.lp", "unavailable")
    await hass.async_block_till_done()
    later(hass, 31)
    await hass.async_block_till_done()
    assert [c.data["event"] for c in calls] == ["unreachable"]
    assert "unreachable for 30 minutes" in calls[0].data["message"]
