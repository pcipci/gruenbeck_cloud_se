"""Install the notification blueprint shipped with the integration.

Home Assistant only lists blueprints from /config/blueprints, so the file is
copied there at startup. The copy belongs to the integration: it is updated
when the shipped version differs. Own changes belong in a copy with another
file name. Automations made from the blueprint keep their inputs because new
versions only add inputs with defaults.
"""

from __future__ import annotations

from pathlib import Path

from homeassistant.core import HomeAssistant

from .const import DOMAIN, LOGGER

BLUEPRINT_FILE = "gruenbeck_softener_notifications.yaml"
SOURCE = Path(__file__).parent / "blueprints" / BLUEPRINT_FILE


def _install(target: Path) -> bool:
    """Copy the blueprint if missing or different; return True when written."""
    if not SOURCE.exists():
        return False
    data = SOURCE.read_bytes()
    if target.exists() and target.read_bytes() == data:
        return False
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    return True


async def async_install_blueprint(hass: HomeAssistant) -> None:
    """Make the notification blueprint available in Home Assistant."""
    target = Path(hass.config.path("blueprints", "automation", DOMAIN, BLUEPRINT_FILE))
    try:
        written = await hass.async_add_executor_job(_install, target)
    except OSError as err:
        LOGGER.warning("Could not install the notification blueprint: %s", err)
        return
    if not written:
        return
    LOGGER.info("Installed the notification blueprint at %s", target)
    try:
        from homeassistant.components.automation.helpers import async_get_blueprints

        await async_get_blueprints(hass).async_reset_cache()
    except Exception:  # noqa: BLE001 - listed after the next reload anyway
        LOGGER.debug("Blueprint cache not reset", exc_info=True)
