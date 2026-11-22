# Changelog

Additions, removals and structural changes, grouped by batch. Dates are UTC.

## Unreleased

### Added

- Repository scaffold: data file, schema, README generator, validation, CI and contribution guidelines.
- Sample entries for checking the pipeline: Natural Earth, geoBoundaries and USGS Earthquake Feeds.
- First seed batch: 26 sources drawn from those running in OpenGeo production, ranked by usefulness. Every link and license was re-checked on 2026-11-22.
  - Natural hazards: NASA FIRMS, GDACS, NASA EONET, NOAA NHC GIS, NIFC Wildland Fire Open Data.
  - Weather and climate: National Weather Service API, MET Norway Weather API, Aviation Weather Center Data API.
  - Water and oceans: USGS Water Data APIs, NOAA NWPS API, NOAA Tides and Currents API, NOAA NDBC, Environment Agency Flood Monitoring API, EMODnet.
  - Elevation: GEBCO Gridded Bathymetry, USGS 3DEP.
  - Boundaries: Marine Regions, U.S. Census TIGERweb.
  - Imagery: NASA GIBS, Earth Search, Microsoft Planetary Computer, NOAA Emergency Response Imagery.
  - Air quality: OpenAQ.
  - Transport: Mobility Database, Digitraffic.
  - Maritime: AISStream.
- `Text` format value, for NDBC's plain-text observation files.
- Second batch: 7 global sources that fill empty or thin sections. Every link and license was re-checked on 2026-11-22.
  - Base maps: OpenStreetMap, Overture Maps.
  - Elevation: Copernicus DEM.
  - Land cover and biodiversity: ESA WorldCover, GBIF.
  - Population: Global Human Settlement Layer (GHSL).
  - Catalogs: Humanitarian Data Exchange (HDX).
