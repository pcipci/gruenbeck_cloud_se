from pathlib import Path

from custom_components.gruenbeck_cloud_se.blueprint import (
    BLUEPRINT_FILE,
    async_install_blueprint,
)
from custom_components.gruenbeck_cloud_se.const import DOMAIN


async def test_install_and_update(hass):
    target = Path(hass.config.path("blueprints", "automation", DOMAIN, BLUEPRINT_FILE))
    target.unlink(missing_ok=True)
    await async_install_blueprint(hass)
    assert target.exists() and "Grünbeck softener notifications" in target.read_text()
    # a changed copy is replaced by the shipped version
    target.write_text("old")
    await async_install_blueprint(hass)
    assert target.read_text().startswith("blueprint:")
