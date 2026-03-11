'use client';

import React, { JSX, useEffect, useMemo, useState } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Zap } from 'lucide-react';

type LocationData = {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
};

type LocationFinderProps = ComponentProps & {
  params: { [key: string]: string };
};

type GeocodeResult = {
  lat: string;
  lon: string;
  display_name?: string;
};

type ReverseGeocodeResult = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

const parseNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildLocationLabel = (location: LocationData): string =>
  [location.city, location.region, location.country].filter(Boolean).join(', ');

const buildOpenStreetMapEmbedUrl = (lat: number, lon: number): string => {
  const delta = 0.35;
  const left = lon - delta;
  const right = lon + delta;
  const top = lat + delta;
  const bottom = lat - delta;

  const bbox = `${left}%2C${bottom}%2C${right}%2C${top}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
};

const fetchIpLocation = async (): Promise<LocationData> => {
  const providers = [
    {
      url: 'https://ipapi.co/json/',
      map: (data: Record<string, unknown>) => ({
        city: String(data.city || ''),
        region: String(data.region || ''),
        country: String(data.country_name || ''),
        latitude: parseNumber(data.latitude),
        longitude: parseNumber(data.longitude),
      }),
    },
    {
      url: 'https://ipwho.is/',
      map: (data: Record<string, unknown>) => ({
        city: String(data.city || ''),
        region: String(data.region || ''),
        country: String(data.country || ''),
        latitude: parseNumber(data.latitude),
        longitude: parseNumber(data.longitude),
      }),
    },
  ];

  for (const provider of providers) {
    try {
      const response = await fetch(provider.url, { cache: 'no-store' });
      if (!response.ok) continue;
      const data = (await response.json()) as Record<string, unknown>;
      const mapped = provider.map(data);
      if (mapped.latitude === null || mapped.longitude === null) continue;

      return {
        city: mapped.city,
        region: mapped.region,
        country: mapped.country,
        latitude: mapped.latitude,
        longitude: mapped.longitude,
      };
    } catch {
      // Try next provider.
    }
  }

  throw new Error('Unable to resolve location from IP');
};

const geocodeManualLocation = async (query: string): Promise<LocationData> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error('Unable to geocode location');
  }

  const payload = (await response.json()) as GeocodeResult[];
  const firstResult = payload[0];

  if (!firstResult) {
    throw new Error('No location match found');
  }

  const latitude = parseNumber(firstResult.lat);
  const longitude = parseNumber(firstResult.lon);
  if (latitude === null || longitude === null) {
    throw new Error('Invalid geocode coordinates');
  }

  const parts = (firstResult.display_name || '').split(',').map((part) => part.trim());

  return {
    city: parts[0] || '',
    region: parts[1] || '',
    country: parts[parts.length - 1] || '',
    latitude,
    longitude,
  };
};

const reverseGeocodeLocation = async (lat: number, lon: number): Promise<Partial<LocationData>> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    return {};
  }

  const payload = (await response.json()) as ReverseGeocodeResult;
  const address = payload.address;

  if (!address) {
    return {};
  }

  return {
    city: address.city || address.town || address.village || address.county || '',
    region: address.state || '',
    country: address.country || '',
  };
};

export const Default = ({ params }: LocationFinderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = params;
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState('');
  const [manualState, setManualState] = useState('');
  const [manualPostalCode, setManualPostalCode] = useState('');
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [isUsingBrowserLocation, setIsUsingBrowserLocation] = useState(false);
  const [browserLocationError, setBrowserLocationError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const resolveLocation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchIpLocation();
        if (isMounted) {
          setLocation(result);
        }
      } catch {
        if (isMounted) {
          setError('We could not detect your location right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    resolveLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const mapUrl = useMemo(() => {
    if (!location) return '';
    return buildOpenStreetMapEmbedUrl(location.latitude, location.longitude);
  }, [location]);

  const handleManualLocationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = [manualCity, manualState, manualPostalCode, 'United States']
      .map((part) => part.trim())
      .filter(Boolean)
      .join(', ');

    if (!query) {
      setManualError('Enter a city, state, or ZIP code.');
      return;
    }

    setIsManualSubmitting(true);
    setManualError(null);

    try {
      const result = await geocodeManualLocation(query);
      setLocation(result);
      setError(null);
    } catch {
      setManualError('We could not find that location. Try a nearby city or ZIP code.');
    } finally {
      setIsManualSubmitting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setBrowserLocationError('Browser location is not available on this device.');
      return;
    }

    setIsUsingBrowserLocation(true);
    setBrowserLocationError(null);
    setManualError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const locationDetails = await reverseGeocodeLocation(latitude, longitude);

          setLocation({
            city: locationDetails.city || '',
            region: locationDetails.region || '',
            country: locationDetails.country || '',
            latitude,
            longitude,
          });
          setError(null);
        } catch {
          setBrowserLocationError('We found your coordinates, but could not resolve area details.');
          setLocation({
            city: '',
            region: '',
            country: '',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } finally {
          setIsUsingBrowserLocation(false);
        }
      },
      () => {
        setBrowserLocationError('Location access was denied or unavailable.');
        setIsUsingBrowserLocation(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <section className={`component location-finder py-10 lg:py-14 ${styles || ''}`} id={id}>
      <div className="w-full px-4 lg:px-8">
        <div className="w-full rounded-2xl border border-[#d9e5cb] bg-white p-6 shadow-sm lg:p-8">
          <h2 className="text-center text-3xl font-extrabold text-[#0d2f5f] md:text-4xl">
            Find Battery Services Near You
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div>
              {isLoading && (
                <p className="text-base text-foreground">Detecting your location...</p>
              )}

              {!isLoading && error && <p className="text-base text-[#b3261e]">{error}</p>}

              {!isLoading && !error && location && (
                <p className="text-lg text-foreground">
                  Showing service area near <strong>{buildLocationLabel(location)}</strong>
                </p>
              )}

              {location && (
                <div className="mt-4 overflow-hidden rounded-xl border border-[#d9e5cb]">
                  <iframe
                    title="Detected location map"
                    src={mapUrl}
                    className="h-[360px] w-full lg:h-[420px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-[#d9e5cb] bg-[#f8fbf4] p-4 lg:p-5">
                <h3 className="text-lg font-bold text-[#0d2f5f]">Set Location Manually</h3>
                <p className="mt-1 text-sm text-foreground">Enter city/state or ZIP code.</p>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isUsingBrowserLocation}
                  className="mt-3 h-11 w-full rounded-md border border-[#79be43] bg-white px-3 text-sm font-semibold text-[#0d2f5f] hover:bg-[#f3f9ec] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUsingBrowserLocation ? 'Getting your location...' : 'Use My Current Location'}
                </button>

                <form className="mt-4 grid gap-3" onSubmit={handleManualLocationSubmit}>
                  <input
                    type="text"
                    value={manualCity}
                    onChange={(event) => setManualCity(event.target.value)}
                    placeholder="City"
                    className="h-11 rounded-md border border-[#cfe0bf] bg-white px-3 text-sm outline-none focus:border-[#79be43]"
                  />
                  <input
                    type="text"
                    value={manualState}
                    onChange={(event) => setManualState(event.target.value)}
                    placeholder="State"
                    className="h-11 rounded-md border border-[#cfe0bf] bg-white px-3 text-sm outline-none focus:border-[#79be43]"
                  />
                  <input
                    type="text"
                    value={manualPostalCode}
                    onChange={(event) => setManualPostalCode(event.target.value)}
                    placeholder="ZIP Code"
                    className="h-11 rounded-md border border-[#cfe0bf] bg-white px-3 text-sm outline-none focus:border-[#79be43]"
                  />

                  <button
                    type="submit"
                    disabled={isManualSubmitting}
                    className="main-btn mt-1 !w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isManualSubmitting ? 'Updating map...' : 'Update Location'}
                  </button>
                </form>

                {manualError && <p className="mt-3 text-sm text-[#b3261e]">{manualError}</p>}
                {browserLocationError && (
                  <p className="mt-2 text-sm text-[#b3261e]">{browserLocationError}</p>
                )}
              </div>

              <div className="rounded-xl border border-[#d9e5cb] bg-[#f8fbf4] p-4 lg:p-5">
                <h4 className="text-base font-extrabold text-[#0d2f5f]">
                  When should you replace your battery?
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5a31]" />
                    <span>Most car batteries should be tested yearly after year 3.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5a31]" />
                    <span>Replace sooner in extreme heat or cold climates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5a31]" />
                    <span>Watch for slow starts, dim lights, or warning indicators.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5a31]" />
                    <span>Plan replacement around 3 to 5 years for reliable performance.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
