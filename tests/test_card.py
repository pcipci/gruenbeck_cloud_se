import json
from datetime import date, timedelta
from pathlib import Path
from types import SimpleNamespace

from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.gruenbeck_cloud_se import card
from custom_components.gruenbeck_cloud_se.card import day_map
from custom_components.gruenbeck_cloud_se.coordinator import (
    GruenbeckDataUpdateCoordinator,
)

DOMAIN = "gruenbeck_cloud_se"


async def test_card(hass, hass_client, hass_ws_client):
    assert await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()
    urls = hass.data[DATA_EXTRA_MODULE_URL].urls
    # The manifest version is part of the URL, so an update busts the cache
    version = json.loads((Path(card.__file__).parent / "manifest.json").read_text())[
        "version"
    ]
    assert f"/gruenbeck_cloud_se/gruenbeck-card.js?v={version}" in urls
    client = await hass_client()
    resp = await client.get("/gruenbeck_cloud_se/gruenbeck-card.js")
    assert resp.status == 200
    assert "gruenbeck-card" in await resp.text()

    entry = MockConfigEntry(
        domain=DOMAIN, data={"device_id": "SN1", "username": "u", "password": "p"}
    )
    entry.add_to_hass(hass)
    today = date.today()
    salt = [
        {"date": (today - timedelta(days=i)).isoformat() + "T00:00:00", "value": 500}
        for i in range(1, 40)
    ]
    coordinator = SimpleNamespace(
        data={"_salt": salt, "_water": None}, salt_days={}, lime_days={}
    )
    coordinator.daily_values = lambda kind: GruenbeckDataUpdateCoordinator.daily_values(
        coordinator, kind
    )
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    devreg = dr.async_get(hass)
    dev = devreg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, "SN1")},
        name="Grünbeck SoftliQ SE",
    )
    entreg = er.async_get(hass)
    entreg.async_get_or_create(
        "sensor", DOMAIN, "SN1_mRescapa1", config_entry=entry, suggested_object_id="cap"
    )
    entreg.async_get_or_create(
        "binary_sensor",
        DOMAIN,
        "SN1_salt_warning",
        config_entry=entry,
        suggested_object_id="salt",
    )
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "gruenbeck_cloud_se/card_info"})
    msg = await ws.receive_json()
    assert msg["success"]
    r = msg["result"][0]
    assert r["device_id"] == dev.id
    assert r["entities"] == {
        "mrescapa1": "sensor.cap",
        "salt_warning": "binary_sensor.salt",
    }
    assert set(r) == {"device_id", "name", "entities", "notifications", "days"}
    # Daily values for the charts, by ISO date
    yesterday = (today - timedelta(days=1)).isoformat()
    assert r["days"]["salt"][yesterday] == 500
    assert r["days"]["water"] == {} and r["days"]["lime"] == {}


def test_day_map():
    today = date.today()
    entries = [
        {"date": (today - timedelta(days=1)).isoformat() + "T00:00:00", "value": "250"},
        {"date": (today - timedelta(days=500)).isoformat(), "value": 1},
        {"date": None, "value": 3},
        {"date": today.isoformat(), "value": "x"},
        "junk",
    ]
    assert day_map(entries) == {(today - timedelta(days=1)).isoformat(): 250.0}
    assert day_map(None) == {}


async def test_notification_automations_empty(hass):
    from custom_components.gruenbeck_cloud_se.card import notification_automations

    assert notification_automations(hass) == []


def test_daily_values_interface():
    """The coordinator method is the only data interface of the card."""
    c = SimpleNamespace(
        data={
            "_water": [
                {"date": "2026-11-01T00:00:00", "value": 200, "limeRetained": 300}
            ],
            "_salt": [{"date": "2026-11-01T00:00:00", "value": 50}],
        },
        salt_days={"2026-10-31": 40},
        lime_days={},
    )
    f = lambda kind: GruenbeckDataUpdateCoordinator.daily_values(c, kind)
    assert f("water")[0]["value"] == 200
    assert {e["date"]: e["value"] for e in f("salt")} == {
        "2026-10-31": 40,
        "2026-11-01": 50,
    }
    assert [(e["date"], e["value"]) for e in f("lime")] == [("2026-11-01", 300)]
    c.data = {}
    assert f("water") is None and f("salt") is not None and f("lime") is None
