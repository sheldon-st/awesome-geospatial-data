# Awesome Geospatial Data [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> Publicly accessible geospatial datasets, APIs and live feeds, each tagged with coverage, access method, format and license.

Every entry is free to use, though some need a free key. Each one can be fetched by a program through a download, an API, a web service or a stream, not only viewed in a map. Maintainers check entries by hand and record when they were last verified. See the [inclusion criteria](contributing.md#inclusion-criteria).

Each entry ends with tags in this order:

- Coverage: `Global`, a continent, or an ISO 3166 country or subdivision code.
- `⚡` means the data updates at least hourly.
- `🔑` means a free key or account is required.
- How to access the data, its formats, and its license.
- `⚠️` means the license is restricted or unclear, so check the terms before reuse.

## Contents

- [Base Maps and Reference](#base-maps-and-reference)
- [Boundaries and Administrative Units](#boundaries-and-administrative-units)
- [Natural Hazards](#natural-hazards)

## Base Maps and Reference

General-purpose map layers such as roads, places, land, water and cultural features.

- [Natural Earth](https://www.naturalearthdata.com/) - Global cultural, physical and raster base map layers at 1:10m, 1:50m and 1:110m scales. (`Global` `Download` `Shapefile` `GeoPackage` `Public domain`)

## Boundaries and Administrative Units

Country, subnational, statistical and maritime boundaries.

- [geoBoundaries](https://www.geoboundaries.org/) - Open administrative boundaries for every country, from national borders down to local units where available. (`Global` `API` `Download` `GeoJSON` `Shapefile` `TopoJSON` `Varies by boundary`)

## Natural Hazards

Earthquakes, wildfires, tropical cyclones, floods and multi-hazard alerting.

- [USGS Earthquake Feeds](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) - Worldwide earthquake events with magnitudes and revisions, refreshed every minute. (`Global` `⚡` `API` `GeoJSON` `CSV` `KML` `QuakeML` `Public domain`)

## Related Lists

- [awesome-gis](https://github.com/sshuair/awesome-gis) - GIS software, libraries, learning resources and data sources.
- [awesome-public-datasets](https://github.com/awesomedata/awesome-public-datasets) - Public datasets across many topics, including geospatial.
- [awesome-satellite-imagery-datasets](https://github.com/chrieke/awesome-satellite-imagery-datasets) - Annotated satellite imagery datasets for computer vision.
- [awesome-earthobservation-code](https://github.com/acgeospatial/awesome-earthobservation-code) - Tools, tutorials and code for working with Earth observation data.
- [awesome-geojson](https://github.com/tmcw/awesome-geojson) - Utilities and libraries for working with GeoJSON.

## Contributing

Suggestions are welcome. Read the [contribution guidelines](contributing.md) first. This README is generated from [`data/sources.yml`](data/sources.yml), so edit that file rather than this one.
