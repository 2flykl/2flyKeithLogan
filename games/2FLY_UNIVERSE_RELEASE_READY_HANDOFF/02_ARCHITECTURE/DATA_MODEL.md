# Data Model Contract

Persistent IDs are immutable strings/UUIDs. Coordinates are not identity.

Core entities:
- galaxies(id, start_year, end_year, title, visual_theme)
- regions(id, galaxy_id, ordinal, title, description)
- celestial_objects(id, region_id, parent_id, kind, title, position, content_status, metadata)
- media_items(id, object_id, kind, source_url, poster_url, transcript_url, metadata)
- stars(id, account_id/private owner ref, galaxy_id, region_id, cluster_id, x,y,z, display_name, star_name, message, signature_asset, created_at, public)
- star_cards(id, star_id, template_version, generated_at)
- connections(id, source_star_id, target_star_id, type)
- moderation records

Production rules:
- One primary star per account/user identity by default.
- Server-side coordinate collision validation.
- Public star views never expose private owner/account identifiers.
- User text sanitized.
- Signature uploads bounded by size/type and re-encoded.
- Admin/founder/rarity flags cannot be client-controlled.
