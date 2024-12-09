import { findFromCityStateProvince } from 'city-timezones';
import moment from 'moment-timezone';

type TTimeZoneByLocation = {
  city: string;
  country?: string;
};
export function getCurrentTimeByLocation({ city }: TTimeZoneByLocation) {
  console.log(city);
  const cityInfo = findFromCityStateProvince(city);

  if (!cityInfo || !cityInfo.length) {
    throw new Error(`Invalid location: ${city}`);
  }

  const timezone = cityInfo[0].timezone;

  if (!moment.tz.zone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }

  return timezone;
}
