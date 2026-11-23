# Changelog

Additions, removals and structural changes, grouped by batch. Dates are UTC.

## Unreleased

### Added

- Website for searching, filtering and sorting the list, built from `data/sources.yml` and deployed to GitHub Pages. It uses no frameworks or dependencies and is styled to match OpenGeo.
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
- Third batch: 7 global and U.S. sources. Every link and license was re-checked on 2026-11-23.
  - Buildings and infrastructure: Google Open Buildings, U.S. Energy Atlas.
  - Population: WorldPop, U.S. Census Data API.
  - Weather and climate: ERA5.
  - Natural hazards: FEMA National Flood Hazard Layer.
  - Space: CelesTrak.
- `GRIB` format value, for GRIB edition 1 data such as ERA5.
- Fourth batch: 7 ADS-B, AIS and aviation reference sources. Every link and license was re-checked on 2026-11-23.
  - Live aircraft tracking: adsb.lol, adsb.fi Open Data API, airplanes.live API.
  - Aviation reference: FAA Releasable Aircraft Database, OurAirports.
  - Vessel tracking: MarineCadastre AIS Vessel Traffic, Global Fishing Watch API.
- Conflict and Security section, with 5 global sources: UCDP Georeferenced Event Dataset, ACLED, GDELT Project, VIEWS Conflict Forecasts and GeoConfirmed. Every link and license was re-checked on 2026-11-23.
- Sixth batch: 10 global and U.S. sources that fill thin sections. Every link and license was re-checked on 2026-11-23.
  - Imagery: NOAA GOES on AWS, Copernicus Data Space Ecosystem.
  - Land cover: Dynamic World, Annual NLCD, USDA Cropland Data Layer.
  - Air quality: EPA AirNow API, Copernicus Atmosphere Monitoring Service (CAMS).
  - Transport: National Transportation Atlas Database (NTAD).
  - Weather and climate: GHCN-Daily.
  - Natural hazards: U.S. Drought Monitor.
- `JPEG 2000` format value, for Sentinel-2 SAFE products.
- Seventh batch: 8 global and U.S. runners-up. Every link and license was re-checked on 2026-11-23.
  - Air quality: NASA TEMPO.
  - Weather: NOAA Storm Prediction Center GIS Data.
  - Transport: Transitland.
  - Land cover and biodiversity: USFWS National Wetlands Inventory.
  - Population: CDC PLACES.
  - Space: Launch Library 2.
  - Conflict and security (displacement): UNHCR Refugee Statistics API, IOM Displacement Tracking Matrix API.

### Changed

- EMODnet notes now mention its AIS-derived vessel density maps.
- Conflict and Security section description now includes displacement figures.
