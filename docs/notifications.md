# Grünbeck softener notifications (blueprint)

Ready-made notifications for the Grünbeck Cloud SE integration. English interface, messages in English or German.

## Install

1. The integration installs `gruenbeck_softener_notifications.yaml` into `/config/blueprints/automation/gruenbeck_cloud_se/` at startup (restart Home Assistant). The file belongs to the integration and is replaced by newer versions; make your own changes in a copy with another file name.
2. Settings → Automations & scenes → Blueprints → ⋮ → *Reload blueprints*.
3. Open *Grünbeck softener notifications* → *Create automation*.

## What it can tell you

| Event | When |
|---|---|
| Device error | The "Device error" sensor is on for 5 minutes (the message contains the last error, read from its attribute `last_error`) |
| Salt warning | Salt is running low for 10 minutes |
| No data change | The cloud delivers no changed values for 24 hours |
| Integration unreachable | The "Last poll" sensor is "unavailable" (cloud not reachable) for the time you set |
| No poll for hours | The "Last poll" sensor is older than the hours you set |
| Maintenance / inspection | X days before the due date and on the due date |
| Regeneration finished | Optional |
| Long water flow | Water flows without a break longer than the time you set (possible leak) |
| Routine check | Optional reminder every N months (1st of the month) to look at the softener yourself; the manual recommends every 2 months |
| Repeat | Warnings that stay active are repeated every N days at a set time as "Still active: …" (0 = off) |

Every event is optional: leave its sensor empty to skip it. With *Only when someone is home* the messages wait until you are back.

In *Actions* you choose what happens, e.g. a phone notification with title `{{ title }}` and message `{{ message }}`. The variable `event` tells which event fired: `error`, `salt`, `no_data`, `unreachable`, `no_poll`, `maintenance`, `inspection`, `regeneration_done`, `flow`, `repeat`, `routine`, `back_home`.

## Notes

- A warning is sent once when it turns on. Use *Repeat* for a reminder while it stays on.
- Flow values arrive only every few minutes from the cloud, so "long water flow" is a hint, not a leak detector.
- The blueprint is covered by automated tests (`tests/test_bp.py`).
