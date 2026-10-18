#!/usr/bin/env python3
"""Post ONLY newly added Beyond the Outbreak news.json IDs to Discord.

Invoked after pushes to main that change news.json. Discord URLs must be stored
as repository Actions secrets, NEVER in this public source or news.json.
"""
import datetime as dt
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

SITE_URL = "https://zooyork3331-hash.github.io/beyond-the-outbreak"
CATEGORIES = {"Announcement", "Event", "Patch Notes", "Maintenance", "Guide"}
SERVERS = {"All Servers", "Pripyat", "Deer Isle", "Badlands"}
VALID_ID = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
VALID_SHA = re.compile(r"^[0-9a-f]{40}$")


def require_posts(data, source):
    if not isinstance(data, list):
        raise ValueError(f"{source} must contain a JSON array of posts")
    seen = set()
    for n, item in enumerate(data, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"{source} post #{n} must be an object")
        post_id = item.get("id")
        if not isinstance(post_id, str) or not VALID_ID.fullmatch(post_id):
            raise ValueError(f"{source} post #{n}: id must be a unique lowercase slug, such as 'my-event'")
        if post_id in seen:
            raise ValueError(f"{source}: duplicate id '{post_id}'")
        seen.add(post_id)
        if not isinstance(item.get("title"), str) or not item["title"].strip():
            raise ValueError(f"{source} post '{post_id}' needs a nonempty title")
        if item.get("category") not in CATEGORIES:
            raise ValueError(f"{source} post '{post_id}' has an unsupported category")
        if item.get("server") not in SERVERS:
            raise ValueError(f"{source} post '{post_id}' has an unsupported server")
        for field in ("date", "eventDate"):
            if field in item and item[field] not in ("", None):
                if not isinstance(item[field], str):
                    raise ValueError(f"{source} post '{post_id}': {field} must be a YYYY-MM-DD string")
                try:
                    parsed = dt.date.fromisoformat(item[field])
                    if parsed.isoformat() != item[field]:
                        raise ValueError()
                except ValueError:
                    raise ValueError(f"{source} post '{post_id}': {field} must be a valid YYYY-MM-DD date")
        if not item.get("date"):
            raise ValueError(f"{source} post '{post_id}' requires a publication date")
    return data


def previous_posts(before_sha):
    """Return old posts; None means we lack safe history, so do not post."""
    if not VALID_SHA.fullmatch(before_sha or "") or before_sha == "0" * 40:
        print("No prior revision identified; skipping automatic messages to avoid reposting old news.")
        return None
    cmd = subprocess.run(
        ["git", "show", f"{before_sha}:news.json"],
        text=True, capture_output=True, check=False,
    )
    if cmd.returncode != 0:
        print("Previous news.json was not found in Git history; skipping to avoid posting old news.")
        return None
    try:
        old = json.loads(cmd.stdout)
    except json.JSONDecodeError as exc:
        raise ValueError("Previous news.json is invalid JSON") from exc
    # Only check IDs, not full validation of older content.
    if not isinstance(old, list):
        raise ValueError("Previous news.json is not an array")
    return old


def new_posts(previous, current):
    old_ids = {item.get("id") for item in previous if isinstance(item, dict)}
    return [post for post in current if post["id"] not in old_ids]


def clip(value, limit):
    s = str(value).strip() if value is not None else ""
    return s if len(s) <= limit else s[:limit - 1].rstrip() + "…"


def payload_for(post):
    category = post["category"]
    is_event = category == "Event"
    description = clip(post.get("content") or post.get("summary") or "New community update.", 3500)
    fields = [
        {"name": "Server", "value": clip(post["server"], 1024), "inline": True},
        {"name": "Published", "value": clip(post["date"], 1024), "inline": True},
    ]
    if is_event:
        for label, key in (("Event date", "eventDate"), ("Time", "eventTime"), ("Location", "location")):
            if post.get(key):
                fields.append({"name": label, "value": clip(post[key], 1024), "inline": True})
    return {
        "username": "Beyond the Outbreak",
        "allowed_mentions": {"parse": []},  # never allow @everyone/@here or user pings
        "embeds": [{
            "title": clip(post["title"], 256),
            "url": f"{SITE_URL}/news.html#{post['id']}",
            "description": description,
            "color": 0xA9C16A if is_event else 0x697E58,
            "fields": fields,
            "footer": {"text": f"BEYOND THE OUTBREAK  •  {category}"},
        }],
    }


def send(webhook, payload):
    if not re.fullmatch(r"https://(?:discord\.com|discordapp\.com)/api/webhooks/\d+/[A-Za-z0-9_-]+", webhook):
        raise ValueError("Discord webhook secret is missing or not a valid webhook URL")
    request = urllib.request.Request(
        webhook,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "BeyondTheOutbreak-GitHubActions/1.0"},
        method="POST",
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                if response.status in (200, 204):
                    return
                raise RuntimeError(f"Discord returned HTTP {response.status}")
        except urllib.error.HTTPError as exc:
            # Do not log exception URL (contains secret token).
            if exc.code == 429 and attempt < 2:
                try:
                    retry_after = float(json.load(exc).get("retry_after", 2))
                except (ValueError, TypeError, json.JSONDecodeError):
                    retry_after = 2
                time.sleep(min(max(retry_after, 1), 20))
                continue
            if 500 <= exc.code < 600 and attempt < 2:
                time.sleep(2 * (attempt + 1))
                continue
            raise RuntimeError(f"Discord rejected the message (HTTP {exc.code})") from None
        except urllib.error.URLError:
            if attempt < 2:
                time.sleep(2 * (attempt + 1))
                continue
            raise RuntimeError("Could not connect to Discord") from None
    raise RuntimeError("Discord request failed after retries")


def main():
    try:
        current = require_posts(json.loads(Path("news.json").read_text(encoding="utf-8")), "Current news.json")
        previous = previous_posts(os.environ.get("BEFORE_SHA", ""))
        if previous is None:
            return 0
        fresh = new_posts(previous, current)
        if not fresh:
            print("No new IDs in news.json. Nothing to send to Discord.")
            return 0

        announcement_webhook = os.environ.get("DISCORD_ANNOUNCEMENTS_WEBHOOK", "").strip()
        events_webhook = os.environ.get("DISCORD_EVENTS_WEBHOOK", "").strip()
        # Validate all needed destinations before posting any message.
        needed = {"DISCORD_EVENTS_WEBHOOK" if p["category"] == "Event" else "DISCORD_ANNOUNCEMENTS_WEBHOOK" for p in fresh}
        for secret_name in needed:
            url = events_webhook if secret_name == "DISCORD_EVENTS_WEBHOOK" else announcement_webhook
            if not url:
                raise ValueError(f"Missing Actions secret {secret_name}; configure it in GitHub Settings → Secrets and variables → Actions")
            if not re.fullmatch(r"https://(?:discord\.com|discordapp\.com)/api/webhooks/\d+/[A-Za-z0-9_-]+", url):
                raise ValueError(f"{secret_name} does not look like a Discord webhook URL")

        print(f"Found {len(fresh)} new post(s) in news.json.")
        for index, post in enumerate(fresh, start=1):
            target = "events" if post["category"] == "Event" else "announcements"
            url = events_webhook if target == "events" else announcement_webhook
            print(f"[{index}/{len(fresh)}] Publishing {post['id']} to {target} channel…")
            send(url, payload_for(post))
            print(f"Published {post['id']} successfully.")
        return 0
    except (ValueError, OSError, json.JSONDecodeError, RuntimeError) as exc:
        # Never print any secret webhook URL or a raw urllib exception.
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
