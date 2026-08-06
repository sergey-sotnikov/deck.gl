import {Deck, MapView} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';
import {HeatmapLayer, ScreenGridLayer} from '@deck.gl/aggregation-layers';
import DATA from './points.json';

const mk = (id, viewState, layer) =>
  new Deck({parent: document.getElementById(id), views: new MapView({}), viewState, debug: true, layers: [layer]});

// control: a normal layer that renders on any GPU incl. Adreno.
mk('ctrl', {longitude: -122.44, latitude: 37.75, zoom: 11.5, pitch: 30},
  new ScatterplotLayer({data: DATA, getPosition: d => d.COORDINATES, getRadius: 40, radiusUnits: 'meters', getFillColor: [220, 40, 40], opacity: 0.7}));

// configs from deck test/render/test-cases (heatmap-layer.js, screen-grid-layer.js)
mk('heat', {longitude: -122.44, latitude: 37.75, zoom: 11.5, pitch: 30},
  new HeatmapLayer({data: DATA, getPosition: d => d.COORDINATES, getWeight: d => d.SPACES, radiusPixels: 35, threshold: 0.1, opacity: 0.8}));

mk('grid-gpu', {longitude: -122.4269, latitude: 37.7515, zoom: 11.5},
  new ScreenGridLayer({data: DATA, getPosition: d => d.COORDINATES, cellSizePixels: 40, opacity: 0.8}));

mk('grid-cpu', {longitude: -122.4269, latitude: 37.7515, zoom: 11.5},
  new ScreenGridLayer({data: DATA, getPosition: d => d.COORDINATES, cellSizePixels: 40, opacity: 0.8, gpuAggregation: false}));
