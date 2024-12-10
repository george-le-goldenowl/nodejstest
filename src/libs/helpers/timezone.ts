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
    console.log(`Invalid location: ${city}`);
    return;
  }

  const timezone = cityInfo[0].timezone;

  if (!moment.tz.zone(timezone)) {
    console.log(`Invalid timezone: ${timezone}`);
    return;
  }

  return timezone;
}
