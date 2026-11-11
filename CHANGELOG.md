# Changelog

## 0.3.0

### Added
* Dashboard card `custom:gruenbeck-card`, served and registered by the integration (no resource to add): picture of the softener with live state, statistics, charts, salt usage since the last refill, regeneration details, maintenance and inspection windows with "done" buttons, the controls, a visual editor, English and German. See `docs/card.md`.
* Automation blueprint *Grünbeck softener notifications*, installed to `blueprints/automation/gruenbeck_cloud_se/` on startup. See `docs/notifications.md`.
* Websocket command `gruenbeck_cloud_se/card_info` for the card (entity ids, notification automations, daily values).
* Card sources as ES modules in `card/` with a build script, texts in `card/src/i18n/*.json`.
* Sensors *Salt usage total* and *Lime retained total*: running totals in `kg`, counted from the daily cloud values. Counted days are remembered for 400 days, so the totals survive when the cloud drops old days.
* Binary sensor *No data change*: on when the telemetry has not changed for a long time (attribute `since`).
* Salt refill detection: the times when the salt warning went away are stored (attribute `refills` of *Salt warning*, last 20).
* Attribute `last_error` on *Device error* with message and time of the newest open error.
* Regeneration steps: *Last regeneration* records the phases seen during a regeneration.
* `coordinator.daily_values(kind)`: one accessor for the daily water, salt and lime values.

### Changed
* Devices are named after the model without the brand prefix, e.g. *SE21 Plant*, *SE21 Settings* (was *Grünbeck SoftliQ SE*, *Grünbeck Settings*). Existing entity IDs are kept.
* *Maintenance done* also resets the inspection, because a maintenance includes it.
* The date of the last maintenance or inspection cannot be set in the future.
* *Salt usage* is now called *Salt counter of the unit (whole kg)*, to tell it apart from the new total.
* *Days until maintenance* and *Days until inspection* have the device class duration.
* The manifest depends on `frontend` and `http` (needed to serve the card).

### Removed
* *Salt usage sum of daily values*: it was no daily value and is replaced by *Salt usage total*. The entity is removed from the registry on startup.

## 0.2.0

### Added
* Device information, settings and daily water/lime/salt values from read-only cloud endpoints (hourly, does not wake the device).
* Sensors: regeneration phase (text), last regeneration with history, next regeneration window, last error, software version, start-up date, chlorine cell current, soft water meter, make-up water, average flow rate, daily values, last poll, data last changed, changed settings.
* Binary sensor: regeneration running.
* Controls: iQ-Mode, signal on failure, LED ring options (4 switches as in the app), LED ring brightness.
* Live mode (30 s for 5 minutes) and opt-in regeneration tracking (1 min while a regeneration runs).
* Maintenance and inspection tracking: last date (editable, stored locally), "done" buttons, next date and days remaining.
* Button "Fetch settings now".
* English and German translations for all entities, states, attributes, device names and errors.
* `description` attribute with an explanation for every entity.
* Entities grouped into sub-devices (consumption, daily values, maintenance, settings).
* Model detection (e.g. "softliQ SE21"); entities depend on the model.
* Diagnostics download with raw cloud responses (redacted).
* Automated tests (`pytest`) with recorded cloud responses, replacing `simulate.py`.

### Changed
* Sub-devices are linked with `via_device_id`; `via_device` in `DeviceInfo` makes entity setup fail on Home Assistant 2026.10.
* Flow rate unit is `L/min` (verified on a softliQ SE21; was `m³/h`), flow rate sensor enabled by default.
* Make-up water unit is `L` (was `m³`), matching the Grünbeck app.
* Regeneration status has no state class anymore, so the history no longer shows averaged status codes.

### Removed
* Exchanger 2 and blended flow sensors on softliQ SE devices (single exchanger; the values never changed). Kept on other series.
* Salt warning on the softliQ SE18 (no salt level sensor).
* Obsolete entities are removed from the entity registry automatically on startup.
