from homeassistant.helpers import device_registry as dr
from pytest_homeassistant_custom_component.common import MockConfigEntry
from custom_components.gruenbeck_cloud_se.models import device_features, device_name


async def test_rename_existing_translated_device(hass):
    entry = MockConfigEntry(domain="gruenbeck_cloud_se")
    entry.add_to_hass(hass)
    reg = dr.async_get(hass)
    old = reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={("gruenbeck_cloud_se", "x_settings")},
        name="Grünbeck Einstellungen",
        manufacturer="Grünbeck",
    )
    f = device_features({"series": "softliQ.SE", "type": 121, "_info": {}})
    name = device_name(f, "settings", "de")
    new = reg.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={("gruenbeck_cloud_se", "x_settings")},
        name=name,
        manufacturer="Grünbeck",
    )
    assert new.id == old.id
    assert new.name == name
    assert name.endswith("Einstellungen") and "Grünbeck" not in name


def test_device_names():
    f = device_features({"type": 121, "series": "softliQ.SE"})
    print(f.model)
    assert device_name(f, "plant", "en") == "SE21 Plant"
    assert device_name(f, "daily", "de").endswith("Tageswerte (Cloud)")
