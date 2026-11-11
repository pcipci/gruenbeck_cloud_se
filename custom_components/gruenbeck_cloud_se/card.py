"""Dashboard card shipped with the integration.

The card (frontend/gruenbeck-card.js) is served by Home Assistant and loaded
as frontend module, so "custom:gruenbeck-card" works without adding a
dashboard resource. The websocket command gruenbeck_cloud_se/card_info tells
the card which entities belong to which softener, found by unique id.
"""

from __future__ import annotations

from datetime import timedelta
from pathlib import Path
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.loader import async_get_integration
from homeassistant.util import dt as dt_util

from .const import CONF_DEVICE_ID, DOMAIN

CARD_URL = f"/{DOMAIN}/gruenbeck-card.js"
CARD_FILE = Path(__file__).parent / "frontend" / "gruenbeck-card.js"
DATA_CARD_REGISTERED = f"{DOMAIN}_card_registered"


async def async_register_card(hass: HomeAssistant) -> None:
    """Serve the card and load it in every dashboard."""
    if hass.data.get(DATA_CARD_REGISTERED):
        return
    hass.data[DATA_CARD_REGISTERED] = True

    integration = await async_get_integration(hass, DOMAIN)
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(CARD_FILE), cache_headers=False)]
    )
    # The version busts the browser cache after an update
    add_extra_js_url(hass, f"{CARD_URL}?v={integration.version}")
    websocket_api.async_register_command(hass, ws_card_info)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/card_info"})
@callback
def ws_card_info(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return the softeners with their entities and daily values."""
    entity_registry = er.async_get(hass)
    device_registry = dr.async_get(hass)
    result = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        coordinator = hass.data.get(DOMAIN, {}).get(entry.entry_id)
        if coordinator is None:
            continue
        device_id = entry.data[CONF_DEVICE_ID]
        device = device_registry.async_get_device(identifiers={(DOMAIN, device_id)})
        if device is None:
            continue

        # unique id is "<device id>_<key>", the card uses the lower case key
        prefix = f"{device_id}_"
        entities = {}
        for entity in er.async_entries_for_config_entry(
            entity_registry, entry.entry_id
        ):
            if entity.disabled_by or not entity.unique_id.startswith(prefix):
                continue
            key = entity.unique_id[len(prefix) :].lower()
            # Keep the main entity if a key exists on several platforms
            entities.setdefault(key, entity.entity_id)

        # The only data the card takes from the coordinator
        water = coordinator.daily_values("water")
        salt = coordinator.daily_values("salt")
        lime = coordinator.daily_values("lime")
        result.append(
            {
                "device_id": device.id,
                "name": device.name_by_user or device.name,
                "entities": entities,
                "notifications": notification_automations(hass),
                # Daily values (ISO date -> value) for charts and averages
                "days": {
                    "water": day_map(water),
                    "salt": day_map(salt),
                    "lime": day_map(lime),
                },
            }
        )
    connection.send_result(msg["id"], result)


BLUEPRINT_FILE = "gruenbeck_softener_notifications.yaml"


def notification_automations(hass: HomeAssistant) -> list[str]:
    """Entity ids of the automations made from the notification blueprint."""
    try:
        from homeassistant.components.automation import DATA_COMPONENT

        component = hass.data.get(DATA_COMPONENT)
        return [
            entity.entity_id
            for entity in (component.entities if component else [])
            if str(getattr(entity, "referenced_blueprint", None) or "").endswith(
                BLUEPRINT_FILE
            )
        ]
    except Exception:  # noqa: BLE001 - the card works without this hint
        return []


def day_map(entries: Any, keep_days: int = 400) -> dict[str, float]:
    """Return the daily values of the last days by ISO date."""
    if not isinstance(entries, list):
        return {}
    first = (dt_util.now().date() - timedelta(days=keep_days)).isoformat()
    result: dict[str, float] = {}
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        day = str(entry.get("date") or "")[:10]
        try:
            value = float(entry.get("value") or 0)
        except (TypeError, ValueError):
            continue
        if len(day) == 10 and day >= first:
            result[day] = value
    return result
