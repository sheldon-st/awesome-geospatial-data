# Awesome Geospatial Data [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> Publicly accessible geospatial datasets, APIs and live feeds, each tagged with coverage, access method, format and license.

Every entry is free to use, though some need a free key. Each one can be fetched by a program through a download, an API, a web service or a stream, not only viewed in a map. Maintainers check entries by hand and record when they were last verified. See the [inclusion criteria](contributing.md#inclusion-criteria).

Many of these sources also power [OpenGeo](https://opengeo.space), a web-based map for exploring live and reference geospatial data. Try it if you'd like to see them side by side. This list is maintained independently of the data publishers. Being listed is not an endorsement, and each source's own terms apply.

Each entry ends with tags in this order:

- Coverage: `Global`, a continent, or an ISO 3166 country or subdivision code.
- `⚡` means the data updates at least hourly.
- `🔑` means a free key or account is required.
- How to access the data, its formats, and its license.
- `⚠️` means the license is restricted or unclear, so check the terms before reuse.

## Contents

- [Base Maps and Reference](#base-maps-and-reference)
- [Boundaries and Administrative Units](#boundaries-and-administrative-units)
- [Imagery and Earth Observation](#imagery-and-earth-observation)
- [Elevation and Bathymetry](#elevation-and-bathymetry)
- [Air Quality and Environment](#air-quality-and-environment)
- [Weather and Climate](#weather-and-climate)
- [Natural Hazards](#natural-hazards)
- [Water and Oceans](#water-and-oceans)
- [Transport and Mobility](#transport-and-mobility)
- [Aviation, Maritime and Space](#aviation-maritime-and-space)

## Base Maps and Reference

General-purpose map layers such as roads, places, land, water and cultural features.

- [Natural Earth](https://www.naturalearthdata.com/) - Global cultural, physical and raster base map layers at 1:10m, 1:50m and 1:110m scales. (`Global` `Download` `Shapefile` `GeoPackage` `Public domain`)

## Boundaries and Administrative Units

Country, subnational, statistical and maritime boundaries.

- [geoBoundaries](https://www.geoboundaries.org/) - Open administrative boundaries for every country, from national borders down to local units where available. (`Global` `API` `Download` `GeoJSON` `Shapefile` `TopoJSON` `Varies by boundary`)
- [Marine Regions](https://www.marineregions.org/) - Reference maritime boundaries, including exclusive economic zones, territorial seas, and named oceans and seas. (`Global` `WMS` `WFS` `Download` `API` `Shapefile` `GeoPackage` `CC BY 4.0`)
- [U.S. Census TIGERweb](https://tigerweb.geo.census.gov/tigerwebmain/TIGERweb_main.html) - Current and vintage U.S. census geography, from states and counties down to tracts and blocks, as map and feature services. (`USA` `WMS` `ArcGIS REST` `GeoJSON` `JSON` `PNG` `Public domain`)

## Imagery and Earth Observation

Satellite, aerial and weather-satellite imagery, plus the catalogs that serve them.

- [Earth Search](https://element84.com/earth-search/) - Public STAC API for cloud-optimized Sentinel-2, Landsat, Sentinel-1 and Copernicus DEM data hosted on AWS. (`Global` `STAC` `Bulk cloud` `COG` `Varies by collection`)
- [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/catalog) - Petabyte-scale STAC catalog of Earth observation data, including Landsat, Sentinel, NAIP aerial imagery and land cover. (`Global` `STAC` `API` `Tiles` `COG` `Zarr` `GeoParquet` `NetCDF` `Varies by collection`)
- [NASA Global Imagery Browse Services (GIBS)](https://nasa-gibs.github.io/gibs-api-docs/) - More than 1,000 global satellite imagery layers from MODIS, VIIRS and other instruments, served as map tiles. (`Global` `WMTS` `WMS` `Tiles` `PNG` `JPEG` `Public domain`)
- [NOAA Emergency Response Imagery](https://storms.ngs.noaa.gov/) - High-resolution aerial imagery flown after U.S. hurricanes and other disasters, often within days of the event. (`USA` `Tiles` `Download` `JPEG` `GeoTIFF` `Public domain`)

## Elevation and Bathymetry

Terrain models, hillshades, lidar and seafloor depth.

- [GEBCO Gridded Bathymetry](https://www.gebco.net/data-products/gridded-bathymetry-data) - Global terrain model of ocean depth and land elevation on a 15 arc-second grid, released annually. (`Global` `Download` `WMS` `NetCDF` `GeoTIFF` `Public domain`)
- [USGS 3D Elevation Program (3DEP)](https://www.usgs.gov/3d-elevation-program) - Lidar point clouds and bare-earth elevation models for the United States, from 1 meter to 1 arc-second resolution. (`USA` `Download` `WMS` `ArcGIS REST` `Bulk cloud` `GeoTIFF` `LAZ` `Public domain`)

## Air Quality and Environment

Air pollution observations and other environmental monitoring.

- [OpenAQ](https://docs.openaq.org/) - Air quality measurements from government monitors and research sensors worldwide, harmonized into one API. (`Global` `⚡` `🔑` `API` `Bulk cloud` `JSON` `CSV` `Varies by provider` `⚠️`)

## Weather and Climate

Observations, forecasts, warnings and climate reanalysis.

- [Aviation Weather Center Data API](https://aviationweather.gov/data/api/) - Worldwide METAR and TAF reports plus SIGMETs, AIRMETs, pilot reports and other aviation advisories. (`Global` `⚡` `API` `JSON` `GeoJSON` `XML` `CSV` `Public domain`)
- [MET Norway Weather API](https://api.met.no/) - Global point forecasts, Nordic nowcasts and official Norwegian weather warnings from the Norwegian Meteorological Institute. (`Global` `⚡` `API` `CAP` `GeoJSON` `JSON` `XML` `CC BY 4.0 / NLOD 2.0`)
- [National Weather Service API](https://www.weather.gov/documentation/services-web-api) - U.S. point and gridded forecasts, station observations, and active watches and warnings with their polygons. (`USA` `⚡` `API` `CAP` `GeoJSON` `JSON` `XML` `Public domain`)

## Natural Hazards

Earthquakes, wildfires, tropical cyclones, floods and multi-hazard alerting.

- [Global Disaster Alert and Coordination System (GDACS)](https://www.gdacs.org/) - Automated alerts and impact estimates for earthquakes, tropical cyclones, floods, volcanoes, droughts and wildfires worldwide. (`Global` `⚡` `API` `CAP` `GeoJSON` `XML` `No reuse license stated` `⚠️`)
- [NASA Earth Observatory Natural Event Tracker (EONET)](https://eonet.gsfc.nasa.gov/docs/v3) - Curated natural events such as wildfires, severe storms, volcanoes and sea ice, linked to their source imagery. (`Global` `API` `GeoJSON` `JSON` `Public domain`)
- [NASA FIRMS Active Fire Data](https://firms.modaps.eosdis.nasa.gov/active_fire/) - Global satellite thermal hotspot detections from MODIS and VIIRS, published within hours of each overpass. (`Global` `⚡` `Download` `CSV` `Shapefile` `KML` `Public domain`)
- [NIFC Wildland Fire Open Data](https://data-nifc.opendata.arcgis.com/) - Current U.S. wildfire incident locations and perimeters from interagency fire reporting, plus historical perimeters. (`USA` `⚡` `ArcGIS REST` `Download` `GeoJSON` `CSV` `Shapefile` `KML` `Public domain`)
- [NOAA National Hurricane Center GIS Data](https://www.nhc.noaa.gov/gis/) - Active tropical cyclone positions, forecast cones, tracks, wind fields and storm surge for the Atlantic and eastern Pacific. (`Americas` `Download` `API` `ArcGIS REST` `Shapefile` `KML` `JSON` `Public domain`)
- [USGS Earthquake Feeds](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) - Worldwide earthquake events with magnitudes and revisions, refreshed every minute. (`Global` `⚡` `API` `GeoJSON` `CSV` `KML` `QuakeML` `Public domain`)

## Water and Oceans

River gauges, tides, buoys, hydrography and marine data.

- [EMODnet](https://emodnet.ec.europa.eu/en) - European marine data portals for bathymetry, geology, seabed habitats, chemistry, biology, physics and human activities. (`Europe` `WMS` `WFS` `Download` `CSV` `GeoTIFF` `NetCDF` `Shapefile` `CC BY 4.0`)
- [Environment Agency Flood Monitoring API](https://environment.data.gov.uk/flood-monitoring/doc/reference) - Near real-time river, sea and groundwater levels, rainfall and flood warnings for England, updated every 15 minutes. (`GB-ENG` `⚡` `API` `JSON` `CSV` `OGL 3.0`)
- [NOAA National Data Buoy Center](https://www.ndbc.noaa.gov/) - Latest observations from moored buoys and coastal stations worldwide, including waves, wind, pressure and water temperature. (`Global` `⚡` `Download` `Text` `KML` `NetCDF` `Public domain`)
- [NOAA National Water Prediction Service API](https://api.water.noaa.gov/nwps/v1/docs/) - Observed and forecast stage and flow for U.S. river gauges, with flood categories and thresholds. (`USA` `⚡` `API` `Download` `JSON` `CSV` `Public domain`)
- [NOAA Tides and Currents API](https://api.tidesandcurrents.noaa.gov/api/prod/) - Water levels, tide predictions, currents and meteorological data from U.S. coastal and Great Lakes stations. (`USA` `⚡` `API` `JSON` `CSV` `XML` `Public domain`)
- [USGS Water Data APIs](https://api.waterdata.usgs.gov/) - Streamflow, water level and water quality from U.S. monitoring locations, including latest continuous readings, via OGC API. (`USA` `⚡` `OGC API` `API` `GeoJSON` `JSON` `CSV` `Public domain`)

## Transport and Mobility

Public transit, shared mobility, roads and traffic.

- [Digitraffic](https://www.digitraffic.fi/en/) - Real-time Finnish road, rail and marine traffic data, including AIS vessel positions, train locations and road weather. (`FIN` `⚡` `API` `Stream` `JSON` `GeoJSON` `CC BY 4.0`)
- [Mobility Database](https://mobilitydatabase.org/) - Catalog of thousands of GTFS, GTFS Realtime and GBFS feeds worldwide, with validation reports and download links. (`Global` `API` `Download` `GTFS` `GTFS-RT` `GBFS` `CSV` `JSON` `Protobuf` `CC0 (catalog), feeds vary`)

## Aviation, Maritime and Space

Aircraft and vessel tracking, launches, satellites and ground stations.

- [AISStream](https://aisstream.io/) - Free WebSocket stream of global AIS vessel positions and static ship data, filterable by bounding box. (`Global` `⚡` `🔑` `Stream` `JSON` `No reuse license stated` `⚠️`)

## Related Lists

- [awesome-gis](https://github.com/sshuair/awesome-gis) - GIS software, libraries, learning resources and data sources.
- [awesome-public-datasets](https://github.com/awesomedata/awesome-public-datasets) - Public datasets across many topics, including geospatial.
- [awesome-satellite-imagery-datasets](https://github.com/chrieke/awesome-satellite-imagery-datasets) - Annotated satellite imagery datasets for computer vision.
- [awesome-earthobservation-code](https://github.com/acgeospatial/awesome-earthobservation-code) - Tools, tutorials and code for working with Earth observation data.
- [awesome-geojson](https://github.com/tmcw/awesome-geojson) - Utilities and libraries for working with GeoJSON.

## Contributing

Suggestions are welcome. Read the [contribution guidelines](contributing.md) first. This README is generated from [`data/sources.yml`](data/sources.yml), so edit that file rather than this one.
