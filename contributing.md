# Contribution Guidelines

Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.

The list grows in small, checked batches. A short list where every link works is more useful than a long one that has gone stale. Suggestions that miss the criteria below may wait in the issue tracker until they can be verified.

## Suggesting a source

[Open a "Suggest a source" issue](../../issues/new?template=suggest-source.yml) if you don't want to edit YAML. The form asks for the same fields as the data file.

## Inclusion criteria

A source is listed when all of these hold:

1. **Free to access.** No account is needed, or only a free key or registration. Paid, partnership-only and private data are out of scope.
2. **Authoritative publisher.** A government, intergovernmental body, university, established nonprofit or community project, or a company publishing under an open license. Republished copies are listed only when they add real access value, such as a cloud-optimized mirror.
3. **Machine access.** A program can get the data through a download, API, web service, tiles or a stream. A viewer alone is not enough.
4. **Broad or unusually valuable coverage.** Prefer global, continental or national sources. A regional or city source needs to be exceptional, for example the only real-time feed of its kind. Single municipal layers belong in the [national geoportals](README.md#national-geoportals) or a regional catalog.
5. **Known license.** State the license and link to it. If the terms are restricted (for example non-commercial) or cannot be found, set `status` to `restricted` or `unclear`. The entry then shows `⚠️` and is accepted only for high-value sources.
6. **Verified recently.** Someone has opened the link, confirmed the access route works and read the terms within the last six months.

One entry per product family, not per layer or file. For example, list a provider's earthquake feed once rather than each magnitude or time window.

## Adding or changing an entry

1. Edit [`data/sources.yml`](data/sources.yml). Do not edit `README.md`, which is generated.
2. Run `pnpm install` once, then `pnpm build` to validate the data and regenerate the README.
3. Run `pnpm verify` to run the tests, the README freshness check and `awesome-lint`.
4. Commit both `data/sources.yml` and `README.md`, and add a line to [`CHANGELOG.md`](CHANGELOG.md) under *Unreleased*.

The [website](https://sheldon-st.github.io/awesome-geospatial-data/) is rebuilt from `data/sources.yml` on every merge to `main`, so it needs no separate edit. To preview it locally, run `pnpm site` and serve `_site/`, for example with `pnpm dlx serve _site`.

### Fields

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Stable kebab-case id. Never reuse one after removal. |
| `name` | yes | The product's own name. |
| `url` | yes | HTTPS landing or documentation page that leads to machine access. Prefer the API or download docs over a marketing page. |
| `description` | yes | One sentence of 20–200 characters that starts with a capital and ends with a period. Say what the data contains and what makes it useful. Don't repeat the name. |
| `section` | yes | An `id` from [`data/sections.yml`](data/sections.yml). Choose the section for the source's main purpose. |
| `publisher`, `publisher_type` | yes | `publisher_type` is one of `government`, `intergovernmental`, `academic`, `nonprofit`, `community`, `commercial`. |
| `coverage` | yes | `Global`, a continent (`Africa`, `Americas`, `Asia`, `Europe`, `Oceania`, `Antarctica`), ISO 3166-1 alpha-3 codes (`USA`) or ISO 3166-2 codes (`US-CA`). |
| `access` | yes | `public` or `free-key`. |
| `license` | yes | `name`, `status` (`open`, `restricted`, `unclear`) and `url` when one exists. |
| `interfaces`, `formats` | yes | Values from the lists in [`schema/source.schema.json`](schema/source.schema.json). To add a new value, add it to the schema in the same pull request. |
| `realtime` | yes | `true` if the data updates at least hourly. |
| `update_frequency` | no | Free text, for example `1 minute`, `daily` or `annual`. |
| `added`, `last_verified` | yes | `YYYY-MM-DD`. Update `last_verified` whenever you re-check an entry. |
| `notes` | no | Caveats for maintainers, such as edition or per-item licensing. Not shown in the README. |

### Style

- Use the publisher's spelling and capitalization of product names.
- Keep descriptions factual. Don't use words like "best", "awesome" or "comprehensive".
- Put a caveat that affects reuse in `notes` and the license fields, not in the description.

## Removing an entry

Open a pull request that removes the entry and says why, for example that the link is dead, the license changed or the source is no longer maintained. Record the removal in `CHANGELOG.md`.
